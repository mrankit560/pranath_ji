"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Edit3, Sparkles, Image as ImageIcon, Save, X } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function AdminPrannathJiPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [articles, setArticles] = useState<Article[]>(store.getPrannathArticles());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    titleHi: "",
    titleEn: "",
    summaryHi: "",
    summaryEn: "",
    contentHi: "",
    contentEn: "",
    featuredImage: "/assets/hero-reference-1.jpg",
    author: "साढौली धाम शोध परिषद",
    category: "prannath-ji",
    tags: "प्राणनाथ जी, जीवनी, तारतम वाणी",
    readTime: "5 min read",
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setArticles(store.getPrannathArticles());
    });
    return () => unsub();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingId) {
      store.updateArticle(editingId, {
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        summaryHi: form.summaryHi,
        summaryEn: form.summaryEn,
        contentHi: form.contentHi,
        contentEn: form.contentEn,
        featuredImage: form.featuredImage,
        author: form.author,
        tags: tagArray,
        readTime: form.readTime,
      });
      setEditingId(null);
    } else {
      store.addArticle({
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        summaryHi: form.summaryHi,
        summaryEn: form.summaryEn,
        contentHi: form.contentHi,
        contentEn: form.contentEn,
        slug: `prannath-${Date.now()}`,
        featuredImage: form.featuredImage,
        author: form.author,
        category: "prannath-ji",
        tags: tagArray,
        readTime: form.readTime,
        status: "published",
      });
    }

    setShowAddForm(false);
    setForm({
      titleHi: "",
      titleEn: "",
      summaryHi: "",
      summaryEn: "",
      contentHi: "",
      contentEn: "",
      featuredImage: "/assets/hero-reference-1.jpg",
      author: "साढौली धाम शोध परिषद",
      category: "prannath-ji",
      tags: "प्राणनाथ जी, जीवनी, तारतम वाणी",
      readTime: "5 min read",
    });
  };

  const handleEdit = (art: Article) => {
    setEditingId(art.id);
    setForm({
      titleHi: art.titleHi || "",
      titleEn: art.titleEn || "",
      summaryHi: art.summaryHi || "",
      summaryEn: art.summaryEn || "",
      contentHi: art.contentHi || "",
      contentEn: art.contentEn || "",
      featuredImage: art.featuredImage || "/assets/hero-reference-1.jpg",
      author: art.author || "साढौली धाम शोध परिषद",
      category: "prannath-ji",
      tags: art.tags ? art.tags.join(", ") : "",
      readTime: art.readTime || "5 min read",
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const confirmMsg = isEn
      ? "Are you sure you want to delete this article?"
      : "क्या आप वाकई इस लेख को हटाना चाहते हैं?";
    if (confirm(confirmMsg)) {
      store.deleteArticle(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Shree Prannath Ji Articles & Blog CMS" : "श्री प्राणनाथ जी लेख एवं ब्लॉग प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Write, edit, and publish articles on Mahamati Shri Prannath Ji's life, leelas, and history"
              : "महामति श्री प्राणनाथ जी की जीवनी, लीलाओं एवं उपदेशों पर लेख व ब्लॉग लिखें और संपादित करें"}
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
                ? "Close Editor"
                : "एडिटर बंद करें"
              : isEn
              ? "Write New Article"
              : "नया लेख लिखें"}
          </span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <form
          onSubmit={handleSave}
          className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gold-500/20">
            <h3 className="text-sm font-bold text-gold-300 uppercase tracking-wider">
              {editingId
                ? isEn
                  ? "Edit Article"
                  : "लेख संपादित करें"
                : isEn
                ? "Write New Article"
                : "नया लेख लिखें"}
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="p-1 text-spiritual-ivory/60 hover:text-gold-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Article Title (Hindi) *" : "शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. महामति श्री प्राणनाथ जी का दिव्य प्राकट्य"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Article Title (English)" : "शीर्षक (English)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g., Divine Incarnation of Mahamati Shri Prannath Ji"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Author / Speaker" : "लेखक / शोध पीठ"}
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Estimated Read Time" : "पठन अवधि (Read Time)"}
              </label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                placeholder="उदा. 5 min read"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-gold-500/20">
            <ImageUploadField
              label={isEn ? "Article Featured Image *" : "लेख मुख्य फोटो (Featured Image) *"}
              value={form.featuredImage}
              onChange={(url) => setForm({ ...form, featuredImage: url })}
              recommendedSize="1200 × 675 px"
              aspectRatio="16:9 (आलेख थंबनेल)"
              maxSizeMB={5}
              helperText={isEn ? "Displayed in Shri Prannath Ji biography cards and reading overlay" : "श्री प्राणनाथ जी जीवन चरित्र आलेख कार्ड व वाचन विंडो में दिखेगी"}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Short Summary (Hindi)" : "संक्षिप्त सारांश (हिन्दी)"}
            </label>
            <input
              type="text"
              value={form.summaryHi}
              onChange={(e) => setForm({ ...form, summaryHi: e.target.value })}
              placeholder="१-२ पंक्तियों में संक्षिप्त परिचय..."
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Full Article Content (Hindi) *" : "सम्पूर्ण लेख सामग्री (हिन्दी) *"}
            </label>
            <textarea
              rows={8}
              required
              value={form.contentHi}
              onChange={(e) => setForm({ ...form, contentHi: e.target.value })}
              placeholder="यहाँ विस्तार से लेख लिखें (पैराग्राफ, दोहे, चौपाई)..."
              className="w-full p-3 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Full Article Content (English - Optional)" : "सम्पूर्ण लेख सामग्री (English - वैकल्पिक)"}
            </label>
            <textarea
              rows={4}
              value={form.contentEn}
              onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
              placeholder="Write English translation or summary here..."
              className="w-full p-3 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Tags (Comma Separated)" : "टैग्स (कॉमा द्वारा अलग करें)"}
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="प्राणनाथ जी, जागनी, तारतम वाणी"
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? (isEn ? "Update Article" : "लेख अपडेट करें") : (isEn ? "Publish Article" : "लेख प्रकाशित करें")}</span>
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

      {/* Articles Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Title" : "शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Author" : "लेखक"}</th>
                <th className="p-3.5">{isEn ? "Date" : "दिनांक"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-spiritual-ivory max-w-md">
                    {isEn ? art.titleEn || art.titleHi : art.titleHi}
                    <div className="text-[10px] text-spiritual-ivory/50 font-normal truncate mt-0.5">
                      {art.summaryHi || art.summaryEn}
                    </div>
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/70">{art.author}</td>
                  <td className="p-3.5 font-mono text-gold-300">{art.publishedAt}</td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(art)}
                      className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                      title={isEn ? "Edit" : "संपादित करें"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20"
                      title={isEn ? "Delete" : "हटाएं"}
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
