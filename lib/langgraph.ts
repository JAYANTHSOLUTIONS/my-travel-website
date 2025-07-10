// Enhanced Travel Agent with OpenAI Integration and Smart System Prompt
import { supabase, mockDestinations } from "./supabase"

interface ConversationState {
  messages: Array<{ role: string; content: string }>
  currentQuery: string
  userPreferences: {
    budget?: number
    duration?: number
    interests?: string[]
    travelStyle?: string
    lastMentionedDestination?: string
  }
  destinations: any[]
  context: string
}

const ARIA_SYSTEM_PROMPT = `You are ARIA, an intelligent travel assistant for the website Travel India AI.

🎯 Your mission is to:
- Help users explore India's destinations
- Recommend places, prices, categories (nature, adventure, heritage, spiritual, etc.)
- Plan itineraries, estimate costs, and give tips
- Use live destination data from the backend when available

👤 Personality:
- Warm, friendly, and talks like a helpful local guide
- Understands what user asked earlier (memory/context-aware)
- Don't repeat information unless asked
- Ask helpful follow-up questions when needed

🧠 Behavior:
- If a user mentions a place (e.g., Kerala), and later says "show dates", remember the previous place.
- Always format prices as ₹ and show categories, ratings, and tips in a clean style.
- Keep responses under 100 words unless user asks for more details.
- Never repeat the same intro twice unless the user resets.

🧾 Example output format:
🏛️ **{Destination Name}** in {Location}
💰 Starting at: ₹{Price} | ⭐ {Rating}/5.0 | 🏷️ {Category}

**Why Visit:**
{Short description or highlights}

**💡 Travel Tips:**
• {Tip 1}
• {Tip 2}

Always be helpful, natural, and context-aware.`

export class TravelAgent {
  private openaiApiKey: string | null
  private state: ConversationState
  private fastApiUrl: string

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || null
    this.fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000"
    this.state = {
      messages: [],
      currentQuery: "",
      userPreferences: {},
      destinations: [],
      context: "",
    }
  }

  async processMessage(message: string, conversationHistory: any[] = []): Promise<string> {
    console.log("🤖 TravelAgent processing with FastAPI backend:", message)

    // Update conversation state
    this.state.currentQuery = message
    this.state.messages = [
      ...conversationHistory.slice(-5), // Keep last 5 messages for context
      { role: "user", content: message },
    ]

    // Extract user preferences from conversation
    this.updateUserPreferences(message, conversationHistory)

    // Try to use FastAPI backend first
    try {
      const response = await this.queryFastAPI(message, conversationHistory)
      if (response) {
        console.log("✅ FastAPI response received")
        return response
      }
    } catch (error) {
      console.warn("⚠️ FastAPI unavailable, falling back to local processing:", error)
    }

    // Fallback to local processing
    return await this.executeLocalWorkflow()
  }

  private updateUserPreferences(message: string, conversationHistory: any[]): void {
    const messageLower = message.toLowerCase()

    // Extract budget
    const budgetMatch = message.match(/₹?(\d+(?:,\d+)*)/g)
    if (budgetMatch) {
      this.state.userPreferences.budget = Number.parseInt(budgetMatch[0].replace(/[₹,]/g, ""))
    }

    // Extract duration
    const durationMatch = message.match(/(\d+)\s*days?/i)
    if (durationMatch) {
      this.state.userPreferences.duration = Number.parseInt(durationMatch[1])
    }

    // Extract destination mentions
    const destinationKeywords = [
      "kerala",
      "goa",
      "rajasthan",
      "delhi",
      "mumbai",
      "agra",
      "jaipur",
      "himalayas",
      "manali",
      "rishikesh",
      "varanasi",
      "golden triangle",
      "taj mahal",
      "backwaters",
      "ladakh",
      "kashmir",
      "udaipur",
    ]

    for (const keyword of destinationKeywords) {
      if (messageLower.includes(keyword)) {
        this.state.userPreferences.lastMentionedDestination = keyword
        break
      }
    }

    // Extract interests
    const interests = []
    if (messageLower.includes("adventure")) interests.push("adventure")
    if (messageLower.includes("culture") || messageLower.includes("heritage")) interests.push("culture")
    if (messageLower.includes("food")) interests.push("food")
    if (messageLower.includes("beach")) interests.push("beach")
    if (messageLower.includes("mountain") || messageLower.includes("hill")) interests.push("mountain")
    if (messageLower.includes("spiritual") || messageLower.includes("temple")) interests.push("spiritual")
    if (messageLower.includes("nature") || messageLower.includes("wildlife")) interests.push("nature")

    if (interests.length > 0) {
      this.state.userPreferences.interests = interests
    }
  }

  private async queryFastAPI(message: string, conversationHistory: any[]): Promise<string | null> {
    try {
      const response = await fetch(`${this.fastApiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          conversation_history: conversationHistory.slice(-10), // Last 10 messages
          user_preferences: this.state.userPreferences,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          return data.response
        }
      }

      return null
    } catch (error) {
      console.error("❌ FastAPI connection error:", error)
      return null
    }
  }

  private async executeLocalWorkflow(): Promise<string> {
    try {
      // Step 1: Analyze user intent and extract preferences
      const intent = await this.analyzeIntent()
      console.log("🎯 Detected intent:", intent)

      // Step 2: Fetch relevant data from Supabase
      await this.gatherDestinationData(intent)

      // Step 3: Generate context-aware response
      const response = await this.generateResponse(intent)

      // Step 4: Update conversation state
      this.state.messages.push({ role: "assistant", content: response })

      return response
    } catch (error) {
      console.error("❌ Local workflow error:", error)
      return this.getFallbackResponse()
    }
  }

  private async analyzeIntent(): Promise<{
    type: string
    entities: string[]
    preferences: any
    contextual: boolean
  }> {
    const message = this.state.currentQuery.toLowerCase()

    // Check for contextual queries (referring to previous conversation)
    const contextualQueries = [
      "show dates",
      "when to visit",
      "best time",
      "weather",
      "climate",
      "how much",
      "cost",
      "price",
      "budget",
      "itinerary",
      "plan",
      "tell me more",
      "details",
      "more info",
    ]

    // Fix: Ensure boolean type
    const isContextual = Boolean(
      contextualQueries.some((query) => message.includes(query)) && this.state.userPreferences.lastMentionedDestination,
    )

    // Extract entities and preferences using simple NLP
    const entities = this.extractEntities(message)
    const preferences = this.extractPreferences(message)

    // Determine intent type with more specific patterns
    let type = "general"

    if (isContextual && this.state.userPreferences.lastMentionedDestination) {
      // User is asking about previously mentioned destination
      entities.push(this.state.userPreferences.lastMentionedDestination)
      if (message.includes("date") || message.includes("time") || message.includes("weather")) {
        type = "timing"
      } else if (message.includes("cost") || message.includes("budget") || message.includes("price")) {
        type = "budget"
      } else if (message.includes("plan") || message.includes("itinerary")) {
        type = "itinerary"
      } else {
        type = "destination"
      }
    } else if (message.includes("itinerary") || message.match(/plan (a|my|an)? (trip|visit|vacation|tour)/)) {
      type = "itinerary"
    } else if (message.match(/budget|cost|price|afford|expensive|cheap|money/)) {
      type = "budget"
    } else if (message.match(/food|eat|cuisine|restaurant|dish|meal/)) {
      type = "food"
    } else if (message.match(/culture|festival|tradition|celebration|event|history|heritage/)) {
      type = "culture"
    } else if (message.match(/weather|season|rain|temperature|climate|when to (go|visit)|best time/)) {
      type = "timing"
    } else if (entities.length > 0) {
      type = "destination"
    }

    console.log(`🔍 Intent detected: ${type}, Entities: ${entities.join(", ")}, Contextual: ${isContextual}`)
    return { type, entities, preferences, contextual: isContextual }
  }

  private extractEntities(message: string): string[] {
    const entities = []
    const destinationKeywords = [
      "delhi",
      "agra",
      "jaipur",
      "mumbai",
      "goa",
      "kerala",
      "rajasthan",
      "himalayas",
      "manali",
      "rishikesh",
      "varanasi",
      "golden triangle",
      "taj mahal",
      "backwaters",
      "beaches",
      "darjeeling",
      "ladakh",
      "kashmir",
      "udaipur",
      "jodhpur",
      "amritsar",
      "kolkata",
      "chennai",
      "bangalore",
      "hyderabad",
      "andaman",
      "lakshadweep",
      "sikkim",
      "meghalaya",
      "assam",
      "uttarakhand",
      "hampi",
      "khajuraho",
    ]

    for (const keyword of destinationKeywords) {
      if (message.includes(keyword)) {
        entities.push(keyword)
      }
    }

    return entities
  }

  private extractPreferences(message: string): any {
    const preferences: any = {}

    // Extract budget
    const budgetMatch = message.match(/₹?(\d+(?:,\d+)*)/g)
    if (budgetMatch) {
      preferences.budget = Number.parseInt(budgetMatch[0].replace(/[₹,]/g, ""))
    }

    // Extract duration
    const durationMatch = message.match(/(\d+)\s*days?/i)
    if (durationMatch) {
      preferences.duration = Number.parseInt(durationMatch[1])
    }

    // Extract interests
    const interests = []
    if (message.includes("adventure")) interests.push("adventure")
    if (message.includes("culture")) interests.push("culture")
    if (message.includes("food")) interests.push("food")
    if (message.includes("beach")) interests.push("beach")
    if (message.includes("mountain")) interests.push("mountain")
    if (message.includes("spiritual")) interests.push("spiritual")

    if (interests.length > 0) preferences.interests = interests

    return preferences
  }

  private async gatherDestinationData(intent: any): Promise<void> {
    try {
      // Try to fetch from FastAPI first
      try {
        const response = await fetch(`${this.fastApiUrl}/api/destinations?limit=20`)
        if (response.ok) {
          const data = await response.json()
          if (data.destinations && data.destinations.length > 0) {
            this.state.destinations = data.destinations
            console.log(`✅ Loaded ${data.destinations.length} destinations from FastAPI`)
            return
          }
        }
      } catch (error) {
        console.warn("⚠️ FastAPI destinations unavailable:", error)
      }

      // Try to fetch from Supabase directly
      if (supabase) {
        console.log("📊 Fetching from Supabase...")
        const { data: destinations } = await supabase.from("destinations").select("*").limit(20)

        if (destinations && destinations.length > 0) {
          this.state.destinations = destinations
          console.log(`✅ Loaded ${destinations.length} destinations from Supabase`)
          return
        }
      }

      // Fallback to mock data
      console.log("📊 Using mock data...")
      this.state.destinations = mockDestinations
    } catch (error) {
      console.error("❌ Data fetch error:", error)
      this.state.destinations = mockDestinations
    }
  }

  private async generateResponse(intent: any): Promise<string> {
    // Build context from destinations and conversation
    const context = this.buildContext(intent)

    if (this.openaiApiKey) {
      console.log("🚀 Using OpenAI API for response generation")
      return await this.generateWithOpenAI(context, intent)
    } else {
      console.log("⚡ Using enhanced local generation")
      return this.generateLocalResponse(context, intent)
    }
  }

  private buildContext(intent: any): string {
    const userPrefs = this.state.userPreferences
    const recentMessages = this.state.messages
      .slice(-3)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const context = `${ARIA_SYSTEM_PROMPT}

CURRENT CONVERSATION CONTEXT:
- User query: "${this.state.currentQuery}"
- Intent type: ${intent.type}
- Contextual query: ${intent.contextual ? "Yes" : "No"}
- Detected entities: ${intent.entities.join(", ") || "none"}
- User preferences: Budget: ₹${userPrefs.budget || "Not specified"}, Duration: ${userPrefs.duration || "Not specified"} days, Interests: ${userPrefs.interests?.join(", ") || "None"}, Last mentioned destination: ${userPrefs.lastMentionedDestination || "None"}

AVAILABLE DESTINATIONS DATA:
${this.state.destinations
  .slice(0, 10)
  .map(
    (dest) =>
      `- ${dest.name} in ${dest.location}, ${dest.state}: ${dest.description.substring(0, 100)}... (₹${dest.price_from}+ | Rating: ${dest.rating} | Category: ${dest.category})`,
  )
  .join("\n")}

RECENT CONVERSATION:
${recentMessages}

IMPORTANT GUIDELINES:
- Use the exact format specified in the system prompt
- Be context-aware and remember previous mentions
- Keep responses concise unless more details are requested
- Always include real data from the destinations provided
- Format prices as ₹ with proper formatting
- Use emojis as specified in the format`

    return context
  }

  private async generateWithOpenAI(context: string, intent: any): Promise<string> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: context,
            },
            {
              role: "user",
              content: this.state.currentQuery,
            },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content

      if (aiResponse) {
        console.log("✅ OpenAI response generated successfully")
        return aiResponse
      } else {
        throw new Error("No response from OpenAI")
      }
    } catch (error) {
      console.error("❌ OpenAI API error:", error)
      return this.generateLocalResponse(context, intent)
    }
  }

  private generateLocalResponse(context: string, intent: any): string {
    const { type, entities, preferences, contextual } = intent

    // Handle contextual queries
    if (contextual && this.state.userPreferences.lastMentionedDestination) {
      return this.generateContextualResponse(type, this.state.userPreferences.lastMentionedDestination)
    }

    switch (type) {
      case "destination":
        return this.generateDestinationResponse(entities, preferences)
      case "budget":
        return this.generateBudgetResponse(preferences)
      case "itinerary":
        return this.generateItineraryResponse(preferences)
      case "food":
        return this.generateFoodResponse()
      case "culture":
        return this.generateCultureResponse()
      case "timing":
        return this.generateTimingResponse(entities)
      default:
        return this.generateGeneralResponse()
    }
  }

  private generateContextualResponse(type: string, destination: string): string {
    // Find the destination in our data
    const dest = this.state.destinations.find(
      (d) =>
        d.name.toLowerCase().includes(destination) ||
        d.location.toLowerCase().includes(destination) ||
        d.state.toLowerCase().includes(destination),
    )

    if (!dest) {
      return `I remember you asked about ${destination}. Let me get more specific information about that destination for you.`
    }

    switch (type) {
      case "timing":
        return this.generateTimingForDestination(dest)
      case "budget":
        return this.generateBudgetForDestination(dest)
      case "itinerary":
        return this.generateItineraryForDestination(dest)
      default:
        return this.generateDestinationDetails(dest)
    }
  }

  private generateTimingForDestination(dest: any): string {
    const timingInfo = this.getDestinationTiming(dest)
    return `🌤️ **Best time for ${dest.name}:**

${timingInfo}

💰 Starting at: ₹${dest.price_from.toLocaleString()} | ⭐ ${dest.rating}/5.0`
  }

  private generateBudgetForDestination(dest: any): string {
    const budget = this.state.userPreferences.budget || 30000
    const duration = this.state.userPreferences.duration || 5
    const dailyBudget = Math.round(budget / duration)

    return `💰 **Budget for ${dest.name}:**

Starting at: ₹${dest.price_from.toLocaleString()}+ per person
Your budget: ₹${budget.toLocaleString()} (₹${dailyBudget.toLocaleString()}/day)

${budget >= dest.price_from ? "✅ Perfect fit for your budget!" : "⚠️ Might need budget adjustment"}

**💡 Tips:**
• Book 2-3 weeks ahead for better rates
• Consider shoulder season for savings`
  }

  private generateDestinationResponse(entities: string[], preferences: any): string {
    // Find matching destinations from real data
    const matchingDestinations = this.state.destinations.filter((dest) =>
      entities.some(
        (entity) =>
          dest.name.toLowerCase().includes(entity) ||
          dest.location.toLowerCase().includes(entity) ||
          dest.state.toLowerCase().includes(entity) ||
          dest.category.toLowerCase().includes(entity),
      ),
    )

    if (matchingDestinations.length > 0) {
      const dest = matchingDestinations[0]
      return this.generateDestinationDetails(dest)
    }

    // If no specific match, show general recommendations
    const topDestinations = this.state.destinations.sort((a, b) => b.rating - a.rating).slice(0, 3)

    const destList = topDestinations
      .map((dest) => `• **${dest.name}** (${dest.location}) - ₹${dest.price_from.toLocaleString()}+ | ⭐${dest.rating}`)
      .join("\n")

    return `🇮🇳 **Top destinations:**

${destList}

Which interests you? 🎯`
  }

  private generateDestinationDetails(dest: any): string {
    return `🏛️ **${dest.name}** in ${dest.location}
💰 Starting at: ₹${dest.price_from.toLocaleString()} | ⭐ ${dest.rating}/5.0 | 🏷️ ${dest.category}

**Why Visit:**
${dest.description.substring(0, 120)}...

**💡 Travel Tips:**
${this.getDestinationTips(dest)}

Need itinerary or timing details? 🎯`
  }

  private generateBudgetResponse(preferences: any): string {
    const budget = preferences.budget || this.state.userPreferences.budget || 50000
    const duration = preferences.duration || this.state.userPreferences.duration || 7

    // Find destinations within budget
    const affordableDestinations = this.state.destinations
      .filter((dest) => dest.price_from <= budget)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)

    const destList = affordableDestinations
      .map((dest) => `• **${dest.name}** - ₹${dest.price_from.toLocaleString()}+ | ⭐${dest.rating}`)
      .join("\n")

    return `💰 **Budget ₹${budget.toLocaleString()} for ${duration} days:**

${destList}

**💡 Budget Tips:**
• Accommodation: 35% (₹${Math.round(budget * 0.35).toLocaleString()})
• Food & Transport: 50% (₹${Math.round(budget * 0.5).toLocaleString()})
• Activities: 15% (₹${Math.round(budget * 0.15).toLocaleString()})

Which destination interests you? 🎯`
  }

  private generateItineraryResponse(preferences: any): string {
    const duration = preferences.duration || this.state.userPreferences.duration || 7
    const budget = preferences.budget || this.state.userPreferences.budget || 40000

    // Select destinations based on budget and rating
    const selectedDestinations = this.state.destinations
      .filter((dest) => dest.price_from <= budget * 0.7)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, Math.min(3, Math.ceil(duration / 2)))

    if (selectedDestinations.length === 0) {
      return "Tell me your budget and interests for a perfect itinerary! 🎯"
    }

    const itinerary = selectedDestinations
      .map((dest, index) => {
        const days = Math.floor(duration / selectedDestinations.length)
        return `**Days ${index * days + 1}-${(index + 1) * days}: ${dest.name}**
₹${dest.price_from.toLocaleString()}+ | ⭐${dest.rating} | ${dest.category}`
      })
      .join("\n\n")

    return `📅 **${duration}-day itinerary:**

${itinerary}

**💡 Pro tip:** Book trains early for better prices!

Need specific destination details? 🎯`
  }

  private generateGeneralResponse(): string {
    const featuredDestinations = this.state.destinations
      .filter((dest) => dest.featured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)

    if (featuredDestinations.length === 0) {
      return `🇮🇳 **Welcome to ARIA!**

I'm your India travel assistant. Ask me about:
• Destinations & prices
• Budget planning  
• Itineraries
• Best travel times

What interests you? 🎯`
    }

    const destList = featuredDestinations
      .map((dest) => `• **${dest.name}** (${dest.location}) - ₹${dest.price_from.toLocaleString()}+ | ⭐${dest.rating}`)
      .join("\n")

    return `🇮🇳 **Featured destinations:**

${destList}

What would you like to explore? 🎯`
  }

  private getDestinationTips(dest: any): string {
    const tips: Record<string, string> = {
      Heritage: "• Visit early morning\n• Hire local guides\n• Respect photography rules",
      Nature: "• Comfortable shoes essential\n• Best in pleasant weather\n• Book eco-stays",
      Beach: "• Sunscreen mandatory\n• Try local seafood\n• Respect dress codes",
      Spiritual: "• Dress modestly\n• Remove shoes at temples\n• Maintain silence",
      Adventure: "• Book activities ahead\n• Check weather\n• Follow safety rules",
    }

    return tips[dest.category] || "• Plan ahead\n• Try local experiences\n• Stay flexible"
  }

  private getDestinationTiming(dest: any): string {
    // Simplified timing based on location/state
    const state = dest.state.toLowerCase()

    if (state.includes("rajasthan") || state.includes("delhi") || state.includes("uttar pradesh")) {
      return "**Best:** Oct-Mar (cool & pleasant)\n**Avoid:** May-Jun (extreme heat)"
    } else if (state.includes("kerala") || state.includes("tamil nadu") || state.includes("karnataka")) {
      return "**Best:** Nov-Feb (comfortable)\n**Monsoon:** Jun-Sep (heavy rain)"
    } else if (state.includes("himachal") || state.includes("uttarakhand")) {
      return "**Best:** Mar-Jun, Sep-Nov\n**Winter:** Dec-Feb (snow, cold)"
    } else if (state.includes("goa")) {
      return "**Best:** Nov-Feb (perfect beach weather)\n**Avoid:** Jun-Sep (monsoon)"
    }

    return "**Best:** Oct-Mar (generally pleasant)\n**Check:** Local weather patterns"
  }

  private generateTimingResponse(entities: string[]): string {
    if (entities.length > 0) {
      const dest = this.state.destinations.find((d) =>
        entities.some((entity) => d.name.toLowerCase().includes(entity) || d.location.toLowerCase().includes(entity)),
      )

      if (dest) {
        return this.generateTimingForDestination(dest)
      }
    }

    return `🌤️ **India travel timing:**

**🏙️ North (Delhi, Rajasthan):** Oct-Mar
**🏝️ South (Kerala, Goa):** Nov-Feb  
**🏔️ Mountains:** Mar-Jun, Sep-Nov
**🏖️ Beaches:** Nov-Feb

Which region interests you? 🎯`
  }

  private generateFoodResponse(): string {
    return `🍽️ **Indian cuisine highlights:**

**🌶️ North:** Butter Chicken, Naan, Kebabs
**🥥 South:** Dosa, Idli, Coconut Curry
**🦐 Coastal:** Fish Curry, Seafood

**💡 Food tips:**
• Try thalis for variety
• Street food at busy places
• Start mild, build spice tolerance

Which region's food interests you? 🍛`
  }

  private generateCultureResponse(): string {
    return `🎭 **Cultural experiences:**

**🎊 Festivals:** Diwali (Oct-Nov), Holi (Mar)
**🏛️ Heritage:** Rajasthan palaces, Kerala arts
**🎨 Crafts:** Block printing, weaving

**💡 Culture tips:**
• Dress modestly at temples
• Ask before photographing
• Learn basic local greetings

Which cultural aspect interests you? 🪔`
  }

  private generateItineraryForDestination(dest: any): string {
    const duration = this.state.userPreferences.duration || 3

    return `📅 **${duration}-day ${dest.name} plan:**

**Day 1-2:** Arrival & main attractions
**Day ${duration > 2 ? "3+" : "2"}:** Local experiences & departure

💰 Budget: ₹${dest.price_from.toLocaleString()}+ per person
⭐ Rating: ${dest.rating}/5.0

Need detailed day-wise plan? 🎯`
  }

  private getFallbackResponse(): string {
    return `🤖 I'm here to help with India travel!

Ask me about:
• Destinations & prices
• Budget planning
• Itineraries  
• Best times to visit

What would you like to know? 🎯`
  }
}

export const travelAgent = new TravelAgent()
