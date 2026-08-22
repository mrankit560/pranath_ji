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
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PdfUploadField } from "@/components/admin/PdfUploadField";

export default function AdminMeditationPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [activeTab, setActiveTab] = useState<"articles" | "books" | "videos">("articles");
  const [articles, setArticles] = useState<Article[]>(store.getChitwaniArticles());
  const [books, setBooks] = useState<ChitwaniBook[]>(store.getChitwaniBooks());
  const [videos, setVideos] = useState<ChitwaniVideo[]>(store.getChitwaniVideos());

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    const unsub = store.subscribe(() => {
      setArticles(store.getChitwaniArticles());
      setBooks(store.getChitwaniBooks());
      setVideos(store.getChitwaniVideos());
    });
    return () => unsub();
  }, []);

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
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
    }
    setShowAddForm(false);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
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
    }
    setShowAddForm(false);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
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
    }
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
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
          className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm"
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

      {/* Subcategory Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/50 border border-gold-500/30 max-w-md">
        <button
          onClick={() => {
            setActiveTab("articles");
            setShowAddForm(false);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "articles"
              ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
              : "text-spiritual-ivory/70 hover:text-gold-300"
          }`}
        >
          {isEn ? "1. Articles" : "१. लेख (Blogs)"}
        </button>

        <button
          onClick={() => {
            setActiveTab("books");
            setShowAddForm(false);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "books"
              ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
              : "text-spiritual-ivory/70 hover:text-gold-300"
          }`}
        >
          {isEn ? "2. Books" : "२. ग्रन्थ (PDFs)"}
        </button>

        <button
          onClick={() => {
            setActiveTab("videos");
            setShowAddForm(false);
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "videos"
              ? "bg-gold-gradient text-spiritual-dark shadow-gold-sm"
              : "text-spiritual-ivory/70 hover:text-gold-300"
          }`}
        >
          {isEn ? "3. Videos" : "३. वीडियो"}
        </button>
      </div>

      {/* TAB 1: CHITWANI ARTICLES FORM & TABLE */}
      {activeTab === "articles" && (
        <div className="space-y-6">
          {showAddForm && (
            <form
              onSubmit={handleSaveArticle}
              className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in"
            >
              <h3 className="text-sm font-bold text-gold-300 uppercase">
                {editingId ? (isEn ? "Edit Chitwani Article" : "चितवनी लेख संपादित करें") : (isEn ? "Write New Chitwani Article" : "नया चितवनी लेख लिखें")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {isEn ? "Title (Hindi) *" : "शीर्षक (हिन्दी) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={articleForm.titleHi}
                    onChange={(e) => setArticleForm({ ...articleForm, titleHi: e.target.value })}
                    placeholder="उदा. चितवनी कैसे करें? सरल विधि"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {isEn ? "Title (English)" : "शीर्षक (English)"}
                  </label>
                  <input
                    type="text"
                    value={articleForm.titleEn}
                    onChange={(e) => setArticleForm({ ...articleForm, titleEn: e.target.value })}
                    placeholder="How to Practice Chitwani Meditation"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  {isEn ? "Short Summary (Hindi)" : "संक्षिप्त सारांश (हिन्दी)"}
                </label>
                <input
                  type="text"
                  value={articleForm.summaryHi}
                  onChange={(e) => setArticleForm({ ...articleForm, summaryHi: e.target.value })}
                  placeholder="चितवनी के ५ चरणों का संक्षिप्त सार..."
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
                />
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-gold-500/20">
                <ImageUploadField
                  label={isEn ? "Article Featured Image" : "चितवनी लेख मुख्य फोटो"}
                  value={articleForm.featuredImage}
                  onChange={(url) => setArticleForm({ ...articleForm, featuredImage: url })}
                  recommendedSize="1200 × 675 px"
                  aspectRatio="16:9 (आलेख थंबनेल)"
                  maxSizeMB={5}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  {isEn ? "Full Article Content (Hindi) *" : "सम्पूर्ण लेख सामग्री (हिन्दी) *"}
                </label>
                <textarea
                  rows={8}
                  required
                  value={articleForm.contentHi}
                  onChange={(e) => setArticleForm({ ...articleForm, contentHi: e.target.value })}
                  placeholder="यहाँ चितवनी ध्यान विधि, चरण एवं अनुभव विस्तार से लिखें..."
                  className="w-full p-3 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEn ? "Save Article" : "लेख सेव करें"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70"
                >
                  {isEn ? "Cancel" : "रद्द करें"}
                </button>
              </div>
            </form>
          )}

          <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30">
            <table className="w-full text-left text-xs text-spiritual-ivory">
              <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">{isEn ? "Title" : "शीर्षक"}</th>
                  <th className="p-3.5">{isEn ? "Author" : "लेखक"}</th>
                  <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-gold-500/5">
                    <td className="p-3.5 font-bold text-spiritual-ivory">
                      {isEn ? art.titleEn || art.titleHi : art.titleHi}
                    </td>
                    <td className="p-3.5 text-spiritual-ivory/70">{art.author}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(art.id);
                          setArticleForm({
                            titleHi: art.titleHi,
                            titleEn: art.titleEn,
                            summaryHi: art.summaryHi || "",
                            summaryEn: art.summaryEn || "",
                            contentHi: art.contentHi,
                            contentEn: art.contentEn,
                            featuredImage: art.featuredImage,
                            author: art.author,
                            readTime: art.readTime || "7 min read",
                          });
                          setShowAddForm(true);
                        }}
                        className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => store.deleteArticle(art.id)}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20"
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
      )}

      {/* TAB 2: CHITWANI BOOKS */}
      {activeTab === "books" && (
        <div className="space-y-6">
          {showAddForm && (
            <form
              onSubmit={handleSaveBook}
              className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in"
            >
              <h3 className="text-sm font-bold text-gold-300 uppercase">
                {editingId ? (isEn ? "Edit Chitwani Book" : "चितवनी ग्रन्थ संपादित करें") : (isEn ? "Add Chitwani Book" : "नया चितवनी ग्रन्थ जोड़ें")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {isEn ? "Book Title (Hindi) *" : "ग्रन्थ शीर्षक (हिन्दी) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={bookForm.titleHi}
                    onChange={(e) => setBookForm({ ...bookForm, titleHi: e.target.value })}
                    placeholder="उदा. चितवनी साधना मार्गदर्शिका"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {isEn ? "Book Title (English)" : "ग्रन्थ शीर्षक (English)"}
                  </label>
                  <input
                    type="text"
                    value={bookForm.titleEn}
                    onChange={(e) => setBookForm({ ...bookForm, titleEn: e.target.value })}
                    placeholder="Chitwani Sadhna Manual"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-black/40 border border-gold-500/20">
                <ImageUploadField
                  label={isEn ? "Book Cover Photo *" : "ग्रन्थ कवर फोटो (Cover Photo) *"}
                  value={bookForm.coverUrl}
                  onChange={(url) => setBookForm({ ...bookForm, coverUrl: url })}
                  recommendedSize="600 × 900 px"
                  aspectRatio="2:3 (पोर्ट्रेट बुक कवर)"
                  maxSizeMB={5}
                />

                <PdfUploadField
                  label={isEn ? "Meditation Book PDF *" : "चितवनी ग्रन्थ PDF फाइल *"}
                  value={bookForm.pdfUrl}
                  onChange={(url) => setBookForm({ ...bookForm, pdfUrl: url })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  {isEn ? "Pages Count" : "कुल पृष्ठ (Pages)"}
                </label>
                <input
                  type="number"
                  value={bookForm.pages}
                  onChange={(e) => setBookForm({ ...bookForm, pages: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  {isEn ? "Description (Hindi)" : "विवरण (हिन्दी)"}
                </label>
                <textarea
                  rows={2}
                  value={bookForm.descriptionHi}
                  onChange={(e) => setBookForm({ ...bookForm, descriptionHi: e.target.value })}
                  placeholder="ग्रन्थ का संक्षिप्त परिचय..."
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEn ? "Save Book" : "ग्रन्थ सेव करें"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70"
                >
                  {isEn ? "Cancel" : "रद्द करें"}
                </button>
              </div>
            </form>
          )}

          <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30">
            <table className="w-full text-left text-xs text-spiritual-ivory">
              <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">{isEn ? "Book Title" : "ग्रन्थ शीर्षक"}</th>
                  <th className="p-3.5">{isEn ? "Pages" : "पृष्ठ"}</th>
                  <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gold-500/5">
                    <td className="p-3.5 font-bold text-spiritual-ivory">
                      {isEn ? book.titleEn || book.titleHi : book.titleHi}
                    </td>
                    <td className="p-3.5 font-mono text-gold-300">{book.pages}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(book.id);
                          setBookForm({
                            titleHi: book.titleHi,
                            titleEn: book.titleEn,
                            descriptionHi: book.descriptionHi,
                            descriptionEn: book.descriptionEn,
                            author: book.author,
                            coverUrl: book.coverUrl,
                            pdfUrl: book.pdfUrl,
                            pages: book.pages,
                          });
                          setShowAddForm(true);
                        }}
                        className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => store.deleteChitwaniBook(book.id)}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20"
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
      )}

      {/* TAB 3: CHITWANI VIDEOS */}
      {activeTab === "videos" && (
        <div className="space-y-6">
          {showAddForm && (
            <form
              onSubmit={handleSaveVideo}
              className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in"
            >
              <h3 className="text-sm font-bold text-gold-300 uppercase">
                {editingId ? (isEn ? "Edit Chitwani Video" : "चितवनी वीडियो संपादित करें") : (isEn ? "Add Chitwani Video" : "नया चितवनी वीडियो जोड़ें")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {isEn ? "Video Title (Hindi) *" : "वीडियो शीर्षक (हिन्दी) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.titleHi}
                    onChange={(e) => setVideoForm({ ...videoForm, titleHi: e.target.value })}
                    placeholder="उदा. चितवनी ध्यान विधि — अभ्यास सत्र"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {isEn ? "YouTube Video ID *" : "यूट्यूब वीडियो ID (11 chars) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.youtubeId}
                    onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                    placeholder="उदा. dQw4w9WgXcQ"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {isEn ? "Speaker / Guide" : "मार्गदर्शक / वक्ता"}
                  </label>
                  <input
                    type="text"
                    value={videoForm.speaker}
                    onChange={(e) => setVideoForm({ ...videoForm, speaker: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gold-300 mb-1">
                    {isEn ? "Duration" : "अवधि (Duration)"}
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="25:00"
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-300 mb-1">
                  {isEn ? "Description (Hindi)" : "विवरण (हिन्दी)"}
                </label>
                <textarea
                  rows={2}
                  value={videoForm.descriptionHi}
                  onChange={(e) => setVideoForm({ ...videoForm, descriptionHi: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEn ? "Save Video Guide" : "वीडियो सेव करें"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70"
                >
                  {isEn ? "Cancel" : "रद्द करें"}
                </button>
              </div>
            </form>
          )}

          <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30">
            <table className="w-full text-left text-xs text-spiritual-ivory">
              <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">{isEn ? "Video Title" : "वीडियो शीर्षक"}</th>
                  <th className="p-3.5">{isEn ? "Speaker" : "वक्ता"}</th>
                  <th className="p-3.5">{isEn ? "Duration" : "अवधि"}</th>
                  <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10">
                {videos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-gold-500/5">
                    <td className="p-3.5 font-bold text-spiritual-ivory">
                      {isEn ? vid.titleEn || vid.titleHi : vid.titleHi}
                    </td>
                    <td className="p-3.5 text-spiritual-ivory/70">{vid.speaker}</td>
                    <td className="p-3.5 font-mono text-gold-300">{vid.duration}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(vid.id);
                          setVideoForm({
                            titleHi: vid.titleHi,
                            titleEn: vid.titleEn,
                            youtubeId: vid.youtubeId,
                            speaker: vid.speaker,
                            duration: vid.duration,
                            descriptionHi: vid.descriptionHi,
                            descriptionEn: vid.descriptionEn,
                          });
                          setShowAddForm(true);
                        }}
                        className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => store.deleteChitwaniVideo(vid.id)}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20"
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
      )}
    </div>
  );
}
