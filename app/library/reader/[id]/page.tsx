"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Book } from "@/lib/data/types";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Bookmark,
  ArrowLeft,
  BookOpen,
  Sparkles,
  RotateCw,
} from "lucide-react";

export default function PDFReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18n();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const found = store.getBookById(bookId);
    if (found) {
      setBook(found);
      // Check last read page
      const history = store.getReadingHistory().find((h) => h.bookId === bookId);
      if (history) {
        setCurrentPage(history.page);
      }
    }
  }, [bookId]);

  useEffect(() => {
    if (book) {
      // Auto save reading progress
      store.saveReadingProgress(
        book.id,
        language === "hi" ? book.titleHi : book.titleEn,
        currentPage
      );
    }
  }, [book, currentPage, language]);

  if (!book) {
    return (
      <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory flex items-center justify-center p-4">
        <div className="text-center spiritual-glass-card rounded-3xl p-8 max-w-md border border-gold-500/30">
          <BookOpen className="w-12 h-12 text-gold-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-spiritual-ivory font-spiritual-heading mb-2">
            {language === "hi" ? "पुस्तक लोड हो रही है..." : "Loading Scripture..."}
          </h2>
          <Link
            href="/library"
            className="inline-block mt-4 px-6 py-2 rounded-full bg-gold-gradient text-spiritual-dark text-xs font-bold"
          >
            लाइब्रेरी पर लौटें
          </Link>
        </div>
      </main>
    );
  }

  const totalPages = book.pages || 100;

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleZoomIn = () => {
    setZoomLevel((z) => Math.min(z + 15, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((z) => Math.max(z - 15, 60));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setToastMessage(
      isBookmarked
        ? "बुकमार्क हटाया गया"
        : `पृष्ठ ${currentPage} बुकमार्क में सुरक्षित किया गया`
    );
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <main
      className={`min-h-screen bg-[#050403] text-spiritual-ivory flex flex-col justify-between ${
        isFullscreen ? "p-0" : ""
      }`}
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-gold-gradient text-spiritual-dark text-xs font-bold shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Reader Top Navbar */}
      <header className="bg-spiritual-navy/95 border-b border-gold-500/30 px-4 py-3 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/library")}
              className="p-1.5 rounded-lg border border-gold-500/20 text-gold-300 hover:bg-gold-500/10 flex-shrink-0"
              title="Back to Library"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="truncate">
              <h1 className="text-xs sm:text-sm font-bold text-gold-200 truncate font-spiritual-heading">
                {language === "hi" ? book.titleHi : book.titleEn}
              </h1>
              <span className="text-[10px] text-spiritual-ivory/60 truncate">
                {language === "hi" ? book.authorHi : book.authorEn}
              </span>
            </div>
          </div>

          {/* Reader Controls Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-black/50 border border-gold-500/30 rounded-xl p-0.5 text-xs">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-spiritual-ivory/70 hover:text-gold-300"
                title={t("reader.zoomOut", "छोटा करें")}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono text-gold-300">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-spiritual-ivory/70 hover:text-gold-300"
                title={t("reader.zoomIn", "बड़ा करें")}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked
                  ? "bg-gold-500 text-spiritual-dark border-gold-400"
                  : "text-spiritual-ivory/70 border-gold-500/20 hover:text-gold-300"
              }`}
              title={t("reader.bookmarkAdded", "बुकमार्क")}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Download */}
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </a>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-gold-500/20 text-spiritual-ivory/70 hover:text-gold-300"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Reader View Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 bg-[#0a0705]">
        <div
          className="bg-[#181310] border border-gold-500/40 rounded-2xl shadow-2xl p-8 sm:p-14 max-w-3xl w-full min-h-[75vh] flex flex-col justify-between text-spiritual-ivory transition-all relative"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
        >
          {/* Subtle ornate watermark emblem in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Image
              src="/assets/logo-emblem.png"
              alt="Watermark"
              width={350}
              height={350}
              className="object-contain"
            />
          </div>

          {/* Scripture Page Header */}
          <div className="border-b border-gold-500/30 pb-4 flex items-center justify-between text-xs text-gold-400 font-devanagari">
            <span>श्री निजानंद आश्रम साढौली धाम, हरिद्वार</span>
            <span>{language === "hi" ? book.titleHi : book.titleEn}</span>
            <span>पृष्ठ {currentPage} / {totalPages}</span>
          </div>

          {/* Simulated Scripture Content for Page */}
          <div className="py-8 space-y-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-gold-400/80 font-mono">
                अध्याय {Math.ceil(currentPage / 5)} • प्रकरण {currentPage}
              </span>
              <h2 className="text-2xl font-bold text-gold-gradient font-spiritual-heading mt-1">
                {language === "hi"
                  ? `दिव्य आत्म बोध एवं परब्रह्म साक्षात्कार`
                  : `Divine Soul Realization & Brahm Awakening`}
              </h2>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-gold-500/20 text-center space-y-4">
              <p className="text-lg sm:text-xl font-spiritual-heading text-gold-200 leading-relaxed">
                “प्रणमूँ श्री नवतन पुरी, धाम धनी को नाम।<br />
                दूजो प्रणमूँ सद्गुरु, जे कीन्हे पूरन काम॥”
              </p>
              <p className="text-xs sm:text-sm text-spiritual-ivory/80 leading-relaxed font-devanagari">
                भावार्थ: प्रथम नवतनपुरी धाम और धामधनी श्री राज श्यामा जी के पावन नाम का वंदन करते हैं। पश्चात सद्गुरु महाराज को प्रणाम करते हैं जिन्होंने हमारे समस्त आध्यात्मिक मनोरथ पूर्ण किए।
              </p>
            </div>

            <div className="text-xs sm:text-sm text-spiritual-ivory/80 leading-relaxed space-y-3 font-devanagari">
              <p>
                अनन्त श्री प्राणनाथ जी की वाणी जीव को माया के मोह-जाल से मुक्त कर अखंड परमधाम का साक्षात्कार कराती है। मनुष्य जीवन का सर्वोत्तम फल यही है कि वह अपने आत्मस्वरूप को पहचानकर परब्रह्म के चरणों में समर्पित हो जाए।
              </p>
              <p>
                सुख सीतल करे संसार, प्रेम सेवा से पाओगे पार। तारतम ज्ञान का प्रकाश अंतरात्मा के अंधकार को मिटाकर शाश्वत शांति का संचार करता है।
              </p>
            </div>
          </div>

          {/* Scripture Page Footer */}
          <div className="border-t border-gold-500/20 pt-4 flex items-center justify-between text-xs text-spiritual-ivory/50">
            <span>© साढौली धाम डिजिटल ग्रंथालय</span>
            <span className="font-mono text-gold-400 font-bold">~ {currentPage} ~</span>
            <span>अमृत वाणी</span>
          </div>
        </div>
      </div>

      {/* Reader Bottom Navigation Bar */}
      <footer className="bg-spiritual-navy/95 border-t border-gold-500/30 px-4 py-3 backdrop-blur-xl sticky bottom-0 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-spiritual-card border border-gold-500/30 text-xs font-bold text-spiritual-ivory hover:text-gold-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t("reader.prevPage", "पिछला")}</span>
          </button>

          {/* Page Counter & Direct Jump */}
          <div className="flex items-center gap-2 text-xs font-mono text-gold-300">
            <span>{currentPage}</span>
            <span className="opacity-50">/</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-spiritual-card border border-gold-500/30 text-xs font-bold text-spiritual-ivory hover:text-gold-300 disabled:opacity-40"
          >
            <span>{t("reader.nextPage", "अगला")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}
