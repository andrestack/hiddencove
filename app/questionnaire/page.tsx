"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Dynamically import MobileQuestionnaire
const MobileQuestionnaire = dynamic(
  () => import("@/components/questionnaire/MobileQuestionnaire"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[300px] items-center justify-center">Loading questionnaire...</div>
    ),
  }
)

function QuestionnairePageContent() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoading && !user) {
      router.replace("/")
    }
  }, [isLoading, user, router])

  const handleQuestionnaireComplete = () => {
    console.log("Questionnaire completed, navigating to summary...")
    router.push("/summary")
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg">Loading...</span>
      </div>
    )
  }

  if (!user) return null

  const handleSignOut = async () => {
    if (isSigningOut) return
    setIsSigningOut(true)
    try {
      await signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      setIsSigningOut(false)
    }
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="w-16"></div>

        <div className="text-center">
          <h1 className="font-dm-serif text-3xl text-[#383838] md:text-4xl">Hidden Cove</h1>
          <h2 className="font-dm-serif text-lg text-[#D7A5A9] md:text-xl">
            Customer Questionnaire
          </h2>
        </div>

        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{isSigningOut ? "Signing out..." : "Sign out"}</span>
        </Button>
      </div>

      <div className="flex-1">
        <h2 className="py-4 text-center font-red-hat text-xl sm:text-left">
          Hey {user?.user_metadata?.full_name?.split(" ")[0] || "there"}! Let&apos;s get started.
        </h2>
        <MobileQuestionnaire onComplete={handleQuestionnaireComplete} />
      </div>
    </main>
  )
}

export default dynamic(() => Promise.resolve(QuestionnairePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <span className="text-lg">Loading...</span>
    </div>
  ),
})
