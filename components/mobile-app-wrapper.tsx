"use client"

import type React from "react"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface MobileAppWrapperProps {
  children: React.ReactNode
}

export default function MobileAppWrapper({ children }: MobileAppWrapperProps) {
  const { toast } = useToast()

  useEffect(() => {
    // Initialize Capacitor plugins when available
    const initCapacitor = async () => {
      try {
        if (typeof (window as any).Capacitor !== "undefined") {
          console.log("Initializing Capacitor plugins")

          // Import and initialize plugins
          try {
            const { SplashScreen } = await import("@capacitor/splash-screen")
            const { StatusBar } = await import("@capacitor/status-bar")
            const { App } = await import("@capacitor/app")

            // Hide splash screen after a delay
            setTimeout(() => {
              SplashScreen.hide()
            }, 1000)

            // Set status bar style
            StatusBar.setStyle({ style: "dark" })
            StatusBar.setBackgroundColor({ color: "#ffffff" })

            // Handle back button
            App.addListener("backButton", ({ canGoBack }) => {
              if (!canGoBack) {
                App.exitApp()
              } else {
                window.history.back()
              }
            })

            console.log("Capacitor plugins initialized")
          } catch (error) {
            console.error("Error initializing Capacitor plugins:", error)
          }
        }
      } catch (error) {
        console.error("Error checking for Capacitor:", error)
      }
    }

    initCapacitor()

    // Check for network connectivity
    const checkNetwork = async () => {
      try {
        if (typeof (window as any).Capacitor !== "undefined") {
          const { Network } = await import("@capacitor/network")

          const status = await Network.getStatus()

          if (!status.connected) {
            toast({
              title: "HeyBud - No Connection",
              description: "Some features may not work without an internet connection.",
              variant: "destructive",
            })
          }

          // Listen for network changes
          Network.addListener("networkStatusChange", (status) => {
            if (!status.connected) {
              toast({
                title: "HeyBud - No Connection",
                description: "Some features may not work without an internet connection.",
                variant: "destructive",
              })
            } else {
              toast({
                title: "HeyBud - Connected",
                description: "Internet connection restored.",
              })
            }
          })
        }
      } catch (error) {
        console.error("Error checking network:", error)
      }
    }

    checkNetwork()

    return () => {
      // Clean up any listeners
      const cleanupCapacitor = async () => {
        try {
          if (typeof (window as any).Capacitor !== "undefined") {
            const { App } = await import("@capacitor/app")
            const { Network } = await import("@capacitor/network")

            App.removeAllListeners()
            Network.removeAllListeners()
          }
        } catch (error) {
          console.error("Error cleaning up Capacitor listeners:", error)
        }
      }

      cleanupCapacitor()
    }
  }, [toast])

  return <>{children}</>
}
