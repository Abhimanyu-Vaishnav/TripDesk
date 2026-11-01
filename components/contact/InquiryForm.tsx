'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, ShieldCheck, Clock, User, Mail, Phone, MapPin, Users, Calendar, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TourPackage, SiteSettings } from '@/types';
import { saveLead, getStoredSettings } from '@/lib/storage';

interface InquiryFormProps {
  initialPackage?: TourPackage | null;
}

export default function InquiryForm({ initialPackage }: InquiryFormProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelersCount, setTravelersCount] = useState('2');
  const [budgetRange, setBudgetRange] = useState('₹25,000 - ₹50,000');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  useEffect(() => {
    if (initialPackage) {
      setDestination(initialPackage.state + ' - ' + initialPackage.title);
      setNotes(`Interested in package: ${initialPackage.title} (${initialPackage.duration.days}D/${initialPackage.duration.nights}N).`);
    }
  }, [initialPackage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await saveLead({
        name,
        email,
        phone,
        destination: destination || 'Pan India Exploration',
        travelDate,
        travelersCount: parseInt(travelersCount, 10) || 2,
        budgetRange,
        notes,
        packageId: initialPackage?.id,
        packageTitle: initialPackage?.title
      });

      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DB9309', '#351202', '#FEFAEE', '#55B35A']
        });
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setIsSuccess(false);
  };

  const isGoogleFormMode = settings?.contactMode === 'google_form';
  const googleFormUrl = settings?.googleFormEmbedUrl || 'https://docs.google.com/forms/d/e/1FAIpQLScU73iF8gH-tripdesk-sample/viewform?embedded=true';

  return (
    <div className="bg-[#FEFAEE] dark:bg-[#1D1008] rounded-3xl border-2 border-[#DB9309] p-6 sm:p-10 shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EADBBA] dark:border-[#4D2612] gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#DB9309] font-bold">
            Desk To Destination • Direct Travel Inquiry
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#351202] dark:text-[#FEFAEE] mt-1">
            Plan Your Dream Getaway
          </h3>
          <p className="text-xs sm:text-sm text-[#351202]/75 dark:text-[#FEFAEE]/75 mt-1">
            Fill your details. Our holiday architect will craft a customized, zero-obligation quote within 2 hours.
          </p>
        </div>

        {isGoogleFormMode && (
          <a
            href={googleFormUrl.replace('?embedded=true', '')}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#DB9309] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open in Full Screen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Render Google Form or Custom Form based on Dashboard Settings */}
      {isGoogleFormMode ? (
        <div className="mt-6 space-y-4">
          <div className="w-full h-[620px] rounded-2xl overflow-hidden border border-[#EADBBA] dark:border-[#4D2612] bg-white shadow-inner">
            <iframe
              src={googleFormUrl}
              width="100%"
              height="100%"
              className="border-0 w-full h-full"
              title="TripDesk Official Google Form"
            >
              Loading inquiry form…
            </iframe>
          </div>
          <p className="text-xs text-center text-[#351202]/60 dark:text-[#FEFAEE]/60">
            🔒 Responses are saved directly to TripDesk Holidays Google Forms & verified spreadsheets.
          </p>
        </div>
      ) : isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 text-center space-y-4"
        >
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE]">
            Inquiry Dispatched Successfully!
          </h4>
          <p className="text-sm text-[#351202]/80 dark:text-[#FEFAEE]/80 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-[#351202] dark:text-[#FEFAEE]">{name}</span>. A senior travel specialist has received your requirements for <span className="font-semibold text-[#DB9309]">{destination || 'your destination'}</span>.
          </p>
          <div className="p-4 bg-[#FDF7E7] dark:bg-[#120904] rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] max-w-sm mx-auto text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 space-y-1">
            <div>📞 Callback on: <span className="font-medium text-[#351202] dark:text-[#FEFAEE]">{phone}</span></div>
            <div>✉️ Quotation via: <span className="font-medium text-[#351202] dark:text-[#FEFAEE]">{email}</span></div>
          </div>
          <div className="pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-[#351202] dark:bg-[#DB9309] hover:bg-[#4D1D05] text-white text-xs font-semibold shadow-md transition-all"
            >
              Submit Another Inquiry
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#DB9309]" /> Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#DB9309]" /> Mobile / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#DB9309]" /> Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vikram@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#DB9309]" /> Destination Interested *
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kashmir, Kerala, Rajasthan..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#DB9309]" /> Approximate Travel Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#DB9309]" /> Travelers Count
              </label>
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none"
              >
                <option value="1">1 Person (Solo)</option>
                <option value="2">2 Persons (Couple)</option>
                <option value="4">3-5 Persons (Family)</option>
                <option value="8">6+ Persons (Group)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5">
              Custom Requirements & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us about special occasions, preferred stay type, dietary preferences..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We never spam or share your contact data with third-parties.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#351202] dark:bg-[#DB9309] hover:bg-[#4D1D05] active:scale-95 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Get Free Custom Itinerary & Quote</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
