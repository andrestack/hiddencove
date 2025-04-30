import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

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
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
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
          new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        )
      }

      console.log("Session created successfully:", data.session ? "✅" : "❌")

      // Always redirect to questionnaire after successful auth
      const redirectUrl = new URL("/questionnaire", requestUrl.origin)

      // Add success parameter for UI feedback
      redirectUrl.searchParams.set("auth_success", "true")

      return NextResponse.redirect(redirectUrl)
    } catch (err) {
      console.error("Exception during auth callback:", err)
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent("Authentication failed")}`, requestUrl.origin)
      )
    }
  }

  // If no code is present, redirect to home with error
  return NextResponse.redirect(
    new URL(`/?error=${encodeURIComponent("No authentication code received")}`, requestUrl.origin)
  )
}
