import { TourPackage, LeadInquiry, SiteSettings } from '@/types';
import { INITIAL_PACKAGES } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const PACKAGES_STORAGE_KEY = 'tripdesk_packages_v3';
const LEADS_STORAGE_KEY = 'tripdesk_leads_v3';
const SETTINGS_STORAGE_KEY = 'tripdesk_settings_v3';

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
  copyrightText: '© 2026 TripDesk Holidays LLP. All Rights Reserved.'
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
          responseTimingText: data.response_timing_text || DEFAULT_SETTINGS.responseTimingText,
          copyrightText: data.copyright_text || DEFAULT_SETTINGS.copyrightText
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
  memorySettings = settings;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }

  // Save via API (persists to server & Supabase regardless of client env)
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
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
      if (stored) return JSON.parse(stored);
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
    rating: pkg.rating || 4.9,
    reviewsCount: pkg.reviewsCount || 1,
    bannerImage: pkg.bannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: pkg.gallery && pkg.gallery.length ? pkg.gallery.filter(Boolean) : [pkg.bannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
    videoUrl: pkg.videoUrl ? pkg.videoUrl.trim() : '',
    overview: pkg.overview ? pkg.overview.trim() : '',
    theme: pkg.theme || 'Nature',
    highlights: pkg.highlights && pkg.highlights.length ? pkg.highlights.filter(Boolean) : [],
    inclusions: pkg.inclusions && pkg.inclusions.length ? pkg.inclusions.filter(Boolean) : [],
    exclusions: pkg.exclusions && pkg.exclusions.length ? pkg.exclusions.filter(Boolean) : [],
    itinerary: pkg.itinerary && pkg.itinerary.length ? pkg.itinerary : [],
    groupSize: pkg.groupSize || 'Customizable',
    bestTimeToVisit: pkg.bestTimeToVisit || 'Year-round'
  };

  const existingIndex = packages.findIndex(p => p.id === id);
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

export function updateLeadStatus(id: string, status: LeadInquiry['status']) {
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
}
