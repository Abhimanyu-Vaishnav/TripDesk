import type { Metadata } from 'next';
import { DM_Serif_Display, Montserrat } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { SpeedInsights } from '@vercel/speed-insights/next';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TripDesk Holidays | Desk to Destination - Curated India Tour Packages',
  description: 'Ultra-smooth, experiential tour and travel journeys across India. Handcrafted packages for Kashmir, Himachal, Rajasthan, Kerala, Goa, Uttarakhand, Andaman & Meghalaya with 24/7 dedicated support.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/assets/logo/Main Round Logo.png', type: 'image/png' },
    ],
    apple: '/assets/logo/Main Round Logo.png',
  },
  keywords: [
    'TripDesk Holidays',
    'Desk to Destination',
    'Tour packages India',
    'Kashmir tour',
    'Kerala backwaters',
    'Rajasthan royal tour',
    'Himachal holiday packages',
    'Andaman islands package'
  ],
  authors: [{ name: 'TripDesk Holidays' }],
  openGraph: {
    title: 'TripDesk Holidays - Desk to Destination',
    description: 'Bespoke India Tour Packages handcrafted for explorers, couples, and families.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'TripDesk Holidays',
    images: ['/assets/logo/Main Logo.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${montserrat.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#DB9309] selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
