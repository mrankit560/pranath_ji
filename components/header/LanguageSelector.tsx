"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { Languages } from "lucide-react";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "hi" ? "en" : "hi");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-spiritual-navy/90 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 active:scale-95 transition-all text-xs font-bold shadow-gold-sm flex-shrink-0 group"
      title={
        language === "hi"
          ? "Switch to English (अंग्रेज़ी में बदलें)"
          : "हिन्दी में बदलें (Switch to Hindi)"
      }
      aria-label={language === "hi" ? "Switch to English" : "हिन्दी में बदलें"}
    >
      <Languages className="w-4 h-4 text-gold-400 group-hover:rotate-12 transition-transform flex-shrink-0" />
      <span className="text-[11.5px] sm:text-xs font-extrabold text-spiritual-ivory group-hover:text-gold-200 tracking-wide">
        {language === "hi" ? "EN" : "हिन्दी"}
      </span>
    </button>
  );
};
