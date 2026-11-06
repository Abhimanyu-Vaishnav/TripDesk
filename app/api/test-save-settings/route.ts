import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_SETTINGS, normalizeImageUrl } from '@/lib/storage';
import { SiteSettings } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body: SiteSettings = await request.json();
    const heroSlides = (body.heroSlides || []).map(s => ({
      ...s,
      url: normalizeImageUrl(s.url)
    }));
    const settings = { ...DEFAULT_SETTINGS, ...body, heroSlides };

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ success: false, reason: 'Supabase client not initialized' }, { status: 500 });
    }

    // Update settings payload
    const updatePayload: Record<string, unknown> = {
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
    };

    if (settings.heroPosition) updatePayload.hero_position = settings.heroPosition;
    if (settings.heroFontSize) updatePayload.hero_font_size = settings.heroFontSize;
    if (settings.planTripButtonText) updatePayload.plan_trip_button_text = settings.planTripButtonText;

    // Try update first
    const { data: updateData, error: updateError } = await supabase
      .from('site_settings')
      .update(updatePayload)
      .eq('id', 'primary_settings')
      .select();

    if (updateError) {
      console.error('Supabase update site_settings error:', updateError);
      // If error might be due to missing columns in site_settings table (e.g. column doesn't exist), fallback without those columns:
      if (updateError.message && updateError.message.includes('column')) {
        delete updatePayload.hero_position;
        delete updatePayload.hero_font_size;
        delete updatePayload.plan_trip_button_text;
        const retry = await supabase.from('site_settings').update(updatePayload).eq('id', 'primary_settings').select();
        return NextResponse.json({
          success: !retry.error,
          updateError: retry.error ? retry.error.message : null,
          columnWarning: updateError.message,
          updateData: retry.data
        });
      }
    }

    return NextResponse.json({
      success: !updateError,
      updateError: updateError ? updateError.message : null,
      updateData
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

