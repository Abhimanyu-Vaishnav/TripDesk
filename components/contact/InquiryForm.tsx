'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, ShieldCheck, Clock, User, Mail, Phone, MapPin, Users, Calendar, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TourPackage } from '@/types';
import { saveLead } from '@/lib/storage';

interface InquiryFormProps {
  initialPackage?: TourPackage | null;
  googleFormEmbedUrl?: string; // Optional Google Form url if user provides
}

export default function InquiryForm({ initialPackage }: InquiryFormProps) {
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
  const [activeTab, setActiveTab] = useState<'custom' | 'google-form'>('custom');

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
      // 1. Save lead to internal system / localStorage
      const savedLead = saveLead({
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

      // 2. Also attempt to post to backend lead endpoint if available
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedLead)
        });
      } catch {
        // Fallback already saved locally
      }

      // 3. Trigger celebration confetti
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

  return (
    <div className="bg-[#FEFAEE] rounded-3xl border-2 border-[#DB9309] p-6 sm:p-10 shadow-xl relative overflow-hidden">
      {/* Decorative top badge */}
      <div className="flex items-center justify-between pb-6 border-b border-[#EADBBA]">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#DB9309] font-bold">
            Desk To Destination • Tailor-made Journeys
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#351202] mt-1">
            Plan Your Dream Getaway
          </h3>
          <p className="text-xs sm:text-sm text-[#351202]/75 mt-1">
            Fill your details below. Our holiday architect will craft a customized, zero-obligation quote within 2 hours.
          </p>
        </div>

        {/* Tab switch for Custom vs Embedded Form */}
        <div className="hidden sm:flex bg-[#FDF7E7] p-1 rounded-xl border border-[#EADBBA] text-xs">
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'custom' ? 'bg-[#351202] text-white shadow' : 'text-[#351202]/70 hover:text-[#351202]'
            }`}
          >
            Direct Inquiry
          </button>
          <button
            onClick={() => setActiveTab('google-form')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'google-form' ? 'bg-[#351202] text-white shadow' : 'text-[#351202]/70 hover:text-[#351202]'
            }`}
          >
            Google Form Mode
          </button>
        </div>
      </div>

      {activeTab === 'google-form' ? (
        <div className="mt-6 space-y-4">
          <p className="text-xs text-[#351202]/80">
            You can embed your exact Google Form or Google Sheets Webhook here. The form below provides a live responsive frame.
          </p>
          <div className="w-full h-[580px] rounded-2xl overflow-hidden border border-[#EADBBA] bg-white">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScU73iF8gH-tripdesk-sample/viewform?embedded=true"
              width="100%"
              height="100%"
              className="border-0"
              title="TripDesk Google Form Inquiry"
            >
              Loading…
            </iframe>
          </div>
        </div>
      ) : isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 text-center space-y-4"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="font-serif text-2xl font-bold text-[#351202]">
            Inquiry Dispatched Successfully!
          </h4>
          <p className="text-sm text-[#351202]/80 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-[#351202]">{name}</span>. A senior travel specialist has received your requirements for <span className="font-semibold text-[#DB9309]">{destination || 'your destination'}</span> and is assembling your custom itinerary.
          </p>
          <div className="p-4 bg-[#FDF7E7] rounded-2xl border border-[#EADBBA] max-w-sm mx-auto text-xs text-[#351202]/70 space-y-1">
            <div>📞 Callback on: <span className="font-medium text-[#351202]">{phone}</span></div>
            <div>✉️ Quotation via: <span className="font-medium text-[#351202]">{email}</span></div>
          </div>
          <div className="pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full bg-[#351202] hover:bg-[#4D1D05] text-white text-xs font-semibold shadow-md transition-all"
            >
              Submit Another Inquiry
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#351202] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#DB9309]" /> Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-xs sm:text-sm text-[#351202]"
              />
            </div>

            {/* Mobile / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-[#351202] mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#DB9309]" /> Mobile / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-xs sm:text-sm text-[#351202]"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#351202] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#DB9309]" /> Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vikram@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-xs sm:text-sm text-[#351202]"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-[#351202] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#DB9309]" /> Destination Interested *
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kashmir, Kerala, Rajasthan..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-xs sm:text-sm text-[#351202]"
              />
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-xs font-semibold text-[#351202] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#DB9309]" /> Approximate Travel Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-xs sm:text-sm text-[#351202]"
              />
            </div>

            {/* Travelers & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#351202] mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#DB9309]" /> Travelers
                </label>
                <select
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-xs sm:text-sm text-[#351202]"
                >
                  <option value="1">1 Person (Solo)</option>
                  <option value="2">2 Persons (Couple)</option>
                  <option value="4">3-5 Persons (Family)</option>
                  <option value="8">6+ Persons (Group)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#351202] mb-1.5">
                  Budget (Per Person)
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-xs sm:text-sm text-[#351202]"
                >
                  <option value="Under ₹20,000">Under ₹20,000</option>
                  <option value="₹20,000 - ₹35,000">₹20,000 - ₹35,000</option>
                  <option value="₹35,000 - ₹60,000">₹35,000 - ₹60,000</option>
                  <option value="₹60,000+ (Luxury)">₹60,000+ (Luxury)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#351202] mb-1.5">
              Custom Requirements & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us about special occasions (honeymoon, anniversary), preferred stay type, dietary preferences or places you want to include..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-xs sm:text-sm text-[#351202]"
            />
          </div>

          {/* Privacy & Trust Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#351202]/70">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We never spam or share your contact data with third-parties.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#351202] hover:bg-[#4D1D05] active:scale-95 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Connecting to Desk...</span>
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

