'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Compass, MapPin, Sparkles, Moon, Sun } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
    { name: 'Inquire & Book', href: '/#contact', icon: Phone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FEFAEE]/95 dark:bg-[#120904]/95 backdrop-blur-md shadow-md py-3 border-b border-[#EADBBA]/60 dark:border-[#4D2612]'
          : 'bg-[#FEFAEE]/85 dark:bg-[#120904]/85 backdrop-blur-sm py-4 md:py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo variant={theme === 'dark' ? 'white' : 'main'} size="md" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#351202]/85 dark:text-[#FEFAEE]/85 hover:text-[#DB9309] dark:hover:text-[#DB9309] transition-colors flex items-center gap-1.5 py-1 relative group"
              >
                <Icon className="w-4 h-4 text-[#DB9309] opacity-75 group-hover:scale-110 transition-transform" />
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#DB9309] transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-[#EADBBA] dark:border-[#4D2612] bg-[#FDF7E7] dark:bg-[#1D1008] text-[#351202] dark:text-[#DB9309] hover:border-[#DB9309] transition-all"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#351202] dark:bg-[#DB9309] dark:hover:bg-[#b87802] hover:bg-[#4D1D05] active:scale-95 transition-all shadow-sm hover:shadow"
          >
            Plan My Trip
          </Link>
        </div>

        {/* Mobile Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#351202] dark:text-[#FEFAEE] hover:bg-[#EADBBA]/30"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-[#DB9309]" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#351202] dark:text-[#FEFAEE] hover:bg-[#EADBBA]/30 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#FEFAEE] dark:bg-[#120904] border-b border-[#EADBBA] dark:border-[#4D2612] px-6 pt-2 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-4 mt-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-base font-medium text-[#351202] dark:text-[#FEFAEE] hover:text-[#DB9309] p-2 rounded-lg hover:bg-[#FDF7E7] dark:hover:bg-[#1D1008] transition-colors"
                  >
                    <Icon className="w-5 h-5 text-[#DB9309]" />
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-[#EADBBA]/60 dark:border-[#4D2612] flex flex-col gap-3">
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
