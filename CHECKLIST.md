# Chatbot Application - Setup Checklist

Use this checklist to ensure you've completed all setup steps correctly.

## ✅ Prerequisites Setup

- [ ] Node.js (v16+) installed
- [ ] npm or yarn installed
- [ ] Nhost account created
- [ ] OpenRouter account created (free tier available)
- [ ] n8n instance accessible (cloud or self-hosted)

## ✅ Project Setup

- [ ] Project cloned/downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] Environment variables updated with your values

## ✅ Nhost Configuration

- [ ] New Nhost project created
- [ ] Project subdomain and region noted
- [ ] Database schema applied (`hasura/schema.sql`)
- [ ] Tables created successfully: `chats`, `messages`
- [ ] Table relationships configured
- [ ] Triggers and functions created

## ✅ Hasura Permissions

### Chats Table Permissions:
- [ ] User role SELECT permission set
- [ ] User role INSERT permission set  
- [ ] User role UPDATE permission set
- [ ] User role DELETE permission set
- [ ] All permissions use user_id filter

### Messages Table Permissions:
- [ ] User role SELECT permission set
- [ ] User role INSERT permission set
- [ ] User role UPDATE permission set
- [ ] User role DELETE permission set
- [ ] All permissions use user_id filter

## ✅ n8n Workflow Setup

- [ ] n8n instance accessible
- [ ] OpenRouter API key credential created
- [ ] Hasura admin secret credential created
- [ ] Webhook trigger node configured
- [ ] User permission validation node added
- [ ] Chat ownership check implemented
- [ ] OpenRouter API call configured
- [ ] Database save operation implemented
- [ ] Response formatting implemented
- [ ] Error handling configured
- [ ] Workflow tested and activated
- [ ] Webhook URL copied

## ✅ Hasura Action Configuration

- [ ] `sendMessage` action created
- [ ] GraphQL type definition added
- [ ] Handler webhook URL set (from n8n)
- [ ] Request transform configured
- [ ] Response transform configured
- [ ] User role permission granted
- [ ] Action tested in GraphQL console

## ✅ Frontend Testing

- [ ] Development server starts (`npm run dev`)
- [ ] Authentication page loads
- [ ] User registration works
- [ ] User login works
- [ ] Chat page accessible after login
- [ ] New chat creation works
- [ ] Message sending works
- [ ] Bot responses received
- [ ] Real-time updates work
- [ ] Multiple chats work
- [ ] Logout functionality works

## ✅ Integration Testing

- [ ] User message saves to database
- [ ] n8n workflow triggers correctly
- [ ] OpenRouter API responds
- [ ] Bot message saves to database
- [ ] Frontend receives bot response
- [ ] Real-time subscription updates UI
- [ ] Error handling works
- [ ] Permission validation prevents unauthorized access

## ✅ Production Readiness

- [ ] Frontend builds successfully (`npm run build`)
- [ ] Production environment variables set
- [ ] Hasura admin secret secured
- [ ] OpenRouter API key secured
- [ ] n8n instance secured
- [ ] SSL/HTTPS configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented

## 🔧 Troubleshooting Checklist

If something isn't working, check:

### Authentication Issues:
- [ ] Nhost subdomain/region correct in `.env`
- [ ] Nhost project active and accessible
- [ ] Browser allows cookies/local storage

### Message Sending Issues:
- [ ] n8n workflow is active
- [ ] Webhook URL correct in Hasura Action
- [ ] OpenRouter API key valid
- [ ] Hasura admin secret correct
- [ ] Chat ownership validation passes

### Permission Issues:
- [ ] Hasura permissions configured correctly
- [ ] User has correct role ('user')
- [ ] JWT token valid and not expired
- [ ] Database constraints not violated

### Real-time Issues:
- [ ] GraphQL subscriptions enabled in Hasura
- [ ] WebSocket connection established
- [ ] No network/firewall blocking WebSockets

## 📝 Notes

### Useful Commands:
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run setup script
./setup.sh

# Check dependencies
npm list

# Test n8n webhook
curl -X POST "your-webhook-url" -H "Content-Type: application/json" -d '{"test": true}'
```

### Important URLs:
- Frontend: http://localhost:3000
- Nhost Dashboard: https://app.nhost.io
- Hasura Console: https://your-subdomain.hasura.your-region.nhost.run/console
- n8n Instance: Your n8n URL
- OpenRouter Dashboard: https://openrouter.ai/keys

## 🎉 Success Criteria

Your application is successfully set up when:

1. ✅ Users can register and login
2. ✅ Users can create new chats
3. ✅ Users can send messages
4. ✅ Chatbot responds to messages
5. ✅ Real-time updates work
6. ✅ Users only see their own chats/messages
7. ✅ All security permissions work correctly

## 📞 Getting Help

If you're stuck:

1. Check the troubleshooting section above
2. Review the detailed documentation in README.md
3. Check the DEPLOYMENT.md guide
4. Look at browser console for errors
5. Check n8n execution logs
6. Verify Nhost dashboard for errors

---

**Remember**: This is a development setup. For production, implement additional security measures, monitoring, and error handling as outlined in the documentation.
