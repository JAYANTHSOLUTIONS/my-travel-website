import { supabase, mockPackages } from "@/lib/supabase"
import type { Package } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, Star, MapPin } from "lucide-react"

// Define the extended package type with destination info
type PackageWithDestination = Package & {
  destinations?: {
    name: string
    location: string
    state: string
    rating: number
  }
}

async function getAllPackages(): Promise<PackageWithDestination[]> {
  if (!supabase) {
    return mockPackages.sort((a, b) => a.price - b.price)
  }

  const { data: packages } = await supabase
    .from("packages")
    .select(`
      *,
      destinations (
        name,
        location,
        state,
        rating
      )
    `)
    .order("price", { ascending: true })

  return (packages || []) as PackageWithDestination[]
}

export default async function PackagesPage() {
  const packages = await getAllPackages()

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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Travel Packages</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Discover our carefully curated travel packages for the perfect Indian experience
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-gray-700">Sort by:</span>
            <Button
              variant="default"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              Price: Low to High
            </Button>
            <Button variant="outline">Price: High to Low</Button>
            <Button variant="outline">Duration</Button>
            <Button variant="outline">Popularity</Button>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages?.map((pkg) => (
              <Card
                key={pkg.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={pkg.image_url || "/placeholder.svg?height=250&width=400"}
                    alt={pkg.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {pkg.duration}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    {/* Show destination info if available */}
                    {pkg.destinations && (
                      <div className="flex items-center gap-1 mb-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {pkg.destinations.location}, {pkg.destinations.state}
                        </span>
                        <div className="flex items-center gap-1 ml-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{pkg.destinations.rating}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Max {pkg.max_people}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Package Includes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {pkg.includes.slice(0, 3).map((item, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-2 py-1 rounded-full text-xs"
                        >
                          {item}
                        </span>
                      ))}
                      {pkg.includes.length > 3 && (
                        <span className="text-xs text-gray-500">+{pkg.includes.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ₹{pkg.price.toLocaleString()}
                      <span className="text-sm text-gray-500 font-normal"> per person</span>
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      <Link href={`/book/${pkg.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No packages message */}
          {(!packages || packages.length === 0) && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Packages Available</h3>
                <p className="text-gray-600 mb-4">
                  We're working on adding amazing travel packages. Check back soon or contact us for custom packages.
                </p>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            We specialize in creating custom travel experiences tailored to your preferences and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent"
            >
              <Link href="/contact">Request Custom Package</Link>
            </Button>
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <Link href="/destinations">Browse Destinations</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
