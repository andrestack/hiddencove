"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [isProcessing, setIsProcessing] = useState(true)
  const [statusMessage, setStatusMessage] = useState("Finalizing sign-in, please wait...")

  useEffect(() => {
    if (error) {
      setStatusMessage(`Error: ${error}`)
      setIsProcessing(false)
      
      // Show error for 2 seconds before redirecting
      const timer = setTimeout(() => {
        router.replace("/")
      }, 2000)
      
      return () => clearTimeout(timer)
    }
    
    // Check if we need to handle a pending confirmation
    const pendingConfirmation = localStorage.getItem("pendingConfirmation")
    if (pendingConfirmation) {
      setStatusMessage("Email confirmed! Redirecting to your questionnaire...")
      localStorage.removeItem("pendingConfirmation")
    }
    
    // Set a timeout to handle cases where redirect doesn't happen automatically
    const redirectTimer = setTimeout(() => {
      if (isProcessing) {
        setStatusMessage("Taking longer than expected. Redirecting manually...")
        router.push("/questionnaire")
      }
    }, 5000)
    
    return () => clearTimeout(redirectTimer)
  }, [error, router, isProcessing])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <span className="text-lg">{statusMessage}</span>
        {isProcessing && (
          <div className="mt-4 h-2 w-32 overflow-hidden rounded-full bg-gray-200 mx-auto">
            <div className="h-full w-full origin-left animate-pulse bg-[#383838]"></div>
          </div>
        )}
      </div>
    </div>
  )
}
