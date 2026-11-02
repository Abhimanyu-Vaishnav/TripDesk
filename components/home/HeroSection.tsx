'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Compass, ShieldCheck } from 'lucide-react';
import { STATES_LIST } from '@/lib/mockData';
import { DEFAULT_HERO_SLIDES } from '@/lib/storage';

interface HeroSectionProps {
  onSearch: (filters: { state: string; destination: string; budget: string; duration: string }) => void;
  slides?: { url: string; title: string }[];
  headline?: string;
}

export default function HeroSection({ onSearch, slides, headline }: HeroSectionProps) {
  const [selectedState, setSelectedState] = useState('All States');
  const [searchDestination, setSearchDestination] = useState('');
  const [customDays, setCustomDays] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

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
              src={activeSlides[currentSlide]?.url || DEFAULT_HERO_SLIDES[0].url}
              alt={activeSlides[currentSlide]?.title || 'TripDesk Destination'}
              fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Lighter, high-visibility overlay (enhanced visibility without drowning images) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-black/20 dark:from-black/60 dark:via-black/40 dark:to-black/30" />
      </div>

      {/* Slide Indicators on Bottom Right */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {activeSlides.map((item: { url: string; title: string }, idx: number) => (
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
      )}

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        {/* Main Clean Headline: theme cream color text, Desk in yellow #DB9309 italic */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-[#FEFAEE] tracking-tight leading-[1.15] max-w-4xl drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]"
        >
          {headline ? (
            <span>{headline}</span>
          ) : (
            <>
              From <span className="text-[#DB9309] italic font-semibold">Desk</span> to Dream Destination
            </>
          )}
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
            <div className="p-2 sm:p-3 rounded-2xl bg-[#FEFAEE] dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all">
              <label className="block text-[10px] font-bold text-[#351202]/70 dark:text-[#FEFAEE]/70 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#DB9309]" /> State / Region
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-[#351202] dark:text-[#FEFAEE] bg-transparent focus:outline-none cursor-pointer"
              >
                {STATES_LIST.map((st) => (
                  <option key={st} value={st} className="bg-[#FEFAEE] dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Destination Search Keyword */}
            <div className="p-2 sm:p-3 rounded-2xl bg-[#FEFAEE] dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all">
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
            <div className="p-2 sm:p-3 rounded-2xl bg-[#FEFAEE] dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all">
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
          className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[#FEFAEE] text-xs sm:text-sm font-medium drop-shadow"
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
