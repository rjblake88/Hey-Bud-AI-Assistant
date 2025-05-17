"use client"

import { useState, useRef } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { transcribeAudio } from "@/lib/transcription"
import { analyzeText } from "@/lib/analysis"

export default function VoiceRecorder() {
  const { toast } = useToast()
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.start()
      setIsListening(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isListening) {
          stopRecording()
        }
      }, 30000)
    } catch (error) {
      console.error("Error starting recording:", error)

      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = async () => {
    setIsListening(false)
    setIsProcessing(true)

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()

        // Stop all audio tracks
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())

        // Wait for chunks to be collected
        await new Promise<void>((resolve) => {
          mediaRecorderRef.current!.onstop = () => resolve()
        })

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })

        try {
          // Transcribe the audio
          const transcription = await transcribeAudio(audioBlob)
          setTranscript(transcription)

          // Analyze the transcription to extract notes and todos
          await analyzeText(transcription)

          toast({
            title: "Processing complete",
            description: "Your note has been saved and analyzed.",
          })
        } catch (error) {
          console.error("Error processing audio:", error)

          // Check if the error is related to the OpenAI API key
          const errorMessage = error instanceof Error ? error.message : String(error)
          if (errorMessage.includes("OpenAI API key is missing")) {
            toast({
              title: "API Key Missing",
              description: "Please set your OpenAI API key in the environment variables.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Processing Error",
              description: "There was an error processing your recording.",
              variant: "destructive",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error stopping recording:", error)

      toast({
        title: "Recording Error",
        description: "There was an error with the recording.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setRecordingTime(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Card className="w-full p-4 flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-md">
        <div className="relative mb-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening ? "bg-red-100 dark:bg-red-900 animate-pulse" : "bg-slate-100 dark:bg-slate-700"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="h-8 w-8 text-slate-500 dark:text-slate-300 animate-spin" />
            ) : isListening ? (
              <Mic className="h-8 w-8 text-red-500" />
            ) : (
              <Mic className="h-8 w-8 text-slate-500 dark:text-slate-300" />
            )}
          </div>

          {isListening && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 animate-pulse">
              {formatTime(recordingTime)}
            </Badge>
          )}
        </div>

        <div className="text-center mb-4">
          {isListening ? (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Listening... Say your note clearly</p>
          ) : isProcessing ? (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Processing your recording...</p>
          ) : (
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Press the button to start recording
            </p>
          )}
        </div>

        {isListening ? (
          <Button variant="destructive" size="sm" onClick={stopRecording} className="flex items-center">
            <MicOff className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        ) : (
          !isProcessing && (
            <Button variant="default" size="sm" onClick={startRecording} className="flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </Button>
          )
        )}

        {transcript && !isListening && !isProcessing && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-md w-full">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Last transcription:</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{transcript}</p>
          </div>
        )}
      </Card>
    </div>
  )
}
