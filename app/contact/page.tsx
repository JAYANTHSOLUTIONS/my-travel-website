import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Get in touch with our travel experts to plan your perfect Indian adventure
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="What's this about?"
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder="Tell us about your travel plans or questions..."
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>

                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Get in Touch
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Ready to explore incredible India? Our travel experts are here to help you plan the perfect journey.
                  Whether you're looking for cultural experiences, adventure tours, or peaceful retreats, we'll create a
                  customized itinerary just for you.
                </p>
              </div>

              <div className="grid gap-6">
                <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Visit Our Office</h3>
                        <p className="text-gray-600">
                          123 Travel Street, Connaught Place
                          <br />
                          New Delhi, India 110001
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                        <p className="text-gray-600">
                          +91 98765 43210
                          <br />
                          +91 11 2345 6789
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                        <p className="text-gray-600">
                          info@travelindia.com
                          <br />
                          bookings@travelindia.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                        <p className="text-gray-600">
                          Monday - Friday: 9:00 AM - 7:00 PM
                          <br />
                          Saturday: 10:00 AM - 5:00 PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about traveling in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">What's the best time to visit India?</h3>
                <p className="text-gray-600">
                  October to March is generally the best time, with pleasant weather across most regions. However, it
                  depends on your destination and preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Do I need a visa to visit India?</h3>
                <p className="text-gray-600">
                  Most visitors need a visa. We can help you with the e-visa application process, which is convenient
                  for tourists.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Is it safe to travel in India?</h3>
                <p className="text-gray-600">
                  India is generally safe for tourists. We provide 24/7 support and work with trusted local partners to
                  ensure your safety.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can you customize tour packages?</h3>
                <p className="text-gray-600">
                  We specialize in creating personalized itineraries based on your interests, budget, and travel style.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
