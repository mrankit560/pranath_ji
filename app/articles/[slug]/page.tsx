"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  FileText,
  Sparkles,
} from "lucide-react";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18n();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const found = store.getArticleBySlug(slug);
    if (found) {
      setArticle(found);
    }
  }, [slug]);

  if (!article) {
    return (
      <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory flex items-center justify-center p-4">
        <div className="text-center spiritual-glass-card rounded-3xl p-8 max-w-md border border-gold-500/30">
          <FileText className="w-12 h-12 text-gold-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-spiritual-ivory font-spiritual-heading mb-2">
            {language === "hi" ? "लेख लोड हो रहा है..." : "Loading Article..."}
          </h2>
          <Link
            href="/articles"
            className="inline-block mt-4 px-6 py-2 rounded-full bg-gold-gradient text-spiritual-dark text-xs font-bold"
          >
            सभी लेख देखें
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <article className="pt-32 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-200 mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "hi" ? "सभी लेखों पर लौटें" : "Back to Articles"}</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase">
            {article.category}
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-1 overflow-visible">
            {language === "hi" ? article.titleHi : article.titleEn}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-spiritual-ivory/60 pb-6 border-b border-gold-500/20">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-400" />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold-400" />
              {article.author}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-gold-500/30 mb-10 shadow-2xl bg-black">
            <Image
              src={article.featuredImage}
              alt={article.titleHi}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="spiritual-glass-card rounded-3xl p-6 sm:p-10 border border-gold-500/30 space-y-6 text-sm sm:text-base text-spiritual-ivory/90 leading-relaxed font-devanagari">
          <div className="whitespace-pre-line leading-relaxed space-y-4">
            {language === "hi" ? article.contentHi : article.contentEn}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-gold-500/20 flex flex-wrap items-center gap-2">
              <span className="text-xs text-spiritual-ivory/60 font-semibold mr-1">
                टैग्स:
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
