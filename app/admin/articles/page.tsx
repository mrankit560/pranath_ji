"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, FileText, Sparkles, CheckCircle, X } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function AdminArticlesPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [articles, setArticles] = useState<Article[]>(() => store.getArticles());
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Article | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    setArticles(store.getArticles());
    const unsub = store.subscribe(() => {
      setArticles(store.getArticles());
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
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
    await store.saveToStorage("prannath_articles_v2", store.getArticles());

    setArticles(store.getArticles());
    setIsSaving(false);
    showToast(
      isEn
        ? `✓ Article "${form.titleEn || form.titleHi}" published and saved to database!`
        : `✓ लेख "${form.titleHi}" डेटाबेस में सुरक्षित हो गया!`
    );

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

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const title = deleteCandidate.titleHi || deleteCandidate.titleEn;
    setIsSaving(true);
    store.deleteArticle(deleteCandidate.id);
    await store.saveToStorage("prannath_articles_v2", store.getArticles());
    setArticles(store.getArticles());
    setIsSaving(false);
    setDeleteCandidate(null);
    showToast(
      isEn
        ? `✓ Article "${title}" deleted from database.`
        : `✓ लेख "${title}" डेटाबेस से हटा दिया गया।`
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* In-App Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="spiritual-glass-card rounded-3xl max-w-md w-full p-6 border-2 border-red-500/50 shadow-2xl bg-spiritual-navy text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-spiritual-ivory mb-1">
                {isEn ? "Delete Article?" : "लेख हटाएं?"}
              </h3>
              <p className="text-xs text-spiritual-ivory/70 leading-relaxed">
                {isEn
                  ? `Are you sure you want to delete "${deleteCandidate.titleEn || deleteCandidate.titleHi}"?`
                  : `क्या आप वाकई "${deleteCandidate.titleHi}" को हटाना चाहते हैं?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-all"
              >
                {isEn ? "Yes, Delete Now" : "हाँ, हटाएं"}
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

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-spiritual-dark border-2 border-emerald-400 shadow-2xl animate-bounce-short">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">
              {isEn ? "Success" : "सफलतापूर्वक पूर्ण"}
            </div>
            <div className="text-xs text-spiritual-ivory font-medium">
              {toastMessage}
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-emerald-300 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
          className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
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

      {showAddForm && (
        <form
          onSubmit={handleAddArticle}
          className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-4 animate-fade-in shadow-2xl bg-spiritual-navy/80"
        >
          <h2 className="text-base font-bold text-gold-300 font-spiritual-heading">
            {isEn ? "Compose New Spiritual Article" : "नया आध्यात्मिक आलेख लिखें"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Article Title (Hindi) *" : "लेख का शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. श्री तारतम वाणी का दार्शनिक रहस्य"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Article Title (English)" : "लेख का शीर्षक (अंग्रेज़ी)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Philosophical Essence of Tartam Vani"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Category *" : "श्रेणी *"}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="adhyatmik-gyan">{isEn ? "Aadhyatmik Gyan (Spiritual Wisdom)" : "आध्यात्मिक ज्ञान"}</option>
                <option value="prannath-ji">{isEn ? "Shri Prannath Ji Literature" : "श्री प्राणनाथ जी वाणी"}</option>
                <option value="chitwani">{isEn ? "Chitwani & Meditation" : "चितवनी दर्शन"}</option>
                <option value="history">{isEn ? "Ashram & Dham History" : "साढौली धाम इतिहास"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Author" : "लेखक / शोधपीठ"}
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
                {isEn ? "URL Slug (Optional)" : "कस्टम URL स्लग"}
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="tartam-vani-essence"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-gold-500/20">
            <ImageUploadField
              label={isEn ? "Featured Header Photo (Upload / URL) *" : "लेख मुख्य हेडर फोटो (अपलोड / लिंक) *"}
              value={form.featuredImage}
              onChange={(url) => setForm({ ...form, featuredImage: url })}
              recommendedSize="1200 × 630 px"
              aspectRatio="16:9 (आर्टिकल हेडर)"
              maxSizeMB={5}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Article Content (Hindi - Full Text) *" : "लेख की संपूर्ण सामग्री (हिन्दी) *"}
            </label>
            <textarea
              required
              rows={8}
              value={form.contentHi}
              onChange={(e) => setForm({ ...form, contentHi: e.target.value })}
              placeholder="यहाँ विस्तृत लेख लिखें..."
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <FileText className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>
                {isSaving
                  ? isEn
                    ? "Publishing to Database..."
                    : "डेटाबेस में प्रकाशित किया जा रहा है..."
                  : isEn
                  ? "Publish Article"
                  : "लेख प्रकाशित करें"}
              </span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70 hover:bg-white/5 disabled:opacity-50"
            >
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {/* Articles List Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/70 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Article Title" : "शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Category" : "श्रेणी"}</th>
                <th className="p-3.5">{isEn ? "Author" : "लेखक"}</th>
                <th className="p-3.5">{isEn ? "Published Date" : "प्रकाशन तिथि"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-spiritual-ivory max-w-sm">
                    {isEn ? art.titleEn || art.titleHi : art.titleHi}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 text-[10px] uppercase font-bold">
                      {art.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/70">{art.author}</td>
                  <td className="p-3.5 font-mono text-gold-300">{art.publishedAt}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setDeleteCandidate(art)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow-sm"
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
