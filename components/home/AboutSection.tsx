"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { AboutSectionContent } from "@/lib/data/types";
import { Sparkles, HelpCircle, CheckCircle, Heart, ArrowRight } from "lucide-react";

export const AboutSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [content, setContent] = useState<AboutSectionContent>(store.getAboutContent());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setContent(store.getAboutContent());
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-transparent via-black/40 to-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="spiritual-glass-card rounded-3xl p-6 sm:p-12 border-2 border-gold-400/40 shadow-2xl space-y-12 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 1. Header Banner & Welcome */}
          <div className="text-center space-y-4 pb-8 border-b border-gold-500/20">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{isEn ? "About the Ashram" : "आश्रम परिचय"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight">
              {isEn ? content.titleEn : content.titleHi}
            </h2>

            <p className="text-base sm:text-lg font-bold text-spiritual-ivory max-w-2xl mx-auto">
              {isEn ? content.welcomeEn : content.welcomeHi}
            </p>

            <p className="text-xs sm:text-sm text-gold-muted/90 max-w-3xl mx-auto leading-relaxed">
              {isEn ? content.subtitleEn : content.subtitleHi}
            </p>
          </div>

          {/* 2. मानव जीवन का वास्तविक लक्ष्य */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gold-300">
              <span className="text-gold-400 text-lg">✦</span>
              <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient font-spiritual-heading">
                {isEn ? content.purposeHeadingEn : content.purposeHeadingHi}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-spiritual-ivory/85 leading-relaxed pl-5 border-l-2 border-gold-500/40">
              {isEn ? content.purposeBodyEn : content.purposeBodyHi}
            </p>
          </div>

          {/* 3. Questions Section */}
          <div className="space-y-5 bg-black/60 rounded-2xl p-6 sm:p-8 border border-gold-500/30 shadow-inner">
            <div className="flex items-center gap-2 text-gold-300">
              <HelpCircle className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <h4 className="text-base sm:text-lg font-bold text-gold-gradient font-spiritual-heading">
                {isEn ? content.questionsHeadingEn : content.questionsHeadingHi}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {(isEn ? content.questionsEn : content.questionsHi).map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-spiritual-navy/80 border border-gold-500/20 text-xs sm:text-sm text-spiritual-ivory/95 font-medium flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{q}</span>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-spiritual-ivory/85 pt-4 border-t border-gold-500/20 leading-relaxed font-normal">
              {isEn ? content.tartamAnswerEn : content.tartamAnswerHi}
            </p>
          </div>

          {/* 4. हमारी सेवाएँ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold-300">
              <span className="text-gold-400 text-lg">✦</span>
              <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient font-spiritual-heading">
                {isEn ? content.servicesHeadingEn : content.servicesHeadingHi}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {(isEn ? content.servicesListEn : content.servicesListHi).map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-spiritual-navy/60 border border-gold-500/25 text-xs sm:text-sm text-spiritual-ivory/90 hover:border-gold-400/50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. हमारा संदेश (Quote) */}
          <div className="text-center p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-gold-500/15 via-gold-500/5 to-transparent border-2 border-gold-400/40 space-y-4 shadow-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5 text-gold-400 fill-current" />
              <span>{isEn ? content.messageHeadingEn : content.messageHeadingHi}</span>
            </div>

            <blockquote className="text-xl sm:text-2xl md:text-3xl font-spiritual-heading text-gold-gradient font-bold leading-relaxed max-w-2xl mx-auto">
              {isEn ? content.messageQuoteEn : content.messageQuoteHi}
            </blockquote>

            <p className="text-xs sm:text-sm text-spiritual-ivory/80 max-w-xl mx-auto leading-relaxed font-medium">
              {isEn ? content.messageCtaEn : content.messageCtaHi}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
