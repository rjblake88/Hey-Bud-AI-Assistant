// Native audio recording service for mobile apps

interface RecordingOptions {
  maxDuration?: number // in milliseconds
  quality?: "low" | "medium" | "high"
}

class NativeRecorderService {
  private isRecording = false
  private isAvailable = false

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
        console.log("Native audio recording is available")
        return true
      }
    } catch (error) {
      console.warn("Native audio recording not available:", error)
    }

    this.isAvailable = false
    return false
  }

  // Start recording audio
  async startRecording(options?: RecordingOptions): Promise<void> {
    if (this.isRecording) {
      console.warn("Already recording")
      return
    }

    try {
      if (this.isAvailable) {
        // Use native recording if available
        await this.nativeStartRecording(options)
        this.isRecording = true
      } else {
        throw new Error("Native recording not available")
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      throw error
    }
  }

  // Stop recording and get the audio data
  async stopRecording(): Promise<Blob> {
    if (!this.isRecording) {
      console.warn("Not recording")
      throw new Error("Not recording")
    }

    try {
      if (this.isAvailable) {
        // Use native recording if available
        const audioData = await this.nativeStopRecording()
        this.isRecording = false
        return audioData
      } else {
        throw new Error("Native recording not available")
      }
    } catch (error) {
      console.error("Error stopping recording:", error)
      this.isRecording = false
      throw error
    }
  }

  // Check if recording is in progress
  isCurrentlyRecording(): boolean {
    return this.isRecording
  }

  // Use native recording capabilities
  private async nativeStartRecording(options?: RecordingOptions): Promise<void> {
    try {
      // Check if we have the Voice Recorder plugin from Capacitor community
      if (typeof (window as any).Capacitor !== "undefined" && (window as any).Capacitor.Plugins.VoiceRecorder) {
        const VoiceRecorder = (window as any).Capacitor.Plugins.VoiceRecorder

        // Request permissions first
        const permissions = await VoiceRecorder.requestAudioRecordingPermission()
        if (!permissions.value) {
          throw new Error("Permission to record audio was denied")
        }

        await VoiceRecorder.startRecording({
          mimeType: "audio/wav",
          bitRate: options?.quality === "high" ? 128000 : options?.quality === "medium" ? 64000 : 32000,
          sampleRate: options?.quality === "high" ? 44100 : options?.quality === "medium" ? 22050 : 16000,
          maxDuration: options?.maxDuration || 30000, // Default to 30 seconds
        })

        return
      }

      // If we don't have the plugin, use Android's native interface
      if (typeof (window as any).Android !== "undefined" && (window as any).Android.startRecording) {
        ;(window as any).Android.startRecording(options?.maxDuration || 30000)
        return
      }

      throw new Error("Native recording not available")
    } catch (error) {
      console.error("Native recording error:", error)
      throw error
    }
  }

  // Stop native recording and get the audio data
  private async nativeStopRecording(): Promise<Blob> {
    try {
      // Check if we have the Voice Recorder plugin
      if (typeof (window as any).Capacitor !== "undefined" && (window as any).Capacitor.Plugins.VoiceRecorder) {
        const VoiceRecorder = (window as any).Capacitor.Plugins.VoiceRecorder

        const result = await VoiceRecorder.stopRecording()
        const { value } = result

        // Convert base64 to Blob
        const byteCharacters = atob(value.recordDataBase64)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        return new Blob([byteArray], { type: "audio/wav" })
      }

      // If we don't have the plugin, use Android's native interface
      if (typeof (window as any).Android !== "undefined" && (window as any).Android.stopRecording) {
        const base64Audio = (window as any).Android.stopRecording()

        // Convert base64 to Blob
        const byteCharacters = atob(base64Audio)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        return new Blob([byteArray], { type: "audio/wav" })
      }

      throw new Error("Native recording not available")
    } catch (error) {
      console.error("Error stopping native recording:", error)
      throw error
    }
  }
}

// Create a singleton instance
let nativeRecorderServiceInstance: NativeRecorderService | null = null

export function getNativeRecorderService(): NativeRecorderService {
  if (!nativeRecorderServiceInstance) {
    nativeRecorderServiceInstance = new NativeRecorderService()
  }
  return nativeRecorderServiceInstance
}
