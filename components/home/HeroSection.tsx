'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import { STATES_LIST } from '@/lib/mockData';

interface HeroSectionProps {
  onSearch: (filters: { state: string; destination: string; budget: string; duration: string }) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [selectedState, setSelectedState] = useState('All States');
  const [searchDestination, setSearchDestination] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      state: selectedState,
      destination: searchDestination,
      budget: selectedBudget,
      duration: selectedDuration,
    });

    const el = document.getElementById('packages');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image with Rich Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />
        {/* Multilayered Brand Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#351202]/95 via-[#351202]/85 to-[#351202]/70 dark:from-black/95 dark:via-black/90 dark:to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FEFAEE]/40 dark:from-[#120904]/40 via-transparent to-transparent opacity-95 transition-colors" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        {/* Pre-title Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#DB9309] text-[#FEFAEE] text-xs sm:text-sm font-semibold mb-6 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-[#DB9309]" />
          <span>India’s Most Trusted Desk-to-Destination Travel Architect</span>
        </motion.div>

        {/* Main Catchy Headline (Always high-contrast solid white in both light & dark mode) */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold !text-white tracking-tight leading-[1.1] max-w-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
        >
          From <span className="text-[#DB9309] italic underline decoration-[#DB9309]/80 decoration-wavy underline-offset-8">Desk</span> to Dream Destination
        </motion.h1>

        {/* Subtitle (Solid readable white) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-6 text-sm sm:text-lg !text-white/95 max-w-2xl leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          Handcrafted pan-India journeys designed for souls who crave unforgettable landscapes, royal stays, and zero-stress exploration.
        </motion.p>

        {/* Interactive Filter / Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mt-10 w-full max-w-4xl"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#FEFAEE] dark:bg-[#1D1008] p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-[#DB9309] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left transition-colors"
          >
            {/* 1. State / Region */}
            <div className="p-2 sm:p-3 rounded-2xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all">
              <label className="block text-[11px] font-bold text-[#351202]/70 dark:text-[#FEFAEE]/70 uppercase tracking-wider mb-1 flex items-center gap-1">
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
              <label className="block text-[11px] font-bold text-[#351202]/70 dark:text-[#FEFAEE]/70 uppercase tracking-wider mb-1 flex items-center gap-1">
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

            {/* 3. Duration */}
            <div className="p-2 sm:p-3 rounded-2xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all">
              <label className="block text-[11px] font-bold text-[#351202]/70 dark:text-[#FEFAEE]/70 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#DB9309]" /> Trip Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-[#351202] dark:text-[#FEFAEE] bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]">Any Duration</option>
                <option value="short" className="bg-white dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]">3 - 4 Days (Weekend)</option>
                <option value="medium" className="bg-white dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]">5 - 7 Days (Standard)</option>
                <option value="long" className="bg-white dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]">8+ Days (Extended)</option>
              </select>
            </div>

            {/* 4. Action Search Button */}
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] rounded-2xl bg-[#351202] dark:bg-[#DB9309] hover:bg-[#4D1D05] dark:hover:bg-[#b87802] active:scale-95 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 group border border-[#DB9309]/50"
              >
                <Search className="w-4 h-4 text-[#DB9309] dark:text-white group-hover:scale-110 transition-transform" />
                <span>Search Journeys</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick Highlights / Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-white/95 text-xs sm:text-sm font-medium drop-shadow"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#DB9309]" />
            <span>100% Customized Itineraries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#DB9309] font-bold">★ 4.9/5</span>
            <span>2,500+ Happy Travelers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>24/7 Dedicated Trip Concierge</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
