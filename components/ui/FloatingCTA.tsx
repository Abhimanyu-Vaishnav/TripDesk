'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, Send, Sparkles } from 'lucide-react';

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [quickPhone, setQuickPhone] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleQuickCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setIsOpen(false);
      setQuickPhone('');
    }, 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-4 w-80 sm:w-88 bg-[#FEFAEE] rounded-2xl shadow-2xl border-2 border-[#DB9309] p-5 overflow-hidden relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBBA]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-sm text-[#351202]">TripDesk Live Desk</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#351202]/60 hover:text-[#351202] p-1 rounded-full hover:bg-[#EADBBA]/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3">
              <h4 className="font-serif text-lg font-bold text-[#351202]">
                Need instant holiday advice?
              </h4>
              <p className="text-xs text-[#351202]/75 mt-1 leading-relaxed">
                Connect directly with our senior destination architect on WhatsApp or request an immediate call-back.
              </p>

              {isSent ? (
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center font-medium border border-emerald-200">
                  🎉 Call back request received! Our travel specialist will call you in 10 minutes.
                </div>
              ) : (
                <form onSubmit={handleQuickCallback} className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="Enter mobile number"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] bg-white text-[#351202]"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-3 py-2.5 bg-[#351202] hover:bg-[#4D1D05] text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Call Me
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-3 pt-3 border-t border-[#EADBBA]/60 flex items-center justify-between">
                <a
                  href="https://wa.me/919876543210?text=Hi%20TripDesk%20Holidays,%20I%20am%20looking%20to%20plan%20a%20tour%20package."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  Chat on WhatsApp
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
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#351202] text-[#FEFAEE] shadow-2xl border-2 border-[#DB9309] hover:bg-[#4D1D05] transition-all group"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-[#DB9309] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DB9309] rounded-full border-2 border-[#351202]" />
        </div>
        <span className="text-xs font-semibold tracking-wide">
          Talk to Specialist
        </span>
      </motion.button>
    </div>
  );
}

