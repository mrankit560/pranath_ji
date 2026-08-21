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
  BookOpen,
  Calendar,
  User,
  Clock,
  Search,
  ArrowRight,
  ChevronRight,
  X,
  Share2,
} from "lucide-react";
import { formatSpiritualDate } from "@/lib/utils/formatDate";

export default function PrannathJiPage() {
  const { language } = useI18n();
  const isEn = language === "en";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>(() => store.getPrannathArticles());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    setArticles(store.getPrannathArticles());
    const unsub = store.subscribe(() => {
      setArticles(store.getPrannathArticles());
    });
    return () => unsub();
  }, []);

  const categories = [
    { id: "all", label: isEn ? "All Episodes" : "सभी प्रसंग" },
    { id: "जीवन प्रसंग", label: isEn ? "Life Episodes" : "जीवन प्रसंग" },
    { id: "बीतक इतिहास", label: isEn ? "Bitak History" : "बीतक इतिहास" },
    { id: "तत्व दर्शन", label: isEn ? "Philosophy" : "तत्व दर्शन" },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      selectedCategory === "all" || art.category === selectedCategory;
    const title = (isEn ? art.titleEn || art.titleHi : art.titleHi) || "";
    const author = art.author || "";
    const q = searchQuery.toLowerCase();
    const matchesSearch = title.toLowerCase().includes(q) || author.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Banner */}
      <section className="pt-32 pb-14 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            {isEn ? "Life, History & Philosophy" : "जीवन चरित्र, बीतक एवं अमर संदेश"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-1 overflow-visible mb-4">
            {isEn ? "Mahamati Shri Prannath Ji" : "महामति श्री प्राणनाथ जी"}
          </h1>

          <p className="text-xs sm:text-base text-gold-muted/80 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "The divine incarnation and revealer of Tartam Vani, uniting the spiritual wisdom of East and West into one Aksharatit Brahm Gyan."
              : "तारतम वाणी के अमर प्रणेता, जिन्होंने आत्म-जागृति व परब्रह्म साक्षात्कार का मार्ग प्रशस्त किया।"}
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search articles, history or topics..." : "प्रसंग, इतिहास या विषय खोजें..."}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-gold-500/30 text-xs sm:text-sm text-spiritual-ivory placeholder-spiritual-ivory/50 focus:outline-none focus:border-gold-400 backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto pb-4 mb-10 border-b border-gold-500/20">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm font-bold scale-105"
                  : "bg-spiritual-card border border-gold-500/25 text-spiritual-ivory/80 hover:text-gold-300 hover:border-gold-400/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="spiritual-glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-gold-500/30 space-y-4">
            <BookOpen className="w-12 h-12 text-gold-400/50 mx-auto" />
            <p className="text-sm text-spiritual-ivory/80">
              {isEn ? "No articles found matching your search." : "आपकी खोज के अनुसार कोई आलेख नहीं मिला।"}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-5 py-2 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold hover:bg-gold-500 hover:text-spiritual-dark"
            >
              {isEn ? "Reset Filter" : "सभी आलेख देखें"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group cursor-pointer shadow-xl hover:border-gold-400 transition-all duration-300"
              >
                <div className="relative h-52 w-full bg-black overflow-hidden">
                  <Image
                    src={art.featuredImage || "/assets/hero-reference-1.jpg"}
                    alt={art.titleHi}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-spiritual-navy via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-gold-500/30 text-[10px] font-bold text-gold-300 uppercase">
                    {art.readTime || "5 min read"}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gold-muted/80 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>{formatSpiritualDate(art.publishedAt, language)}</span>
                    </div>

                    <h3 className="text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading leading-snug mb-2">
                      {isEn ? art.titleEn || art.titleHi : art.titleHi}
                    </h3>

                    <p className="text-xs text-spiritual-ivory/75 line-clamp-3 leading-relaxed">
                      {isEn ? art.summaryEn || art.summaryHi : art.summaryHi}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between text-xs text-gold-300 font-semibold">
                    <span className="truncate max-w-[150px]">{art.author}</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>{isEn ? "Read Post" : "लेख पढ़ें"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="bg-spiritual-navy border-2 border-gold-400/50 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gold-500/15 text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 text-gold-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedArticle.category}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible mb-2">
                {isEn ? selectedArticle.titleEn || selectedArticle.titleHi : selectedArticle.titleHi}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gold-muted/80 pb-4 border-b border-gold-500/20">
                <span>{selectedArticle.author}</span>
                <span>•</span>
                <span>{formatSpiritualDate(selectedArticle.publishedAt, language)}</span>
                <span>•</span>
                <span>{selectedArticle.readTime || "5 min read"}</span>
              </div>
            </div>

            {/* Featured Image if present */}
            {selectedArticle.featuredImage && (
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-gold-500/30">
                <Image
                  src={selectedArticle.featuredImage}
                  alt={selectedArticle.titleHi}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-spiritual-ivory/90 leading-relaxed space-y-4 whitespace-pre-line font-devanagari">
              {isEn ? selectedArticle.contentEn || selectedArticle.contentHi : selectedArticle.contentHi}
            </div>

            {/* Tags */}
            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div className="pt-4 border-t border-gold-500/20 flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
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
