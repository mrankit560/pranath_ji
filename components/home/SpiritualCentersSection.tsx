"use client";

import React, { useState, useEffect } from "react";
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

  // Auto-slide every 7 seconds unless hovered/interacted
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spiritualCenters.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % spiritualCenters.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + spiritualCenters.length) % spiritualCenters.length);
  };

  const currentCenter = spiritualCenters[currentIndex];

  return (
    <section
      id="spiritual-centers"
      className="py-16 sm:py-24 bg-surface-2/80 relative border-b border-line scroll-mt-20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-800 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <Building2 className="w-3.5 h-3.5 text-gold-700" />
            <span>{isEn ? "Spiritual & Seva Centers" : "आध्यात्मिक सेवा केंद्र"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-gold-gradient font-spiritual-heading leading-tight mb-3">
            {isEn ? "Our Spiritual Wisdom & Seva Centers" : "हमारे आध्यात्मिक ज्ञान एवं सेवा केंद्र"}
          </h2>

          <p className="text-xs sm:text-sm text-ink/75 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Three dedicated spiritual sanctums established under the divine guidance of Most Revered Satguru Shri Netrapal Ji Maharaj Ji."
              : "परम वंदनीय सद्गुरु श्री नेत्रपाल जी महाराज जी के पावन मार्गदर्शन में स्थापित तीन आध्यात्मिक सेवा केंद्र।"}
          </p>
        </div>

        {/* Center Spotlight Slider Card */}
        <div className="relative bg-surface rounded-3xl border border-gold-400/35 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[440px]">
            {/* Center Image Column */}
            <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] overflow-hidden bg-surface-sunk">
              <Image
                src={currentCenter.image}
                alt={isEn ? currentCenter.nameEn : currentCenter.nameHi}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />

              {/* Location badge on photo */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-gold-400/40 text-kumkum-dk font-bold text-xs shadow-md">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                <span>{isEn ? currentCenter.locationEn : currentCenter.locationHi}</span>
              </div>
            </div>

            {/* Center Details Column */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Step indicator tag */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-700 uppercase tracking-widest">
                    {isEn ? `Center ${currentIndex + 1} of ${spiritualCenters.length}` : `केंद्र ${currentIndex + 1} / ${spiritualCenters.length}`}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-800 font-semibold border border-gold-300/60">
                    {isEn ? currentCenter.locationEn : currentCenter.locationHi}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold font-spiritual-heading text-kumkum-dk leading-snug">
                  {isEn ? currentCenter.nameEn : currentCenter.nameHi}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-ink/80 leading-relaxed text-justify">
                  {isEn ? currentCenter.descriptionEn : currentCenter.descriptionHi}
                </p>
              </div>

              {/* Footer actions & slide navigation */}
              <div className="pt-4 border-t border-line/60 flex flex-wrap items-center justify-between gap-4">
                {/* Quick actions (maps/phone) */}
                <div className="flex items-center gap-3">
                  {currentCenter.mapUrl && (
                    <a
                      href={currentCenter.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-800 hover:text-kumkum-dk bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-lg border border-gold-200 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-gold-700" />
                      <span>{isEn ? "View on Google Maps" : "गूगल मैप्स पर देखें"}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                  {currentCenter.phone && (
                    <a
                      href={`tel:${currentCenter.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/75 hover:text-ink px-3 py-1.5 rounded-lg border border-line hover:border-gold-300 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-gold-600" />
                      <span>{currentCenter.phone}</span>
                    </a>
                  )}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous center"
                    className="w-10 h-10 rounded-full border border-gold-300/70 bg-surface hover:bg-gold-50 text-kumkum-dk shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next center"
                    className="w-10 h-10 rounded-full bg-gold-gradient text-on-gold shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Tabs below */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          {spiritualCenters.map((center, index) => (
            <button
              key={center.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 ${
                index === currentIndex
                  ? "border-gold-500 bg-surface shadow-md ring-2 ring-gold-400/30 scale-[1.02]"
                  : "border-line bg-surface/60 hover:bg-surface hover:border-gold-300/60"
              }`}
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-line">
                <Image
                  src={center.image}
                  alt={isEn ? center.nameEn : center.nameHi}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-kumkum-dk truncate">
                  {isEn ? center.nameEn : center.nameHi}
                </span>
                <span className="block text-[11px] text-ink/60 truncate mt-0.5">
                  {isEn ? center.locationEn : center.locationHi}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
