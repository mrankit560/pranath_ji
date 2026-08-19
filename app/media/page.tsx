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

function MediaContent() {
  const { t, language } = useI18n();
  const isEn = language === "en";
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>(store.getVideos());
  const [selectedSubTab, setSelectedSubTab] = useState<"videos" | "youtube">("videos");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  useEffect(() => {
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
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Header Banner */}
      <section className="pt-32 pb-14 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/15 border border-red-400/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Play className="w-3.5 h-3.5 fill-current" />
            {isEn ? "Media Centre & Satsang Hub" : "मीडिया केंद्र एवं दिव्य सत्संग हब"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading mb-4">
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
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-spiritual-ivory/75 hover:text-red-400"
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>{isEn ? "2. Official YouTube Channel" : "२. आधिकारिक यूट्यूब चैनल"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* SUB-CATEGORY 1: CURATED VIDEOS */}
      {selectedSubTab === "videos" && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-gold-500/20">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              {videoCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? "bg-gold-gradient text-spiritual-dark font-bold shadow-gold-sm"
                      : "bg-spiritual-navy/80 border border-gold-500/30 text-spiritual-ivory/80 hover:text-gold-300"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search video or speaker..." : "वीडियो या वक्ता खोजें..."}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16 spiritual-glass-card rounded-3xl p-8 max-w-md mx-auto">
              <p className="text-sm text-spiritual-ivory/70">
                {isEn ? "No videos found in this category." : "इस श्रेणी में कोई वीडियो उपलब्ध नहीं है।"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setPlayingVideo(video)}
                  className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group cursor-pointer shadow-xl hover:border-gold-400 transition-all duration-300"
                >
                  {/* Thumbnail & Play Icon */}
                  <div className="relative h-52 w-full bg-black overflow-hidden flex items-center justify-center">
                    <Image
                      src={video.thumbnail || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800"}
                      alt={video.titleHi}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                    <div className="w-14 h-14 rounded-full bg-gold-gradient text-spiritual-dark flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform relative z-10">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>

                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white">
                      {video.duration}
                    </span>

                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/80 border border-gold-500/30 text-[10px] font-bold text-gold-300 uppercase">
                      {video.category}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading leading-snug mb-1">
                        {isEn ? video.titleEn || video.titleHi : video.titleHi}
                      </h3>

                      <p className="text-xs text-gold-muted/80 font-medium mb-2">
                        {video.speaker}
                      </p>

                      <p className="text-xs text-spiritual-ivory/70 line-clamp-2 leading-relaxed">
                        {isEn ? video.descriptionEn || video.descriptionHi : video.descriptionHi}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between text-xs font-bold text-gold-300">
                      <span>{isEn ? "Watch Video" : "वीडियो चलाएं"}</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SUB-CATEGORY 2: YOUTUBE CHANNEL DIRECT ACCESS */}
      {selectedSubTab === "youtube" && (
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="spiritual-glass-card rounded-3xl p-8 sm:p-12 border-2 border-red-500/40 text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-500 shadow-xl">
              <Youtube className="w-10 h-10" />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-spiritual-heading">
                {isEn
                  ? "Shri Nijanand Ashram Sadhauli Dham Official YouTube Channel"
                  : "श्री निजानंद आश्रम साढौली धाम आधिकारिक यूट्यूब चैनल"}
              </h2>
              <p className="text-xs sm:text-sm text-spiritual-ivory/80 leading-relaxed">
                {isEn
                  ? "Subscribe to watch 24/7 live satsang streaming, daily morning & evening prayers, Aarti, and discourses by revered saints."
                  : "दैनिक लाइव सत्संग, अखंड वाणी परायण, आरती एवं पूज्य संतों के प्रवचनों को यूट्यूब पर देखने हेतु हमारे आधिकारिक चैनल से जुड़ें।"}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://youtube.com/@sadhaulidham3424?si=l4lptsMtMc6pKrbC"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Youtube className="w-5 h-5" />
                <span>{isEn ? "Open YouTube Channel" : "यूट्यूब चैनल पर जाएं"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setSelectedSubTab("videos")}
                className="px-6 py-3.5 rounded-full border border-gold-500/40 text-gold-300 hover:bg-gold-500/15 text-xs sm:text-sm font-semibold transition-colors"
              >
                {isEn ? "Browse Curated Videos" : "प्रमुख वीडियो सूची देखें"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-spiritual-navy border-2 border-gold-400/50 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
              <h3 className="text-base sm:text-lg font-bold text-gold-gradient font-spiritual-heading truncate pr-4">
                {isEn ? playingVideo.titleEn || playingVideo.titleHi : playingVideo.titleHi}
              </h3>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1.5 rounded-full bg-gold-500/15 text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Responsive Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-gold-500/30">
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

export default function MediaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-spiritual-dark flex items-center justify-center text-gold-300">Loading...</div>}>
      <MediaContent />
    </Suspense>
  );
}
