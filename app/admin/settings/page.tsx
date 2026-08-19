"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { SiteSettings } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Settings, Save, CheckCircle, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [settings, setSettings] = useState<SiteSettings>(store.getSettings());
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setSettings(store.getSettings());
    });
    return () => unsub();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settings);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Portal & Ashram Settings" : "पोर्टल एवं आश्रम सेटिंग्स"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Official contact details, social media links, and Google Maps configuration for Sadhauli Dham"
              : "साढौली धाम के आधिकारिक संपर्क विवरण, सोशल मीडिया लिंक एवं गूगल मैप्स कॉन्फ़िगरेशन"}
          </p>
        </div>

        {toast && (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            {isEn ? "Saved successfully!" : "सफलतापूर्वक सुरक्षित किया गया!"}
          </span>
        )}
      </div>

      <form
        onSubmit={handleSave}
        className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Official Phone Number *" : "आधिकारिक फोन नंबर (Phone) *"}
            </label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Official Email Address *" : "आधिकारिक ईमेल (Email) *"}
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Ashram Address (Hindi) *" : "आश्रम का पता (हिन्दी) *"}
            </label>
            <textarea
              rows={2}
              required
              value={settings.addressHi}
              onChange={(e) => setSettings({ ...settings, addressHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Ashram Address (English) *" : "Ashram Address (English) *"}
            </label>
            <textarea
              rows={2}
              required
              value={settings.addressEn}
              onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gold-500/20">
          <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
            {isEn ? "Social Media & Google Maps Links" : "सोशल मीडिया एवं गूगल मैप्स लिंक"}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              Google Maps URL
            </label>
            <input
              type="text"
              value={settings.googleMapsUrl}
              onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Official YouTube Channel URL" : "आधिकारिक YouTube चैनल URL"}
            </label>
            <input
              type="text"
              value={settings.youtubeUrl}
              onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                WhatsApp Channel URL
              </label>
              <input
                type="text"
                value={settings.whatsappUrl}
                onChange={(e) => setSettings({ ...settings, whatsappUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs flex items-center gap-2 shadow-gold-sm hover:scale-105 transition-transform"
        >
          <Save className="w-4 h-4" />
          <span>{isEn ? "Save Settings" : "सेटिंग्स सुरक्षित करें"}</span>
        </button>
      </form>
    </div>
  );
}
