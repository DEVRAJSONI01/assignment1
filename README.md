# Chatbot Application

A full-stack chatbot application built with React, Nhost (Authentication + Database), Hasura GraphQL, and n8n integration with OpenRouter AI.

## 🚀 Features

- **Email Authentication**: Sign up/Sign in with Nhost Auth
- **Real-time Chat**: GraphQL subscriptions for live message updates
- **Multiple Chats**: Create and manage multiple chat conversations
- **AI Chatbot**: Powered by OpenRouter with free AI models
- **Secure Architecture**: Row-level security and proper permissions
- **GraphQL Only**: All frontend-backend communication via GraphQL

## 🏗️ Architecture

```
Frontend (React + Apollo) 
    ↓ GraphQL Queries/Mutations/Subscriptions
Hasura GraphQL Engine
    ↓ Hasura Actions (sendMessage)
n8n Workflow
    ↓ HTTP Request
OpenRouter API (AI Models)
    ↓ Response Processing
PostgreSQL Database (via Hasura)
```

## 📋 Prerequisites

1. **Nhost Account**: Sign up at [nhost.io](https://nhost.io)
2. **n8n Instance**: Either self-hosted or cloud instance
3. **OpenRouter Account**: Get free API key at [openrouter.ai](https://openrouter.ai)

## 🛠️ Setup Instructions

### Step 1: Nhost Project Setup

1. Create a new Nhost project
2. Note your subdomain and region
3. In Nhost Dashboard → Database, run the SQL from `hasura/schema.sql`
4. Set up Hasura permissions as described in `hasura/permissions.md`
5. Create Hasura Action as described in `hasura/actions.md`

### Step 2: Environment Configuration

1. Copy `.env.example` to `.env`
2. Update the values:
   ```env
   VITE_NHOST_SUBDOMAIN=your-actual-subdomain
   VITE_NHOST_REGION=your-actual-region
   ```

### Step 3: n8n Workflow Setup

1. Import the workflow configuration from `n8n/workflow.md`
2. Set up credentials:
   - OpenRouter API Key
   - Hasura Admin Secret
3. Update webhook URL in Hasura Action
4. Test the workflow

### Step 4: Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📊 Database Schema

### Chats Table
```sql
- id (UUID, Primary Key)
- title (TEXT)
- user_id (UUID, Foreign Key)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Messages Table
```sql
- id (UUID, Primary Key)
- chat_id (UUID, Foreign Key)
- user_id (UUID, Foreign Key)
- content (TEXT)
- role (TEXT: 'user' | 'assistant')
- created_at (TIMESTAMPTZ)
```

## 🔐 Security Features

### Row-Level Security (RLS)
- Users can only access their own chats and messages
- All operations filtered by user_id

### Hasura Permissions
- **Chats**: CRUD operations restricted to chat owners
- **Messages**: Insert/Select restricted to authorized users
- **Actions**: sendMessage action requires authentication

### n8n Security
- Chat ownership validation before processing
- Secure credential storage
- Admin-level database access for bot responses

## 🎯 API Endpoints

### GraphQL Queries
```graphql
# Get user's chats
query GetChats {
  chats(order_by: { updated_at: desc }) {
    id
    title
    created_at
    updated_at
  }
}

# Get messages for a chat
query GetMessages($chatId: uuid!) {
  messages(where: { chat_id: { _eq: $chatId } }) {
    id
    content
    role
    created_at
  }
}
```

### GraphQL Mutations
```graphql
# Create new chat
mutation CreateChat($title: String!) {
  insert_chats_one(object: { title: $title }) {
    id
    title
  }
}

# Send message (triggers chatbot)
mutation SendMessage($chatId: uuid!, $message: String!) {
  sendMessage(chatId: $chatId, message: $message) {
    response
    success
    error
  }
}
```

### GraphQL Subscriptions
```graphql
# Real-time message updates
subscription MessagesSubscription($chatId: uuid!) {
  messages(where: { chat_id: { _eq: $chatId } }) {
    id
    content
    role
    created_at
  }
}
```

## 🧪 Testing

### Manual Testing
1. Sign up with a new email
2. Create a new chat
3. Send a message
4. Verify bot response appears
5. Test real-time updates in multiple tabs

### n8n Workflow Testing
Use the test payload in `n8n/workflow.md` to test the workflow independently.

## 🚀 Deployment

### Frontend (Vite)
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Backend
- Nhost handles the backend infrastructure
- n8n workflow needs to be deployed to your n8n instance

## 🐛 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Nhost subdomain/region in .env
   - Verify Nhost project is active

2. **Messages not sending**
   - Check n8n webhook URL in Hasura Action
   - Verify n8n workflow is active
   - Check OpenRouter API key

3. **Permissions errors**
   - Verify Hasura permissions are set correctly
   - Check user role is 'user'

4. **Real-time updates not working**
   - Check GraphQL subscriptions are enabled in Hasura
   - Verify WebSocket connection

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Page components
│   │   ├── AuthPage.tsx    # Login/Register page
│   │   └── ChatPage.tsx    # Main chat interface
│   ├── graphql/            # GraphQL queries/mutations
│   │   └── queries.ts      # All GraphQL operations
│   ├── utils/              # Utility functions
│   │   └── nhost.ts        # Nhost client configuration
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── hasura/                 # Hasura configuration
│   ├── schema.sql          # Database schema
│   ├── permissions.md      # Permission configuration
│   └── actions.md          # Action definitions
├── n8n/                    # n8n workflow
│   └── workflow.md         # Complete workflow setup
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check this README thoroughly
2. Review the troubleshooting section
3. Check Nhost/Hasura/n8n documentation
4. Open an issue in the repository

---

**Note**: This application is designed for development and learning purposes. For production use, consider additional security measures, error handling, and monitoring.
