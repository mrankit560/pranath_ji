"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Scripture, Chapter } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  BookOpen,
  Bookmark,
  ChevronRight,
  Sparkles,
  Search,
  Type,
  Maximize2,
  Download,
  Share2,
  FileText,
  Clock,
} from "lucide-react";
import { isPdfAvailable } from "@/app/library/page";

export default function TartamVaniPage() {
  const { t, language } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const scriptures = store.getScriptures();

  const [selectedGranth, setSelectedGranth] = useState<Scripture>(scriptures[0]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const currentChapter: Chapter | undefined = selectedGranth.chapters[selectedChapterIndex];

  const toggleVerseBookmark = (verseKey: string) => {
    if (bookmarkedVerses.includes(verseKey)) {
      setBookmarkedVerses(bookmarkedVerses.filter((k) => k !== verseKey));
    } else {
      setBookmarkedVerses([...bookmarkedVerses, verseKey]);
    }
  };

  const fontSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const filteredVerses = currentChapter?.verses.filter((v) =>
    searchTerm
      ? v.textHi.includes(searchTerm) ||
        v.meaningHi.includes(searchTerm) ||
        v.textEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.meaningEn?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory flex flex-col justify-between">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            {language === "hi" ? "तारतम वाणी अध्ययन" : "Tartam Vani Scripture Reader"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-spiritual-heading mb-2">
            {language === "hi" ? "तारतम वाणी — १४ पवित्र ग्रन्थ" : "Tartam Vani — 14 Holy Granths"}
          </h1>
          <p className="text-xs sm:text-sm text-spiritual-ivory/70">
            {language === "hi"
              ? "परमधाम का दिव्य साक्षात्कार कराने वाली अनन्त श्री प्राणनाथ जी की अमर वाणी"
              : "The sacred transcendental verses revealing the eternal kingdom of Paramdham"}
          </p>
        </div>

        {/* 3-Column / Responsive Reading Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Granths Selection (3 cols) */}
          <div className="lg:col-span-3 spiritual-glass-card rounded-2xl p-4 border border-gold-500/30 space-y-3 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-gold-500/20">
              <span>{language === "hi" ? "१४ ग्रन्थ सूची" : "14 Granths List"}</span>
              <span className="text-[10px] text-spiritual-ivory/50">१४ ग्रन्थ</span>
            </h3>

            <div className="space-y-1.5">
              {scriptures.map((granth) => {
                const isSelected = granth.id === selectedGranth.id;
                return (
                  <button
                    key={granth.id}
                    onClick={() => {
                      setSelectedGranth(granth);
                      setSelectedChapterIndex(0);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-gold-500/25 text-gold-200 border border-gold-400/50 shadow-gold-sm"
                        : "text-spiritual-ivory/70 hover:bg-gold-500/10 hover:text-gold-300"
                    }`}
                  >
                    <div className="truncate">
                      <span className="text-[10px] opacity-60 mr-1.5 font-mono">
                        #{granth.granthNumber}
                      </span>
                      <span>{language === "hi" ? granth.titleHi : granth.titleEn}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-gold-300" : "opacity-40"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Column: Scripture Reading View (9 cols) */}
          <div className="lg:col-span-9 spiritual-glass-card rounded-2xl p-6 sm:p-8 border border-gold-500/30 space-y-6">
            {/* Granth Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-500/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold">
                    ग्रन्थ #{selectedGranth.granthNumber}
                  </span>
                  <span className="text-xs text-spiritual-ivory/60">
                    {selectedGranth.chaptersCount} प्रकरण • {selectedGranth.versesCount} चौपाई
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-spiritual-heading">
                  {language === "hi" ? selectedGranth.titleHi : selectedGranth.titleEn}
                </h2>
                <p className="text-xs sm:text-sm text-spiritual-ivory/75 mt-1">
                  {language === "hi" ? selectedGranth.descriptionHi : selectedGranth.descriptionEn}
                </p>
              </div>

              {/* Controls: Font Size & PDF Link */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {/* Font Switch */}
                <div className="flex items-center bg-black/50 border border-gold-500/30 rounded-xl p-1 text-xs">
                  <span className="px-2 text-spiritual-ivory/50">
                    <Type className="w-3.5 h-3.5" />
                  </span>
                  <button
                    onClick={() => setFontSize("sm")}
                    className={`px-2 py-0.5 rounded ${fontSize === "sm" ? "bg-gold-500 text-black font-bold" : "text-spiritual-ivory/70"}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize("lg")}
                    className={`px-2 py-0.5 rounded ${fontSize === "lg" ? "bg-gold-500 text-black font-bold" : "text-spiritual-ivory/70"}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize("xl")}
                    className={`px-2 py-0.5 rounded ${fontSize === "xl" ? "bg-gold-500 text-black font-bold" : "text-spiritual-ivory/70"}`}
                  >
                    A+
                  </button>
                </div>

                {isPdfAvailable(selectedGranth.pdfUrl) ? (
                  <a
                    href={selectedGranth.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-gold-500/30 text-xs font-semibold text-gold-300 hover:bg-gold-500/20 flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </a>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-400/20 text-gold-300 text-xs font-medium flex items-center gap-1.5" title={language === "hi" ? "मूल ग्रन्थ PDF शीघ्र अपलोड होगी" : "Scripture PDF coming soon"}>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === "hi" ? "PDF जल्द उपलब्ध" : "PDF Coming Soon"}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Chapter Selection Pill Tabs */}
            {selectedGranth.chapters.length > 0 ? (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {selectedGranth.chapters.map((ch, idx) => (
                  <button
                    key={ch.chapterNum}
                    onClick={() => setSelectedChapterIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-all ${
                      selectedChapterIndex === idx
                        ? "bg-gold-gradient text-spiritual-dark font-bold shadow-gold-sm"
                        : "bg-black/40 border border-gold-500/20 text-spiritual-ivory/70 hover:text-gold-300"
                    }`}
                  >
                    {language === "hi" ? ch.titleHi : ch.titleEn}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Verses Container */}
            {currentChapter && currentChapter.verses.length > 0 ? (
              <div className="space-y-6 pt-2">
                {filteredVerses?.map((verse) => {
                  const verseKey = `${selectedGranth.id}-${currentChapter.chapterNum}-${verse.verseNum}`;
                  const isBookmarked = bookmarkedVerses.includes(verseKey);

                  return (
                    <div
                      key={verse.verseNum}
                      className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-gold-500/25 space-y-4 hover:border-gold-400/50 transition-colors relative"
                    >
                      {/* Verse Header */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold font-mono">
                          चौपाई ॥ {verse.verseNum} ॥
                        </span>

                        <button
                          onClick={() => toggleVerseBookmark(verseKey)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isBookmarked
                              ? "bg-gold-500 text-spiritual-dark border-gold-400"
                              : "text-spiritual-ivory/40 border-gold-500/20 hover:text-gold-300"
                          }`}
                          title="Bookmark Verse"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Sacred Verse Text (Chaupai) */}
                      <div
                        className={`font-spiritual-heading font-medium text-gold-200 leading-relaxed whitespace-pre-line ${fontSizeClasses[fontSize]}`}
                      >
                        {verse.textHi}
                      </div>

                      {/* English Transliteration */}
                      {verse.textEn && (
                        <div className="text-xs sm:text-sm text-gold-muted/80 italic whitespace-pre-line font-sans pt-1">
                          {verse.textEn}
                        </div>
                      )}

                      {/* Meaning / Commentary in Hindi */}
                      <div className="pt-3 border-t border-gold-500/20 text-xs sm:text-sm text-spiritual-ivory/85 leading-relaxed">
                        <strong className="text-gold-300 font-semibold mr-1">भावार्थ:</strong>
                        {verse.meaningHi}
                      </div>

                      {/* English Meaning */}
                      {verse.meaningEn && (
                        <div className="text-xs sm:text-sm text-spiritual-ivory/70 leading-relaxed font-sans">
                          <strong className="text-gold-300 font-semibold mr-1">Meaning:</strong>
                          {verse.meaningEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 p-8 rounded-2xl bg-black/40 border border-gold-500/20 space-y-4">
                <BookOpen className="w-10 h-10 mx-auto text-gold-400/40" />
                <h3 className="text-lg font-bold text-spiritual-ivory font-spiritual-heading">
                  {language === "hi" ? "डिजिटल संस्करण संलग्न है" : "Full Scripture Available in PDF"}
                </h3>
                <p className="text-xs sm:text-sm text-spiritual-ivory/70 max-w-md mx-auto">
                  {language === "hi"
                    ? "इस ग्रन्थ का संपूर्ण पाठ एवं टीका हमारे इन-ब्राउज़र PDF रीडर अथवा डाउनलोड सेक्शन में उपलब्ध है।"
                    : "The complete scripture text and commentary is available in our in-browser PDF reader or downloadable archives."}
                </p>
                <div className="pt-2">
                  <a
                    href={selectedGranth.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-gradient text-spiritual-dark text-xs font-bold shadow-gold-sm hover:scale-105 transition-transform"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{language === "hi" ? "पूरा ग्रन्थ PDF में पढ़ें" : "Read Complete PDF"}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
