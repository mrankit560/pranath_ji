"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Edit3, Compass, Save, X, CheckCircle } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function AdminAdhyatmikGyanPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [blogs, setBlogs] = useState<Article[]>(() => store.getAdhyatmikBlogs());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Article | null>(null);

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
    setBlogs(store.getAdhyatmikBlogs());
    const unsub = store.subscribe(() => {
      setBlogs(store.getAdhyatmikBlogs());
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
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
      await store.saveToStorage("prannath_articles_v2", store.getArticles());
      showToast(isEn ? "✓ Blog updated and saved to database!" : "✓ आलेख डेटाबेस में अपडेट हो गया!");
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
      await store.saveToStorage("prannath_articles_v2", store.getArticles());
      showToast(isEn ? "✓ New Blog published and saved to database!" : "✓ नया आलेख डेटाबेस में जुड़ गया!");
    }

    setBlogs(store.getAdhyatmikBlogs());
    setIsSaving(false);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsSaving(true);
    store.deleteArticle(deleteCandidate.id);
    await store.saveToStorage("prannath_articles_v2", store.getArticles());
    setBlogs(store.getAdhyatmikBlogs());
    setIsSaving(false);
    setDeleteCandidate(null);
    showToast(isEn ? "✓ Blog deleted from database." : "✓ आलेख डेटाबेस से हटा दिया गया।");
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
              <h3 className="text-lg font-bold text-spiritual-ivory mb-1">{isEn ? "Delete Blog?" : "आलेख हटाएं?"}</h3>
              <p className="text-xs text-spiritual-ivory/70 leading-relaxed">
                {isEn ? `Are you sure you want to delete "${deleteCandidate.titleEn || deleteCandidate.titleHi}"?` : `क्या आप वाकई "${deleteCandidate.titleHi}" को हटाना चाहते हैं?`}
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

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Aadhyatmik Gyan Blogs CMS" : "आध्यात्मिक ज्ञान ब्लॉग प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Publish philosophical essays, spiritual insights, and self-realization guidance"
              : "आत्मज्ञान, दर्शन, प्रेम-सेवा और आध्यात्मिक साधना पर आलेख प्रकाशित करें"}
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
              ? "Write New Blog"
              : "नया आलेख लिखें"}
          </span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSave} className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in shadow-2xl bg-spiritual-navy/80">
          <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
            <h2 className="text-sm font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-400" />
              <span>{editingId ? (isEn ? "Edit Blog" : "आलेख संपादित करें") : isEn ? "Write New Blog" : "नया आलेख लिखें"}</span>
            </h2>
            <button type="button" onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-white/10 text-spiritual-ivory/70">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Title (Hindi) *" : "शीर्षक (हिन्दी) *"}</label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. प्रेम और सेवा: ईश्वर प्राप्ति का सरल मार्ग"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Title (English)" : "शीर्षक (अंग्रेज़ी)"}</label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Love & Service: Direct Path to the Divine"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-gold-500/20">
            <ImageUploadField
              label={isEn ? "Featured Header Photo *" : "ब्लॉग मुख्य हेडर फोटो *"}
              value={form.featuredImage}
              onChange={(url) => setForm({ ...form, featuredImage: url })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">{isEn ? "Full Content (Hindi) *" : "सम्पूर्ण सामग्री (हिन्दी) *"}</label>
            <textarea
              required
              rows={6}
              value={form.contentHi}
              onChange={(e) => setForm({ ...form, contentHi: e.target.value })}
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
              <span>{isSaving ? "Saving..." : isEn ? "Save Blog" : "आलेख सेव करें"}</span>
            </button>
            <button type="button" disabled={isSaving} onClick={() => setShowAddForm(false)} className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70">
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {/* Blogs Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/70 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Title" : "शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Author" : "लेखक"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-spiritual-ivory">{isEn ? blog.titleEn || blog.titleHi : blog.titleHi}</td>
                  <td className="p-3.5 text-spiritual-ivory/70">{blog.author}</td>
                  <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 hover:scale-105 transition-all shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(blog)}
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
