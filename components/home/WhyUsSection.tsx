'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, Sparkles, HeartHandshake, Headphones, Award } from 'lucide-react';

export default function WhyUsSection() {
  const perks = [
    {
      icon: Compass,
      title: 'Desk to Destination Magic',
      description: 'Zero guesswork. We take care of every transfer, stay, permit, and meal so you only focus on the adventure.'
    },
    {
      icon: ShieldCheck,
      title: 'Transparent, Honest Pricing',
      description: 'No hidden resort taxes, surprise driver fees, or bait-and-switch accommodations. Everything is crystal clear.'
    },
    {
      icon: Sparkles,
      title: '100% Customized Trips',
      description: 'Every itinerary is flexible. Swap hotels, add extra adventure nights, or alter meal plans tailored for your family.'
    },
    {
      icon: Headphones,
      title: '24/7 Dedicated Trip Desk',
      description: 'A personal travel concierge is on call round-the-clock on WhatsApp & phone throughout your vacation.'
    },
    {
      icon: HeartHandshake,
      title: 'Verified 4-Star & Heritage Stays',
      description: 'We personally vet every boutique resort, Himalayan cottage, and Dal Lake houseboat for supreme hygiene and warmth.'
    },
    {
      icon: Award,
      title: '98.7% Traveler Delight',
      description: 'Thousands of happy travelers across India rate TripDesk Holidays 4.9/5 for reliability and memorable experiences.'
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-[#FDF7E7] dark:bg-[#1D1008] border-y border-[#EADBBA] dark:border-[#4D2612] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#DB9309] font-bold">
            The TripDesk Advantage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351202] dark:text-[#FEFAEE] mt-2">
            Why Travelers Choose TripDesk Holidays
          </h2>
          <p className="text-sm text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-3">
            We don’t just sell packages — we curate moments that turn into lifetime memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-[#FEFAEE] dark:bg-[#120904] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm hover:border-[#DB9309] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#DB9309]/15 flex items-center justify-center text-[#DB9309] mb-4 group-hover:bg-[#DB9309] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] mb-2">
                  {perk.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#351202]/75 dark:text-[#FEFAEE]/75 leading-relaxed">
                  {perk.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
