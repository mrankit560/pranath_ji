"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Article, ChitwaniBook, ChitwaniVideo } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import {
  Plus,
  Trash2,
  Edit3,
  Flower2,
  BookOpen,
  Play,
  FileText,
  Save,
  X,
  CheckCircle,
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PdfUploadField } from "@/components/admin/PdfUploadField";

export default function AdminMeditationPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [activeTab, setActiveTab] = useState<"articles" | "books" | "videos">("articles");
  const [articles, setArticles] = useState<Article[]>(() => store.getChitwaniArticles());
  const [books, setBooks] = useState<ChitwaniBook[]>(() => store.getChitwaniBooks());
  const [videos, setVideos] = useState<ChitwaniVideo[]>(() => store.getChitwaniVideos());

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<{ type: "article" | "book" | "video"; item: any } | null>(null);

  // Form states
  const [articleForm, setArticleForm] = useState({
    titleHi: "",
    titleEn: "",
    summaryHi: "",
    summaryEn: "",
    contentHi: "",
    contentEn: "",
    featuredImage: "/assets/paramdham-mandala.png",
    author: "साधना पीठ, साढौली धाम",
    readTime: "7 min read",
  });

  const [bookForm, setBookForm] = useState({
    titleHi: "",
    titleEn: "",
    descriptionHi: "",
    descriptionEn: "",
    author: "श्री निजानंद आश्रम, साढौली धाम",
    coverUrl: "/assets/paramdham-mandala.png",
    pdfUrl: "/assets/chitwani-guide.pdf",
    pages: 120,
  });

  const [videoForm, setVideoForm] = useState({
    titleHi: "",
    titleEn: "",
    youtubeId: "",
    speaker: "पूज्य संत वृंद",
    duration: "25:00",
    descriptionHi: "",
    descriptionEn: "",
  });

  useEffect(() => {
    setArticles(store.getChitwaniArticles());
    setBooks(store.getChitwaniBooks());
    setVideos(store.getChitwaniVideos());
    const unsub = store.subscribe(() => {
      setArticles(store.getChitwaniArticles());
      setBooks(store.getChitwaniBooks());
      setVideos(store.getChitwaniVideos());
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (editingId) {
      store.updateArticle(editingId, {
        titleHi: articleForm.titleHi,
        titleEn: articleForm.titleEn,
        summaryHi: articleForm.summaryHi,
        summaryEn: articleForm.summaryEn,
        contentHi: articleForm.contentHi,
        contentEn: articleForm.contentEn,
        featuredImage: articleForm.featuredImage,
        author: articleForm.author,
        readTime: articleForm.readTime,
      });
      await store.saveToStorage("prannath_articles_v2", store.getArticles());
      showToast(isEn ? "✓ Chitwani Article updated and saved to database!" : "✓ चितवनी लेख डेटाबेस में अपडेट हो गया!");
      setEditingId(null);
    } else {
      store.addArticle({
        titleHi: articleForm.titleHi,
        titleEn: articleForm.titleEn,
        summaryHi: articleForm.summaryHi,
        summaryEn: articleForm.summaryEn,
        contentHi: articleForm.contentHi,
        contentEn: articleForm.contentEn,
        slug: `chitwani-${Date.now()}`,
        featuredImage: articleForm.featuredImage,
        author: articleForm.author,
        category: "chitwani",
        tags: ["चितवनी", "ध्यान", "साधना"],
        readTime: articleForm.readTime,
        status: "published",
      });
      await store.saveToStorage("prannath_articles_v2", store.getArticles());
      showToast(isEn ? "✓ New Chitwani Article added and saved to database!" : "✓ नया चितवनी लेख डेटाबेस में जुड़ गया!");
    }
    setArticles(store.getChitwaniArticles());
    setIsSaving(false);
    setShowAddForm(false);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (editingId) {
      store.updateChitwaniBook(editingId, {
        titleHi: bookForm.titleHi,
        titleEn: bookForm.titleEn,
        descriptionHi: bookForm.descriptionHi,
        descriptionEn: bookForm.descriptionEn,
        author: bookForm.author,
        coverUrl: bookForm.coverUrl,
        pdfUrl: bookForm.pdfUrl,
        pages: Number(bookForm.pages),
      });
      await store.saveToStorage("prannath_chitwani_books_v2", store.getChitwaniBooks());
      showToast(isEn ? "✓ Chitwani Book updated and saved to database!" : "✓ चितवनी पुस्तक डेटाबेस में अपडेट हो गई!");
      setEditingId(null);
    } else {
      store.addChitwaniBook({
        titleHi: bookForm.titleHi,
        titleEn: bookForm.titleEn,
        descriptionHi: bookForm.descriptionHi,
        descriptionEn: bookForm.descriptionEn,
        author: bookForm.author,
        coverUrl: bookForm.coverUrl,
        pdfUrl: bookForm.pdfUrl,
        pages: Number(bookForm.pages),
      });
      await store.saveToStorage("prannath_chitwani_books_v2", store.getChitwaniBooks());
      showToast(isEn ? "✓ New Chitwani Book added and saved to database!" : "✓ नई चितवनी पुस्तक डेटाबेस में जुड़ गई!");
    }
    setBooks(store.getChitwaniBooks());
    setIsSaving(false);
    setShowAddForm(false);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (editingId) {
      store.updateChitwaniVideo(editingId, {
        titleHi: videoForm.titleHi,
        titleEn: videoForm.titleEn,
        youtubeId: videoForm.youtubeId,
        speaker: videoForm.speaker,
        duration: videoForm.duration,
        descriptionHi: videoForm.descriptionHi,
        descriptionEn: videoForm.descriptionEn,
      });
      await store.saveToStorage("prannath_chitwani_videos_v2", store.getChitwaniVideos());
      showToast(isEn ? "✓ Chitwani Video updated and saved to database!" : "✓ चितवनी वीडियो डेटाबेस में अपडेट हो गया!");
      setEditingId(null);
    } else {
      store.addChitwaniVideo({
        titleHi: videoForm.titleHi,
        titleEn: videoForm.titleEn,
        youtubeId: videoForm.youtubeId,
        speaker: videoForm.speaker,
        duration: videoForm.duration,
        descriptionHi: videoForm.descriptionHi,
        descriptionEn: videoForm.descriptionEn,
      });
      await store.saveToStorage("prannath_chitwani_videos_v2", store.getChitwaniVideos());
      showToast(isEn ? "✓ New Chitwani Video added and saved to database!" : "✓ नया चितवनी वीडियो डेटाबेस में जुड़ गया!");
    }
    setVideos(store.getChitwaniVideos());
    setIsSaving(false);
    setShowAddForm(false);
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsSaving(true);
    if (deleteCandidate.type === "article") {
      store.deleteArticle(deleteCandidate.item.id);
      await store.saveToStorage("prannath_articles_v2", store.getArticles());
      setArticles(store.getChitwaniArticles());
    } else if (deleteCandidate.type === "book") {
      store.deleteChitwaniBook(deleteCandidate.item.id);
      await store.saveToStorage("prannath_chitwani_books_v2", store.getChitwaniBooks());
      setBooks(store.getChitwaniBooks());
    } else if (deleteCandidate.type === "video") {
      store.deleteChitwaniVideo(deleteCandidate.item.id);
      await store.saveToStorage("prannath_chitwani_videos_v2", store.getChitwaniVideos());
      setVideos(store.getChitwaniVideos());
    }
    setIsSaving(false);
    setDeleteCandidate(null);
    showToast(isEn ? "✓ Item removed from database." : "✓ सामग्री डेटाबेस से हटा दी गई।");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-spiritual-dark border-2 border-emerald-400 shadow-2xl animate-bounce-short">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">{isEn ? "Database Updated" : "डेटाबेस अपडेट"}</div>
            <div className="text-xs text-spiritual-ivory font-medium">{toastMessage}</div>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 rounded-lg hover:bg-white/10 text-emerald-300 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="spiritual-glass-card rounded-3xl max-w-md w-full p-6 border-2 border-red-500/50 shadow-2xl bg-spiritual-navy text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-spiritual-ivory mb-1">{isEn ? "Delete Item?" : "सामग्री हटाएं?"}</h3>
              <p className="text-xs text-spiritual-ivory/70 leading-relaxed">
                {isEn ? "Are you sure you want to permanently delete this item from the database?" : "क्या आप वाकई इसे डेटाबेस से हटाना चाहते हैं?"}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-all"
              >
                {isEn ? "Yes, Delete Now" : "हाँ, तुरंत हटाएं"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-5 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/30 text-spiritual-ivory/80 text-xs font-semibold hover:bg-white/5"
              >
                {isEn ? "Cancel" : "रद्द करें"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Meditation & Chitwani CMS" : "चितवनी ध्यान साधना प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Manage Chitwani Articles (how-to blogs), Chitwani Books (PDFs), and Chitwani Video Guides"
              : "चितवनी लेख (विधि ब्लॉग), चितवनी ग्रन्थ (PDFs) एवं वीडियो मार्गदर्शिका का संपूर्ण प्रबंधन"}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>
            {showAddForm
              ? isEn
                ? "Close Form"
                : "फॉर्म बंद करें"
              : isEn
              ? "Add New Item"
              : "नई सामग्री जोड़ें"}
          </span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gold-500/20 pb-3">
        <button
          onClick={() => {
            setActiveTab("articles");
            setShowAddForm(false);
            setEditingId(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "articles"
              ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
              : "bg-spiritual-card text-spiritual-ivory/70 hover:text-gold-300"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isEn ? "1. Chitwani Articles" : "१. चितवनी विधि लेख"}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("books");
            setShowAddForm(false);
            setEditingId(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "books"
              ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
              : "bg-spiritual-card text-spiritual-ivory/70 hover:text-gold-300"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isEn ? "2. Chitwani Books (PDF)" : "२. चितवनी ग्रन्थ (PDF)"}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("videos");
            setShowAddForm(false);
            setEditingId(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "videos"
              ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
              : "bg-spiritual-card text-spiritual-ivory/70 hover:text-gold-300"
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{isEn ? "3. Video Guides" : "३. वीडियो मार्गदर्शिका"}</span>
        </button>
      </div>

      {/* Dynamic Tab Form */}
      {showAddForm && activeTab === "articles" && (
        <form onSubmit={handleSaveArticle} className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in shadow-2xl bg-spiritual-navy/80">
          <h2 className="text-sm font-bold text-gold-300 uppercase tracking-wider">{isEn ? "Chitwani Article Details" : "चितवनी लेख विवरण"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Title (Hindi) *" : "शीर्षक (हिन्दी) *"}</label>
              <input
                type="text"
                required
                value={articleForm.titleHi}
                onChange={(e) => setArticleForm({ ...articleForm, titleHi: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Title (English)" : "शीर्षक (अंग्रेज़ी)"}</label>
              <input
                type="text"
                value={articleForm.titleEn}
                onChange={(e) => setArticleForm({ ...articleForm, titleEn: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Content (Hindi) *" : "लेख सामग्री (हिन्दी) *"}</label>
            <textarea
              required
              rows={6}
              value={articleForm.contentHi}
              onChange={(e) => setArticleForm({ ...articleForm, contentHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5 hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>{isSaving ? "Saving..." : isEn ? "Save Article" : "लेख सेव करें"}</span>
            </button>
            <button type="button" disabled={isSaving} onClick={() => setShowAddForm(false)} className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70">
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {showAddForm && activeTab === "books" && (
        <form onSubmit={handleSaveBook} className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in shadow-2xl bg-spiritual-navy/80">
          <h2 className="text-sm font-bold text-gold-300 uppercase tracking-wider">{isEn ? "Chitwani Book Details" : "चितवनी ग्रन्थ विवरण"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Book Title (Hindi) *" : "ग्रन्थ नाम (हिन्दी) *"}</label>
              <input
                type="text"
                required
                value={bookForm.titleHi}
                onChange={(e) => setBookForm({ ...bookForm, titleHi: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Book Title (English)" : "ग्रन्थ नाम (अंग्रेज़ी)"}</label>
              <input
                type="text"
                value={bookForm.titleEn}
                onChange={(e) => setBookForm({ ...bookForm, titleEn: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-gold-500/20 space-y-4">
            <ImageUploadField
              label={isEn ? "Cover Photo *" : "कवर फोटो *"}
              value={bookForm.coverUrl}
              onChange={(url) => setBookForm({ ...bookForm, coverUrl: url })}
            />
            <PdfUploadField
              label={isEn ? "PDF Document Link *" : "PDF दस्तावेज़ लिंक *"}
              value={bookForm.pdfUrl}
              onChange={(url) => setBookForm({ ...bookForm, pdfUrl: url })}
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5 hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>{isSaving ? "Saving..." : isEn ? "Save Book" : "ग्रन्थ सेव करें"}</span>
            </button>
            <button type="button" disabled={isSaving} onClick={() => setShowAddForm(false)} className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70">
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {showAddForm && activeTab === "videos" && (
        <form onSubmit={handleSaveVideo} className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in shadow-2xl bg-spiritual-navy/80">
          <h2 className="text-sm font-bold text-gold-300 uppercase tracking-wider">{isEn ? "Chitwani Video Guide Details" : "चितवनी वीडियो विवरण"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Video Title (Hindi) *" : "वीडियो शीर्षक (हिन्दी) *"}</label>
              <input
                type="text"
                required
                value={videoForm.titleHi}
                onChange={(e) => setVideoForm({ ...videoForm, titleHi: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "YouTube Video ID *" : "यूट्यूब वीडियो ID *"}</label>
              <input
                type="text"
                required
                value={videoForm.youtubeId}
                onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5 hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>{isSaving ? "Saving..." : isEn ? "Save Video" : "वीडियो सेव करें"}</span>
            </button>
            <button type="button" disabled={isSaving} onClick={() => setShowAddForm(false)} className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70">
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {/* Tab Lists */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/70 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Title" : "शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Author / Speaker" : "लेखक / वक्ता"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {activeTab === "articles" &&
                articles.map((a) => (
                  <tr key={a.id} className="hover:bg-gold-500/5 transition-colors">
                    <td className="p-3.5 font-bold text-spiritual-ivory">{isEn ? a.titleEn || a.titleHi : a.titleHi}</td>
                    <td className="p-3.5 text-spiritual-ivory/70">{a.author}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setDeleteCandidate({ type: "article", item: a })}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

              {activeTab === "books" &&
                books.map((b) => (
                  <tr key={b.id} className="hover:bg-gold-500/5 transition-colors">
                    <td className="p-3.5 font-bold text-spiritual-ivory">{isEn ? b.titleEn || b.titleHi : b.titleHi}</td>
                    <td className="p-3.5 text-spiritual-ivory/70">{b.author}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setDeleteCandidate({ type: "book", item: b })}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

              {activeTab === "videos" &&
                videos.map((v) => (
                  <tr key={v.id} className="hover:bg-gold-500/5 transition-colors">
                    <td className="p-3.5 font-bold text-spiritual-ivory">{isEn ? v.titleEn || v.titleHi : v.titleHi}</td>
                    <td className="p-3.5 text-spiritual-ivory/70">{v.speaker}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setDeleteCandidate({ type: "video", item: v })}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
