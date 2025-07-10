"""
Quick script to fix import issues and verify setup
"""

import os
import sys
from pathlib import Path

def fix_backend_imports():
    """Fix backend import issues"""
    print("🔧 Fixing backend import issues...")
    
    # Get the backend directory
    backend_dir = Path("backend")
    
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    # Check if all required files exist
    required_files = [
        "backend/__init__.py",
        "backend/database.py", 
        "backend/services.py",
        "backend/models_simple.py",
        "backend/main.py"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return False
    
    print("✅ All backend files present")
    
    # Test imports
    try:
        sys.path.insert(0, str(backend_dir))
        
        # Test database import
        from database import SupabaseClient
        print("✅ Database import successful")
        
        # Test services import  
        from services import TravelService, AIService
        print("✅ Services import successful")
        
        # Test models import
        from models_simple import Destination
        print("✅ Models import successful")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def check_environment():
    """Check environment configuration"""
    print("\n🔍 Checking environment configuration...")
    
    # Check for .env.fastapi
    env_file = Path(".env.fastapi")
    if env_file.exists():
        print("✅ .env.fastapi file found")
        
        # Read and check key variables
        with open(env_file, 'r') as f:
            content = f.read()
            
        required_vars = [
            "SUPABASE_URL",
            "SUPABASE_ANON_KEY", 
            "OPENAI_API_KEY",
            "FASTAPI_HOST",
            "FASTAPI_PORT"
        ]
        
        for var in required_vars:
            if var in content and not content.split(f"{var}=")[1].split('\n')[0].strip().endswith('_here'):
                print(f"✅ {var} configured")
            else:
                print(f"⚠️ {var} needs configuration")
    else:
        print("⚠️ .env.fastapi file not found")
        print("💡 Run: python configure_supabase.py to set up")

def main():
    """Main function"""
    print("🚀 Travel India Backend Setup Checker")
    print("=" * 40)
    
    # Fix imports
    imports_ok = fix_backend_imports()
    
    # Check environment
    check_environment()
    
    print("\n" + "=" * 40)
    if imports_ok:
        print("✅ Backend setup looks good!")
        print("🚀 Try running: python start_fastapi.py")
    else:
        print("❌ Backend setup needs attention")
        print("💡 Make sure all files are in the correct locations")
    
    print("\n📋 Quick troubleshooting:")
    print("1. Ensure you're in the project root directory")
    print("2. Check that all backend/*.py files exist")
    print("3. Install dependencies: pip install -r requirements.txt")
    print("4. Configure environment: python configure_supabase.py")

if __name__ == "__main__":
    main()
