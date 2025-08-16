#!/bin/bash

echo "🚀 Chatbot Application Setup Script"
echo "=================================="

# Check if required tools are installed
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual Nhost credentials"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with Nhost credentials"
echo "2. Set up your Nhost database using hasura/schema.sql"
echo "3. Configure Hasura permissions (see hasura/permissions.md)"
echo "4. Set up n8n workflow (see n8n/workflow.md)"
echo "5. Create Hasura Action (see hasura/actions.md)"
echo "6. Run 'npm run dev' to start the development server"
echo ""
echo "📚 See README.md for detailed instructions"
