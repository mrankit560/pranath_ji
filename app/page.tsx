"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Navbar } from "@/components/header/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { DailyQuoteCard } from "@/components/common/DailyQuoteCard";
import { HolyDhamsSection } from "@/components/home/HolyDhamsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { SectionDivider } from "@/components/common/SectionDivider";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  BookOpen,
  FileText,
  Play,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Bookmark,
  ChevronRight,
  Flower2,
  Compass,
  MapPin,
  Camera,
  ExternalLink,
  Clock,
} from "lucide-react";
import { isPdfAvailable } from "@/app/library/page";
import { formatSpiritualDate } from "@/lib/utils/formatDate";

export default function HomePage() {
  const { t, language } = useI18n();
  const isEn = language === "en";
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [scriptures, setScriptures] = useState(store.getScriptures());
  const [books, setBooks] = useState(store.getBooks());
  const [videos, setVideos] = useState(store.getVideos());
  const [prannathArticles, setPrannathArticles] = useState(store.getPrannathArticles());
  const [adhyatmikBlogs, setAdhyatmikBlogs] = useState(store.getAdhyatmikBlogs());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setScriptures(store.getScriptures());
      setBooks(store.getBooks());
      setVideos(store.getVideos());
      setPrannathArticles(store.getPrannathArticles());
      setAdhyatmikBlogs(store.getAdhyatmikBlogs());
    });
    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      {/* Sticky Header */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Global Search Modal */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* 1. Cinematic Hero Section (with Earliest Upcoming Event Banner) */}
      <HeroSection />

      {/* 2. Today's Spiritual Thought */}
      <section className="py-4">
        <DailyQuoteCard />
      </section>

      {/* 2.5. Official Sadhauli Dham Welcome Banner */}
      <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border-2 border-gold-400/40 bg-gradient-to-r from-[#18110c]/90 via-[#221610]/85 to-[#120e0b]/90 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-gold-400/50 shadow-lg shadow-gold-950/50">
                <Image
                  src="/assets/sadhauli-dham-2.jpg"
                  alt="श्री निजानंद आश्रम साढौली धाम, हरिद्वार"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>
                    {isEn
                      ? "SadhauliDham.com • Haridwar"
                      : "साढौली धाम • SadhauliDham.com"}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight py-0.5 overflow-visible">
                  {isEn
                    ? "Welcome to Shri Nijanand Ashram Sadhauli Dham, Haridwar"
                    : "श्री निजानंद आश्रम साढौली धाम, हरिद्वार में आपका स्वागत है"}
                </h3>

                <p className="text-xs sm:text-sm text-spiritual-ivory/80 leading-relaxed">
                  {isEn
                    ? "The sacred spiritual sanctuary dedicated to Mahamati Shri Prannath Ji's Tartam Vani, Aksharatit Brahm Gyan, continuous satsang, meditation sanctums, and selfless seva in Haridwar (Uttarakhand)."
                    : "महामति श्री प्राणनाथ जी की दिव्य तारतम वाणी, अक्षरातीत परब्रह्म दर्शन, अखंड सत्संग, साधन कुटीर एवं विशाल सेवा का पावन आध्यात्मिक तीर्थ — साढौली धाम, हरिद्वार (उत्तराखण्ड)।"}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 flex-shrink-0 w-full lg:w-auto">
              <a
                href="#holy-dhams"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isEn ? "Ashram Photos & Darshan" : "साढौली धाम दर्शन"}</span>
              </a>

              <a
                href="https://maps.app.goo.gl/n5oY9okf86WyuiKN9?g_st=com.google.maps.preview.copy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-200 hover:bg-gold-500/25 font-semibold text-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>{isEn ? "Haridwar Location" : "आश्रम रास्ता (Google Maps)"}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shree Prannath Ji Articles Highlights */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              {isEn ? "Divine Leelas & Teachings" : "श्री प्राणनाथ जी पावन दर्शन"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible">
              {isEn ? "Shree Prannath Ji — Life & Leelas" : "श्री प्राणनाथ जी — दिव्य जीवन व उपदेश"}
            </h2>
            <p className="text-xs sm:text-sm text-spiritual-ivory/70 max-w-2xl mt-1">
              {isEn
                ? "Explore profound articles, biography, awakening missions, and divine teachings."
                : "महामति जी के प्राकट्य, जागनी अभियान, सद्गुरु मिलन एवं दिव्य उपदेशों के लेख।"}
            </p>
          </div>

          <Link
            href="/prannath-ji"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gold-300 hover:text-gold-100 group"
          >
            <span>{isEn ? "View All Articles" : "सभी लेख पढ़ें"}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prannathArticles.slice(0, 2).map((art) => (
            <Link
              key={art.id}
              href="/prannath-ji"
              className="spiritual-glass-card rounded-3xl p-6 border border-gold-500/30 group hover:border-gold-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-gold-muted/80 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 font-semibold uppercase">
                    {art.category}
                  </span>
                  <span>{art.readTime || "5 min read"}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading mb-2">
                  {isEn ? art.titleEn || art.titleHi : art.titleHi}
                </h3>

                <p className="text-xs sm:text-sm text-spiritual-ivory/75 line-clamp-3 leading-relaxed mb-4">
                  {isEn ? art.summaryEn || art.summaryHi : art.summaryHi}
                </p>
              </div>

              <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span>{art.author}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{isEn ? "Read Full Post" : "विस्तार से पढ़ें"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SectionDivider symbol="🪷" />

      {/* 4. Aadhyatmik Gyan Blogs Highlights */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              {isEn ? "Spiritual Wisdom & Philosophy" : "आध्यात्मिक ज्ञान व ब्रह्मज्ञान"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible">
              {isEn ? "Aadhyatmik Gyan — Spiritual Blogs" : "आध्यात्मिक ज्ञान — सत्संग व ब्लॉग"}
            </h2>
            <p className="text-xs sm:text-sm text-spiritual-ivory/70 max-w-2xl mt-1">
              {isEn
                ? "Enlightening articles on soul realization, Aksharatit, love, and spiritual practice."
                : "आत्मज्ञान, अक्षरातीत परब्रह्म, प्रेम, सेवा और साधना पर ज्ञानवर्धक लेख।"}
            </p>
          </div>

          <Link
            href="/adhyatmik-gyan"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gold-300 hover:text-gold-100 group"
          >
            <span>{isEn ? "Explore Spiritual Blogs" : "सभी ब्लॉग देखें"}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adhyatmikBlogs.slice(0, 2).map((blog) => (
            <Link
              key={blog.id}
              href="/adhyatmik-gyan"
              className="spiritual-glass-card rounded-3xl p-6 border border-gold-500/30 group hover:border-gold-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-amber-300/80 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-semibold uppercase">
                    {blog.category}
                  </span>
                  <span>{formatSpiritualDate(blog.publishedAt, language)}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading mb-2">
                  {isEn ? blog.titleEn || blog.titleHi : blog.titleHi}
                </h3>

                <p className="text-xs sm:text-sm text-spiritual-ivory/75 line-clamp-3 leading-relaxed mb-4">
                  {isEn ? blog.summaryEn || blog.summaryHi : blog.summaryHi}
                </p>
              </div>

              <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span>{blog.author}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{isEn ? "Read Blog" : "ब्लॉग पढ़ें"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SectionDivider symbol="📖" />

      {/* 5. PDF Library Preview */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              {isEn ? "Sacred PDF Books & Granths" : "ई-ग्रंथालय व PDF पुस्तकें"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible">
              {isEn ? "PDF Library — Read Online & Download" : "PDF लाइब्रेरी — ऑनलाइन पढ़ें व डाउनलोड करें"}
            </h2>
            <p className="text-xs sm:text-sm text-spiritual-ivory/70 max-w-2xl mt-1">
              {isEn
                ? "Explore Bitak Saheb, Tartam Vani, and spiritual literature."
                : "श्री बीतक साहेब, तारतम वाणी और आध्यात्मिक पुस्तकें।"}
            </p>
          </div>

          <Link
            href="/library"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gold-300 hover:text-gold-100 group"
          >
            <span>{isEn ? "Open PDF Library" : "सम्पूर्ण लाइब्रेरी देखें"}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.slice(0, 3).map((book) => (
            <div
              key={book.id}
              className="spiritual-glass-card rounded-2xl p-5 border border-gold-500/30 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gold-300 font-semibold mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 uppercase text-[10px]">
                    {book.category.replace("_", " ")}
                  </span>
                  <span>{book.pages} {isEn ? "Pages" : "पृष्ठ"}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading mb-2">
                  {isEn ? book.titleEn || book.titleHi : book.titleHi}
                </h3>

                <p className="text-xs text-spiritual-ivory/70 line-clamp-3 leading-relaxed mb-4">
                  {isEn ? book.descriptionEn || book.descriptionHi : book.descriptionHi}
                </p>
              </div>

              <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between">
                <Link
                  href={`/library/reader/${book.id}`}
                  className="text-xs font-bold text-gold-300 hover:text-gold-100 inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEn ? "Read Online" : "ऑनलाइन पढ़ें"}</span>
                </Link>

                {isPdfAvailable(book.pdfUrl) ? (
                  <a
                    href={book.pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-gold-300 hover:text-gold-100 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-500/10 border border-gold-500/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </a>
                ) : (
                  <Link
                    href={`/library/reader/${book.id}`}
                    className="text-xs text-spiritual-ivory/60 hover:text-gold-300 inline-flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isEn ? "E-Book" : "ई-ग्रंथ"}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider symbol="🏛️" />

      {/* 6. Holy Dham Locations Section (Sadhauli Dham, Gondar Dham) */}
      <HolyDhamsSection />

      <SectionDivider symbol="📜" />

      {/* 7. Verbatim About Section (Editable by Admin) */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
