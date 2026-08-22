"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { SiteSettings } from "@/lib/data/types";
import {
  MapPin,
  Phone,
  Mail,
  Youtube,
  Facebook,
  Instagram,
  ExternalLink,
} from "lucide-react";

export const Footer: React.FC = () => {
  const { t, language } = useI18n();
  const [settings, setSettings] = useState<SiteSettings>(store.getSettings());
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setSettings(store.getSettings());
    const unsub = store.subscribe(() => {
      setSettings(store.getSettings());
    });
    return () => unsub();
  }, []);

  return (
    <footer className="relative bg-[#0a0705] border-t border-gold-500/30 text-spiritual-ivory/80 pt-8 pb-20 md:pb-8 overflow-hidden">
      {/* Decorative top gold gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-8 border-b border-gold-500/20">
          {/* Ashram Contact Info */}
          <div className="space-y-2.5 text-center md:text-left">
            <h4 className="text-sm font-bold text-gold-300 uppercase tracking-wider font-devanagari flex items-center justify-center md:justify-start gap-2">
              <span>📞</span>
              <span>{t("footer.contactInfo", "आश्रम संपर्क एवं पता")}</span>
            </h4>
            <div className="space-y-2 text-xs text-spiritual-ivory/80">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>
                  {language === "hi" ? settings.addressHi : settings.addressEn}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-gold-300 transition-colors font-medium">
                    {settings.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-gold-300 transition-colors font-medium">
                    {settings.email}
                  </a>
                </div>
                <div>
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold-300 hover:text-white underline text-xs font-semibold"
                  >
                    <span>{language === "hi" ? "Google Maps" : "Google Maps"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center md:items-end space-y-2.5">
            <div className="text-xs font-bold text-gold-300 uppercase tracking-wider">
              {language === "hi" ? "सोशल मीडिया से जुड़ें" : "Connect on Social Media"}
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center gap-1.5 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm text-xs font-semibold"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center gap-1.5 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm text-xs font-semibold"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-pink-600/15 border border-pink-500/30 flex items-center gap-1.5 text-pink-400 hover:bg-pink-600 hover:text-white transition-all shadow-sm text-xs font-semibold"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Prominent About / Contact Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-spiritual-ivory/60 gap-4 text-center sm:text-left">
          <div>
            © {currentYear} {language === "hi" ? "साढौली धाम • श्री प्राणनाथ जी वाणी" : "Sadhauli Dham • Shri Prannath Ji Vani"} (sadhaulidham.com) •{" "}
            {t("footer.rights", "सर्वाधिकार सुरक्षित।")}
          </div>

          {/* Prominently Highlighted About and Contact Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <Link
              href="/about"
              className="px-4 py-2 rounded-xl bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-bold hover:bg-gold-500 hover:text-spiritual-dark transition-all shadow-sm flex items-center gap-1.5 hover:scale-105"
            >
              <span>🏛️ {language === "hi" ? "आश्रम परिचय (About)" : "About"}</span>
            </Link>

            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold hover:scale-105 transition-all shadow-gold-sm flex items-center gap-1.5"
            >
              <span>📞 {language === "hi" ? "आश्रम संपर्क (Contact)" : "Contact"}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
