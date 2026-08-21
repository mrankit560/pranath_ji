"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Youtube,
  Send,
  CheckCircle,
  ExternalLink,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default function ContactPage() {
  const { t, language } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const settings = store.getSettings();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate safe form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            {language === "hi" ? "आश्रम संपर्क" : "Contact & Location"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading mb-3">
            {t("contact.title", "संपर्क एवं आश्रम स्थान")}
          </h1>

          <p className="text-sm sm:text-base text-gold-muted/80 max-w-xl mx-auto">
            {t(
              "contact.subtitle",
              "साढौली धाम से जुड़ें अथवा अपने आध्यात्मिक प्रश्न हमें भेजें"
            )}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="spiritual-glass-card rounded-2xl p-6 border border-gold-500/30">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-300 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gold-300 uppercase tracking-wider mb-1">
                    {language === "hi" ? "आश्रम का पता" : "Ashram Address"}
                  </h3>
                  <p className="text-sm text-spiritual-ivory/90 leading-relaxed">
                    {language === "hi" ? settings.addressHi : settings.addressEn}
                  </p>
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-200 mt-2 font-semibold"
                  >
                    <span>Google Maps पर देखें</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Phone & Email Card */}
            <div className="spiritual-glass-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {language === "hi" ? "फोन नंबर" : "Phone"}
                  </h3>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-base font-bold text-spiritual-ivory hover:text-gold-300 transition-colors"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-gold-500/20">
                <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    {language === "hi" ? "ईमेल" : "Email"}
                  </h3>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-sm font-semibold text-spiritual-ivory hover:text-gold-300 transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            {/* YouTube & Social Card */}
            <div className="spiritual-glass-card rounded-2xl p-6 border border-gold-500/30">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">
                    {language === "hi" ? "आधिकारिक यूट्यूब चैनल" : "Official YouTube"}
                  </h3>
                  <p className="text-xs text-spiritual-ivory/70 mb-2">
                    साढौली धाम से दैनिक लाइव सत्संग एवं वाणी गायन से जुड़ें।
                  </p>
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/30 border border-red-500/40 text-xs font-bold text-white hover:bg-red-600 transition-all"
                  >
                    <span>चैनल पर जाएं</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Embed Frame */}
            <div className="rounded-2xl overflow-hidden border border-gold-500/30 h-60 bg-black">
              <iframe
                title="Sadhauli Dham Map"
                src="https://maps.google.com/maps?q=Shri%20Nijanand%20Ashram%20Sadhauli%20Dham%20Haridwar%20Uttarakhand&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="spiritual-glass-card rounded-3xl p-6 sm:p-10 border border-gold-500/30">
              <h2 className="text-xl sm:text-2xl font-bold text-gold-gradient font-spiritual-heading mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold-400" />
                <span>{language === "hi" ? "हमें संदेश भेजें" : "Send Us a Message"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-spiritual-ivory/70 mb-6">
                {language === "hi"
                  ? "सत्संग, ग्रन्थ अध्ययन या आश्रम कार्यक्रमों के विषय में जानकारी प्राप्त करने हेतु संपर्क करें।"
                  : "Reach out for inquiries regarding Satsangs, scriptures, or ashram activities."}
              </p>

              {isSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/50 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm animate-fade-in">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <span>{t("contact.success", "आपका संदेश सफलतापूर्वक प्राप्त हो गया है।")}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                      {t("contact.name", "आपका नाम")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t("contact.namePlaceholder", "उदा. रमेश शर्मा")}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-spiritual-ivory placeholder-spiritual-ivory/40 text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                      {t("contact.emailLabel", "ईमेल पता")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t("contact.emailPlaceholder", "name@example.com")}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-spiritual-ivory placeholder-spiritual-ivory/40 text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                      {t("contact.phoneLabel", "मोबाइल नंबर (वैकल्पिक)")}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-spiritual-ivory placeholder-spiritual-ivory/40 text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                      {t("contact.subject", "विषय")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={t("contact.subjectPlaceholder", "सत्संग जानकारी / प्रश्न")}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-spiritual-ivory placeholder-spiritual-ivory/40 text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1.5">
                    {t("contact.message", "आपका संदेश")} *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t("contact.messagePlaceholder", "कृपया अपना संदेश या जिज्ञासा यहाँ लिखें...")}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-spiritual-ivory placeholder-spiritual-ivory/40 text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-colors resize-none"
                  />
                </div>

                {/* Privacy Assurance Note */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-gold-500/20 text-[11px] sm:text-xs text-spiritual-ivory/70 leading-relaxed flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-gold-300 font-semibold">
                      {language === "en" ? "Privacy Assurance:" : "गोपनीयता आश्वासन:"}
                    </strong>{" "}
                    {language === "en"
                      ? "Your contact details (name, email, phone) will solely be used to respond to your spiritual inquiries and satsang updates. We respect your privacy and never share your data with any third party."
                      : "आपकी व्यक्तिगत जानकारी (नाम, ईमेल, फोन) केवल आध्यात्मिक जिज्ञासाओं व सत्संग संपर्क हेतु सुरक्षित रखी जाती है। हम आपकी गोपनीयता का पूर्ण सम्मान करते हैं और इसे किसी भी तीसरे पक्ष के साथ साझा नहीं करते।"}
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? t("contact.sending", "भेज रहे हैं...")
                      : t("contact.submit", "संदेश भेजें")}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
