"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { EventItem } from "@/lib/data/types";
import {
  Calendar,
  MapPin,
  Sparkles,
  Radio,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export const HeroUpcomingEvents: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [mounted, setMounted] = useState(false);
  const [nextEvent, setNextEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    setMounted(true);
    setNextEvent(store.getEarliestUpcomingEvent());
    const unsub = store.subscribe(() => {
      setNextEvent(store.getEarliestUpcomingEvent());
    });
    return () => unsub();
  }, []);

  if (!mounted || !nextEvent) {
    return null;
  }

  // Format date range (startAt to endAt)
  const startDate = new Date(nextEvent.startAt);
  const endDate = nextEvent.endAt ? new Date(nextEvent.endAt) : null;

  const monthsEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthsHi = [
    "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];
  const daysEn = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  const daysHi = [
    "रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"
  ];

  let formattedDateRangeStr = "";
  if (isEn) {
    if (
      endDate &&
      endDate.getTime() !== startDate.getTime() &&
      (endDate.getDate() !== startDate.getDate() || endDate.getMonth() !== startDate.getMonth())
    ) {
      formattedDateRangeStr = `${startDate.getDate()} ${monthsEn[startDate.getMonth()]} ${startDate.getFullYear()} (${daysEn[startDate.getDay()]}) – ${endDate.getDate()} ${monthsEn[endDate.getMonth()]} ${endDate.getFullYear()} (${daysEn[endDate.getDay()]})`;
    } else {
      formattedDateRangeStr = `${startDate.getDate()} ${monthsEn[startDate.getMonth()]} ${startDate.getFullYear()} (${daysEn[startDate.getDay()]})`;
    }
  } else {
    if (
      endDate &&
      endDate.getTime() !== startDate.getTime() &&
      (endDate.getDate() !== startDate.getDate() || endDate.getMonth() !== startDate.getMonth())
    ) {
      formattedDateRangeStr = `${startDate.getDate()} ${monthsHi[startDate.getMonth()]} ${startDate.getFullYear()} (${daysHi[startDate.getDay()]}) – ${endDate.getDate()} ${monthsHi[endDate.getMonth()]} ${endDate.getFullYear()} (${daysHi[endDate.getDay()]})`;
    } else {
      formattedDateRangeStr = `${startDate.getDate()} ${monthsHi[startDate.getMonth()]} ${startDate.getFullYear()} (${daysHi[startDate.getDay()]})`;
    }
  }

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
        {/* Left Section: Event Badge, Title, Date Range & Venue */}
        <div className="flex-1 space-y-3.5">
          {/* Top Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/50 text-gold-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              {isEn ? "Latest Upcoming Ashram Event" : "आगामी पावन आश्रम महोत्सव व सत्संग"}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold uppercase">
              {isEn
                ? nextEvent.eventType.toUpperCase()
                : nextEvent.eventType.toLowerCase() === "meditation"
                ? "चितवनी ध्यान"
                : nextEvent.eventType.toLowerCase() === "satsang"
                ? "सत्संग कार्यक्रम"
                : nextEvent.eventType.toLowerCase() === "festival"
                ? "पावन महोत्सव"
                : "आश्रम कार्यक्रम"}
            </span>
          </div>

          {/* Event Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible">
            {isEn ? nextEvent.titleEn || nextEvent.titleHi : nextEvent.titleHi}
          </h2>

          {/* Date Range and Location Detail Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Date Range */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/50 border border-gold-500/20">
              <div className="w-9 h-9 rounded-xl bg-gold-500/15 text-gold-300 flex items-center justify-center flex-shrink-0 border border-gold-500/30">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gold-muted/80 uppercase font-bold tracking-wider">
                  {isEn ? "Event Date Range" : "कार्यक्रम पावन तिथि"}
                </div>
                <div className="text-xs sm:text-sm font-bold text-spiritual-ivory truncate">
                  {formattedDateRangeStr}
                </div>
              </div>
            </div>

            {/* 2. Location */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/50 border border-gold-500/20">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-300 flex items-center justify-center flex-shrink-0 border border-red-500/30">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gold-muted/80 uppercase font-bold tracking-wider">
                  {isEn ? "Location / Venue" : "स्थान / पावन धाम"}
                </div>
                <div className="text-xs sm:text-sm font-bold text-spiritual-ivory truncate" title={nextEvent.location}>
                  {nextEvent.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex flex-col sm:flex-row items-center lg:items-end justify-center gap-3 lg:border-l lg:border-gold-500/20 lg:pl-6 flex-shrink-0">
          {nextEvent.livestreamUrl && (
            <a
              href={nextEvent.livestreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-all animate-pulse"
            >
              <Radio className="w-4 h-4" />
              <span>{isEn ? "Live Stream" : "लाइव सत्संग"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <Link
            href="/events"
            className="px-5 py-3 rounded-2xl bg-gold-gradient text-spiritual-dark text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-gold-sm hover:scale-105 transition-transform"
          >
            <span>{isEn ? "All Ashram Events" : "सभी कार्यक्रम देखें"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
