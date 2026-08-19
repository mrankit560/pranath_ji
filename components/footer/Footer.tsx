"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import {
  MapPin,
  Phone,
  Mail,
  Youtube,
  Facebook,
  Instagram,
  Heart,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const Footer: React.FC = () => {
  const { t, language } = useI18n();
  const settings = store.getSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-spiritual-navy border-t border-gold-500/30 text-spiritual-ivory/80 pt-16 pb-28 md:pb-16 overflow-hidden">
      {/* Decorative top gold gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-gold-500/20">
          {/* Col 1: Ashram & Portal Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/logo-emblem.png"
                  alt="Sadhauli Dham Emblem"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(244,208,111,0.5)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-gold-gradient font-spiritual-heading leading-tight">
                  {language === "hi" ? "श्री प्राणनाथ जी" : "Shri Prannath Ji"}
                </span>
                <span className="text-xs text-gold-muted font-bold tracking-widest uppercase">
                  {language === "hi" ? "परमधाम" : "Paramdham"}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-spiritual-ivory/70 leading-relaxed max-w-md">
              {t(
                "footer.aboutDham",
                "श्री निजानंद आश्रम साढौली धाम, हरिद्वार (उत्तराखण्ड) — श्री प्राणनाथ जी की तारतम वाणी एवं दिव्य ब्रह्मज्ञान का पावन केंद्र।"
              )}
            </p>

            <div className="pt-2 text-xs font-semibold text-gold-400/90 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{t("footer.blessing", "सुख सीतल करे संसार • प्रेम सेवा से पाओगे पार")}</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400 hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Holy Scriptures */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gold-300 uppercase tracking-wider font-devanagari">
              {t("footer.scriptures", "पवित्र शास्त्र")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/library/tartam-vani" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "तारतम वाणी (१४ ग्रन्थ)" : "Tartam Vani (14 Granths)"}
                </Link>
              </li>
              <li>
                <Link href="/library/tartam-vani" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "श्री रास ग्रन्थ" : "Shri Raas Granth"}
                </Link>
              </li>
              <li>
                <Link href="/library/tartam-vani" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "श्री प्रकाश ग्रन्थ" : "Shri Prakash Granth"}
                </Link>
              </li>
              <li>
                <Link href="/library/tartam-vani" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "श्री सनंध ग्रन्थ" : "Shri Sanandh Granth"}
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "PDF ई-पुस्तकालय" : "PDF E-Library"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Media & Sadhna */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gold-300 uppercase tracking-wider font-devanagari">
              {t("footer.mediaCenter", "मीडिया एवं साधना")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/media" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "दैनिक सत्संग वीडियो" : "Daily Satsang Videos"}
                </Link>
              </li>
              <li>
                <Link href="/media" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "वाणी गायन एवं आरती" : "Vani Gayan & Aarti"}
                </Link>
              </li>
              <li>
                <Link href="/meditation" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "चितवनी एवं ध्यान कक्ष" : "Chitwani & Meditation"}
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "उत्सव एवं कार्यक्रम कैलेंडर" : "Festival & Events Calendar"}
                </Link>
              </li>
              <li>
                <Link href="/philosophy" className="hover:text-gold-300 transition-colors">
                  {language === "hi" ? "ब्रह्मज्ञान तत्व दर्शन" : "Brahm Gyan Philosophy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Ashram Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gold-300 uppercase tracking-wider font-devanagari">
              {t("footer.contactInfo", "आश्रम संपर्क")}
            </h4>
            <div className="space-y-2.5 text-xs text-spiritual-ivory/75">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {language === "hi" ? settings.addressHi : settings.addressEn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-gold-300 transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-300 transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="pt-1">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-gold-300 hover:text-gold-200 underline text-xs"
                >
                  <span>Google Maps पर देखें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-spiritual-ivory/50 gap-3 text-center sm:text-left">
          <div>
            © {currentYear} {t("site.title", "श्री प्राणनाथ जी परमधाम")} •{" "}
            {t("footer.rights", "सर्वाधिकार सुरक्षित।")}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/about" className="hover:text-gold-300">
              {t("nav.about", "हमारे बारे में")}
            </Link>
            <Link href="/contact" className="hover:text-gold-300">
              {t("nav.contact", "संपर्क")}
            </Link>
            <Link href="/admin" className="text-gold-400/80 hover:text-gold-300 font-semibold">
              {t("nav.admin", "एडमिन लॉगिन")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
