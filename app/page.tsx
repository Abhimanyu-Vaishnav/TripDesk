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
  const [sortBy, setSortBy] = useState<string>('featured'); // 'featured' | 'price_asc' | 'price_desc' | 'days_asc' | 'days_desc' | 'rating'
  
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

  // Sort logic
  const sortedPackages = React.useMemo(() => {
    const list = [...filteredPackages];
    switch (sortBy) {
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
  }, [filteredPackages, sortBy]);

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

            {/* Quick Filter & Sort Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#FDF7E7] dark:bg-[#1D1008] p-2 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612]">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] text-xs font-semibold text-[#351202] dark:text-[#FEFAEE]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#DB9309]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="featured" className="bg-white dark:bg-[#120904]">Featured First</option>
                  <option value="price_asc" className="bg-white dark:bg-[#120904]">Price: Low to High</option>
                  <option value="price_desc" className="bg-white dark:bg-[#120904]">Price: High to Low</option>
                  <option value="days_asc" className="bg-white dark:bg-[#120904]">Duration: Short to Long</option>
                  <option value="days_desc" className="bg-white dark:bg-[#120904]">Duration: Long to Short</option>
                  <option value="rating" className="bg-white dark:bg-[#120904]">Highest Rated</option>
                </select>
              </div>

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

              {(selectedState !== 'All States' || selectedTheme !== 'All Themes' || searchQuery || sortBy !== 'featured') && (
                <button
                  onClick={() => {
                    setSelectedState('All States');
                    setSelectedTheme('All Themes');
                    setSearchQuery('');
                    setSortBy('featured');
                  }}
                  className="text-xs px-2.5 py-1.5 text-[#DB9309] hover:underline font-medium"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results count & status */}
          <div className="flex items-center justify-between text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 mb-6 pb-3 border-b border-[#EADBBA]/60 dark:border-[#4D2612]">
            <span>
              Showing {displayedPackages.length} of {sortedPackages.length} packages across India
            </span>
            {selectedState !== 'All States' && (
              <span className="font-medium text-[#351202] dark:text-[#FEFAEE]">Filtered by {selectedState}</span>
            )}
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
