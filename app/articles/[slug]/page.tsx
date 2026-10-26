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
import { formatSpiritualDate } from "@/lib/utils/formatDate";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18n();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const updateArticle = () => {
      const found = store.getArticleBySlug(slug);
      if (found) {
        setArticle(found);
      }
    };
    updateArticle();
    const unsub = store.subscribe(updateArticle);
    return () => unsub();
  }, [slug]);

  if (!article) {
    return (
      <main className="min-h-screen bg-surface text-ink flex items-center justify-center p-4">
        <div className="text-center spiritual-glass-card rounded-3xl p-8 max-w-md border border-line">
          <FileText className="w-12 h-12 text-gold-700 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-ink font-spiritual-heading mb-2">
            {language === "hi" ? "आलेख नहीं मिला" : "Article Not Found"}
          </h2>
          <p className="text-xs text-ink/60 mb-6">
            {language === "hi"
              ? "यह आलेख अभी प्रकाशित नहीं हुआ है या हटा दिया गया है।"
              : "The requested article is not available."}
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-gradient text-on-gold text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === "hi" ? "सभी लेखों पर लौटें" : "Return to Articles"}</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface text-ink">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <article className="pt-32 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs text-gold-700 hover:text-gold-800 mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "hi" ? "सभी लेखों पर लौटें" : "Back to Articles"}</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/45 text-gold-700 text-xs font-bold uppercase">
            {article.category}
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-1 overflow-visible">
            {language === "hi" ? article.titleHi : article.titleEn}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-ink/60 pb-6 border-b border-line">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-700" />
              {formatSpiritualDate(article.publishedAt, language)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold-700" />
              {article.author}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-line mb-10 shadow-2xl bg-black">
            <Image
              src={article.featuredImage}
              alt={article.titleHi}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="spiritual-glass-card rounded-3xl p-6 sm:p-10 border border-line space-y-6 text-sm sm:text-base text-ink/90 leading-relaxed font-devanagari">
          {(() => {
            const content = language === "hi" ? article.contentHi : article.contentEn || article.contentHi;
            const isHtml = /<[a-z][\s\S]*>/i.test(content || "");
            if (isHtml) {
              return (
                <div
                  className="prose max-w-none text-sm sm:text-base text-ink/90 leading-relaxed font-devanagari prose-headings:font-spiritual-heading prose-headings:text-kumkum-dk prose-blockquote:border-l-4 prose-blockquote:border-gold-400 prose-blockquote:bg-gold-50/40 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-a:text-gold-700 prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              );
            }
            return (
              <div className="whitespace-pre-line leading-relaxed space-y-4">
                {content}
              </div>
            );
          })()}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-line flex flex-wrap items-center gap-2">
              <span className="text-xs text-ink/60 font-semibold mr-1">
                टैग्स:
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/45 text-gold-700 text-xs"
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
