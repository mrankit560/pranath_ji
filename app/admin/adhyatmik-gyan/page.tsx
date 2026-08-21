"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Edit3, Compass, Save, X, Eye } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function AdminAdhyatmikGyanPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [blogs, setBlogs] = useState<Article[]>(store.getAdhyatmikBlogs());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    titleHi: "",
    titleEn: "",
    summaryHi: "",
    summaryEn: "",
    contentHi: "",
    contentEn: "",
    featuredImage: "/assets/paramdham-mandala.png",
    author: "आध्यात्मिक परिषद, साढौली धाम",
    category: "adhyatmik-gyan",
    tags: "ब्रह्मज्ञान, आत्मज्ञान, साधना",
    readTime: "6 min read",
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBlogs(store.getAdhyatmikBlogs());
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
        slug: `adhyatmik-${Date.now()}`,
        featuredImage: form.featuredImage,
        author: form.author,
        category: "adhyatmik-gyan",
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
      featuredImage: "/assets/paramdham-mandala.png",
      author: "आध्यात्मिक परिषद, साढौली धाम",
      category: "adhyatmik-gyan",
      tags: "ब्रह्मज्ञान, आत्मज्ञान, साधना",
      readTime: "6 min read",
    });
  };

  const handleEdit = (blog: Article) => {
    setEditingId(blog.id);
    setForm({
      titleHi: blog.titleHi || "",
      titleEn: blog.titleEn || "",
      summaryHi: blog.summaryHi || "",
      summaryEn: blog.summaryEn || "",
      contentHi: blog.contentHi || "",
      contentEn: blog.contentEn || "",
      featuredImage: blog.featuredImage || "/assets/paramdham-mandala.png",
      author: blog.author || "आध्यात्मिक परिषद, साढौली धाम",
      category: "adhyatmik-gyan",
      tags: blog.tags ? blog.tags.join(", ") : "",
      readTime: blog.readTime || "6 min read",
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const confirmMsg = isEn
      ? "Are you sure you want to delete this blog post?"
      : "क्या आप वाकई इस आध्यात्मिक ब्लॉग को हटाना चाहते हैं?";
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
            {isEn ? "Aadhyatmik Gyan Blogging CMS" : "आध्यात्मिक ज्ञान ब्लॉग प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Publish, edit, write, and manage spiritual wisdom blogs with photos and tags"
              : "आत्मज्ञान, तत्व दर्शन एवं साधना पर ज्ञानवर्धक ब्लॉग लिखें, फोटो अपलोड करें और प्रबंधित करें"}
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
              ? "Write New Blog"
              : "नया ब्लॉग लिखें"}
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
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              {editingId
                ? isEn
                  ? "Edit Spiritual Blog"
                  : "आध्यात्मिक ब्लॉग संपादित करें"
                : isEn
                ? "Write New Spiritual Blog"
                : "नया आध्यात्मिक ब्लॉग लिखें"}
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
                {isEn ? "Blog Title (Hindi) *" : "ब्लॉग शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. क्षर, अक्षर और अक्षरातीत का तत्व दर्शन"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Blog Title (English)" : "ब्लॉग शीर्षक (English)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g., Understanding Kshar, Akshar, and Aksharatit"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Author" : "लेखक"}
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
                {isEn ? "Read Time" : "पठन अवधि"}
              </label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                placeholder="6 min read"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-gold-500/20">
            <ImageUploadField
              label={isEn ? "Blog Featured Image *" : "ब्लॉग मुख्य फोटो (Featured Image) *"}
              value={form.featuredImage}
              onChange={(url) => setForm({ ...form, featuredImage: url })}
              recommendedSize="1200 × 675 px"
              aspectRatio="16:9 (ब्लॉग थंबनेल)"
              maxSizeMB={5}
              helperText={isEn ? "Displayed at the top of the blog and on listing cards" : "ब्लॉग कार्ड एवं विस्तृत अध्ययन विंडो में मुख्य फोटो के रूप में दिखेगी"}
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
              placeholder="ब्लॉग का संक्षिप्त सार..."
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Full Blog Content (Hindi) *" : "सम्पूर्ण ब्लॉग सामग्री (हिन्दी) *"}
            </label>
            <textarea
              rows={8}
              required
              value={form.contentHi}
              onChange={(e) => setForm({ ...form, contentHi: e.target.value })}
              placeholder="यहाँ विस्तार से आध्यात्मिक ब्लॉग लिखें..."
              className="w-full p-3 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Full Blog Content (English - Optional)" : "सम्पूर्ण ब्लॉग सामग्री (English - वैकल्पिक)"}
            </label>
            <textarea
              rows={4}
              value={form.contentEn}
              onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
              placeholder="English translation or summary..."
              className="w-full p-3 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Tags (Comma Separated)" : "टैग्स"}
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="ब्रह्मज्ञान, आत्मज्ञान, साधना"
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? (isEn ? "Update Blog" : "ब्लॉग अपडेट करें") : (isEn ? "Publish Blog" : "ब्लॉग प्रकाशित करें")}</span>
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

      {/* Blogs Table */}
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
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-spiritual-ivory max-w-md">
                    {isEn ? blog.titleEn || blog.titleHi : blog.titleHi}
                    <div className="text-[10px] text-spiritual-ivory/50 font-normal truncate mt-0.5">
                      {blog.summaryHi || blog.summaryEn}
                    </div>
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/70">{blog.author}</td>
                  <td className="p-3.5 font-mono text-gold-300">{blog.publishedAt}</td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                      title={isEn ? "Edit" : "संपादित करें"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
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
