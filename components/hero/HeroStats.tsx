"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { BookOpen, Video, Users, Globe, Calendar, Clock, Sparkles } from "lucide-react";

export const HeroStats: React.FC = () => {
  const { t, language } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(store.getStats());
  const [nextEvent, setNextEvent] = useState(store.getNextUpcomingEvent());
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    const unsub = store.subscribe(() => {
      setStats(store.getStats());
      setNextEvent(store.getNextUpcomingEvent());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!nextEvent || !mounted) return;

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
  }, [nextEvent, mounted]);

  return (
    <div className="w-full rounded-2xl border border-gold-500/30 bg-spiritual-navy/85 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 relative overflow-hidden">
      {/* Subtle gold corner ornaments */}
      <div className="absolute top-2 left-2 text-[10px] text-gold-400/50">❖</div>
      <div className="absolute top-2 right-2 text-[10px] text-gold-400/50">❖</div>
      <div className="absolute bottom-2 left-2 text-[10px] text-gold-400/50">❖</div>
      <div className="absolute bottom-2 right-2 text-[10px] text-gold-400/50">❖</div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center divide-y md:divide-y-0 md:divide-x divide-gold-500/20">
        {/* Stat 1: Books */}
        <Link
          href="/library"
          className="flex items-center gap-3 px-2 pt-2 md:pt-0 group hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-300 group-hover:scale-105 transition-transform flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-gold-gradient leading-none">
              {stats.pdfBooksCount}+
            </div>
            <div className="text-[11px] sm:text-xs text-spiritual-ivory/70 font-medium">
              {t("hero.statBooks", "PDF पुस्तकें")}
            </div>
          </div>
        </Link>

        {/* Stat 2: Videos */}
        <Link
          href="/media"
          className="flex items-center gap-3 px-2 pt-2 md:pt-0 group hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform flex-shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-gold-gradient leading-none">
              {stats.videosCount}+
            </div>
            <div className="text-[11px] sm:text-xs text-spiritual-ivory/70 font-medium">
              {t("hero.statVideos", "वीडियो")}
            </div>
          </div>
        </Link>

        {/* Stat 3: Seekers */}
        <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
          <div className="w-10 h-10 rounded-xl bg-spiritual-maroon/40 border border-gold-500/30 flex items-center justify-center text-gold-300 flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-gold-gradient leading-none">
              {stats.seekersCount.toLocaleString()}+
            </div>
            <div className="text-[11px] sm:text-xs text-spiritual-ivory/70 font-medium">
              {t("hero.statSeekers", "साधक जुड़े")}
            </div>
          </div>
        </div>

        {/* Stat 4: Countries */}
        <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
          <div className="w-10 h-10 rounded-xl bg-spiritual-purple/30 border border-gold-500/30 flex items-center justify-center text-purple-300 flex-shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-gold-gradient leading-none">
              {stats.countriesCount}+
            </div>
            <div className="text-[11px] sm:text-xs text-spiritual-ivory/70 font-medium">
              {t("hero.statCountries", "देशों में उपलब्ध")}
            </div>
          </div>
        </div>

        {/* Stat 5 / Upcoming Event Countdown */}
        <Link
          href="/events"
          className="col-span-2 md:col-span-1 flex items-center gap-3 px-2 pt-3 md:pt-0 bg-gold-500/10 rounded-xl p-2 border border-gold-400/30 hover:bg-gold-500/20 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gold-gradient text-spiritual-dark flex items-center justify-center font-bold flex-shrink-0 shadow-gold-sm group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-gold-300 font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              {t("hero.upcomingEvent", "Upcoming Event")}
            </div>
            {nextEvent ? (
              <div>
                <div className="text-xs font-bold text-spiritual-ivory truncate">
                  {language === "hi" ? nextEvent.titleHi : nextEvent.titleEn}
                </div>
                {timeLeft ? (
                  <div className="text-[11px] text-gold-400 font-mono font-semibold" suppressHydrationWarning>
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-400 font-bold">
                    🔴 Live Now
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-spiritual-ivory/60">
                {t("hero.noUpcoming", "कोई आगामी कार्यक्रम नहीं")}
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};
