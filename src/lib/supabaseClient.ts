// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Use environment variables instead of hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)