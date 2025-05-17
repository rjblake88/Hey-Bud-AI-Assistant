// AI configuration

export const AI_CONFIG = {
  provider: "openai", // "openai" | "notebook" | "local"
  models: {
    text: "gpt-4o",
    transcription: "whisper-1",
    tts: "tts-1",
  },
  voices: {
    default: "alloy", // alloy, echo, fable, onyx, nova, shimmer
  },
  settings: {
    temperature: 0.7,
    speechRate: 1.0,
    offlineMode: false,
  },
}
