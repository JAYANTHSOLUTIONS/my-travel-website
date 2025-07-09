import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Check if we have valid environment variables
const hasValidConfig = supabaseUrl !== "https://placeholder.supabase.co" && supabaseAnonKey !== "placeholder-key"

export const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

export type Destination = {
  id: number
  name: string
  description: string
  location: string
  state: string
  image_url: string
  price_from: number
  rating: number
  category: string
  featured: boolean
  created_at: string
}

export type Package = {
  id: number
  destination_id: number
  title: string
  description: string
  duration: string
  price: number
  includes: string[]
  image_url: string
  max_people: number
  created_at: string
}

export type Review = {
  id: number
  destination_id: number
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export type Booking = {
  id: number
  package_id: number
  user_name: string
  user_email: string
  user_phone: string
  travel_date: string
  people_count: number
  total_amount: number
  status: string
  created_at: string
}

// Mock data for when Supabase is not configured
export const mockDestinations: Destination[] = [
  {
    id: 1,
    name: "Taj Mahal",
    description:
      "One of the Seven Wonders of the World, this ivory-white marble mausoleum is a symbol of eternal love.",
    location: "Agra",
    state: "Uttar Pradesh",
    image_url: "/placeholder.svg?height=400&width=600",
    price_from: 5000,
    rating: 4.8,
    category: "Historical",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Kerala Backwaters",
    description: "Experience the serene beauty of Kerala's backwaters with traditional houseboat stays.",
    location: "Alleppey",
    state: "Kerala",
    image_url: "/placeholder.svg?height=400&width=600",
    price_from: 8000,
    rating: 4.7,
    category: "Nature",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Golden Temple",
    description: "The holiest Gurdwara of Sikhism, known for its stunning golden architecture.",
    location: "Amritsar",
    state: "Punjab",
    image_url: "/placeholder.svg?height=400&width=600",
    price_from: 3000,
    rating: 4.9,
    category: "Religious",
    featured: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Goa Beaches",
    description: "Pristine beaches, vibrant nightlife, and Portuguese colonial architecture.",
    location: "Panaji",
    state: "Goa",
    image_url: "/placeholder.svg?height=400&width=600",
    price_from: 6000,
    rating: 4.6,
    category: "Beach",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "Rajasthan Palaces",
    description: "Explore the royal heritage with magnificent palaces and forts.",
    location: "Jaipur",
    state: "Rajasthan",
    image_url: "/placeholder.svg?height=400&width=600",
    price_from: 7000,
    rating: 4.5,
    category: "Historical",
    featured: false,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 6,
    name: "Himalayan Trek",
    description: "Adventure through the majestic Himalayas with breathtaking mountain views.",
    location: "Manali",
    state: "Himachal Pradesh",
    image_url: "/placeholder.svg?height=400&width=600",
    price_from: 12000,
    rating: 4.8,
    category: "Adventure",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
  },
]

export const mockPackages: Package[] = [
  {
    id: 1,
    destination_id: 1,
    title: "Taj Mahal Day Tour",
    description: "Complete day tour of Taj Mahal with guide and transportation",
    duration: "1 Day",
    price: 5000,
    includes: ["Transportation", "Guide", "Entry Tickets", "Lunch"],
    image_url: "/placeholder.svg?height=300&width=400",
    max_people: 8,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    destination_id: 2,
    title: "Kerala Houseboat Experience",
    description: "2 days and 1 night in traditional Kerala houseboat",
    duration: "2 Days 1 Night",
    price: 12000,
    includes: ["Houseboat Stay", "All Meals", "Sightseeing", "Traditional Welcome"],
    image_url: "/placeholder.svg?height=300&width=400",
    max_people: 6,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    destination_id: 4,
    title: "Goa Beach Holiday",
    description: "Relaxing beach vacation with water sports and nightlife",
    duration: "3 Days 2 Nights",
    price: 18000,
    includes: ["Beach Resort", "Water Sports", "Breakfast", "Airport Transfer"],
    image_url: "/placeholder.svg?height=300&width=400",
    max_people: 4,
    created_at: "2024-01-01T00:00:00Z",
  },
]

export const mockReviews: Review[] = [
  {
    id: 1,
    destination_id: 1,
    user_name: "Priya Sharma",
    rating: 5,
    comment: "Absolutely breathtaking! The Taj Mahal exceeded all expectations.",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    destination_id: 1,
    user_name: "Rahul Kumar",
    rating: 5,
    comment: "A must-visit destination. The architecture is simply stunning.",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: 3,
    destination_id: 2,
    user_name: "Anjali Nair",
    rating: 5,
    comment: "The houseboat experience was magical. Kerala backwaters are so peaceful.",
    created_at: "2024-01-12T00:00:00Z",
  },
  {
    id: 4,
    destination_id: 4,
    user_name: "Arjun Patel",
    rating: 4,
    comment: "Beautiful beaches and great nightlife. Perfect for a weekend getaway.",
    created_at: "2024-01-08T00:00:00Z",
  },
]
