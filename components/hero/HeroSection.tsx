"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { HeroUpcomingEvents } from "./HeroUpcomingEvents";
import { Paramdham3DMandala } from "@/components/3d/Paramdham3DMandala";
import { BookOpen, FileText, Play, Flower2, Sparkles, Compass } from "lucide-react";

export const HeroSection: React.FC = () => {
  const { t, language } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle floating particle embers animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fade: number;
    }[] = [];

    const numParticles = Math.min(width > 768 ? 45 : 20, 50);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        fade: Math.random() * 0.01 + 0.005,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fade;

        if (p.opacity > 0.85 || p.opacity < 0.15) {
          p.fade = -p.fade;
        }

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 208, 111, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#F4D06F";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen pt-24 pb-12 overflow-hidden flex flex-col justify-between">
      {/* Background Layer with Reference Atmosphere */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-35 filter blur-[2px] scale-105"
        style={{ backgroundImage: "url('/assets/hero-reference-2.jpg')" }}
      />

      {/* Cinematic Golden Radial Lighting & Vignette */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-spiritual-dark via-spiritual-dark/80 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-spiritual-dark/95 via-spiritual-dark/70 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 -z-10 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] -z-10 rounded-full bg-gold-400/15 blur-[120px] pointer-events-none" />

      {/* Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6">
          {/* Left Column: Emblem, Titles & 4 Action Cards */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            {/* Luminous Sadhauli Dham Emblem */}
            <div className="relative mb-3 group cursor-pointer">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-gold-400/30 to-amber-600/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 animate-pulse-glow" />
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <Image
                  src="/assets/logo-emblem.png"
                  alt="श्री निजानंद आश्रम साढौली धाम परमधाम प्रतीक"
                  width={128}
                  height={128}
                  priority
                  className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(244,208,111,0.6)] transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Main Showstopper Title: SADHAULI DHAM / साढौली धाम (Optimized Size & Spacing) */}
            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-gold-gradient font-spiritual-heading tracking-wide leading-tight mt-1 mb-3 py-1 overflow-visible drop-shadow-[0_4px_25px_rgba(244,208,111,0.35)]">
              {language === "hi" ? "साढौली धाम" : "Sadhauli Dham"}
            </h1>

            {/* Subtitle with Ornamental Flourish: श्री प्राणनाथ जी वाणी */}
            <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-gold-300 mb-4">
              <span className="text-gold-500/80 text-xs sm:text-sm">❖ ────</span>
              <h2 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-widest text-gold-gradient font-spiritual-heading uppercase leading-normal py-0.5 overflow-visible">
                {language === "hi" ? "श्री प्राणनाथ जी वाणी" : "Shri Prannath Ji Vani"}
              </h2>
              <span className="text-gold-500/80 text-xs sm:text-sm">──── ❖</span>
            </div>

            {/* Tagline */}
            <div className="inline-block text-xs sm:text-sm font-semibold tracking-widest text-gold-400/90 uppercase px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4">
              {language === "hi"
                ? "तारतम वाणी • आध्यात्मिक ज्ञान • निजानंद सम्प्रदाय"
                : "Tartam Vani • Aadhyatmik Gyan • Nijanand Sampradaya"}
            </div>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-spiritual-ivory/85 max-w-xl font-normal leading-relaxed mb-8 drop-shadow-md">
              {language === "hi"
                ? "श्री निजानंद आश्रम साढौली धाम, हरिद्वार (उत्तराखण्ड) - श्री प्राणनाथ जी की दिव्य ब्रह्मवाणी, सत्संग, प्रवचन, ध्यान और साधना का पावन आध्यात्मिक तीर्थ।"
                : "Shri Nijanand Ashram Sadhauli Dham, Haridwar (Uttarakhand) — The sacred spiritual sanctuary of Mahamati Shri Prannath Ji's divine Brahm Vani, satsang, discourses, meditation, and sadhana."}
            </p>

            {/* 4 Action Buttons / Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl">
              {/* Card 1: Divya Brahm Vani (Maroon Glass) */}
              <Link
                href="/library/tartam-vani"
                className="group relative flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-red-500/40 bg-gradient-to-b from-spiritual-maroon/60 to-spiritual-navy/80 backdrop-blur-md hover:border-gold-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-950/40"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-gold-300 mb-2 group-hover:bg-gold-500 group-hover:text-spiritual-dark transition-all">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors">
                  {language === "hi" ? "दिव्य ब्रह्मवाणी" : "Divya Brahm Vani"}
                </span>
                <span className="text-[10px] text-spiritual-ivory/60 mt-0.5">
                  {language === "hi" ? "तारतम वाणी" : "Tartam Vani"}
                </span>
              </Link>

              {/* Card 2: Explore PDFs (Amber/Gold Glass) */}
              <Link
                href="/library"
                className="group relative flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-950/50 to-spiritual-navy/80 backdrop-blur-md hover:border-gold-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-950/40"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2 group-hover:bg-gold-500 group-hover:text-spiritual-dark transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors">
                  {language === "hi" ? "PDF लाइब्रेरी" : "PDF Library"}
                </span>
                <span className="text-[10px] text-spiritual-ivory/60 mt-0.5">
                  {language === "hi" ? "ई-बुक्स" : "E-Books"}
                </span>
              </Link>

              {/* Card 3: Watch Videos (Emerald Glass) */}
              <Link
                href="/media"
                className="group relative flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-spiritual-emerald/50 to-spiritual-navy/80 backdrop-blur-md hover:border-emerald-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-950/40"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-2 group-hover:bg-emerald-500 group-hover:text-spiritual-dark transition-all">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-spiritual-ivory group-hover:text-emerald-300 transition-colors">
                  {language === "hi" ? "वीडियो देखें" : "Watch Videos"}
                </span>
                <span className="text-[10px] text-spiritual-ivory/60 mt-0.5">
                  {language === "hi" ? "सत्संग" : "Satsang"}
                </span>
              </Link>

              {/* Card 4: Aadhyatmik Gyan (Royal Purple / Amber Glass) */}
              <Link
                href="/adhyatmik-gyan"
                className="group relative flex flex-col items-center p-3.5 sm:p-4 rounded-2xl border border-purple-500/40 bg-gradient-to-b from-spiritual-purple/50 to-spiritual-navy/80 backdrop-blur-md hover:border-purple-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-950/40"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 mb-2 group-hover:bg-purple-500 group-hover:text-spiritual-dark transition-all">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-spiritual-ivory group-hover:text-purple-300 transition-colors">
                  {language === "hi" ? "आध्यात्मिक ज्ञान" : "Aadhyatmik Gyan"}
                </span>
                <span className="text-[10px] text-spiritual-ivory/60 mt-0.5">
                  {language === "hi" ? "सत्संग व विचार" : "Wisdom & Blogs"}
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D Paramdham Sacred Cosmic Mandala */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Paramdham3DMandala />
          </div>
        </div>

        {/* Prominent Upcoming Event Banner (Replacing Old Stats Section) */}
        <div className="mt-8 lg:mt-12">
          <HeroUpcomingEvents />
        </div>
      </div>
    </section>
  );
};
