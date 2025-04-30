import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { CookieOptions } from "@supabase/ssr"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("AUTH CALLBACK: Code received", code ? "✅" : "❌")

  if (code) {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set(name, "", { ...options, maxAge: 0 })
          },
        },
      }
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Failed to exchange code for session:", error.message)
        return NextResponse.redirect(
          new URL(
            `/?error=${encodeURIComponent(error.message)}&status=auth_failed`,
            requestUrl.origin
          )
        )
      }

      console.log("Session created successfully:", data.session ? "✅" : "❌")

      // Check if this was an email confirmation
      const pendingConfirmation = cookieStore.get("pendingConfirmation")
      if (pendingConfirmation) {
        cookieStore.delete("pendingConfirmation")
      }

      // Redirect to questionnaire with appropriate status
      const redirectUrl = new URL("/questionnaire", requestUrl.origin)
      redirectUrl.searchParams.set("auth_success", "true")
      if (pendingConfirmation) {
        redirectUrl.searchParams.set("email_confirmed", "true")
      }

      return NextResponse.redirect(redirectUrl)
    } catch (err) {
      console.error("Exception during auth callback:", err)
      return NextResponse.redirect(
        new URL(
          `/?error=${encodeURIComponent("Authentication failed")}&status=auth_error`,
          requestUrl.origin
        )
      )
    }
  }

  // If no code is present, redirect to home with error
  return NextResponse.redirect(
    new URL(
      `/?error=${encodeURIComponent("No authentication code received")}&status=no_code`,
      requestUrl.origin
    )
  )
}
