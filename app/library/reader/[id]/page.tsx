"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Book } from "@/lib/data/types";
import { BookOpen, ArrowLeft } from "lucide-react";
import { InteractiveSahityaReader } from "@/components/library/InteractiveSahityaReader";

export default function PDFReaderPage() {
  const params = useParams();
  const { language } = useI18n();
  const isEn = language === "en";
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | undefined>(undefined);

  useEffect(() => {
    const updateReaderBook = () => {
      const found = store.getBookById(bookId);
      if (found) {
        setBook(found);
      }
    };
    updateReaderBook();
    const unsub = store.subscribe(updateReaderBook);
    return () => unsub();
  }, [bookId]);

  if (!book) {
    return (
      <main className="min-h-screen bg-surface text-ink flex items-center justify-center p-4">
        <div className="text-center spiritual-glass-card rounded-3xl p-8 max-w-md border border-line shadow-2xl">
          <BookOpen className="w-12 h-12 text-gold-700 mx-auto mb-3 animate-pulse" />
          <h2 className="text-xl font-bold text-ink font-spiritual-heading mb-2">
            {isEn ? "Loading Sacred Scripture..." : "पावन ग्रन्थ लोड हो रहा है..."}
          </h2>
          <p className="text-xs text-ink/65 mb-4">
            {isEn
              ? "Preparing pages, chapters, and divine commentary."
              : "ग्रन्थ के पृष्ठ, अध्याय एवं टीका संकलित की जा रही है..."}
          </p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-gradient text-on-gold text-xs font-bold shadow-gold-sm hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? "Return to Library" : "लाइब्रेरी पर लौटें"}</span>
          </Link>
        </div>
      </main>
    );
  }

  return <InteractiveSahityaReader book={book} />;
}
