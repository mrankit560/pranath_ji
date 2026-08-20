"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import {
  Search,
  X,
  BookOpen,
  Video,
  Music,
  Calendar,
  FileText,
  Compass,
  ArrowRight,
} from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { language, t } = useI18n();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Results
  const scriptures = store
    .getScriptures()
    .filter(
      (s) =>
        s.titleHi.toLowerCase().includes(q) ||
        s.titleEn.toLowerCase().includes(q) ||
        s.descriptionHi.toLowerCase().includes(q) ||
        s.descriptionEn.toLowerCase().includes(q)
    );

  const books = store
    .getBooks()
    .filter(
      (b) =>
        b.titleHi.toLowerCase().includes(q) ||
        b.titleEn.toLowerCase().includes(q) ||
        b.authorHi.toLowerCase().includes(q) ||
        b.authorEn.toLowerCase().includes(q)
    );

  const videos = store
    .getVideos()
    .filter(
      (v) =>
        v.titleHi.toLowerCase().includes(q) ||
        v.titleEn.toLowerCase().includes(q) ||
        v.speaker.toLowerCase().includes(q)
    );

  const audio = store
    .getAudioTracks()
    .filter(
      (a) =>
        a.titleHi.toLowerCase().includes(q) ||
        a.titleEn.toLowerCase().includes(q) ||
        a.speaker.toLowerCase().includes(q)
    );

  const articles = store
    .getArticles()
    .filter(
      (art) =>
        art.titleHi.toLowerCase().includes(q) ||
        art.titleEn.toLowerCase().includes(q) ||
        art.contentHi.toLowerCase().includes(q) ||
        art.contentEn.toLowerCase().includes(q)
    );

  const events = store
    .getEvents()
    .filter(
      (e) =>
        e.titleHi.toLowerCase().includes(q) ||
        e.titleEn.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );

  const dhams = store
    .getDhams()
    .filter(
      (d) =>
        d.nameHi.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.descriptionHi.toLowerCase().includes(q) ||
        d.descriptionEn.toLowerCase().includes(q)
    );

  const hasResults =
    scriptures.length > 0 ||
    books.length > 0 ||
    videos.length > 0 ||
    audio.length > 0 ||
    articles.length > 0 ||
    events.length > 0 ||
    dhams.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-spiritual-dark/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-3xl bg-spiritual-navy border border-gold-500/40 rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-gold-500/30 flex items-center gap-3">
          <Search className="w-5 h-5 text-gold-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder", "तारतम वाणी, पुस्तकें, वीडियो, लेख खोजें...")}
            className="w-full bg-transparent text-sm sm:text-base text-spiritual-ivory placeholder-spiritual-ivory/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-spiritual-ivory/50 hover:text-gold-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-gold-500/20 text-xs font-semibold text-gold-300 hover:bg-gold-500/10 ml-2"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-black/40 border-b border-gold-500/20 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: "all", label: t("search.all", "सभी") },
            { id: "scriptures", label: t("search.categories.scriptures", "शास्त्र") },
            { id: "books", label: t("search.categories.books", "पुस्तकें") },
            { id: "videos", label: t("search.categories.videos", "वीडियो") },
            { id: "audio", label: t("search.categories.audio", "ऑडियो") },
            { id: "articles", label: t("search.categories.articles", "लेख") },
            { id: "events", label: t("search.categories.events", "इवेंट्स") },
            { id: "dhams", label: language === "hi" ? "धाम" : "Dhams" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                filter === item.id
                  ? "bg-gold-gradient text-spiritual-dark font-bold shadow-gold-sm"
                  : "text-spiritual-ivory/70 hover:text-gold-300 bg-spiritual-card"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!q ? (
            <div className="text-center py-12 text-spiritual-ivory/50 text-xs sm:text-sm">
              <Compass className="w-8 h-8 mx-auto text-gold-500/40 mb-2" />
              {t("search.placeholder", "खोजने के लिए शब्द लिखें...")}
            </div>
          ) : !hasResults ? (
            <div className="text-center py-12 text-spiritual-ivory/50 text-xs sm:text-sm">
              {t("search.noResults", "कोई परिणाम नहीं मिला। कृपया अन्य शब्द खोजें।")}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Scriptures */}
              {(filter === "all" || filter === "scriptures") && scriptures.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {t("search.categories.scriptures", "शास्त्र एवं ग्रन्थ")} ({scriptures.length})
                  </h4>
                  <div className="space-y-1.5">
                    {scriptures.map((s) => (
                      <Link
                        key={s.id}
                        href="/library/tartam-vani"
                        onClick={onClose}
                        className="block p-2.5 rounded-xl bg-spiritual-card hover:bg-gold-500/15 border border-gold-500/20 transition-colors"
                      >
                        <div className="text-xs sm:text-sm font-bold text-spiritual-ivory">
                          {language === "hi" ? s.titleHi : s.titleEn}
                        </div>
                        <div className="text-[11px] text-spiritual-ivory/60 truncate">
                          {language === "hi" ? s.descriptionHi : s.descriptionEn}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Books */}
              {(filter === "all" || filter === "books") && books.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    {t("search.categories.books", "पुस्तकें")} ({books.length})
                  </h4>
                  <div className="space-y-1.5">
                    {books.map((b) => (
                      <Link
                        key={b.id}
                        href={`/library/reader/${b.id}`}
                        onClick={onClose}
                        className="block p-2.5 rounded-xl bg-spiritual-card hover:bg-gold-500/15 border border-gold-500/20 transition-colors"
                      >
                        <div className="text-xs sm:text-sm font-bold text-spiritual-ivory">
                          {language === "hi" ? b.titleHi : b.titleEn}
                        </div>
                        <div className="text-[11px] text-spiritual-ivory/60 truncate">
                          {language === "hi" ? b.authorHi : b.authorEn} • {b.pages} {t("library.pages", "पृष्ठ")}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {(filter === "all" || filter === "videos") && videos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    {t("search.categories.videos", "वीडियो")} ({videos.length})
                  </h4>
                  <div className="space-y-1.5">
                    {videos.map((v) => (
                      <Link
                        key={v.id}
                        href="/media"
                        onClick={onClose}
                        className="block p-2.5 rounded-xl bg-spiritual-card hover:bg-emerald-500/15 border border-emerald-500/20 transition-colors"
                      >
                        <div className="text-xs sm:text-sm font-bold text-spiritual-ivory">
                          {language === "hi" ? v.titleHi : v.titleEn}
                        </div>
                        <div className="text-[11px] text-spiritual-ivory/60">
                          {v.speaker} • {v.duration}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio */}
              {(filter === "all" || filter === "audio") && audio.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5" />
                    {t("search.categories.audio", "ऑडियो")} ({audio.length})
                  </h4>
                  <div className="space-y-1.5">
                    {audio.map((a) => (
                      <Link
                        key={a.id}
                        href="/media"
                        onClick={onClose}
                        className="block p-2.5 rounded-xl bg-spiritual-card hover:bg-purple-500/15 border border-purple-500/20 transition-colors"
                      >
                        <div className="text-xs sm:text-sm font-bold text-spiritual-ivory">
                          {language === "hi" ? a.titleHi : a.titleEn}
                        </div>
                        <div className="text-[11px] text-spiritual-ivory/60">
                          {a.speaker} • {a.duration}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {(filter === "all" || filter === "events") && events.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {t("search.categories.events", "इवेंट्स")} ({events.length})
                  </h4>
                  <div className="space-y-1.5">
                    {events.map((e) => (
                      <Link
                        key={e.id}
                        href="/events"
                        onClick={onClose}
                        className="block p-2.5 rounded-xl bg-spiritual-card hover:bg-amber-500/15 border border-amber-500/20 transition-colors"
                      >
                        <div className="text-xs sm:text-sm font-bold text-spiritual-ivory">
                          {language === "hi" ? e.titleHi : e.titleEn}
                        </div>
                        <div className="text-[11px] text-spiritual-ivory/60">
                          {e.location}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Holy Dhams */}
              {(filter === "all" || filter === "dhams") && dhams.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    {language === "hi" ? "पावन धाम व आश्रम" : "Holy Dhams & Ashrams"} ({dhams.length})
                  </h4>
                  <div className="space-y-1.5">
                    {dhams.map((d) => (
                      <a
                        key={d.id}
                        href={d.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="block p-2.5 rounded-xl bg-spiritual-card hover:bg-gold-500/15 border border-gold-500/20 transition-colors"
                      >
                        <div className="text-xs sm:text-sm font-bold text-spiritual-ivory flex items-center justify-between">
                          <span>{language === "hi" ? d.nameHi : d.nameEn}</span>
                          <span className="text-[10px] text-amber-300 font-normal">Google Maps ↗</span>
                        </div>
                        <div className="text-[11px] text-spiritual-ivory/60">
                          {d.location}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
