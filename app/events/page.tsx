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
  Clock,
  MapPin,
  Sparkles,
  Radio,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function EventsPage() {
  const { t, language } = useI18n();
  const isEn = language === "en";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>(store.getEvents());
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [nextEvent, setNextEvent] = useState<EventItem | null>(store.getEarliestUpcomingEvent());

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setEvents(store.getEvents());
      setNextEvent(store.getEarliestUpcomingEvent());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!nextEvent) return;

    const calculateTime = () => {
      const difference = new Date(nextEvent.startAt).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  const filteredEvents = events.filter(
    (e) => selectedFilter === "all" || e.eventType === selectedFilter
  );

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

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading mb-3">
            {t("events.title", "आश्रम कार्यक्रम एवं उत्सव")}
          </h1>

          <p className="text-sm sm:text-base text-gold-muted/80 max-w-xl mx-auto">
            {t(
              "events.subtitle",
              "श्री निजानंद आश्रम साढौली धाम में आयोजित होने वाले आगामी आध्यात्मिक आयोजन"
            )}
          </p>
        </div>
      </section>

      {/* Dynamic Next Satsang Countdown Card with Exact Date, Time & Venue */}
      {nextEvent && (
        <section className="max-w-5xl mx-auto px-4 -mt-6 mb-12">
          <div className="spiritual-glass-card rounded-3xl p-6 sm:p-10 border-2 border-gold-400/50 bg-gradient-to-b from-spiritual-navy via-[#1c140e] to-spiritual-navy shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gold-radial pointer-events-none opacity-40" />

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              {isEn ? "Next Upcoming Holy Event" : "अगला पावन सत्संग / महोत्सव"}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading mb-4">
              {isEn ? nextEvent.titleEn || nextEvent.titleHi : nextEvent.titleHi}
            </h2>

            {/* Exact Date, Exact Time & Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-6 text-left">
              {/* Exact Date */}
              <div className="p-3 rounded-2xl bg-black/60 border border-gold-500/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold-500/15 text-gold-300 flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gold-muted/80 uppercase font-semibold">
                    {isEn ? "Exact Date" : "निश्चित दिनांक"}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-spiritual-ivory truncate">
                    {new Date(nextEvent.startAt).toLocaleDateString(isEn ? "en-US" : "hi-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Exact Time */}
              <div className="p-3 rounded-2xl bg-black/60 border border-gold-500/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gold-muted/80 uppercase font-semibold">
                    {isEn ? "Exact Time" : "निश्चित समय"}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-spiritual-ivory truncate font-mono">
                    {nextEvent.timeStr || (nextEvent.hasSpecificTime !== false
                      ? new Date(nextEvent.startAt).toLocaleTimeString(isEn ? "en-US" : "hi-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }) + (nextEvent.endAt ? ` – ${new Date(nextEvent.endAt).toLocaleTimeString(isEn ? "en-US" : "hi-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}` : "")
                      : (isEn ? "All Day Event" : "पूरे दिन का आयोजन"))}
                  </div>
                </div>
              </div>

              {/* Exact Location */}
              <div className="p-3 rounded-2xl bg-black/60 border border-gold-500/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-300 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gold-muted/80 uppercase font-semibold">
                    {isEn ? "Location" : "स्थान"}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-spiritual-ivory truncate" title={nextEvent.location}>
                    {nextEvent.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Grid */}
            {timeLeft ? (
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mb-6">
                {[
                  { label: isEn ? "Days" : "दिन", val: timeLeft.days },
                  { label: isEn ? "Hours" : "घंटे", val: timeLeft.hours },
                  { label: isEn ? "Minutes" : "मिनट", val: timeLeft.minutes },
                  { label: isEn ? "Seconds" : "सेकंड", val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-4 rounded-2xl bg-black/70 border border-gold-500/30 flex flex-col items-center shadow-inner"
                  >
                    <span className="text-2xl sm:text-4xl font-extrabold text-gold-gradient font-mono">
                      {item.val.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs text-spiritual-ivory/60 mt-1 uppercase font-semibold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-emerald-400 font-bold text-lg flex items-center justify-center gap-2">
                <Radio className="w-5 h-5 animate-pulse" />
                <span>{isEn ? "🔴 Event is Live Now!" : "🔴 कार्यक्रम अभी जारी है (Live Now)"}</span>
              </div>
            )}

            {nextEvent.livestreamUrl && (
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
              { id: "all", label: t("events.filterAll", "सभी आयोजन") },
              { id: "satsang", label: t("events.filterSatsang", "सत्संग") },
              { id: "festival", label: t("events.filterFestival", "उत्सव / पर्व") },
              { id: "meditation", label: t("events.filterMeditation", "साधना शिविर") },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === f.id
                    ? "bg-gold-gradient text-spiritual-dark font-bold shadow-gold-sm"
                    : "bg-spiritual-card border border-gold-500/20 text-spiritual-ivory/70 hover:text-gold-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const startDate = new Date(event.startAt);

            return (
              <div
                key={event.id}
                className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group hover:border-gold-400 transition-all duration-300 shadow-xl"
              >
                {/* Thumbnail Area */}
                <div className="relative h-48 w-full overflow-hidden bg-black">
                  <Image
                    src={event.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800"}
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
                    {event.status === "live" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        LIVE
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Information */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading leading-snug">
                      {isEn ? event.titleEn || event.titleHi : event.titleHi}
                    </h3>

                    <div className="space-y-1.5 text-xs text-spiritual-ivory/80 pt-1">
                      {/* Exact Date */}
                      <div className="flex items-center gap-2 text-gold-300 font-semibold">
                        <CalendarIcon className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                        <span>
                          {startDate.toLocaleDateString(isEn ? "en-US" : "hi-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Exact Time */}
                      <div className="flex items-center gap-2 font-mono text-amber-300 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>
                          {event.timeStr || (event.hasSpecificTime !== false
                            ? startDate.toLocaleTimeString(isEn ? "en-US" : "hi-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : (isEn ? "All Day Event" : "पूरे दिन का आयोजन"))}
                        </span>
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

                    {event.livestreamUrl && (
                      <a
                        href={event.livestreamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1"
                      >
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
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
