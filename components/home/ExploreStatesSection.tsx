'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { TourPackage } from '@/types';

interface ExploreStatesSectionProps {
  onSelectState: (state: string) => void;
  selectedState: string;
  packages?: TourPackage[];
}

// Fallback curated imagery & tags for known states
const DEFAULT_STATE_INFO: Record<string, { tag: string; image: string }> = {
  'Jammu & Kashmir': {
    tag: 'Snow Valleys & Dal Lake Shikaras',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
  },
  'Himachal Pradesh': {
    tag: 'Rivers, Pines & Solang Snow',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
  },
  'Rajasthan': {
    tag: 'Royal Palaces & Desert Havelis',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
  },
  'Kerala': {
    tag: 'Houseboats & Misty Tea Hills',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
  },
  'Goa': {
    tag: 'Sunsets, Yachts & Latin Quarters',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
  },
  'Uttarakhand': {
    tag: 'Ganga Aarti, Rapids & Hills',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  },
  'Andaman & Nicobar Islands': {
    tag: 'Coral Reefs & White Sands',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
  },
  'Andaman & Nicobar': {
    tag: 'Coral Reefs & White Sands',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
  },
  'Meghalaya': {
    tag: 'Living Root Bridges & Waterfalls',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=600&q=80',
  },
  'Ladakh': {
    tag: 'High Passes & Turquoise Lakes',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
  },
  'Sikkim': {
    tag: 'Monasteries & Kanchenjunga Vistas',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
  },
  'Tamil Nadu': {
    tag: 'Dravidian Temples & French Colonies',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  },
  'Karnataka': {
    tag: 'Coffee Plantations & Hampi Ruins',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=600&q=80',
  },
  'Maharashtra': {
    tag: 'Western Ghats, Caves & Forts',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
  },
  'Madhya Pradesh': {
    tag: 'Tiger Safaris & Ancient Heritage',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
  },
  'Gujarat': {
    tag: 'White Desert & Asiatic Lions',
    image: 'https://images.unsplash.com/photo-1609946850119-a1b7a2bb53c6?auto=format&fit=crop&w=600&q=80',
  },
  'Delhi (NCR)': {
    tag: 'Mughal Architecture & Food Capital',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
  },
  'Uttar Pradesh': {
    tag: 'Taj Mahal & Sacred Ghats of Varanasi',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
  },
  'West Bengal': {
    tag: 'Darjeeling Tea & Cultural Heritage',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
  },
  'Assam': {
    tag: 'One-horned Rhinos & Brahmaputra',
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=600&q=80',
  }
};

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

export default function ExploreStatesSection({ onSelectState, selectedState, packages = [] }: ExploreStatesSectionProps) {
  // Dynamically compute states from available active/featured packages
  const dynamicStateCards = React.useMemo(() => {
    const livePackages = packages.filter(p => p.status === 'active' || p.status === 'featured');
    
    // Group packages by state
    const map = new Map<string, { count: number; sampleImage: string; sampleLocation: string }>();

    livePackages.forEach((p) => {
      if (!p.state) return;
      const stateName = p.state.trim();
      const existing = map.get(stateName);
      if (existing) {
        existing.count += 1;
        if (!existing.sampleImage && p.bannerImage) {
          existing.sampleImage = p.bannerImage;
        }
      } else {
        map.set(stateName, {
          count: 1,
          sampleImage: p.bannerImage || '',
          sampleLocation: p.location || stateName
        });
      }
    });

    // If no packages exist in storage yet, show default popular cards
    if (map.size === 0) {
      return [
        { name: 'Kashmir', state: 'Jammu & Kashmir', tag: 'Snow Valleys & Shikaras', image: DEFAULT_STATE_INFO['Jammu & Kashmir'].image, count: '3 Packages' },
        { name: 'Himachal', state: 'Himachal Pradesh', tag: 'Rivers, Pines & Solang Snow', image: DEFAULT_STATE_INFO['Himachal Pradesh'].image, count: '4 Packages' },
        { name: 'Rajasthan', state: 'Rajasthan', tag: 'Royal Palaces & Desert Havelis', image: DEFAULT_STATE_INFO['Rajasthan'].image, count: '5 Packages' },
        { name: 'Kerala', state: 'Kerala', tag: 'Houseboats & Misty Tea Hills', image: DEFAULT_STATE_INFO['Kerala'].image, count: '3 Packages' },
        { name: 'Goa', state: 'Goa', tag: 'Sunsets, Yachts & Latin Quarters', image: DEFAULT_STATE_INFO['Goa'].image, count: '2 Packages' },
        { name: 'Uttarakhand', state: 'Uttarakhand', tag: 'Ganga Aarti, Rapids & Hills', image: DEFAULT_STATE_INFO['Uttarakhand'].image, count: '3 Packages' },
        { name: 'Andaman', state: 'Andaman & Nicobar Islands', tag: 'Coral Reefs & White Sands', image: DEFAULT_STATE_INFO['Andaman & Nicobar Islands'].image, count: '2 Packages' },
        { name: 'North East', state: 'Meghalaya', tag: 'Living Root Bridges & Waterfalls', image: DEFAULT_STATE_INFO['Meghalaya'].image, count: '3 Packages' }
      ];
    }

    // Convert map to list of cards
    return Array.from(map.entries()).map(([stateName, info]) => {
      const predefined = DEFAULT_STATE_INFO[stateName];
      const image = info.sampleImage || (predefined ? predefined.image : DEFAULT_FALLBACK_IMAGE);
      const tag = predefined ? predefined.tag : `Explore ${info.sampleLocation}`;
      const shortName = stateName.replace(' Islands', '').replace(' (NCR)', '');

      return {
        name: shortName,
        state: stateName,
        tag,
        image,
        count: `${info.count} ${info.count === 1 ? 'Package' : 'Packages'}`
      };
    });
  }, [packages]);

  return (
    <section id="destinations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#DB9309] font-bold">
            Pan-India Curations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351202] dark:text-[#FEFAEE] mt-1.5">
            Explore by States & Regions
          </h2>
          <p className="text-sm text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-2 max-w-xl">
            From the snow-crowned Himalayas to tropical backwaters, pick your dream state for tailor-made itineraries.
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
        {dynamicStateCards.map((dest, idx) => {
          const isSelected = selectedState.toLowerCase() === dest.state.toLowerCase();

          return (
            <motion.div
              key={dest.state}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
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
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#351202] dark:from-black via-[#351202]/30 dark:via-black/40 to-black/20 group-hover:from-[#351202]/95 transition-colors" />

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
