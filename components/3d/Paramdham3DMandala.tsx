"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Sparkles } from "lucide-react";

export const Paramdham3DMandala: React.FC = () => {
  const { t, language } = useI18n();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth mouse 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / (rect.height / 2)) * 18;
    const rotateY = (x / (rect.width / 2)) * 18;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center py-6 lg:py-0 select-none perspective-1200 cursor-pointer"
      style={{ perspective: "1200px" }}
    >
      {/* 3D Main Transform Container */}
      <div
        className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] md:w-[480px] md:h-[480px] flex items-center justify-center transform-style-3d transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Layer 1 (-50px Z): Celestial Golden Sunburst & Deep Noor Halo */}
        <div
          className="absolute w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-tr from-amber-500/25 via-yellow-500/20 to-emerald-500/20 blur-3xl pointer-events-none"
          style={{ transform: "translateZ(-50px)" }}
        />

        {/* Layer 2 (-20px Z): Outer Clockwise 3D Rotating Golden Orbit Ring */}
        <div
          className="absolute inset-2 sm:inset-0 rounded-full border border-gold-400/30 animate-orbit-3d-cw pointer-events-none"
          style={{
            transform: "translateZ(-20px)",
            boxShadow: "0 0 30px rgba(244, 208, 111, 0.25), inset 0 0 30px rgba(244, 208, 111, 0.15)",
          }}
        />

        {/* Layer 3 (-10px Z): Counter-Clockwise 3D Ring with Sacred Dots */}
        <div
          className="absolute inset-8 sm:inset-6 rounded-full border border-dashed border-gold-300/40 animate-orbit-3d-ccw pointer-events-none"
          style={{ transform: "translateZ(-10px)" }}
        />

        {/* Layer 4 (0px Z): The Sacred Paramdham 24-Aspect Mandala Sphere */}
        <div
          className="relative w-[280px] h-[280px] sm:w-[390px] sm:h-[390px] md:w-[440px] md:h-[440px] rounded-full p-2 bg-gradient-to-b from-[#1c140d]/90 to-[#0a0705]/95 border-2 border-gold-400/60 shadow-2xl shadow-black animate-pulse-3d"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Subtle Golden Sheen Reflection Overlay */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none opacity-60"
            style={{
              transform: `translate(${rotate.y * 1.5}px, ${-rotate.x * 1.5}px)`,
            }}
          />

          <Image
            src="/assets/paramdham-mandala.png"
            alt="परमधाम २४ पक्षीय दिव्य मण्डल एवं साधक स्वरूप"
            width={440}
            height={440}
            priority
            className="w-full h-full object-contain drop-shadow-[0_0_35px_rgba(244,208,111,0.55)]"
          />
        </div>

        {/* Layer 5 (Z: +45px to +65px): Interactive 3D Depth Floating Badges */}
        {/* Badge 1: Top Left */}
        <Link
          href="/meditation"
          className="absolute -top-3 left-0 sm:left-4 floating-badge px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-gold-300 hover:scale-110 transition-transform shadow-xl backdrop-blur-xl border border-gold-400/60"
          style={{ transform: "translateZ(45px)" }}
        >
          <span className="text-base">🏛️</span>
          <span>{t("hero.badge1", "अष्ट प्रहर लीला")}</span>
        </Link>

        {/* Badge 2: Top Right */}
        <Link
          href="/philosophy"
          className="absolute top-4 -right-2 sm:right-2 floating-badge px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-gold-300 hover:scale-110 transition-transform shadow-xl backdrop-blur-xl border border-gold-400/60"
          style={{ transform: "translateZ(55px)" }}
        >
          <span className="text-base">🌌</span>
          <span>{t("hero.badge2", "परमधाम का दिव्य स्वरूप")}</span>
        </Link>

        {/* Badge 3: Bottom Left */}
        <Link
          href="/philosophy"
          className="absolute bottom-6 -left-2 sm:left-2 floating-badge px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-gold-300 hover:scale-110 transition-transform shadow-xl backdrop-blur-xl border border-gold-400/60"
          style={{ transform: "translateZ(50px)" }}
        >
          <span className="text-base">📿</span>
          <span>{t("hero.badge3", "चितवनी व ज्ञान")}</span>
        </Link>

        {/* Badge 4: Bottom Right */}
        <Link
          href="/about"
          className="absolute -bottom-3 right-0 sm:right-4 floating-badge px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-gold-300 hover:scale-110 transition-transform shadow-xl backdrop-blur-xl border border-gold-400/60"
          style={{ transform: "translateZ(65px)" }}
        >
          <span className="text-base">🪷</span>
          <span>{t("hero.badge4", "सत्संग, सेवा, साधना")}</span>
        </Link>
      </div>
    </div>
  );
};
