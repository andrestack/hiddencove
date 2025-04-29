"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClient } from "@/lib/supabase/client"

export default function AuthComponent() {
  const supabase = createClient()

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="font-dm-serif mt-6 text-center text-3xl font-normal text-gray-900">
          Welcome to Hidden Cove
        </h2>
        <p className="font-red-hat mt-2 text-center text-sm text-gray-600">
          Sign in to access your onboarding questionnaire
        </p>
      </div>
      <div className="mt-8">
        <Auth
          supabaseClient={supabase}
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
            className: {
              container: "font-red-hat",
              button: "font-red-hat",
              input: "font-red-hat",
              label: "font-red-hat",
            },
          }}
          providers={["google"]}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
          magicLink={true}
        />
      </div>
    </div>
  )
}
