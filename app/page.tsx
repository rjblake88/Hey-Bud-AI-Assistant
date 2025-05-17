"use client"

import { useState, useEffect } from "react"
import { List, FileText, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VoiceRecorder from "@/components/voice-recorder"
import NotesList from "@/components/notes-list"
import TodoList from "@/components/todo-list"
import AgentControls from "@/components/agent-controls"
import AISettings from "@/components/ai-settings"
import { ThemeProvider } from "@/components/theme-provider"
import useMobile from "@/hooks/use-mobile"
import ApiKeyPrompt from "@/components/api-key-prompt"
import MobileAppWrapper from "@/components/mobile-app-wrapper"

export default function Home() {
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState("notes")
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false)

  // Check if the API key is set on component mount
  useEffect(() => {
    // Check if we have a stored API key
    if (typeof window !== "undefined") {
      const apiKey = localStorage.getItem("openai-api-key")
      if (apiKey) {
        console.log("OpenAI API key found in localStorage")
        setShowApiKeyPrompt(false)
      } else {
        // Check if the API key is available on the server
        checkApiKeyAvailability()
      }
    }
  }, [])

  // Check if the API key is available on the server
  const checkApiKeyAvailability = async () => {
    try {
      const response = await fetch("/api/check-api-key")
      const data = await response.json()

      if (data.available) {
        console.log("OpenAI API key available on server")
        setShowApiKeyPrompt(false)
      } else {
        console.log("No OpenAI API key found, showing prompt")
        setShowApiKeyPrompt(true)
      }
    } catch (error) {
      console.error("Error checking API key availability:", error)
      setShowApiKeyPrompt(true)
    }
  }

  const handleApiKeySubmit = async (apiKey: string) => {
    console.log("API key submitted by user")

    try {
      // Send the API key to the server to validate
      const response = await fetch("/api/validate-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (data.valid) {
        // Store the API key in localStorage for future sessions
        localStorage.setItem("openai-api-key", apiKey)

        // Hide the prompt
        setShowApiKeyPrompt(false)
      } else {
        alert("Invalid API key. Please try again.")
      }
    } catch (error) {
      console.error("Error validating API key:", error)
      alert("Error validating API key. Please try again.")
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MobileAppWrapper>
        <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <div className="w-full max-w-md mx-auto">
            <div className="flex flex-col items-center justify-center mb-6 text-center">
              <VoiceRecorder />

              <div className="w-full mt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="notes">
                      <FileText className="h-4 w-4 mr-2" />
                      Notes
                    </TabsTrigger>
                    <TabsTrigger value="todos">
                      <List className="h-4 w-4 mr-2" />
                      To-Dos
                    </TabsTrigger>
                    <TabsTrigger value="agents">
                      <Settings className="h-4 w-4 mr-2" />
                      Agents
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notes</CardTitle>
                        <CardDescription>Your voice recorded notes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <NotesList />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="todos" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>To-Do List</CardTitle>
                        <CardDescription>Tasks extracted from your notes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TodoList />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="agents" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Agents</CardTitle>
                        <CardDescription>Control your device with voice commands</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AgentControls />

                        <div className="mt-6">
                          <AISettings />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* API Key Prompt */}
          <ApiKeyPrompt onSubmit={handleApiKeySubmit} isVisible={showApiKeyPrompt} />
        </main>
      </MobileAppWrapper>
    </ThemeProvider>
  )
}
