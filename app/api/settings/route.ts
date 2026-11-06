import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_SETTINGS, normalizeImageUrl } from '@/lib/storage';
import { SiteSettings } from '@/types';

// Force dynamic execution (never cache GET requests on edge/server)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

let cachedSettings: SiteSettings = { ...DEFAULT_SETTINGS };

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'primary_settings')
        .maybeSingle();

      if (error) {
        console.error('Supabase get settings error:', error);
      }

      if (!error && data) {
        cachedSettings = {
          hideAllPrices: Boolean(data.hide_all_prices),
          contactMode: data.contact_mode || DEFAULT_SETTINGS.contactMode,
          googleFormEmbedUrl: data.google_form_embed_url || DEFAULT_SETTINGS.googleFormEmbedUrl,
          companyName: data.company_name || DEFAULT_SETTINGS.companyName,
          tagline: data.tagline || DEFAULT_SETTINGS.tagline,
          aboutText: data.about_text || DEFAULT_SETTINGS.aboutText,
          contactAddress: data.contact_address || DEFAULT_SETTINGS.contactAddress,
          contactEmail: data.contact_email || DEFAULT_SETTINGS.contactEmail,
          contactPhone: data.contact_phone || DEFAULT_SETTINGS.contactPhone,
          contactLandline: data.contact_landline || DEFAULT_SETTINGS.contactLandline,
          whatsappNumber: data.whatsapp_number || DEFAULT_SETTINGS.whatsappNumber,
          instagramUrl: data.instagram_url || DEFAULT_SETTINGS.instagramUrl,
          facebookUrl: data.facebook_url || DEFAULT_SETTINGS.facebookUrl,
          twitterUrl: data.twitter_url || DEFAULT_SETTINGS.twitterUrl,
          youtubeUrl: data.youtube_url || DEFAULT_SETTINGS.youtubeUrl,
          linkedinUrl: data.linkedin_url || '',
          pinterestUrl: data.pinterest_url || '',
          responseTimingText: data.response_timing_text || DEFAULT_SETTINGS.responseTimingText,
          copyrightText: data.copyright_text || DEFAULT_SETTINGS.copyrightText,
          heroTitle: data.hero_title || DEFAULT_SETTINGS.heroTitle,
          heroSlides: data.hero_slides && data.hero_slides.length > 0 ? data.hero_slides : DEFAULT_SETTINGS.heroSlides,
          heroPosition: data.hero_position || DEFAULT_SETTINGS.heroPosition,
          heroFontSize: data.hero_font_size || DEFAULT_SETTINGS.heroFontSize,
          planTripButtonText: data.plan_trip_button_text || DEFAULT_SETTINGS.planTripButtonText
        };
      }
    } catch (err) {
      console.warn('API get settings fallback:', err);
    }
  }

  return NextResponse.json({ success: true, settings: cachedSettings });
}

export async function POST(request: Request) {
  try {
    const body: SiteSettings = await request.json();
    const heroSlides = (body.heroSlides || []).map(s => ({
      ...s,
      url: normalizeImageUrl(s.url)
    }));

    cachedSettings = {
      ...DEFAULT_SETTINGS,
      ...body,
      heroSlides
    };

    let dbError = null;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('site_settings').upsert({
        id: 'primary_settings',
        hide_all_prices: cachedSettings.hideAllPrices,
        contact_mode: cachedSettings.contactMode,
        google_form_embed_url: cachedSettings.googleFormEmbedUrl,
        company_name: cachedSettings.companyName,
        tagline: cachedSettings.tagline,
        about_text: cachedSettings.aboutText,
        contact_address: cachedSettings.contactAddress,
        contact_email: cachedSettings.contactEmail,
        contact_phone: cachedSettings.contactPhone,
        contact_landline: cachedSettings.contactLandline,
        whatsapp_number: cachedSettings.whatsappNumber,
        instagram_url: cachedSettings.instagramUrl,
        facebook_url: cachedSettings.facebookUrl,
        twitter_url: cachedSettings.twitterUrl,
        youtube_url: cachedSettings.youtubeUrl,
        linkedin_url: cachedSettings.linkedinUrl,
        pinterest_url: cachedSettings.pinterestUrl,
        response_timing_text: cachedSettings.responseTimingText,
        copyright_text: cachedSettings.copyrightText,
        hero_title: cachedSettings.heroTitle,
        hero_slides: cachedSettings.heroSlides,
        hero_position: cachedSettings.heroPosition,
        hero_font_size: cachedSettings.heroFontSize,
        plan_trip_button_text: cachedSettings.planTripButtonText,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error('Supabase site_settings upsert error:', error);
        dbError = error.message;
      }
    }

    return NextResponse.json({
      success: !dbError,
      settings: cachedSettings,
      dbError
    });
  } catch (err) {
    console.error('Error saving settings API:', err);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}
