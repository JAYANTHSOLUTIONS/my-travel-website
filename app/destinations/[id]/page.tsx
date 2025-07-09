import { supabase, mockDestinations, mockPackages, mockReviews } from "@/lib/supabase"
import type { Destination, Package, Review } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Clock, Users, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

async function getDestination(id: string) {
  if (!supabase) {
    return mockDestinations.find((dest) => dest.id === Number.parseInt(id)) || null
  }

  const { data: destination, error } = await supabase.from("destinations").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching destination:", error)
    return null
  }

  return destination as Destination
}

async function getPackages(destinationId: string) {
  if (!supabase) {
    return mockPackages.filter((pkg) => pkg.destination_id === Number.parseInt(destinationId))
  }

  const { data: packages, error } = await supabase.from("packages").select("*").eq("destination_id", destinationId)

  if (error) {
    console.error("Error fetching packages:", error)
    return []
  }

  return packages as Package[]
}

async function getReviews(destinationId: string) {
  if (!supabase) {
    return mockReviews.filter((review) => review.destination_id === Number.parseInt(destinationId))
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("destination_id", destinationId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return reviews as Review[]
}

// Generate static params for better performance
export async function generateStaticParams() {
  if (!supabase) {
    return mockDestinations.map((dest) => ({
      id: dest.id.toString(),
    }))
  }

  const { data: destinations } = await supabase.from("destinations").select("id")

  return (
    destinations?.map((dest) => ({
      id: dest.id.toString(),
    })) || []
  )
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Validate ID format
  if (!id || isNaN(Number(id))) {
    notFound()
  }

  const destination = await getDestination(id)

  if (!destination) {
    notFound()
  }

  const [packages, reviews] = await Promise.all([getPackages(id), getReviews(id)])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Configuration Notice */}
      {!supabase && (
        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white py-2 px-4 text-center text-sm">
          <strong>Demo Mode:</strong> Configure your Supabase credentials in .env.local to connect to your database
        </div>
      )}

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" className="mb-4">
          <Link href="/destinations" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Destinations
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px]">
        <Image
          src={destination.image_url || "/placeholder.svg?height=500&width=1200"}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full text-sm font-semibold">
              {destination.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{destination.rating}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{destination.name}</h1>
          <div className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5" />
            <span>
              {destination.location}, {destination.state}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                About {destination.name}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">{destination.description}</p>
            </section>

            {/* Packages */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Available Packages
              </h2>
              <div className="grid gap-6">
                {packages?.length > 0 ? (
                  packages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className="overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <Image
                            src={pkg.image_url || "/placeholder.svg?height=200&width=300"}
                            alt={pkg.title}
                            width={300}
                            height={200}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                              ₹{pkg.price.toLocaleString()}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{pkg.description}</p>
                          <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{pkg.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>Max {pkg.max_people} people</span>
                            </div>
                          </div>
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Includes:</h4>
                            <div className="flex flex-wrap gap-2">
                              {pkg.includes.map((item, index) => (
                                <span
                                  key={index}
                                  className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-2 py-1 rounded-full text-xs"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                            <Link href={`/book/${pkg.id}`}>Book Now</Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No packages available for this destination yet.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Reviews
              </h2>
              <div className="grid gap-4">
                {reviews?.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review.id} className="border-0 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-sm text-gray-500 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review this destination!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ₹{destination.price_from.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Starting from</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-semibold">{destination.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-semibold">{destination.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold">{destination.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
