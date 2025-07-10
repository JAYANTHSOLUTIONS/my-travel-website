"""
Quick test script to verify imports work
"""

import sys
from pathlib import Path

def test_imports():
    """Test all backend imports"""
    print("🧪 Testing backend imports...")
    
    # Add current directory to path for backend.module imports
    current_dir = Path(__file__).parent
    sys.path.insert(0, str(current_dir))
    
    try:
        # Test database import
        from backend.database import SupabaseClient
        print("✅ backend.database import successful")
        
        # Test services import
        from backend.services import TravelService, AIService
        print("✅ backend.services import successful")
        
        # Test models import
        from backend.models_simple import Destination
        print("✅ backend.models_simple import successful")
        
        # Test main import
        from backend.main import app
        print("✅ backend.main app import successful")
        
        print("\n🎉 All imports working correctly!")
        print("🚀 You can now run: python run_backend.py")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        print("\n💡 Make sure:")
        print("1. You're in the project root directory")
        print("2. backend/__init__.py exists")
        print("3. All backend/*.py files exist")
        return False

if __name__ == "__main__":
    test_imports()
