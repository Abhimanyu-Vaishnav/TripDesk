import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const result: Record<string, unknown> = {
    isConfigured: isSupabaseConfigured
  };

  if (isSupabaseConfigured && supabase) {
    // 1. Check site_settings
    const settings = await supabase.from('site_settings').select('*');
    result.site_settings = { data: settings.data, error: settings.error };

    // 2. Check packages
    const pkgs = await supabase.from('packages').select('id, title, hide_price').limit(5);
    result.packages = { count: pkgs.data?.length, data: pkgs.data, error: pkgs.error };

    // 3. Check leads
    const leads = await supabase.from('leads').select('*').limit(5);
    result.leads = { count: leads.data?.length, data: leads.data, error: leads.error };
  }

  return NextResponse.json(result);
}
