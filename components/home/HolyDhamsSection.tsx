"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { HolyDham } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Phone,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
} from "lucide-react";

export const HolyDhamsSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";

  const [dhams, setDhams] = useState<HolyDham[]>(store.getDhams());
  const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<{
    dham: HolyDham;
    photoIndex: number;
  } | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setDhams(store.getDhams());
    });
    return () => unsub();
  }, []);

  const getDhamImages = (dham: HolyDham): string[] => {
    if (dham.images && dham.images.length > 0) {
      return dham.images.filter((img) => typeof img === "string" && img.trim() !== "");
    }
    if (dham.imageUrl) {
      return [dham.imageUrl];
    }
    return ["/assets/sadhauli-dham-2.jpg"];
  };

  const handlePrevSlide = (dhamId: string, totalImages: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideIndices((prev) => {
      const current = prev[dhamId] || 0;
      const nextIndex = current === 0 ? totalImages - 1 : current - 1;
      return { ...prev, [dhamId]: nextIndex };
    });
  };

  const handleNextSlide = (dhamId: string, totalImages: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideIndices((prev) => {
      const current = prev[dhamId] || 0;
      const nextIndex = current === totalImages - 1 ? 0 : current + 1;
      return { ...prev, [dhamId]: nextIndex };
    });
  };

  const handleSelectSlide = (dhamId: string, index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideIndices((prev) => ({ ...prev, [dhamId]: index }));
  };

  return (
    <section id="holy-dhams" className="py-20 relative bg-gradient-to-b from-spiritual-navy via-black/80 to-spiritual-navy border-y border-gold-500/20 scroll-mt-20">
      {/* Background Saffron/Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            {isEn ? "Holy Dham Locations & Photo Gallery" : "पवित्र आश्रम एवं धाम दर्शन"}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-1 overflow-visible mb-3">
            {isEn ? "Sacred Pilgrimages of Nijanand Sampradaya" : "श्री निजानंद सम्प्रदाय के पावन धाम"}
          </h2>

          <p className="text-xs sm:text-sm text-gold-muted/90 leading-relaxed">
            {isEn
              ? "Visit and experience the divine tranquility and spiritual presence at our holy retreat ashrams. Slide photos to explore."
              : "पावन धामों के दर्शन कर अखंड शांति, साधना और ब्रह्मज्ञान की रसधारा का अनुभव करें। तस्वीरें स्लाइड करके पावन दर्शन करें।"}
          </p>
        </div>

        {/* Dham Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {dhams.map((dham, index) => {
            const images = getDhamImages(dham);
            const activeIndex = (slideIndices[dham.id] || 0) % images.length;
            const currentImg = images[activeIndex] || "/assets/sadhauli-dham-2.jpg";
            const isSadhauli = dham.id === "sadhauli-dham" || dham.nameHi?.includes("साढौली") || index === 0;

            return (
              <div
                key={dham.id}
                className="spiritual-glass-card rounded-3xl overflow-hidden border-2 border-gold-500/30 flex flex-col justify-between group shadow-2xl hover:border-gold-400/80 transition-all duration-300"
              >
                {/* Multi-Photo Carousel Area */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black/90 select-none">
                  {/* Active Image */}
                  <Image
                    src={currentImg}
                    alt={`${isEn ? dham.nameEn : dham.nameHi} - Photo ${activeIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-spiritual-navy via-transparent to-black/50 pointer-events-none" />

                  {/* Top Badges: Dham Number & Photo Counter */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                    <span className={`px-3 py-1 rounded-full backdrop-blur-md border text-xs font-bold shadow-md ${
                      isSadhauli
                        ? "bg-gold-500/90 text-spiritual-dark border-gold-300 font-extrabold"
                        : "bg-black/80 text-gold-300 border-gold-400/40"
                    }`}>
                      {isSadhauli
                        ? (isEn ? "★ Official Ashram Dham" : "★ मुख्य पावन धाम (Sadhauli Dham)")
                        : (isEn ? `Dham 0${index + 1}` : `पावन धाम ${["०१", "०२", "०३", "०४", "०५"][index] || index + 1}`)}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold-400/30 text-[11px] font-bold text-gold-200 shadow-md flex items-center gap-1">
                        <Camera className="w-3 h-3 text-gold-400" />
                        <span>
                          {activeIndex + 1} / {images.length}
                        </span>
                      </span>

                      {/* Fullscreen Lightbox Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightbox({ dham, photoIndex: activeIndex });
                        }}
                        className="p-1.5 rounded-full bg-black/80 hover:bg-gold-500 hover:text-spiritual-dark text-gold-300 border border-gold-400/40 shadow-md transition-colors pointer-events-auto"
                        title={isEn ? "View in Fullscreen Lightbox" : "फुलस्क्रीन देखें"}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Left & Right Slider Controls (Shown if more than 1 photo) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => handlePrevSlide(dham.id, images.length, e)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/65 hover:bg-gold-500 hover:text-spiritual-dark text-gold-300 border border-gold-400/40 flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-95"
                        aria-label="Previous Photo"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={(e) => handleNextSlide(dham.id, images.length, e)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/65 hover:bg-gold-500 hover:text-spiritual-dark text-gold-300 border border-gold-400/40 flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-95"
                        aria-label="Next Photo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Bottom Dot Pagination Indicators */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
                      {images.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={(e) => handleSelectSlide(dham.id, dotIdx, e)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            dotIdx === activeIndex
                              ? "w-6 bg-gold-400 shadow-[0_0_8px_rgba(244,208,111,0.8)]"
                              : "w-2 bg-white/40 hover:bg-white/70"
                          }`}
                          aria-label={`Go to photo ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      <span>{dham.location}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible">
                      {isEn ? dham.nameEn : dham.nameHi}
                    </h3>

                    <p className="text-xs sm:text-sm text-spiritual-ivory/80 leading-relaxed">
                      {isEn ? dham.descriptionEn : dham.descriptionHi}
                    </p>
                  </div>

                  {/* Action & Maps Link */}
                  <div className="pt-4 border-t border-gold-500/20 flex flex-wrap items-center justify-between gap-3">
                    {dham.phone && (
                      <a
                        href={`tel:${dham.phone}`}
                        className="flex items-center gap-1.5 text-xs text-spiritual-ivory/75 hover:text-gold-300 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-gold-400" />
                        <span>{dham.phone}</span>
                      </a>
                    )}

                    <a
                      href={dham.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isEn ? "View on Google Maps" : "गूगल मैप्स पर रास्ता देखें"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX PHOTO MODAL */}
      {/* ========================================================================= */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-2xl animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center bg-[#0d0907] border-2 border-gold-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-gold-500/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h3 className="text-base sm:text-lg font-bold text-gold-gradient font-spiritual-heading truncate">
                  {isEn ? lightbox.dham.nameEn : lightbox.dham.nameHi}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gold-300 font-bold bg-gold-500/15 px-3 py-1 rounded-full border border-gold-400/30">
                  {lightbox.photoIndex + 1} / {getDhamImages(lightbox.dham).length}
                </span>

                <button
                  onClick={() => setLightbox(null)}
                  className="p-1.5 rounded-full bg-gold-500/15 hover:bg-gold-500 hover:text-spiritual-dark text-gold-300 transition-colors"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Image Container */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
              {(() => {
                const photos = getDhamImages(lightbox.dham);
                const currentPhoto = photos[lightbox.photoIndex] || "/assets/sadhauli-dham-2.jpg";

                return (
                  <>
                    <Image
                      src={currentPhoto}
                      alt={isEn ? lightbox.dham.nameEn : lightbox.dham.nameHi}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />

                    {photos.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setLightbox({
                              ...lightbox,
                              photoIndex:
                                lightbox.photoIndex === 0
                                  ? photos.length - 1
                                  : lightbox.photoIndex - 1,
                            })
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-gold-500 hover:text-spiritual-dark text-gold-300 border border-gold-400/40 flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                          onClick={() =>
                            setLightbox({
                              ...lightbox,
                              photoIndex:
                                lightbox.photoIndex === photos.length - 1
                                  ? 0
                                  : lightbox.photoIndex + 1,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-gold-500 hover:text-spiritual-dark text-gold-300 border border-gold-400/40 flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Thumbnail Strip */}
            {getDhamImages(lightbox.dham).length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
                {getDhamImages(lightbox.dham).map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightbox({ ...lightbox, photoIndex: idx })}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === lightbox.photoIndex
                        ? "border-gold-400 scale-105 shadow-[0_0_10px_rgba(244,208,111,0.5)]"
                        : "border-gold-500/30 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={thumb} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
