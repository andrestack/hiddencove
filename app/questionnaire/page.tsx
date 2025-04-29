"use client"

import { useEffect } from "react"
import MobileQuestionnaire from "@/components/questionnaire/MobileQuestionnaire"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function QuestionnairePage() {
  const { signOut, user, loading } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  // Protect the page
  useEffect(() => {
    if (!loading && !user) {
      console.log("No authenticated user found, redirecting to home...")
      router.replace("/")
    }
  }, [user, loading, router])

  // If loading or no user, show loading state
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg">Loading...</span>
      </div>
    )
  }

  const handleSignOut = async () => {
    if (isSigningOut) return // Prevent multiple clicks

    setIsSigningOut(true)
    console.log("Starting sign out process...")

    try {
      // Get a fresh Supabase client
      const supabase = createClient()

      // First try direct signout with Supabase
      console.log("Attempting direct Supabase sign out...")
      await supabase.auth.signOut()

      // Then call context signOut
      console.log("Calling context signOut...")
      await signOut()

      // Clear any lingering cookies manually
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
      document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

      console.log("Sign out completed, redirecting...")

      // Force a hard refresh to clear any cached state
      window.location.href = "/"
    } catch (error) {
      console.error("Error during sign out:", error)
      setIsSigningOut(false)

      // If error, still try to force redirect
      window.location.href = "/"
    }
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-[#383838]">Hidden Cove</h1>
          <h2 className="font-serif text-xl text-[#D7A5A9]">Customer Questionnaire</h2>
        </div>

        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </Button>
      </div>

      <div className="flex-1">
        <h2 className="py-4 text-xl">Hey {user?.full_name || "there"}! Welcome back</h2>
        <MobileQuestionnaire />
      </div>
    </main>
  )
}
