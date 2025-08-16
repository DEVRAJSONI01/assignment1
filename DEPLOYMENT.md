# Deployment Guide

This guide will walk you through deploying your chatbot application step by step.

## Step 1: Nhost Setup

### 1.1 Create Nhost Project
1. Go to [nhost.io](https://nhost.io) and sign up/login
2. Click "Create Project"
3. Choose a project name and region
4. Wait for project initialization

### 1.2 Configure Database
1. In your Nhost dashboard, go to "Database"
2. Click on "SQL Editor"
3. Copy and paste the contents of `hasura/schema.sql`
4. Click "Run" to execute the SQL

### 1.3 Set Up Hasura Permissions
1. Go to "GraphQL" in your Nhost dashboard
2. Click on "Data" tab
3. Configure permissions for both `chats` and `messages` tables:

#### For `chats` table:
- Go to "Permissions" tab
- Add permissions for `user` role using the JSON from `hasura/permissions.md`

#### For `messages` table:
- Go to "Permissions" tab  
- Add permissions for `user` role using the JSON from `hasura/permissions.md`

### 1.4 Create Relationships
1. In the `chats` table, go to "Relationships"
2. Add array relationship: `messages` → `messages` table where `chats.id = messages.chat_id`
3. In the `messages` table, add object relationship: `chat` → `chats` table where `messages.chat_id = chats.id`

## Step 2: n8n Setup

### 2.1 Get n8n Instance
Choose one of these options:
- **n8n Cloud**: Sign up at [n8n.cloud](https://n8n.cloud)
- **Self-hosted**: Follow [n8n installation guide](https://docs.n8n.io/hosting/)
- **Local development**: `npx n8n`

### 2.2 Create Credentials
1. In n8n, go to "Credentials"
2. Create these credentials:

#### OpenRouter API Key:
- Type: "Header Auth"
- Name: `openrouterApiKey`
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_OPENROUTER_API_KEY`

#### Hasura Admin Secret:
- Type: "Header Auth"  
- Name: `hasuraAdminSecret`
- Header Name: `x-hasura-admin-secret`
- Header Value: `YOUR_HASURA_ADMIN_SECRET`

### 2.3 Create Workflow
1. Create a new workflow in n8n
2. Follow the complete workflow setup from `n8n/workflow.md`
3. Test the workflow with sample data
4. Activate the workflow
5. Copy the webhook URL

## Step 3: Hasura Action Setup

### 3.1 Create Action
1. In Nhost dashboard, go to "GraphQL" → "Actions"
2. Click "Create Action"
3. Use the configuration from `hasura/actions.md`:
   - **Action Name**: `sendMessage`
   - **GraphQL Type**: Copy from the file
   - **Handler URL**: Your n8n webhook URL
   - **Headers**: `Content-Type: application/json`

### 3.2 Set Action Permissions
1. In the action permissions tab
2. Set role `user` to have permission to execute the action

## Step 4: Frontend Configuration

### 4.1 Environment Variables
1. Copy `.env.example` to `.env`
2. Update with your Nhost project details:
```env
VITE_NHOST_SUBDOMAIN=your-nhost-subdomain
VITE_NHOST_REGION=your-nhost-region
```

### 4.2 Install and Run
```bash
npm install
npm run dev
```

## Step 5: Testing

### 5.1 Test Authentication
1. Open http://localhost:3000
2. Sign up with a new email
3. Verify email if required by Nhost
4. Login successfully

### 5.2 Test Chat Functionality
1. Create a new chat
2. Send a message
3. Verify bot responds
4. Test real-time updates by opening multiple tabs

### 5.3 Test n8n Workflow
1. Go to n8n workflow
2. Use "Execute Workflow" with test data
3. Verify all nodes execute successfully
4. Check database for inserted messages

## Step 6: Production Deployment

### 6.1 Frontend Deployment
Build and deploy to your preferred hosting:

```bash
npm run build
```

Popular options:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use GitHub Actions

### 6.2 Environment Variables (Production)
Update your hosting provider with production environment variables:
```
VITE_NHOST_SUBDOMAIN=your-production-subdomain
VITE_NHOST_REGION=your-production-region
```

### 6.3 n8n Production
- Ensure your n8n instance is accessible from Hasura
- Use environment variables for sensitive data
- Set up monitoring and logging

## Troubleshooting

### Common Issues and Solutions

#### Authentication Issues
- **Problem**: Can't sign up/login
- **Solution**: Check Nhost subdomain/region in .env
- **Check**: Nhost dashboard for authentication logs

#### Message Not Sending
- **Problem**: Messages sent but no bot response
- **Solution**: Check n8n workflow execution logs
- **Check**: OpenRouter API key validity
- **Check**: Hasura Action webhook URL

#### Permission Errors
- **Problem**: GraphQL permission denied
- **Solution**: Verify Hasura permissions are set correctly
- **Check**: User role is 'user' in database

#### Real-time Updates Not Working
- **Problem**: Messages don't appear in real-time
- **Solution**: Check GraphQL subscriptions are enabled
- **Check**: WebSocket connection in browser dev tools

### Debugging Steps

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify GraphQL requests are successful
3. **Check Nhost Logs**: Authentication and database errors
4. **Check n8n Execution Logs**: Workflow execution details
5. **Check Hasura Console**: GraphQL query testing

## Security Checklist

Before going to production:

- [ ] Change default Hasura admin secret
- [ ] Set up proper Nhost authentication rules
- [ ] Secure n8n instance (authentication, HTTPS)
- [ ] Validate all Hasura permissions
- [ ] Test with non-admin users
- [ ] Set up monitoring and logging
- [ ] Review OpenRouter API usage limits
- [ ] Enable HTTPS for all endpoints

## Monitoring

Set up monitoring for:
- Frontend application uptime
- Nhost database performance
- n8n workflow execution success rate
- OpenRouter API usage and costs
- Authentication success/failure rates

## Backup Strategy

- **Database**: Nhost handles automatic backups
- **n8n Workflows**: Export and version control
- **Frontend Code**: Use Git repository
- **Environment Variables**: Secure documentation

---

This completes the deployment setup for your chatbot application. The application should now be fully functional with authentication, real-time chat, and AI responses.
