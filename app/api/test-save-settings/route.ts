import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_SETTINGS } from '@/lib/storage';
import { SiteSettings } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body: SiteSettings = await request.json();
    const settings = { ...DEFAULT_SETTINGS, ...body };

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ success: false, reason: 'Supabase client not initialized' }, { status: 500 });
    }

    // Try explicit update first
    const { data: updateData, error: updateError } = await supabase
      .from('site_settings')
      .update({
        hide_all_prices: Boolean(settings.hideAllPrices),
        contact_mode: settings.contactMode,
        google_form_embed_url: settings.googleFormEmbedUrl,
        company_name: settings.companyName,
        tagline: settings.tagline,
        about_text: settings.aboutText,
        contact_address: settings.contactAddress,
        contact_email: settings.contactEmail,
        contact_phone: settings.contactPhone,
        contact_landline: settings.contactLandline,
        whatsapp_number: settings.whatsappNumber,
        instagram_url: settings.instagramUrl,
        facebook_url: settings.facebookUrl,
        twitter_url: settings.twitterUrl,
        youtube_url: settings.youtubeUrl,
        linkedin_url: settings.linkedinUrl,
        pinterest_url: settings.pinterestUrl,
        response_timing_text: settings.responseTimingText,
        copyright_text: settings.copyrightText,
        hero_title: settings.heroTitle,
        hero_slides: settings.heroSlides,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'primary_settings')
      .select();

    return NextResponse.json({
      success: !updateError,
      updateError: updateError ? updateError.message : null,
      updateData
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

