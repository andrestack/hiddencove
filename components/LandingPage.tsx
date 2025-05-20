"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

// Dynamically import the Auth component to prevent SSR
const AuthComponent = dynamic(() => import("@/components/auth/AuthComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">Loading auth...</div>
  ),
})

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isLoading && user) {
      router.push("/questionnaire")
    }
  }, [isLoading, user, router])

  if (!mounted || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-lg text-gray-500">Loading session...</div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Top colored section */}
      <div
        className="relative h-[50vh] w-full bg-gradient-to-r from-[#E6D4CB] to-[#F2F0EB]"
        style={{
          borderBottomRightRadius: "24px",
          borderBottomLeftRadius: "24px",
        }}
      >
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="font-dm-serif text-4xl text-[#383838] md:text-5xl">Hidden Cove</h1>
          <h2 className="font-dm-serif text-3xl text-[#D7A5A9] md:text-4xl">Customer Onboarding</h2>
        </div>
      </div>

      {/* Content section */}
      <div className="container mx-auto flex flex-1 flex-col items-center px-8 py-12">
        <div className="max-w-2xl text-center">
          <p className="mb-12 text-left font-red-hat text-xl text-[#383838]/70">
            A guided onboarding to help our customers get the most out of their session with you.
          </p>

          <Button
            size="lg"
            onClick={() => setShowAuth(true)}
            className="group rounded-full bg-[#383838] px-8 py-6 font-red-hat text-lg text-white hover:bg-[#D7A5A9]"
          >
            Login to Begin
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="gap-0 border-none bg-transparent p-0 sm:max-w-md">
          <AnimatePresence mode="wait">
            {showAuth && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full rounded-[32px] bg-white p-6 shadow-2xl"
              >
                <AuthComponent />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </main>
  )
}
