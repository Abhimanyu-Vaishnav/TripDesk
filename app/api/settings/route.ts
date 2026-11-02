import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_SETTINGS } from '@/lib/storage';
import { SiteSettings } from '@/types';

// Server-side fallback memory cache
let cachedSettings: SiteSettings = { ...DEFAULT_SETTINGS };

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'primary_settings')
        .maybeSingle();

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
          responseTimingText: data.response_timing_text || DEFAULT_SETTINGS.responseTimingText,
          copyrightText: data.copyright_text || DEFAULT_SETTINGS.copyrightText,
          heroTitle: data.hero_title || DEFAULT_SETTINGS.heroTitle,
          heroSlides: data.hero_slides && data.hero_slides.length > 0 ? data.hero_slides : DEFAULT_SETTINGS.heroSlides
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
    cachedSettings = { ...DEFAULT_SETTINGS, ...body };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_settings').upsert({
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
        response_timing_text: cachedSettings.responseTimingText,
        copyright_text: cachedSettings.copyrightText,
        hero_title: cachedSettings.heroTitle,
        hero_slides: cachedSettings.heroSlides,
        updated_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true, settings: cachedSettings });
  } catch (err) {
    console.error('Error saving settings API:', err);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}

