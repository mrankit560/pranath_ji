"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Headphones } from "lucide-react";

/**
 * Satguru Maharaj Ji — portrait beside the discourse invitation.
 * Ported from the approved design-preview layout: arched photo frame on a cool
 * stone band, kumkum heading, gold reserved for the eyebrow and the pull-quote rule.
 */
export const SatguruSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";

  return (
    <section className="py-16 sm:py-20 bg-surface-sunk border-y border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-10 lg:gap-14 items-center">
          {/* Arched portrait */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              className="relative aspect-[4/5] overflow-hidden bg-surface-2"
              style={{
                borderRadius: "190px 190px 20px 20px",
                boxShadow:
                  "0 0 0 1px #E3C878, 0 0 0 10px #FFFFFF, 0 0 0 11px #FAF1DA, 0 30px 70px rgba(38,40,42,.17)",
              }}
            >
              <Image
                src="/assets/satguru-pranam.jpg"
                alt={isEn ? "Satguru Maharaj Ji" : "सतगुरु महाराज जी"}
                fill
                sizes="(max-width: 1024px) 90vw, 36vw"
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Text column */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-[0.24em] text-gold-700 mb-3">
              {isEn ? "Satguru Maharaj Ji" : "सतगुरु महाराज जी"}
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.6rem] leading-snug text-kumkum-dk mb-5">
              {isEn
                ? "The Light of Brahmgyan Through the Guru's Grace"
                : "गुरु कृपा से ब्रह्मज्ञान का प्रकाश"}
            </h2>

            <p className="text-sm sm:text-base text-ink/80 leading-relaxed max-w-2xl">
              {isEn
                ? "At Sadhauli Dham, seekers receive the nectar of the Tartam Vani daily from Satguru Maharaj Ji. In his presence, devotees learn the path of self-awakening, selfless service and remembrance of Parabrahm."
                : "साढौली धाम में प्रतिदिन सतगुरु महाराज जी के श्रीमुख से तारतम वाणी का रसपान होता है। उनके सान्निध्य में साधक आत्म-जागृति, निष्काम सेवा एवं परब्रह्म स्मरण का मार्ग सीखते हैं।"}
            </p>

            <blockquote className="font-heading italic text-base sm:text-lg text-kumkum-dk border-l-[3px] border-gold-300 pl-[18px] my-6">
              {isEn
                ? "“May the world be cooled with joy · Through love and service you shall cross over”"
                : "“सुख सीतल करे संसार · प्रेम सेवा से पाओगे पार”"}
            </blockquote>

            <Link
              href="/media"
              className="btn-gold inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
            >
              <Headphones className="w-4 h-4" />
              {isEn ? "Listen to Discourses" : "प्रवचन सुनें"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
