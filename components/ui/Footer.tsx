'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart, Globe, MessageCircle, Send } from 'lucide-react';
import Logo from './Logo';
import { SiteSettings } from '@/types';
import { getStoredSettings, DEFAULT_SETTINGS } from '@/lib/storage';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(getStoredSettings());
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
            <div className="flex items-center gap-3 pt-2">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="w-9 h-9 rounded-full bg-[#FEFAEE]/10 hover:bg-[#DB9309] hover:text-[#351202] text-[#FEFAEE] flex items-center justify-center transition-all duration-300"
                  aria-label="Email"
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
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Kashmir & Dal Lake
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Himachal & Parvati Trail
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Royal Rajasthan Forts
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Kerala Backwaters
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
                  Andaman Emerald Coral
                </Link>
              </li>
              <li>
                <Link href="/#packages" className="hover:text-[#DB9309] transition-colors">
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

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FEFAEE]/60 gap-4">
          <p>{settings.copyrightText || DEFAULT_SETTINGS.copyrightText} Crafted with <Heart className="w-3.5 h-3.5 inline text-[#DB9309] fill-[#DB9309]" /> for passionate travelers.</p>
          <div className="flex items-center gap-6">
            <Link href="/#contact" className="hover:text-[#FEFAEE]">Privacy Policy</Link>
            <Link href="/#contact" className="hover:text-[#FEFAEE]">Terms of Service</Link>
            <Link href="/dashboard" className="hover:text-[#DB9309] text-[11px] opacity-75">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
