import type { Metadata } from 'next';
import { DM_Serif_Display, Montserrat } from 'next/font/google';
import './globals.css';

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
    siteName: 'TripDesk Holidays'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FEFAEE] text-[#351202] antialiased selection:bg-[#DB9309] selection:text-white">
        {children}
      </body>
    </html>
  );
}
