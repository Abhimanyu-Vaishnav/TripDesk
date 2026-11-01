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
import { getStoredPackages, getStoredSettings } from '@/lib/storage';
import { THEMES_LIST, STATES_LIST } from '@/lib/mockData';
import { Sparkles, Search } from 'lucide-react';

export default function HomePage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedTheme, setSelectedTheme] = useState<string>('All Themes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

  // Modal & Enquiry state
  const [activeModalPackage, setActiveModalPackage] = useState<TourPackage | null>(null);
  const [enquiryPackage, setEnquiryPackage] = useState<TourPackage | null>(null);

  useEffect(() => {
    setPackages(getStoredPackages());
    setSettings(getStoredSettings());
  }, []);

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

    if (selectedDuration === 'short' && pkg.duration.days > 4) return false;
    if (selectedDuration === 'medium' && (pkg.duration.days < 5 || pkg.duration.days > 7)) return false;
    if (selectedDuration === 'long' && pkg.duration.days < 8) return false;

    if (selectedBudget === 'budget' && pkg.price > 20000) return false;
    if (selectedBudget === 'mid' && (pkg.price < 20000 || pkg.price > 30000)) return false;
    if (selectedBudget === 'luxury' && pkg.price <= 30000) return false;

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAEE] dark:bg-[#120904]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onSearch={handleHeroSearch} />

        {/* Explore States Grid */}
        <ExploreStatesSection
          selectedState={selectedState}
          onSelectState={(st) => setSelectedState(st)}
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
                {THEMES_LIST.map((th) => (
                  <option key={th} value={th}>
                    {th}
                  </option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309] cursor-pointer"
              >
                {STATES_LIST.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {(selectedState !== 'All States' || selectedTheme !== 'All Themes' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedState('All States');
                    setSelectedTheme('All Themes');
                    setSearchQuery('');
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
            <span>Showing {filteredPackages.length} packages across India</span>
            {selectedState !== 'All States' && (
              <span className="font-medium text-[#351202] dark:text-[#FEFAEE]">Filtered by {selectedState}</span>
            )}
          </div>

          {/* Package Cards Grid */}
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  packageData={pkg}
                  hideAllPrices={settings?.hideAllPrices}
                  onQuickView={(p) => setActiveModalPackage(p)}
                />
              ))}
            </div>
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
