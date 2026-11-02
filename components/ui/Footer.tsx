'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart, Globe, MessageCircle, Send, Share2 } from 'lucide-react';
import Logo from './Logo';
import { SiteSettings } from '@/types';
import { getStoredSettings, DEFAULT_SETTINGS, fetchCloudSettings } from '@/lib/storage';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(getStoredSettings());
    fetchCloudSettings().then(cloudSettings => {
      if (cloudSettings) setSettings(cloudSettings);
    });
  }, []);

  return (
    <footer className="bg-[#351202] dark:bg-[#120904] text-[#FEFAEE] pt-16 pb-8 border-t-4 border-[#DB9309]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#FEFAEE]/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" size="lg" />
            <p className="text-sm text-[#FEFAEE]/75 leading-relaxed max-w-sm mt-3">
              {settings.aboutText || DEFAULT_SETTINGS.aboutText}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {/* Instagram */}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {/* Facebook */}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}

              {/* X (Twitter) */}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="X / Twitter"
                  title="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}

              {/* LinkedIn */}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}

              {/* YouTube */}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}

              {/* WhatsApp */}
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              )}

              {/* Email */}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="Email"
                  title="Email Us"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-[#DB9309] tracking-wider uppercase">
              Top Destinations
            </h4>
            <ul className="space-y-2 text-sm text-[#FEFAEE]/80">
              <li>
                <Link href="/packages/kashmir-paradise-on-earth" className="hover:text-[#DB9309] transition-colors">
                  Kashmir & Dal Lake
                </Link>
              </li>
              <li>
                <Link href="/packages/himachal-manali-kasol-spiti-gateway" className="hover:text-[#DB9309] transition-colors">
                  Himachal & Parvati Trail
                </Link>
              </li>
              <li>
                <Link href="/packages/rajasthan-royal-heritage-jaipur-udaipur-jodhpur" className="hover:text-[#DB9309] transition-colors">
                  Royal Rajasthan Forts
                </Link>
              </li>
              <li>
                <Link href="/packages/kerala-gods-own-country-backwaters-munnar" className="hover:text-[#DB9309] transition-colors">
                  Kerala Backwaters
                </Link>
              </li>
              <li>
                <Link href="/packages/andaman-emerald-islands-havelock-scuba-paradise" className="hover:text-[#DB9309] transition-colors">
                  Andaman Emerald Coral
                </Link>
              </li>
              <li>
                <Link href="/packages/north-east-meghalaya-living-roots-cherrapunji" className="hover:text-[#DB9309] transition-colors">
                  Meghalaya Waterfalls
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Themes */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-[#DB9309] tracking-wider uppercase">
              Travel Experiences
            </h4>
            <ul className="space-y-2 text-sm text-[#FEFAEE]/80">
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Honeymoon Escapes
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Himalayan Adventures
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Heritage Havelis & Palaces
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Family Houseboats
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Coastal Sun & Sand
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Fully Dynamic From Admin Dashboard) */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-[#DB9309] tracking-wider uppercase">
              Reach Our Desk
            </h4>
            <div className="space-y-2.5 text-sm text-[#FEFAEE]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DB9309] shrink-0 mt-0.5" />
                <span>{settings.contactAddress || DEFAULT_SETTINGS.contactAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DB9309] shrink-0" />
                <a href={`tel:${settings.contactPhone || DEFAULT_SETTINGS.contactPhone}`} className="hover:text-[#DB9309] transition-colors">
                  {settings.contactPhone || DEFAULT_SETTINGS.contactPhone}
                  {settings.contactLandline ? ` / ${settings.contactLandline}` : ''}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#DB9309] shrink-0" />
                <a href={`mailto:${settings.contactEmail || DEFAULT_SETTINGS.contactEmail}`} className="hover:text-[#DB9309] transition-colors">
                  {settings.contactEmail || DEFAULT_SETTINGS.contactEmail}
                </a>
              </div>
              <div className="pt-2">
                <div className="inline-block px-3 py-1.5 rounded-lg bg-[#FEFAEE]/10 border border-[#DB9309]/30 text-xs text-[#DB9309]">
                  {settings.responseTimingText || DEFAULT_SETTINGS.responseTimingText}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar with Verified Links to Privacy Policy, Terms, Sitemap & Staff Portal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FEFAEE]/70 gap-4">
          <p>{settings.copyrightText || DEFAULT_SETTINGS.copyrightText} Crafted with <Heart className="w-3.5 h-3.5 inline text-[#DB9309] fill-[#DB9309]" /> for passionate travelers.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#DB9309] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#DB9309] transition-colors">Terms of Service</Link>
            <Link href="/sitemap-page" className="hover:text-[#DB9309] transition-colors">Sitemap</Link>
            <a href="/sitemap.xml" target="_blank" className="hover:text-[#DB9309] transition-colors text-[11px] opacity-75">XML</a>
            <Link href="/dashboard" className="hover:text-[#DB9309] transition-colors text-[11px] opacity-75">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
