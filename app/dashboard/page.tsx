"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import {
  User,
  Bookmark,
  BookOpen,
  Clock,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const [readingHistory, setReadingHistory] = useState(store.getReadingHistory());
  const [bookmarks, setBookmarks] = useState<string[]>(store.getBookmarks());
  const books = store.getBooks();

  const bookmarkedBooks = books.filter((b) => bookmarks.includes(b.id));

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("prannath_user_role");
      localStorage.removeItem("prannath_user_email");
    }
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory flex flex-col justify-between">
      <Navbar onOpenSearch={() => {}} />

      <div className="pt-32 pb-16 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        {/* User Header Card */}
        <div className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-gold-gradient text-spiritual-dark flex items-center justify-center font-bold text-2xl shadow-gold-sm flex-shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-gold-400" />
                साधक प्रोफाइल (Seeker)
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gold-gradient font-spiritual-heading">
                साधक सदस्य
              </h1>
              <p className="text-xs text-spiritual-ivory/70 font-medium">
                {language === "hi" ? "श्री प्राणनाथ जी वाणी" : "Shri Prannath Ji Vani"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs flex items-center gap-1.5 transition-colors"
              title="लॉगआउट"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === "hi" ? "लॉगआउट" : "Log Out"}</span>
            </button>
          </div>
        </div>

        {/* Continue Reading Section */}
        <div className="space-y-6 mb-10">
          <h2 className="text-lg font-bold text-gold-300 font-spiritual-heading flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-400" />
            <span>पिछला अध्ययन जारी रखें (Continue Reading)</span>
          </h2>

          {readingHistory.length === 0 ? (
            <div className="p-6 rounded-2xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/60 text-center">
              कोई पिछला अध्ययन इतिहास नहीं है। ग्रंथालय से पुस्तक पढ़ना आरंभ करें।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {readingHistory.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/library/reader/${item.bookId}`}
                  className="p-4 rounded-2xl bg-spiritual-card border border-gold-500/25 hover:border-gold-400/50 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-gold-400 font-mono mt-0.5">
                      पृष्ठ {item.page} से आगे पढ़ें
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Saved Bookmarks */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gold-300 font-spiritual-heading flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-gold-400" />
            <span>सुरक्षित की गई पुस्तकें (Saved Bookmarks)</span>
          </h2>

          {bookmarkedBooks.length === 0 ? (
            <div className="p-6 rounded-2xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/60 text-center">
              आपने अभी कोई पुस्तक बुकमार्क नहीं की है।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-4 rounded-2xl bg-spiritual-card border border-gold-500/25 space-y-3"
                >
                  <h3 className="text-xs sm:text-sm font-bold text-spiritual-ivory">
                    {language === "hi" ? book.titleHi : book.titleEn}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-gold-500/20">
                    <Link
                      href={`/library/reader/${book.id}`}
                      className="text-xs font-bold text-gold-300 hover:underline"
                    >
                      पढ़ें
                    </Link>
                    <span className="text-[10px] text-spiritual-ivory/50">
                      {book.pages} पृष्ठ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
