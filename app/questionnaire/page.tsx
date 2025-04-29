"use client"

import MobileQuestionnaire from "@/components/questionnaire/MobileQuestionnaire"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

export default function QuestionnairePage() {
  const { signOut, user } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return // Prevent multiple clicks

    setIsSigningOut(true)
    console.log("Signing out...")
    try {
      await signOut()
      console.log("Sign out completed")
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
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
          variant="ghost"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-2 bg-[#f8f5ee] text-[#383838]/70 hover:text-[#383838]"
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>

      <div className="flex-1">
        <h2 className="py-4 text-xl">Hey {user?.full_name || "there"}! Welcome back</h2>
        <MobileQuestionnaire />
      </div>
    </main>
  )
}
