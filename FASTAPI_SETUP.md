# FastAPI Backend Setup Guide

## 🚀 Quick Start

### Option 1: Simple Startup (Recommended)
\`\`\`bash
# Windows
start_server.bat

# Mac/Linux
chmod +x start_server.sh
./start_server.sh
\`\`\`

### Option 2: Manual Setup
\`\`\`bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment
# Copy .env.fastapi and update with your Supabase credentials

# 3. Start server
python start_fastapi.py
\`\`\`

## 📋 Environment Configuration

Create/update `.env.fastapi`:
\`\`\`env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# FastAPI Configuration
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
FASTAPI_RELOAD=true

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Optional: AI API Keys
GROQ_API_KEY=your_groq_api_key_here
\`\`\`

## 🔗 API Endpoints

Once running, visit:
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🛠️ Troubleshooting

### Common Issues:

1. **ModuleNotFoundError: No module named 'backend'**
   - Make sure you're running from the project root directory
   - Use `python start_fastapi.py` instead of the scripts folder

2. **Import errors**
   - Install dependencies: `pip install -r requirements.txt`
   - Check Python version: `python --version` (needs 3.8+)

3. **Database connection issues**
   - Verify Supabase credentials in `.env.fastapi`
   - Check if Supabase project is active
   - Run the SQL script to create tables

4. **Port already in use**
   - Change FASTAPI_PORT in `.env.fastapi`
   - Or kill the process using port 8000

### Getting Help:
- Check the console output for detailed error messages
- Visit http://localhost:8000/health to test the server
- Ensure all environment variables are set correctly
