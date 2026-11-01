import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import FloatingCTA from '@/components/ui/FloatingCTA';
import { ShieldCheck, CheckCircle2, ChevronLeft, AlertCircle, FileCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | TripDesk Holidays',
  description: 'Terms of booking, cancellation policies, payment schedules, and traveler conditions with TripDesk Holidays.',
};

export default function TermsOfServicePage() {
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
          <span className="text-[#351202] dark:text-[#FEFAEE] font-medium">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="border-b border-[#EADBBA] dark:border-[#4D2612] pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DB9309]/15 text-[#DB9309] text-xs font-bold uppercase tracking-wider mb-3">
            <FileCheck className="w-4 h-4" /> Booking & Cancellation Agreement
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-2">
            Governing all customized itineraries, bookings, and operations • TripDesk Holidays LLP
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-[#351202]/85 dark:text-[#FEFAEE]/85">
          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 1. Booking & Confirmation
            </h2>
            <p>
              By inquiring, confirming an itinerary, or submitting payment towards a TripDesk Holidays travel package, you agree to these Terms. A booking is formally confirmed once the initial reservation advance is recorded and an official TripDesk Booking Voucher is issued.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#DB9309]" /> 2. Pricing & Inclusions
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>All quotes provided directly by our destination architects clearly enumerate included nights, verified hotel category, meals, and dedicated transport vehicles.</li>
              <li>Toll taxes, state road taxes, driver food and accommodation allowances, and fuel surcharges are included unless explicitly excluded in your customized quotation sheet.</li>
              <li>Monument entrance fees, adventure activity tickets (such as paragliding, scuba certification, quad biking), pony rides, and personal expenditure remain at the traveler's discretion unless pre-bundled.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" /> 3. Cancellation & Refund Policy
            </h2>
            <p>We understand plans change. Our transparent cancellation slabs apply as follows:</p>
            <div className="p-4 bg-[#FEFAEE] dark:bg-[#120904] rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] text-xs space-y-2">
              <div className="flex justify-between">
                <span><strong>30+ Days Prior to Travel:</strong></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Full refund minus token processing fee</span>
              </div>
              <div className="flex justify-between">
                <span><strong>15 - 29 Days Prior to Travel:</strong></span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">25% cancellation charge</span>
              </div>
              <div className="flex justify-between">
                <span><strong>7 - 14 Days Prior to Travel:</strong></span>
                <span className="text-rose-700 dark:text-rose-400 font-bold">50% cancellation charge</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Under 7 Days Prior to Travel:</strong></span>
                <span className="text-rose-800 dark:text-rose-400 font-bold">Non-refundable (hotels & transport committed)</span>
              </div>
            </div>
            <p className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 italic">
              * In case of unexpected natural roadblocks, snow closures, or flight disruptions, our 24/7 on-call coordinator will assist in rerouting or rescheduling where feasible.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE]">
              4. Traveler Responsibilities
            </h2>
            <p className="text-xs sm:text-sm">
              Travelers must carry valid government-issued photo identity cards (Aadhaar, Passport, Voter ID) during the tour for hotel check-ins and regional border checkpoint permits (e.g., Kashmir, Sikkim, Andaman, Ladakh).
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE]">
              5. Jurisdiction & Grievance Redressal
            </h2>
            <p className="text-xs sm:text-sm">
              Any dispute arising from our services shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India. For any urgent concerns during an active tour, reach out immediately to our priority concierge desk at <a href="tel:+919876543210" className="text-[#DB9309] font-bold">+91 98765 43210</a>.
            </p>
          </section>
        </div>
      </main>

      <FloatingCTA />
      <Footer />
    </div>
  );
}

