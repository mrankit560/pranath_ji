"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Book } from "@/lib/data/types";
import { Navbar } from "@/components/header/Navbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Footer } from "@/components/footer/Footer";
import {
  BookOpen,
  Download,
  Search,
  Sparkles,
  FileText,
  Bookmark,
  ExternalLink,
  ChevronRight,
  X,
  Info,
} from "lucide-react";

function LibraryContent() {
  const { t, language } = useI18n();
  const isEn = language === "en";
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>(store.getBooks());
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookForBlog, setSelectedBookForBlog] = useState<Book | null>(null);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBooks(store.getBooks());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const categories = [
    { id: "all", label: isEn ? "All Books" : "सभी पुस्तकें" },
    { id: "bitak_saheb", label: isEn ? "Shree Bitak Saheb" : "श्री बीतक साहेब" },
    { id: "tartam_vani", label: isEn ? "Tartam Vani" : "तारतम वाणी" },
    { id: "other", label: isEn ? "Other Books" : "अन्य पुस्तकें" },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    const title = (isEn ? book.titleEn : book.titleHi) || "";
    const author = (isEn ? book.authorEn : book.authorHi) || "";
    const q = searchQuery.toLowerCase();
    const matchesSearch = title.toLowerCase().includes(q) || author.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Header Banner */}
      <section className="pt-32 pb-14 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            {isEn ? "Sacred PDF Digital Library" : "ई-ग्रंथालय एवं पावन साहित्य"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading mb-4">
            {isEn ? "PDF Books & Sacred Literature" : "PDF ग्रंथालय — ऑनलाइन पढ़ें व डाउनलोड करें"}
          </h1>

          <p className="text-xs sm:text-base text-gold-muted/80 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Read and download holy scriptures including Shri Bitak Saheb, Tartam Vani commentaries, and spiritual guides."
              : "श्री बीतक साहेब, तारतम वाणी के १४ ग्रन्थ, टीकाएं, एवं साधना पुस्तकें ऑनलाइन पढ़ें और डाउनलोड करें।"}
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search by title or author..." : "पुस्तक या लेखक का नाम खोजें..."}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-gold-500/30 text-xs sm:text-sm text-spiritual-ivory placeholder-spiritual-ivory/50 focus:outline-none focus:border-gold-400 backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* Main Content & Categories Filter */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills Filter */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === c.id
                  ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm scale-105"
                  : "bg-spiritual-navy/80 border border-gold-500/30 text-spiritual-ivory/80 hover:text-gold-300 hover:border-gold-400"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 spiritual-glass-card rounded-3xl p-8 max-w-md mx-auto">
            <p className="text-sm text-spiritual-ivory/70">
              {isEn ? "No books found in this category." : "इस श्रेणी में कोई पुस्तक उपलब्ध नहीं है।"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group shadow-xl hover:border-gold-400 transition-all duration-300"
              >
                {/* Book Cover Area */}
                <div className="relative h-60 w-full bg-black overflow-hidden flex items-center justify-center p-4">
                  <Image
                    src={book.coverUrl || "/assets/logo-emblem.png"}
                    alt={book.titleHi}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-spiritual-navy via-transparent to-black/30" />

                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 border border-gold-500/30 text-[10px] font-bold text-gold-300 uppercase">
                    {book.category.replace("_", " ")}
                  </span>

                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold">
                    {book.pages} {isEn ? "Pages" : "पृष्ठ"}
                  </span>
                </div>

                {/* Book Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading leading-snug mb-1">
                      {isEn ? book.titleEn || book.titleHi : book.titleHi}
                    </h3>

                    <div className="text-xs text-gold-muted/80 mb-3 font-semibold">
                      {isEn ? book.authorEn : book.authorHi}
                    </div>

                    <p className="text-xs text-spiritual-ivory/75 line-clamp-3 leading-relaxed mb-3">
                      {isEn ? book.descriptionEn || book.descriptionHi : book.descriptionHi}
                    </p>

                    {/* Book Blog / Review button if available */}
                    {(book.bookBlogHi || book.bookBlogEn) && (
                      <button
                        onClick={() => setSelectedBookForBlog(book)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-200 hover:underline mb-2"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{isEn ? "Read About This Book (Review)" : "पुस्तक परिचय व समीक्षा पढ़ें"}</span>
                      </button>
                    )}
                  </div>

                  {/* Actions: Read Online & Download */}
                  <div className="pt-4 border-t border-gold-500/20 flex items-center justify-between gap-2">
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold inline-flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isEn ? "Read Online" : "ऑनलाइन पढ़ें"}</span>
                    </a>

                    <a
                      href={book.pdfUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-spiritual-card border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Book Blog / Review Modal */}
      {selectedBookForBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="bg-spiritual-navy border-2 border-gold-400/50 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedBookForBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-gold-500/15 text-gold-300 hover:bg-gold-500 hover:text-spiritual-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 text-gold-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Info className="w-3.5 h-3.5" />
                <span>{isEn ? "Book Review & Summary" : "पुस्तक परिचय व समीक्षा"}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight">
                {isEn ? selectedBookForBlog.titleEn || selectedBookForBlog.titleHi : selectedBookForBlog.titleHi}
              </h2>
              <div className="text-xs text-gold-muted/80 mt-1">
                {isEn ? selectedBookForBlog.authorEn : selectedBookForBlog.authorHi} • {selectedBookForBlog.pages} {isEn ? "Pages" : "पृष्ठ"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-gold-500/30 text-xs sm:text-sm text-spiritual-ivory/90 leading-relaxed space-y-3 font-devanagari">
              <p className="font-semibold text-gold-300">
                {isEn ? "Editor's Review / About the Scripture:" : "आश्रम शोध पीठ द्वारा पुस्तक परिचय:"}
              </p>
              <p className="whitespace-pre-line">
                {isEn
                  ? selectedBookForBlog.bookBlogEn || selectedBookForBlog.bookBlogHi
                  : selectedBookForBlog.bookBlogHi || selectedBookForBlog.bookBlogEn}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <a
                href={selectedBookForBlog.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isEn ? "Open PDF Document" : "PDF ग्रन्थ खोलें"}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-spiritual-dark flex items-center justify-center text-gold-300">Loading...</div>}>
      <LibraryContent />
    </Suspense>
  );
}
