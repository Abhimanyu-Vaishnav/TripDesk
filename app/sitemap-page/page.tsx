import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import FloatingCTA from '@/components/ui/FloatingCTA';
import { INITIAL_PACKAGES, STATES_LIST } from '@/lib/mockData';
import { MapPin, Compass, ChevronLeft, ExternalLink, Globe, Layers, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HTML Sitemap & Directory | TripDesk Holidays',
  description: 'Complete directory and sitemap of all Pan-India holiday destinations, travel packages, and company resources.',
};

export default function SitemapDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAEE] dark:bg-[#120904]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-[#351202] dark:text-[#FEFAEE]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 mb-6">
          <Link href="/" className="hover:text-[#DB9309] flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-[#351202] dark:text-[#FEFAEE] font-medium">Sitemap Directory</span>
        </div>

        {/* Header */}
        <div className="border-b border-[#EADBBA] dark:border-[#4D2612] pb-6 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DB9309]/15 text-[#DB9309] text-xs font-bold uppercase tracking-wider mb-3">
            <Globe className="w-4 h-4" /> Comprehensive Index
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            TripDesk Holidays Sitemap
          </h1>
          <p className="text-xs sm:text-sm text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-2 max-w-2xl leading-relaxed">
            Direct navigation index for travelers, search engines, and exploratory researchers across all verified India holiday packages, regional curations, and corporate portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Main Pages */}
          <div className="bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2 border-b border-[#EADBBA]/60 dark:border-[#4D2612] pb-3">
              <Layers className="w-5 h-5 text-[#DB9309]" /> Core Navigation
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-[#351202] dark:text-[#FEFAEE] hover:text-[#DB9309] font-semibold flex items-center justify-between group">
                  <span>Home — Desk to Destination</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DB9309] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/#destinations" className="text-[#351202]/85 dark:text-[#FEFAEE]/85 hover:text-[#DB9309] flex items-center justify-between group">
                  <span>Explore by States & Regions</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DB9309] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="text-[#351202]/85 dark:text-[#FEFAEE]/85 hover:text-[#DB9309] flex items-center justify-between group">
                  <span>Trending Pan-India Tour Packages</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DB9309] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className="text-[#351202]/85 dark:text-[#FEFAEE]/85 hover:text-[#DB9309] flex items-center justify-between group">
                  <span>The TripDesk Advantage & Guarantees</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DB9309] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-[#351202]/85 dark:text-[#FEFAEE]/85 hover:text-[#DB9309] flex items-center justify-between group">
                  <span>Contact Desk & Inquiry Form</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DB9309] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2 border-b border-[#EADBBA]/60 dark:border-[#4D2612] pb-3">
              <ShieldCheck className="w-5 h-5 text-[#DB9309]" /> Legal & Operations
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/privacy-policy" className="text-[#351202]/85 dark:text-[#FEFAEE]/85 hover:text-[#DB9309] flex items-center justify-between group">
                  <span>Privacy Policy & Traveler Data Rights</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DB9309] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#351202]/85 dark:text-[#FEFAEE]/85 hover:text-[#DB9309] flex items-center justify-between group">
                  <span>Terms of Service, Bookings & Cancellation Slabs</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DB9309] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/sitemap-page" className="text-[#DB9309] font-semibold flex items-center justify-between">
                  <span>HTML Sitemap & Directory (Current Page)</span>
                  <span className="text-xs">✓</span>
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" className="text-[#351202]/70 dark:text-[#FEFAEE]/70 hover:text-[#DB9309] flex items-center justify-between group">
                  <span>XML Sitemap Feed (for Search Engines)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#DB9309]" />
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="text-[#351202]/60 dark:text-[#FEFAEE]/60 hover:text-[#DB9309] flex items-center justify-between group">
                  <span>Owner & Operations Control Suite</span>
                  <span className="text-[10px] uppercase font-bold text-[#DB9309]">Staff Only</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Tour Packages Full Index */}
          <div className="md:col-span-2 bg-white dark:bg-[#1D1008] p-6 sm:p-8 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2 border-b border-[#EADBBA]/60 dark:border-[#4D2612] pb-3">
              <Compass className="w-6 h-6 text-[#DB9309]" /> Verified India Tour Packages ({INITIAL_PACKAGES.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {INITIAL_PACKAGES.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug || pkg.id}`}
                  className="p-4 rounded-2xl bg-[#FEFAEE] dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] hover:border-[#DB9309] transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#DB9309] uppercase tracking-wider mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{pkg.state}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-[#351202] dark:text-[#FEFAEE] group-hover:text-[#DB9309] transition-colors line-clamp-1">
                    {pkg.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 mt-2">
                    <span>{pkg.duration.days}D / {pkg.duration.nights}N</span>
                    <span className="font-semibold text-[#351202] dark:text-[#FEFAEE]">Starting ₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Regional Explorer Directory */}
          <div className="md:col-span-2 bg-white dark:bg-[#1D1008] p-6 sm:p-8 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2 border-b border-[#EADBBA]/60 dark:border-[#4D2612] pb-3">
              <MapPin className="w-5 h-5 text-[#DB9309]" /> Pan-India Destination Regions
            </h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {STATES_LIST.filter(s => s !== 'All States').map((st) => (
                <Link
                  key={st}
                  href={`/#packages`}
                  className="px-4 py-2 rounded-xl bg-[#FEFAEE] dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] hover:border-[#DB9309] hover:text-[#DB9309] transition-colors"
                >
                  {st} Holiday Packages
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      <FloatingCTA />
      <Footer />
    </div>
  );
}

