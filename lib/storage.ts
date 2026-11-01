import { TourPackage, LeadInquiry, SiteSettings } from '@/types';
import { INITIAL_PACKAGES } from './mockData';

const PACKAGES_STORAGE_KEY = 'tripdesk_packages_v2';
const LEADS_STORAGE_KEY = 'tripdesk_leads_v2';
const SETTINGS_STORAGE_KEY = 'tripdesk_settings_v2';

export const DEFAULT_SETTINGS: SiteSettings = {
  hideAllPrices: false,
  contactMode: 'google_form',
  googleFormEmbedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScU73iF8gH-tripdesk-sample/viewform?embedded=true',
  whatsappNumber: '+919876543210',
  contactEmail: 'desk@tripdeskholidays.com',
  contactPhone: '+91 98765 43210'
};

let memorySettings: SiteSettings = { ...DEFAULT_SETTINGS };
let memoryPackages: TourPackage[] = [...INITIAL_PACKAGES];
let memoryLeads: LeadInquiry[] = [
  {
    id: 'lead-01',
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
      if (stored) return JSON.parse(stored);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      return memorySettings;
    }
  }
  return memorySettings;
}

export function saveStoredSettings(settings: SiteSettings) {
  memorySettings = settings;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }
}

// PACKAGES
export function getStoredPackages(): TourPackage[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(PACKAGES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(INITIAL_PACKAGES));
    } catch {
      return memoryPackages;
    }
  }
  return memoryPackages;
}

export function saveStoredPackages(packages: TourPackage[]) {
  memoryPackages = packages;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }
}

export function getPackageByIdOrSlug(idOrSlug: string): TourPackage | undefined {
  const packages = getStoredPackages();
  return packages.find(p => p.id === idOrSlug || p.slug === idOrSlug);
}

export function savePackage(pkg: Partial<TourPackage> & { title: string }): TourPackage {
  const packages = getStoredPackages();
  const id = pkg.id || `td-${Date.now()}`;
  const slug = pkg.slug || pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const fullPkg: TourPackage = {
    id,
    slug,
    title: pkg.title,
    tagline: pkg.tagline || 'Experience extraordinary journeys with TripDesk Holidays.',
    state: pkg.state || 'Pan India',
    location: pkg.location || 'India',
    duration: pkg.duration || { days: 4, nights: 3 },
    price: Number(pkg.price) || 15000,
    originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : undefined,
    hidePrice: Boolean(pkg.hidePrice),
    featured: Boolean(pkg.featured),
    status: pkg.status || 'active',
    rating: pkg.rating || 4.9,
    reviewsCount: pkg.reviewsCount || 1,
    bannerImage: pkg.bannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: pkg.gallery && pkg.gallery.length ? pkg.gallery : [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: pkg.videoUrl || '',
    overview: pkg.overview || 'An unforgettable experience curated by TripDesk.',
    theme: pkg.theme || 'Nature',
    highlights: pkg.highlights && pkg.highlights.length ? pkg.highlights : ['Scenic sights', 'Curated experiences'],
    inclusions: pkg.inclusions && pkg.inclusions.length ? pkg.inclusions : ['Breakfast', 'Transfers', 'Hotel Stay'],
    exclusions: pkg.exclusions && pkg.exclusions.length ? pkg.exclusions : ['Personal Expenses', 'Airfare'],
    itinerary: pkg.itinerary && pkg.itinerary.length ? pkg.itinerary : [
      {
        day: 1,
        title: 'Arrival & Welcome',
        description: 'Arrive at destination and get settled.',
        meals: 'Dinner'
      }
    ],
    groupSize: pkg.groupSize || 'All travelers',
    bestTimeToVisit: pkg.bestTimeToVisit || 'Year-round'
  };

  const existingIndex = packages.findIndex(p => p.id === id);
  if (existingIndex >= 0) {
    packages[existingIndex] = fullPkg;
  } else {
    packages.unshift(fullPkg);
  }
  
  saveStoredPackages(packages);
  return fullPkg;
}

export function deletePackage(id: string): boolean {
  const packages = getStoredPackages();
  const filtered = packages.filter(p => p.id !== id);
  saveStoredPackages(filtered);
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

export function saveLead(lead: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>): LeadInquiry {
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
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadInquiry['status']) {
  const leads = getStoredLeads();
  const item = leads.find(l => l.id === id);
  if (item) {
    item.status = status;
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    }
  }
}
