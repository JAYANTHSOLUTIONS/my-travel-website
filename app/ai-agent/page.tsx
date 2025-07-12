"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Send, User, Brain, Globe, Settings, Shield, Zap, CheckCircle, Loader2, Gift } from "lucide-react"
import FreeAPISetup from "@/components/free-api-setup"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "text" | "suggestion" | "data" | "error"
}

interface SystemStatus {
  freeAI: {
    groq: { configured: boolean; available: boolean }
    huggingface: { configured: boolean; available: boolean }
    openrouter: { configured: boolean; available: boolean }
  }
  knowledgeBase: {
    initialized: boolean
    destinations: boolean
    budgetPlanning: boolean
    itineraryPlanning: boolean
  }
  system: {
    timestamp: string
    uptime: number
    mode: string
  }
}

const quickSuggestions = [
  { text: "Plan a 7-day Golden Triangle tour", type: "itinerary" },
  { text: "Tell me about Kerala backwaters", type: "destination" },
  { text: "What's the best food to try in Rajasthan?", type: "food" },
  { text: "When is the best time to visit Goa?", type: "chat" },
  { text: "What are the major festivals in India?", type: "chat" },
  { text: "How much should I budget for 10 days in India?", type: "budget" },
]

const aiCapabilities = [
  { icon: Brain, title: "Enhanced Knowledge Base", desc: "Comprehensive India travel information" },
  { icon: Globe, title: "Destination Planning", desc: "Detailed guides for popular destinations" },
  { icon: Zap, title: "Instant Responses", desc: "Fast and accurate travel advice" },
  { icon: Shield, title: "Always Available", desc: "Works without any external dependencies" },
]

export default function AIAgentPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [selectedType, setSelectedType] = useState("chat")
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [preferences, setPreferences] = useState({
    budget: "",
    duration: "",
    interests: "",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        text: "🤖 Hello! I'm ARIA, your intelligent India travel assistant powered by advanced AI and connected to live destination data. I can provide personalized recommendations, create custom itineraries, and help with budget planning using real-time information from our database. I think and respond like a human travel expert - not just pre-written answers! What would you like to explore about incredible India?",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      },
    ])

    // Fetch system status
    fetchSystemStatus()
  }, [])

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("/api/system-status")
      const status = await response.json()
      setSystemStatus(status)
    } catch (error) {
      console.error("Failed to fetch system status:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {  // <-- Changed URL to match backend API route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,             // <-- Changed from "question" to "message"
          conversationHistory: messages,       // <-- Added conversationHistory to match backend
        }),
      })

      const data = await response.json()

      if (data.response) {  // Check if backend returned a response
        const aiResponse: Message = {
          id: messages.length + 2,
          text: data.response,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, aiResponse])
      } else {
        throw new Error("No response from server")
      }
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: `❌ Error: ${error instanceof Error ? error.message : "Failed to process your request"}. Please try again.`,
        sender: "ai",
        timestamp: new Date(),
        type: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: { text: string; type: string }) => {
    setInputMessage(suggestion.text)
    setSelectedType(suggestion.type)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const hasConfiguredAPIs = systemStatus?.freeAI
    ? Object.values(systemStatus.freeAI).some((api) => api.configured)
    : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fillOpacity%3D%220.1%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ARIA
              </h1>
              <p className="text-gray-300 text-sm">AI Travel Assistant for India</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <Badge variant="outline" className="border-green-400 text-green-400 bg-green-400/10">
              <CheckCircle className="w-3 h-3 mr-1" />
              Always Ready
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400 bg-purple-400/10">
              <Brain className="w-3 h-3 mr-1" />
              Enhanced Knowledge
            </Badge>
            <Badge variant="outline" className="border-cyan-400 text-cyan-400 bg-cyan-400/10">
              <Zap className="w-3 h-3 mr-1" />
              Instant Responses
            </Badge>
            {hasConfiguredAPIs && (
              <Badge variant="outline" className="border-yellow-400 text-yellow-400 bg-yellow-400/10">
                <Gift className="w-3 h-3 mr-1" />
                Free APIs Active
              </Badge>
            )}
          </div>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your intelligent India travel companion with comprehensive destination guides, budget planning, and cultural
            insights. No setup required - start planning your dream trip right away!
          </p>

          <div className="mt-6">
            <Button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {showSetupGuide ? "Hide Free API Setup" : "Enhance with Free APIs"}
            </Button>
          </div>
        </div>

        {/* Setup Guide */}
        {showSetupGuide && (
          <div className="mb-8">
            <FreeAPISetup />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Chat Interface */}
          <div className="xl:col-span-3">
            <Card className="h-[700px] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              {/* Chat Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full animate-pulse bg-green-400"></div>
                    <span className="text-white font-medium">
                      {systemStatus?.system.mode || "Enhanced Travel Assistant"} Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chat">Chat</SelectItem>
                        <SelectItem value="itinerary">Itinerary</SelectItem>
                        <SelectItem value="destination">Destination</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ height: "calc(700px - 200px)" }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                      <div
                        className={`p-4 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-4"
                            : message.type === "error"
                              ? "bg-red-900/30 backdrop-blur-sm text-red-200 mr-4 border border-red-500/30"
                              : "bg-white/10 backdrop-blur-sm text-gray-100 mr-4 border border-white/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {message.sender === "ai" && (
                            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                            <p
                              className={`text-xs mt-2 ${
                                message.sender === "user"
                                  ? "text-purple-200"
                                  : message.type === "error"
                                    ? "text-red-300"
                                    : "text-gray-400"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {message.sender === "user" && (
                            <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <User className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mr-4 border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                          <Loader2 className="w-3 h-3 text-white animate-spin" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">ARIA is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask ARIA about your dream India destination..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[48px] max-h-32 rounded-xl backdrop-blur-sm resize-none"
                      rows={1}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 px-6 rounded-xl"
                  >
                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 bg-transparent text-xs"
                    >
                      {suggestion.text}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="h-[700px] bg-black/30 backdrop-blur-xl border border-white/10 shadow-lg p-6 overflow-y-auto">
              <h2 className="text-white text-2xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-cyan-400" /> AI Capabilities
              </h2>
              <ul className="space-y-4">
                {aiCapabilities.map(({ icon: Icon, title, desc }, idx) => (
                  <li key={idx} className="flex gap-4 items-center">
                    <div className="p-3 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{title}</h3>
                      <p className="text-gray-300 text-sm">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-white/20 pt-6">
                <h3 className="text-white font-semibold mb-3">System Status</h3>
                {systemStatus ? (
                  <pre className="text-xs text-gray-400 max-h-40 overflow-auto bg-white/10 p-3 rounded">
                    {JSON.stringify(systemStatus, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-500 text-sm">Loading system status...</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
