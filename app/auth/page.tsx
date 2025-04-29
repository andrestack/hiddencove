"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-dm-serif font-extrabold text-gray-900">
            Welcome to Hidden Cove
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your stylist dashboard
          </p>
        </div>
        <div className="mt-8">
          <Auth
            supabaseClient={createClient()}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#383838",
                    brandAccent: "#E6D4CB",
                  },
                },
              },
            }}
            providers={["google"]}
            redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
          />
        </div>
      </div>
    </div>
  )
}
