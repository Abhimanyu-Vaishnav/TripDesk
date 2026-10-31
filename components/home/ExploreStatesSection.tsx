'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

interface ExploreStatesSectionProps {
  onSelectState: (state: string) => void;
  selectedState: string;
}

const DESTINATION_CARDS = [
  {
    name: 'Kashmir',
    state: 'Jammu & Kashmir',
    tag: 'Snow Valleys & Shikaras',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
    count: '3 Packages'
  },
  {
    name: 'Himachal',
    state: 'Himachal Pradesh',
    tag: 'Rivers, Pines & Solang Snow',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    count: '4 Packages'
  },
  {
    name: 'Rajasthan',
    state: 'Rajasthan',
    tag: 'Royal Palaces & Desert Havelis',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    count: '5 Packages'
  },
  {
    name: 'Kerala',
    state: 'Kerala',
    tag: 'Houseboats & Misty Tea Hills',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    count: '3 Packages'
  },
  {
    name: 'Goa',
    state: 'Goa',
    tag: 'Sunsets, Yachts & Latin Quarters',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    count: '2 Packages'
  },
  {
    name: 'Uttarakhand',
    state: 'Uttarakhand',
    tag: 'Ganga Aarti, Rapids & Hills',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    count: '3 Packages'
  },
  {
    name: 'Andaman',
    state: 'Andaman & Nicobar',
    tag: 'Coral Reefs & White Sands',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
    count: '2 Packages'
  },
  {
    name: 'North East',
    state: 'Meghalaya',
    tag: 'Living Root Bridges & Waterfalls',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=600&q=80',
    count: '3 Packages'
  }
];

export default function ExploreStatesSection({ onSelectState, selectedState }: ExploreStatesSectionProps) {
  return (
    <section id="destinations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#DB9309] font-bold">
            Pan-India Curations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351202] mt-1.5">
            Explore by States & Regions
          </h2>
          <p className="text-sm text-[#351202]/70 mt-2 max-w-xl">
            From the snow-crowned Himalayas of Kashmir to the tropical backwaters of Kerala, pick your dream state for tailor-made itineraries.
          </p>
        </div>

        {selectedState !== 'All States' && (
          <button
            onClick={() => onSelectState('All States')}
            className="mt-4 md:mt-0 text-xs font-semibold text-[#DB9309] hover:underline"
          >
            Show All States ({selectedState} currently selected) ✕
          </button>
        )}
      </div>

      {/* Grid of State Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {DESTINATION_CARDS.map((dest, idx) => {
          const isSelected = selectedState === dest.state;

          return (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => {
                onSelectState(dest.state);
                const el = document.getElementById('packages');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`group relative h-64 sm:h-72 rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-sm hover:shadow-xl ${
                isSelected
                  ? 'border-[#DB9309] ring-4 ring-[#DB9309]/30 scale-[1.02]'
                  : 'border-transparent hover:border-[#DB9309]/50'
              }`}
            >
              {/* Background Image */}
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#351202] via-[#351202]/30 to-black/20 group-hover:from-[#351202]/95 transition-colors" />

              {/* Content */}
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    {dest.count}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FEFAEE]/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#DB9309] group-hover:text-[#351202] transition-colors">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[11px] text-[#DB9309] font-semibold uppercase tracking-wider mb-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.state}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-1">
                    {dest.tag}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

