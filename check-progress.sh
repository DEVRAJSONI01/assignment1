#!/bin/bash

# Progress Tracker for Chatbot Setup
echo "📊 Chatbot Application Setup Progress"
echo "===================================="
echo ""

# Check .env file
echo "🔧 Environment Configuration:"
if [ -f .env ]; then
    if grep -q "your-nhost-subdomain" .env; then
        echo "❌ .env file needs Nhost configuration"
    else
        echo "✅ .env file configured"
    fi
else
    echo "❌ .env file missing"
fi

# Check if dev server is running
echo ""
echo "🖥️  Development Server:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server running (http://localhost:3000)"
else
    echo "❌ Development server not running (run: npm run dev)"
fi

# Check node_modules
echo ""
echo "📦 Dependencies:"
if [ -d node_modules ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies missing (run: npm install)"
fi

echo ""
echo "📋 Manual Setup Checklist:"
echo "□ Nhost project created"
echo "□ Database schema applied"
echo "□ Hasura permissions configured"
echo "□ OpenRouter API key obtained"
echo "□ n8n instance set up"
echo "□ n8n workflow imported"
echo "□ Hasura Action created"
echo ""

echo "🚀 Quick Actions:"
echo "• Run setup guide: ./setup-nhost.sh"
echo "• Open services: ./open-services.sh"
echo "• Check progress: ./check-progress.sh"
echo ""

echo "📚 Documentation:"
echo "• Complete guide: README.md"
echo "• Deployment steps: DEPLOYMENT.md"
echo "• Step-by-step: CHECKLIST.md"
echo "• OpenRouter setup: docs/openrouter-setup.md"
echo ""
