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
  featured: boolean;
  status: 'active' | 'draft' | 'featured';
  rating: number;
  reviewsCount: number;
  bannerImage: string;
  gallery: string[];
  videoUrl?: string; // YouTube embed or video link
  overview: string;
  theme: 'Honeymoon' | 'Adventure' | 'Heritage' | 'Nature' | 'Beach' | 'Pilgrimage' | 'Luxury';
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  groupSize?: string;
  bestTimeToVisit?: string;
}

export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelDate?: string;
  travelersCount: number;
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

