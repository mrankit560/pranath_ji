"use client";

import React from "react";
import { useI18n, Language } from "@/lib/i18n/context";
import { Globe } from "lucide-react";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-spiritual-navy/80 border border-gold-500/30 rounded-full p-1 shadow-gold-sm backdrop-blur-md">
      <Globe className="w-4 h-4 text-gold-400 ml-1.5" />
      <button
        onClick={() => setLanguage("hi")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
          language === "hi"
            ? "bg-gold-gradient text-spiritual-dark shadow-sm"
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
            ? "bg-gold-gradient text-spiritual-dark shadow-sm"
            : "text-spiritual-ivory/70 hover:text-gold-300"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};
