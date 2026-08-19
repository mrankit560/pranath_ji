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

  const handleSaveThought = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateDailyThought({
      quoteHi: editQuoteHi,
      quoteEn: editQuoteEn,
    });
    setIsSavedQuote(true);
    setTimeout(() => setIsSavedQuote(false), 2500);
  };

  const statCards = [
    {
      label: isEn ? "Shree Prannath Ji Articles" : "श्री प्राणनाथ जी लेख",
      count: prannathArticles.length,
      icon: Sparkles,
      color: "text-gold-400",
      href: "/admin/prannath-ji",
    },
    {
      label: isEn ? "Aadhyatmik Gyan Blogs" : "आध्यात्मिक ज्ञान ब्लॉग",
      count: adhyatmikBlogs.length,
      icon: Compass,
      color: "text-amber-400",
      href: "/admin/adhyatmik-gyan",
    },
    {
      label: isEn ? "PDF Library Books" : "PDF ग्रंथालय पुस्तकें",
      count: books.length,
      icon: BookOpen,
      color: "text-emerald-400",
      href: "/admin/books",
    },
    {
      label: isEn ? "Media Centre Videos" : "मीडिया केंद्र वीडियो",
      count: videos.length,
      icon: Video,
      color: "text-red-400",
      href: "/admin/videos",
    },
    {
      label: isEn ? "Chitwani Meditation Items" : "चितवनी ध्यान सामग्री",
      count: chitwaniBooks.length,
      icon: Flower2,
      color: "text-purple-400",
      href: "/admin/meditation",
    },
    {
      label: isEn ? "Festival Events" : "आश्रम कार्यक्रम व उत्सव",
      count: events.length,
      icon: Calendar,
      color: "text-blue-400",
      href: "/admin/events",
    },
    {
      label: isEn ? "Holy Dham Locations" : "पवित्र धाम स्थान",
      count: dhams.length,
      icon: MapPin,
      color: "text-yellow-400",
      href: "/admin/dhams",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-gold-400" />
            {isEn ? "Paramdham CMS Control Center" : "प्रशासनिक नियंत्रण कक्ष (परमधाम CMS)"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading">
            {isEn ? "Sadhauli Dham Paramdham Dashboard" : "साढौली धाम परमधाम डैशबोर्ड"}
          </h1>
          <p className="text-xs sm:text-sm text-spiritual-ivory/60">
            {isEn
              ? "Full freedom to manage blogs, books, videos, dhams, and festival events."
              : "वेबसाइट के सभी सेक्शन्स, ब्लॉग, पुस्तकें, वीडियो, धाम एवं कार्यक्रमों का संपूर्ण प्रबंधन।"}
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/prannath-ji"
            className="px-3.5 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? "New Article" : "नया लेख"}</span>
          </Link>
          <Link
            href="/admin/books"
            className="px-3.5 py-2 rounded-xl bg-spiritual-card border border-gold-500/30 text-gold-300 text-xs font-semibold hover:bg-gold-500/20 flex items-center gap-1.5"
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
              className="spiritual-glass-card rounded-2xl p-4 sm:p-5 border border-gold-500/25 flex flex-col justify-between hover:border-gold-400/60 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${card.color}`} />
                <span className="text-xl sm:text-2xl font-extrabold text-spiritual-ivory font-mono group-hover:text-gold-300 transition-colors">
                  {card.count}
                </span>
              </div>
              <span className="text-xs text-spiritual-ivory/70 font-medium">
                {card.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Home About Us Quick Jump Card */}
      <div className="spiritual-glass-card rounded-3xl p-6 border-2 border-gold-400/40 bg-gradient-to-r from-spiritual-navy via-[#1c140e] to-spiritual-navy flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 text-[10px] font-bold uppercase">
            <Info className="w-3 h-3" />
            <span>{isEn ? "Home Page Section" : "होम पेज सेक्शन"}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Edit Home 'About Us' & Message Content" : "होम पेज 'हमारे बारे में' व संदेश संपादित करें"}
          </h3>
          <p className="text-xs text-spiritual-ivory/70 max-w-xl">
            {isEn
              ? "Modify the exact verbatim text for Ashram Introduction, Purpose of Life, 6 Questions, Services, and Message."
              : "आश्रम परिचय, मानव जीवन का उद्देश्य, ६ प्रश्न, हमारी सेवाएँ एवं संदेश को आसानी से संपादित करें।"}
          </p>
        </div>

        <Link
          href="/admin/about"
          className="px-5 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold inline-flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform flex-shrink-0"
        >
          <span>{isEn ? "Edit About Content" : "सामग्री संपादित करें"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Daily Spiritual Thought Editor */}
      <div className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/30">
        <h2 className="text-lg font-bold text-gold-gradient font-spiritual-heading mb-4">
          {isEn ? "Today's Spiritual Thought (Home Card)" : "आज का आध्यात्मिक विचार (होमपेज कार्ड)"}
        </h2>

        <form onSubmit={handleSaveThought} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Spiritual Thought (Hindi)" : "आध्यात्मिक विचार (हिन्दी)"}
            </label>
            <textarea
              rows={2}
              value={editQuoteHi}
              onChange={(e) => setEditQuoteHi(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/60 border border-gold-500/30 text-xs sm:text-sm text-spiritual-ivory focus:border-gold-400 focus:outline-none resize-none font-devanagari"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Spiritual Thought (English)" : "आध्यात्मिक विचार (English)"}
            </label>
            <textarea
              rows={2}
              value={editQuoteEn}
              onChange={(e) => setEditQuoteEn(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/60 border border-gold-500/30 text-xs sm:text-sm text-spiritual-ivory focus:border-gold-400 focus:outline-none resize-none font-sans"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform"
            >
              {isEn ? "Save Quote" : "विचार अपडेट करें"}
            </button>
            {isSavedQuote && (
              <span className="text-xs text-emerald-400 font-semibold animate-fade-in">
                ✓ {isEn ? "Updated successfully!" : "सफलतापूर्वक अपडेट किया गया!"}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
