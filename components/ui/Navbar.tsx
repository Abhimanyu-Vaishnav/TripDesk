'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Compass, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Destinations', href: '/#destinations', icon: MapPin },
    { name: 'Tour Packages', href: '/#packages', icon: Compass },
    { name: 'Why Us', href: '/#why-us', icon: Sparkles },
    { name: 'Contact & Inquire', href: '/#contact', icon: Phone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FEFAEE]/95 backdrop-blur-md shadow-md py-3 border-b border-[#EADBBA]/60'
          : 'bg-[#FEFAEE]/80 backdrop-blur-sm py-4 md:py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo variant="main" size="md" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#351202]/85 hover:text-[#DB9309] transition-colors flex items-center gap-1.5 py-1 relative group"
              >
                <Icon className="w-4 h-4 text-[#DB9309] opacity-75 group-hover:scale-110 transition-transform" />
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#DB9309] transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs uppercase tracking-wider text-[#351202]/70 hover:text-[#351202] font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#EADBBA] hover:border-[#DB9309] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#DB9309]" />
            Admin
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#351202] hover:bg-[#4D1D05] active:scale-95 transition-all shadow-sm hover:shadow hover:shadow-[#DB9309]/20"
          >
            Plan My Trip
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#351202] hover:bg-[#EADBBA]/30 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#FEFAEE] border-b border-[#EADBBA] px-6 pt-2 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-4 mt-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-base font-medium text-[#351202] hover:text-[#DB9309] p-2 rounded-lg hover:bg-[#FDF7E7] transition-colors"
                  >
                    <Icon className="w-5 h-5 text-[#DB9309]" />
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-[#EADBBA]/60 flex flex-col gap-3">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#EADBBA] text-sm font-medium text-[#351202]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#DB9309]" />
                  Admin Dashboard
                </Link>

                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-[#DB9309] hover:bg-[#c48107] text-white font-semibold text-sm shadow-md"
                >
                  Inquire Now / Plan Trip
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

