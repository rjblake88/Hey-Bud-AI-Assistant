import { NextResponse } from "next/server"
import { OpenAI } from "openai"

export async function POST(request: Request) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY

    // Check if we have an API key from environment variables
    if (!apiKey) {
      // Try to get the API key from the request headers
      const authHeader = request.headers.get("Authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "OpenAI API key is missing. Please set your API key." }, { status: 401 })
      }
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey || request.headers.get("Authorization")?.replace("Bearer ", "") || "",
    })

    // Get the text and voice from the request
    const { text, voice = "alloy" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Validate voice parameter
    const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
    const selectedVoice = validVoices.includes(voice) ? voice : "alloy"

    // Generate speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: selectedVoice,
      input: text,
    })

    // Convert to ArrayBuffer
    const buffer = await mp3.arrayBuffer()

    // Return the audio as a response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json(
      { error: "Failed to generate speech: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
