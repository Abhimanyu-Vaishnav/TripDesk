'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import FloatingCTA from '@/components/ui/FloatingCTA';
import HeroSection from '@/components/home/HeroSection';
import ExploreStatesSection from '@/components/home/ExploreStatesSection';
import WhyUsSection from '@/components/home/WhyUsSection';
import PackageCard from '@/components/packages/PackageCard';
import PackageDetailModal from '@/components/packages/PackageDetailModal';
import InquiryForm from '@/components/contact/InquiryForm';
import { TourPackage, SiteSettings } from '@/types';
import { getStoredPackages, getStoredSettings, fetchCloudPackages, fetchCloudSettings } from '@/lib/storage';
import { THEMES_LIST, STATES_LIST } from '@/lib/mockData';
import { Sparkles, Search, ArrowUpDown, ChevronDown, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedTheme, setSelectedTheme] = useState<string>('All Themes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest'); // 'newest' | 'popular' | 'featured' | 'price_asc' | 'price_desc' | 'days_asc' | 'days_desc' | 'rating' | 'random'
  
  // Pagination / Load More state (12 per batch)
  const INITIAL_BATCH_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Modal & Enquiry state
  const [activeModalPackage, setActiveModalPackage] = useState<TourPackage | null>(null);
  const [enquiryPackage, setEnquiryPackage] = useState<TourPackage | null>(null);

  useEffect(() => {
    // Immediate render with local cache
    setPackages(getStoredPackages());
    setSettings(getStoredSettings());

    // Asynchronously sync from Cloud database
    fetchCloudPackages().then(cloudPkgs => {
      if (cloudPkgs && cloudPkgs.length > 0) {
        setPackages(cloudPkgs);
      }
    });

    fetchCloudSettings().then(cloudSettings => {
      if (cloudSettings) {
        setSettings(cloudSettings);
      }
    });
  }, []);

  // Dynamic list of themes including predefined ones and any custom themes in packages
  const dynamicThemesList = React.useMemo(() => {
    const set = new Set<string>(THEMES_LIST);
    packages.forEach(p => {
      if (p.theme && p.theme.trim()) {
        set.add(p.theme.trim());
      }
    });
    return Array.from(set);
  }, [packages]);

  // Dynamic list of states including all 36 India states/UTs and any custom package states
  const dynamicStatesList = React.useMemo(() => {
    const set = new Set<string>(STATES_LIST);
    packages.forEach(p => {
      if (p.state && p.state.trim()) {
        set.add(p.state.trim());
      }
    });
    return Array.from(set);
  }, [packages]);

  const handleHeroSearch = (filters: { state: string; destination: string; budget: string; duration: string }) => {
    setSelectedState(filters.state);
    setSearchQuery(filters.destination);
    setSelectedDuration(filters.duration);
    setSelectedBudget(filters.budget);
  };

  const handleEnquireTrigger = (pkg: TourPackage) => {
    setEnquiryPackage(pkg);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter logic
  const filteredPackages = packages.filter((pkg) => {
    if (pkg.status === 'draft') return false;

    if (selectedState !== 'All States' && pkg.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }

    if (selectedTheme !== 'All Themes' && pkg.theme.toLowerCase() !== selectedTheme.toLowerCase()) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        pkg.title.toLowerCase().includes(q) ||
        pkg.location.toLowerCase().includes(q) ||
        pkg.state.toLowerCase().includes(q) ||
        pkg.highlights.some((h) => h.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedDuration.trim()) {
      const parsedDays = parseInt(selectedDuration, 10);
      if (!isNaN(parsedDays)) {
        // Match packages having similar days (±1 day tolerance for flexibility)
        if (Math.abs(pkg.duration.days - parsedDays) > 1 && pkg.duration.days !== parsedDays) {
          return false;
        }
      } else {
        if (selectedDuration === 'short' && pkg.duration.days > 4) return false;
        if (selectedDuration === 'medium' && (pkg.duration.days < 5 || pkg.duration.days > 7)) return false;
        if (selectedDuration === 'long' && pkg.duration.days < 8) return false;
      }
    }

    if (selectedBudget === 'budget' && pkg.price > 20000) return false;
    if (selectedBudget === 'mid' && (pkg.price < 20000 || pkg.price > 30000)) return false;
    if (selectedBudget === 'luxury' && pkg.price <= 30000) return false;

    return true;
  });

  // Random seed state so random shuffle only recalculates when user selects "random" or shuffles
  const [randomSeed, setRandomSeed] = useState<number>(1);

  // Sort logic
  const sortedPackages = React.useMemo(() => {
    const list = [...filteredPackages];
    switch (sortBy) {
      case 'newest':
        // Sort by modified/created date (newest first). Fallback to array index/id
        return list.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          if (dateA !== dateB) return dateB - dateA;
          return b.id.localeCompare(a.id);
        });

      case 'popular':
        // Most booked / most popular (based on reviewsCount and rating)
        return list.sort((a, b) => {
          const popA = (a.reviewsCount || 0) * 10 + (a.rating || 0);
          const popB = (b.reviewsCount || 0) * 10 + (b.rating || 0);
          return popB - popA;
        });

      case 'random':
        // Pseudo-random deterministic shuffle using randomSeed
        return list
          .map((item, index) => ({ item, sortKey: Math.sin(index + randomSeed) }))
          .sort((a, b) => a.sortKey - b.sortKey)
          .map(({ item }) => item);

      case 'price_asc':
        return list.sort((a, b) => a.price - b.price);

      case 'price_desc':
        return list.sort((a, b) => b.price - a.price);

      case 'days_asc':
        return list.sort((a, b) => a.duration.days - b.duration.days);

      case 'days_desc':
        return list.sort((a, b) => b.duration.days - a.duration.days);

      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case 'featured':
      default:
        // Featured packages first, then by rating
        return list.sort((a, b) => {
          if (a.featured === b.featured) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return a.featured ? -1 : 1;
        });
    }
  }, [filteredPackages, sortBy, randomSeed]);

  // Packages to display based on visibleCount
  const displayedPackages = sortedPackages.slice(0, visibleCount);
  const hasMore = visibleCount < sortedPackages.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + INITIAL_BATCH_SIZE);
      setIsLoadingMore(false);
    }, 450); // Delightful smooth loading experience
  };

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [selectedState, selectedTheme, searchQuery, selectedDuration, selectedBudget, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAEE] dark:bg-[#120904]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onSearch={handleHeroSearch}
          slides={settings?.heroSlides}
          headline={settings?.heroTitle}
        />

        {/* Explore States Grid - Dynamically computed from active packages */}
        <ExploreStatesSection
          selectedState={selectedState}
          onSelectState={(st) => setSelectedState(st)}
          packages={packages}
        />

        {/* Packages Section */}
        <section id="packages" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#DB9309] font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Handcrafted Packages
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351202] dark:text-[#FEFAEE] mt-1.5">
                Trending Tour Packages
              </h2>
              <p className="text-sm text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-2 max-w-xl">
                All-inclusive experiential itineraries. Every package includes verified stays, AC private transfers, breakfasts & curated sightseeing.
              </p>
            </div>

            {/* Quick Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#FDF7E7] dark:bg-[#1D1008] p-2 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612]">
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309] cursor-pointer"
              >
                {dynamicThemesList.map((th) => (
                  <option key={th} value={th} className="bg-white dark:bg-[#120904]">
                    {th}
                  </option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309] cursor-pointer"
              >
                {dynamicStatesList.map((st) => (
                  <option key={st} value={st} className="bg-white dark:bg-[#120904]">
                    {st}
                  </option>
                ))}
              </select>

              {(selectedState !== 'All States' || selectedTheme !== 'All Themes' || searchQuery || sortBy !== 'newest') && (
                <button
                  onClick={() => {
                    setSelectedState('All States');
                    setSelectedTheme('All Themes');
                    setSearchQuery('');
                    setSortBy('newest');
                  }}
                  className="text-xs px-2.5 py-1.5 text-[#DB9309] hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results count & status + Elegant subtle Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 mb-6 pb-3 border-b border-[#EADBBA]/60 dark:border-[#4D2612]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-[#351202] dark:text-[#FEFAEE]">
                Showing {displayedPackages.length} of {sortedPackages.length} packages across India
              </span>
              {selectedState !== 'All States' && (
                <span className="px-2 py-0.5 rounded-full bg-[#DB9309]/15 text-[#DB9309] font-medium text-[11px]">
                  {selectedState}
                </span>
              )}
            </div>

            {/* Subtle, beautiful, responsive Sort control placed right on this info line */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] uppercase tracking-wider text-[#351202]/50 dark:text-[#FEFAEE]/50 font-semibold flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-[#DB9309]" /> Sort:
              </span>
              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    if (e.target.value === 'random') {
                      setRandomSeed(Date.now());
                    }
                    setSortBy(e.target.value);
                  }}
                  className="appearance-none text-xs font-medium pl-2.5 pr-7 py-1 rounded-lg bg-transparent hover:bg-white/60 dark:hover:bg-[#1D1008] border border-transparent hover:border-[#EADBBA] dark:hover:border-[#4D2612] text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:ring-1 focus:ring-[#DB9309] cursor-pointer transition-all"
                >
                  <option value="newest" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                    Newly Added / Recent
                  </option>
                  <option value="popular" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                    Most Popular & Booked
                  </option>
                  <option value="featured" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                    Featured Handpicked
                  </option>
                  {!settings?.hideAllPrices && (
                    <>
                      <option value="price_asc" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                        Price: Low to High
                      </option>
                      <option value="price_desc" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                        Price: High to Low
                      </option>
                    </>
                  )}
                  <option value="days_asc" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                    Duration: Short to Long
                  </option>
                  <option value="days_desc" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                    Duration: Long to Short
                  </option>
                  <option value="rating" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                    Highest Rated
                  </option>
                  <option value="random" className="bg-[#FEFAEE] text-[#351202] dark:bg-[#120904] dark:text-[#FEFAEE]">
                    Surprise Me (Random)
                  </option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#DB9309] pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 opacity-70" />
              </div>
            </div>
          </div>

          {/* Package Cards Grid */}
          {displayedPackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    packageData={pkg}
                    hideAllPrices={settings?.hideAllPrices}
                    onQuickView={(p) => setActiveModalPackage(p)}
                  />
                ))}
              </div>

              {/* Load More Button with Smooth Animated Spinner */}
              {hasMore && (
                <div className="mt-12 text-center flex flex-col items-center justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-sm text-[#351202] dark:text-[#FEFAEE] bg-[#FDF7E7] dark:bg-[#1D1008] border-2 border-[#DB9309]/50 hover:border-[#DB9309] shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#DB9309] animate-spin" />
                        <span>Curating More Packages...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Handcrafted Packages</span>
                        <ChevronDown className="w-4 h-4 text-[#DB9309] group-hover:translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-[#351202]/50 dark:text-[#FEFAEE]/50 mt-2">
                    {sortedPackages.length - displayedPackages.length} more itineraries available
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center bg-[#FDF7E7] dark:bg-[#1D1008] rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] p-8">
              <Search className="w-12 h-12 text-[#DB9309] mx-auto mb-3" />
              <h3 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE]">No Packages Found</h3>
              <p className="text-sm text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-2 max-w-md mx-auto">
                No itineraries match your current search filters. Try switching states or resetting filters.
              </p>
              <button
                onClick={() => {
                  setSelectedState('All States');
                  setSelectedTheme('All Themes');
                  setSearchQuery('');
                }}
                className="mt-5 px-6 py-2.5 rounded-full bg-[#351202] text-white text-xs font-semibold hover:bg-[#4D1D05]"
              >
                View All Pan-India Packages
              </button>
            </div>
          )}
        </section>

        {/* Why Us Section */}
        <WhyUsSection />

        {/* Contact & Lead Capture Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <InquiryForm initialPackage={enquiryPackage} />
        </section>
      </main>

      {/* Package Detail Modal */}
      <PackageDetailModal
        packageData={activeModalPackage}
        isOpen={Boolean(activeModalPackage)}
        onClose={() => setActiveModalPackage(null)}
        onEnquire={(pkg) => handleEnquireTrigger(pkg)}
      />

      {/* Floating CTA */}
      <FloatingCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
