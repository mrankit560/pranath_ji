"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@/lib/data/types";
import { isPdfAvailable } from "@/lib/utils/isPdfAvailable";
import { BookOpen, Download, FileText, Sparkles } from "lucide-react";

interface BookCard3DProps {
  book: Book;
  isEn?: boolean;
}

export const BookCard3D: React.FC<BookCard3DProps> = ({ book, isEn = false }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / (rect.height / 2)) * 14;
    const rotateY = (x / (rect.width / 2)) * 14;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const hasLivePdf = isPdfAvailable(book.pdfUrl);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="book-3d-container spiritual-glass-card rounded-3xl p-5 sm:p-6 border border-gold-500/30 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* 3D Holographic Corner Shimmer */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-gold-400/20 transition-all" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs text-gold-300 font-semibold mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 uppercase text-[10px] tracking-wider font-bold">
            {isEn
              ? book.category.replace("_", " ")
              : book.category === "tartam_vani"
              ? "तारतम वाणी"
              : book.category === "bitak_saheb"
              ? "श्री बीतक साहेब"
              : book.category === "meditation"
              ? "चितवनी ध्यान"
              : book.category === "philosophy"
              ? "ब्रह्मज्ञान तत्व"
              : "आध्यात्मिक ग्रन्थ"}
          </span>
          <span className="text-[11px] text-spiritual-ivory/70 font-mono">
            {book.pages} {isEn ? "Pages" : "पृष्ठ"}
          </span>
        </div>

        {/* 3D Book Graphic Centerpiece */}
        <div className="relative py-3 flex items-center justify-center my-2">
          <div
            className="book-3d-cover relative w-32 h-44 sm:w-36 sm:h-50 rounded-xl overflow-visible cursor-pointer transition-transform duration-300"
            style={{
              transform: isHovered
                ? `rotateX(${rotate.x}deg) rotateY(${rotate.y - 12}deg) translateZ(25px)`
                : "rotateY(-6deg) rotateX(2deg)",
            }}
          >
            {/* 3D Spine */}
            <div className="book-3d-spine" />

            {/* 3D Paper Edges */}
            <div className="book-3d-pages" />

            {/* Book Cover Surface */}
            <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-gold-400/50 shadow-2xl bg-black">
              <Image
                src={book.coverUrl || "/assets/paramdham-mandala.png"}
                alt={isEn ? book.titleEn || book.titleHi : book.titleHi}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dynamic Golden Specular Reflection */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  transform: `translate(${rotate.y * 3}px, ${-rotate.x * 3}px)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Book Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-spiritual-ivory group-hover:text-gold-300 transition-colors font-spiritual-heading mb-1.5 mt-3 text-center sm:text-left leading-snug">
          {isEn ? book.titleEn || book.titleHi : book.titleHi}
        </h3>

        <div className="text-[11px] text-gold-muted/90 font-medium mb-2 text-center sm:text-left">
          {isEn ? book.authorEn : book.authorHi}
        </div>

        <p className="text-xs text-spiritual-ivory/70 line-clamp-2 leading-relaxed mb-4 text-center sm:text-left">
          {isEn ? book.descriptionEn || book.descriptionHi : book.descriptionHi}
        </p>
      </div>

      {/* Card Bottom Actions: Read Online & Download PDF */}
      <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between gap-2">
        <Link
          href={`/library/reader/${book.id}`}
          className="px-3.5 py-1.5 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold inline-flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
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
            className="px-3 py-1.5 rounded-xl bg-spiritual-card border border-gold-500/30 text-gold-300 hover:text-white hover:bg-gold-500/20 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isEn ? "PDF" : "डाउनलोड"}</span>
          </a>
        ) : (
          <Link
            href={`/library/reader/${book.id}`}
            className="text-xs text-spiritual-ivory/60 hover:text-gold-300 inline-flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isEn ? "E-Book" : "ई-ग्रंथ"}</span>
          </Link>
        )}
      </div>
    </div>
  );
};
