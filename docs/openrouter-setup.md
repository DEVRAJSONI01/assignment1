# OpenRouter Setup Guide

OpenRouter provides access to various AI models including free options. Here's how to get started:

## Step 1: Get OpenRouter API Key

1. **Sign up**: Go to [openrouter.ai](https://openrouter.ai) and create an account
2. **Get API Key**: Navigate to "Keys" section and create a new API key
3. **Free Credits**: New accounts get free credits to start with

## Step 2: Test OpenRouter API

You can test your API key with curl:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistralai/mistral-7b-instruct:free",
    "messages": [
      {"role": "user", "content": "Hello! How are you?"}
    ]
  }'
```

## Step 3: Free Models Available

OpenRouter offers several free models:
- `mistralai/mistral-7b-instruct:free`
- `google/gemma-7b-it:free` 
- `microsoft/phi-3-medium-128k-instruct:free`
- `openchat/openchat-7b:free`

## Step 4: Rate Limits

Free tier typically includes:
- Limited requests per minute
- Limited requests per day
- May have response time limits

## Step 5: Usage in n8n

Your n8n workflow will use this API key to make requests:

```javascript
// In your n8n HTTP Request node
{
  "url": "https://openrouter.ai/api/v1/chat/completions",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "mistralai/mistral-7b-instruct:free",
    "messages": [
      {
        "role": "system", 
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "{{ $json.message }}"
      }
    ],
    "max_tokens": 500,
    "temperature": 0.7
  }
}
```

## Step 6: Error Handling

Common errors and solutions:

### 401 Unauthorized
- Check your API key is correct
- Ensure key hasn't expired

### 429 Rate Limited
- You've hit rate limits
- Wait before retrying
- Consider upgrading plan

### 400 Bad Request
- Check request format
- Verify model name is correct
- Check message format

## Step 7: Best Practices

1. **Keep API Key Secret**: Never expose in frontend code
2. **Use Free Models**: Start with free tier models
3. **Handle Errors**: Always implement error handling
4. **Monitor Usage**: Check your usage in OpenRouter dashboard
5. **Cache Responses**: Consider caching for repeated queries

## Step 8: Alternative Models

If you want different capabilities:
- **Code**: `codestral:free` (if available)
- **Chat**: `mistralai/mistral-7b-instruct:free`
- **Creative**: `google/gemma-7b-it:free`

## Step 9: Upgrading

When ready for production:
- Add payment method for higher limits
- Consider premium models for better quality
- Monitor costs and usage patterns

---

**Next**: Once you have your OpenRouter API key, save it securely for n8n configuration!
