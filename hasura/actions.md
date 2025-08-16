# Hasura Action: sendMessage

## GraphQL Definition:
```graphql
type Mutation {
  sendMessage(chatId: uuid!, message: String!): SendMessageOutput
}

type SendMessageOutput {
  response: String
  success: Boolean!
  error: String
}
```

## Handler Configuration:
- **Webhook URL**: `https://your-n8n-instance.com/webhook/chatbot`
- **Headers**: 
  - `Content-Type: application/json`
  - `x-hasura-admin-secret: your-admin-secret` (if needed)

## Permissions:
- **Role**: `user`
- **Permission**: Allow all users to execute this action

## Request Transform:
```json
{
  "chatId": "{{$body.input.chatId}}",
  "message": "{{$body.input.message}}",
  "userId": "{{$session_variables['x-hasura-user-id']}}",
  "userRole": "{{$session_variables['x-hasura-default-role']}}"
}
```

## Response Transform:
```json
{
  "response": "{{$body.response}}",
  "success": "{{$body.success}}",
  "error": "{{$body.error}}"
}
```

## Expected Payload from n8n:
```json
{
  "response": "The chatbot's response message",
  "success": true,
  "error": null
}
```

## Error Handling:
The action should handle errors gracefully and return:
```json
{
  "response": null,
  "success": false,
  "error": "Error message description"
}
```
