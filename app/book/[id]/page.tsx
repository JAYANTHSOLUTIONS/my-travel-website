"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function BookingPage() {
  const params = useParams()
  const packageId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelDate: "",
    peopleCount: 1,
    specialRequests: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the booking data to your backend
    console.log("Booking submitted:", { packageId, ...formData })
    alert("Booking request submitted! We'll contact you soon to confirm your reservation.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-4 text-white hover:bg-white/20">
            <Link href="/packages" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Packages
            </Link>
          </Button>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Book Your Adventure</h1>
          <p className="text-xl text-emerald-100">Complete the form below to reserve your travel package</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div>
              <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-1">
                          Number of People *
                        </label>
                        <Input
                          id="peopleCount"
                          name="peopleCount"
                          type="number"
                          min="1"
                          max="20"
                          required
                          value={formData.peopleCount}
                          onChange={handleInputChange}
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Travel Date *
                      </label>
                      <Input
                        id="travelDate"
                        name="travelDate"
                        type="date"
                        required
                        value={formData.travelDate}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests or Requirements
                      </label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        rows={4}
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any dietary restrictions, accessibility needs, or special occasions..."
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      Submit Booking Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Package ID: {packageId}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      This is a booking request. Final confirmation and payment details will be sent via email.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Confirmation Call</h4>
                      <p className="text-sm text-gray-600">We'll call you within 24 hours to confirm details</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Customization</h4>
                      <p className="text-sm text-gray-600">We'll customize the package based on your preferences</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Payment & Booking</h4>
                      <p className="text-sm text-gray-600">Secure payment link and final itinerary will be shared</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Call us: +91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Available: 9 AM - 7 PM (Mon-Sat)</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
