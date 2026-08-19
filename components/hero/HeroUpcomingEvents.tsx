"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { EventItem } from "@/lib/data/types";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Radio,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export const HeroUpcomingEvents: React.FC = () => {
  const { t, language } = useI18n();
  const isEn = language === "en";
  const [nextEvent, setNextEvent] = useState<EventItem | null>(store.getEarliestUpcomingEvent());
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
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

  if (!nextEvent) {
    return (
      <div className="w-full rounded-3xl border border-gold-500/30 bg-spiritual-navy/90 backdrop-blur-2xl p-6 shadow-2xl text-center">
        <p className="text-xs sm:text-sm text-spiritual-ivory/70">
          {isEn
            ? "No upcoming event scheduled currently. Check back soon for announcements."
            : "वर्तमान में कोई आगामी कार्यक्रम निर्धारित नहीं है। शीघ्र ही नवीन सूचनाएँ यहाँ उपलब्ध होंगी।"}
        </p>
      </div>
    );
  }

  // Format exact start and end date/time
  const startDate = new Date(nextEvent.startAt);

  // Exact date formatting
  const formattedDateStr = startDate.toLocaleDateString(isEn ? "en-US" : "hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Time string
  const displayTime = nextEvent.timeStr || (nextEvent.hasSpecificTime !== false
    ? startDate.toLocaleTimeString(isEn ? "en-US" : "hi-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + (nextEvent.endAt ? ` – ${new Date(nextEvent.endAt).toLocaleTimeString(isEn ? "en-US" : "hi-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}` : "")
    : (isEn ? "All Day Event" : "पूरे दिन का आयोजन"));

  return (
    <div className="w-full rounded-3xl border-2 border-gold-400/40 bg-gradient-to-r from-spiritual-navy/95 via-[#1A120C]/95 to-spiritual-navy/95 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl shadow-black/90 relative overflow-hidden">
      {/* Background Soft Golden Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Traditional Corner Motifs */}
      <div className="absolute top-3 left-3 text-xs text-gold-400/60 font-serif select-none">❖</div>
      <div className="absolute top-3 right-3 text-xs text-gold-400/60 font-serif select-none">❖</div>
      <div className="absolute bottom-3 left-3 text-xs text-gold-400/60 font-serif select-none">❖</div>
      <div className="absolute bottom-3 right-3 text-xs text-gold-400/60 font-serif select-none">❖</div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Section: Event Badge, Title, Exact Date, Time & Venue */}
        <div className="flex-1 space-y-3.5">
          {/* Top Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/50 text-gold-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              {isEn ? "Latest Upcoming Ashram Event" : "आगामी पावन आश्रम महोत्सव व सत्संग"}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold uppercase">
              {nextEvent.eventType}
            </span>
          </div>

          {/* Event Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-snug">
            {isEn ? nextEvent.titleEn || nextEvent.titleHi : nextEvent.titleHi}
          </h2>

          {/* Exact Date, Exact Time, and Location Detail Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* 1. Exact Date */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/50 border border-gold-500/20">
              <div className="w-8 h-8 rounded-lg bg-gold-500/15 text-gold-300 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gold-muted/80 uppercase font-semibold">
                  {isEn ? "Exact Date" : "निश्चित दिनांक"}
                </div>
                <div className="text-xs font-bold text-spiritual-ivory truncate">
                  {formattedDateStr}
                </div>
              </div>
            </div>

            {/* 2. Exact Time */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/50 border border-gold-500/20">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gold-muted/80 uppercase font-semibold">
                  {isEn ? "Exact Time" : "समय"}
                </div>
                <div className="text-xs font-bold text-spiritual-ivory truncate font-mono">
                  {displayTime}
                </div>
              </div>
            </div>

            {/* 3. Location */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/50 border border-gold-500/20">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-300 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gold-muted/80 uppercase font-semibold">
                  {isEn ? "Location / Venue" : "स्थान / पावन धाम"}
                </div>
                <div className="text-xs font-bold text-spiritual-ivory truncate" title={nextEvent.location}>
                  {nextEvent.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Real-Time Countdown & Actions */}
        <div className="flex flex-col items-center lg:items-end justify-center gap-3.5 lg:border-l lg:border-gold-500/20 lg:pl-6">
          {/* Time Remaining Indicator / Countdown */}
          <div className="w-full text-center lg:text-right">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gold-400 mb-1.5 flex items-center justify-center lg:justify-end gap-1.5">
              <Clock className="w-3 h-3 text-gold-400" />
              <span>{isEn ? "Time Remaining" : "आरंभ होने में शेष समय"}</span>
            </div>

            {timeLeft ? (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-xs mx-auto lg:mx-0">
                {[
                  { label: isEn ? "Days" : "दिन", val: timeLeft.days },
                  { label: isEn ? "Hours" : "घंटे", val: timeLeft.hours },
                  { label: isEn ? "Min" : "मिनट", val: timeLeft.minutes },
                  { label: isEn ? "Sec" : "सेकंड", val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-black/70 border border-gold-500/30 flex flex-col items-center min-w-[50px] shadow-inner"
                  >
                    <span className="text-lg sm:text-xl font-black text-gold-gradient font-mono leading-none">
                      {item.val.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[9px] text-spiritual-ivory/60 uppercase font-medium mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 font-bold text-xs flex items-center justify-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>{isEn ? "🔴 Event is Live Now!" : "🔴 कार्यक्रम अभी जारी है (Live Now)"}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 w-full">
            {nextEvent.livestreamUrl && (
              <a
                href={nextEvent.livestreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{isEn ? "Watch Live Stream" : "लाइव सत्संग देखें"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <Link
              href="/events"
              className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
            >
              <span>{isEn ? "All Ashram Events" : "सभी कार्यक्रम देखें"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
