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

    // Function to handle user session state
    const handleSession = async (session: any) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: profile?.role || "stylist",
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
        })
        // Redirect authenticated users to questionnaire if they're on the home page
        if (window.location.pathname === "/") {
          router.push("/questionnaire")
        }
      } else {
        setUser(null)
        // Redirect to home when user is null (signed out)
        if (window.location.pathname !== "/") {
          router.push("/")
        }
      }
      setLoading(false)
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    })

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await handleSession(session)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    console.log("AuthContext: Starting sign out process...")
    try {
      setLoading(true)

      // Clear user state immediately
      setUser(null)

      // Get fresh Supabase client
      const supabase = createClient()

      // Sign out from Supabase
      console.log("AuthContext: Calling supabase.auth.signOut()...")
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("AuthContext: Supabase signOut error:", error)
        throw error
      }

      console.log("AuthContext: Successfully signed out from Supabase")

      // Clear any residual cookies manually
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
      document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

      // Clear local storage
      localStorage.removeItem("supabase.auth.token")

      // Redirect to home page and force refresh
      window.location.href = "/"

      return { success: true }
    } catch (error) {
      console.error("AuthContext: Error during sign out:", error)
      // Even on error, redirect to home
      window.location.href = "/"
      throw error
    } finally {
      setLoading(false)
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
