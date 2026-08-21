"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Video } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  Play,
  Youtube,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  X,
  Radio,
  Share2,
} from "lucide-react";

function MediaParamSync({ onSubTabChange }: { onSubTabChange: (tab: "videos" | "youtube") => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "youtube" || tab === "videos") {
      onSubTabChange(tab);
    }
  }, [searchParams, onSubTabChange]);
  return null;
}

export default function MediaPage() {
  const { t, language } = useI18n();
  const isEn = language === "en";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>(() => store.getVideos());
  const [selectedSubTab, setSelectedSubTab] = useState<"videos" | "youtube">("videos");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  useEffect(() => {
    setVideos(store.getVideos());
    const unsub = store.subscribe(() => {
      setVideos(store.getVideos());
    });
    return () => unsub();
  }, []);

  const videoCategories = [
    { id: "all", label: isEn ? "All Videos" : "सभी वीडियो" },
    { id: "satsang", label: isEn ? "Satsang" : "सत्संग" },
    { id: "pravachan", label: isEn ? "Pravachan" : "प्रवचन" },
    { id: "vaniGayan", label: isEn ? "Vani Gayan" : "वाणी गायन" },
    { id: "bhajan", label: isEn ? "Bhajan" : "भजन" },
    { id: "meditation", label: isEn ? "Meditation" : "ध्यान" },
  ];

  const filteredVideos = videos.filter((video) => {
    const matchesCategory =
      selectedCategory === "all" || video.category === selectedCategory;
    const title = (isEn ? video.titleEn : video.titleHi) || "";
    const speaker = video.speaker || "";
    const q = searchQuery.toLowerCase();
    const matchesSearch = title.toLowerCase().includes(q) || speaker.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Suspense fallback={null}>
        <MediaParamSync onSubTabChange={setSelectedSubTab} />
      </Suspense>

      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Header Banner */}
      <section className="pt-32 pb-14 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/15 border border-red-400/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Play className="w-3.5 h-3.5 fill-current" />
            {isEn ? "Media Centre & Satsang Hub" : "मीडिया केंद्र एवं दिव्य सत्संग हब"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-1 overflow-visible mb-4">
            {isEn ? "Media Centre — Videos & YouTube" : "मीडिया केंद्र — पावन वीडियो एवं यूट्यूब"}
          </h1>

          <p className="text-xs sm:text-base text-gold-muted/80 max-w-2xl mx-auto leading-relaxed mb-8">
            {isEn
              ? "Watch important curated video satsangs, live discourses, and connect with our official YouTube channel."
              : "साढौली धाम से दैनिक सत्संग, अमृतवाणी प्रवचन एवं आधिकारिक यूट्यूब चैनल के माध्यम से दिव्य दर्शन।"}
          </p>

          {/* Sub-Category Switcher: 1. Videos | 2. YouTube Channel */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-black/70 border border-gold-500/40 shadow-2xl backdrop-blur-xl gap-2">
            <button
              onClick={() => setSelectedSubTab("videos")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                selectedSubTab === "videos"
                  ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
                  : "text-spiritual-ivory/75 hover:text-gold-300"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isEn ? "1. Curated Videos" : "१. प्रमुख वीडियो सत्संग"}</span>
            </button>

            <button
              onClick={() => setSelectedSubTab("youtube")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                selectedSubTab === "youtube"
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                  : "text-spiritual-ivory/75 hover:text-red-400"
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>{isEn ? "2. Official YouTube Channel ↗" : "२. आधिकारिक यूट्यूब चैनल ↗"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedSubTab === "videos" ? (
          <div>
            {/* Category Filter Chips & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-gold-500/20">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {videoCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? "bg-gold-gradient text-spiritual-dark font-bold shadow-gold-sm scale-105"
                        : "bg-spiritual-card border border-gold-500/25 text-spiritual-ivory/80 hover:text-gold-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search by title/speaker..." : "शीर्षक या वक्ता खोजें..."}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory placeholder-spiritual-ivory/40 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Video Cards Grid */}
            {filteredVideos.length === 0 ? (
              <div className="spiritual-glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-gold-500/30 space-y-4">
                <Play className="w-12 h-12 text-gold-400/50 mx-auto" />
                <p className="text-sm text-spiritual-ivory/80">
                  {isEn ? "No videos found in this category." : "इस श्रेणी में कोई वीडियो उपलब्ध नहीं है।"}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="px-5 py-2 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold hover:bg-gold-500 hover:text-spiritual-dark"
                >
                  {isEn ? "Reset Filter" : "सभी वीडियो देखें"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group hover:border-gold-400 transition-all duration-300 shadow-xl"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => setPlayingVideo(video)}
                      className="relative h-52 w-full bg-black cursor-pointer overflow-hidden group/thumb"
                    >
                      <Image
                        src={video.thumbnail || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800"}
                        alt={isEn ? video.titleEn || video.titleHi : video.titleHi}
                        fill
                        className="object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        </div>
                      </div>

                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 text-[10px] font-bold text-spiritual-ivory">
                        {video.duration}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gold-muted/80 mb-2 font-semibold">
                          <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 text-[10px] uppercase">
                            {video.category}
                          </span>
                          <span>{video.speaker}</span>
                        </div>

                        <h3 className="text-base font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading leading-snug line-clamp-2">
                          {isEn ? video.titleEn || video.titleHi : video.titleHi}
                        </h3>

                        <p className="text-xs text-spiritual-ivory/70 line-clamp-2 mt-2 leading-relaxed">
                          {isEn ? video.descriptionEn || video.descriptionHi : video.descriptionHi}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between">
                        <button
                          onClick={() => setPlayingVideo(video)}
                          className="text-xs font-bold text-gold-300 hover:text-gold-100 flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isEn ? "Watch Video" : "वीडियो देखें"}</span>
                        </button>

                        <a
                          href={`https://youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-red-400 hover:underline flex items-center gap-1"
                        >
                          <Youtube className="w-3.5 h-3.5" />
                          <span>YouTube</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Official YouTube Channel Tab */
          <div className="spiritual-glass-card rounded-3xl p-8 sm:p-12 border-2 border-red-500/40 text-center max-w-3xl mx-auto space-y-6 shadow-2xl">
            <div className="w-20 h-20 rounded-3xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 mx-auto">
              <Youtube className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading">
                {isEn ? "Official YouTube Channel — Sadhauli Dham" : "साढौली धाम आधिकारिक यूट्यूब चैनल"}
              </h2>
              <p className="text-xs sm:text-sm text-spiritual-ivory/80 max-w-xl mx-auto leading-relaxed">
                {isEn
                  ? "Subscribe to our YouTube channel for live daily satsang broadcasts, Tartam Vani discourses, festival celebrations, and aarti."
                  : "दैनिक लाइव सत्संग, अमृतवाणी गायन, गुरु पूर्णिमा व जन्माष्टमी महोत्सव के सजीव प्रसारण हेतु हमारे आधिकारिक यूट्यूब चैनल से जुड़ें।"}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://youtube.com/@sadhaulidham3424?si=l4lptsMtMc6pKrbC"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-950/50 hover:scale-105 transition-transform"
              >
                <Youtube className="w-5 h-5" />
                <span>{isEn ? "Open YouTube Channel" : "यूट्यूब चैनल खोलें"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Video Modal Player */}
      {playingVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={() => setPlayingVideo(null)}
        >
          <div
            className="spiritual-glass-card rounded-3xl p-4 sm:p-6 max-w-4xl w-full border-2 border-gold-400/50 shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gold-500/30">
              <h3 className="text-base sm:text-lg font-bold text-gold-gradient font-spiritual-heading truncate">
                {isEn ? playingVideo.titleEn || playingVideo.titleHi : playingVideo.titleHi}
              </h3>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1.5 rounded-full text-spiritual-ivory/70 hover:text-white"
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

            <div className="flex items-center justify-between text-xs text-spiritual-ivory/80 pt-2">
              <span>{playingVideo.speaker}</span>
              <a
                href={`https://youtube.com/watch?v=${playingVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{isEn ? "Watch on YouTube" : "यूट्यूब पर खोलें"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
