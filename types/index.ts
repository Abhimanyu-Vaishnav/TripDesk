export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  hotel?: string;
  activities?: string[];
}

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  state: string;
  location: string;
  duration: {
    days: number;
    nights: number;
  };
  price: number;
  originalPrice?: number;
  hidePrice?: boolean; // Owner can toggle to hide exact price and show "Price on Request"
  featured: boolean;
  status: 'active' | 'draft' | 'featured';
  rating: number;
  reviewsCount: number;
  bannerImage: string;
  gallery: string[];
  videoUrl?: string; // YouTube embed or video link
  overview: string;
  theme: string; // Predefined or custom theme added by admin
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  groupSize?: string;
  bestTimeToVisit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  hideAllPrices: boolean; // Global toggle to hide prices across entire website
  contactMode: 'google_form' | 'custom_form' | 'both';
  googleFormEmbedUrl: string;
  googleSheetsWebhookUrl?: string;
  // Dynamic Footer & Company Info
  companyName: string;
  tagline: string;
  aboutText: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  contactLandline?: string;
  whatsappNumber: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  pinterestUrl?: string;
  responseTimingText?: string;
  copyrightText?: string;
  // Hero & Homepage Customization
  heroTitle?: string;
  heroSlides?: { url: string; title: string }[];
  heroPosition?: 'bottom' | 'middle' | 'top'; // Vertical position of hero title & search box
  heroFontSize?: 'compact' | 'standard' | 'large' | 'extralarge'; // Tagline / Headline text size
  planTripButtonText?: string; // Customizable CTA text in Navbar (e.g. "Plan My Trip")
}

export interface LeadInquiry {
  id: string;
  type?: 'general_inquiry' | 'talk_to_specialist' | 'package_booking';
  name: string;
  email: string;
  phone: string;
  destination?: string;
  travelDate?: string;
  travelersCount?: number;
  budgetRange?: string;
  notes?: string;
  packageId?: string;
  packageTitle?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'booked' | 'cancelled';
}

export interface FilterState {
  searchQuery: string;
  state: string;
  theme: string;
  duration: string;
  budget: string;
}
