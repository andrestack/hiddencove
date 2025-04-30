"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { Mail, Lock, Loader2, User } from "lucide-react"
import { AuthChangeEvent, Session } from "@supabase/supabase-js"

interface AuthComponentProps {
  onClose?: () => void
}

export default function AuthComponent({ onClose }: AuthComponentProps) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Handle session change to close the auth dialog if needed
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session && onClose) {
        onClose()
      }
    })

    return () => subscription.unsubscribe()
  }, [onClose, supabase])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Error signing in with Google:", error.message)
        setError(error.message)
        throw error
      }
    } catch (error) {
      console.error("Failed to sign in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    if (mode === "signUp" && !name) {
      setError("Please enter your name")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      if (mode === "signIn") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            setError("Please check your email to confirm your account first.")
            return
          }
          setError(error.message)
          throw error
        }

        // Close modal and redirect on successful sign in
        if (data.session) {
          if (onClose) {
            onClose()
          }
          window.location.href = "/questionnaire"
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: name,
            },
          },
        })

        if (error) {
          setError(error.message)
          throw error
        }

        // If user exists but no identities, they need to sign in
        if (data?.user && !data?.user?.identities?.length) {
          setError("An account with this email already exists. Please sign in instead.")
          setMode("signIn")
          setPassword("")
          return
        }

        // Show confirmation message and store pending confirmation
        if (data?.user?.identities?.length) {
          setError("Please check your email for a confirmation link.")
          localStorage.setItem("pendingConfirmation", "true")
          localStorage.setItem("userFullName", name) // Store name for later use
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when switching modes
  useEffect(() => {
    setError(null)
    if (mode === "signIn") {
      setName("")
    }
  }, [mode])

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="mt-6 text-center font-dm-serif text-3xl font-normal text-gray-900">
          Welcome to Hidden Cove
        </h2>
        <p className="mt-2 text-center font-red-hat text-sm text-gray-600">
          {mode === "signIn"
            ? "Sign in to access your onboarding questionnaire"
            : "Create an account to begin your journey"}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleEmailAuth} className="mt-8 space-y-2">
        {mode === "signUp" && (
          <div>
            <label htmlFor="name" className="sr-only font-red-hat">
              Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 font-red-hat text-gray-900 placeholder:text-gray-400 focus:border-[#E6D4CB] focus:outline-none focus:ring-1 focus:ring-[#E6D4CB]"
                placeholder="Your full name"
                disabled={isLoading}
              />
            </div>
          </div>
        )}
        <div>
          <label htmlFor="email" className="sr-only font-red-hat">
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 font-red-hat text-gray-900 placeholder:text-gray-400 focus:border-[#E6D4CB] focus:outline-none focus:ring-1 focus:ring-[#E6D4CB]"
              placeholder="Email address"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only font-red-hat">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 font-red-hat text-gray-900 placeholder:text-gray-400 focus:border-[#E6D4CB] focus:outline-none focus:ring-1 focus:ring-[#E6D4CB]"
              placeholder="Password"
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#383838] font-red-hat text-white hover:bg-[#282828]"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {mode === "signIn" ? "Sign in" : "Sign up"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            className="font-red-hat text-sm text-[#383838] hover:underline"
            onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
          >
            {mode === "signIn"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div>
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <FcGoogle className="h-5 w-5" />
          {isLoading ? "Signing in..." : "Google"}
        </Button>
      </div>
    </div>
  )
}
