#!/bin/bash

echo "🚀 Opening Required Services for Setup..."
echo "========================================="

echo ""
echo "📊 Opening your local development server..."
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo "🔧 Opening Nhost Dashboard..."
if command -v open &> /dev/null; then
    open https://app.nhost.io
elif command -v xdg-open &> /dev/null; then
    xdg-open https://app.nhost.io
else
    echo "Please open https://app.nhost.io in your browser"
fi

echo ""
echo "🤖 Opening OpenRouter for API Key..."
if command -v open &> /dev/null; then
    open https://openrouter.ai/keys
elif command -v xdg-open &> /dev/null; then
    xdg-open https://openrouter.ai/keys
else
    echo "Please open https://openrouter.ai/keys in your browser"
fi

echo ""
echo "📋 Next Steps:"
echo "1. ✅ Set up your Nhost project and get subdomain/region"
echo "2. ✅ Get your OpenRouter API key"
echo "3. ✅ Update your .env file with real values"
echo "4. ✅ Apply database schema in Nhost"
echo "5. ✅ Set up Hasura permissions"
echo "6. ✅ Configure n8n workflow"
echo "7. ✅ Test the complete flow"
echo ""
echo "📚 Check DEPLOYMENT.md for detailed instructions!"
echo ""
