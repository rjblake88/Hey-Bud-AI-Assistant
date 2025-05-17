import { NextResponse } from "next/server"
import { OpenAI } from "openai"

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json({ valid: false, error: "API key is required" }, { status: 400 })
    }

    // Validate the API key by making a simple request to OpenAI
    const openai = new OpenAI({ apiKey })

    try {
      // Make a simple request to validate the API key
      await openai.models.list()

      // If we get here, the API key is valid
      return NextResponse.json({ valid: true })
    } catch (error) {
      console.error("Error validating OpenAI API key:", error)
      return NextResponse.json({ valid: false, error: "Invalid API key" })
    }
  } catch (error) {
    console.error("Error in validate-api-key route:", error)
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 })
  }
}
