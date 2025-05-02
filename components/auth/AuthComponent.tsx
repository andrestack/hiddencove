"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { Mail, Lock, Loader2, User } from "lucide-react"
import { AuthChangeEvent, Session } from "@supabase/supabase-js"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

// Form schema for both sign in and sign up
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type SignInFormValues = z.infer<typeof signInSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>

interface AuthComponentProps {
  onClose?: () => void
}

export default function AuthComponent({ onClose }: AuthComponentProps) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<SignInFormValues | SignUpFormValues>({
    resolver: zodResolver(mode === "signIn" ? signInSchema : signUpSchema),
    mode: "onBlur",
  })

  // Get the current domain for redirects
  const getRedirectUrl = () => {
    // In development, use localhost
    if (process.env.NODE_ENV === "development") {
      return `${window.location.origin}/auth/callback`
    }
    // In production, use the actual domain
    return `${window.location.origin}/auth/callback`
  }

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
      clearErrors()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        console.error("Error signing in with Google:", error.message)
        toast.error("Failed to sign in with Google")
        throw error
      }
    } catch (error) {
      console.error("Failed to sign in:", error)
      toast.error("Failed to sign in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: SignInFormValues | SignUpFormValues) => {
    try {
      setIsLoading(true)
      clearErrors()

      if (mode === "signIn") {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            setError("root.serverError", {
              type: "manual",
              message: "Please check your email to confirm your account first.",
            })
            toast.error("Please check your email to confirm your account first.")
            return
          }
          if (error.message.includes("Invalid login credentials")) {
            setError("root.serverError", {
              type: "manual",
              message: "Invalid email or password.",
            })
            toast.error("Invalid email or password")
            return
          }
          throw error
        }

        // Close modal and redirect on successful sign in
        if (authData.session) {
          toast.success("Successfully signed in!")
          if (onClose) {
            onClose()
          }
          window.location.href = "/questionnaire"
        }
      } else {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: getRedirectUrl(),
            data: {
              full_name: "name" in data ? data.name : "",
            },
          },
        })

        if (error) {
          if (error.message.includes("User already registered")) {
            setError("email", {
              type: "manual",
              message: "This email is already registered. Please sign in instead.",
            })
            setMode("signIn")
            toast.error("Email already registered")
            return
          }
          throw error
        }

        // If user exists but no identities, they need to sign in
        if (signUpData?.user && !signUpData?.user?.identities?.length) {
          setError("email", {
            type: "manual",
            message: "This email is already registered. Please sign in instead.",
          })
          setMode("signIn")
          toast.error("Account already exists")
          return
        }

        // Show confirmation message and store pending confirmation
        if (signUpData?.user?.identities?.length) {
          localStorage.setItem("pendingConfirmation", "true")
          localStorage.setItem("userFullName", "name" in data ? data.name : "")
          toast.success("Please check your email for a confirmation link")
          setError("root.serverError", {
            type: "success",
            message: "Please check your email for a confirmation link.",
          })
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred"
      setError("root.serverError", {
        type: "manual",
        message,
      })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when switching modes
  useEffect(() => {
    reset()
    clearErrors()
  }, [mode, reset, clearErrors])

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

      {errors.root?.serverError?.type === "success" ? (
        <div className="rounded-md bg-green-50 p-3 text-center text-sm text-green-600">
          {errors.root.serverError.message}
        </div>
      ) : errors.root?.serverError ? (
        <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
          {errors.root.serverError.message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-2">
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
                type="text"
                autoComplete="name"
                {...register("name")}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 font-red-hat text-gray-900 placeholder:text-gray-400 focus:border-[#E6D4CB] focus:outline-none focus:ring-1 focus:ring-[#E6D4CB]"
                placeholder="Your full name"
                disabled={isLoading}
                aria-invalid={errors.name ? "true" : "false"}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.name.message}
              </p>
            )}
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
              type="email"
              autoComplete="email"
              {...register("email")}
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 font-red-hat text-gray-900 placeholder:text-gray-400 focus:border-[#E6D4CB] focus:outline-none focus:ring-1 focus:ring-[#E6D4CB]"
              placeholder="Email address"
              disabled={isLoading}
              aria-invalid={errors.email ? "true" : "false"}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
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
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              {...register("password")}
              className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 font-red-hat text-gray-900 placeholder:text-gray-400 focus:border-[#E6D4CB] focus:outline-none focus:ring-1 focus:ring-[#E6D4CB]"
              placeholder="Password"
              disabled={isLoading}
              aria-invalid={errors.password ? "true" : "false"}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
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
