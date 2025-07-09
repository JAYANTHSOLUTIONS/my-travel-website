-- Create destinations table
CREATE TABLE destinations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  image_url TEXT,
  price_from INTEGER NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packages table
CREATE TABLE packages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  destination_id BIGINT REFERENCES destinations(id),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT NOT NULL,
  price INTEGER NOT NULL,
  includes TEXT[],
  image_url TEXT,
  available_dates DATE[],
  max_people INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  package_id BIGINT REFERENCES packages(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  travel_date DATE NOT NULL,
  people_count INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  destination_id BIGINT REFERENCES destinations(id),
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read destinations" ON destinations FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read packages" ON packages FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT TO anon USING (true);

-- Create policies for bookings (users can insert their own bookings)
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT TO anon WITH CHECK (true);
