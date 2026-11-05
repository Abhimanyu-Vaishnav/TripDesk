'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  Star,
  Check,
  X,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Compass,
  Play,
  Heart,
  EyeOff
} from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import FloatingCTA from '@/components/ui/FloatingCTA';
import InquiryForm from '@/components/contact/InquiryForm';
import { TourPackage, SiteSettings } from '@/types';
import { getPackageByIdOrSlug, getStoredSettings, fetchCloudPackages, fetchCloudSettings } from '@/lib/storage';

export default function PackageDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = getPackageByIdOrSlug(slug);
      if (found) {
        setPackageData(found);
      }
      fetchCloudPackages().then(pkgs => {
        const cloudFound = pkgs.find(p => p.id === slug || p.slug === slug);
        if (cloudFound) {
          setPackageData(cloudFound);
        }
      });
    }
    setSettings(getStoredSettings());
    fetchCloudSettings().then(s => {
      if (s) setSettings(s);
    });
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!packageData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FEFAEE] dark:bg-[#120904]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-[#351202] dark:text-[#FEFAEE]">Tour Package Not Found</h2>
            <p className="text-sm text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-2">
              The itinerary you are looking for might have been updated or moved.
            </p>
            <Link
              href="/#packages"
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#351202] dark:bg-[#DB9309] text-white text-xs font-semibold hover:bg-[#4D1D05]"
            >
              <ChevronLeft className="w-4 h-4" /> Return to All Packages
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const shouldHidePrice = settings?.hideAllPrices || packageData.hidePrice;
  const allImages = [
    packageData.bannerImage,
    ...(packageData.gallery || []).filter((g) => g && g !== packageData.bannerImage)
  ].filter(Boolean);

  const hasHighlights = packageData.highlights && packageData.highlights.length > 0;
  const hasItinerary = packageData.itinerary && packageData.itinerary.length > 0;
  const hasInclusions = packageData.inclusions && packageData.inclusions.length > 0;
  const hasExclusions = packageData.exclusions && packageData.exclusions.length > 0;
  const hasVideo = Boolean(packageData.videoUrl && packageData.videoUrl.trim());
  const hasOverview = Boolean(packageData.overview && packageData.overview.trim());

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAEE] dark:bg-[#120904]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between py-4 text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#DB9309]">Home</Link>
              <span>/</span>
              <Link href="/#packages" className="hover:text-[#DB9309]">Packages</Link>
              <span>/</span>
              <span className="text-[#351202] dark:text-[#FEFAEE] font-semibold truncate max-w-xs">{packageData.state}</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF7E7] dark:bg-[#1D1008] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] text-[#351202] dark:text-[#FEFAEE] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#DB9309]" />
              <span>{copied ? 'Link Copied!' : 'Share Itinerary'}</span>
            </button>
          </div>

          {/* Title and Badges */}
          <div className="mt-2 mb-6">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              {packageData.state && (
                <span className="px-3 py-1 rounded-full bg-[#DB9309] text-white text-xs font-bold uppercase tracking-wider">
                  {packageData.state}
                </span>
              )}
              {packageData.theme && (
                <span className="px-3 py-1 rounded-full bg-[#351202] dark:bg-[#DB9309] text-white text-xs font-semibold">
                  {packageData.theme}
                </span>
              )}
              {packageData.location && (
                <span className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#DB9309]" /> {packageData.location}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#351202] dark:text-[#FEFAEE] leading-tight">
              {packageData.title}
            </h1>
            {packageData.tagline && (
              <p className="text-base text-[#351202]/75 dark:text-[#FEFAEE]/75 mt-2 italic">
                "{packageData.tagline}"
              </p>
            )}
          </div>

          {/* Interactive Image Gallery Grid (Renders smoothly whether single, 3, 8 or 20+ images) */}
          {allImages.length > 0 && (
            <div className="space-y-4 mb-10">
              <div className={`grid gap-4 ${allImages.length > 1 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {/* Main Large Active Image Showcase */}
                <div className={`${allImages.length > 1 ? 'lg:col-span-2' : ''} relative h-80 sm:h-[460px] rounded-3xl overflow-hidden shadow-lg border border-[#EADBBA] dark:border-[#4D2612] group bg-black/10 dark:bg-black/40`}>
                  <Image
                    src={allImages[activeImageIndex] || packageData.bannerImage}
                    alt={`${packageData.title} photo ${activeImageIndex + 1}`}
                    fill
                    priority
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Photo Counter Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                    <span>{activeImageIndex + 1} / {allImages.length} Photos</span>
                  </div>

                  {/* Previous / Next Arrows on Large Preview */}
                  {allImages.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
                        }}
                        className="pointer-events-auto p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-95 shadow-md"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
                        }}
                        className="pointer-events-auto p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-95 shadow-md"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2 active:scale-95 shadow-md"
                  >
                    <span>View Full Screen ({allImages.length} Photos)</span>
                  </button>
                </div>

                {/* Right Preview Side Column: shows up to 3 thumbnails or first photos */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    {allImages.slice(1, 4).map((img, idx) => {
                      const actualIdx = idx + 1;
                      const isLastSlot = idx === 2 && allImages.length > 4;
                      return (
                        <div
                          key={actualIdx}
                          onClick={() => {
                            if (isLastSlot) {
                              setLightboxOpen(true);
                            } else {
                              setActiveImageIndex(actualIdx);
                            }
                          }}
                          className={`relative h-36 lg:h-[142px] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all bg-black/10 dark:bg-black/40 ${
                            activeImageIndex === actualIdx ? 'border-[#DB9309] shadow-md' : 'border-[#EADBBA] dark:border-[#4D2612] opacity-85 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt={`Thumbnail ${actualIdx}`} fill unoptimized className="object-cover" />
                          {isLastSlot && (
                            <div className="absolute inset-0 bg-black/65 hover:bg-black/55 backdrop-blur-xs flex flex-col items-center justify-center text-white transition-colors">
                              <span className="font-serif text-2xl font-bold">+{allImages.length - 4}</span>
                              <span className="text-[11px] font-medium tracking-wide">More Photos</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Comprehensive Bottom Filmstrip Carousel: Shows ALL images (whether 5, 8, 15, or 25) */}
              {allImages.length > 1 && (
                <div className="bg-[#FDF7E7] dark:bg-[#1D1008] p-3 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612]">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-1.5">
                      <span>📸 All Photo Gallery</span>
                      <span className="text-[#DB9309]">({allImages.length} images)</span>
                    </span>
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="text-xs text-[#DB9309] hover:underline font-semibold"
                    >
                      Open Full Screen Gallery
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-24 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          activeImageIndex === idx
                            ? 'border-[#DB9309] scale-105 shadow-md ring-2 ring-[#DB9309]/30'
                            : 'border-[#EADBBA] dark:border-[#4D2612] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image src={img} alt={`Thumb ${idx + 1}`} fill unoptimized className="object-cover" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Core Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Cols: Details, Itinerary, Inclusions */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Dynamic Highlights Section: Only renders if data provided */}
              {hasHighlights && (
                <div className="bg-[#FDF7E7] dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612]">
                  <h3 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#DB9309]" />
                    Key Experience Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {packageData.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#351202]/90 dark:text-[#FEFAEE]/90">
                        <span className="w-2 h-2 rounded-full bg-[#DB9309] mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Overview: Only renders if overview text provided */}
              {hasOverview && (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE] mb-3">
                    Overview of the Journey
                  </h3>
                  <p className="text-sm sm:text-base text-[#351202]/85 dark:text-[#FEFAEE]/85 leading-relaxed">
                    {packageData.overview}
                  </p>
                </div>
              )}

              {/* Dynamic Day-by-Day Itinerary: Only renders if itinerary provided */}
              {hasItinerary && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
                      <Compass className="w-6 h-6 text-[#DB9309]" /> Detailed Day-wise Itinerary
                    </h3>
                    {packageData.duration && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#DB9309]/15 text-[#DB9309]">
                        {packageData.duration.days} Days / {packageData.duration.nights} Nights
                      </span>
                    )}
                  </div>

                  <div className="space-y-6 relative pl-6 border-l-2 border-[#DB9309]">
                    {packageData.itinerary.map((day) => (
                      <div key={day.day} className="relative">
                        <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-[#351202] dark:bg-[#DB9309] border-4 border-[#DB9309] dark:border-[#FEFAEE]" />

                        <div className="bg-white dark:bg-[#1D1008] p-5 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-[#DB9309] uppercase tracking-wider">
                              Day {day.day}
                            </span>
                            {day.meals && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FEFAEE] dark:bg-[#120904] text-[#351202]/80 dark:text-[#FEFAEE]/80 border border-[#EADBBA] dark:border-[#4D2612]">
                                🍽️ {day.meals}
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-lg font-bold text-[#351202] dark:text-[#FEFAEE]">
                            {day.title}
                          </h4>

                          {day.description && (
                            <p className="text-xs sm:text-sm text-[#351202]/80 dark:text-[#FEFAEE]/80 mt-2 leading-relaxed">
                              {day.description}
                            </p>
                          )}

                          {day.hotel && (
                            <div className="mt-3 text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 font-medium">
                              🏨 Accommodations: <span className="text-[#351202] dark:text-[#FEFAEE] font-semibold">{day.hotel}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Inclusions & Exclusions: Only renders if either or both exist */}
              {(hasInclusions || hasExclusions) && (
                <div className={`grid gap-6 pt-4 ${hasInclusions && hasExclusions ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {hasInclusions && (
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-3xl p-6">
                      <h4 className="font-serif text-xl font-bold text-emerald-900 dark:text-emerald-300 mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-emerald-600" /> What's Included
                      </h4>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                        {packageData.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hasExclusions && (
                    <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-3xl p-6">
                      <h4 className="font-serif text-xl font-bold text-rose-900 dark:text-rose-300 mb-4 flex items-center gap-2">
                        <X className="w-5 h-5 text-rose-600" /> What's Excluded
                      </h4>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-rose-950 dark:text-rose-100">
                        {packageData.exclusions.map((exc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-600 font-bold">✕</span>
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Video Showcase: Automatically hidden if no video link provided */}
              {hasVideo && (
                <div className="pt-4">
                  <h3 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE] mb-3 flex items-center gap-2">
                    <Play className="w-5 h-5 text-[#DB9309]" /> Destination Video Showcase
                  </h3>
                  <div className="aspect-video rounded-3xl overflow-hidden border-2 border-[#EADBBA] dark:border-[#4D2612] shadow-md bg-black">
                    <iframe
                      src={packageData.videoUrl}
                      title={packageData.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Sticky Booking & Price Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[#FDF7E7] dark:bg-[#1D1008] rounded-3xl border-2 border-[#DB9309] p-6 shadow-xl space-y-6">
                
                {/* Price block or Quote on Request */}
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#351202]/60 dark:text-[#FEFAEE]/60 font-semibold">
                    {shouldHidePrice ? 'Customized Tour Plan' : 'Special Package Fare'}
                  </span>
                  {shouldHidePrice ? (
                    <div className="mt-2">
                      <div className="text-2xl font-bold text-[#DB9309]">Price on Request</div>
                      <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-1">
                        Tailored quote based on your travel dates, party size, and vehicle preferences.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-bold text-[#351202] dark:text-[#FEFAEE]">
                        ₹{packageData.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60">/ person</span>
                      {packageData.originalPrice && (
                        <span className="text-sm text-[#351202]/40 dark:text-[#FEFAEE]/40 line-through">
                          ₹{packageData.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  )}
                  <span className="inline-block mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✓ Verified 4-Star stays & private AC cab included
                  </span>
                </div>

                {/* Quick specs */}
                <div className="space-y-2.5 text-xs text-[#351202]/80 dark:text-[#FEFAEE]/80 border-y border-[#EADBBA] dark:border-[#4D2612] py-4">
                  {packageData.duration && (
                    <div className="flex justify-between">
                      <span className="text-[#351202]/60 dark:text-[#FEFAEE]/60">Duration:</span>
                      <span className="font-semibold text-[#351202] dark:text-[#FEFAEE]">{packageData.duration.days} Days / {packageData.duration.nights} Nights</span>
                    </div>
                  )}
                  {packageData.bestTimeToVisit && (
                    <div className="flex justify-between">
                      <span className="text-[#351202]/60 dark:text-[#FEFAEE]/60">Best Season:</span>
                      <span className="font-semibold text-[#351202] dark:text-[#FEFAEE]">{packageData.bestTimeToVisit}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#351202]/60 dark:text-[#FEFAEE]/60">Stay Standard:</span>
                    <span className="font-semibold text-[#351202] dark:text-[#FEFAEE]">Verified 4-Star & Heritage</span>
                  </div>
                </div>

                {/* Direct Action CTAs */}
                <div className="space-y-3">
                  <a
                    href="#enquiry-section"
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#351202] dark:bg-[#DB9309] hover:bg-[#4D1D05] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>{shouldHidePrice ? 'Request Custom Quote' : 'Book / Instant Itinerary'}</span>
                  </a>

                  <a
                    href={`https://wa.me/${(settings?.contactPhone || settings?.whatsappNumber || '919876543210').replace(/[^0-9]/g, '')}?text=Hi%20TripDesk,%20I%20am%20interested%20in%20${encodeURIComponent(packageData.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Connect on WhatsApp</span>
                  </a>
                </div>

                <div className="pt-2 flex items-start gap-3 text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70">
                  <ShieldCheck className="w-5 h-5 text-[#DB9309] shrink-0 mt-0.5" />
                  <p>
                    <strong>TripDesk Desk Support:</strong> 100% customized plan with verified chauffeur and 24/7 on-call coordinator.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form Block */}
          <div id="enquiry-section" className="mt-20">
            <InquiryForm initialPackage={packageData} />
          </div>

        </div>
      </main>

      {/* Lightbox Modal with Full-Screen Next/Prev Arrows */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4"
          >
            {/* Top Bar: Title & Counter & Close */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white py-2 z-10">
              <div>
                <h4 className="font-serif text-lg font-bold truncate">{packageData.title}</h4>
                <span className="text-xs text-white/70">Photo {activeImageIndex + 1} of {allImages.length}</span>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all"
                aria-label="Close full screen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Stage with Big Left/Right controls */}
            <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center my-2">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={allImages[activeImageIndex] || packageData.bannerImage}
                  alt={`${packageData.title} photo ${activeImageIndex + 1}`}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="w-full max-w-5xl flex items-center justify-center gap-2 overflow-x-auto py-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#DB9309] scale-105' : 'border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingCTA />
      <Footer />
    </div>
  );
}
