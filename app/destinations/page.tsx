import { supabase, mockDestinations } from "@/lib/supabase"
import type { Destination } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Filter } from "lucide-react"

async function getAllDestinations() {
  if (!supabase) {
    // Return mock data when Supabase is not configured
    return mockDestinations.sort((a, b) => b.rating - a.rating)
  }

  const { data: destinations } = await supabase.from("destinations").select("*").order("rating", { ascending: false })
  return destinations as Destination[]
}

export default async function DestinationsPage() {
  const destinations = await getAllDestinations()

  const categories = ["All", "Historical", "Nature", "Beach", "Religious", "Adventure"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Configuration Notice */}
      {!supabase && (
        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white py-2 px-4 text-center text-sm">
          <strong>Demo Mode:</strong> Configure your Supabase credentials in .env.local to connect to your database
        </div>
      )}

      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">All Destinations</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Explore the diverse beauty and rich heritage of India
          </p>
        </div>
      </section>

      {/* Rest of the component remains the same */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Filter by:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={
                  category === "All"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    : "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations?.map((destination) => (
              <Card
                key={destination.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={destination.image_url || "/placeholder.svg"}
                    alt={destination.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {destination.category}
                  </div>
                  {destination.featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{destination.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2 text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs truncate">
                      {destination.location}, {destination.state}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ₹{destination.price_from.toLocaleString()}
                      <span className="text-xs text-gray-500 font-normal">+</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      <Link href={`/destinations/${destination.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
