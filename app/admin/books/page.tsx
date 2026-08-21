"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Book } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Edit3, BookOpen, Save, X, Download } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PdfUploadField } from "@/components/admin/PdfUploadField";

export default function AdminBooksPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [books, setBooks] = useState<Book[]>(store.getBooks());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    pdfUrl: "https://archive.org/download/tartam-vani-sample/sample.pdf",
    pages: 200,
    bookBlogHi: "",
    bookBlogEn: "",
    featured: false,
    published: true,
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBooks(store.getBooks());
    });
    return () => unsub();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

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
      setEditingId(null);
    } else {
      store.addBook({
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
    }

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
      pdfUrl: "https://archive.org/download/tartam-vani-sample/sample.pdf",
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
  };

  const handleDelete = (id: string) => {
    const confirmMsg = isEn
      ? "Are you sure you want to delete this PDF book?"
      : "क्या आप वाकई इस PDF पुस्तक को हटाना चाहते हैं?";
    if (confirm(confirmMsg)) {
      store.deleteBook(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
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
          className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm"
        >
          <Plus className="w-4 h-4" />
          <span>
            {showAddForm
              ? isEn
                ? "Close Form"
                : "फॉर्म बंद करें"
              : isEn
              ? "Add New PDF Book"
              : "नई PDF पुस्तक जोड़ें"}
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
                  ? "Edit PDF Book"
                  : "पुस्तक विवरण संपादित करें"
                : isEn
                ? "Add New PDF Book"
                : "नई पुस्तक जोड़ें"}
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
                {isEn ? "Book Title (Hindi) *" : "पुस्तक शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. श्री बीतक साहेब"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Book Title (English)" : "पुस्तक शीर्षक (English)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g., Shri Bitak Saheb"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Book Category *" : "पुस्तक श्रेणी *"}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="bitak_saheb">
                  {isEn ? "2. Shree Bitak Saheb" : "२. श्री बीतक साहेब"}
                </option>
                <option value="tartam_vani">
                  {isEn ? "3. Tartam Vani" : "३. तारतम वाणी"}
                </option>
                <option value="other">
                  {isEn ? "4. Other Books" : "४. अन्य पुस्तकें"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Author / Commentator" : "लेखक / टीकाकार"}
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
                {isEn ? "Total Pages Count" : "कुल पृष्ठ संख्या (Pages)"}
              </label>
              <input
                type="number"
                value={form.pages}
                onChange={(e) => setForm({ ...form, pages: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-black/40 border border-gold-500/20">
            {/* Book Cover Photo Upload */}
            <ImageUploadField
              label={isEn ? "Book Cover Photo *" : "पुस्तक कवर फोटो (Cover Photo) *"}
              value={form.coverUrl}
              onChange={(url) => setForm({ ...form, coverUrl: url })}
              recommendedSize="600 × 900 px"
              aspectRatio="2:3 (पोर्ट्रेट बुक कवर)"
              maxSizeMB={5}
              helperText={isEn ? "Shows as the main book cover in PDF Library" : "लाइब्रेरी में पुस्तक के मुख्य कवर के रूप में दिखेगी"}
            />

            {/* Book PDF Upload */}
            <PdfUploadField
              label={isEn ? "Book PDF File Document *" : "पुस्तक PDF फाइल (E-Book File) *"}
              value={form.pdfUrl}
              onChange={(url) => setForm({ ...form, pdfUrl: url })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Short Book Description (Hindi)" : "संक्षिप्त पुस्तक विवरण (हिन्दी)"}
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
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? (isEn ? "Update Book" : "पुस्तक अपडेट करें") : (isEn ? "Save Book" : "पुस्तक सेव करें")}</span>
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

      {/* Books Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Book Title" : "पुस्तक शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Category" : "श्रेणी"}</th>
                <th className="p-3.5">{isEn ? "Author" : "लेखक"}</th>
                <th className="p-3.5">{isEn ? "Pages" : "पृष्ठ"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gold-500/5 transition-colors">
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
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                      title={isEn ? "Edit" : "संपादित करें"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
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
