"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Book } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import {
  ArrowLeft,
  BookOpen,
  Download,
  Bookmark,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  RotateCw,
  Sun,
  Moon,
  Sparkles,
  List,
  X,
  Share2,
  Check,
  FileText,
  ExternalLink,
  Printer,
  Compass,
  SlidersHorizontal,
} from "lucide-react";

interface InteractiveSahityaReaderProps {
  book: Book;
}

// Authentic chapter & verse definitions for sacred scriptures
interface ChapterData {
  num: number;
  titleHi: string;
  titleEn: string;
  verses: {
    num: number;
    chaupai: string;
    bhavarthHi: string;
    meaningEn: string;
  }[];
}

const BOOK_CHAPTERS_MAP: Record<string, ChapterData[]> = {
  "book-bitak-saheb": [
    {
      num: 1,
      titleHi: "प्रकरण १: सद्गुरु श्री देवचन्द्र जी प्राकट्य एवं बाल्यकाल",
      titleEn: "Chapter 1: Divine Manifestation of Sadguru Shri Devchandra Ji",
      verses: [
        {
          num: 1,
          chaupai: "प्रथम प्रणाम लागू निरंकार, जिनका नाम अक्षरातीत पार।\nकोटि भानु सम तेज अपारा, सब सखियों का प्राण अधारा॥",
          bhavarthHi: "सर्वप्रथम उन निराकार, सर्वशक्तिमान अक्षरातीत परब्रह्म को नतमस्तक होकर प्रणाम है, जिनका तेज करोड़ों सूर्यों के समान अपरिमित है और जो समस्त आत्म-सखियों के प्राणों के आधार हैं।",
          meaningEn: "First and foremost, I bow to the Supreme Transcendent Being, Aksharatit Paramdham, whose radiance surpasses millions of suns and who sustains all souls.",
        },
        {
          num: 2,
          chaupai: "संवत सोलह सौ अठतीसा, उमरकोट प्रगटे जगदीशा।\nमात कुँवर बाई पितु मट्टू, सद्गुरु रूप लियो प्रभु खट्टू॥",
          bhavarthHi: "विक्रम संवत् १६३८ में उमरकोट नगर में माता कुँवर बाई एवं पिता मट्टू जी के गृह में सद्गुरु श्री देवचन्द्र जी का प्राकट्य हुआ।",
          meaningEn: "In the year 1638 of the Vikram era, Sadguru Devchandra Ji manifested in Umarkot to awaken the wandering souls.",
        },
        {
          num: 3,
          chaupai: "बाल्यकाल से हरि चित्त लागा, माया मोह सब दूर ही भागा।\nसत्य खोज में मारवाड़ आए, नौतनपुरी में साधन पाए॥",
          bhavarthHi: "बाल्यावस्था से ही सद्गुरु जी का मन सांसारिक मोह से विरक्त होकर केवल परम सत्य की खोज में रत रहा। वे मारवाड़ होते हुए जामनगर (नौतनपुरी) पधारे।",
          meaningEn: "From childhood, divine contemplation was his solace. Seeking the ultimate truth, he traveled from Marwar to Jamnagar.",
        },
      ],
    },
    {
      num: 2,
      titleHi: "प्रकरण २: महामति श्री प्राणनाथ जी का बाल्य प्राकट्य एवं तारतम प्राप्ति",
      titleEn: "Chapter 2: Divine Advent of Mahamati Shri Prannath Ji",
      verses: [
        {
          num: 1,
          chaupai: "संवत सोलह सौ पिचहत्तर, जामनगर में प्रकटे ईश्वर।\nकेशव ठाकुर दीवान के द्वारा, मेहेराज रूप लियो अवतारा॥",
          bhavarthHi: "संवत् १६७५ में जामनगर के प्रतिष्ठित दीवान श्री केशव ठाकुर जी के यहाँ श्री मेहेराज ठाकुर (महामति प्राणनाथ जी) का अवतार हुआ।",
          meaningEn: "In 1675 Vikrami (1618 CE), Mahamati Prannath Ji appeared in Jamnagar as the son of Dewan Keshav Thakur.",
        },
        {
          num: 2,
          chaupai: "सद्गुरु चरणन शीश नवावा, तारतम मन्त्र महासुख पावा।\nअक्षरातीत का भेद लखाया, परमधाम का पंथ दिखाया॥",
          bhavarthHi: "श्री मेहेराज जी ने सद्गुरु श्री देवचन्द्र जी के चरणों में आत्म-समर्पण किया और 'तारतम मन्त्र' प्राप्त कर परमधाम के २५ पक्षों का साक्षात साक्षात्कार किया।",
          meaningEn: "He surrendered at the lotus feet of Sadguru Devchandra Ji, receiving the Tartam Mantra revealing the Supreme Realm.",
        },
      ],
    },
    {
      num: 3,
      titleHi: "प्रकरण ३: अरब देश यात्रा एवं दिव्य तारतम वाणी का अवतरण",
      titleEn: "Chapter 3: Western Travels & Revelation of Sacred Tartam Vani",
      verses: [
        {
          num: 1,
          chaupai: "अरब देश में गमन कराया, मस्कट अब्बास में ज्ञान जगाया।\nसूरत नगर में वाणी आई, जन जन में जागनी फैलाई॥",
          bhavarthHi: "महामति जी ने अरब सागर पार कर मस्कट और अब्बास की यात्रा की। तदुपरांत सूरत नगर में चौदह ग्रन्थों की पावन तारतम वाणी का प्राकट्य हुआ।",
          meaningEn: "Mahamati Ji traversed the seas to Muscat and Bandar Abbas, establishing the foundation of universal spiritual unity.",
        },
        {
          num: 2,
          chaupai: "रास प्रकाश षट्ऋतु कलशा, सनंध खुलासा मारफत दर्शा।\nचौदह ग्रन्थ अमोलक बानी, अखंड ब्रह्म रस अमृत खानी॥",
          bhavarthHi: "श्री रास, प्रकाश, षट्ऋतु, कलश, सनंध, खुलासा, मारफत आदि १४ पावन ग्रन्थों में अखंड ब्रह्मज्ञान की अविरल अमृतधारा प्रवाहित हुई।",
          meaningEn: "The 14 sacred books including Raas, Prakash, and Sanandh manifested as an eternal fountain of supreme spiritual wisdom.",
        },
      ],
    },
    {
      num: 4,
      titleHi: "प्रकरण ४: हरिद्वार महाकुम्भ एवं पन्ना धाम में छत्रसाल मिलन",
      titleEn: "Chapter 4: Haridwar Mahakumbh Victory & Union with Chhatrasal at Panna",
      verses: [
        {
          num: 1,
          chaupai: "हरिद्वार महाकुम्भ पधारे, पंडित विद्वान सब निस्तारे।\nवेद उपनिषद सार सुनाया, एकेश्वर का पंथ दृढ़ाया॥",
          bhavarthHi: "हरिद्वार में महाकुम्भ के पावन अवसर पर महामति जी ने समस्त विद्वानों और सन्यासियों को वेद-कुरान का एकत्व समझाकर जाग्रत किया।",
          meaningEn: "At the historic Haridwar Mahakumbh, Mahamati Ji unified Vedic scholars with the revelation of the One Supreme Reality.",
        },
        {
          num: 2,
          chaupai: "पद्मावती पुरी पन्ना आए, छत्रसाल नृप शरणे धाए।\nदीन्ही खड्ग वरदान अपारा, भारत भूमि का ताप संहारा॥",
          bhavarthHi: "पन्ना धाम में महाराजा छत्रसाल जी ने महामति जी की शरण ग्रहण की। महामति जी ने उन्हें दिव्य शक्ति और तलवार प्रदान कर धर्म रक्षा का वरदान दिया।",
          meaningEn: "At Panna Dham, Maharaja Chhatrasal bowed before Mahamati Ji, receiving the divine sword and blessings to protect righteousness.",
        },
      ],
    },
  ],
  "book-prakash-teeka": [
    {
      num: 1,
      titleHi: "प्रकाश प्रकरण १: मंगलाचरण एवं सद्गुरु वंदना",
      titleEn: "Prakash Chapter 1: Invocation & Devotion to Sadguru",
      verses: [
        {
          num: 1,
          chaupai: "श्री मुख वाणी प्रकाश ग्रन्था, पावन करे सब जीवन पंथा।\nअज्ञान अंधेरा तुरत नसावे, आत्म ज्ञान को दीप जलावे॥",
          bhavarthHi: "श्री मुख वाणी प्रकाश ग्रन्थ समस्त साधकों के मार्ग को आलोकित करता है और आत्मा के अंधकार को मिटाकर ज्ञान का दीपक प्रज्वलित करता है।",
          meaningEn: "The sacred verses of Shri Prakash Granth illuminate the path of seekers and banish spiritual ignorance.",
        },
        {
          num: 2,
          chaupai: "सद्गुरु चरण कमल बलिहारी, जिनने काटी विपदा भारी।\nअक्षरातीत का रूप लखाया, अखंड परमधाम पहुँचाया॥",
          bhavarthHi: "सद्गुरु के चरण कमलों की बलिहारी है, जिन्होंने हमारे समस्त दुखों को हरकर हमें परमधाम का साक्षात्कार कराया।",
          meaningEn: "All glory to the lotus feet of Sadguru who revealed the eternal abode and the supreme love of Aksharatit.",
        },
      ],
    },
    {
      num: 2,
      titleHi: "प्रकाश प्रकरण २: प्रेम, सेवा और आत्म-समर्पण",
      titleEn: "Prakash Chapter 2: Divine Love, Selfless Service & Surrender",
      verses: [
        {
          num: 1,
          chaupai: "प्रेम बिना प्रभु मिले न कोई, कोटि यत्न कर क्यों नहिं रोई।\nसेवा से ही मन पावन होई, निर्मल चित्त परम सुख सोई॥",
          bhavarthHi: "बिना सच्चे और निष्काम प्रेम के ईश्वर की प्राप्ति असंभव है। सेवा ही मन को शुद्ध करती है और निर्मल चित्त ही परमानंद पाता है।",
          meaningEn: "Without pure divine love, no effort leads to spiritual fulfillment. Selfless service purifies the soul.",
        },
      ],
    },
  ],
  "default": [
    {
      num: 1,
      titleHi: "अध्याय १: पावन मंगलाचरण एवं ग्रन्थ महात्म्य",
      titleEn: "Chapter 1: Sacred Invocation & Scripture Importance",
      verses: [
        {
          num: 1,
          chaupai: "श्री प्राणनाथ जी चरण कमल में, नित प्रति वंदना हमारी।\nतारतम वाणी अमृत रस बरसे, पावन होय संसारी॥",
          bhavarthHi: "महामति श्री प्राणनाथ जी के पावन चरण कमलों में हमारी नित्य वंदना है। उनकी अमृतमय वाणी समस्त संसार का कल्याण करने वाली है।",
          meaningEn: "We bow continually to the lotus feet of Mahamati Shri Prannath Ji whose sacred words bestow liberation upon all souls.",
        },
        {
          num: 2,
          chaupai: "सत्य, प्रेम और सेवा का मार्ग, सद्गुरु ने दर्शाया।\nसाढौली धाम की पावन रज ने, अंतर में ज्ञान जगाया॥",
          bhavarthHi: "सद्गुरु ने सत्य, निष्काम प्रेम और सेवा का पवित्र मार्ग दिखाया है। साढौली धाम की पावन धरा अंतर में ज्ञान का संचार करती है।",
          meaningEn: "Sadguru revealed the eternal path of truth, love, and service, awakened in the sacred sanctuary of Sadhauli Dham.",
        },
      ],
    },
  ],
};

export const InteractiveSahityaReader: React.FC<InteractiveSahityaReaderProps> = ({ book }) => {
  const router = useRouter();
  const { language } = useI18n();
  const isEn = language === "en";

  const readerContainerRef = useRef<HTMLDivElement>(null);
  const pdfFrameRef = useRef<HTMLIFrameElement>(null);

  // Reader States
  const [viewMode, setViewMode] = useState<"granth" | "pdf">(() => (book.pdfUrl && book.pdfUrl !== "#" ? "pdf" : "granth"));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>("1");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [readingTheme, setReadingTheme] = useState<"parchment" | "midnight" | "light">("parchment");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const totalPages = book.pages || 180;

  // Resolve chapters
  const chapters = useMemo(() => {
    return BOOK_CHAPTERS_MAP[book.id] || BOOK_CHAPTERS_MAP["book-bitak-saheb"] || BOOK_CHAPTERS_MAP["default"];
  }, [book.id]);

  // Clean PDF URL
  const cleanPdfUrl = useMemo(() => {
    if (!book.pdfUrl || book.pdfUrl === "#") return "";
    return book.pdfUrl;
  }, [book.pdfUrl]);

  const hasLivePdf = Boolean(cleanPdfUrl && cleanPdfUrl.trim() !== "");

  // Bookmark Sync
  useEffect(() => {
    const bms = store.getBookmarks();
    setIsBookmarked(bms.includes(book.id));
  }, [book.id]);

  // Sync Fullscreen State
  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (readerContainerRef.current?.requestFullscreen) {
        readerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleBookmark = () => {
    const active = store.toggleBookmark(book.id);
    setIsBookmarked(active);
    showToast(
      active
        ? isEn
          ? "✓ Added to your sacred bookmarks!"
          : "✓ ग्रन्थ बुकमार्क में सुरक्षित किया गया!"
        : isEn
        ? "✓ Removed from bookmarks."
        : "✓ बुकमार्क हटाया गया।"
    );
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast(isEn ? "Link copied to clipboard!" : "ग्रन्थ लिंक कॉपी हो गया!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Paging Handlers
  const goToPage = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
    setPageInput(String(target));
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (!isNaN(num)) {
      goToPage(num);
    }
  };

  // Zoom Handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  // Filtered chapters according to search query
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase();
    return chapters
      .map((ch) => {
        const matchesTitle = ch.titleHi.toLowerCase().includes(q) || ch.titleEn.toLowerCase().includes(q);
        const matchedVerses = ch.verses.filter(
          (v) =>
            v.chaupai.toLowerCase().includes(q) ||
            v.bhavarthHi.toLowerCase().includes(q) ||
            v.meaningEn.toLowerCase().includes(q)
        );
        if (matchesTitle || matchedVerses.length > 0) {
          return {
            ...ch,
            verses: matchedVerses.length > 0 ? matchedVerses : ch.verses,
          };
        }
        return null;
      })
      .filter(Boolean) as ChapterData[];
  }, [chapters, searchQuery]);

  // Dynamic Theme CSS styles
  const themeStyles = useMemo(() => {
    switch (readingTheme) {
      case "midnight":
        return {
          bg: "bg-[#0f1115]",
          surface: "bg-[#181b22]",
          text: "text-amber-100",
          border: "border-amber-900/40",
          accent: "text-amber-400",
          parchment: "bg-[#14171e] text-amber-100",
        };
      case "light":
        return {
          bg: "bg-[#f8f9fa]",
          surface: "bg-white",
          text: "text-neutral-900",
          border: "border-neutral-200",
          accent: "text-amber-700",
          parchment: "bg-white text-neutral-900",
        };
      case "parchment":
      default:
        return {
          bg: "bg-[#fbf7ee]",
          surface: "bg-[#f6eee0]",
          text: "text-[#342817]",
          border: "border-[#e3d1b3]",
          accent: "text-[#8a5b12]",
          parchment: "bg-[#fefbf4] text-[#2f2212]",
        };
    }
  }, [readingTheme]);

  return (
    <div
      ref={readerContainerRef}
      className={`min-h-screen flex flex-col justify-between transition-colors duration-300 font-devanagari select-text ${themeStyles.bg}`}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] px-5 py-2.5 rounded-full bg-gold-gradient text-on-gold text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reader Interactive Toolbar */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${themeStyles.border} ${themeStyles.surface} px-3 sm:px-6 py-2 transition-colors`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Back & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => router.push("/library")}
              className={`p-2 rounded-xl border ${themeStyles.border} hover:bg-gold-500/15 text-gold-700 flex items-center gap-1.5 text-xs font-bold transition-all shrink-0`}
              title={isEn ? "Back to Library" : "लाइब्रेरी पर लौटें"}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{isEn ? "Library" : "साहित्य"}</span>
            </button>

            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setShowToc(!showToc)}
              className={`p-2 rounded-xl border ${themeStyles.border} hover:bg-gold-500/15 text-gold-700 flex items-center gap-1.5 text-xs font-bold transition-all shrink-0`}
              title={isEn ? "Table of Contents" : "अनुक्रमणिका / अध्याय"}
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">{isEn ? "Contents" : "अध्याय"}</span>
            </button>

            <div className="truncate">
              <h1 className="text-xs sm:text-sm font-bold text-gold-800 truncate font-spiritual-heading leading-tight">
                {isEn ? book.titleEn || book.titleHi : book.titleHi}
              </h1>
              <span className="text-[10px] text-ink/65 truncate block">
                {isEn ? book.authorEn : book.authorHi} • {totalPages} {isEn ? "Pages" : "पृष्ठ"}
              </span>
            </div>
          </div>

          {/* Center: Search & Page Navigation */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Search Scripture Modal / Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gold-700 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search in book..." : "ग्रन्थ में खोजें..."}
                className={`pl-8 pr-3 py-1.5 rounded-xl border ${themeStyles.border} bg-field text-xs text-ink placeholder-ink/50 focus:outline-none focus:border-gold-400 w-32 sm:w-44 transition-all`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Jump to Page & Nav Buttons */}
            <div className={`flex items-center gap-1 px-1 py-0.5 rounded-xl border ${themeStyles.border} bg-surface-sunk/60 text-xs`}>
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 disabled:opacity-30"
                title="First Page (|<<)"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 disabled:opacity-30"
                title="Previous Page (<)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1">
                <input
                  type="text"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className={`w-10 sm:w-12 text-center py-0.5 rounded-lg border ${themeStyles.border} bg-field text-xs font-bold text-ink focus:outline-none focus:border-gold-400`}
                />
                <span className="text-[11px] text-ink/60 font-semibold px-0.5">/ {totalPages}</span>
              </form>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 disabled:opacity-30"
                title="Next Page (>)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15 disabled:opacity-30"
                title="Last Page (>>|)"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Zoom, Theme, View Modes, Download, Fullscreen */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            {/* View Mode Toggle: Flipbook / Granth vs Real PDF */}
            {hasLivePdf && (
              <div className={`flex items-center p-0.5 rounded-xl border ${themeStyles.border} bg-field text-xs`}>
                <button
                  onClick={() => setViewMode("pdf")}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    viewMode === "pdf"
                      ? "bg-gold-gradient text-on-gold shadow-gold-sm"
                      : "text-ink/75 hover:text-gold-700"
                  }`}
                  title={isEn ? "Real PDF Document" : "मूल PDF ग्रन्थ"}
                >
                  <FileText className="w-3 h-3" />
                  <span className="hidden lg:inline">{isEn ? "PDF" : "PDF ग्रन्थ"}</span>
                </button>

                <button
                  onClick={() => setViewMode("granth")}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    viewMode === "granth"
                      ? "bg-gold-gradient text-on-gold shadow-gold-sm"
                      : "text-ink/75 hover:text-gold-700"
                  }`}
                  title={isEn ? "Interactive Sacred Reader" : "अन्तरक्रियात्मक वाचन"}
                >
                  <BookOpen className="w-3 h-3" />
                  <span className="hidden lg:inline">{isEn ? "Text View" : "वाणी वाचन"}</span>
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className={`hidden sm:flex items-center gap-1 p-0.5 rounded-xl border ${themeStyles.border} bg-field text-xs`}>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-1.5 py-0.5 text-[11px] font-bold text-gold-700 font-mono"
                title="Reset Zoom to 100%"
              >
                {zoomLevel}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg text-ink/75 hover:bg-gold-500/15"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reading Theme Toggle */}
            <div className={`flex items-center p-0.5 rounded-xl border ${themeStyles.border} bg-field text-xs`}>
              <button
                onClick={() => setReadingTheme("parchment")}
                className={`p-1.5 rounded-lg transition-colors ${
                  readingTheme === "parchment" ? "bg-[#e5d5b7] text-[#4d3209] shadow-sm font-bold" : "text-ink/60"
                }`}
                title="Parchment Golden Sepia Theme (Day)"
              >
                📜
              </button>
              <button
                onClick={() => setReadingTheme("midnight")}
                className={`p-1.5 rounded-lg transition-colors ${
                  readingTheme === "midnight" ? "bg-[#282d39] text-amber-300 shadow-sm font-bold" : "text-ink/60"
                }`}
                title="Midnight Temple Dark Mode (Night)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme("light")}
                className={`p-1.5 rounded-lg transition-colors ${
                  readingTheme === "light" ? "bg-white text-black shadow-sm font-bold" : "text-ink/60"
                }`}
                title="Clear Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl border ${themeStyles.border} transition-colors ${
                isBookmarked ? "bg-gold-500 text-on-gold" : "text-ink/75 hover:bg-gold-500/15"
              }`}
              title={isBookmarked ? "Bookmarked" : "Bookmark Scripture"}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Direct Download */}
            {hasLivePdf && (
              <a
                href={cleanPdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gold-gradient text-on-gold font-bold text-xs flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
                title={isEn ? "Direct PDF Download" : "PDF सीधे डाउनलोड करें"}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{isEn ? "Download PDF" : "डाउनलोड"}</span>
              </a>
            )}

            {/* Share / Copy Link */}
            <button
              onClick={handleShare}
              className={`p-2 rounded-xl border ${themeStyles.border} text-ink/75 hover:bg-gold-500/15 transition-colors`}
              title="Share Scripture Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-xl border ${themeStyles.border} text-ink/75 hover:bg-gold-500/15 transition-colors`}
              title={isFullscreen ? "Exit Fullscreen (ESC)" : "Distraction-Free Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Reading Stage */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside
            className={`w-80 sm:w-96 border-r ${themeStyles.border} ${themeStyles.surface} p-5 flex flex-col justify-between z-40 shadow-2xl animate-fade-in fixed top-[54px] bottom-0 left-0 overflow-y-auto`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
                <h3 className="text-sm font-bold text-gold-700 flex items-center gap-2 uppercase tracking-wider font-spiritual-heading">
                  <List className="w-4 h-4 text-gold-700" />
                  <span>{isEn ? "Table of Contents" : "ग्रन्थ अनुक्रमणिका व अध्याय"}</span>
                </h3>
                <button onClick={() => setShowToc(false)} className="p-1 rounded-lg text-ink/60 hover:bg-gold-500/15">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {filteredChapters.map((ch) => (
                  <button
                    key={ch.num}
                    onClick={() => {
                      goToPage(ch.num);
                      setShowToc(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      currentPage === ch.num
                        ? "bg-gold-gradient text-on-gold font-bold shadow-gold-sm border-transparent"
                        : `border-line hover:border-gold-400/50 hover:bg-gold-500/10 ${themeStyles.text}`
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs font-mono shrink-0">
                      {ch.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-snug">{ch.titleHi}</div>
                      <div className="text-[10px] opacity-75 truncate">{ch.titleEn}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-line text-[11px] text-ink/60 text-center">
              <span>{isEn ? "Sadhauli Dham Research Library" : "श्री निजानंद आश्रम, साढौली धाम शोध ग्रंथालय"}</span>
            </div>
          </aside>
        )}

        {/* Reader Centerstage */}
        <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 overflow-y-auto w-full">
          {viewMode === "pdf" && hasLivePdf ? (
            /* ========================================================================= */
            /* VIEW MODE A: REAL PDF VIEWER WITH ZOOM & MULTI-ENGINE CAPABILITIES        */
            /* ========================================================================= */
            <div
              className={`w-full max-w-6xl rounded-2xl overflow-hidden border ${themeStyles.border} shadow-2xl flex flex-col relative transition-all`}
              style={{
                height: isFullscreen ? "calc(100vh - 65px)" : "84vh",
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
            >
              {/* Mobile Quick Bar */}
              <div className="sm:hidden bg-surface-2 border-b border-line px-3 py-1.5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gold-700 font-bold flex items-center gap-1">
                  <span>📖</span>
                  <span>{isEn ? "PDF Granth" : "मूल PDF ग्रन्थ"}</span>
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={cleanPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-gold-gradient text-on-gold text-[10px] font-bold flex items-center gap-1 shadow-gold-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{isEn ? "Full Tab" : "नई विंडो"}</span>
                  </a>
                  <a
                    href={cleanPdfUrl}
                    download
                    className="px-2.5 py-1 rounded-lg bg-gold-500/20 text-gold-700 text-[10px] font-bold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{isEn ? "Save" : "डाउनलोड"}</span>
                  </a>
                </div>
              </div>

              {/* Multi-Engine PDF Embed */}
              <object
                data={`${cleanPdfUrl}#page=${currentPage}&toolbar=1&navpanes=1&statusbar=1`}
                type="application/pdf"
                className="w-full flex-1 border-0 bg-[#2b2b2b]"
              >
                <iframe
                  ref={pdfFrameRef}
                  src={`${cleanPdfUrl}#page=${currentPage}&toolbar=1&navpanes=1&statusbar=1`}
                  title={isEn ? book.titleEn || book.titleHi : book.titleHi}
                  className="w-full h-full border-0 bg-[#2b2b2b]"
                />
              </object>
            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW MODE B: INTERACTIVE SACRED SCRIPTURE READING (Flipbook/Parchment)   */
            /* ========================================================================= */
            <div
              className={`w-full max-w-4xl rounded-3xl p-6 sm:p-12 border ${themeStyles.border} shadow-2xl transition-all space-y-8 ${themeStyles.parchment}`}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
            >
              {/* Scripture Page Header */}
              <div className="text-center pb-6 border-b border-line/60 relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{book.category === "bitak_saheb" ? "श्री बीतक साहेब" : "तारतम वाणी"}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading leading-tight mb-1">
                  {isEn ? book.titleEn || book.titleHi : book.titleHi}
                </h2>

                <p className="text-xs text-gold-muted/90 font-semibold">
                  {isEn ? book.authorEn : book.authorHi} • {isEn ? "Sadhauli Dham Research Edition" : "साढौली धाम प्रामाणिक संस्करण"}
                </p>

                {/* Font Scaling Mini Bar */}
                <div className="absolute right-0 top-0 hidden sm:flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setFontSizeOffset((prev) => Math.max(prev - 1, -2))}
                    className="p-1 rounded-lg border border-line text-xs font-bold hover:bg-gold-500/15"
                    title="Smaller Font (A-)"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSizeOffset(0)}
                    className="px-1.5 py-0.5 rounded-lg border border-line text-[10px] font-bold hover:bg-gold-500/15"
                    title="Default Font"
                  >
                    100%
                  </button>
                  <button
                    onClick={() => setFontSizeOffset((prev) => Math.min(prev + 2, 6))}
                    className="p-1 rounded-lg border border-line text-xs font-bold hover:bg-gold-500/15"
                    title="Larger Font (A+)"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Verses & Commentary Section */}
              <div className="space-y-8">
                {filteredChapters.map((ch) => (
                  <div key={ch.num} className="space-y-6">
                    <div className="p-3.5 rounded-2xl bg-gold-500/15 border border-gold-400/40 text-center">
                      <h3 className="text-base sm:text-lg font-bold text-gold-800 font-spiritual-heading">
                        {ch.titleHi}
                      </h3>
                      <p className="text-[11px] text-ink/70">{ch.titleEn}</p>
                    </div>

                    <div className="space-y-6">
                      {ch.verses.map((v) => (
                        <div
                          key={v.num}
                          className="p-5 sm:p-6 rounded-2xl border border-line/60 bg-surface-sunk/30 space-y-3 relative hover:border-gold-400/50 transition-colors"
                        >
                          {/* Verse Index Pill */}
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-800 text-[10px] font-bold uppercase">
                            {isEn ? `Verse ${v.num}` : `चौपाई ${v.num}`}
                          </span>

                          {/* Chaupai Poetry */}
                          <blockquote
                            className="font-spiritual-heading font-extrabold text-gold-900 leading-relaxed whitespace-pre-line tracking-wide"
                            style={{ fontSize: `${17 + fontSizeOffset}px` }}
                          >
                            {v.chaupai}
                          </blockquote>

                          {/* Meaning / Bhavarth */}
                          <div
                            className="text-ink/85 leading-relaxed pt-2 border-t border-line/40 space-y-1.5"
                            style={{ fontSize: `${13 + fontSizeOffset}px` }}
                          >
                            <p className="font-semibold text-gold-700 text-xs">
                              {isEn ? "Spiritual Meaning:" : "भावार्थ:"}
                            </p>
                            <p>{v.bhavarthHi}</p>
                            {v.meaningEn && (
                              <p className="text-xs text-ink/65 italic pt-1">{v.meaningEn}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Scrubber & Navigation */}
              <div className="pt-6 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-5 py-2.5 rounded-xl border border-line text-xs font-bold flex items-center gap-2 hover:bg-gold-500/15 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isEn ? "Previous Chapter" : "पिछला प्रकरण"}</span>
                </button>

                <div className="text-xs text-ink/70 font-semibold font-mono">
                  {isEn ? `Page ${currentPage} of ${totalPages}` : `पृष्ठ ${currentPage} / ${totalPages}`}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient text-on-gold text-xs font-bold flex items-center gap-2 shadow-gold-sm hover:scale-105 transition-transform disabled:opacity-40"
                >
                  <span>{isEn ? "Next Chapter" : "अगला प्रकरण"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Reader Bottom Scrubber Strip */}
      <footer className={`border-t ${themeStyles.border} ${themeStyles.surface} px-4 py-2 flex items-center justify-between gap-3 text-xs transition-colors`}>
        <div className="flex items-center gap-2 text-ink/70 text-[11px] truncate">
          <Compass className="w-3.5 h-3.5 text-gold-700 shrink-0" />
          <span className="truncate">
            {isEn ? "Interactive Sacred Granth Reader" : "श्री प्राणनाथ जी पावन ई-ग्रंथालय वाचक"}
          </span>
        </div>

        {/* Scrubber slider */}
        <div className="flex items-center gap-2 max-w-xs w-full mx-4">
          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value, 10))}
            className="w-full accent-amber-600 cursor-pointer h-1.5 rounded-lg bg-line"
          />
        </div>

        <div className="flex items-center gap-3 text-ink/70 text-[11px] shrink-0 font-mono">
          <span>
            {Math.round((currentPage / totalPages) * 100)}% {isEn ? "Read" : "पठन"}
          </span>
        </div>
      </footer>
    </div>
  );
};
