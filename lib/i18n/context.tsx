"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import hiDict from "./hi.json";
import enDict from "./en.json";

export type Language = "hi" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  isFirstVisit: boolean;
  completeFirstVisit: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const dictionaries = {
  hi: hiDict,
  en: enDict,
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("hi");
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("prannath_lang") as Language;
    const hasVisited = localStorage.getItem("prannath_visited");

    if (savedLang && (savedLang === "hi" || savedLang === "en")) {
      setLanguageState(savedLang);
    } else {
      setLanguageState("hi");
    }

    if (!hasVisited) {
      setIsFirstVisit(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("prannath_lang", lang);
      document.documentElement.lang = lang;
    }
  };

  const completeFirstVisit = (lang: Language) => {
    setLanguage(lang);
    setIsFirstVisit(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("prannath_visited", "true");
    }
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current: any = dictionaries[language];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English dictionary if key missing in current
        let fallbackVal: any = dictionaries.en;
        for (const k of keys) {
          if (fallbackVal && typeof fallbackVal === "object" && k in fallbackVal) {
            fallbackVal = fallbackVal[k];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackVal === "string" ? fallbackVal : fallback || path;
      }
    }

    return typeof current === "string" ? current : fallback || path;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isFirstVisit: mounted && isFirstVisit,
        completeFirstVisit,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
