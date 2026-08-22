"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { EventItem } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  Calendar as CalendarIcon,
  MapPin,
  Sparkles,
  Radio,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { formatEventDateRangeSafe } from "@/lib/utils/dateUtils";

export default function EventsPage() {
  const { t, language } = useI18n();
  const isEn = language === "en";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [nextEvent, setNextEvent] = useState<EventItem | null>(null);

  const [timing, setTiming] = useState<{
    status: "upcoming" | "live" | "ended";
    timeLeft: { days: number; hours: number; minutes: number; seconds: number } | null;
  }>({ status: "upcoming", timeLeft: null });

  useEffect(() => {
    setMounted(true);
    setEvents(store.getEvents());
    setNextEvent(store.getEarliestUpcomingEvent());
    const unsub = store.subscribe(() => {
      setEvents(store.getEvents());
      setNextEvent(store.getEarliestUpcomingEvent());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!nextEvent || !mounted) return;

    const updateTiming = () => {
      const now = Date.now();
      const start = new Date(nextEvent.startAt).getTime();
      const end = nextEvent.endAt ? new Date(nextEvent.endAt).getTime() : start + 6 * 3600 * 1000;

      if (now >= start && now <= end) {
        setTiming({ status: "live", timeLeft: null });
      } else if (now > end) {
        setTiming({ status: "ended", timeLeft: null });
      } else {
        const diff = Math.max(0, start - now);
        setTiming({
          status: "upcoming",
          timeLeft: {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          },
        });
      }
    };

    updateTiming();
    const interval = setInterval(updateTiming, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  const filteredEvents = events.filter(
    (e) => selectedFilter === "all" || e.eventType === selectedFilter
  );

  const formatEventDateRange = (startStr: string, endStr?: string) => {
    return formatEventDateRangeSafe(startStr, endStr, isEn);
  };

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <CalendarIcon className="w-3.5 h-3.5" />
            {isEn ? "Ashram Holy Events & Festivals" : "आश्रम कार्यक्रम एवं पावन महोत्सव"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-1 overflow-visible mb-3">
            {isEn ? "Utsav, Festivals & Live Events" : "पावन उत्सव, महोत्सव एवं लाइव कार्यक्रम"}
          </h1>

          <p className="text-sm sm:text-base text-gold-muted/80 max-w-xl mx-auto">
            {isEn
              ? "Upcoming spiritual gatherings, discourses, and festivals at Shri Nijanand Ashram Sadhauli Dham, Haridwar."
              : "श्री निजानंद आश्रम साढौली धाम में आयोजित होने वाले आगामी आध्यात्मिक आयोजन व महोत्सव।"}
          </p>
        </div>
      </section>

      {/* Dynamic Next Satsang Card with Clean Date Range & Venue (Countdown Removed) */}
      {nextEvent && (
        <section className="max-w-5xl mx-auto px-4 -mt-6 mb-12">
          <div className="spiritual-glass-card rounded-3xl p-6 sm:p-10 border-2 border-gold-400/50 bg-gradient-to-b from-spiritual-navy via-[#1c140e] to-spiritual-navy shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gold-radial pointer-events-none opacity-40" />

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              {isEn ? "Next Upcoming Holy Event" : "अगला पावन सत्संग / महोत्सव"}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible mb-6">
              {isEn ? nextEvent.titleEn || nextEvent.titleHi : nextEvent.titleHi}
            </h2>

            {/* Clean Date Range & Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6 text-left">
              {/* Event Date Range */}
              <div className="p-4 rounded-2xl bg-black/60 border border-gold-500/30 flex items-center gap-3.5 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gold-muted uppercase font-bold tracking-wider">
                    {isEn ? "Ashram Event Date Range" : "पावन महोत्सव तिथि"}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-spiritual-ivory">
                    {formatEventDateRange(nextEvent.startAt, nextEvent.endAt)}
                  </div>
                </div>
              </div>

              {/* Exact Location */}
              <div className="p-4 rounded-2xl bg-black/60 border border-gold-500/30 flex items-center gap-3.5 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-300 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gold-muted uppercase font-bold tracking-wider">
                    {isEn ? "Location / Venue" : "स्थान / आश्रम"}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-spiritual-ivory truncate" title={nextEvent.location}>
                    {nextEvent.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Status if Live or Concluded */}
            {timing.status === "live" && (
              <div className="py-3 px-6 rounded-2xl bg-red-600/20 border border-red-500/50 text-red-400 font-bold text-sm sm:text-base flex items-center justify-center gap-2 mb-4 animate-pulse max-w-md mx-auto">
                <Radio className="w-5 h-5" />
                <span>{isEn ? "🔴 Event is Live Now!" : "🔴 कार्यक्रम अभी जारी है (Live Now)"}</span>
              </div>
            )}
            {timing.status === "ended" && (
              <div className="py-3 px-6 rounded-2xl bg-gray-800/80 border border-gray-600/50 text-gray-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mb-4 max-w-md mx-auto">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <span>{isEn ? "✓ Event Concluded" : "✓ कार्यक्रम सम्पन्न (Ended)"}</span>
              </div>
            )}

            {nextEvent.livestreamUrl && timing.status === "live" && (
              <a
                href={nextEvent.livestreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs sm:text-sm shadow-gold-md hover:scale-105 transition-transform"
              >
                <Radio className="w-4 h-4" />
                <span>{isEn ? "Watch Live Stream Online" : "ऑनलाइन सत्संग से जुड़ें"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Events Filter & List */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 pb-4 mb-8 border-b border-gold-500/20">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            {[
              { id: "all", label: isEn ? "All Events" : "सभी कार्यक्रम" },
              { id: "festival", label: isEn ? "Festivals" : "उत्सव एवं महोत्सव" },
              { id: "satsang", label: isEn ? "Satsang & Katha" : "सत्संग व कथा" },
              { id: "meditation", label: isEn ? "Meditation Retreat" : "ध्यान शिविर" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-4 py-2 rounded-2xl font-semibold transition-all whitespace-nowrap ${
                  selectedFilter === f.id
                    ? "bg-gold-gradient text-spiritual-dark font-bold shadow-gold-sm"
                    : "bg-spiritual-card border border-gold-500/30 text-spiritual-ivory/70 hover:text-gold-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-gold-muted/80">
            {filteredEvents.length} {isEn ? "Events Listed" : "कार्यक्रम"}
          </div>
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const startDate = new Date(event.startAt);
            const now = Date.now();
            const start = startDate.getTime();
            const end = event.endAt ? new Date(event.endAt).getTime() : start + 6 * 3600 * 1000;
            const isLive = now >= start && now <= end;
            const isEnded = now > end;

            return (
              <div
                key={event.id}
                className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group hover:border-gold-400 transition-all duration-300 shadow-xl"
              >
                {/* Thumbnail Area with Illustrative Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-black">
                  <Image
                    src={event.image || "/assets/hero-reference-1.jpg"}
                    alt={event.titleHi}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-spiritual-navy via-transparent to-transparent" />

                  {/* Status / Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-gradient text-spiritual-dark text-[10px] font-bold uppercase tracking-wider shadow">
                      {event.eventType}
                    </span>
                    {isLive ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        LIVE
                      </span>
                    ) : isEnded ? (
                      <span className="px-2 py-0.5 rounded-full bg-gray-800/90 text-gray-300 text-[10px] font-semibold">
                        {isEn ? "Ended" : "सम्पन्न"}
                      </span>
                    ) : null}
                  </div>

                  {/* Illustrative Photo Indicator */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 border border-gold-500/20 text-[9px] text-spiritual-ivory/60 flex items-center gap-1">
                    <Camera className="w-2.5 h-2.5" />
                    <span>{isEn ? "Illustrative" : "सांकेतिक चित्र"}</span>
                  </div>
                </div>

                {/* Event Information */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading leading-snug">
                      {isEn ? event.titleEn || event.titleHi : event.titleHi}
                    </h3>

                    <div className="space-y-1.5 text-xs text-spiritual-ivory/80 pt-1">
                      {/* Date Range */}
                      <div className="flex items-center gap-2 text-gold-300 font-semibold">
                        <CalendarIcon className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                        <span>{formatEventDateRange(event.startAt, event.endAt)}</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-spiritual-ivory/70 truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <span className="truncate" title={event.location}>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-spiritual-ivory/70 line-clamp-2 pt-2 leading-relaxed">
                      {isEn ? event.descriptionEn || event.descriptionHi : event.descriptionHi}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between">
                    <span className="text-[11px] text-gold-muted/80">{event.speaker}</span>

                    {event.livestreamUrl && isLive && (
                      <a
                        href={event.livestreamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1 animate-pulse"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>{isEn ? "Live Stream" : "लाइव प्रसारण"}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
