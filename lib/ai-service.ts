import { AI_CONFIG } from "./config"
import { NotebookProvider } from "./notebook-provider"

export interface AIProvider {
  transcribeAudio(audioBlob: Blob): Promise<string>
  analyzeText(text: string): Promise<string[]>
}

class ServerAPIProvider implements AIProvider {
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Create a FormData object to send the audio file
      const formData = new FormData()
      formData.append("audio", audioBlob, "audio.wav")

      // Send the audio to our server-side API route
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Transcription failed")
      }

      const data = await response.json()
      return data.text
    } catch (error) {
      console.error("Error transcribing audio:", error)
      throw new Error("Failed to transcribe audio: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  async analyzeText(text: string): Promise<string[]> {
    try {
      // Send the text to our server-side API route
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      return data.todos
    } catch (error) {
      console.error("Error analyzing text:", error)
      throw new Error("Failed to analyze text: " + (error instanceof Error ? error.message : String(error)))
    }
  }
}

export function getAIProvider(): AIProvider {
  switch (AI_CONFIG.provider) {
    case "openai":
      return new ServerAPIProvider()
    case "notebook":
      return new NotebookProvider()
    default:
      return new ServerAPIProvider() // Default to Server API
  }
}
