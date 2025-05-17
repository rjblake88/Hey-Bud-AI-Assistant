"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface ApiKeyPromptProps {
  onSubmit: (apiKey: string) => void
  isVisible: boolean
}

export default function ApiKeyPrompt({ onSubmit, isVisible }: ApiKeyPromptProps) {
  const [apiKey, setApiKey] = useState("")

  if (!isVisible) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      onSubmit(apiKey.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            OpenAI API Key Required
          </CardTitle>
          <CardDescription>
            To use the voice transcription feature, you need to provide your OpenAI API key.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-slate-500">
                <p>Your API key is stored locally and never sent to our servers.</p>
                <p className="mt-1">
                  You can get an API key from{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    OpenAI's website
                  </a>
                  .
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={!apiKey.trim()}>
              Save API Key
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
