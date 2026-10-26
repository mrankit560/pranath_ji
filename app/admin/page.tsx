"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/data/store";
import { useI18n } from "@/lib/i18n/context";
import {
  BookOpen,
  Video,
  Flower2,
  Calendar,
  FileText,
  MapPin,
  Plus,
  Sparkles,
  ArrowRight,
  Compass,
  Info,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [books, setBooks] = useState(store.getBooks());
  const [prannathArticles, setPrannathArticles] = useState(store.getPrannathArticles());
  const [adhyatmikBlogs, setAdhyatmikBlogs] = useState(store.getAdhyatmikBlogs());
  const [videos, setVideos] = useState(store.getVideos());
  const [events, setEvents] = useState(store.getEvents());
  const [dhams, setDhams] = useState(store.getDhams());
  const [chitwaniBooks, setChitwaniBooks] = useState(store.getChitwaniBooks());

  const [thought, setThought] = useState(store.getDailyThought());
  const [editQuoteHi, setEditQuoteHi] = useState(thought.quoteHi);
  const [editQuoteEn, setEditQuoteEn] = useState(thought.quoteEn);
  const [isSavedQuote, setIsSavedQuote] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBooks(store.getBooks());
      setPrannathArticles(store.getPrannathArticles());
      setAdhyatmikBlogs(store.getAdhyatmikBlogs());
      setVideos(store.getVideos());
      setEvents(store.getEvents());
      setDhams(store.getDhams());
      setChitwaniBooks(store.getChitwaniBooks());
      setThought(store.getDailyThought());
    });
    return () => unsub();
  }, []);

  const [isSavingThought, setIsSavingThought] = useState(false);

  const handleSaveThought = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingThought(true);
    store.updateDailyThought({
      quoteHi: editQuoteHi,
      quoteEn: editQuoteEn,
    });
    await store.saveToStorage("prannath_thought_v2", store.getDailyThought());
    setIsSavingThought(false);
    setIsSavedQuote(true);
    setTimeout(() => setIsSavedQuote(false), 2500);
  };

  const statCards = [
    {
      label: isEn ? "Divine Brahm Vani" : "दिव्य ब्रह्मवाणी",
      count: prannathArticles.length,
      icon: Sparkles,
      color: "text-gold-700",
      href: "/admin/prannath-ji",
    },
    {
      label: isEn ? "Spiritual Wisdom" : "आध्यात्मिक ज्ञान",
      count: adhyatmikBlogs.length,
      icon: Compass,
      color: "text-amber-700",
      href: "/admin/adhyatmik-gyan",
    },
    {
      label: isEn ? "Literature" : "साहित्य",
      count: books.length,
      icon: BookOpen,
      color: "text-emerald-700",
      href: "/admin/books",
    },
    {
      label: isEn ? "Media Centre" : "मीडिया केंद्र",
      count: videos.length,
      icon: Video,
      color: "text-red-700",
      href: "/admin/videos",
    },
    {
      label: isEn ? "Meditation" : "ध्यान साधना",
      count: chitwaniBooks.length,
      icon: Flower2,
      color: "text-purple-700",
      href: "/admin/meditation",
    },
    {
      label: isEn ? "Events" : "उत्सव एवं कार्यक्रम",
      count: events.length,
      icon: Calendar,
      color: "text-blue-700",
      href: "/admin/events",
    },
    {
      label: isEn ? "Holy Dhams & Centers" : "पवित्र धाम एवं साधना केंद्र",
      count: dhams.length,
      icon: MapPin,
      color: "text-yellow-700",
      href: "/admin/dhams",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/45 text-gold-700 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-gold-700" />
            {isEn ? "Paramdham CMS Control Center" : "प्रशासनिक नियंत्रण कक्ष (परमधाम CMS)"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading">
            {isEn ? "Sadhauli Dham Paramdham Dashboard" : "साढौली धाम परमधाम डैशबोर्ड"}
          </h1>
          <p className="text-xs sm:text-sm text-ink/60">
            {isEn
              ? "Full freedom to manage blogs, books, videos, dhams, and festival events."
              : "वेबसाइट के सभी सेक्शन्स, ब्लॉग, पुस्तकें, वीडियो, धाम एवं कार्यक्रमों का संपूर्ण प्रबंधन।"}
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/prannath-ji"
            className="px-3.5 py-2 rounded-xl bg-gold-gradient text-on-gold text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? "New Article" : "नया लेख"}</span>
          </Link>
          <Link
            href="/admin/books"
            className="px-3.5 py-2 rounded-xl bg-card border border-line text-gold-700 text-xs font-semibold hover:bg-gold-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? "New PDF Book" : "नई PDF पुस्तक"}</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="spiritual-glass-card rounded-2xl p-4 sm:p-5 border border-line flex flex-col justify-between hover:border-gold-400/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${card.color}`} />
                <span className="text-xl sm:text-2xl font-extrabold text-ink font-mono group-hover:text-gold-700 transition-colors">
                  {card.count}
                </span>
              </div>
              <span className="text-xs text-ink/70 font-medium">
                {card.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Home About Us Quick Jump Card */}
      <div className="spiritual-glass-card rounded-3xl p-6 border-2 border-gold-400/40 bg-gradient-to-r from-surface-2 via-surface-sunk to-surface-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-700 text-[10px] font-bold uppercase">
            <Info className="w-3 h-3" />
            <span>{isEn ? "Home Page Section" : "होम पेज सेक्शन"}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Edit Home 'About Us' & Message Content" : "होम पेज 'हमारे बारे में' व संदेश संपादित करें"}
          </h3>
          <p className="text-xs text-ink/70 max-w-xl">
            {isEn
              ? "Modify the exact verbatim text for Ashram Introduction, Purpose of Life, 6 Questions, Services, and Message."
              : "आश्रम परिचय, मानव जीवन का उद्देश्य, ६ प्रश्न, हमारी सेवाएँ एवं संदेश को आसानी से संपादित करें।"}
          </p>
        </div>

        <Link
          href="/admin/about"
          className="px-5 py-2.5 rounded-xl bg-gold-gradient text-on-gold text-xs font-bold inline-flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform flex-shrink-0"
        >
          <span>{isEn ? "Edit About Content" : "सामग्री संपादित करें"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Daily Spiritual Thought Editor */}
      <div className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-line">
        <h2 className="text-lg font-bold text-gold-gradient font-spiritual-heading mb-4">
          {isEn ? "Today's Spiritual Thought (Home Card)" : "आज का आध्यात्मिक विचार (होमपेज कार्ड)"}
        </h2>

        <form onSubmit={handleSaveThought} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gold-700 mb-1">
              {isEn ? "Spiritual Thought (Hindi)" : "आध्यात्मिक विचार (हिन्दी)"}
            </label>
            <textarea
              rows={2}
              value={editQuoteHi}
              onChange={(e) => setEditQuoteHi(e.target.value)}
              className="w-full p-3 rounded-xl bg-field border border-line text-xs sm:text-sm text-ink focus:border-gold-400 focus:outline-none resize-none font-devanagari"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-700 mb-1">
              {isEn ? "Spiritual Thought (English)" : "आध्यात्मिक विचार (English)"}
            </label>
            <textarea
              rows={2}
              value={editQuoteEn}
              onChange={(e) => setEditQuoteEn(e.target.value)}
              className="w-full p-3 rounded-xl bg-field border border-line text-xs sm:text-sm text-ink focus:border-gold-400 focus:outline-none resize-none font-sans"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSavingThought}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-on-gold font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isSavingThought
                ? isEn
                  ? "Saving..."
                  : "सेव हो रहा है..."
                : isEn
                ? "Save Quote"
                : "विचार अपडेट करें"}
            </button>
            {isSavedQuote && (
              <span className="text-xs text-emerald-700 font-semibold animate-fade-in">
                ✓ {isEn ? "Updated successfully!" : "सफलतापूर्वक अपडेट किया गया!"}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
