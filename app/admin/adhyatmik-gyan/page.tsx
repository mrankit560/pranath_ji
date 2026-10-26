"use client";

import React, { useState, useEffect, useMemo } from "react";
import { store } from "@/lib/data/store";
import { Article } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import {
  Plus,
  Trash2,
  Edit3,
  Compass,
  Save,
  X,
  CheckCircle,
  Eye,
  FileText,
  Tag,
  Clock,
  User,
  Sparkles,
  Layers,
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const DEFAULT_CATEGORIES = [
  "तत्व ज्ञान",
  "चितवनी ध्यान",
  "वाणी व्याख्या",
  "आध्यात्मिक साधना",
  "ब्रह्मज्ञान",
  "प्रेम व सेवा",
];

export default function AdminAdhyatmikGyanPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [blogs, setBlogs] = useState<Article[]>(() => store.getAdhyatmikBlogs());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Article | null>(null);

  // Active editor tab: "hi" (Hindi) or "en" (English)
  const [activeTab, setActiveTab] = useState<"hi" | "en">("hi");
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Dynamic category state
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);

  const [form, setForm] = useState({
    titleHi: "",
    titleEn: "",
    summaryHi: "",
    summaryEn: "",
    contentHi: "",
    contentEn: "",
    featuredImage: "/assets/paramdham-mandala.png",
    author: "आध्यात्मिक परिषद, साढौली धाम",
    category: "तत्व ज्ञान",
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

  // Collect all unique categories from existing blogs plus defaults
  const availableCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    blogs.forEach((b) => {
      if (b.category && b.category !== "adhyatmik-gyan") {
        set.add(b.category);
      }
    });
    return Array.from(set);
  }, [blogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleHi.trim()) {
      showToast(isEn ? "Please enter a Hindi title." : "कृपया हिन्दी शीर्षक दर्ज करें।");
      return;
    }
    if (!form.contentHi.trim()) {
      showToast(isEn ? "Please write some Hindi content." : "कृपया हिन्दी आलेख सामग्री दर्ज करें।");
      return;
    }

    setIsSaving(true);
    const tagArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    // Auto-generate summary from content if empty
    const plainTextHi = form.contentHi.replace(/<[^>]+>/g, "").trim();
    const plainTextEn = form.contentEn.replace(/<[^>]+>/g, "").trim();
    const autoSummaryHi = form.summaryHi.trim() || plainTextHi.slice(0, 160) + "...";
    const autoSummaryEn = form.summaryEn.trim() || (plainTextEn ? plainTextEn.slice(0, 160) + "..." : "");

    if (editingId) {
      store.updateArticle(editingId, {
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        summaryHi: autoSummaryHi,
        summaryEn: autoSummaryEn,
        contentHi: form.contentHi,
        contentEn: form.contentEn,
        featuredImage: form.featuredImage,
        author: form.author,
        category: form.category,
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
        summaryHi: autoSummaryHi,
        summaryEn: autoSummaryEn,
        contentHi: form.contentHi,
        contentEn: form.contentEn,
        slug: `adhyatmik-${Date.now()}`,
        featuredImage: form.featuredImage,
        author: form.author,
        category: form.category,
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
    setShowLivePreview(false);
    setForm({
      titleHi: "",
      titleEn: "",
      summaryHi: "",
      summaryEn: "",
      contentHi: "",
      contentEn: "",
      featuredImage: "/assets/paramdham-mandala.png",
      author: "आध्यात्मिक परिषद, साढौली धाम",
      category: "तत्व ज्ञान",
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
      category: blog.category || "तत्व ज्ञान",
      tags: blog.tags ? blog.tags.join(", ") : "",
      readTime: blog.readTime || "6 min read",
    });
    setShowAddForm(true);
    setShowLivePreview(false);
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

  const handleAddCustomCategory = () => {
    if (customCategoryInput.trim()) {
      setForm({ ...form, category: customCategoryInput.trim() });
      setCustomCategoryInput("");
      setIsAddingCustomCategory(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-100 to-surface-2 border-2 border-emerald-400 shadow-2xl animate-bounce-short">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center border border-emerald-400">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-700">{isEn ? "Database Updated" : "डेटाबेस अपडेट"}</div>
            <div className="text-xs text-ink font-medium">{toastMessage}</div>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 rounded-lg hover:bg-white/10 text-emerald-700 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-scrim/55 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="spiritual-glass-card rounded-3xl max-w-md w-full p-6 border-2 border-red-500/50 shadow-2xl bg-surface-2 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-700 flex items-center justify-center mx-auto border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink mb-1">{isEn ? "Delete Blog?" : "आलेख हटाएं?"}</h3>
              <p className="text-xs text-ink/70 leading-relaxed">
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
                className="px-5 py-2.5 rounded-xl bg-card border border-line text-ink/80 text-xs font-semibold hover:bg-white/5"
              >
                {isEn ? "Cancel" : "रद्द करें"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Spiritual Wisdom Blog CMS" : "आध्यात्मिक ज्ञान ब्लॉग प्रबंधन"}
          </h1>
          <p className="text-xs text-ink/60">
            {isEn
              ? "WordPad/Docs-style Rich-Text Publishing for spiritual wisdom, discourses, and divine reflections"
              : "आत्मज्ञान, दर्शन, प्रेम-सेवा और आध्यात्मिक साधना पर रिच-टेक्स्ट ब्लॉग प्रकाशित करें"}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setShowAddForm(!showAddForm);
            setShowLivePreview(false);
          }}
          className="px-4 py-2 rounded-xl bg-gold-gradient text-on-gold text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
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
        <form onSubmit={handleSave} className="spiritual-glass-card rounded-2xl p-6 sm:p-7 border-2 border-gold-400/50 space-y-6 animate-fade-in shadow-2xl bg-surface-2/90">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="text-sm font-bold text-gold-700 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-700" />
              <span>{editingId ? (isEn ? "Edit Blog" : "आलेख संपादित करें") : isEn ? "Write New Blog" : "नया आलेख लिखें"}</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  showLivePreview
                    ? "bg-gold-500/25 border-gold-400 text-gold-800"
                    : "border-line text-ink/75 hover:bg-gold-500/10"
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-gold-700" />
                <span>{showLivePreview ? (isEn ? "Edit Mode" : "संपादन मोड") : isEn ? "Live Preview" : "लाइव पूर्वावलोकन"}</span>
              </button>

              <button type="button" onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-white/10 text-ink/70">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Titles (Hindi & English) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">{isEn ? "Title (Hindi) *" : "शीर्षक (हिन्दी) *"}</label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. प्रेम और सेवा: ईश्वर प्राप्ति का सरल मार्ग"
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">{isEn ? "Title (English)" : "शीर्षक (अंग्रेज़ी)"}</label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Love & Service: Direct Path to the Divine"
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category, Author, Read Time, Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category with Dynamic Add */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gold-700">{isEn ? "Category *" : "श्रेणी *"}</label>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}
                  className="text-[10px] text-gold-700 font-bold hover:underline"
                >
                  {isAddingCustomCategory ? (isEn ? "Select Existing" : "मौजूदा चुनें") : (isEn ? "+ New Category" : "+ नई श्रेणी")}
                </button>
              </div>

              {isAddingCustomCategory ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    placeholder={isEn ? "Category Name" : "श्रेणी का नाम"}
                    className="w-full p-2 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="px-2.5 py-2 rounded-xl bg-gold-gradient text-on-gold text-xs font-bold shrink-0"
                  >
                    {isEn ? "Add" : "जोड़ें"}
                  </button>
                </div>
              ) : (
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">{isEn ? "Author" : "लेखक / शोधपीठ"}</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">{isEn ? "Read Time" : "पढ़ने का समय"}</label>
              <input
                type="text"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                placeholder="5 min read"
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">{isEn ? "Tags (comma separated)" : "टैग्स (अल्पविराम से अलग)"}</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="ब्रह्मज्ञान, साधना, प्रेम"
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>
          </div>

          {/* Featured Image Upload */}
          <div className="p-4 rounded-2xl bg-surface-sunk/70 border border-line">
            <ImageUploadField
              label={isEn ? "Featured Header Photo (Upload to Cloudflare R2 or Paste URL) *" : "ब्लॉग मुख्य हेडर फोटो (क्लाउड पर अपलोड या लिंक) *"}
              value={form.featuredImage}
              onChange={(url) => setForm({ ...form, featuredImage: url })}
            />
          </div>

          {/* Short Summaries (For Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">
                {isEn ? "Card Summary (Hindi - 2 lines)" : "कार्ड सारांश (हिन्दी - २ पंक्तियाँ)"}
              </label>
              <textarea
                rows={2}
                value={form.summaryHi}
                onChange={(e) => setForm({ ...form, summaryHi: e.target.value })}
                placeholder="संक्षिप्त सारांश जो ब्लॉग कार्ड पर दिखेगा..."
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">
                {isEn ? "Card Summary (English - 2 lines)" : "कार्ड सारांश (अंग्रेज़ी - २ पंक्तियाँ)"}
              </label>
              <textarea
                rows={2}
                value={form.summaryEn}
                onChange={(e) => setForm({ ...form, summaryEn: e.target.value })}
                placeholder="Short card summary in English..."
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Full Rich-Text Editor Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("hi")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "hi"
                      ? "bg-gold-gradient text-on-gold shadow-gold-sm"
                      : "bg-surface text-ink/75 border border-line hover:border-gold-400/50"
                  }`}
                >
                  हिन्दी सामग्री (Full Rich Text) *
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "en"
                      ? "bg-gold-gradient text-on-gold shadow-gold-sm"
                      : "bg-surface text-ink/75 border border-line hover:border-gold-400/50"
                  }`}
                >
                  English Content (Optional)
                </button>
              </div>

              <span className="text-[11px] text-ink/60 hidden sm:inline">
                {isEn ? "Format text, add headings, colors, photos & quotes" : "टेक्स्ट फॉर्मेट करें, हेडिंग, फोटो व कोट्स लगाएं"}
              </span>
            </div>

            {/* Live Preview Mode or Editor Mode */}
            {showLivePreview ? (
              <div className="p-6 rounded-2xl border-2 border-gold-400/40 bg-surface space-y-4">
                <div className="flex items-center gap-2 text-xs text-amber-700 font-bold uppercase pb-2 border-b border-line">
                  <Sparkles className="w-4 h-4" />
                  <span>{isEn ? "Live Reader Preview" : "पाठक दृश्य (लाइव प्रिव्यू)"}</span>
                  <span className="ml-auto text-ink/60 text-[11px]">
                    Viewing: {activeTab === "hi" ? "हिन्दी" : "English"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-spiritual-heading">
                  {activeTab === "hi" ? form.titleHi || "शीर्षक..." : form.titleEn || form.titleHi || "Title..."}
                </h1>

                <div className="text-xs text-ink/60 flex items-center gap-3">
                  <span>{form.author}</span>
                  <span>•</span>
                  <span>{form.category}</span>
                  <span>•</span>
                  <span>{form.readTime}</span>
                </div>

                {form.featuredImage && (
                  <div className="relative aspect-video max-h-72 w-full rounded-2xl overflow-hidden border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.featuredImage} alt="Header" className="w-full h-full object-cover" />
                  </div>
                )}

                <div
                  className="prose max-w-none text-sm text-ink leading-relaxed font-devanagari py-2"
                  dangerouslySetInnerHTML={{
                    __html:
                      (activeTab === "hi" ? form.contentHi : form.contentEn) ||
                      "<p class='text-ink/50 italic'>No content written yet...</p>",
                  }}
                />
              </div>
            ) : (
              <div>
                {activeTab === "hi" ? (
                  <RichTextEditor
                    value={form.contentHi}
                    onChange={(html) => setForm({ ...form, contentHi: html })}
                    placeholder="यहाँ विस्तृत आध्यात्मिक आलेख लिखें... (हेडिंग्स, बोल्ड, इटैलिक, फोटो, कोट्स आदि जोड़ें)"
                    minHeight="380px"
                  />
                ) : (
                  <RichTextEditor
                    value={form.contentEn}
                    onChange={(html) => setForm({ ...form, contentEn: html })}
                    placeholder="Write the full English spiritual essay here..."
                    minHeight="380px"
                  />
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-line">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-on-gold font-bold text-xs shadow-gold-sm flex items-center gap-1.5 hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>{isSaving ? "Saving..." : isEn ? "Save & Publish Blog" : "आलेख सेव व प्रकाशित करें"}</span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                setShowAddForm(false);
                setShowLivePreview(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-card border border-line text-xs text-ink/70 hover:bg-white/5"
            >
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {/* Blogs Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-line shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-surface-sunk border-b border-line text-gold-700 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Title" : "शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Category" : "श्रेणी"}</th>
                <th className="p-3.5">{isEn ? "Author" : "लेखक"}</th>
                <th className="p-3.5">{isEn ? "Read Time" : "समय"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-ink max-w-xs truncate">
                    {isEn ? blog.titleEn || blog.titleHi : blog.titleHi}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-700 text-[10px] uppercase font-bold">
                      {blog.category || "तत्व ज्ञान"}
                    </span>
                  </td>
                  <td className="p-3.5 text-ink/70">{blog.author}</td>
                  <td className="p-3.5 text-ink/60">{blog.readTime || "5 min read"}</td>
                  <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleEdit(blog)}
                      className="p-1.5 rounded-lg border border-line text-gold-700 hover:bg-gold-500/20 hover:scale-105 transition-all shadow-sm"
                      title={isEn ? "Edit" : "संपादित करें"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(blog)}
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-700 hover:bg-red-500/20 hover:scale-105 transition-all shadow-sm"
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
