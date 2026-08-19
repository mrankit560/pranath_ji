"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { SpiritualTopic } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  Compass,
  Sparkles,
  Flower2,
  BookOpen,
  ChevronRight,
  Sun,
  Shield,
  Layers,
} from "lucide-react";

export default function PhilosophyPage() {
  const { t, language } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const topics = store.getSpiritualTopics();
  const [selectedTopic, setSelectedTopic] = useState<SpiritualTopic>(topics[0]);

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            {language === "hi" ? "ब्रह्मज्ञान तत्व दर्शन" : "Brahm Gyan & Spiritual Philosophy"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading mb-3">
            {language === "hi" ? "आत्मज्ञान एवं मूल सिद्धांत" : "Self Realization & Core Principles"}
          </h1>

          <p className="text-sm sm:text-base text-gold-muted/80 max-w-xl mx-auto">
            {language === "hi"
              ? "तारतम वाणी द्वारा प्रकट परब्रह्म, अक्षरातीत, माया, जीव एवं मोक्ष का गूढ़ आध्यात्मिक विवेचन"
              : "Profound philosophical insights into the Supreme Divine, Soul Awakening, and Eternal Paramdham"}
          </p>
        </div>
      </section>

      {/* Main Split Layout */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Topics List (4 cols) */}
          <div className="lg:col-span-4 spiritual-glass-card rounded-2xl p-4 border border-gold-500/30 space-y-2">
            <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider pb-2 border-b border-gold-500/20">
              {language === "hi" ? "दार्शनिक विषय" : "Philosophical Topics"}
            </h3>

            {topics.map((topic) => {
              const isSelected = topic.id === selectedTopic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-gold-500/20 text-gold-200 border border-gold-400/50 shadow-gold-sm"
                      : "text-spiritual-ivory/70 hover:bg-gold-500/10 hover:text-gold-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Flower2 className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-gold-300" : "opacity-40"}`} />
                    <span className="truncate">
                      {language === "hi" ? topic.titleHi : topic.titleEn}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-gold-300" : "opacity-40"}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Topic View (8 cols) */}
          <div className="lg:col-span-8 spiritual-glass-card rounded-3xl p-6 sm:p-10 border border-gold-500/30 space-y-6">
            <div className="border-b border-gold-500/20 pb-4">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-gold-400">
                तत्व मीमांसा
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-spiritual-heading mt-1">
                {language === "hi" ? selectedTopic.titleHi : selectedTopic.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-gold-muted/90 mt-1">
                {language === "hi" ? selectedTopic.descriptionHi : selectedTopic.descriptionEn}
              </p>
            </div>

            {/* Key Concepts Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-spiritual-ivory/60 font-semibold mr-1">
                प्रमुख बिंदु:
              </span>
              {selectedTopic.keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>

            {/* Main Detailed Content */}
            <div className="p-6 rounded-2xl bg-black/40 border border-gold-500/20 space-y-4 text-sm sm:text-base text-spiritual-ivory/90 leading-relaxed font-devanagari">
              <p>{language === "hi" ? selectedTopic.contentHi : selectedTopic.contentEn}</p>
            </div>

            {/* Related Scriptures */}
            {selectedTopic.relatedScriptures.length > 0 && (
              <div className="pt-4 border-t border-gold-500/20">
                <h4 className="text-xs font-bold text-gold-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>संबंधित तारतम ग्रन्थ:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTopic.relatedScriptures.map((granth, idx) => (
                    <Link
                      key={idx}
                      href="/library/tartam-vani"
                      className="px-3 py-1.5 rounded-xl bg-spiritual-card border border-gold-500/30 text-xs font-medium text-spiritual-ivory/90 hover:text-gold-300 hover:border-gold-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>{granth}</span>
                      <ChevronRight className="w-3 h-3 text-gold-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
