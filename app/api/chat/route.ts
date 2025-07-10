import { type NextRequest, NextResponse } from "next/server"
import { travelAgent } from "@/lib/langgraph"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    console.log("🎯 Processing chat request:", message)

    // Process the message with our travel agent
    const response = await travelAgent.processMessage(message, conversationHistory || [])

    return NextResponse.json({
      success: true,
      response: response,
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
