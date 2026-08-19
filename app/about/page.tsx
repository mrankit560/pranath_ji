"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  Sparkles,
  MapPin,
  ExternalLink,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export default function AboutPage() {
  const { t, language } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Header Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            {language === "hi" ? "आश्रम परिचय" : "About the Ashram"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight mb-4">
            श्री निजानंद आश्रम साढौली धाम, हरिद्वार (उत्तराखण्ड)
          </h1>

          <p className="text-sm sm:text-base text-gold-muted/90 max-w-2xl mx-auto">
            {language === "hi"
              ? "श्री प्राणनाथ जी परमधाम साढौली धाम में आपका हार्दिक स्वागत है।"
              : "Welcome to Shri Prannath Ji Paramdham, Sadhauli Dham, Haridwar."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="spiritual-glass-card rounded-3xl p-6 sm:p-12 border border-gold-500/30 space-y-10 shadow-2xl">
          {/* Welcome Intro */}
          <div className="text-center pb-8 border-b border-gold-500/20">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <Image
                src="/assets/logo-emblem.png"
                alt="Sadhauli Dham Emblem"
                width={112}
                height={112}
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(244,208,111,0.5)]"
              />
            </div>
            <p className="text-base sm:text-lg text-spiritual-ivory/90 leading-relaxed font-medium max-w-2xl mx-auto">
              {language === "hi"
                ? "यह पावन परमधाम अनन्त श्री प्राणनाथ जी की दिव्य ब्रह्मवाणी, तारतम ज्ञान तथा निजानंद सम्प्रदाय के आध्यात्मिक संदेश को जन-जन तक पहुँचाने का एक विनम्र प्रयास है।"
                : "This sacred Paramdham is a humble endeavor to spread the divine Brahm Vani of Anant Shri Prannath Ji, Tartam Gyan, and the spiritual message of the Nijanand Sampradaya."}
            </p>
          </div>

          {/* Section: मानव जीवन का वास्तविक लक्ष्य */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-spiritual-heading flex items-center gap-2">
              <span>✦</span>
              <span>{language === "hi" ? "मानव जीवन का वास्तविक लक्ष्य" : "The True Purpose of Human Life"}</span>
            </h2>
            <p className="text-sm sm:text-base text-spiritual-ivory/85 leading-relaxed">
              {language === "hi"
                ? "मनुष्य जन्म अत्यन्त दुर्लभ है। इसका वास्तविक उद्देश्य अपने आत्मस्वरूप को पहचानकर परमात्मा से जुड़ना है। आत्मज्ञान ही मनुष्य को अज्ञान तथा जन्म-मरण के बन्धनों से ऊपर उठाकर जीवन को सार्थक बनाता है।"
                : "Human birth is extremely rare. Its ultimate purpose is to recognize one's true soul-identity and connect with the Supreme Divine. Self-knowledge alone elevates human beings above ignorance and the cycles of birth and death, fulfilling the purpose of existence."}
            </p>
          </div>

          {/* Section: Questions */}
          <div className="space-y-4 bg-black/40 rounded-2xl p-6 border border-gold-500/20">
            <h3 className="text-lg sm:text-xl font-bold text-gold-300 font-devanagari flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gold-400" />
              <span>
                {language === "hi"
                  ? "अनादि काल से मानव के मन में अनेक प्रश्न उठते रहे हैं—"
                  : "Profound existential questions arising in the human heart—"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                language === "hi" ? "मैं कौन हूँ?" : "Who am I?",
                language === "hi" ? "मेरा वास्तविक स्वरूप क्या है?" : "What is my real identity?",
                language === "hi" ? "मेरा सच्चा मालिक कौन है?" : "Who is my true Lord?",
                language === "hi" ? "परमात्मा कहाँ निवास करते हैं?" : "Where does Supreme Being dwell?",
                language === "hi" ? "उन्हें प्राप्त करने का वास्तविक मार्ग क्या है?" : "What is the true path to Him?",
                language === "hi" ? "मानव जीवन का अंतिम उद्देश्य क्या है?" : "What is ultimate purpose of life?",
              ].map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-spiritual-navy/60 border border-gold-500/20 text-xs sm:text-sm text-gold-200 font-medium"
                >
                  {q}
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-spiritual-ivory/80 pt-3 border-t border-gold-500/15 leading-relaxed">
              {language === "hi"
                ? "इन सभी प्रश्नों का स्पष्ट उत्तर तारतम वाणी में प्राप्त होता है। तारतम वाणी केवल एक ग्रन्थ नहीं, बल्कि आत्मज्ञान का दिव्य प्रकाश है। यह जीव को उसके वास्तविक स्वरूप, परमात्मा की पहचान तथा प्रेम, सेवा और सत्य के मार्ग का ज्ञान कराती है।"
                : "Clear answers to all these questions are revealed in the Tartam Vani. Tartam Vani is the divine light of self-realization, revealing Paramdham and eternal truth."}
            </p>
          </div>

          {/* Section: हमारी सेवाएँ */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-spiritual-heading flex items-center gap-2">
              <span>✦</span>
              <span>{language === "hi" ? "हमारी सेवाएँ" : "Our Sacred Services"}</span>
            </h2>
            <p className="text-sm text-spiritual-ivory/80">
              {language === "hi"
                ? "इस पावन परमधाम में आपको एक ही स्थान पर उपलब्ध हैं—"
                : "In this sacred Paramdham, available in one sacred destination—"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                language === "hi" ? "श्री प्राणनाथ जी का दिव्य ज्ञान" : "Divine Wisdom of Shri Prannath Ji",
                language === "hi" ? "तारतम वाणी अध्ययन (१४ ग्रन्थ)" : "Tartam Vani Scripture Reader",
                language === "hi" ? "आध्यात्मिक लेख व तत्व दर्शन" : "Spiritual Articles & Wisdom",
                language === "hi" ? "सत्संग एवं वीडियो प्रवचन" : "Satsang & Video Discourses",
                language === "hi" ? "वाणी गायन एवं चितवनी ध्यान" : "Vani Gayan & Meditation",
                language === "hi" ? "प्रेरणादायक आध्यात्मिक सामग्री" : "Inspirational Spiritual Books",
                language === "hi" ? "आश्रम एवं धार्मिक कार्यक्रमों की जानकारी" : "Ashram Updates & Events",
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-spiritual-navy/50 border border-gold-500/20 text-xs sm:text-sm text-spiritual-ivory/90"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: हमारा संदेश */}
          <div className="text-center p-8 rounded-2xl bg-gradient-to-b from-gold-500/15 via-gold-500/5 to-transparent border border-gold-400/40">
            <h3 className="text-xs uppercase tracking-widest text-gold-300 font-bold mb-3">
              {language === "hi" ? "हमारा संदेश" : "Our Sacred Message"}
            </h3>
            <blockquote className="text-xl sm:text-2xl font-spiritual-heading text-gold-gradient font-semibold mb-4">
              “ज्ञान ही जीवन का प्रकाश है। प्रेम, सेवा और साधना ही सच्चे जीवन का आधार हैं।”
            </blockquote>
            <p className="text-xs sm:text-sm text-spiritual-ivory/80 max-w-lg mx-auto leading-relaxed">
              {language === "hi"
                ? "आइए, श्री प्राणनाथ जी की दिव्य वाणी के साथ आत्मज्ञान, सत्य और परमात्मा की पहचान की ओर एक कदम बढ़ाएँ।"
                : "Join us on the sacred path of self-realization, divine truth, and spiritual peace through the words of Shri Prannath Ji."}
            </p>
          </div>

          {/* Location & Navigation Actions */}
          <div className="pt-6 border-t border-gold-500/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-spiritual-ivory/70">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>श्री निजानंद आश्रम साढौली धाम, हरिद्वार (उत्तराखण्ड)</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="px-4 py-2 rounded-full bg-gold-gradient text-spiritual-dark text-xs font-bold shadow-gold-sm hover:scale-105 transition-transform"
              >
                {language === "hi" ? "संपर्क पृष्ठ" : "Contact Page"}
              </Link>
              <a
                href="https://maps.app.goo.gl/eVws2zw4syqXLw1bA?g_st=com.google.maps.preview.copy"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-gold-500/30 text-gold-300 text-xs font-semibold hover:bg-gold-500/10 flex items-center gap-1.5"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
