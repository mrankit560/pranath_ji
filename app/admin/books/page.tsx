"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Book } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Edit3, BookOpen, Save, X, Download, CheckCircle } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PdfUploadField } from "@/components/admin/PdfUploadField";

export default function AdminBooksPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [books, setBooks] = useState<Book[]>(() => store.getBooks());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Book | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    titleHi: "",
    titleEn: "",
    authorHi: "साढौली धाम शोध पीठ",
    authorEn: "Sadhauli Dham Research Cell",
    descriptionHi: "",
    descriptionEn: "",
    category: "bitak_saheb" as Book["category"],
    language: "hi" as Book["language"],
    coverUrl: "/assets/logo-emblem.png",
    pdfUrl: "/assets/shri-bitak-saheb.pdf",
    pages: 200,
    bookBlogHi: "",
    bookBlogEn: "",
    featured: false,
    published: true,
  });

  useEffect(() => {
    setBooks(store.getBooks());
    const unsub = store.subscribe(() => {
      setBooks(store.getBooks());
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

    let savedId = editingId;

    if (editingId) {
      store.updateBook(editingId, {
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        authorHi: form.authorHi,
        authorEn: form.authorEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        category: form.category,
        language: form.language,
        coverUrl: form.coverUrl,
        pdfUrl: form.pdfUrl,
        pages: Number(form.pages),
        bookBlogHi: form.bookBlogHi,
        bookBlogEn: form.bookBlogEn,
        featured: form.featured,
        published: form.published,
      });
      const saveSuccess = await store.saveToStorage("prannath_books_v2", store.getBooks());
      console.log("[Admin Books] Book updated successfully:", { id: editingId, saveSuccess });
      showToast(
        isEn
          ? `✓ Book "${form.titleEn || form.titleHi}" updated and saved to database!`
          : `✓ पुस्तक "${form.titleHi}" डेटाबेस में सफलतापूर्वक सुरक्षित हो गई!`
      );
      setHighlightedId(editingId);
      setEditingId(null);
    } else {
      const created = store.addBook({
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        authorHi: form.authorHi,
        authorEn: form.authorEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        category: form.category,
        language: form.language,
        coverUrl: form.coverUrl,
        pdfUrl: form.pdfUrl,
        pages: Number(form.pages),
        bookBlogHi: form.bookBlogHi,
        bookBlogEn: form.bookBlogEn,
        featured: form.featured,
        published: form.published,
      });
      savedId = created.id;
      const saveSuccess = await store.saveToStorage("prannath_books_v2", store.getBooks());
      console.log("[Admin Books] New book created successfully:", { id: created.id, saveSuccess });
      setHighlightedId(created.id);
      showToast(
        isEn
          ? `✓ New Book "${form.titleEn || form.titleHi}" added and saved to database!`
          : `✓ नई पुस्तक "${form.titleHi}" डेटाबेस में सफलतापूर्वक जुड़ गई!`
      );
    }

    setBooks(store.getBooks());
    setIsSaving(false);
    setShowAddForm(false);

    setForm({
      titleHi: "",
      titleEn: "",
      authorHi: "साढौली धाम शोध पीठ",
      authorEn: "Sadhauli Dham Research Cell",
      descriptionHi: "",
      descriptionEn: "",
      category: "bitak_saheb",
      language: "hi",
      coverUrl: "/assets/logo-emblem.png",
      pdfUrl: "/assets/shri-bitak-saheb.pdf",
      pages: 200,
      bookBlogHi: "",
      bookBlogEn: "",
      featured: false,
      published: true,
    });
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.id);
    setForm({
      titleHi: book.titleHi || "",
      titleEn: book.titleEn || "",
      authorHi: book.authorHi || "साढौली धाम शोध पीठ",
      authorEn: book.authorEn || "Sadhauli Dham Research Cell",
      descriptionHi: book.descriptionHi || "",
      descriptionEn: book.descriptionEn || "",
      category: book.category || "bitak_saheb",
      language: book.language || "hi",
      coverUrl: book.coverUrl || "/assets/logo-emblem.png",
      pdfUrl: book.pdfUrl || "",
      pages: book.pages || 200,
      bookBlogHi: book.bookBlogHi || "",
      bookBlogEn: book.bookBlogEn || "",
      featured: book.featured || false,
      published: book.published ?? true,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const title = deleteCandidate.titleHi || deleteCandidate.titleEn;
    setIsSaving(true);
    store.deleteBook(deleteCandidate.id);
    await store.saveToStorage("prannath_books_v2", store.getBooks());
    setBooks(store.getBooks());
    setIsSaving(false);
    setDeleteCandidate(null);
    showToast(
      isEn
        ? `✓ Book "${title}" deleted from database.`
        : `✓ पुस्तक "${title}" डेटाबेस से सफलतापूर्वक हटा दी गई।`
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
                {isEn ? "Delete PDF Book?" : "पुस्तक हटाएं?"}
              </h3>
              <p className="text-xs text-spiritual-ivory/70 leading-relaxed">
                {isEn
                  ? `Are you sure you want to permanently delete "${deleteCandidate.titleEn || deleteCandidate.titleHi}"?`
                  : `क्या आप वाकई "${deleteCandidate.titleHi}" को डेटाबेस से हटाना चाहते हैं?`}
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

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-spiritual-dark border-2 border-emerald-400 shadow-2xl animate-bounce-short">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">
              {isEn ? "Database Updated" : "डेटाबेस अपडेट"}
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

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "PDF Library & Books CMS" : "PDF ग्रंथालय व पुस्तक प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Add, edit, and organize PDF books across categories (Bitak Saheb, Tartam Vani, Other Books) with Book Reviews"
              : "श्री बीतक साहेब, तारतम वाणी एवं अन्य पुस्तकों को PDF लिंक, समीक्षा/ब्लॉग एवं विवरण सहित प्रबंधित करें"}
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
              ? "Add New Book"
              : "नई पुस्तक जोड़ें"}
          </span>
        </button>
      </div>

      {/* Add / Edit Book Form */}
      {showAddForm && (
        <form
          onSubmit={handleSave}
          className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-5 animate-fade-in shadow-2xl bg-spiritual-navy/80"
        >
          <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
            <h2 className="text-base font-bold text-gold-300 font-spiritual-heading">
              {editingId
                ? isEn
                  ? "Edit PDF Book Details"
                  : "पुस्तक विवरण संपादित करें"
                : isEn
                ? "Add New PDF Book to Library"
                : "ग्रंथालय में नई PDF पुस्तक जोड़ें"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setShowAddForm(false);
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-spiritual-ivory/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Book Title (Hindi) *" : "पुस्तक शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. श्री बीतक साहेब (प्रामाणिक संस्करण)"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Book Title (English)" : "पुस्तक शीर्षक (अंग्रेज़ी)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Shri Bitak Saheb"
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
                onChange={(e) => setForm({ ...form, category: e.target.value as Book["category"] })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="bitak_saheb">{isEn ? "Shri Bitak Saheb" : "श्री बीतक साहेब"}</option>
                <option value="tartam_vani">{isEn ? "Shri Tartam Vani" : "श्री तारतम वाणी"}</option>
                <option value="commentary">{isEn ? "Commentary / Teeka" : "टीका एवं भाष्य"}</option>
                <option value="biography">{isEn ? "Charitra / Biography" : "चरित्र व जीवन गाथा"}</option>
                <option value="spiritual">{isEn ? "Spiritual / Other" : "आध्यात्मिक ज्ञान"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Author / Research Cell (Hindi)" : "लेखक / शोध पीठ (हिन्दी)"}
              </label>
              <input
                type="text"
                value={form.authorHi}
                onChange={(e) => setForm({ ...form, authorHi: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Page Count" : "कुल पृष्ठ संख्या"}
              </label>
              <input
                type="number"
                value={form.pages}
                onChange={(e) => setForm({ ...form, pages: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Book Cover Image & PDF Document Upload Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadField
              label={isEn ? "Book Cover Image (Local Upload / URL)" : "पुस्तक मुखपृष्ठ (कवर फोटो)"}
              value={form.coverUrl}
              onChange={(url) => setForm({ ...form, coverUrl: url })}
              recommendedSize="600 × 900 px (3:4 Book Ratio)"
              aspectRatio="3:4 (पोर्ट्रेट पुस्तक)"
              maxSizeMB={4}
            />

            <PdfUploadField
              label={isEn ? "Scripture PDF File (Upload / Link) *" : "शास्त्र PDF ग्रन्थ (अपलोड / लिंक) *"}
              value={form.pdfUrl}
              onChange={(url) => setForm({ ...form, pdfUrl: url })}
              maxSizeMB={50}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Short Summary / Overview (Hindi)" : "संक्षिप्त सारांश / परिचय (हिन्दी)"}
            </label>
            <textarea
              rows={2}
              value={form.descriptionHi}
              onChange={(e) => setForm({ ...form, descriptionHi: e.target.value })}
              placeholder="पुस्तक का संक्षिप्त परिचय..."
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none"
            />
          </div>

          {/* Book Blog / Review Editor (Admin requested feature) */}
          <div className="p-4 rounded-xl bg-black/40 border border-gold-500/30 space-y-2">
            <label className="block text-xs font-bold text-amber-300">
              {isEn
                ? "Book Review / Little Blog (Write about this book) [Hindi]"
                : "पुस्तक समीक्षा व परिचय ब्लॉग (एडमिन द्वारा पुस्तक पर विशेष लेख) [हिन्दी]"}
            </label>
            <textarea
              rows={4}
              value={form.bookBlogHi}
              onChange={(e) => setForm({ ...form, bookBlogHi: e.target.value })}
              placeholder="इस ग्रन्थ के महत्व, अध्ययन विधि एवं ऐतिहासिक प्रसंगों पर साधकों के मार्गदर्शन हेतु लेख लिखें..."
              className="w-full p-2.5 rounded-xl bg-black/70 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5 hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none"
            >
              <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>
                {isSaving
                  ? isEn
                    ? "Saving to Database..."
                    : "डेटाबेस में सहेजा जा रहा है..."
                  : editingId
                  ? isEn
                    ? "Update Book"
                    : "पुस्तक अपडेट करें"
                  : isEn
                  ? "Save Book"
                  : "पुस्तक सेव करें"}
              </span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                setEditingId(null);
                setShowAddForm(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70 hover:bg-white/5 disabled:opacity-50"
            >
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {/* Books Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="p-4 bg-spiritual-navy/80 border-b border-gold-500/20 flex items-center justify-between">
          <div className="text-xs text-gold-300 font-bold">
            📚 {isEn ? "Total PDF Books:" : "कुल सूचीबद्ध पुस्तकें:"} {books.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/70 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Book Title" : "पुस्तक शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Category" : "श्रेणी"}</th>
                <th className="p-3.5">{isEn ? "Author" : "लेखक"}</th>
                <th className="p-3.5">{isEn ? "Pages" : "पृष्ठ"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {books.map((book) => {
                const isHighlighted = highlightedId === book.id;
                return (
                  <tr
                    key={book.id}
                    className={`transition-colors ${
                      isHighlighted
                        ? "bg-amber-500/20 ring-1 ring-gold-400"
                        : "hover:bg-gold-500/5"
                    }`}
                  >
                    <td className="p-3.5 font-bold text-spiritual-ivory max-w-sm">
                      {isEn ? book.titleEn || book.titleHi : book.titleHi}
                      {book.bookBlogHi && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {isEn ? "Has Blog" : "समीक्षा उपलब्ध"}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 text-[10px] uppercase font-bold">
                        {book.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3.5 text-spiritual-ivory/70">{book.authorHi || book.authorEn}</td>
                    <td className="p-3.5 font-mono text-gold-300">{book.pages}</td>
                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 hover:scale-105 transition-all shadow-sm"
                        title={isEn ? "Edit Book" : "पुस्तक संपादित करें"}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(book)}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow-sm"
                        title={isEn ? "Delete Book" : "पुस्तक हटाएं"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
