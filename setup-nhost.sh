#!/bin/bash

# Nhost Setup Script
# This script helps you set up your Nhost project step by step

echo "🚀 Chatbot Application - Nhost Setup Guide"
echo "==========================================="
echo ""

echo "📋 Prerequisites Check:"
echo "1. Do you have a Nhost account? (Sign up at https://nhost.io)"
echo "2. Have you created a new Nhost project?"
echo "3. Do you have your project subdomain and region?"
echo ""

echo "🔧 Step 1: Update Environment Variables"
echo "---------------------------------------"
echo "Please update your .env file with your Nhost project details:"
echo ""
echo "Current .env file:"
cat .env
echo ""
echo "You need to replace 'your-nhost-subdomain' and 'your-nhost-region' with your actual values."
echo ""
echo "Example:"
echo "VITE_NHOST_SUBDOMAIN=my-awesome-app"
echo "VITE_NHOST_REGION=us-east-1"
echo ""

echo "🗄️ Step 2: Database Schema"
echo "------------------------"
echo "1. Go to your Nhost dashboard"
echo "2. Navigate to 'Database' section"
echo "3. Open 'SQL Editor'"
echo "4. Copy and paste the content from hasura/schema.sql"
echo "5. Click 'Run' to execute"
echo ""
echo "Schema file location: ./hasura/schema.sql"
echo ""

echo "🔐 Step 3: Hasura Permissions"
echo "----------------------------"
echo "1. Go to 'GraphQL' in your Nhost dashboard"
echo "2. Click on 'Data' tab"
echo "3. Configure permissions using: ./hasura/permissions.md"
echo ""

echo "⚡ Step 4: Test Connection"
echo "------------------------"
echo "After updating .env, restart the dev server:"
echo "npm run dev"
echo ""

echo "📚 Need help? Check these files:"
echo "- README.md - Complete documentation"
echo "- DEPLOYMENT.md - Detailed setup guide"
echo "- CHECKLIST.md - Step-by-step checklist"
echo ""

echo "✅ Once Nhost is configured, we can proceed with n8n and OpenRouter setup!"
