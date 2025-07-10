import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const openaiConfigured = !!process.env.OPENAI_API_KEY
    const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const fastApiConfigured = !!process.env.FASTAPI_URL

    // Test FastAPI connection with proper timeout handling
    let fastApiAvailable = false
    if (fastApiConfigured) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`${process.env.FASTAPI_URL}/health`, {
          method: "GET",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        fastApiAvailable = response.ok
      } catch (error) {
        console.warn("FastAPI not available:", error)
      }
    }

    const systemStatus = {
      ai: {
        openai: {
          configured: openaiConfigured,
          available: openaiConfigured,
        },
      },
      backend: {
        fastapi: {
          configured: fastApiConfigured,
          available: fastApiAvailable,
          url: process.env.FASTAPI_URL || "Not configured",
        },
        supabase: {
          configured: supabaseConfigured,
          available: supabaseConfigured,
        },
      },
      knowledgeBase: {
        initialized: true,
        destinations: true,
        budgetPlanning: true,
        itineraryPlanning: true,
      },
      system: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mode: openaiConfigured ? "Enhanced AI Mode" : "Local Mode",
      },
    }

    return NextResponse.json(systemStatus)
  } catch (error) {
    console.error("System status error:", error)
    return NextResponse.json({ error: "Failed to get system status" }, { status: 500 })
  }
}
