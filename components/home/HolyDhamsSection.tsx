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
  },
];

export const HolyDhamsSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide every 7 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sacredDhams.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sacredDhams.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sacredDhams.length) % sacredDhams.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  const activeDham = sacredDhams[currentSlide];

  return (
    <section
      id="holy-dhams"
      className="py-16 sm:py-24 bg-gradient-to-b from-surface via-surface-sunk/60 to-surface relative border-b border-line scroll-mt-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-800 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <Landmark className="w-3.5 h-3.5 text-gold-700" />
            <span>{isEn ? "Supreme Dhams" : "परम पावन धाम"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-gold-gradient font-spiritual-heading leading-tight mb-3">
            {isEn ? "Sacred Pilgrimages of Nijanand Sampradaya" : "श्री निजानंद सम्प्रदाय के पावन धाम"}
          </h2>

          <p className="text-xs sm:text-sm text-ink/75 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "The prime historical pilgrimage seats of the Nijanand tradition, blessed by the footsteps and divine leelas of Mahamati Shri Prannath Ji."
              : "महामति श्री प्राणनाथ जी एवं सद्गुरु देवचन्द्र जी महाराज की पावन लीलाओं से सुशोभित निजानंद सम्प्रदाय के सर्वोच्च पावन धाम।"}
          </p>
        </div>

        {/* Dham Spotlight Card with Slider */}
        <div className="relative bg-surface rounded-3xl border border-gold-400/40 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Subtle live progress bar */}
          <div className="h-1 w-full bg-surface-2 relative overflow-hidden">
            <div
              key={currentSlide}
              className="h-full bg-gold-gradient transition-all duration-[7000ms] ease-linear w-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[440px]">
            {/* Dham Image Column */}
            <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] overflow-hidden bg-surface-sunk group">
              <Image
                key={activeDham.image}
                src={activeDham.image}
                alt={isEn ? activeDham.nameEn : activeDham.nameHi}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-gold-400/50 text-kumkum-dk font-bold text-xs shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-gold-600" />
                  <span>{isEn ? activeDham.locationEn : activeDham.locationHi}</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gold-gradient text-on-gold font-bold text-[11px] shadow-sm">
                  {isEn ? activeDham.tagEn : activeDham.tagHi}
                </span>
              </div>
            </div>

            {/* Dham Details Column */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">
                    {isEn ? `Holy Dham ${currentSlide + 1} of ${sacredDhams.length}` : `पावन धाम ${currentSlide + 1} / ${sacredDhams.length}`}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-800 font-semibold border border-gold-300/60">
                    {isEn ? activeDham.locationEn : activeDham.locationHi}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-spiritual-heading text-kumkum-dk leading-snug">
                  {isEn ? activeDham.nameEn : activeDham.nameHi}
                </h3>

                <p className="text-sm sm:text-base text-ink/80 leading-relaxed text-justify">
                  {isEn ? activeDham.descriptionEn : activeDham.descriptionHi}
                </p>
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-line/60 flex items-center justify-between gap-4">
                {/* Dots indicator */}
                <div className="flex items-center gap-2">
                  {sacredDhams.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "w-8 bg-gold-gradient shadow-sm"
                          : "w-2.5 bg-line hover:bg-gold-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous dham"
                    className="w-10 h-10 rounded-full border border-gold-300/70 bg-surface hover:bg-gold-50 text-kumkum-dk shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next dham"
                    className="w-10 h-10 rounded-full bg-gold-gradient text-on-gold shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          {sacredDhams.map((dham, index) => (
            <button
              key={dham.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 ${
                index === currentSlide
                  ? "border-gold-500 bg-surface shadow-md ring-2 ring-gold-400/30 scale-[1.02]"
                  : "border-line bg-surface/60 hover:bg-surface hover:border-gold-300/60"
              }`}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-line bg-surface-sunk relative">
                <Image
                  src={dham.image}
                  alt={isEn ? dham.nameEn : dham.nameHi}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-kumkum-dk truncate">
                  {isEn ? dham.nameEn : dham.nameHi}
                </span>
                <span className="block text-[11px] text-ink/60 truncate mt-0.5">
                  {isEn ? dham.locationEn : dham.locationHi}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
