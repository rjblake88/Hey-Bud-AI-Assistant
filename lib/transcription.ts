import { addNote } from "./notes"
import { getAIProvider } from "./ai-service"

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const aiProvider = getAIProvider()

    // Convert Blob to ArrayBuffer for the AI SDK
    const arrayBuffer = await audioBlob.arrayBuffer()

    // Use the AI provider to transcribe the audio
    const transcript = await aiProvider.transcribeAudio(arrayBuffer)

    // Save the transcription as a note
    addNote(transcript)

    return transcript
  } catch (error) {
    console.error("Transcription error:", error)

    // If there's an API key error, propagate it up
    if (error instanceof Error && error.message.includes("OpenAI API key is missing")) {
      throw error
    }

    // For other errors, provide a generic message
    throw new Error("Failed to transcribe audio")
  }
}
