"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  FileText,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function ArticlesPage() {
  const { t, language } = useI18n();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const articles = store.getArticles().filter((a) => a.status === "published");

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Banner */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" />
            {language === "hi" ? "आध्यात्मिक आलेख" : "Spiritual Articles & Insights"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading mb-3">
            {language === "hi" ? "तारतम ज्ञान एवं आध्यात्मिक लेख" : "Tartam Wisdom & Research Articles"}
          </h1>

          <p className="text-sm sm:text-base text-gold-muted/80 max-w-xl mx-auto">
            {language === "hi"
              ? "साढौली धाम शोध पीठ द्वारा प्रकाशित आध्यात्मिक, दार्शनिक एवं ऐतिहासिक आलेख"
              : "Scholarly and contemplative writings on Tartam Vani, self-realization, and ashram legacy"}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group hover:border-gold-400 transition-all"
            >
              <div className="relative h-48 w-full bg-black overflow-hidden">
                <Image
                  src={art.featuredImage || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800"}
                  alt={art.titleHi}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 border border-gold-500/30 text-[10px] font-bold text-gold-300">
                  {art.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-spiritual-ivory/60 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      {art.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gold-400" />
                      {art.author}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading line-clamp-2 mb-2">
                    {language === "hi" ? art.titleHi : art.titleEn}
                  </h2>

                  <p className="text-xs sm:text-sm text-spiritual-ivory/75 line-clamp-3 leading-relaxed">
                    {language === "hi" ? art.contentHi : art.contentEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between">
                  <Link
                    href={`/articles/${art.slug}`}
                    className="text-xs font-bold text-gold-300 hover:text-gold-100 flex items-center gap-1.5 group-hover:gap-2 transition-all"
                  >
                    <span>{language === "hi" ? "पूरा लेख पढ़ें" : "Read Full Article"}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
