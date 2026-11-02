'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  const [imageError, setImageError] = useState(false);

  const getLogoSrc = () => {
    switch (variant) {
      case 'white':
        return '/assets/logo/wordmark-white.png';
      case 'round':
        return '/assets/logo/Main Round Logo.png';
      case 'dark':
        return '/assets/logo/Wordmark Black Logo.png';
      case 'main':
      default:
        // Use Wordmark Black Logo for light mode: exact same shape/aspect ratio (1058x485) as white wordmark
        return '/assets/logo/Wordmark Black Logo.png';
    }
  };

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { width: 130, height: 42 };
      case 'lg':
        return { width: 230, height: 75 };
      case 'md':
      default:
        return { width: 180, height: 58 };
    }
  };

  const { width, height } = getDimensions();

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      {!imageError ? (
        <div className="relative overflow-hidden flex items-center">
          <Image
            src={getLogoSrc()}
            alt="TripDesk Holidays Logo"
            width={width}
            height={height}
            priority
            onError={() => setImageError(true)}
            className="object-contain h-auto transition-transform duration-300 group-hover:scale-105"
            style={{ maxHeight: size === 'lg' ? '65px' : size === 'sm' ? '36px' : '48px', width: 'auto' }}
          />
        </div>
      ) : (
        /* Dynamic SVG fallback matching brand styling if logo asset cannot be rendered */
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DB9309] to-[#351202] flex items-center justify-center text-white shadow-md font-bold text-lg tracking-wider">
            TD
          </div>
          <div className="flex flex-col">
            <span
              className={`font-serif text-xl font-bold tracking-tight ${
                variant === 'white' ? 'text-[#FEFAEE]' : 'text-[#351202]'
              }`}
            >
              TripDesk
            </span>
            {showTagline && (
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#DB9309] -mt-1">
                Desk to Destination
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}

