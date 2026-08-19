"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  Sparkles,
  Compass,
  Calendar,
  User,
  Clock,
  Search,
  ArrowRight,
  ChevronRight,
  X,
  Share2,
} from "lucide-react";

export default function AdhyatmikGyanPage() {
  const { language } = useI18n();
  const isEn = language === "en";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [blogs, setBlogs] = useState<Article[]>(store.getAdhyatmikBlogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Article | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBlogs(store.getAdhyatmikBlogs());
    });
    return () => unsub();
  }, []);

  const filtered = blogs.filter((b) => {
    const title = (isEn ? b.titleEn : b.titleHi) || "";
    const content = (isEn ? b.contentEn : b.contentHi) || "";
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || content.toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Header Banner */}
      <section className="pt-32 pb-14 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            {isEn ? "Spiritual Philosophy & Blogging" : "आध्यात्मिक ज्ञान व ब्रह्मज्ञान मंच"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading mb-4">
            {isEn ? "Aadhyatmik Gyan — Spiritual Blog" : "आध्यात्मिक ज्ञान — आत्म-जागृति एवं तत्व दर्शन"}
          </h1>

          <p className="text-xs sm:text-base text-gold-muted/80 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Read thought-provoking articles on spiritual awakening, soul realization, Aksharatit, and the path of divine love."
              : "आत्मज्ञान, क्षर-अक्षर-अक्षरातीत का तत्व दर्शन, प्रेम, सेवा और साधना पर ज्ञानवर्धक सत्संग लेख।"}
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search spiritual blogs..." : "आध्यात्मिक ब्लॉग खोजें..."}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-gold-500/30 text-xs sm:text-sm text-spiritual-ivory placeholder-spiritual-ivory/50 focus:outline-none focus:border-gold-400 backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 spiritual-glass-card rounded-3xl p-8 max-w-md mx-auto">
            <p className="text-sm text-spiritual-ivory/70">
              {isEn ? "No blogs found matching your search." : "कोई ब्लॉग उपलब्ध नहीं है।"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((blog) => (
              <div
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group cursor-pointer hover:border-gold-400 transition-all duration-300 shadow-xl"
              >
                <div className="relative h-52 w-full bg-black overflow-hidden">
                  <Image
                    src={blog.featuredImage || "/assets/paramdham-mandala.png"}
                    alt={blog.titleHi}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-spiritual-navy via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-gold-500/30 text-[10px] font-bold text-amber-300 uppercase">
                    {blog.readTime || "5 min read"}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gold-muted/80 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>{blog.publishedAt}</span>
                    </div>

                    <h3 className="text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading leading-snug mb-2">
                      {isEn ? blog.titleEn || blog.titleHi : blog.titleHi}
                    </h3>

                    <p className="text-xs text-spiritual-ivory/75 line-clamp-3 leading-relaxed">
                      {isEn ? blog.summaryEn || blog.summaryHi : blog.summaryHi}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between text-xs text-gold-300 font-semibold">
                    <span className="truncate max-w-[150px]">{blog.author}</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>{isEn ? "Read Blog" : "ब्लॉग पढ़ें"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Full Blog Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="bg-spiritual-navy border-2 border-gold-400/50 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gold-500/15 text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>{selectedBlog.category}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight mb-2">
                {isEn ? selectedBlog.titleEn || selectedBlog.titleHi : selectedBlog.titleHi}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gold-muted/80 pb-4 border-b border-gold-500/20">
                <span>{selectedBlog.author}</span>
                <span>•</span>
                <span>{selectedBlog.publishedAt}</span>
                <span>•</span>
                <span>{selectedBlog.readTime || "5 min read"}</span>
              </div>
            </div>

            {/* Featured Image */}
            {selectedBlog.featuredImage && (
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-gold-500/30">
                <Image
                  src={selectedBlog.featuredImage}
                  alt={selectedBlog.titleHi}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-spiritual-ivory/90 leading-relaxed space-y-4 whitespace-pre-line font-devanagari">
              {isEn ? selectedBlog.contentEn || selectedBlog.contentHi : selectedBlog.contentHi}
            </div>

            {/* Tags */}
            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="pt-4 border-t border-gold-500/20 flex flex-wrap gap-2">
                {selectedBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-black/60 border border-gold-500/30 text-gold-300 text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
