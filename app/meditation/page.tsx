"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Article, ChitwaniBook, ChitwaniVideo } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  Flower2,
  BookOpen,
  Play,
  FileText,
  Sparkles,
  Download,
  Calendar,
  Clock,
  ArrowRight,
  X,
  ExternalLink,
} from "lucide-react";

export default function MeditationPage() {
  const { language } = useI18n();
  const isEn = language === "en";
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "articles" | "books" | "videos") || "articles";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "books" | "videos">(initialTab);

  const [articles, setArticles] = useState<Article[]>(store.getChitwaniArticles());
  const [books, setBooks] = useState<ChitwaniBook[]>(store.getChitwaniBooks());
  const [videos, setVideos] = useState<ChitwaniVideo[]>(store.getChitwaniVideos());

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [playingVideo, setPlayingVideo] = useState<ChitwaniVideo | null>(null);

  // Meditation Breathing State
  const [isMeditating, setIsMeditating] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 mins default

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setArticles(store.getChitwaniArticles());
      setBooks(store.getChitwaniBooks());
      setVideos(store.getChitwaniVideos());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "articles" || tab === "books" || tab === "videos") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Breathing Guide Loop
  useEffect(() => {
    if (!isMeditating) return;
    const phases: ("inhale" | "hold" | "exhale")[] = ["inhale", "hold", "exhale"];
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % phases.length;
      setBreathPhase(phases[current]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMeditating]);

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Header Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Flower2 className="w-3.5 h-3.5" />
            {isEn ? "Chitwani & Dhyan Sanctuary" : "चितवनी एवं ध्यान साधना"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading mb-4">
            {isEn ? "Chitwani & Meditation Portal" : "चितवनी साधना — विधि, ग्रन्थ एवं वीडियो"}
          </h1>

          <p className="text-xs sm:text-base text-gold-muted/80 max-w-2xl mx-auto leading-relaxed mb-8">
            {isEn
              ? "Learn how to practice Chitwani through guided articles, download meditation books, and watch video instructions."
              : "परमधाम के २४ पक्षों एवं युगल स्वरूप के ध्यान की सम्पूर्ण विधि: ज्ञानवर्धक लेख, ध्यान ग्रन्थ एवं वीडियो मार्गदर्शिका।"}
          </p>

          {/* 3 Sub-Category Tabs */}
          <div className="flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-black/70 border border-gold-500/40 shadow-2xl backdrop-blur-xl gap-2 max-w-xl mx-auto">
            <button
              onClick={() => setActiveTab("articles")}
              className={`flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "articles"
                  ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
                  : "text-spiritual-ivory/75 hover:text-gold-300"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isEn ? "1. Chitwani Articles" : "१. चितवनी लेख"}</span>
            </button>

            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "books"
                  ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
                  : "text-spiritual-ivory/75 hover:text-gold-300"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isEn ? "2. Chitwani Books" : "२. चितवनी ग्रन्थ"}</span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`flex-1 min-w-[150px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "videos"
                  ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
                  : "text-spiritual-ivory/75 hover:text-gold-300"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isEn ? "3. Chitwani Videos" : "३. चितवनी वीडियो"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Meditation Breathing Guide Sanctuary */}
      <section className="py-10 max-w-4xl mx-auto px-4">
        <div className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-400/40 text-center relative overflow-hidden bg-gradient-to-b from-purple-950/20 via-spiritual-navy to-black/60">
          <div className="flex items-center justify-between pb-4 border-b border-gold-500/20 mb-6">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
              <Flower2 className="w-4 h-4" />
              {isEn ? "Live Breathing & Chitwani Timer" : "लाइव श्वास-प्रश्वास व ध्यान टाइमर"}
            </span>

            <button
              onClick={() => setIsMeditating(!isMeditating)}
              className="px-4 py-1.5 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform"
            >
              {isMeditating
                ? isEn
                  ? "Pause Dhyan"
                  : "रोकें"
                : isEn
                ? "Begin 10-Min Dhyan"
                : "१० मिनट ध्यान आरंभ करें"}
            </button>
          </div>

          {/* Pulsing Breathing Circle */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-gold-400/60 bg-gradient-to-tr from-gold-500/20 via-purple-500/20 to-amber-500/20 flex flex-col items-center justify-center shadow-2xl shadow-gold-900/40 transition-all duration-1000 ${
                isMeditating && breathPhase === "inhale"
                  ? "scale-125 border-gold-300 shadow-gold-lg"
                  : isMeditating && breathPhase === "hold"
                  ? "scale-115 border-purple-400"
                  : "scale-95 border-gold-500/40"
              }`}
            >
              <span className="text-2xl mb-1">🪷</span>
              <span className="text-xs sm:text-sm font-bold text-gold-200 uppercase tracking-widest font-mono">
                {isMeditating
                  ? breathPhase === "inhale"
                    ? isEn
                      ? "Inhale (पूरक)"
                      : "श्वास लें (Inhale)"
                    : breathPhase === "hold"
                    ? isEn
                      ? "Hold (कुम्भक)"
                      : "श्वास रोकें (Hold)"
                    : isEn
                    ? "Exhale (रेचक)"
                    : "श्वास छोड़ें (Exhale)"
                  : isEn
                  ? "Ready to Dhyan"
                  : "चितवनी ध्यान"}
              </span>
            </div>

            <p className="text-[11px] text-spiritual-ivory/70 mt-4 max-w-sm">
              {isEn
                ? "Breathe in rhythm, calm your thoughts, and immerse your mind in the lotus feet of Aksharatit Paramdham."
                : "श्वास की गति को शांत करें और मन को श्री राज-श्यामा जी के पावन युगल स्वरूप में स्थिर करें।"}
            </p>
          </div>
        </div>
      </section>

      {/* SUB-CATEGORY 1: CHITWANI ARTICLES */}
      {activeTab === "articles" && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading mb-2">
              {isEn ? "Chitwani Articles & How-To Guides" : "चितवनी लेख — ध्यान की विधि एवं सूत्र"}
            </h2>
            <p className="text-xs sm:text-sm text-gold-muted/80">
              {isEn
                ? "Articles written by the Ashram on how to do step-by-step Chitwani meditation."
                : "चितवनी कैसे करें, मन को कैसे एकाग्र करें, और परमधाम का साक्षात्कार कैसे करें।"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group cursor-pointer shadow-xl hover:border-gold-400 transition-all duration-300"
              >
                <div className="relative h-48 w-full bg-black overflow-hidden">
                  <Image
                    src={art.featuredImage || "/assets/paramdham-mandala.png"}
                    alt={art.titleHi}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-gold-500/30 text-[10px] font-bold text-gold-300 uppercase">
                    {art.readTime || "5 min read"}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading leading-snug mb-2">
                      {isEn ? art.titleEn || art.titleHi : art.titleHi}
                    </h3>
                    <p className="text-xs text-spiritual-ivory/75 line-clamp-3 leading-relaxed">
                      {isEn ? art.summaryEn || art.summaryHi : art.summaryHi}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between text-xs text-gold-300 font-semibold">
                    <span>{art.author}</span>
                    <span className="inline-flex items-center gap-1">
                      <span>{isEn ? "Read Guide" : "विधि पढ़ें"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SUB-CATEGORY 2: CHITWANI BOOKS */}
      {activeTab === "books" && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading mb-2">
              {isEn ? "Chitwani Books & Meditation Manuals" : "चितवनी ग्रन्थ — अध्ययन व डाउनलोड"}
            </h2>
            <p className="text-xs sm:text-sm text-gold-muted/80">
              {isEn
                ? "Download and study illustrated books and manuals on Asht Prahar and Paramdham Dhyan."
                : "अष्ट प्रहर लीला, रंगमहल एवं चितवनी साधना के पवित्र ग्रन्थ ऑनलाइन पढ़ें व डाउनलोड करें।"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {books.map((book) => (
              <div
                key={book.id}
                className="spiritual-glass-card rounded-3xl p-6 border border-gold-500/30 flex flex-col justify-between group shadow-xl hover:border-gold-400 transition-all"
              >
                <div className="flex gap-5">
                  <div className="relative w-28 h-36 rounded-xl overflow-hidden flex-shrink-0 bg-black border border-gold-500/30">
                    <Image
                      src={book.coverUrl || "/assets/paramdham-mandala.png"}
                      alt={book.titleHi}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 text-[10px] font-bold uppercase">
                      {book.pages} {isEn ? "Pages" : "पृष्ठ"}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-spiritual-ivory font-spiritual-heading">
                      {isEn ? book.titleEn || book.titleHi : book.titleHi}
                    </h3>
                    <p className="text-xs text-gold-muted/80">{book.author}</p>
                    <p className="text-xs text-spiritual-ivory/70 line-clamp-2">
                      {isEn ? book.descriptionEn : book.descriptionHi}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gold-500/20 flex items-center justify-between">
                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold inline-flex items-center gap-1.5 shadow-gold-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isEn ? "Read Online" : "ऑनलाइन पढ़ें"}</span>
                  </a>

                  <a
                    href={book.pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-spiritual-card border border-gold-500/30 text-gold-300 text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SUB-CATEGORY 3: CHITWANI VIDEOS */}
      {activeTab === "videos" && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading mb-2">
              {isEn ? "Chitwani Video Guides & Guided Sessions" : "चितवनी वीडियो मार्गदर्शिका"}
            </h2>
            <p className="text-xs sm:text-sm text-gold-muted/80">
              {isEn
                ? "Watch step-by-step video instructions on how to practice Chitwani meditation."
                : "पूज्य संतों के सान्निध्य में चितवनी अभ्यास के वीडियो सत्र।"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setPlayingVideo(vid)}
                className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group cursor-pointer shadow-xl hover:border-gold-400 transition-all"
              >
                <div className="relative h-48 w-full bg-black flex items-center justify-center">
                  <Image
                    src={`https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800`}
                    alt={vid.titleHi}
                    fill
                    className="object-cover opacity-75"
                  />
                  <div className="w-12 h-12 rounded-full bg-gold-gradient text-spiritual-dark flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform relative z-10">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-spiritual-ivory group-hover:text-gold-300 font-spiritual-heading mb-1">
                      {isEn ? vid.titleEn || vid.titleHi : vid.titleHi}
                    </h3>
                    <p className="text-xs text-gold-muted/80 mb-2">{vid.speaker}</p>
                    <p className="text-xs text-spiritual-ivory/70 line-clamp-2">
                      {isEn ? vid.descriptionEn : vid.descriptionHi}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gold-500/20 text-xs font-bold text-gold-300 flex items-center justify-between">
                    <span>{isEn ? "Watch Video Guide" : "वीडियो चलाएं"}</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="bg-spiritual-navy border-2 border-gold-400/50 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gold-500/15 text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Flower2 className="w-3.5 h-3.5" />
                <span>{isEn ? "Chitwani Guide" : "चितवनी साधना विधि"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight mb-2">
                {isEn ? selectedArticle.titleEn || selectedArticle.titleHi : selectedArticle.titleHi}
              </h2>
              <div className="text-xs text-gold-muted/80">
                {selectedArticle.author} • {selectedArticle.publishedAt}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-spiritual-ivory/90 leading-relaxed space-y-4 whitespace-pre-line font-devanagari">
              {isEn ? selectedArticle.contentEn || selectedArticle.contentHi : selectedArticle.contentHi}
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-spiritual-navy border-2 border-gold-400/50 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gold-500/20">
              <h3 className="text-base font-bold text-gold-gradient font-spiritual-heading truncate pr-4">
                {isEn ? playingVideo.titleEn || playingVideo.titleHi : playingVideo.titleHi}
              </h3>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1 rounded-full bg-gold-500/15 text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1`}
                title={playingVideo.titleHi}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
