import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Globe, Heart, Star } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">About Travel India</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Your trusted partner in discovering the incredible beauty and rich heritage of India
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  Founded in 2015, Travel India began as a passion project by a group of travel enthusiasts who wanted
                  to share the incredible diversity and beauty of India with the world. What started as a small local
                  tour company has grown into one of India's most trusted travel partners.
                </p>
                <p>
                  We believe that travel is more than just visiting places – it's about creating connections,
                  understanding cultures, and making memories that last a lifetime. Our team of local experts and travel
                  specialists work tirelessly to craft authentic experiences that showcase the real India.
                </p>
                <p>
                  From the snow-capped peaks of the Himalayas to the pristine beaches of Goa, from ancient temples to
                  modern cities, we help travelers discover the soul of India through carefully curated journeys.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Travel India team"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-emerald-100">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-emerald-100">Destinations</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">8+</div>
              <div className="text-emerald-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9</div>
              <div className="text-emerald-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Authentic Experiences</h3>
                <p className="text-gray-600">
                  We create genuine connections with local cultures and communities, ensuring authentic travel
                  experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Personalized Service</h3>
                <p className="text-gray-600">
                  Every traveler is unique, and we tailor our services to match individual preferences and needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Excellence</h3>
                <p className="text-gray-600">
                  We maintain the highest standards in service quality, safety, and customer satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Sustainability</h3>
                <p className="text-gray-600">
                  We promote responsible tourism that benefits local communities and preserves natural heritage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind your unforgettable Indian adventures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Rajesh Kumar"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-900">Rajesh Kumar</h3>
                <p className="text-emerald-600 font-semibold mb-3">Founder & CEO</p>
                <p className="text-gray-600">
                  With 15+ years in tourism, Rajesh founded Travel India to share his love for Indian culture and
                  heritage.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Priya Sharma"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-900">Priya Sharma</h3>
                <p className="text-emerald-600 font-semibold mb-3">Head of Operations</p>
                <p className="text-gray-600">
                  Priya ensures every journey runs smoothly, coordinating with local partners across India.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Arjun Patel"
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-900">Arjun Patel</h3>
                <p className="text-emerald-600 font-semibold mb-3">Adventure Specialist</p>
                <p className="text-gray-600">
                  An avid trekker and adventure enthusiast, Arjun designs thrilling experiences in India's wilderness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real experiences from real travelers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Travel India made our honeymoon absolutely magical. The attention to detail and personalized service
                  exceeded our expectations. We'll definitely be back!"
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Sarah Johnson"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">United States</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The cultural immersion tour was incredible. Our guide was knowledgeable and passionate about sharing
                  Indian traditions. Highly recommended!"
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="David Chen"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">David Chen</p>
                    <p className="text-sm text-gray-600">Australia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "From booking to the end of our trip, everything was seamless. The team's expertise and care made our
                  family vacation unforgettable."
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Emma Wilson"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Emma Wilson</p>
                    <p className="text-sm text-gray-600">United Kingdom</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Let us help you create memories that will last a lifetime. Your incredible Indian adventure awaits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <Link href="/destinations">Explore Destinations</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
