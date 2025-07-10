# OpenAI + FastAPI Integration Guide

## 🚀 Complete Setup

### Step 1: OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up and get $5 free credits
3. Navigate to API Keys section
4. Create a new secret key (starts with `sk-`)
5. Copy and save the key securely

### Step 2: Environment Configuration

**Frontend (.env.local):**
\`\`\`env
# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_key_here

# FastAPI Backend URL (optional)
FASTAPI_URL=http://localhost:8000

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
\`\`\`

**Backend (.env.fastapi):**
\`\`\`env
# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=sk-your_openai_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# FastAPI Configuration
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
FASTAPI_RELOAD=true

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
\`\`\`

### Step 3: Start the Backend
\`\`\`bash
# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python start_fastapi.py
\`\`\`

### Step 4: Start the Frontend
\`\`\`bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
\`\`\`

## 🎯 How It Works

### Architecture Flow:
1. **User Query** → ARIA AI Agent
2. **ARIA** → FastAPI Backend (if available)
3. **FastAPI** → OpenAI API + Supabase Database
4. **Response** → Intelligent, data-driven travel advice

### Fallback System:
- If FastAPI is unavailable → Direct OpenAI calls
- If OpenAI is unavailable → Enhanced local responses
- If Supabase is unavailable → Mock data

## 🧠 AI Features

### With OpenAI Integration:
- **Smart Intent Analysis**: Understands complex travel queries
- **Personalized Recommendations**: Based on budget, preferences, duration
- **Context-Aware Responses**: Remembers conversation history
- **Budget Optimization**: Intelligent cost analysis
- **Itinerary Generation**: Custom travel plans

### Database Integration:
- **Live Pricing**: Real-time destination costs
- **Availability**: Current ratings and reviews
- **Smart Search**: AI-powered destination matching
- **Analytics**: Travel trends and insights

## 🔧 API Endpoints

### FastAPI Backend:
- `GET /health` - System health check
- `POST /api/chat` - AI chat with database integration
- `GET /api/destinations` - Live destination data
- `GET /api/system-status` - Comprehensive status
- `GET /docs` - Interactive API documentation

### Frontend Integration:
- Automatic FastAPI detection
- Seamless fallback to local processing
- Real-time system status monitoring

## 💡 Pro Tips

### Cost Optimization:
- OpenAI charges per token (~$0.002/1K tokens)
- Average query costs $0.01-0.05
- $5 free credits = ~100-500 conversations
- Monitor usage in OpenAI dashboard

### Performance:
- FastAPI responses: ~2-5 seconds
- Local fallback: ~1-2 seconds
- Database queries: ~500ms
- Caching reduces repeated calls

### Best Practices:
- Keep API keys secure and private
- Monitor OpenAI usage and costs
- Use environment variables for configuration
- Test fallback scenarios
- Regular database backups

## 🚨 Troubleshooting

### Common Issues:

1. **OpenAI API Error 401**
   - Check API key is correct
   - Verify key has sufficient credits
   - Ensure key is properly set in environment

2. **FastAPI Connection Failed**
   - Verify FastAPI server is running on port 8000
   - Check CORS configuration
   - Ensure all dependencies are installed

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure database tables exist

4. **High API Costs**
   - Monitor token usage
   - Implement response caching
   - Use shorter system prompts
   - Set usage limits in OpenAI dashboard

## 📊 Monitoring

### System Status:
- Visit `/api/system-status` for health check
- Monitor OpenAI usage in platform dashboard
- Check FastAPI logs for errors
- Supabase dashboard for database metrics

### Performance Metrics:
- Response time: Target <5 seconds
- Success rate: Target >95%
- Cost per query: Target <$0.05
- User satisfaction: Monitor feedback

## 🎉 Success Indicators

✅ OpenAI API key configured and working
✅ FastAPI backend running and accessible  
✅ Supabase database connected with data
✅ ARIA providing intelligent responses
✅ Real-time destination data integration
✅ Personalized travel recommendations
✅ Budget optimization working
✅ Conversation context maintained

Your intelligent travel assistant is now ready! 🚀
