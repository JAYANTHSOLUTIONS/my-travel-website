"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle, Key, Zap, ExternalLink, Copy, Brain } from "lucide-react"

const aiAPIs = [
  {
    name: "OpenAI",
    description: "Most advanced AI with GPT-3.5/GPT-4 models",
    freeTier: "$5 free credits",
    signupUrl: "https://platform.openai.com/",
    steps: [
      "Sign up at platform.openai.com",
      "Go to API Keys section",
      "Create new secret key",
      "Copy the key (starts with 'sk-')",
    ],
    envVar: "OPENAI_API_KEY",
    recommended: true,
    note: "Best for intelligent travel recommendations",
  },
  {
    name: "Hugging Face",
    description: "Free AI models and inference API",
    freeTier: "1000 requests/month",
    signupUrl: "https://huggingface.co/",
    steps: [
      "Sign up at huggingface.co",
      "Go to Settings > Access Tokens",
      "Create new token",
      "Copy the token (starts with 'hf_')",
    ],
    envVar: "HUGGINGFACE_API_KEY",
    recommended: false,
  },
  {
    name: "OpenRouter",
    description: "Access multiple AI models with free credits",
    freeTier: "$1 free credits",
    signupUrl: "https://openrouter.ai/",
    steps: ["Sign up at openrouter.ai", "Go to Keys section", "Create API key", "Copy the key (starts with 'sk-or-')"],
    envVar: "OPENROUTER_API_KEY",
    recommended: false,
  },
]

export default function FreeAPISetup() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState<string | null>(null)

  const handleKeyChange = (provider: string, key: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }))
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const generateEnvFile = () => {
    const envContent = Object.entries(apiKeys)
      .filter(([_, key]) => key.trim())
      .map(([provider, key]) => {
        const envVar = aiAPIs.find((api) => api.name.toLowerCase() === provider)?.envVar
        return `${envVar}=${key}`
      })
      .join("\n")

    return envContent || "# Add your API keys here\n# OPENAI_API_KEY=your_openai_key_here"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-400/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            OpenAI Integration - Intelligent Travel Assistant!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Upgrade ARIA with OpenAI's powerful GPT models for intelligent travel recommendations, personalized
            itineraries, and smart budget planning. Connect to FastAPI backend for live database integration!
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="border-blue-400 text-blue-400 bg-blue-400/10">
              🧠 Smart AI
            </Badge>
            <Badge variant="outline" className="border-green-400 text-green-400 bg-green-400/10">
              🔗 FastAPI Backend
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400 bg-purple-400/10">
              📊 Live Database
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* API Providers */}
      <div className="grid gap-4">
        {aiAPIs.map((api) => (
          <Card key={api.name} className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {api.name}
                      {api.recommended && (
                        <Badge variant="outline" className="border-green-400 text-green-400 bg-green-400/10 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-gray-400 text-sm">{api.description}</p>
                    {api.note && <p className="text-blue-400 text-xs mt-1">💡 {api.note}</p>}
                  </div>
                </div>
                <Badge variant="outline" className="border-cyan-400 text-cyan-400 bg-cyan-400/10">
                  {api.freeTier}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Steps */}
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">Quick Setup:</h4>
                <ol className="space-y-1">
                  {api.steps.map((step, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Your API Key:</label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder={`Enter your ${api.name} API key...`}
                    value={apiKeys[api.name.toLowerCase()] || ""}
                    onChange={(e) => handleKeyChange(api.name.toLowerCase(), e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button
                    onClick={() => window.open(api.signupUrl, "_blank")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Environment Variables */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Environment Variables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm">
            Create a <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code> file in your project root and add
            your API keys:
          </p>

          <div className="bg-black/30 p-4 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Contents of .env.local:</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(generateEnvFile(), "env-file")}
                className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 bg-transparent"
              >
                {copied === "env-file" ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <pre className="text-cyan-400 text-sm font-mono whitespace-pre-wrap">{generateEnvFile()}</pre>
          </div>

          <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">🚀 FastAPI Backend Setup:</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>
                • Add the same API keys to your <code className="bg-gray-700 px-1 rounded">.env.fastapi</code> file
              </li>
              <li>
                • Start FastAPI backend: <code className="bg-gray-700 px-1 rounded">python start_fastapi.py</code>
              </li>
              <li>• ARIA will automatically connect to FastAPI for enhanced responses</li>
              <li>• Fallback to local processing if FastAPI is unavailable</li>
            </ul>
          </div>

          <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
            <h4 className="text-green-400 font-medium mb-2">💡 Pro Tips:</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>
                • Start with <strong>OpenAI</strong> - it provides the most intelligent responses
              </li>
              <li>• Keep your API keys secret - never share them publicly</li>
              <li>• Restart your development server after adding environment variables</li>
              <li>• OpenAI offers $5 free credits for new accounts</li>
              <li>• FastAPI backend provides live database integration</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Features */}
      <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-xl border border-green-400/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Enhanced Features with OpenAI + FastAPI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            When you configure OpenAI and run the FastAPI backend, ARIA becomes incredibly powerful:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-white font-medium">🧠 AI-Powered Features</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Intelligent intent analysis</li>
                <li>• Personalized recommendations</li>
                <li>• Smart budget optimization</li>
                <li>• Context-aware responses</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-medium">📊 Database Integration</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Live destination data</li>
                <li>• Real-time pricing</li>
                <li>• Smart search & filtering</li>
                <li>• Analytics & insights</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              ✨ <strong>Best Experience:</strong> OpenAI + FastAPI + Supabase = Intelligent travel assistant with live
              data!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* No API Fallback */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-400/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            Don't Want to Set Up APIs? No Problem!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            ARIA works great even without API keys! It uses an enhanced knowledge base with detailed information about:
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="text-white font-medium">🏛️ Destinations</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Golden Triangle tours</li>
                <li>• Kerala backwaters</li>
                <li>• Rajasthan palaces</li>
                <li>• Himalayan adventures</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-medium">💰 Planning</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Budget breakdowns</li>
                <li>• Itinerary planning</li>
                <li>• Best travel times</li>
                <li>• Money-saving tips</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-900/20 border border-green-400/30 rounded-lg">
            <p className="text-green-400 text-sm">
              ✅ <strong>Ready to use right now!</strong> Just start chatting with ARIA - no setup required!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
