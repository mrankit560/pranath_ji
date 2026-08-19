"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { HolyDham } from "@/lib/data/types";
import { MapPin, Navigation, ExternalLink, Sparkles, Phone } from "lucide-react";

export const HolyDhamsSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [dhams, setDhams] = useState<HolyDham[]>(store.getDhams());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setDhams(store.getDhams());
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-b from-transparent via-spiritual-navy/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            {isEn ? "Holy Dham Locations" : "पवित्र आश्रम एवं धाम स्थान"}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight mb-3">
            {isEn ? "Sacred Pilgrimages of Nijanand Sampradaya" : "श्री निजानंद सम्प्रदाय के पावन धाम"}
          </h2>

          <p className="text-xs sm:text-sm text-gold-muted/90 leading-relaxed">
            {isEn
              ? "Visit and experience the divine tranquility and spiritual presence at our holy retreat ashrams."
              : "पावन धामों के दर्शन कर अखंड शांति, साधना और ब्रह्मज्ञान की रसधारा का अनुभव करें।"}
          </p>
        </div>

        {/* Dham Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {dhams.map((dham, index) => (
            <div
              key={dham.id}
              className="spiritual-glass-card rounded-3xl overflow-hidden border-2 border-gold-500/30 flex flex-col justify-between group shadow-2xl hover:border-gold-400 transition-all duration-300"
            >
              {/* Photo Area */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                <Image
                  src={dham.imageUrl || "/assets/hero-reference-1.jpg"}
                  alt={dham.nameHi}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spiritual-navy via-transparent to-black/40" />

                {/* Badge Number */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 border border-gold-400/40 text-xs font-bold text-gold-300 shadow-md">
                  {isEn ? `Dham 0${index + 1}` : `पावन धाम ०${index + 1}`}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    <span>{dham.location}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-gold-gradient font-spiritual-heading leading-snug">
                    {isEn ? dham.nameEn : dham.nameHi}
                  </h3>

                  <p className="text-xs sm:text-sm text-spiritual-ivory/80 leading-relaxed">
                    {isEn ? dham.descriptionEn : dham.descriptionHi}
                  </p>
                </div>

                {/* Action & Maps Link */}
                <div className="pt-4 border-t border-gold-500/20 flex flex-wrap items-center justify-between gap-3">
                  {dham.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-spiritual-ivory/70">
                      <Phone className="w-3.5 h-3.5 text-gold-400" />
                      <span>{dham.phone}</span>
                    </div>
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
          ))}
        </div>
      </div>
    </section>
  );
};
