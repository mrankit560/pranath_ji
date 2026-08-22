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
  ChevronDown,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Flower2,
  Video,
  Calendar,
  Sparkles,
  Compass,
  Info,
  Phone,
  Home,
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
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Desktop header navigation links (About and Contact removed from top header as they are in footer)
  const navLinks = [
    {
      name: isEn ? "Home" : "होम",
      href: "/",
      icon: Home,
    },
    {
      name: isEn ? "Shree Prannath Ji" : "श्री प्राणनाथ जी",
      href: "/prannath-ji",
      icon: Sparkles,
    },
    {
      name: isEn ? "Aadhyatmik Gyan" : "आध्यात्मिक ज्ञान",
      href: "/adhyatmik-gyan",
      icon: Compass,
    },
    {
      name: isEn ? "PDF Library" : "PDF लाइब्रेरी",
      href: "/library",
      icon: BookOpen,
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
      icon: Video,
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
      icon: Flower2,
      subItems: [
        { name: isEn ? "Chitwani Articles" : "चितवनी लेख व विधि", href: "/meditation?tab=articles" },
        { name: isEn ? "Chitwani Books" : "चितवनी पुस्तकें", href: "/meditation?tab=books" },
        { name: isEn ? "Chitwani Videos" : "चितवनी वीडियो", href: "/meditation?tab=videos" },
      ],
    },
    {
      name: isEn ? "Events" : "उत्सव एवं कार्यक्रम",
      href: "/events",
      icon: Calendar,
    },
  ];

  // Mobile drawer links (contains full list including About & Contact)
  const mobileNavLinks = [
    ...navLinks,
    {
      name: isEn ? "About Ashram" : "आश्रम परिचय (About)",
      href: "/about",
      icon: Info,
    },
    {
      name: isEn ? "Contact Us" : "संपर्क (Contact)",
      href: "/contact",
      icon: Phone,
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-spiritual-navy/95 backdrop-blur-xl border-b border-gold-500/30 shadow-2xl py-2"
            : "bg-gradient-to-b from-black/90 via-spiritual-navy/70 to-transparent py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Brand Logo & Title */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 min-w-[200px] sm:min-w-[230px] whitespace-nowrap mr-2 sm:mr-4 lg:mr-6"
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-md group-hover:bg-gold-400/40 transition-all" />
                <Image
                  src="/assets/logo-emblem.png"
                  alt="Sadhauli Dham Emblem"
                  width={44}
                  height={44}
                  className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_10px_rgba(244,208,111,0.5)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-shrink-0 whitespace-nowrap">
                <span className="text-base sm:text-lg font-black text-gold-gradient font-spiritual-heading leading-tight tracking-wide whitespace-nowrap">
                  {isEn ? "Sadhauli Dham" : "साढौली धाम"}
                </span>
                <span className="text-[10px] sm:text-xs text-gold-muted/90 font-bold tracking-wider whitespace-nowrap">
                  {isEn ? "Haridwar (Uttarakhand)" : "हरिद्वार (उत्तराखण्ड)"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Shown on lg+ screens) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
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
                      className={`px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1 ${
                        isActive
                          ? "text-gold-300 bg-gold-500/15 border border-gold-500/30 shadow-gold-sm"
                          : "text-spiritual-ivory/85 hover:text-gold-300 hover:bg-gold-500/10"
                      }`}
                    >
                      <span>{link.name}</span>
                      {hasSub && (
                        <ChevronDown className="w-3.5 h-3.5 text-gold-400 opacity-70 group-hover:rotate-180 transition-transform" />
                      )}
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

            {/* Right Action Icons: Language Selector, Search, Mobile Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
              <LanguageSelector />

              <button
                onClick={onOpenSearch}
                className="p-2 sm:p-2.5 rounded-xl bg-gold-500/10 border border-gold-400/30 text-gold-300 hover:bg-gold-500/20 hover:text-white transition-all shadow-sm"
                title={isEn ? "Search Portal" : "खोजें"}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* High-Visibility Mobile Menu Button (Only on Mobile & Tablet, hidden on Desktop lg+) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden px-2.5 py-1.5 rounded-xl bg-gold-gradient text-spiritual-dark font-extrabold text-xs shadow-gold-sm flex items-center gap-1 active:scale-95 transition-transform"
                aria-label="Toggle Categories Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span className="text-[11px] font-bold">
                  {mobileMenuOpen ? (isEn ? "Close" : "बंद") : (isEn ? "Menu" : "मेन्यू")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen Categories Drawer Menu (Only on Mobile & Tablet) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0d0a08]/98 border-b-2 border-gold-500/40 px-4 pt-3 pb-8 space-y-2 backdrop-blur-3xl animate-fade-in max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
              <span className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>{isEn ? "All Categories & Menus" : "सम्पूर्ण श्रेणियां व ग्रन्थ"}</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-spiritual-ivory/60 hover:text-gold-300 text-xs"
              >
                ✕ {isEn ? "Close" : "बंद करें"}
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {mobileNavLinks.map((link) => {
                const Icon = link.icon;
                const hasSub = Boolean(link.subItems && link.subItems.length > 0);
                const isAccordionOpen = mobileAccordion === link.name;

                return (
                  <div
                    key={link.name}
                    className="rounded-2xl border border-gold-500/15 bg-black/40 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={link.href}
                        onClick={() => {
                          if (!hasSub) setMobileMenuOpen(false);
                        }}
                        className="flex-1 px-3.5 py-3 text-sm font-bold text-spiritual-ivory hover:text-gold-300 flex items-center gap-2.5 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gold-400 flex-shrink-0" />
                        <span>{link.name}</span>
                      </Link>

                      {hasSub && (
                        <button
                          onClick={() => setMobileAccordion(isAccordionOpen ? null : link.name)}
                          className="px-4 py-3 text-gold-400 hover:text-gold-200"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isAccordionOpen ? "rotate-180 text-gold-300" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Sub-Items Accordion Drawer */}
                    {hasSub && isAccordionOpen && (
                      <div className="px-4 pb-3 pt-1 space-y-1 bg-gold-500/5 border-t border-gold-500/10">
                        {link.subItems?.map((sub) =>
                          sub.isExternal ? (
                            <a
                              key={sub.name}
                              href={sub.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gold-300 hover:bg-gold-500/15 font-semibold"
                            >
                              <span>{sub.name}</span>
                              <ExternalLink className="w-3 h-3 text-red-400" />
                            </a>
                          ) : (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-spiritual-ivory/80 hover:text-gold-300 hover:bg-gold-500/10 font-medium transition-colors"
                            >
                              <ChevronRight className="w-3 h-3 text-gold-400" />
                              <span>{sub.name}</span>
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Contact Button */}
            <div className="pt-3">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 rounded-2xl bg-gold-gradient text-spiritual-dark font-black text-xs shadow-gold-sm active:scale-98 transition-transform"
              >
                📞 {isEn ? "Contact Ashram (Haridwar)" : "आश्रम संपर्क करें (हरिद्वार)"}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
