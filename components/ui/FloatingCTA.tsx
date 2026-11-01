'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Phone, CheckCircle2 } from 'lucide-react';
import { saveLead } from '@/lib/storage';

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleQuickCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone) return;

    setIsSubmitting(true);
    try {
      await saveLead({
        type: 'talk_to_specialist',
        name: quickName.trim() || 'Website Visitor',
        phone: quickPhone.trim(),
        email: '',
        destination: 'Talk to Specialist - Priority Callback',
        travelersCount: 2,
        notes: `Priority callback requested from Floating Specialist widget by ${quickName.trim() || 'traveler'}.`
      });

      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setIsOpen(false);
        setQuickName('');
        setQuickPhone('');
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-92 bg-[#FEFAEE] dark:bg-[#1D1008] rounded-3xl shadow-2xl border-2 border-[#DB9309] p-5 overflow-hidden relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBBA] dark:border-[#4D2612]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-sm text-[#351202] dark:text-[#FEFAEE]">TripDesk Live Desk</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#351202]/60 dark:text-[#FEFAEE]/60 hover:text-[#351202] p-1 rounded-full hover:bg-[#EADBBA]/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3">
              <h4 className="font-serif text-lg font-bold text-[#351202] dark:text-[#FEFAEE]">
                Talk to Destination Specialist
              </h4>
              <p className="text-xs text-[#351202]/75 dark:text-[#FEFAEE]/75 mt-1 leading-relaxed">
                Connect with our senior destination architect on WhatsApp or get a guaranteed priority call back.
              </p>

              {isSent ? (
                <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs text-center font-medium border border-emerald-200 dark:border-emerald-800 flex flex-col items-center gap-1.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <span>Request received! Notification sent to Admin Dashboard. We will call you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleQuickCallback} className="mt-4 space-y-2.5">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#351202]/50 dark:text-[#FEFAEE]/50" />
                      <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] focus:outline-none focus:border-[#DB9309] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#351202]/50 dark:text-[#FEFAEE]/50" />
                      <input
                        type="tel"
                        required
                        placeholder="Mobile / WhatsApp number *"
                        value={quickPhone}
                        onChange={(e) => setQuickPhone(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] focus:outline-none focus:border-[#DB9309] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#351202] dark:bg-[#DB9309] hover:bg-[#4D1D05] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Request Priority Callback'}</span>
                  </button>
                </form>
              )}

              <div className="mt-3 pt-3 border-t border-[#EADBBA]/60 dark:border-[#4D2612] flex items-center justify-between">
                <a
                  href="https://wa.me/919876543210?text=Hi%20TripDesk%20Holidays,%20I%20am%20looking%20to%20plan%20a%20tour%20package."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  Direct WhatsApp Chat
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#351202] dark:bg-[#DB9309] text-[#FEFAEE] dark:text-[#120904] shadow-2xl border-2 border-[#DB9309] dark:border-[#FEFAEE] hover:bg-[#4D1D05] transition-all group"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-[#DB9309] dark:text-[#120904] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DB9309] dark:bg-[#120904] rounded-full border-2 border-[#351202]" />
        </div>
        <span className="text-xs font-bold tracking-wide">
          Talk to Specialist
        </span>
      </motion.button>
    </div>
  );
}
