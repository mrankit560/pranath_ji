"use client";

import React from "react";
import { useTheme } from "@/lib/theme/context";
import { useI18n } from "@/lib/i18n/context";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language } = useI18n();
  const isEn = language === "en";

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={
        theme === "dark"
          ? isEn
            ? "Switch to Light Mode"
            : "लाइट मोड में बदलें"
          : isEn
          ? "Switch to Dark Mode"
          : "डार्क मोड में बदलें"
      }
      className="p-2 rounded-xl border border-gold-500/30 bg-spiritual-card hover:bg-gold-500/20 text-gold-300 transition-all hover:scale-105 shadow-gold-sm flex items-center justify-center"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400" />
      )}
    </button>
  );
};
