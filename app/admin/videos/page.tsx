"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { store } from "@/lib/data/store";
import { Video } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Edit3, Video as VideoIcon, Play, Radio, Sparkles, CheckCircle, X, ExternalLink } from "lucide-react";

export default function AdminVideosPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [videos, setVideos] = useState<Video[]>(() => store.getVideos());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Video | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    urlInput: "",
    titleHi: "",
    titleEn: "",
    descriptionHi: "",
    descriptionEn: "",
    category: "satsang" as Video["category"],
    speaker: "पूज्य संत वृंद, साढौली धाम",
    duration: "45:00",
    isLive: false,
    featured: true,
    published: true,
  });

  useEffect(() => {
    setVideos(store.getVideos());
    const unsub = store.subscribe(() => {
      setVideos(store.getVideos());
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ytId = extractYouTubeId(form.urlInput);
    const thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

    if (editingId) {
      store.updateVideo(editingId, {
        youtubeId: ytId,
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        category: form.category,
        speaker: form.speaker,
        duration: form.duration,
        thumbnail: thumbnail,
        featured: form.featured,
        published: form.published,
        isLive: form.isLive,
      });
      await store.saveToStorage("prannath_videos_v2", store.getVideos());
      showToast(
        isEn
          ? `✓ Video "${form.titleEn || form.titleHi}" updated and saved to database!`
          : `✓ सत्संग वीडियो "${form.titleHi}" डेटाबेस में अपडेट हो गया!`
      );
      setEditingId(null);
    } else {
      store.addVideo({
        youtubeId: ytId,
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        category: form.category,
        speaker: form.speaker,
        duration: form.duration,
        thumbnail: thumbnail,
        featured: form.featured,
        published: form.published,
        isLive: form.isLive,
      });
      await store.saveToStorage("prannath_videos_v2", store.getVideos());
      showToast(
        isEn
          ? `✓ Video "${form.titleEn || form.titleHi}" added and saved to database!`
          : `✓ सत्संग वीडियो "${form.titleHi}" डेटाबेस में सुरक्षित हो गया!`
      );
    }

    setVideos(store.getVideos());
    setIsSaving(false);
    setShowAddForm(false);
    setForm({
      urlInput: "",
      titleHi: "",
      titleEn: "",
      descriptionHi: "",
      descriptionEn: "",
      category: "satsang",
      speaker: "पूज्य संत वृंद, साढौली धाम",
      duration: "45:00",
      isLive: false,
      featured: true,
      published: true,
    });
  };

  const handleEdit = (v: Video) => {
    setEditingId(v.id);
    setForm({
      urlInput: `https://www.youtube.com/watch?v=${v.youtubeId}`,
      titleHi: v.titleHi || "",
      titleEn: v.titleEn || "",
      descriptionHi: v.descriptionHi || "",
      descriptionEn: v.descriptionEn || "",
      category: v.category || "satsang",
      speaker: v.speaker || "पूज्य संत वृंद, साढौली धाम",
      duration: v.duration || "45:00",
      isLive: v.isLive || false,
      featured: v.featured || false,
      published: v.published ?? true,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const title = deleteCandidate.titleHi || deleteCandidate.titleEn;
    setIsSaving(true);
    store.deleteVideo(deleteCandidate.id);
    await store.saveToStorage("prannath_videos_v2", store.getVideos());
    setVideos(store.getVideos());
    setIsSaving(false);
    setDeleteCandidate(null);
    showToast(
      isEn
        ? `✓ Video "${title}" deleted from database.`
        : `✓ वीडियो "${title}" डेटाबेस से हटा दिया गया।`
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-100 to-surface-2 border-2 border-emerald-400 shadow-2xl animate-bounce-short">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center border border-emerald-400">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-700">
              {isEn ? "Success" : "सफलतापूर्वक पूर्ण"}
            </div>
            <div className="text-xs text-ink font-medium">
              {toastMessage}
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-emerald-700 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-scrim/55 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="spiritual-glass-card rounded-3xl max-w-md w-full p-6 border-2 border-red-500/50 shadow-2xl bg-surface-2 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-700 flex items-center justify-center mx-auto border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink mb-1">
                {isEn ? "Delete Satsang Video?" : "सत्संग वीडियो हटाएं?"}
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
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
                className="px-5 py-2.5 rounded-xl bg-card border border-line text-ink/80 text-xs font-semibold hover:bg-white/5"
              >
                {isEn ? "Cancel" : "रद्द करें"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Media Centre CMS (Videos & Satsang)" : "मीडिया केंद्र प्रबंधन (वीडियो एवं सत्संग)"}
          </h1>
          <p className="text-xs text-ink/60 mt-1">
            {isEn
              ? "Add YouTube discourses, categorize Vani recitations, and configure live broadcasts"
              : "यूट्यूब सत्संग लिंक जोड़ें, वाणी गायन व प्रवचन श्रेणीबद्ध करें तथा लाइव प्रसारण प्रबंधित करें"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/media"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-card border border-line text-gold-700 text-xs font-semibold hover:bg-gold-500/10 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isEn ? "View Media Centre on Site ↗" : "मीडिया केंद्र देखें ↗"}</span>
          </Link>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-gold-gradient text-on-gold text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>
              {showAddForm
                ? isEn
                  ? "Close Form"
                  : "फॉर्म बंद करें"
                : isEn
                ? "Add YouTube Video"
                : "नया वीडियो जोड़ें"}
            </span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddVideo}
          className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in shadow-2xl bg-surface-2/80"
        >
          <h3 className="text-sm font-bold text-gold-700 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-700" />
            <span>{isEn ? "Add New Satsang Video" : "नया सत्संग वीडियो जोड़ें"}</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gold-700 mb-1">
              {isEn ? "YouTube Video URL or ID *" : "यूट्यूब वीडियो लिंक या Video ID *"}
            </label>
            <input
              type="text"
              required
              value={form.urlInput}
              onChange={(e) => setForm({ ...form, urlInput: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or Video ID"
              className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">
                {isEn ? "Video Title (Hindi) *" : "वीडियो शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="श्री तारतम वाणी रहस्य एवं परमधाम महिमा"
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">
                {isEn ? "Video Title (English)" : "वीडियो शीर्षक (अंग्रेज़ी)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="Secrets of Tartam Vani & Glory of Paramdham"
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">
                {isEn ? "Category *" : "श्रेणी *"}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Video["category"] })}
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none"
              >
                <option value="satsang">{isEn ? "Satsang & Pravachan" : "सत्संग एवं प्रवचन"}</option>
                <option value="vani_gayan">{isEn ? "Vani Gayan & Bhajans" : "वाणी गायन व भजन"}</option>
                <option value="darshan">{isEn ? "Ashram & Dham Darshan" : "आश्रम व धाम दर्शन"}</option>
                <option value="katha">{isEn ? "Bitak Katha" : "बीतक कथा"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">
                {isEn ? "Speaker / Sant" : "वक्ता / संत"}
              </label>
              <input
                type="text"
                value={form.speaker}
                onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-700 mb-1">
                {isEn ? "Duration (e.g. 45:00)" : "अवधि (उदा. 45:00)"}
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-field border border-line text-xs text-ink focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-on-gold font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <VideoIcon className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>
                {isSaving
                  ? isEn
                    ? "Saving to Database..."
                    : "डेटाबेस में सहेजा जा रहा है..."
                  : isEn
                  ? "Save Video"
                  : "वीडियो सेव करें"}
              </span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-xl bg-card border border-line text-xs text-ink/70 hover:bg-white/5 disabled:opacity-50"
            >
              {isEn ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </form>
      )}

      {/* Videos List Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-line shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-surface-sunk border-b border-line text-gold-700 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Thumbnail" : "थंबनेल"}</th>
                <th className="p-3.5">{isEn ? "Title" : "शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Speaker" : "वक्ता"}</th>
                <th className="p-3.5">{isEn ? "Category" : "श्रेणी"}</th>
                <th className="p-3.5">{isEn ? "Duration" : "अवधि"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {videos.map((v) => (
                <tr key={v.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5">
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-line">
                      <Image
                        src={v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                        alt={v.titleHi}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-scrim/40">
                        <Play className="w-3.5 h-3.5 text-gold-700 fill-current" />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-ink max-w-xs">
                    {isEn ? v.titleEn || v.titleHi : v.titleHi}
                  </td>
                  <td className="p-3.5 text-ink/70">{v.speaker}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-700 text-[10px] uppercase font-bold">
                      {v.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">{v.duration}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(v)}
                        className="p-2 rounded-xl bg-gold-500/10 border border-line text-gold-700 hover:bg-gold-500/30 hover:scale-105 transition-all shadow-sm"
                        title={isEn ? "Edit" : "संपादित करें"}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(v)}
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 hover:bg-red-500/30 hover:scale-105 transition-all shadow-sm"
                        title={isEn ? "Delete" : "हटाएं"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
