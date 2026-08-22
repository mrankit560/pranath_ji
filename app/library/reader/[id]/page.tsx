"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Book } from "@/lib/data/types";
import {
  Maximize2,
  Minimize2,
  Download,
  Bookmark,
  ArrowLeft,
  BookOpen,
  Sparkles,
  FileText,
  CheckCircle,
  ExternalLink,
  Info,
  Clock,
  RotateCw,
} from "lucide-react";

export default function PDFReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18n();
  const isEn = language === "en";
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Tab: "pdf" (Real PDF Document) or "details" (Book Description & Review)
  const [activeTab, setActiveTab] = useState<"pdf" | "details">("pdf");
  const readerContainerRef = useRef<HTMLDivElement>(null);

  const resolvePdfUrl = (url?: string) => {
    if (!url || url === "#") return "";
    if (url.includes("archive.org/download/tartam-vani-sample/")) {
      const name = url.split("/").pop() || "shri-bitak-saheb.pdf";
      return `/assets/${name}`;
    }
    return url;
  };

  useEffect(() => {
    const updateReaderBook = () => {
      const found = store.getBookById(bookId);
      if (found) {
        const fixedPdfUrl = resolvePdfUrl(found.pdfUrl);
        setBook({ ...found, pdfUrl: fixedPdfUrl });
        const bookmarks = store.getBookmarks();
        setIsBookmarked(bookmarks.includes(bookId));
        if (!fixedPdfUrl || fixedPdfUrl === "#") {
          setActiveTab("details");
        }
      }
    };
    updateReaderBook();
    const unsub = store.subscribe(updateReaderBook);
    return () => unsub();
  }, [bookId]);

  // Fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  if (!book) {
    return (
      <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory flex items-center justify-center p-4">
        <div className="text-center spiritual-glass-card rounded-3xl p-8 max-w-md border border-gold-500/30">
          <BookOpen className="w-12 h-12 text-gold-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-spiritual-ivory font-spiritual-heading mb-2">
            {isEn ? "Loading Scripture..." : "पुस्तक लोड हो रही है..."}
          </h2>
          <Link
            href="/library"
            className="inline-block mt-4 px-6 py-2 rounded-full bg-gold-gradient text-spiritual-dark text-xs font-bold"
          >
            {isEn ? "Back to Library" : "लाइब्रेरी पर लौटें"}
          </Link>
        </div>
      </main>
    );
  }

  const cleanPdfUrl = resolvePdfUrl(book.pdfUrl);
  const hasPdf = Boolean(cleanPdfUrl && cleanPdfUrl.trim() !== "" && cleanPdfUrl !== "#");

  // Native Fullscreen API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (readerContainerRef.current?.requestFullscreen) {
        readerContainerRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  const handleBookmark = () => {
    const isNowBookmarked = store.toggleBookmark(book.id);
    setIsBookmarked(isNowBookmarked);
    setToastMessage(
      isNowBookmarked
        ? isEn ? "Saved to your sacred bookmarks" : "पुस्तकालय बुकमार्क में सुरक्षित किया गया"
        : isEn ? "Removed from bookmarks" : "बुकमार्क हटाया गया"
    );
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div
      ref={readerContainerRef}
      className={`min-h-screen bg-[#050403] text-spiritual-ivory flex flex-col justify-between ${
        isFullscreen ? "fixed inset-0 z-50 overflow-hidden bg-black" : ""
      }`}
    >
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gold-gradient text-spiritual-dark text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reader Navigation Header */}
      <header className="bg-spiritual-navy/95 border-b border-gold-500/30 px-3 sm:px-6 py-2.5 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Back button & Book Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/library")}
              className="p-2 rounded-xl border border-gold-500/20 text-gold-300 hover:bg-gold-500/10 flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold"
              title="Back to Library"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isEn ? "Library" : "लाइब्रेरी"}</span>
            </button>

            <div className="truncate">
              <h1 className="text-xs sm:text-sm font-bold text-gold-200 truncate font-spiritual-heading">
                {isEn ? book.titleEn || book.titleHi : book.titleHi}
              </h1>
              <span className="text-[10px] text-spiritual-ivory/60 truncate block">
                {isEn ? book.authorEn : book.authorHi} • {book.pages} {isEn ? "Pages" : "पृष्ठ"}
              </span>
            </div>
          </div>

          {/* Center/Right: PDF View vs Details Tab, Download, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* View Mode Tabs */}
            <div className="flex items-center bg-black/60 border border-gold-500/30 rounded-xl p-0.5 text-xs">
              {hasPdf && (
                <button
                  onClick={() => setActiveTab("pdf")}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === "pdf"
                      ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm font-bold"
                      : "text-spiritual-ivory/70 hover:text-gold-300"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isEn ? "PDF Document" : "मूल PDF ग्रन्थ"}</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab("details")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "details"
                    ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm font-bold"
                    : "text-spiritual-ivory/70 hover:text-gold-300"
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>{isEn ? "Overview & Review" : "पुस्तक परिचय व समीक्षा"}</span>
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked
                  ? "bg-gold-500 text-spiritual-dark border-gold-400"
                  : "text-spiritual-ivory/70 border-gold-500/20 hover:text-gold-300"
              }`}
              title="Bookmark this scripture"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Direct PDF Download Button */}
            {hasPdf && (
              <a
                href={cleanPdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
                title={isEn ? "Download PDF file" : "PDF फाइल डाउनलोड करें"}
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">{isEn ? "Download PDF" : "PDF डाउनलोड"}</span>
              </a>
            )}

            {/* Maximize / Minimize Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reader"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 bg-[#0a0705]">
        {activeTab === "pdf" && hasPdf ? (
          /* ========================================================================= */
          /* 1. ACTUAL PDF DOCUMENT VIEWER (Directly rendering the real uploaded PDF) */
          /* ========================================================================= */
          <div className="w-full max-w-6xl h-[82vh] sm:h-[86vh] rounded-2xl overflow-hidden border border-gold-500/40 shadow-2xl bg-[#1e1e1e] flex flex-col relative">
            {/* Mobile Helper Bar */}
            <div className="sm:hidden bg-spiritual-navy border-b border-gold-500/30 px-3 py-2 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-gold-300 font-semibold flex items-center gap-1">
                <span>📱</span>
                <span>{isEn ? "Mobile PDF Reader" : "मोबाइल PDF व्यूअर"}</span>
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={cleanPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-gold-gradient text-spiritual-dark text-[11px] font-bold flex items-center gap-1 shadow-gold-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{isEn ? "Full Tab" : "पूरा खोलें"}</span>
                </a>
                <a
                  href={cleanPdfUrl}
                  download
                  className="px-2.5 py-1 rounded-lg bg-gold-500/20 border border-gold-400/40 text-gold-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>{isEn ? "Save" : "डाउनलोड"}</span>
                </a>
              </div>
            </div>

            {/* Multi-Engine PDF Embed (Object + Iframe Fallback) */}
            <object
              data={`${cleanPdfUrl}#toolbar=1&navpanes=1&statusbar=1`}
              type="application/pdf"
              className="w-full flex-1 border-0 bg-[#2b2b2b]"
            >
              <iframe
                src={`${cleanPdfUrl}#toolbar=1&navpanes=1&statusbar=1`}
                title={isEn ? book.titleEn || book.titleHi : book.titleHi}
                className="w-full h-full border-0 bg-[#2b2b2b]"
              />
            </object>

            {/* PDF Viewer Bottom Control Strip */}
            <div className="px-4 py-2.5 bg-[#120e0a] border-t border-gold-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-spiritual-ivory/80">
                <FileText className="w-4 h-4 text-gold-400" />
                <span>
                  {isEn ? "Rendering official PDF document" : "मूल PDF दस्तावेज़ से पृष्ठ प्रदर्शित हो रहे हैं"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={cleanPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-gold-500/20 border border-gold-400/30 text-gold-300 text-xs font-semibold hover:bg-gold-500 hover:text-spiritual-dark flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isEn ? "Open in Full Tab" : "नई विंडो में खोलें"}</span>
                </a>

                <a
                  href={cleanPdfUrl}
                  download
                  className="px-3 py-1.5 rounded-lg bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isEn ? "Save PDF" : "डाउनलोड करें"}</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. BOOK OVERVIEW, RESEARCH REVIEW & SPECIFIC SCRIPTURE METADATA           */
          /* ========================================================================= */
          <div className="w-full max-w-4xl spiritual-glass-card rounded-3xl p-6 sm:p-10 border border-gold-500/30 space-y-8 my-4 shadow-2xl">
            {/* Book Header Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gold-500/20">
              <div className="relative w-36 h-52 rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-black flex-shrink-0">
                <Image
                  src={book.coverUrl || "/assets/paramdham-mandala.png"}
                  alt={isEn ? book.titleEn || book.titleHi : book.titleHi}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-gold-400" />
                  <span>{book.category === "bitak_saheb" ? "श्री बीतक साहेब" : book.category === "tartam_vani" ? "तारतम वाणी" : "आध्यात्मिक साहित्य"}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-spiritual-heading leading-tight">
                  {isEn ? book.titleEn || book.titleHi : book.titleHi}
                </h1>

                <div className="text-xs sm:text-sm text-gold-muted/90 font-semibold">
                  {isEn ? "Author / Commentator: " : "लेखक / टीकाकार: "}
                  <span className="text-spiritual-ivory">{isEn ? book.authorEn : book.authorHi}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-spiritual-ivory/70 pt-1">
                  <span>📖 {book.pages} {isEn ? "Pages" : "पृष्ठ"}</span>
                  <span>🌐 {book.language === "hi" ? "हिन्दी संस्करण" : "English Edition"}</span>
                  {hasPdf ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {isEn ? "Original PDF Attached" : "मूल PDF संलग्न है"}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {isEn ? "PDF In Digitization" : "PDF संकलन प्रक्रियाधीन"}
                    </span>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  {hasPdf ? (
                    <>
                      <button
                        onClick={() => setActiveTab("pdf")}
                        className="px-5 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{isEn ? "View Real PDF" : "मूल PDF दस्तावेज़ पढ़ें"}</span>
                      </button>

                      <a
                        href={book.pdfUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/30 text-gold-300 text-xs font-semibold hover:bg-gold-500/20 flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isEn ? "Download PDF" : "PDF डाउनलोड करें"}</span>
                      </a>
                    </>
                  ) : (
                    <div className="text-xs text-amber-300 bg-amber-500/15 border border-amber-400/30 px-4 py-2 rounded-xl">
                      {isEn
                        ? "This scripture's PDF is being prepared by Sadhauli Dham research council."
                        : "इस पावन ग्रन्थ का मूल PDF साढौली धाम शोध पीठ द्वारा संकलित किया जा रहा है।"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Book Description */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold-400" />
                <span>{isEn ? "Book Description & Summary" : "पुस्तक विवरण एवं सारांश"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-spiritual-ivory/85 leading-relaxed bg-black/40 p-5 rounded-2xl border border-gold-500/20 font-devanagari">
                {isEn ? book.descriptionEn || book.descriptionHi : book.descriptionHi || "श्री निजानंद आश्रम साढौली धाम द्वारा प्रकाशित पावन आध्यात्मिक ग्रन्थ।"}
              </p>
            </div>

            {/* Admin Book Review / Blog */}
            {(book.bookBlogHi || book.bookBlogEn) && (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? "Research Review & Commentary" : "शोध पीठ समीक्षा व विशेष आलेख"}</span>
                </h2>
                <div className="text-xs sm:text-sm text-spiritual-ivory/90 leading-relaxed bg-gold-500/10 p-5 rounded-2xl border border-gold-500/30 font-devanagari whitespace-pre-line">
                  {isEn ? book.bookBlogEn || book.bookBlogHi : book.bookBlogHi}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
