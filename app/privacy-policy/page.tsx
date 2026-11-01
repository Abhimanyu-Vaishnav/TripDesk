import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import FloatingCTA from '@/components/ui/FloatingCTA';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | TripDesk Holidays',
  description: 'TripDesk Holidays privacy policy, data collection, usage, and traveler safety protocols.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEFAEE] dark:bg-[#120904]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-[#351202] dark:text-[#FEFAEE]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 mb-6">
          <Link href="/" className="hover:text-[#DB9309] flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-[#351202] dark:text-[#FEFAEE] font-medium">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-[#EADBBA] dark:border-[#4D2612] pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DB9309]/15 text-[#DB9309] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" /> Legal & Transparency
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-2">
            Last Updated: November 2026 • TripDesk Holidays LLP
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[#351202]/85 dark:text-[#FEFAEE]/85">
          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#DB9309]" /> 1. Commitment to Traveler Privacy
            </h2>
            <p>
              At <strong>TripDesk Holidays LLP ("TripDesk", "we", "our")</strong>, respecting and safeguarding your personal information is paramount. This Privacy Policy details how we collect, handle, protect, and use your personal information when you explore our packages, submit an inquiry, request an immediate callback, or book a handcrafted tour through our website.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#DB9309]" /> 2. Information We Collect
            </h2>
            <p>We only collect information necessary to assemble, customize, and execute seamless travel experiences:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Contact Information:</strong> Full name, mobile phone number, WhatsApp contact, and email address.</li>
              <li><strong>Travel Specifications:</strong> Preferred destination, estimated departure dates, group size, special dietary needs, or milestone celebrations (honeymoon, anniversary, family reunions).</li>
              <li><strong>Technical Logs:</strong> Anonymous browser telemetry, device viewport data, and theme preference (Light/Dark mode) stored locally on your device for user experience optimization.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#DB9309]" /> 3. How We Use Your Information
            </h2>
            <p>Your data is used strictly for legitimate holiday planning operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Formulating customized holiday quotes, itinerary PDFs, and hotel vouchers.</li>
              <li>Direct telephone or WhatsApp coordination with our verified tour coordinators.</li>
              <li>Sharing booking manifests exclusively with verified hotel partners, licensed transport drivers, and forest/monument permit authorities.</li>
              <li><strong>Zero Spam Guarantee:</strong> We never sell, lease, monetize, or disclose your contact information to third-party telemarketers or external advertising networks.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE]">
              4. Data Retention & Traveler Rights
            </h2>
            <p className="text-xs sm:text-sm">
              You retain full rights to request inspection, modification, or deletion of your traveler records at any time. Simply email our data desk at <a href="mailto:desk@tripdeskholidays.com" className="text-[#DB9309] underline font-semibold">desk@tripdeskholidays.com</a> and our team will process your request within 48 business hours.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE]">
              5. Contact Us Regarding Privacy
            </h2>
            <p className="text-xs sm:text-sm">
              If you have any questions regarding our safety protocols or data management, reach our legal officer at:
            </p>
            <div className="p-3 bg-[#FEFAEE] dark:bg-[#120904] rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] text-xs space-y-1">
              <div><strong>TripDesk Holidays LLP</strong></div>
              <div>Address: Connaught Place, New Delhi 110001, India</div>
              <div>Email: legal@tripdeskholidays.com / desk@tripdeskholidays.com</div>
              <div>Phone: +91 98765 43210</div>
            </div>
          </section>
        </div>
      </main>

      <FloatingCTA />
      <Footer />
    </div>
  );
}

