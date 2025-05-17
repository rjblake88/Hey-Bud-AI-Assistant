// Native speech synthesis service for mobile apps

import { getSpeechService } from "./speech-service"

interface NativeSpeechOptions {
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
}

class NativeSpeechService {
  private options: NativeSpeechOptions = {
    voice: "default",
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  }
  private isAvailable = false
  private fallbackService = getSpeechService()

  constructor() {
    // Check if we're in a Capacitor environment
    this.checkAvailability()
  }

  private async checkAvailability(): Promise<boolean> {
    try {
      // Check if we're running in a Capacitor environment
      if (typeof (window as any).Capacitor !== "undefined") {
        // We're in a Capacitor app
        this.isAvailable = true
        console.log("Native speech synthesis is available")
        return true
      }
    } catch (error) {
      console.warn("Native speech synthesis not available:", error)
    }

    this.isAvailable = false
    return false
  }

  // Set speech options
  setOptions(options: Partial<NativeSpeechOptions>): void {
    this.options = { ...this.options, ...options }
    // Also update fallback service
    this.fallbackService.setOptions(options)
  }

  // Get current options
  getOptions(): NativeSpeechOptions {
    return { ...this.options }
  }

  // Speak text using native capabilities when available
  async speak(text: string, options?: Partial<NativeSpeechOptions>): Promise<void> {
    if (!text || typeof text !== "string" || !text.trim()) {
      console.warn("Speech service: Empty or invalid text provided")
      return
    }

    // Apply temporary options if provided
    const currentOptions = options ? { ...this.options, ...options } : this.options

    try {
      if (this.isAvailable) {
        // Use native TTS if available
        await this.nativeSpeak(text, currentOptions)
      } else {
        // Fall back to web implementation
        await this.fallbackService.speak(text, currentOptions)
      }
    } catch (error) {
      console.error("Speech synthesis error:", error)
      // Try fallback if native fails
      if (this.isAvailable) {
        await this.fallbackService.speak(text, currentOptions)
      }
    }
  }

  // Stop speaking
  stop(): void {
    try {
      if (this.isAvailable) {
        // Stop native TTS
        this.nativeStop()
      }
    } catch (error) {
      console.error("Error stopping speech:", error)
    }

    // Also stop fallback service
    this.fallbackService.stop()
  }

  // Use native TTS capabilities
  private async nativeSpeak(text: string, options: NativeSpeechOptions): Promise<void> {
    try {
      // Check if we have the TextToSpeech plugin from Capacitor community
      if (typeof (window as any).Capacitor !== "undefined" && (window as any).Capacitor.Plugins.TextToSpeech) {
        const TTSPlugin = (window as any).Capacitor.Plugins.TextToSpeech

        await TTSPlugin.speak({
          text: text,
          lang: "en-US",
          rate: options.rate || 1.0,
          pitch: options.pitch || 1.0,
          volume: options.volume || 1.0,
          category: "ambient",
        })

        return
      }

      // If we don't have the plugin, use Android's native TTS via a custom plugin or interface
      if (typeof (window as any).Android !== "undefined" && (window as any).Android.textToSpeech) {
        ;(window as any).Android.textToSpeech(text, options.rate || 1.0)
        return
      }

      throw new Error("Native TTS not available")
    } catch (error) {
      console.error("Native speech error:", error)
      throw error
    }
  }

  // Stop native TTS
  private nativeStop(): void {
    try {
      // Check if we have the TextToSpeech plugin
      if (typeof (window as any).Capacitor !== "undefined" && (window as any).Capacitor.Plugins.TextToSpeech) {
        const TTSPlugin = (window as any).Capacitor.Plugins.TextToSpeech
        TTSPlugin.stop()
        return
      }

      // If we don't have the plugin, use Android's native interface
      if (typeof (window as any).Android !== "undefined" && (window as any).Android.stopTextToSpeech) {
        ;(window as any).Android.stopTextToSpeech()
        return
      }
    } catch (error) {
      console.error("Error stopping native speech:", error)
    }
  }
}

// Create a singleton instance
let nativeSpeechServiceInstance: NativeSpeechService | null = null

export function getNativeSpeechService(): NativeSpeechService {
  if (!nativeSpeechServiceInstance) {
    nativeSpeechServiceInstance = new NativeSpeechService()
  }
  return nativeSpeechServiceInstance
}
