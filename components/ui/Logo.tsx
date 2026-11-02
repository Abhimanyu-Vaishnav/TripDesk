'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'main' | 'white' | 'dark' | 'round';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export default function Logo({
  variant = 'main',
  size = 'md',
  className = '',
  showTagline = true
}: LogoProps) {
  // Height rules: slightly larger for bold, legible presence in header
  const logoHeightClass =
    size === 'lg'
      ? 'h-14 sm:h-16'
      : size === 'sm'
      ? 'h-8 sm:h-9'
      : 'h-10 sm:h-12'; // default md: 44px-48px sharp display

  // If a specific variant is requested (like white in footer), honor it.
  // Otherwise, render both logos via CSS dark:hidden and hidden dark:block so the switch is 0ms instant without React re-render lag!
  if (variant === 'white') {
    return (
      <Link href="/" className={`inline-flex items-center group ${className}`}>
        <img
          src="/assets/logo/Wordmark Main Logo inverted.png"
          alt="TripDesk Holidays Logo"
          className={`${logoHeightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
          fetchPriority="high"
        />
      </Link>
    );
  }

  if (variant === 'round') {
    return (
      <Link href="/" className={`inline-flex items-center group ${className}`}>
        <img
          src="/assets/logo/Main Round Logo.png"
          alt="TripDesk Holidays Logo"
          className={`${logoHeightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      {/* Light Mode Logo: Wordmark Main Logo (Instant CSS visibility switch) */}
      <img
        src="/assets/logo/Wordmark Main Logo.png"
        alt="TripDesk Holidays Logo"
        className={`${logoHeightClass} w-auto object-contain block dark:hidden transition-transform duration-200 group-hover:scale-105`}
        fetchPriority="high"
      />

      {/* Dark Mode Logo: Wordmark Main Logo inverted (Instant CSS visibility switch) */}
      <img
        src="/assets/logo/Wordmark Main Logo inverted.png"
        alt="TripDesk Holidays Logo"
        className={`${logoHeightClass} w-auto object-contain hidden dark:block transition-transform duration-200 group-hover:scale-105`}
        fetchPriority="high"
      />
    </Link>
  );
}
