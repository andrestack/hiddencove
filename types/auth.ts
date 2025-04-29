import { Database } from "./supabase"

export type UserRole = "stylist" | "admin"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export interface UserWithRole {
  id: string
  email?: string
  role: UserRole
  full_name?: string | null
  avatar_url?: string | null
}

export interface AuthContextType {
  user: UserWithRole | null
  loading: boolean
  error: Error | null
  signOut: () => Promise<void>
}
