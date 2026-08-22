"use client";

import React from "react";
import Image from "next/image";
import { useI18n, Language } from "@/lib/i18n/context";
import { Sparkles, Globe } from "lucide-react";

export const LanguageWelcomeModal: React.FC = () => {
  const { isFirstVisit, completeFirstVisit, t } = useI18n();

  if (!isFirstVisit) return null;

  const handleSelect = (lang: Language) => {
    completeFirstVisit(lang);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-spiritual-dark/90 backdrop-blur-xl animate-fade-in">
      {/* Background Divine Radial Glow */}
      <div className="absolute inset-0 bg-gold-radial pointer-events-none" />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gold-400/40 bg-gradient-to-b from-[#1E1612]/95 via-[#130E0B]/95 to-[#0A0705]/95 p-8 text-center shadow-2xl shadow-gold-900/50 backdrop-blur-2xl">
        {/* Decorative corner borders */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold-400/70" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold-400/70" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold-400/70" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold-400/70" />

        {/* Emblem */}
        <div className="relative mx-auto mb-5 w-24 h-24 sm:w-28 sm:h-28 animate-pulse-glow">
          <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl" />
          <Image
            src="/assets/logo-emblem.png"
            alt="Sadhauli Dham Emblem"
            width={112}
            height={112}
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_20px_rgba(244,208,111,0.5)]"
          />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          {t("welcomeModal.greeting", "🙏 सादर प्रणाम / Welcome")}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight mb-1">
          {t("welcomeModal.portal", "साढौली धाम • श्री प्राणनाथ जी वाणी")}
        </h2>
        <p className="text-xs sm:text-sm text-gold-muted/80 mb-6">
          श्री निजानंद आश्रम साढौली धाम, हरिद्वार • sadhaulidham.com
        </p>

        <p className="text-xs sm:text-sm text-spiritual-ivory/80 mb-6 font-medium">
          कृपया अपनी पसंदीदा भाषा चुनें / Choose your language
        </p>

        {/* Language Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hindi Option */}
          <button
            onClick={() => handleSelect("hi")}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-gold-500/50 bg-gradient-to-br from-spiritual-maroon/30 via-spiritual-navy/60 to-gold-950/40 hover:border-gold-400 hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-gold-500/25 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/50 flex items-center justify-center text-gold-300 font-bold text-lg mb-2 group-hover:bg-gold-500 group-hover:text-spiritual-dark transition-all">
              हि
            </div>
            <span className="text-lg font-bold text-gold-gradient font-devanagari">
              हिन्दी
            </span>
            <span className="text-xs text-spiritual-ivory/70 mt-1">
              हिंदी में आगे बढ़ें
            </span>
          </button>

          {/* English Option */}
          <button
            onClick={() => handleSelect("en")}
            className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-gold-500/30 bg-gradient-to-br from-spiritual-purple/30 via-spiritual-navy/60 to-gold-950/40 hover:border-gold-400 hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-gold-500/25 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/50 flex items-center justify-center text-gold-300 font-bold text-lg mb-2 group-hover:bg-gold-500 group-hover:text-spiritual-dark transition-all">
              EN
            </div>
            <span className="text-lg font-bold text-gold-gradient font-sans">
              English
            </span>
            <span className="text-xs text-spiritual-ivory/70 mt-1">
              Continue in English
            </span>
          </button>
        </div>

        <p className="mt-5 text-[11px] text-spiritual-ivory/50 flex items-center justify-center gap-1.5">
          <Globe className="w-3 h-3 text-gold-400/70" />
          आप इसे बाद में भी कभी भी बदल सकते हैं (You can change this anytime from header)
        </p>
      </div>
    </div>
  );
};
