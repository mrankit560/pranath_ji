"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { DailyThought } from "@/lib/data/types";
import { Quote, Sparkles } from "lucide-react";

export const DailyQuoteCard: React.FC = () => {
  const { language, t } = useI18n();
  const [thought, setThought] = useState<DailyThought>(store.getDailyThought());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setThought(store.getDailyThought());
    });
    return () => unsub();
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-3xl border border-gold-400/40 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-card to-black/90 p-6 sm:p-10 text-center shadow-2xl backdrop-blur-xl">
        {/* Soft Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative corner borders */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold-400/60" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold-400/60" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold-400/60" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold-400/60" />

        {/* Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          {t("quote.title", "आज का आध्यात्मिक विचार")}
        </div>

        {/* Large Quote Mark */}
        <Quote className="w-10 h-10 mx-auto text-gold-400/40 mb-2 rotate-180" />

        {/* Quote Text */}
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-spiritual-heading font-medium text-gold-gradient leading-relaxed max-w-2xl mx-auto mb-4">
          “{language === "hi" ? thought.quoteHi : thought.quoteEn}”
        </blockquote>

        {/* Attribution */}
        <div className="flex flex-col items-center justify-center">
          <cite className="not-italic text-sm font-semibold text-spiritual-ivory/90 font-devanagari">
            {language === "hi" ? thought.authorHi : thought.authorEn}
          </cite>
          <span className="text-xs text-gold-muted/80 mt-0.5">
            {language === "hi" ? thought.sourceHi : thought.sourceEn}
          </span>
        </div>
      </div>
    </div>
  );
};
