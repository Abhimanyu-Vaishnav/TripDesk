'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Check, ExternalLink, Play, Star, Sparkles, Shield, Compass } from 'lucide-react';
import { TourPackage } from '@/types';

interface PackageDetailModalProps {
  packageData: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire: (pkg: TourPackage) => void;
}

export default function PackageDetailModal({
  packageData,
  isOpen,
  onClose,
  onEnquire,
}: PackageDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'gallery'>('itinerary');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !packageData) return null;

  const hasHighlights = packageData.highlights && packageData.highlights.length > 0;
  const hasItinerary = packageData.itinerary && packageData.itinerary.length > 0;
  const hasInclusions = packageData.inclusions && packageData.inclusions.length > 0;
  const hasExclusions = packageData.exclusions && packageData.exclusions.length > 0;
  const hasVideo = Boolean(packageData.videoUrl && packageData.videoUrl.trim());
  const hasOverview = Boolean(packageData.overview && packageData.overview.trim());
  const galleryImages = (packageData.gallery || []).filter(Boolean);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#351202]/70 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-[#FEFAEE] dark:bg-[#1D1008] rounded-3xl shadow-2xl border-2 border-[#DB9309] overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="relative h-64 sm:h-72 w-full shrink-0">
            <Image
              src={packageData.bannerImage}
              alt={packageData.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#351202] dark:from-black via-[#351202]/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges on Banner */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {packageData.state && (
                <span className="px-3 py-1 rounded-full bg-[#DB9309] text-white text-xs font-semibold shadow">
                  {packageData.state}
                </span>
              )}
              {packageData.theme && (
                <span className="px-3 py-1 rounded-full bg-[#FEFAEE]/90 dark:bg-[#120904]/90 backdrop-blur-md text-[#351202] dark:text-[#FEFAEE] text-xs font-medium">
                  {packageData.theme}
                </span>
              )}
            </div>

            {/* Title & Price on banner */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#DB9309] font-semibold mb-1">
                  <Star className="w-4 h-4 fill-[#DB9309]" />
                  <span>{packageData.rating.toFixed(1)}</span>
                  <span className="text-white/70">({packageData.reviewsCount} verified traveler reviews)</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
                  {packageData.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 flex items-center gap-2 mt-1">
                  {packageData.location && (
                    <>
                      <MapPin className="w-4 h-4 text-[#DB9309]" />
                      <span>{packageData.location}</span>
                    </>
                  )}
                  {packageData.duration && (
                    <>
                      <span>•</span>
                      <span>{packageData.duration.days} Days / {packageData.duration.nights} Nights</span>
                    </>
                  )}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-white/70 block uppercase font-medium">
                  {packageData.hidePrice ? 'Custom Plan' : 'Starting at'}
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-[#DB9309]">
                  {packageData.hidePrice ? 'On Request' : `₹${packageData.price.toLocaleString('en-IN')}`}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#EADBBA] dark:border-[#4D2612] bg-[#FDF7E7] dark:bg-[#120904] px-6">
            {hasItinerary && (
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
                  activeTab === 'itinerary' ? 'text-[#351202] dark:text-[#FEFAEE]' : 'text-[#351202]/60 dark:text-[#FEFAEE]/60'
                }`}
              >
                Day-by-Day Plan
                {activeTab === 'itinerary' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DB9309]" />
                )}
              </button>
            )}

            {(hasInclusions || hasExclusions) && (
              <button
                onClick={() => setActiveTab('inclusions')}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
                  activeTab === 'inclusions' ? 'text-[#351202] dark:text-[#FEFAEE]' : 'text-[#351202]/60 dark:text-[#FEFAEE]/60'
                }`}
              >
                Inclusions & Exclusions
                {activeTab === 'inclusions' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DB9309]" />
                )}
              </button>
            )}

            {(galleryImages.length > 0 || hasVideo) && (
              <button
                onClick={() => setActiveTab('gallery')}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold transition-all relative ${
                  activeTab === 'gallery' ? 'text-[#351202] dark:text-[#FEFAEE]' : 'text-[#351202]/60 dark:text-[#FEFAEE]/60'
                }`}
              >
                Media Gallery & Video
                {activeTab === 'gallery' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DB9309]" />
                )}
              </button>
            )}
          </div>

          {/* Modal Body / Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Dynamic Overview */}
            {hasOverview && (
              <div className="bg-[#FDF7E7] dark:bg-[#120904] p-4 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612]">
                <h4 className="font-serif text-base font-bold text-[#351202] dark:text-[#FEFAEE] mb-1 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#DB9309]" /> Tour Overview
                </h4>
                <p className="text-xs sm:text-sm text-[#351202]/85 dark:text-[#FEFAEE]/85 leading-relaxed">
                  {packageData.overview}
                </p>
              </div>
            )}

            {/* TAB 1: Itinerary */}
            {activeTab === 'itinerary' && hasItinerary && (
              <div className="space-y-4">
                <div className="space-y-4 relative pl-4 border-l-2 border-[#DB9309]/30">
                  {packageData.itinerary.map((day) => (
                    <div key={day.day} className="relative pl-4">
                      <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-[#DB9309] border-2 border-[#FEFAEE] dark:border-[#120904]" />
                      <div className="bg-white dark:bg-[#120904] p-4 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#DB9309] uppercase tracking-wider">
                            Day {day.day}
                          </span>
                          {day.meals && (
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FDF7E7] dark:bg-[#1D1008] text-[#351202]/70 dark:text-[#FEFAEE]/70 font-medium border border-[#EADBBA] dark:border-[#4D2612]">
                              🍽️ {day.meals}
                            </span>
                          )}
                        </div>
                        <h5 className="font-serif text-base font-bold text-[#351202] dark:text-[#FEFAEE]">
                          {day.title}
                        </h5>
                        {day.description && (
                          <p className="text-xs sm:text-sm text-[#351202]/80 dark:text-[#FEFAEE]/80 mt-1 leading-relaxed">
                            {day.description}
                          </p>
                        )}
                        {day.hotel && (
                          <div className="mt-2 text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 font-medium">
                            🏨 Stay: <span className="text-[#351202] dark:text-[#FEFAEE] font-semibold">{day.hotel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Inclusions & Exclusions */}
            {activeTab === 'inclusions' && (
              <div className={`grid gap-6 ${hasInclusions && hasExclusions ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {hasInclusions && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-5">
                    <h5 className="font-serif text-lg font-bold text-emerald-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                      What’s Included
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                      {packageData.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasExclusions && (
                  <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-5">
                    <h5 className="font-serif text-lg font-bold text-rose-900 dark:text-rose-300 mb-3 flex items-center gap-2">
                      <X className="w-5 h-5 text-rose-600" />
                      What’s Not Included
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-rose-950 dark:text-rose-100">
                      {packageData.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold shrink-0">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Gallery & Video */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                {hasVideo && (
                  <div className="rounded-2xl overflow-hidden border border-[#EADBBA] dark:border-[#4D2612] bg-black aspect-video relative shadow-md">
                    <iframe
                      src={packageData.videoUrl}
                      title={`${packageData.title} Video Showcase`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {galleryImages.length > 0 && (
                  <div>
                    <h5 className="font-serif text-base font-bold text-[#351202] dark:text-[#FEFAEE] mb-3">
                      Tour Photo Gallery
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className="relative h-32 sm:h-40 rounded-xl overflow-hidden border border-[#EADBBA] dark:border-[#4D2612] cursor-pointer group"
                        >
                          <Image
                            src={img}
                            alt={`Photo ${idx + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 bg-[#FDF7E7] dark:bg-[#120904] border-t border-[#EADBBA] dark:border-[#4D2612] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#351202]/80 dark:text-[#FEFAEE]/80">
              <Shield className="w-4 h-4 text-[#DB9309]" />
              <span>100% Customizable • Transparent Billing • 24/7 Desk Care</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href={`/packages/${packageData.slug || packageData.id}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#351202] dark:border-[#DB9309] text-[#351202] dark:text-[#FEFAEE] hover:bg-[#351202] hover:text-white dark:hover:bg-[#DB9309] transition-all text-xs font-semibold text-center flex items-center justify-center gap-1.5"
              >
                <span>Full Page View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  onClose();
                  onEnquire(packageData);
                }}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#DB9309] hover:bg-[#c48107] text-white font-semibold text-xs transition-all shadow-md active:scale-95 text-center"
              >
                Book / Enquire Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
