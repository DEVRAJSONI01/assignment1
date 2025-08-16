#!/bin/bash

echo "🧪 Chatbot Application - Complete Testing Suite"
echo "=============================================="
echo ""

# Function to check URL availability
check_url() {
    local url=$1
    local name=$2
    if curl -s --connect-timeout 5 "$url" > /dev/null; then
        echo "✅ $name is accessible"
        return 0
    else
        echo "❌ $name is not accessible"
        return 1
    fi
}

# Function to test API endpoint
test_api() {
    local url=$1
    local method=$2
    local data=$3
    local name=$4
    
    echo "Testing $name..."
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" -o /tmp/api_response.json)
    else
        response=$(curl -s -w "%{http_code}" "$url" -o /tmp/api_response.json)
    fi
    
    http_code="${response: -3}"
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 400 ]; then
        echo "✅ $name responded with HTTP $http_code"
        return 0
    else
        echo "❌ $name responded with HTTP $http_code"
        cat /tmp/api_response.json 2>/dev/null
        return 1
    fi
}

echo "🖥️  Frontend Testing:"
echo "-------------------"

# Test development server
check_url "http://localhost:3000" "Development Server"

# Test specific routes
check_url "http://localhost:3000/" "Root Route"

echo ""
echo "🔧 Environment Testing:"
echo "----------------------"

# Check environment variables
if [ -f .env ]; then
    echo "✅ .env file exists"
    
    # Check for placeholder values
    if grep -q "your-nhost-subdomain" .env; then
        echo "🚧 .env contains placeholder values (Demo Mode)"
        echo "   Update VITE_NHOST_SUBDOMAIN and VITE_NHOST_REGION for production"
    else
        echo "✅ .env file configured with real values"
    fi
else
    echo "❌ .env file missing"
fi

# Check node_modules
if [ -d node_modules ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies missing - run 'npm install'"
fi

echo ""
echo "📦 Build Testing:"
echo "----------------"

# Test build process
echo "Testing production build..."
if npm run build >/dev/null 2>&1; then
    echo "✅ Production build successful"
    
    # Check build output
    if [ -d dist ]; then
        echo "✅ Build artifacts created in dist/"
        echo "   Build size: $(du -sh dist 2>/dev/null | cut -f1)"
    else
        echo "❌ Build artifacts not found"
    fi
else
    echo "❌ Production build failed"
fi

echo ""
echo "🗄️  Database Schema Validation:"
echo "------------------------------"

# Check if schema file exists and is valid
if [ -f hasura/schema.sql ]; then
    echo "✅ Database schema file exists"
    
    # Basic SQL syntax check
    if grep -q "CREATE TABLE" hasura/schema.sql && grep -q "chats" hasura/schema.sql && grep -q "messages" hasura/schema.sql; then
        echo "✅ Schema contains required tables (chats, messages)"
    else
        echo "❌ Schema missing required tables"
    fi
    
    # Check for RLS
    if grep -q "user_id" hasura/schema.sql; then
        echo "✅ Schema includes user_id columns for RLS"
    else
        echo "❌ Schema missing user_id columns"
    fi
else
    echo "❌ Database schema file missing"
fi

echo ""
echo "🤖 Integration Files Testing:"
echo "----------------------------"

# Check n8n workflow
if [ -f n8n/workflow-export.json ]; then
    echo "✅ n8n workflow export exists"
    
    # Validate JSON
    if python3 -m json.tool n8n/workflow-export.json >/dev/null 2>&1; then
        echo "✅ n8n workflow JSON is valid"
    else
        echo "❌ n8n workflow JSON is invalid"
    fi
else
    echo "❌ n8n workflow export missing"
fi

# Check documentation
docs=("README.md" "DEPLOYMENT.md" "CHECKLIST.md" "hasura/permissions.md" "hasura/actions.md")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc exists"
    else
        echo "❌ $doc missing"
    fi
done

echo ""
echo "🔐 Security Testing:"
echo "-------------------"

# Check for secrets in files
if grep -r "admin.*secret" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v node_modules | grep -v ".git"; then
    echo "⚠️  Potential secrets found in source code"
else
    echo "✅ No hardcoded secrets detected"
fi

# Check .env is gitignored
if grep -q ".env" .gitignore 2>/dev/null; then
    echo "✅ .env file is gitignored"
else
    echo "❌ .env file not in .gitignore"
fi

echo ""
echo "📊 Summary:"
echo "----------"

# Count total checks
total_files=0
existing_files=0

check_files=(".env" "package.json" "src/App.tsx" "src/pages/AuthPage.tsx" "src/pages/ChatPage.tsx" "hasura/schema.sql" "n8n/workflow-export.json")

for file in "${check_files[@]}"; do
    total_files=$((total_files + 1))
    if [ -f "$file" ]; then
        existing_files=$((existing_files + 1))
    fi
done

echo "Files: $existing_files/$total_files present"

# Check if demo mode
if grep -q "your-nhost-subdomain" .env 2>/dev/null; then
    echo "Mode: 🚧 Demo/Development Mode"
    echo ""
    echo "🚀 Next Steps to Go Live:"
    echo "1. Set up Nhost project and update .env"
    echo "2. Apply database schema in Nhost"
    echo "3. Configure Hasura permissions"
    echo "4. Set up n8n workflow"
    echo "5. Get OpenRouter API key"
    echo "6. Create Hasura Action"
    echo ""
    echo "📚 Use these guides:"
    echo "   ./setup-nhost.sh - Nhost setup"
    echo "   ./open-services.sh - Open required services"
    echo "   DEPLOYMENT.md - Complete deployment guide"
else
    echo "Mode: 🚀 Production Mode"
    echo ""
    echo "✅ Ready for backend integration testing!"
fi

echo ""
echo "🧪 Test completed! Check any ❌ items above."
