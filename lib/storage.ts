import { TourPackage, LeadInquiry, SiteSettings } from '@/types';
import { INITIAL_PACKAGES } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Normalizes image URLs from Google Drive or other sources to direct image embeds.
 * Converts Google Drive sharing links (drive.google.com/file/d/...) to direct lh3.googleusercontent.com links.
 */
export function normalizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return url || '';
  const trimmed = url.trim();

  // Match Google Drive share / preview / file links:
  // e.g. https://drive.google.com/file/d/1VfVeVLL-ahhlZVnU64JjHkZoGtaOyaaK/view?usp=sharing
  // or https://drive.google.com/open?id=1VfVeVLL-ahhlZVnU64JjHkZoGtaOyaaK
  // or https://drive.google.com/uc?id=1VfVeVLL-ahhlZVnU64JjHkZoGtaOyaaK
  const driveMatch = trimmed.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=view&)?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/
  );
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  return trimmed;
}

/**
 * Generates or preserves a realistic rating between 4.7 and 5.0,
 * and review count (e.g. 15-85) ensuring on update it never decreases.
 */
export function generateRealisticRating(
  id: string,
  existingRating?: number,
  existingReviewsCount?: number
): { rating: number; reviewsCount: number } {
  // If valid existing rating between 4.7 and 5.0 exists, keep it
  let rating = existingRating && existingRating >= 4.7 && existingRating <= 5.0
    ? Number(existingRating.toFixed(1))
    : 0;

  if (!rating) {
    // Generate deterministic yet pseudo-random rating from ID between 4.7 and 5.0:
    // e.g. 4.7, 4.8, 4.9, 5.0
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    const ratings = [4.7, 4.8, 4.8, 4.9, 4.9, 4.9, 5.0];
    rating = ratings[Math.abs(hash) % ratings.length];
  }

  // Calculate review count: on edit it must never decrease (either same or increases)
  const currentCount = existingReviewsCount && existingReviewsCount > 1 ? existingReviewsCount : 0;
  let reviewsCount = currentCount;

  if (reviewsCount <= 1) {
    // Generate an initial realistic review count between 18 and 85
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) & 0xffffff;
    }
    reviewsCount = 18 + (hash % 68); // 18 to 85
  } else {
    // When modified, optionally increment or keep same (NEVER decrease)
    // Small chance to add +1 or +2 organic reviews on update
    reviewsCount = Math.max(currentCount, currentCount + (Math.random() > 0.6 ? 1 : 0));
  }

  return { rating, reviewsCount };
}

const PACKAGES_STORAGE_KEY = 'tripdesk_packages_v3';
const LEADS_STORAGE_KEY = 'tripdesk_leads_v3';
const SETTINGS_STORAGE_KEY = 'tripdesk_settings_v3';

export const DEFAULT_HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80',
    title: 'Kerala Backwaters & Houseboats'
  },
  {
    url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1920&q=80',
    title: 'Kashmir Valley & Snow Peaks'
  },
  {
    url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=80',
    title: 'Rajasthan Royal Heritage Palaces'
  },
  {
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80',
    title: 'Goa Coastal Serenity'
  }
];

export const DEFAULT_SETTINGS: SiteSettings = {
  hideAllPrices: false,
  contactMode: 'google_form',
  googleFormEmbedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScU73iF8gH-tripdesk-sample/viewform?embedded=true',
  companyName: 'TripDesk Holidays',
  tagline: 'Desk to Destination',
  aboutText: 'TripDesk Holidays is your trusted travel architect, bridging the gap from your everyday desk to extraordinary destinations across incredible India. Handcrafted itineraries, transparent pricing, and 24/7 on-ground support.',
  contactAddress: 'TripDesk Travel Hub, Connaught Place, New Delhi 110001, India',
  contactEmail: 'desk@tripdeskholidays.com',
  contactPhone: '+91 98765 43210',
  contactLandline: '+91 11 4567 8900',
  whatsappNumber: '+919876543210',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  youtubeUrl: 'https://youtube.com',
  responseTimingText: '⚡ Response time: Under 2 hours',
  copyrightText: '© 2026 TripDesk Holidays LLP. All Rights Reserved.',
  heroTitle: '',
  heroSlides: DEFAULT_HERO_SLIDES,
  heroPosition: 'bottom',
  heroFontSize: 'standard',
  planTripButtonText: 'Plan My Trip'
};

let memorySettings: SiteSettings = { ...DEFAULT_SETTINGS };
let memoryPackages: TourPackage[] = [...INITIAL_PACKAGES];
let memoryLeads: LeadInquiry[] = [];

// ==========================================
// SITE SETTINGS
// ==========================================
export function getStoredSettings(): SiteSettings {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return memorySettings;
    }
  }
  return memorySettings;
}

export async function fetchCloudSettings(): Promise<SiteSettings> {
  // 1. Try Next.js API route first (which has server-side Supabase credentials)
  try {
    const res = await fetch('/api/settings', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.settings) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(json.settings));
          } catch {}
        }
        memorySettings = json.settings;
        return json.settings;
      }
    }
  } catch (err) {
    console.warn('API fetch settings error, trying client Supabase:', err);
  }

  // 2. Direct client supabase fallback
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'primary_settings')
        .maybeSingle();

      if (!error && data) {
        let unpackedConfig: { heroPosition?: string; heroFontSize?: string; planTripButtonText?: string } = {};
        if (data.linkedin_url && typeof data.linkedin_url === 'string' && data.linkedin_url.startsWith('{')) {
          try {
            unpackedConfig = JSON.parse(data.linkedin_url);
          } catch {}
        }

        // Fallback to local stored settings for position/fontSize if database column doesn't exist yet
        const localSettings = getStoredSettings();
        const cloudSettings: SiteSettings = {
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
          linkedinUrl: data.linkedin_url && !data.linkedin_url.startsWith('{') ? data.linkedin_url : '',
          pinterestUrl: data.pinterest_url || '',
          responseTimingText: data.response_timing_text || DEFAULT_SETTINGS.responseTimingText,
          copyrightText: data.copyright_text || DEFAULT_SETTINGS.copyrightText,
          heroTitle: data.hero_title || DEFAULT_SETTINGS.heroTitle,
          heroSlides: data.hero_slides && data.hero_slides.length > 0 ? data.hero_slides : DEFAULT_HERO_SLIDES,
          heroPosition: (data.hero_position || unpackedConfig.heroPosition || localSettings.heroPosition || DEFAULT_SETTINGS.heroPosition) as 'bottom' | 'middle' | 'top',
          heroFontSize: (data.hero_font_size || unpackedConfig.heroFontSize || localSettings.heroFontSize || DEFAULT_SETTINGS.heroFontSize) as 'compact' | 'standard' | 'large' | 'extralarge',
          planTripButtonText: data.plan_trip_button_text || unpackedConfig.planTripButtonText || localSettings.planTripButtonText || DEFAULT_SETTINGS.planTripButtonText
        };
        saveStoredSettings(cloudSettings);
        return cloudSettings;
      }
    } catch (e) {
      console.warn('Supabase settings fetch fallback:', e);
    }
  }
  return getStoredSettings();
}

export async function saveStoredSettings(settings: SiteSettings) {
  // Normalize Google Drive links in hero slides if present
  const cleanedHeroSlides = (settings.heroSlides || []).map(s => ({
    ...s,
    url: normalizeImageUrl(s.url)
  }));

  const cleanedSettings: SiteSettings = {
    ...settings,
    heroSlides: cleanedHeroSlides
  };

  memorySettings = cleanedSettings;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(cleanedSettings));
    } catch (e) {
      console.error(e);
    }
  }

  // 1. Direct Client Supabase upsert (instant cloud write)
  if (isSupabaseConfigured && supabase) {
    try {
      const uiConfig = JSON.stringify({
        heroPosition: cleanedSettings.heroPosition,
        heroFontSize: cleanedSettings.heroFontSize,
        planTripButtonText: cleanedSettings.planTripButtonText
      });

      const payload: Record<string, unknown> = {
        id: 'primary_settings',
        hide_all_prices: cleanedSettings.hideAllPrices,
        contact_mode: cleanedSettings.contactMode,
        google_form_embed_url: cleanedSettings.googleFormEmbedUrl,
        company_name: cleanedSettings.companyName,
        tagline: cleanedSettings.tagline,
        about_text: cleanedSettings.aboutText,
        contact_address: cleanedSettings.contactAddress,
        contact_email: cleanedSettings.contactEmail,
        contact_phone: cleanedSettings.contactPhone,
        contact_landline: cleanedSettings.contactLandline,
        whatsapp_number: cleanedSettings.whatsappNumber,
        instagram_url: cleanedSettings.instagramUrl,
        facebook_url: cleanedSettings.facebookUrl,
        twitter_url: cleanedSettings.twitterUrl,
        youtube_url: cleanedSettings.youtubeUrl,
        linkedin_url: uiConfig, // Stored safely in cloud DB
        pinterest_url: cleanedSettings.pinterestUrl,
        response_timing_text: cleanedSettings.responseTimingText,
        copyright_text: cleanedSettings.copyrightText,
        hero_title: cleanedSettings.heroTitle,
        hero_slides: cleanedSettings.heroSlides,
        hero_position: cleanedSettings.heroPosition,
        hero_font_size: cleanedSettings.heroFontSize,
        plan_trip_button_text: cleanedSettings.planTripButtonText,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('site_settings').upsert(payload);
      if (error && error.message && error.message.includes('column')) {
        delete payload.hero_position;
        delete payload.hero_font_size;
        delete payload.plan_trip_button_text;
        await supabase.from('site_settings').upsert(payload);
      }
    } catch (dbErr) {
      console.warn('Direct client Supabase save error:', dbErr);
    }
  }

  // 2. Also save via Next.js Server API route
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanedSettings)
    });
  } catch (err) {
    console.error('Settings API save failed:', err);
  }
}

// ==========================================
// PACKAGES
// ==========================================
export function getStoredPackages(): TourPackage[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(PACKAGES_STORAGE_KEY);
      if (stored) {
        const parsed: TourPackage[] = JSON.parse(stored);
        // Normalize any old packages that might have had 1 review or missing realistic ratings
        const normalized = parsed.map((p) => {
          if (!p.reviewsCount || p.reviewsCount <= 1 || !p.rating || p.rating < 4.7) {
            const { rating, reviewsCount } = generateRealisticRating(p.id, p.rating, p.reviewsCount);
            return { ...p, rating, reviewsCount };
          }
          return p;
        });
        return normalized;
      }
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(INITIAL_PACKAGES));
    } catch {
      return memoryPackages;
    }
  }
  return memoryPackages;
}

export async function fetchCloudPackages(): Promise<TourPackage[]> {
  try {
    const res = await fetch('/api/packages', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.packages && json.packages.length > 0) {
        saveStoredPackages(json.packages);
        return json.packages;
      }
    }
  } catch (err) {
    console.warn('API fetch packages error:', err);
  }

  return getStoredPackages();
}

export function saveStoredPackages(packages: TourPackage[]) {
  memoryPackages = packages;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
    } catch (e) {
      console.error(e);
    }
  }
}

export function getPackageByIdOrSlug(idOrSlug: string): TourPackage | undefined {
  const packages = getStoredPackages();
  return packages.find(p => p.id === idOrSlug || p.slug === idOrSlug);
}

export async function savePackage(pkg: Partial<TourPackage> & { title: string }): Promise<TourPackage> {
  const packages = getStoredPackages();
  const id = pkg.id || `td-${Date.now()}`;
  const slug = pkg.slug || pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const rawBanner = normalizeImageUrl(pkg.bannerImage || '');
  const bannerImage = rawBanner || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

  const rawGallery = pkg.gallery && pkg.gallery.length 
    ? pkg.gallery.filter(Boolean).map(normalizeImageUrl) 
    : [bannerImage];

  const existingIndex = packages.findIndex(p => p.id === id);
  const existingPkg = existingIndex >= 0 ? packages[existingIndex] : undefined;

  const { rating, reviewsCount } = generateRealisticRating(
    id,
    pkg.rating ?? existingPkg?.rating,
    pkg.reviewsCount ?? existingPkg?.reviewsCount
  );

  const fullPkg: TourPackage = {
    id,
    slug,
    title: pkg.title,
    tagline: pkg.tagline || '',
    state: pkg.state || 'Pan India',
    location: pkg.location || 'India',
    duration: pkg.duration || { days: 4, nights: 3 },
    price: Number(pkg.price) || 0,
    originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : undefined,
    hidePrice: Boolean(pkg.hidePrice),
    featured: Boolean(pkg.featured),
    status: pkg.status || 'active',
    rating,
    reviewsCount,
    bannerImage,
    gallery: rawGallery.length ? rawGallery : [bannerImage],
    videoUrl: pkg.videoUrl ? pkg.videoUrl.trim() : '',
    overview: pkg.overview ? pkg.overview.trim() : '',
    theme: pkg.theme || 'Nature',
    highlights: pkg.highlights && pkg.highlights.length ? pkg.highlights.filter(Boolean) : [],
    inclusions: pkg.inclusions && pkg.inclusions.length ? pkg.inclusions.filter(Boolean) : [],
    exclusions: pkg.exclusions && pkg.exclusions.length ? pkg.exclusions.filter(Boolean) : [],
    itinerary: pkg.itinerary && pkg.itinerary.length ? pkg.itinerary : [],
    groupSize: pkg.groupSize || 'Customizable',
    bestTimeToVisit: pkg.bestTimeToVisit || 'Year-round',
    createdAt: pkg.createdAt || existingPkg?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    packages[existingIndex] = fullPkg;
  } else {
    packages.unshift(fullPkg);
  }

  saveStoredPackages(packages);

  // Sync to API / Cloud
  try {
    await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPkg)
    });
  } catch (e) {
    console.error('API package save failed:', e);
  }

  return fullPkg;
}

export async function deletePackage(id: string) {
  const packages = getStoredPackages().filter(p => p.id !== id);
  saveStoredPackages(packages);

  try {
    await fetch(`/api/packages?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.error('API package delete failed:', e);
  }
}

// ==========================================
// LEADS & INQUIRIES
// ==========================================
export function getStoredLeads(): LeadInquiry[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LEADS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      return memoryLeads;
    }
  }
  return memoryLeads;
}

export async function fetchCloudLeads(): Promise<LeadInquiry[]> {
  try {
    const res = await fetch('/api/leads', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.leads) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(json.leads));
          } catch {}
        }
        memoryLeads = json.leads;
        return json.leads;
      }
    }
  } catch (err) {
    console.warn('API leads fetch fallback:', err);
  }
  return getStoredLeads();
}

export async function saveLead(leadData: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'> & { status?: LeadInquiry['status'] }): Promise<LeadInquiry> {
  const leads = getStoredLeads();
  const newLead: LeadInquiry = {
    ...leadData,
    id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    status: leadData.status || 'new'
  };

  leads.unshift(newLead);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }

  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    });
  } catch (e) {
    console.error('API lead dispatch failed:', e);
  }

  return newLead;
}

export async function updateLeadStatus(id: string, status: LeadInquiry['status']) {
  const leads = getStoredLeads();
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Update in cloud Supabase database
  try {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
  } catch (err) {
    console.error('Failed to sync lead status to cloud:', err);
  }
}

export async function deleteLead(id: string) {
  const leads = getStoredLeads().filter(l => l.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }

  try {
    await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to delete lead from cloud:', err);
  }
}
