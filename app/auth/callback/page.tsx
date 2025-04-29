"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    if (error) {
      alert(error)
      router.replace("/")
    }
    // Otherwise, just wait for the server redirect to happen
  }, [error, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="text-lg">Finalizing sign-in, please wait...</span>
    </div>
  )
}
