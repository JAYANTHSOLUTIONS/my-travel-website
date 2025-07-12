import { type NextRequest, NextResponse } from "next/server"

// Reject GET requests, only allow POST
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method GET not allowed. Use POST instead." },
    { status: 405 }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    console.log("🎯 Forwarding message to FastAPI:", message)

    const fastApiResponse = await fetch("http://127.0.0.1:8000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message }),
    })

    if (!fastApiResponse.ok) {
      const errorText = await fastApiResponse.text()
      throw new Error(`FastAPI error (${fastApiResponse.status}): ${errorText}`)
    }

    const data = await fastApiResponse.json()

    return NextResponse.json({
      success: true,
      response: data.response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Chat API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process your request. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
