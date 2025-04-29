export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: "stylist" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: "stylist" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: "stylist" | "admin"
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          category_id: string
          question_text: string
          guidance_text: string
          recommended_products: Json | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          question_text: string
          guidance_text: string
          recommended_products?: Json | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          question_text?: string
          guidance_text?: string
          recommended_products?: Json | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          usage_guidelines: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          usage_guidelines?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          usage_guidelines?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_response_cache: {
        Row: {
          id: string
          question_id: string
          context: string
          response: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          question_id: string
          context: string
          response: string
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          question_id?: string
          context?: string
          response?: string
          created_at?: string
          expires_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
