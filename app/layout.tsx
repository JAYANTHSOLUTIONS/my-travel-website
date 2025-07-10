import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Bot } from "lucide-react"
import AIAgentButton from "@/components/ai-agent-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel India - Discover Incredible India",
  description:
    "Experience the rich culture, stunning landscapes, and timeless heritage of India with our curated travel packages.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
              >
                Travel India
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">
                  Home
                </Link>
                <Link href="/destinations" className="text-gray-700 hover:text-pink-600 transition-colors">
                  Destinations
                </Link>
                <Link href="/packages" className="text-gray-700 hover:text-pink-600 transition-colors">
                  Packages
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-pink-600 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition-colors">
                  Contact
                </Link>
              </div>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Book Now
              </Button>
            </div>
          </div>
        </nav>

        {children}

        {/* AI Agent Floating Button */}
        <AIAgentButton />

        {/* Footer */}
        <footer className="bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Travel India
                </h3>
                <p className="text-gray-300 mb-4">
                  Discover the incredible beauty and rich heritage of India with our expertly curated travel
                  experiences.
                </p>
                <div className="flex space-x-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white hover:text-gray-900 bg-transparent"
                  >
                    Facebook
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white hover:text-gray-900 bg-transparent"
                  >
                    Instagram
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/destinations" className="text-gray-300 hover:text-white transition-colors">
                      Destinations
                    </Link>
                  </li>
                  <li>
                    <Link href="/packages" className="text-gray-300 hover:text-white transition-colors">
                      Packages
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ai-agent"
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Bot className="w-4 h-4" />
                      AI Assistant
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Popular Destinations</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/destinations/1" className="text-gray-300 hover:text-white transition-colors">
                      Taj Mahal
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/2" className="text-gray-300 hover:text-white transition-colors">
                      Kerala Backwaters
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/4" className="text-gray-300 hover:text-white transition-colors">
                      Goa Beaches
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/6" className="text-gray-300 hover:text-white transition-colors">
                      Himalayan Trek
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-gray-300">New Delhi, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-gray-300">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-gray-300">info@travelindia.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-white/20 mt-12 pt-8 text-center">
              <p className="text-gray-300">
                © 2024 Travel India. All rights reserved. Made with ❤️ for incredible India.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
