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
  Clock,
} from "lucide-react";

import { isPdfAvailable } from "@/lib/utils/isPdfAvailable";
import { BookCard3D } from "@/components/3d/BookCard3D";

// Safe category sync helper wrapped in Suspense
function CategoryParamSync({ onCategoryChange }: { onCategoryChange: (cat: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) onCategoryChange(cat);
  }, [searchParams, onCategoryChange]);
  return null;
}

export default function LibraryPage() {
  const { t, language } = useI18n();
  const isEn = language === "en";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>(() => store.getBooks());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookForBlog, setSelectedBookForBlog] = useState<Book | null>(null);

  useEffect(() => {
    setBooks(store.getBooks());
    const unsub = store.subscribe(() => {
      setBooks(store.getBooks());
    });
    return () => unsub();
  }, []);

  const categories = [
    { id: "all", label: isEn ? "All Literature" : "सम्पूर्ण साहित्य" },
    { id: "bitak_saheb", label: isEn ? "Shri Bitak Saheb" : "श्री बीतक साहेब" },
    { id: "tartam_vani", label: isEn ? "Tartam Vani" : "तारतम वाणी" },
    { id: "other", label: isEn ? "Other Sacred Books" : "अन्य पुस्तकें" },
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
    <main className="min-h-screen bg-surface text-ink">
      <Suspense fallback={null}>
        <CategoryParamSync onCategoryChange={setSelectedCategory} />
      </Suspense>

      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Header Banner */}
      <section className="pt-32 pb-14 bg-gradient-to-b from-surface-2/90 via-surface-2/50 to-transparent border-b border-line text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/45 text-gold-700 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-gold-700" />
            {isEn ? "Literature & Sacred Scriptures" : "पावन साहित्य एवं ई-ग्रंथालय"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-1 overflow-visible mb-4">
            {isEn ? "Sacred Literature & Granths" : "साहित्य — ऑनलाइन पढ़ें व डाउनलोड करें"}
          </h1>

          <p className="text-xs sm:text-base text-gold-muted/80 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Read and download holy scriptures including Shri Bitak Saheb, Tartam Vani commentaries, and spiritual literature."
              : "श्री बीतक साहेब, तारतम वाणी के १४ ग्रन्थ, टीकाएं, एवं साधना पुस्तकें ऑनलाइन पढ़ें और डाउनलोड करें।"}
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-gold-700 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search by title or author..." : "पुस्तक या लेखक का नाम खोजें..."}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-field border border-line text-xs sm:text-sm text-ink placeholder-ink/60 focus:outline-none focus:border-gold-400 backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto pb-4 mb-10 border-b border-line">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-gold-gradient text-on-gold shadow-gold-sm font-bold scale-105"
                  : "bg-card border border-line text-ink/80 hover:text-gold-700 hover:border-gold-400/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Books Grid or Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="spiritual-glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-line space-y-4">
            <BookOpen className="w-12 h-12 text-gold-700/50 mx-auto" />
            <p className="text-sm sm:text-base text-ink/80">
              {isEn ? "No books found matching your criteria." : "आपकी खोज के अनुसार कोई पुस्तक नहीं मिली।"}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-5 py-2 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-700 text-xs font-bold hover:bg-gold-500 hover:text-on-gold transition-colors"
            >
              {isEn ? "Reset Filters" : "सभी पुस्तकें देखें"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <BookCard3D key={book.id} book={book} isEn={isEn} />
            ))}
          </div>
        )}
      </section>

      {/* Book Review / Description Modal */}
      {selectedBookForBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/55 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedBookForBlog(null)}
        >
          <div
            className="spiritual-glass-card rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-2 border-gold-400/50 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2 text-gold-700">
                <Sparkles className="w-4 h-4 text-gold-700" />
                <h3 className="text-lg font-bold text-gold-gradient font-spiritual-heading">
                  {isEn
                    ? selectedBookForBlog.titleEn || selectedBookForBlog.titleHi
                    : selectedBookForBlog.titleHi}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookForBlog(null)}
                className="p-1 rounded-full text-ink/70 hover:text-gold-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-ink/90 leading-relaxed">
              <p className="font-semibold text-gold-700">
                {isEn ? "Editor's Review / About the Scripture:" : "आश्रम शोध पीठ द्वारा पुस्तक परिचय:"}
              </p>
              <p className="whitespace-pre-line">
                {isEn
                  ? selectedBookForBlog.bookBlogEn || selectedBookForBlog.bookBlogHi
                  : selectedBookForBlog.bookBlogHi || selectedBookForBlog.bookBlogEn}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              {isPdfAvailable(selectedBookForBlog.pdfUrl) ? (
                <Link
                  href={`/library/reader/${selectedBookForBlog.id}`}
                  className="px-5 py-2.5 rounded-full bg-gold-gradient text-on-gold font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isEn ? "Open PDF Document" : "PDF ग्रन्थ खोलें"}</span>
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-full bg-gold-500/15 border border-gold-400/45 text-gold-700 text-xs font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isEn ? "PDF Coming Soon" : "PDF शीघ्र उपलब्ध होगा"}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
