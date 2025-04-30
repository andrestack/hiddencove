import { createBrowserClient } from "@supabase/ssr"
import { PostgrestError } from "@supabase/supabase-js"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  if (supabaseClient) return supabaseClient

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  )

  // Add error handling for 401 responses
  const originalFrom = supabaseClient.from
  supabaseClient.from = (tableName: string) => {
    const query = originalFrom(tableName)

    // Add response interceptor
    query.then(({ error }: { error: PostgrestError | null }) => {
      if (error?.code === "401") {
        console.warn("Unauthorized request, refreshing session...")
        supabaseClient?.auth.refreshSession()
      }
      return { data: null, error }
    })

    return query
  }

  return supabaseClient
}
