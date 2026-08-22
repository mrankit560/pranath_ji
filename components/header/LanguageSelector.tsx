"use client";

import React from "react";
import { useI18n, Language } from "@/lib/i18n/context";
import { Globe } from "lucide-react";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "hi" ? "en" : "hi");
  };

  return (
    <>
      {/* 1. Mobile Quick Single-Button Switch (< sm) */}
      <button
        onClick={toggleLanguage}
        className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-spiritual-navy/90 border border-gold-500/40 text-gold-300 hover:bg-gold-500/20 active:scale-95 transition-all text-xs font-bold shadow-sm"
        title={language === "hi" ? "Switch to English" : "हिन्दी में बदलें"}
        aria-label={language === "hi" ? "Switch to English" : "हिन्दी में बदलें"}
      >
        <Globe className="w-3.5 h-3.5 text-gold-400" />
        <span className="text-[11px] font-extrabold text-spiritual-ivory">
          {language === "hi" ? "EN" : "हिन्दी"}
        </span>
      </button>

      {/* 2. Desktop Full Dual-Option Switch (sm+) */}
      <div className="hidden sm:flex items-center gap-1 bg-spiritual-navy/80 border border-gold-500/30 rounded-full p-1 shadow-gold-sm backdrop-blur-md">
        <Globe className="w-4 h-4 text-gold-400 ml-1.5" />
        <button
          onClick={() => setLanguage("hi")}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
            language === "hi"
              ? "bg-gold-gradient text-spiritual-dark shadow-sm font-bold"
              : "text-spiritual-ivory/70 hover:text-gold-300"
          }`}
          aria-label="हिन्दी में बदलें"
        >
          हिन्दी
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
            language === "en"
              ? "bg-gold-gradient text-spiritual-dark shadow-sm font-bold"
              : "text-spiritual-ivory/70 hover:text-gold-300"
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
      </div>
    </>
  );
};
