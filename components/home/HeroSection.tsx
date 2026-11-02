'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Compass, ShieldCheck } from 'lucide-react';
import { STATES_LIST } from '@/lib/mockData';

interface HeroSectionProps {
  onSearch: (filters: { state: string; destination: string; budget: string; duration: string }) => void;
}

// Cinematic Background slides representing incredible Indian destinations
const HERO_SLIDES = [
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

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [selectedState, setSelectedState] = useState('All States');
  const [searchDestination, setSearchDestination] = useState('');
  const [customDays, setCustomDays] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      state: selectedState,
      destination: searchDestination,
      budget: 'all',
      duration: customDays,
    });

    const el = document.getElementById('packages');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Slideshow with Smooth Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={HERO_SLIDES[currentSlide].url}
              alt={HERO_SLIDES[currentSlide].title}
              fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Lighter, high-visibility overlay (enhanced visibility without drowning images) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/30 dark:from-black/75 dark:via-black/55 dark:to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FEFAEE]/25 dark:from-[#120904]/40 via-transparent to-black/25" />
      </div>

      {/* Slide Indicators on Bottom Right */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentSlide
                ? 'w-6 h-2 bg-[#DB9309]'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        {/* Main Clean Headline: Bold (not too heavy), no underline on Desk */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold !text-white tracking-tight leading-[1.15] max-w-4xl drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]"
        >
          From <span className="text-[#DB9309] italic font-semibold">Desk</span> to Dream Destination
        </motion.h1>

        {/* Clean, Breathable Spacing with Interactive Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-8 sm:mt-10 w-full max-w-4xl"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#FEFAEE]/95 dark:bg-[#1D1008]/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl shadow-2xl border-2 border-[#DB9309] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-left transition-colors"
          >
            {/* 1. State / Region */}
            <div className="p-2 sm:p-3 rounded-2xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all">
              <label className="block text-[10px] font-bold text-[#351202]/70 dark:text-[#FEFAEE]/70 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#DB9309]" /> State / Region
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-[#351202] dark:text-[#FEFAEE] bg-transparent focus:outline-none cursor-pointer"
              >
                {STATES_LIST.map((st) => (
                  <option key={st} value={st} className="bg-white dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Destination Search Keyword */}
            <div className="p-2 sm:p-3 rounded-2xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all">
              <label className="block text-[10px] font-bold text-[#351202]/70 dark:text-[#FEFAEE]/70 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#DB9309]" /> Destination / City
              </label>
              <input
                type="text"
                placeholder="e.g. Manali, Gulmarg, Alleppey"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium text-[#351202] dark:text-[#FEFAEE] bg-transparent focus:outline-none placeholder:text-[#351202]/40 dark:placeholder:text-[#FEFAEE]/40"
              />
            </div>

            {/* 3. Duration: User Input (e.g. 3, 5, 7 Days) */}
            <div className="p-2 sm:p-3 rounded-2xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all">
              <label className="block text-[10px] font-bold text-[#351202]/70 dark:text-[#FEFAEE]/70 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#DB9309]" /> Trip Duration
              </label>
              <input
                type="number"
                min="1"
                max="30"
                placeholder="e.g. 5 Days"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-[#351202] dark:text-[#FEFAEE] bg-transparent focus:outline-none placeholder:text-[#351202]/40 dark:placeholder:text-[#FEFAEE]/40"
              />
            </div>

            {/* 4. Action Search Button */}
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[50px] rounded-2xl bg-[#DB9309] hover:bg-[#c27f05] text-[#351202] hover:text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group active:scale-95"
              >
                <Search className="w-4 h-4 text-[#351202] group-hover:text-white transition-colors" />
                <span>Search Journeys</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Clean Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-white/95 text-xs sm:text-sm font-medium drop-shadow"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#DB9309]" />
            <span>100% Customized Itineraries</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#DB9309]">★ 4.9/5</span>
            <span>2,500+ Happy Travelers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24/7 Dedicated Trip Concierge</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
