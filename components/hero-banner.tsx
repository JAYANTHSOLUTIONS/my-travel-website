"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const bannerSlides = [
  {
    id: 1,
    image: "https://i.pinimg.com/736x/a2/45/13/a245133998244908efecadf2798e5e5f.jpg",
    title: "Discover the Majestic Taj Mahal",
    description: "Experience the eternal symbol of love in Agra, where history comes alive",
    location: "Agra, Uttar Pradesh",
    cta: "Explore Now",
  },
  {
    id: 2,
    image: "https://i.pinimg.com/736x/a6/aa/ed/a6aaed005827d92bba96af7bc37218e4.jpg",
    title: "Sail Through Kerala Backwaters",
    description: "Glide through serene waters on traditional houseboats in God's Own Country",
    location: "Alleppey, Kerala",
    cta: "Book Experience",
  },
  {
    id: 3,
    image: "https://i.pinimg.com/736x/f8/84/fb/f884fb3ef531d5fa7d6d85096a31695e.jpg",
    title: "Golden Temple Spiritual Journey",
    description: "Find peace and spirituality at the holiest Sikh shrine in Amritsar",
    location: "Amritsar, Punjab",
    cta: "Plan Visit",
  },
  {
    id: 4,
    image: "https://i.pinimg.com/736x/11/c0/e9/11c0e9467c48ec3deec10bbad49d48c6.jpg",
    title: "Relax on Pristine Goa Beaches",
    description: "Unwind on golden sands with vibrant culture and Portuguese heritage",
    location: "Panaji, Goa",
    cta: "Beach Holiday",
  },
  {
    id: 5,
    image: "https://i.pinimg.com/736x/52/a5/30/52a5305b4667f076e5bb48042afe4c36.jpg",
    title: "Trek the Mighty Himalayas",
    description: "Adventure awaits in the world's highest mountain range with breathtaking views",
    location: "Manali, Himachal Pradesh",
    cta: "Start Adventure",
  },
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Images */}
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <div className="mb-4">
              <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 rounded-full text-sm font-semibold">
                {bannerSlides[currentSlide].location}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {bannerSlides[currentSlide].title}
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              {bannerSlides[currentSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3"
              >
                <Link href="/destinations">{bannerSlides[currentSlide].cta}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 bg-transparent"
              >
                <Link href="/packages">View All Packages</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide(currentSlide === 0 ? bannerSlides.length - 1 : currentSlide - 1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => goToSlide((currentSlide + 1) % bannerSlides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  )
}
