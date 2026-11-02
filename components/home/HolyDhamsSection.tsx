"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import {
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Landmark,
} from "lucide-react";

interface SacredDham {
  id: string;
  nameHi: string;
  nameEn: string;
  locationHi: string;
  locationEn: string;
  descriptionHi: string;
  descriptionEn: string;
  image: string;
  tagHi: string;
  tagEn: string;
  mapUrl: string;
}

const sacredDhams: SacredDham[] = [
  {
    id: "dham-padmavatipuri",
    nameHi: "श्री 5 पद्मावतीपुरी धाम — पन्ना, मध्य प्रदेश",
    nameEn: "Shri 5 Padmavatipuri Dham — Panna, Madhya Pradesh",
    locationHi: "पन्ना, मध्य प्रदेश",
    locationEn: "Panna, Madhya Pradesh",
    tagHi: "पावन मुक्ति पीठ",
    tagEn: "Sacred Mukti Peeth",
    descriptionHi:
      "श्री ५ पद्मावतीपुरी धाम पावन मुक्ति पीठ है। यह महामति श्री प्राणनाथ जी की लीलाभूमि है, जहाँ श्री गुम्मट जी के दर्शन और पावन परम्परा से हमारा हृदय अपने धाम धनी के प्रति प्रेम और श्रद्धा से भर उठता है। यह धाम हमारे निजानंद धर्म की अनमोल आध्यात्मिक धरोहर है।",
    descriptionEn:
      "Shri 5 Padmavatipuri Dham is the holy Mukti Peeth and divine Leelabhoomi of Mahamati Shri Prannath Ji. Darshan of Shri Gummat Ji fills the heart with supreme love and devotion. It stands as the priceless spiritual heritage of our Nijanand Dharma.",
    image: "/assets/dham-padmavatipuri.jpg",
    mapUrl: "https://maps.google.com/?q=Panna+Dham+Gummat+Ji",
  },
  {
    id: "dham-navtanpuri",
    nameHi: "श्री 5 नवतनपुरी धाम — जामनगर, गुजरात",
    nameEn: "Shri 5 Navtanpuri Dham — Jamnagar, Gujarat",
    locationHi: "जामनगर, गुजरात",
    locationEn: "Jamnagar, Gujarat",
    tagHi: "आद्य धर्मपीठ",
    tagEn: "Prime Dharmapeeth",
    descriptionHi:
      "श्री ५ नवतनपुरी धाम हमारे निजानंद सम्प्रदाय की आद्य धर्मपीठ है। इसी पावन भूमि से निजानंद सम्प्रदाय की जागनी का शुभारंभ हुआ। यह सद्गुरु श्री देवचन्द्र जी महाराज की पावन कर्मभूमि और महामति श्री प्राणनाथ जी के प्राकट्य से जुड़ा हमारा परम श्रद्धेय धाम है।",
    descriptionEn:
      "Shri 5 Navtanpuri Dham is the prime holy seat (Aadya Dharmapeeth) of our Nijanand Sampradaya, where the divine Jagni mission commenced. It is the sacred karma-bhoomi of Satguru Shri Devchandra Ji Maharaj and deeply revered for the manifestation of Mahamati Shri Prannath Ji.",
    image: "/assets/dham-navtanpuri.jpg",
    mapUrl: "https://maps.google.com/?q=Navtanpuri+Dham+Khijada+Mandir+Jamnagar",
  },
  {
    id: "dham-mahamangalapuri",
    nameHi: "श्री 5 महामंगलपुरी धाम — सूरत, गुजरात",
    nameEn: "Shri 5 Mahamangalapuri Dham — Surat, Gujarat",
    locationHi: "सूरत, गुजरात",
    locationEn: "Surat, Gujarat",
    tagHi: "पावन जागनी तीर्थ",
    tagEn: "Sacred Jagni Pilgrimage",
    descriptionHi:
      "श्री ५ महामंगलपुरी धाम हमारे निजानंद सम्प्रदाय का एक पावन धाम है। महामति श्री प्राणनाथ जी की जागनी यात्रा और दिव्य लीलाओं से जुड़ी यह भूमि हमारे लिए विशेष महत्त्व रखती है। इसकी पावन स्मृति हमारे हृदय में श्रद्धा, प्रेम और भक्ति का भाव जागृत करती है।",
    descriptionEn:
      "Shri 5 Mahamangalapuri Dham is a deeply revered pilgrimage in the Nijanand Sampradaya, sanctified by Mahamati Shri Prannath Ji's Jagni journey and divine leelas. Its sacred memory continuously awakens deep devotion, love, and spiritual reverence in our hearts.",
    image: "/assets/dham-mahamangalapuri.jpg",
    mapUrl: "https://maps.google.com/?q=Mahamangalapuri+Dham+Surat",
  },
];

export const HolyDhamsSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide every 4.5 seconds with pause capability
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sacredDhams.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sacredDhams.length);
    // Pause briefly for 3s then resume
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sacredDhams.length) % sacredDhams.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) nextSlide();
    if (diff < -40) prevSlide();
    touchStartX.current = null;
  };

  const activeDham = sacredDhams[currentSlide];

  return (
    <section
      id="holy-dhams"
      className="py-10 sm:py-16 bg-gradient-to-b from-surface via-surface-sunk/40 to-surface relative border-b border-line scroll-mt-20 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-800 dark:text-gold-300 text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-2 sm:mb-3">
            <Landmark className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400" />
            <span>{isEn ? "Supreme Dhams" : "परम पावन धाम"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-extrabold text-[#781A1A] dark:text-amber-400 font-spiritual-heading leading-tight mb-2 sm:mb-3">
            {isEn ? "Sacred Pilgrimages of Nijanand Sampradaya" : "श्री निजानंद सम्प्रदाय के पावन धाम"}
          </h2>

          <p className="text-xs sm:text-sm text-ink/75 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "The prime historical pilgrimage seats of the Nijanand tradition, blessed by the footsteps and divine leelas of Mahamati Shri Prannath Ji."
              : "महामति श्री प्राणनाथ जी एवं सद्गुरु देवचन्द्र जी महाराज की पावन लीलाओं से सुशोभित निजानंद सम्प्रदाय के सर्वोच्च पावन धाम।"}
          </p>
        </div>

        {/* Responsive Card: Cinematic on Desktop, Sleek & Compact on Mobile */}
        <div
          className="relative bg-[#FDFAF6] dark:bg-surface rounded-2xl sm:rounded-3xl border border-[#DFD3C3] dark:border-stone-700 shadow-xl overflow-hidden backdrop-blur-xl transition-all"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated Auto-Slide Progress Bar */}
          <div className="h-1 w-full bg-stone-200/60 dark:bg-stone-800 relative overflow-hidden">
            <div
              key={currentSlide}
              className="h-full bg-gradient-to-r from-amber-500 to-[#B8860B] transition-all duration-[4500ms] ease-linear w-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-0 lg:min-h-[440px]">
            {/* Image Column: Compact height on mobile, cinematic full-height on desktop */}
            <div className="lg:col-span-6 relative h-48 sm:h-56 lg:h-auto min-h-[190px] lg:min-h-[440px] overflow-hidden bg-surface-sunk group">
              <Image
                key={activeDham.image}
                src={activeDham.image}
                alt={isEn ? activeDham.nameEn : activeDham.nameHi}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Floating Pill Badges on image */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF3E8]/95 dark:bg-surface/90 backdrop-blur-md border border-amber-300/60 dark:border-stone-600 text-[#781A1A] dark:text-amber-300 font-bold text-[11px] sm:text-xs shadow-xs">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B87A1E]" />
                  <span>{isEn ? activeDham.locationEn : activeDham.locationHi}</span>
                </span>

                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-[#C8922C] text-white font-bold text-[11px] sm:text-xs shadow-xs">
                  {isEn ? activeDham.tagEn : activeDham.tagHi}
                </span>
              </div>
            </div>

            {/* Details Column: Compact on mobile, spacious & luxurious on desktop */}
            <div className="lg:col-span-6 p-4 sm:p-6 lg:p-9 flex flex-col justify-between space-y-3 sm:space-y-5">
              <div className="space-y-2 sm:space-y-3.5">
                {/* Top status line: HOLY DHAM X OF 3 (left) + Location Badge (right) */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-[#8C6D37] dark:text-gold-400 uppercase tracking-wider">
                    {isEn ? `Holy Dham ${currentSlide + 1} of ${sacredDhams.length}` : `पावन धाम ${currentSlide + 1} / ${sacredDhams.length}`}
                  </span>
                  <span className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#FAF3E8] dark:bg-surface-sunk text-stone-700 dark:text-gold-300 font-semibold border border-amber-200/80 dark:border-stone-700">
                    {isEn ? activeDham.locationEn : activeDham.locationHi}
                  </span>
                </div>

                {/* Heading in rich spiritual maroon */}
                <h3 className="text-lg sm:text-xl lg:text-3xl font-bold font-spiritual-heading text-[#781A1A] dark:text-amber-400 leading-snug">
                  {isEn ? activeDham.nameEn : activeDham.nameHi}
                </h3>

                {/* Description: Clamped on mobile, full rich text on desktop */}
                <p className="text-xs sm:text-sm lg:text-base text-ink/80 leading-relaxed text-justify line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                  {isEn ? activeDham.descriptionEn : activeDham.descriptionHi}
                </p>
              </div>

              {/* Bottom Bar: Action Buttons (left) + Navigation Controls (right) */}
              <div className="pt-3 sm:pt-4 border-t border-[#EFE8DF] dark:border-stone-800 flex items-center justify-between gap-2 sm:gap-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
                  <a
                    href={activeDham.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-surface border border-stone-300 dark:border-stone-700 hover:border-gold-400 hover:bg-stone-50 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-2xs transition-all active:scale-95"
                  >
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B87A1E]" />
                    <span>{isEn ? "View on Google Maps" : "गूगल मैप्स"}</span>
                    <span className="text-stone-400 text-[10px] sm:text-xs">↗</span>
                  </a>

                  <a
                    href="#spiritual-centers"
                    className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-surface border border-stone-300 dark:border-stone-700 hover:border-gold-400 hover:bg-stone-50 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-2xs transition-all active:scale-95"
                  >
                    <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B87A1E]" />
                    <span>{isEn ? "Spiritual Centers" : "आश्रम सेवा केंद्र"}</span>
                  </a>
                </div>

                {/* Navigation Controls: Dots + Arrows */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {/* Slide Indicator Dots (Desktop) */}
                  <div className="hidden sm:flex items-center gap-1.5 mr-1">
                    {sacredDhams.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to dham ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentSlide
                            ? "w-6 bg-[#B8860B]"
                            : "w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Circular Prev / Next Arrows */}
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous dham"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-surface hover:bg-stone-50 text-stone-700 dark:text-stone-300 shadow-2xs flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#781A1A] dark:text-amber-400" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next dham"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#B8860B] hover:bg-[#9E7307] text-white shadow-xs flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


