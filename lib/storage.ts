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
let memoryLeads: LeadInquiry[] = [
  {
    id: 'lead-01',
    type: 'package_booking',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    destination: 'Kashmir',
    travelDate: '2026-11-20',
    travelersCount: 2,
    budgetRange: '₹50,000 - ₹75,000',
    notes: 'Planning our 2nd wedding anniversary trip. Interested in luxury houseboat stay.',
    packageId: 'td-01',
    packageTitle: 'Kashmir: Paradise On Earth & Dal Lake Escapade',
    createdAt: '2026-10-28T10:30:00.000Z',
    status: 'contacted'
  }
];

// SITE SETTINGS
export function getStoredSettings(): SiteSettings {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      return memorySettings;
    }
  }
  return memorySettings;
}

export async function fetchCloudSettings(): Promise<SiteSettings> {
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
          contactMode: data.contact_mode || 'google_form',
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

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('site_settings').upsert({
        id: 'primary_settings',
        hide_all_prices: settings.hideAllPrices,
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
        response_timing_text: settings.responseTimingText,
        copyright_text: settings.copyrightText,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Supabase settings save failed:', e);
    }
  }
}

// PACKAGES
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
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const mapped: TourPackage[] = data.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          tagline: item.tagline || '',
          state: item.state,
          location: item.location,
          duration: item.duration || { days: 5, nights: 4 },
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          hidePrice: Boolean(item.hide_price),
          featured: Boolean(item.featured),
          status: item.status || 'active',
          rating: Number(item.rating) || 4.9,
          reviewsCount: Number(item.reviews_count) || 1,
          bannerImage: item.banner_image,
          gallery: Array.isArray(item.gallery) ? item.gallery : [item.banner_image],
          videoUrl: item.video_url || '',
          overview: item.overview || '',
          theme: item.theme || 'Nature',
          highlights: Array.isArray(item.highlights) ? item.highlights : [],
          inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
          exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
          itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
          groupSize: item.group_size || 'Customizable',
          bestTimeToVisit: item.best_time_to_visit || 'Year-round'
        }));
        saveStoredPackages(mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase packages fetch fallback:', e);
    }
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

  // Sync to Supabase cloud
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('packages').upsert({
        id: fullPkg.id,
        slug: fullPkg.slug,
        title: fullPkg.title,
        tagline: fullPkg.tagline,
        state: fullPkg.state,
        location: fullPkg.location,
        duration: fullPkg.duration,
        price: fullPkg.price,
        original_price: fullPkg.originalPrice,
        hide_price: fullPkg.hidePrice,
        featured: fullPkg.featured,
        status: fullPkg.status,
        rating: fullPkg.rating,
        reviews_count: fullPkg.reviewsCount,
        banner_image: fullPkg.bannerImage,
        gallery: fullPkg.gallery,
        video_url: fullPkg.videoUrl,
        overview: fullPkg.overview,
        theme: fullPkg.theme,
        highlights: fullPkg.highlights,
        inclusions: fullPkg.inclusions,
        exclusions: fullPkg.exclusions,
        itinerary: fullPkg.itinerary,
        group_size: fullPkg.groupSize,
        best_time_to_visit: fullPkg.bestTimeToVisit,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Supabase package save error:', e);
    }
  }

  return fullPkg;
}

export async function deletePackage(id: string): Promise<boolean> {
  const packages = getStoredPackages();
  const filtered = packages.filter(p => p.id !== id);
  saveStoredPackages(filtered);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('packages').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase package delete error:', e);
    }
  }

  return true;
}

// LEADS
export function getStoredLeads(): LeadInquiry[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LEADS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(memoryLeads));
    } catch {
      return memoryLeads;
    }
  }
  return memoryLeads;
}

export async function fetchCloudLeads(): Promise<LeadInquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const mapped: LeadInquiry[] = data.map((item) => ({
          id: item.id,
          type: item.type,
          name: item.name,
          email: item.email || '',
          phone: item.phone,
          destination: item.destination,
          travelDate: item.travel_date,
          travelersCount: item.travelers_count,
          budgetRange: item.budget_range,
          notes: item.notes,
          packageId: item.package_id,
          packageTitle: item.package_title,
          createdAt: item.created_at,
          status: item.status || 'new'
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(mapped));
        }
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase leads fetch error:', e);
    }
  }
  return getStoredLeads();
}

export async function saveLead(lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>): Promise<LeadInquiry> {
  const leads = getStoredLeads();
  const newLead: LeadInquiry = {
    ...lead,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  leads.unshift(newLead);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error(e);
    }
  }

  // Push to Supabase Cloud
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('leads').insert({
        id: newLead.id,
        type: newLead.type || 'general_inquiry',
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email || '',
        destination: newLead.destination || '',
        travel_date: newLead.travelDate || '',
        travelers_count: newLead.travelersCount || 2,
        budget_range: newLead.budgetRange || '',
        notes: newLead.notes || '',
        package_id: newLead.packageId,
        package_title: newLead.packageTitle,
        status: 'new',
        created_at: newLead.createdAt
      });
    } catch (e) {
      console.error('Supabase lead insert error:', e);
    }
  }

  return newLead;
}

export async function updateLeadStatus(id: string, status: LeadInquiry['status']) {
  const leads = getStoredLeads();
  const item = leads.find(l => l.id === id);
  if (item) {
    item.status = status;
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('leads').update({ status }).eq('id', id);
    } catch (e) {
      console.error('Supabase lead status update error:', e);
    }
  }
}
