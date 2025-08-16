# n8n Workflow for Chatbot Integration

## Workflow Overview
This n8n workflow receives webhook calls from Hasura Actions, validates permissions, calls OpenRouter API, and saves responses back to Hasura.

## Workflow Steps:

### 1. Webhook Trigger
- **Node Type**: Webhook
- **HTTP Method**: POST
- **Path**: `/webhook/chatbot`
- **Authentication**: None (handled by Hasura)

**Expected Input:**
```json
{
  "chatId": "uuid",
  "message": "user message",
  "userId": "uuid",
  "userRole": "user"
}
```

### 2. Validate User Permissions
- **Node Type**: Function
- **Purpose**: Verify that the user owns the chat_id

**JavaScript Code:**
```javascript
// Validate that user owns the chat
const chatId = $input.first().json.chatId;
const userId = $input.first().json.userId;

// This validation will be done via GraphQL query to Hasura
return [{
  json: {
    chatId,
    userId,
    message: $input.first().json.message,
    isValid: true // Will be set based on GraphQL response
  }
}];
```

### 3. Check Chat Ownership
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `https://your-subdomain.hasura.your-region.nhost.run/v1/graphql`
- **Headers**:
  - `Content-Type: application/json`
  - `x-hasura-admin-secret: {{ $credentials.hasuraAdminSecret }}`

**GraphQL Query:**
```json
{
  "query": "query CheckChatOwnership($chatId: uuid!, $userId: uuid!) { chats(where: {id: {_eq: $chatId}, user_id: {_eq: $userId}}) { id } }",
  "variables": {
    "chatId": "{{ $json.chatId }}",
    "userId": "{{ $json.userId }}"
  }
}
```

### 4. Permission Check Function
- **Node Type**: Function
- **Purpose**: Verify the GraphQL response

**JavaScript Code:**
```javascript
const response = $input.first().json;
const chats = response.data?.chats || [];

if (chats.length === 0) {
  throw new Error('Unauthorized: User does not own this chat');
}

return [{
  json: {
    chatId: $('Webhook').first().json.chatId,
    message: $('Webhook').first().json.message,
    userId: $('Webhook').first().json.userId,
    authorized: true
  }
}];
```

### 5. Call OpenRouter API
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `https://openrouter.ai/api/v1/chat/completions`
- **Headers**:
  - `Authorization: Bearer {{ $credentials.openrouterApiKey }}`
  - `Content-Type: application/json`

**Request Body:**
```json
{
  "model": "mistralai/mistral-7b-instruct:free",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful AI assistant. Provide clear, concise, and helpful responses."
    },
    {
      "role": "user",
      "content": "{{ $json.message }}"
    }
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

### 6. Process OpenRouter Response
- **Node Type**: Function
- **Purpose**: Extract the assistant's response

**JavaScript Code:**
```javascript
const response = $input.first().json;
const assistantMessage = response.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

return [{
  json: {
    chatId: $('Permission Check Function').first().json.chatId,
    userId: $('Permission Check Function').first().json.userId,
    assistantMessage: assistantMessage
  }
}];
```

### 7. Save Response to Database
- **Node Type**: HTTP Request
- **Method**: POST
- **URL**: `https://your-subdomain.hasura.your-region.nhost.run/v1/graphql`
- **Headers**:
  - `Content-Type: application/json`
  - `x-hasura-admin-secret: {{ $credentials.hasuraAdminSecret }}`

**GraphQL Mutation:**
```json
{
  "query": "mutation InsertAssistantMessage($chatId: uuid!, $userId: uuid!, $content: String!) { insert_messages_one(object: {chat_id: $chatId, user_id: $userId, content: $content, role: \"assistant\"}) { id } }",
  "variables": {
    "chatId": "{{ $json.chatId }}",
    "userId": "{{ $json.userId }}",
    "content": "{{ $json.assistantMessage }}"
  }
}
```

### 8. Return Response
- **Node Type**: Function
- **Purpose**: Format the final response for Hasura Action

**JavaScript Code:**
```javascript
const assistantMessage = $('Process OpenRouter Response').first().json.assistantMessage;
const saveResult = $input.first().json;

// Check if message was saved successfully
const success = saveResult.data?.insert_messages_one?.id ? true : false;

return [{
  json: {
    response: assistantMessage,
    success: success,
    error: success ? null : 'Failed to save message to database'
  }
}];
```

## Error Handling

### Global Error Handler
- **Node Type**: Function
- **Purpose**: Handle any errors in the workflow

**JavaScript Code:**
```javascript
return [{
  json: {
    response: null,
    success: false,
    error: $input.first().error?.message || 'An unknown error occurred'
  }
}];
```

## Required Credentials

### 1. OpenRouter API Key
- **Name**: `openrouterApiKey`
- **Type**: Header Auth
- **Value**: Your OpenRouter API key

### 2. Hasura Admin Secret
- **Name**: `hasuraAdminSecret`
- **Type**: Header Auth
- **Value**: Your Hasura admin secret

## Workflow Settings
- **Error Workflow**: Enable global error handling
- **Timezone**: UTC
- **Save Data on Error**: Yes
- **Save Data on Success**: Yes

## Testing the Workflow

You can test the workflow with this sample payload:
```json
{
  "chatId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Hello, how are you?",
  "userId": "987fcdeb-51d2-43a1-b234-567890123456",
  "userRole": "user"
}
```

## Security Considerations

1. The workflow validates chat ownership before processing
2. Uses admin credentials for database operations
3. OpenRouter API key is stored securely in n8n credentials
4. All database operations use parameterized queries to prevent injection attacks
