"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, FileText, Sparkles } from "lucide-react";

export default function AdminArticlesPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [articles, setArticles] = useState<Article[]>(store.getArticles());
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    titleHi: "",
    titleEn: "",
    contentHi: "",
    contentEn: "",
    slug: "",
    featuredImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    author: "साढौली धाम शोध पीठ",
    category: "आध्यात्मिक ज्ञान",
    tags: ["तारतम वाणी", "ब्रह्मज्ञान"],
    status: "published" as Article["status"],
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setArticles(store.getArticles());
    });
    return () => unsub();
  }, []);

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedSlug =
      form.slug ||
      form.titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") ||
      `article-${Date.now()}`;

    store.addArticle({
      ...form,
      slug: generatedSlug,
    });

    setShowAddForm(false);
    setForm({
      titleHi: "",
      titleEn: "",
      contentHi: "",
      contentEn: "",
      slug: "",
      featuredImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
      author: isEn ? "Sadhauli Dham Research Cell" : "साढौली धाम शोध पीठ",
      category: isEn ? "Spiritual Wisdom" : "आध्यात्मिक ज्ञान",
      tags: isEn ? ["Tartam Vani", "Brahm Gyan"] : ["तारतम वाणी", "ब्रह्मज्ञान"],
      status: "published",
    });
  };

  const handleDelete = (id: string) => {
    const confirmMsg = isEn
      ? "Are you sure you want to delete this article?"
      : "क्या आप इस लेख को हटाना चाहते हैं?";
    if (confirm(confirmMsg)) {
      store.deleteArticle(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Spiritual Articles & Blog CMS" : "आध्यात्मिक लेख एवं शोध CMS"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Bilingual publishing for Tartam Vani philosophy, discourses, and ashram literature"
              : "तारतम वाणी दर्शन, आश्रम इतिहास व सत्संग आलेखों का द्विभाषी प्रकाशन"}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm"
        >
          <Plus className="w-4 h-4" />
          <span>
            {showAddForm
              ? isEn
                ? "Close Form"
                : "फॉर्म बंद करें"
              : isEn
              ? "Write New Article"
              : "नया लेख लिखें"}
          </span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddArticle}
          className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-4 animate-fade-in"
        >
          <h2 className="text-base font-bold text-gold-300 font-spiritual-heading">
            {isEn ? "New Article Details (Bilingual Article Editor)" : "नया लेख विवरण (Bilingual Article Editor)"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Article Title (Hindi) *" : "लेख शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder={isEn ? "e.g. तारतम वाणी के १४ ग्रन्थों का दिव्य महत्व" : "उदा. तारतम वाणी के १४ ग्रन्थों का दिव्य महत्व"}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Article Title (English) *" : "Article Title (English) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Divine Significance of Tartam Vani Granths"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Article Content (Hindi) *" : "लेख सामग्री (हिन्दी) *"}
              </label>
              <textarea
                rows={6}
                required
                value={form.contentHi}
                onChange={(e) => setForm({ ...form, contentHi: e.target.value })}
                placeholder={isEn ? "Write full article text in Hindi..." : "यहाँ लेख का संपूर्ण पाठ लिखें..."}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none resize-none font-devanagari leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Article Content (English) *" : "Article Content (English) *"}
              </label>
              <textarea
                rows={6}
                required
                value={form.contentEn}
                onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                placeholder="Write full article text in English..."
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Author" : "लेखक (Author)"}
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
                {isEn ? "Category" : "श्रेणी (Category)"}
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Status" : "स्थिति (Status)"}
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="published">{isEn ? "Published" : "प्रकाशित (Published)"}</option>
                <option value="draft">{isEn ? "Draft" : "प्रारूप (Draft)"}</option>
                <option value="archived">{isEn ? "Archived" : "संग्रहीत (Archived)"}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm"
            >
              {isEn ? "Publish Article" : "लेख प्रकाशित करें"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70"
            >
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {/* Articles Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Title" : "शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Author" : "लेखक"}</th>
                <th className="p-3.5">{isEn ? "Category" : "श्रेणी"}</th>
                <th className="p-3.5">{isEn ? "Date" : "दिनांक"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-spiritual-ivory">
                    {isEn ? art.titleEn || art.titleHi : art.titleHi}
                    <div className="text-[10px] text-spiritual-ivory/50 font-normal">
                      {isEn ? art.titleHi : art.titleEn}
                    </div>
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/70">{art.author}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-gold-500/15 text-gold-300 text-[10px]">
                      {art.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-spiritual-ivory/60">{art.publishedAt}</td>
                  <td className="p-3.5 text-right">
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
