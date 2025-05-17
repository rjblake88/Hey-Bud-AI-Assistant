"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function AISettings() {
  const [offlineMode, setOfflineMode] = useState(false)
  const [voiceModel, setVoiceModel] = useState("alloy")
  const [speechRate, setSpeechRate] = useState(1)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">AI Settings</h3>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="offline-mode" className="text-base">
                Offline Mode
              </Label>
              <p className="text-sm text-slate-500">Use local models when available</p>
            </div>
            <Switch id="offline-mode" checked={offlineMode} onCheckedChange={setOfflineMode} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label htmlFor="voice-model" className="text-base">
              Voice Model
            </Label>
            <p className="text-sm text-slate-500 mb-2">Select the voice for responses</p>
            <Select value={voiceModel} onValueChange={setVoiceModel}>
              <SelectTrigger id="voice-model">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alloy">Alloy</SelectItem>
                <SelectItem value="echo">Echo</SelectItem>
                <SelectItem value="fable">Fable</SelectItem>
                <SelectItem value="onyx">Onyx</SelectItem>
                <SelectItem value="nova">Nova</SelectItem>
                <SelectItem value="shimmer">Shimmer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="speech-rate" className="text-base">
              Speech Rate
            </Label>
            <p className="text-sm text-slate-500 mb-2">Adjust how fast the assistant speaks</p>
            <div className="pt-2">
              <Slider
                id="speech-rate"
                min={0.5}
                max={2}
                step={0.1}
                value={[speechRate]}
                onValueChange={(value) => setSpeechRate(value[0])}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-slate-500 mt-2">Changes to these settings will be applied immediately.</div>
    </div>
  )
}
