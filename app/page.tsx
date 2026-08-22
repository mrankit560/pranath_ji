"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Navbar } from "@/components/header/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { DailyQuoteCard } from "@/components/common/DailyQuoteCard";
import { HolyDhamsSection } from "@/components/home/HolyDhamsSection";
import { SectionDivider } from "@/components/common/SectionDivider";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  Sparkles,
  MapPin,
  Camera,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const { language } = useI18n();
  const isEn = language === "en";
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      {/* Sticky Header */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Global Search Modal */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* 1. Cinematic Hero Section (with 4 Action Cards, 3D Mandala, and Upcoming Event Banner) */}
      <HeroSection />

      {/* 2. Today's Spiritual Thought */}
      <section className="py-4">
        <DailyQuoteCard />
      </section>

      {/* 2.5. Official Sadhauli Dham Welcome & Darshan Banner */}
      <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border-2 border-gold-400/40 bg-gradient-to-r from-[#18110c]/90 via-[#221610]/85 to-[#120e0b]/90 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-gold-400/50 shadow-lg shadow-gold-950/50">
                <Image
                  src="/assets/sadhauli-dham-2.jpg"
                  alt="श्री निजानंद आश्रम साढौली धाम, हरिद्वार"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>
                    {isEn
                      ? "SadhauliDham.com • Haridwar"
                      : "साढौली धाम • SadhauliDham.com"}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight py-0.5 overflow-visible">
                  {isEn
                    ? "Welcome to Shri Nijanand Ashram Sadhauli Dham, Haridwar"
                    : "श्री निजानंद आश्रम साढौली धाम, हरिद्वार में आपका स्वागत है"}
                </h3>

                <p className="text-xs sm:text-sm text-spiritual-ivory/80 leading-relaxed">
                  {isEn
                    ? "The sacred spiritual sanctuary dedicated to Mahamati Shri Prannath Ji's Tartam Vani, Aksharatit Brahm Gyan, continuous satsang, meditation sanctums, and selfless seva in Haridwar (Uttarakhand)."
                    : "महामति श्री प्राणनाथ जी की दिव्य तारतम वाणी, अक्षरातीत परब्रह्म दर्शन, अखंड सत्संग, साधन कुटीर एवं विशाल सेवा का पावन आध्यात्मिक तीर्थ — साढौली धाम, हरिद्वार (उत्तराखण्ड)।"}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 flex-shrink-0 w-full lg:w-auto">
              <a
                href="#holy-dhams"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isEn ? "Ashram Photos & Darshan" : "साढौली धाम दर्शन"}</span>
              </a>

              <a
                href="https://maps.app.goo.gl/n5oY9okf86WyuiKN9?g_st=com.google.maps.preview.copy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-200 hover:bg-gold-500/25 font-semibold text-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>{isEn ? "Haridwar Location" : "आश्रम रास्ता (Google Maps)"}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider symbol="🏛️" />

      {/* 3. Holy Dham Section (Different Locations & Multi-Photo Galleries) */}
      <div id="holy-dhams">
        <HolyDhamsSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
