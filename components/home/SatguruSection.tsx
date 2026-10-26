"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Headphones, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const satguruSlides = [
  {
    image: "/assets/satguru-pranam.jpg",
    titleHi: "परम वंदनीय श्री नेत्रपाल जी महाराज जी — प्रणाम मुद्रा",
    titleEn: "Param Vandaniya Shri Netrapal Ji Maharaj Ji — Pranam",
  },
  {
    image: "/assets/satguru-vani.jpg",
    titleHi: "श्री नेत्रपाल जी महाराज जी — तारतम वाणी रसपान",
    titleEn: "Shri Netrapal Ji Maharaj Ji — Tartam Vani Discourse",
  },
];

export const SatguruSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % satguruSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % satguruSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + satguruSlides.length) % satguruSlides.length);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-surface via-surface-sunk to-surface border-y border-line relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/3 left-1/10 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.88fr_1.12fr] gap-10 lg:gap-14 items-center">
          {/* Arched portrait with interactive slider */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              className="relative aspect-[4/5] overflow-hidden bg-surface-2 group"
              style={{
                borderRadius: "190px 190px 24px 24px",
                boxShadow:
                  "0 0 0 1px #E3C878, 0 0 0 8px #FFFFFF, 0 0 0 10px #FAF1DA, 0 25px 60px rgba(38,40,42,.15)",
              }}
            >
              {/* Slides */}
              {satguruSlides.map((slide, idx) => (
                <div
                  key={slide.image}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={isEn ? slide.titleEn : slide.titleHi}
                    fill
                    sizes="(max-width: 1024px) 90vw, 36vw"
                    className="object-cover object-top"
                    priority={idx === 0}
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-ink shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-kumkum-dk" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-ink shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-5 h-5 text-kumkum-dk" />
              </button>

              {/* Indicator dots */}
              <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                {satguruSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? "w-7 bg-gold-400 shadow-sm"
                        : "w-2 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="space-y-4 sm:space-y-5">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-800 text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              <span>{isEn ? "Shri Satguru Maharaj Ji" : "श्री सतगुरु महाराज जी"}</span>
            </div>

            {/* Main Founder Heading */}
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-kumkum-dk leading-tight">
                {isEn ? "Shri Netrapal Ji Maharaj Ji" : "श्री नेत्रपाल जी महाराज जी"}
              </h2>
              <p className="text-base sm:text-lg font-medium text-gold-700 mt-1">
                {isEn ? "Most Revered Founder" : "परम वंदनीय संस्थापक"}
              </p>
            </div>

            {/* Description Text */}
            <p className="text-sm sm:text-base text-ink/85 leading-relaxed text-justify">
              {isEn
                ? "Under the divine guidance and inspiration of Most Revered Shri Maharaj Ji, the sacred essence of reaching the glory of Brahmgyan to every soul is realized through the contemplation of Shri Tartam Vani, satsang, spiritual discourses, and selfless service of Sundersaath. Under Maharaj Ji's guidance, three spiritual service centers have been established. These centers are dedicated to spreading wisdom, satsang, Brahmgyan, and loving service to Sundersaath, while nurturing the sacred spirit of love and spiritual awakening."
                : "परम वंदनीय श्री महाराज जी के मार्गदर्शन एवं प्रेरणा से आश्रम में श्री तारतम वाणी की चर्चा, सत्संग, प्रवचन और सुंदरसाथ की सेवा के माध्यम से ब्रह्मज्ञान की महिमा को जन-जन तक पहुँचाने का पावन भाव निहित है। महाराज जी के मार्गदर्शन में तीन आध्यात्मिक सेवा केंद्र स्थापित किए गए हैं। ये केंद्र ज्ञान, सत्संग, ब्रह्मज्ञान के प्रचार-प्रसार एवं सुंदरसाथ की सेवा के साथ-साथ ज्ञान, प्रेम और आध्यात्मिक जागृति की भावना को आगे बढ़ाने के लिए समर्पित हैं।"}
            </p>

            {/* Sacred Pull-Quote */}
            <blockquote className="font-heading italic text-base sm:text-lg text-kumkum-dk border-l-4 border-gold-400 pl-4 py-1 my-4 bg-gold-50/50 rounded-r-xl">
              {isEn
                ? "“May the world be cooled with joy · Through love and service you shall cross over”"
                : "“सुख सीतल करे संसार · प्रेम सेवा से पाओगे पार”"}
            </blockquote>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/media"
                className="btn-gold inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-md hover:scale-105 transition-transform"
              >
                <Headphones className="w-4 h-4" />
                {isEn ? "Listen to Discourses" : "प्रवचन सुनें"}
              </Link>

              <a
                href="#spiritual-centers"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gold-800 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-400/40 transition-colors"
              >
                <span>{isEn ? "View 3 Service Centers" : "आध्यात्मिक सेवा केंद्र देखें"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
