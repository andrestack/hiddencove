"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setIsInstallable(false)
      }
    } catch (error) {
      console.error("Error installing PWA:", error)
    }
  }

  if (!isInstallable) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-lg bg-white p-4 shadow-lg md:left-auto md:right-4 md:w-96">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-dm-serif text-lg font-semibold text-gray-900">
            Install Hidden Cove App
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Install our app for a better experience and offline access
          </p>
        </div>
        <Button
          onClick={handleInstallClick}
          className="flex items-center gap-2 bg-[#383838] text-white hover:bg-[#282828]"
        >
          <Download className="h-4 w-4" />
          Install
        </Button>
      </div>
    </div>
  )
}
