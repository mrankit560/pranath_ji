"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Sparkles, Flower2, Wind, Heart } from "lucide-react";

export const ChitwaniMeditation3D: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [seconds, setSeconds] = useState<number>(4);
  const [isActive, setIsActive] = useState<boolean>(true);

  // 4-4-4-4 Box breathing / Chitwani meditation cycle
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            if (currentPhase === "inhale") return "hold";
            if (currentPhase === "hold") return "exhale";
            if (currentPhase === "exhale") return "rest";
            return "inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const phaseLabels = {
    inhale: {
      hi: "श्वास लें (परमधाम दिव्य प्रकाश)",
      en: "Inhale (Divine Light)",
      color: "text-amber-300",
      scale: "scale-110",
    },
    hold: {
      hi: "ध्यान धारण करें (अक्षरातीत युगल स्वरूप)",
      en: "Contemplate (Divine Paramdham)",
      color: "text-gold-300",
      scale: "scale-110",
    },
    exhale: {
      hi: "श्वास छोड़ें (अहंकार व माया विसर्जन)",
      en: "Exhale (Release Illusion)",
      color: "text-emerald-300",
      scale: "scale-90",
    },
    rest: {
      hi: "शांत स्वरूप (परम आनंद व विश्राम)",
      en: "Rest (Aksharatit Bliss)",
      color: "text-purple-300",
      scale: "scale-100",
    },
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center p-6 sm:p-10 select-none perspective-1000">
      {/* 3D Sacred Geometric Chakra Container */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transform-style-3d">
        {/* Layer 1: Outermost Celestial Glowing Atmosphere */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-gold-400/20 to-emerald-500/20 blur-3xl transition-all duration-1000 ${
            phase === "inhale" || phase === "hold" ? "opacity-100 scale-125" : "opacity-50 scale-90"
          }`}
          style={{ transform: "translateZ(-40px)" }}
        />

        {/* Layer 2: 3D Orbiting Noor Ring 1 */}
        <div
          className="absolute inset-2 rounded-full border-2 border-gold-400/40 animate-orbit-3d-cw pointer-events-none"
          style={{ transform: "translateZ(-20px)" }}
        />

        {/* Layer 3: 3D Counter-Orbiting Noor Ring 2 */}
        <div
          className="absolute inset-6 rounded-full border border-dashed border-amber-300/40 animate-orbit-3d-ccw pointer-events-none"
          style={{ transform: "translateZ(-10px)" }}
        />

        {/* Layer 4: Breathing Center Sphere */}
        <div
          className={`relative w-44 h-44 sm:w-56 sm:h-56 rounded-full p-4 bg-gradient-to-b from-[#241a12]/95 to-[#0e0a08]/95 border-2 border-gold-400/60 shadow-2xl flex flex-col items-center justify-center text-center transition-transform duration-1000 ${
            phaseLabels[phase].scale
          }`}
          style={{ transform: "translateZ(20px)" }}
        >
          <Flower2 className="w-8 h-8 text-gold-400 mb-1 animate-pulse" />
          
          <div className="text-2xl sm:text-3xl font-black text-gold-gradient font-mono leading-none">
            {seconds}s
          </div>

          <span className="text-[10px] sm:text-xs font-bold text-gold-300 uppercase tracking-widest mt-1">
            {phase.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Breathing Guidance Instruction */}
      <div className="text-center mt-6 space-y-2">
        <div className={`text-base sm:text-lg font-bold font-spiritual-heading transition-colors duration-500 ${phaseLabels[phase].color}`}>
          {isEn ? phaseLabels[phase].en : phaseLabels[phase].hi}
        </div>
        <p className="text-xs text-spiritual-ivory/70 max-w-sm mx-auto">
          {isEn
            ? "“Contemplate the eternal divine realm of Paramdham. With every breath, remember the bliss of Shri Raj Shyamaji.”"
            : "“राज श्यामा जी के पावन स्वरूप का अंतर में ध्यान करें। श्वास-प्रश्वास में श्री जी का स्मरण बना रहे।”"}
        </p>
      </div>
    </div>
  );
};
