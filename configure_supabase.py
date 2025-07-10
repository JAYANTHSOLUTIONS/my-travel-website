"""
Supabase Configuration Helper
Interactive setup for your Supabase credentials
"""

import os
from pathlib import Path

def configure_supabase():
    """Interactive Supabase configuration"""
    print("🔧 Supabase Configuration Helper")
    print("=" * 40)
    print()
    
    # Check if .env.fastapi exists
    env_file = Path(".env.fastapi")
    
    if env_file.exists():
        print("📄 Found existing .env.fastapi file")
        overwrite = input("Do you want to update it? (y/n): ").lower().strip()
        if overwrite != 'y':
            print("Configuration cancelled.")
            return
    
    print("\n🔍 You can find these credentials in your Supabase Dashboard:")
    print("   1. Go to https://supabase.com/dashboard")
    print("   2. Select your project")
    print("   3. Go to Settings > API")
    print()
    
    # Get Supabase credentials
    supabase_url = input("Enter your Supabase URL (https://xxx.supabase.co): ").strip()
    if not supabase_url:
        print("❌ Supabase URL is required!")
        return
    
    anon_key = input("Enter your Supabase Anon Key: ").strip()
    if not anon_key:
        print("❌ Anon Key is required!")
        return
    
    service_key = input("Enter your Service Role Key (optional, press Enter to skip): ").strip()
    
    # Optional: AI API Keys
    print("\n🤖 Optional: AI API Configuration")
    print("   These enhance the AI chat responses but are not required")
    groq_key = input("Enter your Groq API Key (optional): ").strip()
    
    # Create .env.fastapi content
    env_content = f"""# Supabase Configuration
SUPABASE_URL={supabase_url}
SUPABASE_ANON_KEY={anon_key}
SUPABASE_SERVICE_ROLE_KEY={service_key}

# FastAPI Configuration
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
FASTAPI_RELOAD=true

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Optional: AI API Keys
GROQ_API_KEY={groq_key}
"""
    
    # Write to file
    try:
        with open(".env.fastapi", "w") as f:
            f.write(env_content)
        
        print("\n✅ Configuration saved to .env.fastapi")
        print("\n🚀 Next steps:")
        print("   1. Make sure your Supabase database has the destinations table")
        print("   2. Run: python scripts/create_destinations_table.sql in Supabase SQL Editor")
        print("   3. Restart your FastAPI server: python start_fastapi.py")
        print("   4. Test the connection: python test_api.py")
        
    except Exception as e:
        print(f"❌ Error saving configuration: {e}")

def check_supabase_table():
    """Check if Supabase table exists and provide setup instructions"""
    print("\n📋 Supabase Table Setup Instructions:")
    print("=" * 40)
    print()
    print("1. Go to your Supabase Dashboard")
    print("2. Navigate to SQL Editor")
    print("3. Run this SQL script:")
    print()
    
    sql_script = """-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    location VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Heritage', 'Nature', 'Beach', 'Spiritual', 'Adventure')),
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    price_from INTEGER NOT NULL CHECK (price_from >= 0),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO destinations (name, location, state, description, image_url, category, rating, price_from, featured) VALUES
('Taj Mahal', 'Agra', 'Uttar Pradesh', 'One of the Seven Wonders of the World, this ivory-white marble mausoleum is a symbol of eternal love.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500', 'Heritage', 4.8, 15000, true),
('Kerala Backwaters', 'Alleppey', 'Kerala', 'Experience the serene beauty of Kerala''s backwaters on a traditional houseboat cruise.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500', 'Nature', 4.7, 12000, true),
('Golden Temple', 'Amritsar', 'Punjab', 'The holiest Gurdwara of Sikhism, known for its stunning golden architecture and spiritual atmosphere.', 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500', 'Spiritual', 4.9, 8000, true)
ON CONFLICT DO NOTHING;"""
    
    print(sql_script)
    print()
    print("4. After running the SQL, restart your FastAPI server")
    print("5. The API will automatically connect to your live database!")

if __name__ == "__main__":
    print("🚀 Travel India FastAPI Configuration")
    print()
    print("Choose an option:")
    print("1. Configure Supabase credentials")
    print("2. Show database setup instructions")
    print("3. Exit")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        configure_supabase()
    elif choice == "2":
        check_supabase_table()
    else:
        print("Goodbye! 👋")
