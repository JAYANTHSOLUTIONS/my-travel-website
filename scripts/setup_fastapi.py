"""
FastAPI Backend Setup Script
This script sets up a FastAPI backend with Supabase integration
"""

import subprocess
import sys
import os

def install_dependencies():
    """Install required Python packages"""
    packages = [
        "fastapi",
        "uvicorn[standard]",
        "supabase",
        "python-dotenv",
        "pydantic",
        "httpx",
        "python-multipart"
    ]
    
    print("📦 Installing FastAPI dependencies...")
    for package in packages:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
    
    print("🎉 All dependencies installed!")

def create_env_template():
    """Create .env template for FastAPI"""
    env_content = """# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# FastAPI Configuration
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
FASTAPI_RELOAD=true

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Optional: AI API Keys
GROQ_API_KEY=your_groq_api_key_here
"""
    
    with open(".env.fastapi", "w") as f:
        f.write(env_content)
    
    print("📄 Created .env.fastapi template")
    print("🔧 Please update the environment variables with your actual values")

if __name__ == "__main__":
    print("🚀 Setting up FastAPI backend...")
    install_dependencies()
    create_env_template()
    print("✅ FastAPI setup complete!")
    print("\n📋 Next steps:")
    print("1. Update .env.fastapi with your Supabase credentials")
    print("2. Run: python scripts/run_fastapi.py")
    print("3. Your API will be available at http://localhost:8000")
