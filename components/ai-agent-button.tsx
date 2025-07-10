"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles } from "lucide-react"

export default function AIAgentButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/ai-agent">
        <div className="relative">
          <Button
            className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-600 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group border-2 border-white/20 backdrop-blur-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              <Bot className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </Button>

          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/50 animate-ping"></div>

          {/* Sparkle Effects */}
          <div className="absolute -top-1 -left-1">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </Link>

      {/* Enhanced Tooltip */}
      {isHovered && (
        <div className="absolute bottom-20 right-0 bg-black/90 backdrop-blur-xl text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap border border-white/20 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">ARIA AI Assistant</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Neural Engine Active</p>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
        </div>
      )}
    </div>
  )
}
