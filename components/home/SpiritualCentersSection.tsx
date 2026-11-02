"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import {
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  Building2,
} from "lucide-react";

interface SpiritualCenter {
  id: string;
  nameHi: string;
  nameEn: string;
  locationHi: string;
  locationEn: string;
  descriptionHi: string;
  descriptionEn: string;
  image: string;
  mapUrl?: string;
  phone?: string;
}

const spiritualCenters: SpiritualCenter[] = [
  {
    id: "center-sadhauli",
    nameHi: "श्री निजानन्द आश्रम साढौली धाम",
    nameEn: "Shri Nijanand Ashram Sadhauli Dham",
    locationHi: "हरिद्वार, उत्तराखंड",
    locationEn: "Haridwar, Uttarakhand",
    descriptionHi:
      "यह पावन आश्रम श्री तारतम वाणी की चर्चा, ब्रह्मज्ञान, सत्संग एवं सुंदरसाथ की सेवा का आध्यात्मिक केंद्र है। यहाँ वाणी के मनन, ज्ञान की चर्चा और सत्संग के माध्यम से सुंदरसाथ को आध्यात्मिक चिंतन एवं ब्रह्मज्ञान से जुड़ने का अवसर प्राप्त होता है।",
    descriptionEn:
      "This sacred ashram is a spiritual sanctum for contemplation of Shri Tartam Vani, divine Brahmgyan, satsang, and loving service of Sundersaath. Seekers immerse in spiritual reflection and divine realization.",
    image: "/assets/sadhauli-mandir.jpg",
    mapUrl: "https://maps.app.goo.gl/n5oY9okf86WyuiKN9?g_st=com.google.maps.preview.copy",
    phone: "+91 99271 97390",
  },
  {
    id: "center-gondar",
    nameHi: "श्री निजानन्द आश्रम, गोन्दर धाम",
    nameEn: "Shri Nijanand Ashram, Gondar Dham",
    locationHi: "करनाल, हरियाणा",
    locationEn: "Karnal, Haryana",
    descriptionHi:
      "यह आश्रम श्री तारतम वाणी की चर्चा, सत्संग एवं सुंदरसाथ की सेवा के लिए समर्पित है। यहाँ आध्यात्मिक वातावरण में वाणी का मनन, ब्रह्मज्ञान की चर्चा और सेवा-भाव को प्रोत्साहित किया जाता है। यह स्थान ज्ञान, प्रेम एवं समर्पण की भावना से सुंदरसाथ को जोड़ने का माध्यम है।",
    descriptionEn:
      "Dedicated to spiritual discourse, contemplation of Tartam Vani, and selfless service. In this sacred atmosphere, wisdom, love, and devotion unite Sundersaath in divine harmony.",
    image: "/assets/gondar-dham-ashram.jpg",
    mapUrl: "https://maps.app.goo.gl/SfovFCe281Gvku5X6?g_st=ic",
    phone: "+91 99271 97390",
  },
  {
    id: "center-panna-seva",
    nameHi: "सेवा समिति भवन, पन्ना धाम",
    nameEn: "Seva Samiti Bhavan, Panna Dham",
    locationHi: "पन्ना, मध्य प्रदेश",
    locationEn: "Panna, Madhya Pradesh",
    descriptionHi:
      "यह सेवा केंद्र ब्रह्मज्ञान की चर्चा, सत्संग एवं सुंदरसाथ की सेवा के पावन भाव से जुड़ा है। पन्नाजी में आयोजित कार्यक्रमों में पधारे सुंदरसाथ के लिए भोजन-प्रसाद की सेवा करना इस केंद्र की विशेष सेवा है। प्रेम, विनम्रता एवं समर्पण के भाव से की जाने वाली भोजन-प्रसाद की सेवा, सुंदरसाथ के प्रति आत्मीयता और निष्काम सेवा-भाव का प्रतीक है। यह केंद्र ज्ञान-चर्चा, सत्संग और सेवाभाव के माध्यम से आध्यात्मिक एकता एवं प्रेम को प्रोत्साहित करता है।",
    descriptionEn:
      "This seva center is devoted to Brahmgyan discourses, satsang, and heartfelt service of Sundersaath. Providing Mahaprasad meal service with love, humility, and dedication during sacred gatherings at Panna Dham stands as a shining symbol of selfless love and spiritual unity.",
    image: "/assets/panna-seva-samiti.jpg",
    locationNote: "मध्य प्रदेश",
  } as any,
];

export const SpiritualCentersSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide every 4.5 seconds with pause capability
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spiritualCenters.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % spiritualCenters.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + spiritualCenters.length) % spiritualCenters.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) handleNext();
    if (diff < -40) handlePrev();
    touchStartX.current = null;
  };

  const currentCenter = spiritualCenters[currentIndex];

  return (
    <section
      id="spiritual-centers"
      className="py-10 sm:py-16 bg-surface-2/70 relative border-b border-line scroll-mt-20 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-800 dark:text-gold-300 text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] mb-2 sm:mb-3">
            <Building2 className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400" />
            <span>{isEn ? "Spiritual & Seva Centers" : "आध्यात्मिक सेवा केंद्र"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-extrabold text-[#781A1A] dark:text-amber-400 font-spiritual-heading leading-tight mb-2 sm:mb-3">
            {isEn ? "Our Spiritual Wisdom & Seva Centers" : "हमारे आध्यात्मिक ज्ञान एवं सेवा केंद्र"}
          </h2>

          <p className="text-xs sm:text-sm text-ink/75 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Dedicated spiritual sanctums established under the divine guidance of Revered Satguru Shri Netrapal Ji Maharaj Ji."
              : "परम वंदनीय सद्गुरु श्री नेत्रपाल जी महाराज जी के पावन मार्गदर्शन में स्थापित आध्यात्मिक सेवा केंद्र।"}
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
              key={currentIndex}
              className="h-full bg-gradient-to-r from-amber-500 to-[#B8860B] transition-all duration-[4500ms] ease-linear w-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-0 lg:min-h-[440px]">
            {/* Center Image Column: Compact height on mobile, cinematic full-height on desktop */}
            <div className="lg:col-span-6 relative h-48 sm:h-56 lg:h-auto min-h-[190px] lg:min-h-[440px] overflow-hidden bg-surface-sunk group">
              <Image
                key={currentCenter.image}
                src={currentCenter.image}
                alt={isEn ? currentCenter.nameEn : currentCenter.nameHi}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Floating Location badge on photo */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF3E8]/95 dark:bg-surface/90 backdrop-blur-md border border-amber-300/60 dark:border-stone-600 text-[#781A1A] dark:text-amber-300 font-bold text-[11px] sm:text-xs shadow-xs">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B87A1E]" />
                  <span>{isEn ? currentCenter.locationEn : currentCenter.locationHi}</span>
                </span>
              </div>
            </div>

            {/* Details Column: Compact on mobile, spacious & luxurious on desktop */}
            <div className="lg:col-span-6 p-4 sm:p-6 lg:p-9 flex flex-col justify-between space-y-3 sm:space-y-5">
              <div className="space-y-2 sm:space-y-3.5">
                {/* Top status line: CENTER X OF 3 (left) + Location Badge (right) */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-[#8C6D37] dark:text-gold-400 uppercase tracking-wider">
                    {isEn ? `Center ${currentIndex + 1} of ${spiritualCenters.length}` : `केंद्र ${currentIndex + 1} / ${spiritualCenters.length}`}
                  </span>
                  <span className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#FAF3E8] dark:bg-surface-sunk text-stone-700 dark:text-gold-300 font-semibold border border-amber-200/80 dark:border-stone-700">
                    {isEn ? currentCenter.locationEn : currentCenter.locationHi}
                  </span>
                </div>

                {/* Heading in rich spiritual maroon */}
                <h3 className="text-lg sm:text-xl lg:text-3xl font-bold font-spiritual-heading text-[#781A1A] dark:text-amber-400 leading-snug">
                  {isEn ? currentCenter.nameEn : currentCenter.nameHi}
                </h3>

                {/* Description: Clamped on mobile, full rich text on desktop */}
                <p className="text-xs sm:text-sm lg:text-base text-ink/80 leading-relaxed text-justify line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                  {isEn ? currentCenter.descriptionEn : currentCenter.descriptionHi}
                </p>
              </div>

              {/* Bottom Bar: Action Buttons (left) + Navigation Controls (right) */}
              <div className="pt-3 sm:pt-4 border-t border-[#EFE8DF] dark:border-stone-800 flex items-center justify-between gap-2 sm:gap-4">
                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
                  {currentCenter.mapUrl && (
                    <a
                      href={currentCenter.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-surface border border-stone-300 dark:border-stone-700 hover:border-gold-400 hover:bg-stone-50 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-2xs transition-all active:scale-95"
                    >
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B87A1E]" />
                      <span>{isEn ? "View on Google Maps" : "गूगल मैप्स"}</span>
                      <span className="text-stone-400 text-[10px] sm:text-xs">↗</span>
                    </a>
                  )}

                  {currentCenter.phone && (
                    <a
                      href={`tel:${currentCenter.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs lg:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-surface border border-stone-300 dark:border-stone-700 hover:border-gold-400 hover:bg-stone-50 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-2xs transition-all active:scale-95"
                    >
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B87A1E]" />
                      <span>{currentCenter.phone}</span>
                    </a>
                  )}
                </div>

                {/* Navigation Controls: Dots + Arrows */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {/* Slide Indicator Dots (Desktop) */}
                  <div className="hidden sm:flex items-center gap-1.5 mr-1">
                    {spiritualCenters.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to center ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? "w-6 bg-[#B8860B]"
                            : "w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Circular Prev / Next Arrows */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous center"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-surface hover:bg-stone-50 text-stone-700 dark:text-stone-300 shadow-2xs flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#781A1A] dark:text-amber-400" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next center"
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

