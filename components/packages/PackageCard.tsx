'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Star, MapPin, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { TourPackage } from '@/types';

interface PackageCardProps {
  packageData: TourPackage;
  onQuickView?: (pkg: TourPackage) => void;
}

export default function PackageCard({ packageData, onQuickView }: PackageCardProps) {
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group bg-[#FDF7E7] rounded-3xl overflow-hidden border border-[#EADBBA]/70 shadow-sm hover:shadow-xl hover:border-[#DB9309]/50 transition-all duration-300 flex flex-col h-full"
    >
      {/* Thumbnail & Badges */}
      <div className="relative h-60 w-full overflow-hidden bg-[#351202]/10">
        <Image
          src={imageError ? fallbackImage : packageData.bannerImage}
          alt={packageData.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#351202]/90 via-transparent to-black/20" />

        {/* State / Destination badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEFAEE]/95 backdrop-blur-md text-[#351202] text-xs font-semibold shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-[#DB9309]" />
          <span>{packageData.state}</span>
        </div>

        {/* Featured / Theme badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
          {packageData.featured && (
            <span className="px-2.5 py-1 rounded-full bg-[#DB9309] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-[#351202]/85 text-white text-[11px] font-medium backdrop-blur-sm">
            {packageData.theme}
          </span>
        </div>

        {/* Quick view button overlay */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(packageData);
            }}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#FEFAEE]/90 hover:bg-[#DB9309] text-[#351202] hover:text-white transition-all shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            title="Quick Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Duration badge at bottom left */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow">
          <Clock className="w-3.5 h-3.5 text-[#DB9309]" />
          <span>
            {packageData.duration.days}D / {packageData.duration.nights}N
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center justify-between text-xs text-[#351202]/70 mb-2">
            <div className="flex items-center gap-1 text-[#DB9309] font-bold">
              <Star className="w-4 h-4 fill-[#DB9309]" />
              <span>{packageData.rating.toFixed(1)}</span>
              <span className="text-[#351202]/50 font-normal">({packageData.reviewsCount} reviews)</span>
            </div>
            <span className="text-[11px] font-medium text-[#351202]/60 truncate max-w-[120px]">
              {packageData.location.split(',')[0]}
            </span>
          </div>

          {/* Title */}
          <Link href={`/packages/${packageData.slug || packageData.id}`}>
            <h3 className="font-serif text-lg font-bold text-[#351202] group-hover:text-[#DB9309] transition-colors line-clamp-2 leading-snug">
              {packageData.title}
            </h3>
          </Link>

          {/* Highlights */}
          <ul className="mt-3 space-y-1.5">
            {packageData.highlights.slice(0, 2).map((h, i) => (
              <li key={i} className="text-xs text-[#351202]/80 flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DB9309] mt-1 shrink-0" />
                <span className="line-clamp-1">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price & CTA */}
        <div className="mt-5 pt-4 border-t border-[#EADBBA] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#351202]/60 block uppercase font-medium">Starting from</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#351202]">
                ₹{packageData.price.toLocaleString('en-IN')}
              </span>
              {packageData.originalPrice && (
                <span className="text-xs text-[#351202]/40 line-through">
                  ₹{packageData.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/packages/${packageData.slug || packageData.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#351202] text-white hover:bg-[#DB9309] transition-all text-xs font-semibold shadow-sm group-hover:shadow"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

