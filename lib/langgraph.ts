export class TravelAgent {
  private conversationHistory: Array<{ role: string; content: string }> = []

  constructor() {
    // Initialization if needed
  }

  // This is the key method called from the API route
  async processMessage(message: string, conversationHistory: Array<{ role: string; content: string }>): Promise<string> {
    console.log("🤖 TravelAgent received message:", message)
    // Store last few conversation messages + current user message
    this.conversationHistory = [...(conversationHistory || []).slice(-5), { role: "user", content: message }]

    // For demo, just echo back the message with a simple prefix
    const reply = `You said: "${message}". How can I help you further with your travel plans?`

    // Normally here you'd add AI calls, data fetches, etc.

    // Add the assistant's reply to history for future context
    this.conversationHistory.push({ role: "assistant", content: reply })

    return reply
  }
}

// Export a single instance to share across requests
export const travelAgent = new TravelAgent()
