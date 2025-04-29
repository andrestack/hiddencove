"use client"

import Questionnaire from "@/components/questionnaire/Questionnaire"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function QuestionnairePage() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    console.log("Signing out...")
    try {
      await signOut()
      console.log("Sign out completed")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-dm-serif text-4xl text-[#383838]">Hidden Cove</h1>
          <h2 className="font-dm-serif text-2xl text-[#D7A5A9]">Customer Questionnaire</h2>
        </div>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[#383838]/70 hover:text-[#383838]"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="flex-1">
        <Questionnaire />
      </div>
    </main>
  )
}
