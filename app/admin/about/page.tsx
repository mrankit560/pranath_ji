"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { AboutSectionContent } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Save, Info, Sparkles, CheckCircle } from "lucide-react";

export default function AdminAboutPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [content, setContent] = useState<AboutSectionContent>(store.getAboutContent());
  const [isSaved, setIsSaved] = useState(false);

  // Form states initialized from store
  const [form, setForm] = useState({
    titleHi: content.titleHi,
    titleEn: content.titleEn,
    welcomeHi: content.welcomeHi,
    welcomeEn: content.welcomeEn,
    subtitleHi: content.subtitleHi,
    subtitleEn: content.subtitleEn,
    purposeHeadingHi: content.purposeHeadingHi,
    purposeBodyHi: content.purposeBodyHi,
    questionsHeadingHi: content.questionsHeadingHi,
    questionsHi: content.questionsHi.join("\n"),
    tartamAnswerHi: content.tartamAnswerHi,
    servicesHeadingHi: content.servicesHeadingHi,
    servicesListHi: content.servicesListHi.join("\n"),
    messageHeadingHi: content.messageHeadingHi,
    messageQuoteHi: content.messageQuoteHi,
    messageCtaHi: content.messageCtaHi,
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const c = store.getAboutContent();
      setContent(c);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const qList = form.questionsHi.split("\n").map((q) => q.trim()).filter(Boolean);
    const sList = form.servicesListHi.split("\n").map((s) => s.trim()).filter(Boolean);

    const updatedAbout = {
      titleHi: form.titleHi,
      titleEn: form.titleEn,
      welcomeHi: form.welcomeHi,
      welcomeEn: form.welcomeEn,
      subtitleHi: form.subtitleHi,
      subtitleEn: form.subtitleEn,
      purposeHeadingHi: form.purposeHeadingHi,
      purposeBodyHi: form.purposeBodyHi,
      questionsHeadingHi: form.questionsHeadingHi,
      questionsHi: qList,
      tartamAnswerHi: form.tartamAnswerHi,
      servicesHeadingHi: form.servicesHeadingHi,
      servicesListHi: sList,
      messageHeadingHi: form.messageHeadingHi,
      messageQuoteHi: form.messageQuoteHi,
      messageCtaHi: form.messageCtaHi,
    };

    store.updateAboutContent(updatedAbout);
    await store.saveToStorage("prannath_about_v2", updatedAbout);

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Home 'About Us' Content Editor" : "होम पेज 'हमारे बारे में' सामग्री संपादक"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Edit the verbatim text for the Ashram Introduction, Questions, Services, and Message displayed on the Home Page"
              : "होमपेज पर प्रदर्शित होने वाले आश्रम परिचय, प्रश्नोत्तरी, सेवाओं एवं संदेश का संपूर्ण संपादन"}
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{isEn ? "Saved to Live Site!" : "वेबसाइट पर सेव हो गया!"}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Heading & Welcome */}
        <div className="spiritual-glass-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
          <div className="flex items-center gap-2 text-gold-300 pb-2 border-b border-gold-500/20">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {isEn ? "1. Heading & Welcome Intro" : "१. शीर्षक व स्वागत संदेश"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Main Title (Hindi)" : "मुख्य शीर्षक (हिन्दी)"}
              </label>
              <input
                type="text"
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Main Title (English)" : "मुख्य शीर्षक (English)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Welcome Greeting (Hindi)" : "स्वागत संदेश (हिन्दी)"}
            </label>
            <input
              type="text"
              value={form.welcomeHi}
              onChange={(e) => setForm({ ...form, welcomeHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Subtitle / Intro Description (Hindi)" : "परिचय विवरण (हिन्दी)"}
            </label>
            <textarea
              rows={2}
              value={form.subtitleHi}
              onChange={(e) => setForm({ ...form, subtitleHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none"
            />
          </div>
        </div>

        {/* Section 2: मानव जीवन का वास्तविक लक्ष्य */}
        <div className="spiritual-glass-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
          <div className="flex items-center gap-2 text-gold-300 pb-2 border-b border-gold-500/20">
            <span className="text-gold-400 font-bold">✦</span>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {isEn ? "2. Purpose of Human Life" : "२. मानव जीवन का वास्तविक लक्ष्य"}
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Heading" : "हेडिंग"}
            </label>
            <input
              type="text"
              value={form.purposeHeadingHi}
              onChange={(e) => setForm({ ...form, purposeHeadingHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Body Text" : "मुख्य विवरण"}
            </label>
            <textarea
              rows={3}
              value={form.purposeBodyHi}
              onChange={(e) => setForm({ ...form, purposeBodyHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: Questions & Tartam Answer */}
        <div className="spiritual-glass-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
          <div className="flex items-center gap-2 text-gold-300 pb-2 border-b border-gold-500/20">
            <span className="text-gold-400 font-bold">?</span>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {isEn ? "3. Existential Questions & Tartam Answer" : "३. अनादि काल के प्रश्न एवं उत्तर"}
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Questions Heading" : "प्रश्नों की हेडिंग"}
            </label>
            <input
              type="text"
              value={form.questionsHeadingHi}
              onChange={(e) => setForm({ ...form, questionsHeadingHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Questions List (One question per line)" : "प्रश्नों की सूची (प्रत्येक पंक्ति में एक प्रश्न)"}
            </label>
            <textarea
              rows={6}
              value={form.questionsHi}
              onChange={(e) => setForm({ ...form, questionsHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Tartam Vani Answer Paragraph" : "तारतम वाणी उत्तर पैराग्राफ"}
            </label>
            <textarea
              rows={3}
              value={form.tartamAnswerHi}
              onChange={(e) => setForm({ ...form, tartamAnswerHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Section 4: Services & Message */}
        <div className="spiritual-glass-card rounded-2xl p-6 border border-gold-500/30 space-y-4">
          <div className="flex items-center gap-2 text-gold-300 pb-2 border-b border-gold-500/20">
            <span className="text-gold-400 font-bold">🪷</span>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              {isEn ? "4. Services List & Sacred Message" : "४. हमारी सेवाएँ एवं संदेश"}
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Services List (One per line)" : "सेवाओं की सूची (प्रत्येक पंक्ति में एक सेवा)"}
            </label>
            <textarea
              rows={6}
              value={form.servicesListHi}
              onChange={(e) => setForm({ ...form, servicesListHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari font-mono leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Sacred Quote" : "पावन संदेश / सुविचार"}
              </label>
              <textarea
                rows={2}
                value={form.messageQuoteHi}
                onChange={(e) => setForm({ ...form, messageQuoteHi: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none font-bold text-amber-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Call to Action / Invitation" : "आह्वान / प्रेरणादायक पंक्ति"}
              </label>
              <textarea
                rows={2}
                value={form.messageCtaHi}
                onChange={(e) => setForm({ ...form, messageCtaHi: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center gap-4">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-sm shadow-gold-md hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEn ? "Save & Publish to Home Page" : "सेव करें व होम पेज पर प्रकाशित करें"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
