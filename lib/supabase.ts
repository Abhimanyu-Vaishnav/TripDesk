import { createClient } from '@supabase/supabase-js';

// Vercel auto-generates prefixed or unprefixed keys
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_tripdeskSUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.STORAGE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_tripdeskSUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_tripdeskSUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.STORAGE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
