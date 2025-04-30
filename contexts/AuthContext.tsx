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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    // Function to fetch user profile
    const fetchProfile = async (userId: string) => {
      try {
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
      } catch (err) {
        console.error("Exception fetching profile:", err)
        return null
      }
    }

    // Function to handle user session state
    const handleSession = async (
      session: {
        user: { id: string; email: string; user_metadata?: { full_name?: string } }
      } | null
    ) => {
      try {
        if (session?.user) {
          console.log("Got valid session, fetching profile...")
          const profile = await fetchProfile(session.user.id)

          // Get the full name from either the profile or user metadata
          const fullName =
            profile?.full_name ||
            session.user.user_metadata?.full_name ||
            localStorage.getItem("userFullName")

          if (isMounted) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: profile?.role || "stylist",
              full_name: fullName,
              avatar_url: profile?.avatar_url,
            })

            // Only redirect on initial load
            const isFirstLoad = localStorage.getItem("_auth_initialized") !== "true"
            if (isFirstLoad) {
              localStorage.setItem("_auth_initialized", "true")
              // Clear stored name after successful initialization
              localStorage.removeItem("userFullName")

              // Redirect authenticated users to questionnaire if they're on the home page
              if (window.location.pathname === "/") {
                router.push("/questionnaire")
              }
            }
          }
        } else {
          if (isMounted) {
            setUser(null)

            // Only redirect on initial load
            const isFirstLoad = localStorage.getItem("_auth_initialized") !== "true"
            if (isFirstLoad) {
              localStorage.setItem("_auth_initialized", "true")
              // Redirect to home when user is null (signed out)
              if (
                window.location.pathname !== "/" &&
                window.location.pathname !== "/auth/callback"
              ) {
                router.push("/")
              }
            }
          }
        }

        if (isMounted) {
          setLoading(false)
        }
      } catch (err) {
        console.error("Error in handleSession:", err)
        if (isMounted) {
          setLoading(false)
          setError(err as Error)
        }
      }
    }

    // Check active sessions and set the user
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          if (isMounted) {
            setLoading(false)
            setError(error)
          }
          return
        }

        await handleSession(data.session)
      } catch (err) {
        console.error("Exception during auth initialization:", err)
        if (isMounted) {
          setLoading(false)
          setError(err as Error)
        }
      }
    }

    initializeAuth()

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await handleSession(session)
      router.refresh()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const signOut = async () => {
    console.log("AuthContext: Starting sign out process...")
    try {
      setLoading(true)

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

      // Clear user state after successful signout
      setUser(null)

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
