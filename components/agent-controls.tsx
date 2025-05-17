"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Volume2, Thermometer, Lock } from "lucide-react"

export default function AgentControls() {
  const [deviceStates, setDeviceStates] = useState({
    lights: false,
    speaker: false,
    thermostat: false,
    locks: false,
  })

  const toggleDevice = (device: keyof typeof deviceStates) => {
    setDeviceStates((prev) => ({
      ...prev,
      [device]: !prev[device],
    }))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
        Control your smart home devices with voice commands or manual controls.
      </p>

      <div className="grid grid-cols-1 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${deviceStates.lights ? "bg-yellow-100" : "bg-slate-100"}`}>
                  <Lightbulb className={`h-5 w-5 ${deviceStates.lights ? "text-yellow-500" : "text-slate-500"}`} />
                </div>
                <div>
                  <Label htmlFor="lights" className="text-base">
                    Lights
                  </Label>
                  <p className="text-sm text-slate-500">Living Room</p>
                </div>
              </div>
              <Switch id="lights" checked={deviceStates.lights} onCheckedChange={() => toggleDevice("lights")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${deviceStates.speaker ? "bg-purple-100" : "bg-slate-100"}`}>
                  <Volume2 className={`h-5 w-5 ${deviceStates.speaker ? "text-purple-500" : "text-slate-500"}`} />
                </div>
                <div>
                  <Label htmlFor="speaker" className="text-base">
                    Speaker
                  </Label>
                  <p className="text-sm text-slate-500">Kitchen</p>
                </div>
              </div>
              <Switch id="speaker" checked={deviceStates.speaker} onCheckedChange={() => toggleDevice("speaker")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${deviceStates.thermostat ? "bg-red-100" : "bg-slate-100"}`}>
                  <Thermometer className={`h-5 w-5 ${deviceStates.thermostat ? "text-red-500" : "text-slate-500"}`} />
                </div>
                <div>
                  <Label htmlFor="thermostat" className="text-base">
                    Thermostat
                  </Label>
                  <p className="text-sm text-slate-500">Whole House</p>
                </div>
              </div>
              <Switch
                id="thermostat"
                checked={deviceStates.thermostat}
                onCheckedChange={() => toggleDevice("thermostat")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${deviceStates.locks ? "bg-green-100" : "bg-slate-100"}`}>
                  <Lock className={`h-5 w-5 ${deviceStates.locks ? "text-green-500" : "text-slate-500"}`} />
                </div>
                <div>
                  <Label htmlFor="locks" className="text-base">
                    Smart Locks
                  </Label>
                  <p className="text-sm text-slate-500">Front Door</p>
                </div>
              </div>
              <Switch id="locks" checked={deviceStates.locks} onCheckedChange={() => toggleDevice("locks")} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        <p>Try saying: &quot;Hey Bud, turn on the living room lights&quot;</p>
      </div>
    </div>
  )
}
