import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ success: false, reason: 'Supabase not configured' });
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'primary_settings')
    .maybeSingle();

  return NextResponse.json({
    success: !error,
    error: error ? error.message : null,
    data
  });
}
