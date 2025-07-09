import { supabase, mockDestinations } from "@/lib/supabase"
import type { Destination } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Users, Calendar } from "lucide-react"
import HeroBanner from "@/components/hero-banner"

async function getFeaturedDestinations() {
  if (!supabase) {
    return mockDestinations.filter((dest) => dest.featured).slice(0, 6)
  }

  const { data: destinations } = await supabase.from("destinations").select("*").eq("featured", true).limit(6)
  return destinations as Destination[]
}

export default async function HomePage() {
  const featuredDestinations = await getFeaturedDestinations()

  return (
    <div className="min-h-screen">
      {/* Configuration Notice */}
      {!supabase && (
        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white py-2 px-4 text-center text-sm">
          <strong>Demo Mode:</strong> Configure your Supabase credentials in .env.local to connect to your database
        </div>
      )}

      {/* Hero Banner with Slideshow */}
      <HeroBanner />

      {/* Featured Destinations */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular and breathtaking destinations across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations?.map((destination) => (
              <Card
                key={destination.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={destination.image_url || "https://i.pinimg.com/736x/a2/45/13/a245133998244908efecadf2798e5e5f.jpg"}
                    alt={destination.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {destination.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {destination.location}, {destination.state}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ₹{destination.price_from.toLocaleString()}
                      <span className="text-sm text-gray-500 font-normal"> onwards</span>
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      <Link href={`/destinations/${destination.id}`}>Explore</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Why Choose Travel India</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              We make your Indian adventure unforgettable with our expertise and personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Guides</h3>
              <p className="text-emerald-100">Local experts who know every hidden gem and story</p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Booking</h3>
              <p className="text-emerald-100">Easy booking with flexible dates and cancellation</p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Experience</h3>
              <p className="text-emerald-100">Curated experiences that create lasting memories</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
