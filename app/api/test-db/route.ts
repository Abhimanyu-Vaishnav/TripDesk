import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const envKeys = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    STORAGE_URL: Boolean(process.env.STORAGE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_ANON_KEY: Boolean(process.env.SUPABASE_ANON_KEY),
    STORAGE_ANON_KEY: Boolean(process.env.STORAGE_ANON_KEY),
    isConfigured: isSupabaseConfigured
  };

  // Find all env keys related to supabase or storage
  const allRelatedKeys = Object.keys(process.env).filter(k => 
    k.includes('SUPABASE') || k.includes('STORAGE') || k.includes('POSTGRES')
  );

  let testDbQuery = null;
  let testError = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1);
      testDbQuery = data;
      testError = error ? { message: error.message, code: error.code, details: error.details } : null;
    } catch (e: unknown) {
      testError = { message: String(e) };
    }
  }

  return NextResponse.json({
    envKeys,
    allRelatedKeys,
    testError,
    hasDbData: Boolean(testDbQuery)
  });
}
