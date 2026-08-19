"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSelector } from "./LanguageSelector";
import {
  Menu,
  X,
  Search,
  BookOpen,
  Play,
  Flower2,
  Calendar,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Feather,
  Flame,
} from "lucide-react";

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { t, language } = useI18n();
  const isEn = language === "en";
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      name: isEn ? "Home" : "होम",
      href: "/",
    },
    {
      name: isEn ? "Shree Prannath Ji" : "श्री प्राणनाथ जी",
      href: "/prannath-ji",
    },
    {
      name: isEn ? "Aadhyatmik Gyan" : "आध्यात्मिक ज्ञान",
      href: "/adhyatmik-gyan",
    },
    {
      name: isEn ? "PDF Library" : "PDF लाइब्रेरी",
      href: "/library",
      subItems: [
        { name: isEn ? "All Books" : "सभी पुस्तकें", href: "/library" },
        { name: isEn ? "Shree Bitak Saheb" : "श्री बीतक साहेब", href: "/library?category=bitak_saheb" },
        { name: isEn ? "Tartam Vani" : "तारतम वाणी", href: "/library?category=tartam_vani" },
        { name: isEn ? "Other Books" : "अन्य पुस्तकें", href: "/library?category=other" },
      ],
    },
    {
      name: isEn ? "Media Centre" : "मीडिया केंद्र",
      href: "/media",
      subItems: [
        { name: isEn ? "Videos & Satsang" : "सत्संग एवं वीडियो", href: "/media" },
        {
          name: isEn ? "YouTube Channel ↗" : "आधिकारिक यूट्यूब चैनल ↗",
          href: "https://youtube.com/@sadhaulidham3424?si=l4lptsMtMc6pKrbC",
          isExternal: true,
        },
      ],
    },
    {
      name: isEn ? "Meditation" : "ध्यान साधना",
      href: "/meditation",
      subItems: [
        { name: isEn ? "Chitwani Articles" : "चितवनी लेख व विधि", href: "/meditation?tab=articles" },
        { name: isEn ? "Chitwani Books" : "चितवनी पुस्तकें", href: "/meditation?tab=books" },
        { name: isEn ? "Chitwani Videos" : "चितवनी वीडियो", href: "/meditation?tab=videos" },
      ],
    },
    {
      name: isEn ? "Festival Events" : "उत्सव एवं कार्यक्रम",
      href: "/events",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-spiritual-navy/95 backdrop-blur-xl border-b border-gold-500/30 shadow-2xl py-2.5"
          : "bg-gradient-to-b from-black/85 via-spiritual-navy/60 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-md group-hover:bg-gold-400/40 transition-all" />
              <Image
                src="/assets/logo-emblem.png"
                alt="Sadhauli Dham Emblem"
                width={48}
                height={48}
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_10px_rgba(244,208,111,0.5)] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-gold-gradient font-spiritual-heading leading-none tracking-wide">
                {isEn ? "Shri Prannath Ji" : "श्री प्राणनाथ जी"}
              </span>
              <span className="text-[10px] sm:text-xs text-gold-muted/90 font-bold tracking-widest uppercase">
                {isEn ? "Paramdham" : "परमधाम"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const hasSub = !!link.subItems;

              return (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => hasSub && setDropdownOpen(link.name)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${
                      isActive
                        ? "text-gold-300 bg-gold-500/15 border border-gold-500/30 shadow-gold-sm"
                        : "text-spiritual-ivory/85 hover:text-gold-300 hover:bg-gold-500/10"
                    }`}
                  >
                    <span>{link.name}</span>
                    {hasSub && <ChevronDown className="w-3.5 h-3.5 text-gold-400 opacity-70 group-hover:rotate-180 transition-transform" />}
                  </Link>

                  {/* Desktop Dropdown */}
                  {hasSub && dropdownOpen === link.name && (
                    <div className="absolute top-full left-0 w-56 pt-2 z-50 animate-fade-in">
                      <div className="bg-spiritual-navy/95 border border-gold-500/40 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl space-y-1">
                        {link.subItems?.map((sub) =>
                          sub.isExternal ? (
                            <a
                              key={sub.name}
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-left px-3 py-2 rounded-xl text-xs text-gold-300 hover:bg-gold-500/15 flex items-center justify-between font-semibold"
                            >
                              <span>{sub.name}</span>
                              <ExternalLink className="w-3 h-3 text-red-400" />
                            </a>
                          ) : (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="block px-3 py-2 rounded-xl text-xs text-spiritual-ivory/85 hover:text-gold-300 hover:bg-gold-500/15 font-medium transition-colors"
                            >
                              {sub.name}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons: Language Selector, Search, Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />

            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-xl bg-gold-500/10 border border-gold-400/30 text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all shadow-sm"
              title={isEn ? "Search Portal" : "खोजें"}
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-bold hover:bg-gold-500 hover:text-spiritual-dark transition-all shadow-gold-sm"
            >
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>{isEn ? "Admin" : "एडमिन"}</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-gold-500/10 border border-gold-400/30 text-gold-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-spiritual-navy/95 border-b border-gold-500/30 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.name} className="space-y-1">
              <Link
                href={link.href}
                onClick={() => !link.subItems && setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-spiritual-ivory hover:text-gold-300 hover:bg-gold-500/10"
              >
                {link.name}
              </Link>
              {link.subItems && (
                <div className="pl-4 space-y-1 border-l-2 border-gold-500/20 ml-2">
                  {link.subItems.map((sub) =>
                    sub.isExternal ? (
                      <a
                        key={sub.name}
                        href={sub.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-1.5 text-xs text-gold-300 hover:underline"
                      >
                        {sub.name}
                      </a>
                    ) : (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-xs text-spiritual-ivory/70 hover:text-gold-300"
                      >
                        {sub.name}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-gold-300 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? "Admin CMS Control" : "एडमिन CMS कंट्रोल"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
