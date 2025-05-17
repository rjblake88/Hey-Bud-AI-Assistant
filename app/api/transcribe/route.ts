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

    // Get the form data from the request
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Use the OpenAI API for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    })

    return NextResponse.json({ text: transcription.text })
  } catch (error) {
    console.error("Error transcribing audio:", error)
    return NextResponse.json(
      { error: "Failed to transcribe audio: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
