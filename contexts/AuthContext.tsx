"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AuthContextType, UserWithRole } from "@/types/auth"
import { useRouter } from "next/navigation"

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Function to fetch user profile
    const fetchProfile = async (userId: string) => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      return profile
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: profile?.role || "stylist",
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: profile?.role || "stylist",
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
        })
      } else {
        setUser(null)
        // Redirect to home when user is null (signed out)
        router.push("/")
        router.refresh()
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    console.log("Starting sign out process...")
    const supabase = createClient()
    try {
      console.log("Calling supabase.auth.signOut()...")
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Supabase signOut error:", error)
        setError(error)
        return
      }
      console.log("Successfully signed out from Supabase")
      // The onAuthStateChange listener will handle the redirect
    } catch (error) {
      console.error("Caught error during sign out:", error)
      setError(error as Error)
    }
  }

  const value = {
    user,
    loading,
    error,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
