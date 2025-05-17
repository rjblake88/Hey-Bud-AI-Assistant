// Web speech synthesis service

interface SpeechOptions {
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
}

class SpeechService {
  private options: SpeechOptions = {
    voice: "default",
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  }
  private isSpeaking = false
  private audioElement: HTMLAudioElement | null = null

  constructor() {
    // Initialize audio element
    if (typeof window !== "undefined") {
      this.audioElement = new Audio()
    }
  }

  // Set speech options
  setOptions(options: Partial<SpeechOptions>): void {
    this.options = { ...this.options, ...options }
  }

  // Get current options
  getOptions(): SpeechOptions {
    return { ...this.options }
  }

  // Speak text using OpenAI's TTS API via our server endpoint
  async speak(text: string, options?: Partial<SpeechOptions>): Promise<void> {
    if (!text || typeof text !== "string" || !text.trim()) {
      console.warn("Speech service: Empty or invalid text provided")
      return
    }

    // Stop any current speech
    this.stop()

    // Apply temporary options if provided
    const currentOptions = options ? { ...this.options, ...options } : this.options

    try {
      // Get API key from localStorage if available
      const apiKey = typeof window !== "undefined" ? localStorage.getItem("openai-api-key") : null

      // Prepare headers
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      // Add API key to headers if available
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`
      }

      // Request speech audio from our server API
      const response = await fetch("/api/speech", {
        method: "POST",
        headers,
        body: JSON.stringify({
          text,
          voice: currentOptions.voice,
        }),
      })

      if (!response.ok) {
        throw new Error(`Speech synthesis failed: ${response.status} ${response.statusText}`)
      }

      // Get the audio blob
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Play the audio
      if (this.audioElement) {
        this.audioElement.src = audioUrl
        this.audioElement.rate = currentOptions.rate || 1.0
        this.audioElement.volume = currentOptions.volume || 1.0

        this.isSpeaking = true

        // Clean up when done
        this.audioElement.onended = () => {
          this.isSpeaking = false
          URL.revokeObjectURL(audioUrl)
        }

        await this.audioElement.play()
      }
    } catch (error) {
      console.error("Speech synthesis error:", error)
      this.isSpeaking = false
    }
  }

  // Stop speaking
  stop(): void {
    if (this.audioElement && this.isSpeaking) {
      this.audioElement.pause()
      this.audioElement.currentTime = 0
      this.isSpeaking = false
    }
  }

  // Check if currently speaking
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking
  }
}

// Create a singleton instance
let speechServiceInstance: SpeechService | null = null

export function getSpeechService(): SpeechService {
  if (!speechServiceInstance) {
    speechServiceInstance = new SpeechService()
  }
  return speechServiceInstance
}
