-- Insert sample destinations
INSERT INTO destinations (name, description, location, state, image_url, price_from, rating, category, featured) VALUES
('Taj Mahal', 'One of the Seven Wonders of the World, this ivory-white marble mausoleum is a symbol of eternal love.', 'Agra', 'Uttar Pradesh', '/placeholder.svg?height=400&width=600', 5000, 4.8, 'Historical', true),
('Kerala Backwaters', 'Experience the serene beauty of Kerala''s backwaters with traditional houseboat stays.', 'Alleppey', 'Kerala', '/placeholder.svg?height=400&width=600', 8000, 4.7, 'Nature', true),
('Golden Temple', 'The holiest Gurdwara of Sikhism, known for its stunning golden architecture.', 'Amritsar', 'Punjab', '/placeholder.svg?height=400&width=600', 3000, 4.9, 'Religious', false),
('Goa Beaches', 'Pristine beaches, vibrant nightlife, and Portuguese colonial architecture.', 'Panaji', 'Goa', '/placeholder.svg?height=400&width=600', 6000, 4.6, 'Beach', true),
('Rajasthan Palaces', 'Explore the royal heritage with magnificent palaces and forts.', 'Jaipur', 'Rajasthan', '/placeholder.svg?height=400&width=600', 7000, 4.5, 'Historical', false),
('Himalayan Trek', 'Adventure through the majestic Himalayas with breathtaking mountain views.', 'Manali', 'Himachal Pradesh', '/placeholder.svg?height=400&width=600', 12000, 4.8, 'Adventure', true),
('Mysore Palace', 'A historical palace and royal residence with Indo-Saracenic architecture.', 'Mysore', 'Karnataka', '/placeholder.svg?height=400&width=600', 4000, 4.4, 'Historical', false),
('Andaman Islands', 'Tropical paradise with crystal clear waters and pristine beaches.', 'Port Blair', 'Andaman and Nicobar Islands', '/placeholder.svg?height=400&width=600', 15000, 4.7, 'Beach', false);

-- Insert sample packages
INSERT INTO packages (destination_id, title, description, duration, price, includes, image_url, max_people) VALUES
(1, 'Taj Mahal Day Tour', 'Complete day tour of Taj Mahal with guide and transportation', '1 Day', 5000, ARRAY['Transportation', 'Guide', 'Entry Tickets', 'Lunch'], '/placeholder.svg?height=300&width=400', 8),
(2, 'Kerala Houseboat Experience', '2 days and 1 night in traditional Kerala houseboat', '2 Days 1 Night', 12000, ARRAY['Houseboat Stay', 'All Meals', 'Sightseeing', 'Traditional Welcome'], '/placeholder.svg?height=300&width=400', 6),
(3, 'Golden Temple Pilgrimage', 'Spiritual journey to the Golden Temple with accommodation', '2 Days 1 Night', 6000, ARRAY['Hotel Stay', 'Temple Visit', 'Langar Experience', 'City Tour'], '/placeholder.svg?height=300&width=400', 10),
(4, 'Goa Beach Holiday', 'Relaxing beach vacation with water sports and nightlife', '3 Days 2 Nights', 18000, ARRAY['Beach Resort', 'Water Sports', 'Breakfast', 'Airport Transfer'], '/placeholder.svg?height=300&width=400', 4),
(6, 'Himalayan Adventure Trek', '5-day trekking expedition in the Himalayas', '5 Days 4 Nights', 25000, ARRAY['Trekking Guide', 'Camping Equipment', 'All Meals', 'Permits'], '/placeholder.svg?height=300&width=400', 12);

-- Insert sample reviews
INSERT INTO reviews (destination_id, user_name, rating, comment) VALUES
(1, 'Priya Sharma', 5, 'Absolutely breathtaking! The Taj Mahal exceeded all expectations.'),
(1, 'Rahul Kumar', 5, 'A must-visit destination. The architecture is simply stunning.'),
(2, 'Anjali Nair', 5, 'The houseboat experience was magical. Kerala backwaters are so peaceful.'),
(2, 'Vikram Singh', 4, 'Great experience overall, though the weather was a bit humid.'),
(3, 'Simran Kaur', 5, 'Very spiritual and peaceful experience. The langar was amazing.'),
(4, 'Arjun Patel', 4, 'Beautiful beaches and great nightlife. Perfect for a weekend getaway.'),
(6, 'Neha Gupta', 5, 'Challenging but rewarding trek. The mountain views were incredible.');
