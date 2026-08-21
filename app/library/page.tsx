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

// Safe category sync helper wrapped in Suspense
function CategoryParamSync({ onCategoryChange }: { onCategoryChange: (cat: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) onCategoryChange(cat);
  }, [searchParams, onCategoryChange]);
  return null;
}

export const isPdfAvailable = (url?: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  return lower !== "" && lower !== "#";
};

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
      <Suspense fallback={null}>
        <CategoryParamSync onCategoryChange={setSelectedCategory} />
      </Suspense>

      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Header Banner */}
      <section className="pt-32 pb-14 bg-gradient-to-b from-spiritual-navy/90 via-spiritual-navy/50 to-transparent border-b border-gold-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            {isEn ? "Sacred PDF Digital Library" : "ई-ग्रंथालय एवं पावन साहित्य"}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold-gradient font-spiritual-heading leading-normal py-1 overflow-visible mb-4">
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

      {/* Main Content Area */}
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

        {/* Books Grid or Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="spiritual-glass-card rounded-3xl p-12 text-center max-w-md mx-auto border border-gold-500/30 space-y-4">
            <BookOpen className="w-12 h-12 text-gold-400/50 mx-auto" />
            <p className="text-sm sm:text-base text-spiritual-ivory/80">
              {isEn ? "No books found matching your criteria." : "आपकी खोज के अनुसार कोई पुस्तक नहीं मिली।"}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-5 py-2 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold hover:bg-gold-500 hover:text-spiritual-dark transition-colors"
            >
              {isEn ? "Reset Filters" : "सभी पुस्तकें देखें"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => {
              const hasLivePdf = isPdfAvailable(book.pdfUrl);

              return (
                <div
                  key={book.id}
                  className="spiritual-glass-card rounded-3xl overflow-hidden border border-gold-500/30 flex flex-col justify-between group hover:border-gold-400 transition-all duration-300 shadow-xl"
                >
                  {/* Book Cover */}
                  <div className="relative h-60 w-full bg-black/60 overflow-hidden">
                    <Image
                      src={book.coverUrl || "/assets/paramdham-mandala.png"}
                      alt={isEn ? book.titleEn || book.titleHi : book.titleHi}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-spiritual-navy via-transparent to-transparent" />

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
                      <Link
                        href={`/library/reader/${book.id}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-gold-sm hover:scale-[1.02] transition-transform"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{isEn ? "Read Online" : "ऑनलाइन पढ़ें"}</span>
                      </Link>

                      {hasLivePdf ? (
                        <a
                          href={book.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-spiritual-card border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                          title={isEn ? "Download PDF" : "PDF डाउनलोड करें"}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isEn ? "Download" : "डाउनलोड"}</span>
                        </a>
                      ) : (
                        <div
                          className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-spiritual-ivory/40 text-xs font-semibold inline-flex items-center gap-1"
                          title={isEn ? "Digital edition only" : "डिजिटल संस्करण उपलब्ध"}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isEn ? "E-Book" : "ई-बुक"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Book Review / Description Modal */}
      {selectedBookForBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedBookForBlog(null)}
        >
          <div
            className="spiritual-glass-card rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-2 border-gold-400/50 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gold-500/30">
              <div className="flex items-center gap-2 text-gold-300">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h3 className="text-lg font-bold text-gold-gradient font-spiritual-heading">
                  {isEn
                    ? selectedBookForBlog.titleEn || selectedBookForBlog.titleHi
                    : selectedBookForBlog.titleHi}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookForBlog(null)}
                className="p-1 rounded-full text-spiritual-ivory/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-spiritual-ivory/90 leading-relaxed">
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
              {isPdfAvailable(selectedBookForBlog.pdfUrl) ? (
                <Link
                  href={`/library/reader/${selectedBookForBlog.id}`}
                  className="px-5 py-2.5 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isEn ? "Open PDF Document" : "PDF ग्रन्थ खोलें"}</span>
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
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
