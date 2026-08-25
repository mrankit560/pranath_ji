"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { AudioTrack } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Music, Play, CheckCircle, X } from "lucide-react";
import { useAudio } from "@/lib/audio/AudioContext";

export default function AdminAudioPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(() => store.getAudioTracks());
  const { playTrack } = useAudio();
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<AudioTrack | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    titleHi: "",
    titleEn: "",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/temple_bell_loop.ogg",
    coverUrl: "/assets/logo-emblem.png",
    category: "aarti" as AudioTrack["category"],
    speaker: "साढौली धाम आश्रम वृंद",
    duration: "08:00",
    order: 1,
    published: true,
  });

  useEffect(() => {
    setAudioTracks(store.getAudioTracks());
    const unsub = store.subscribe(() => {
      setAudioTracks(store.getAudioTracks());
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    store.addAudioTrack(form);
    await store.saveToStorage("prannath_audio_v2", store.getAudioTracks());

    setAudioTracks(store.getAudioTracks());
    setIsSaving(false);
    showToast(
      isEn
        ? `✓ Audio Track "${form.titleEn || form.titleHi}" added and saved to database!`
        : `✓ भजन/आरती "${form.titleHi}" डेटाबेस में सुरक्षित हो गई!`
    );

    setShowAddForm(false);
    setForm({
      titleHi: "",
      titleEn: "",
      audioUrl: "https://actions.google.com/sounds/v1/ambiences/temple_bell_loop.ogg",
      coverUrl: "/assets/logo-emblem.png",
      category: "aarti",
      speaker: "साढौली धाम आश्रम वृंद",
      duration: "08:00",
      order: audioTracks.length + 1,
      published: true,
    });
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const title = deleteCandidate.titleHi || deleteCandidate.titleEn;
    setIsSaving(true);
    store.deleteAudioTrack(deleteCandidate.id);
    await store.saveToStorage("prannath_audio_v2", store.getAudioTracks());
    setAudioTracks(store.getAudioTracks());
    setIsSaving(false);
    setDeleteCandidate(null);
    showToast(
      isEn
        ? `✓ Audio track "${title}" deleted from database.`
        : `✓ ऑडियो ट्रैक "${title}" डेटाबेस से हटा दिया गया।`
    );
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

      {/* In-App Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="spiritual-glass-card rounded-3xl max-w-md w-full p-6 border-2 border-red-500/50 shadow-2xl bg-spiritual-navy text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-spiritual-ivory mb-1">
                {isEn ? "Delete Audio Track?" : "ऑडियो ट्रैक हटाएं?"}
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

      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Audio, Aarti & Vani Gayan CMS" : "ऑडियो, आरती एवं वाणी गायन CMS"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Manage devotional bhajans, aarti tracks, and daily recitations for the global audio player"
              : "ग्लोबल ऑडियो प्लेयर में प्रसारित होने वाले भजनों, आरतियों और नित्य नियम का प्रबंधन"}
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
                ? "Close Form"
                : "फॉर्म बंद करें"
              : isEn
              ? "Add Audio Track"
              : "नया ऑडियो जोड़ें"}
          </span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddAudio}
          className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-4 animate-fade-in shadow-2xl bg-spiritual-navy/80"
        >
          <h2 className="text-base font-bold text-gold-300 font-spiritual-heading">
            {isEn ? "Add New Audio Track / Bhajan" : "नया ऑडियो ट्रैक / आरती जोड़ें"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Track Title (Hindi) *" : "ट्रैक का नाम (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. साढौली धाम संध्या आरती"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Track Title (English)" : "ट्रैक का नाम (अंग्रेज़ी)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Sadhauli Dham Evening Aarti"
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
                onChange={(e) => setForm({ ...form, category: e.target.value as AudioTrack["category"] })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="aarti">{isEn ? "Aarti & Stuti" : "आरती व स्तुति"}</option>
                <option value="bhajan">{isEn ? "Devotional Bhajan" : "भजन"}</option>
                <option value="vani_gayan">{isEn ? "Vani Gayan" : "वाणी गायन"}</option>
                <option value="meditation">{isEn ? "Chitwani & Meditation Music" : "चितवनी ध्यान संगीत"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Singer / Artist" : "गायक / आश्रम वृंद"}
              </label>
              <input
                type="text"
                value={form.speaker}
                onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Duration (MM:SS)" : "अवधि (उदा. 08:00)"}
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Audio Stream URL (.mp3 / .ogg / stream link) *" : "ऑडियो लिंक (MP3/OGG URL) *"}
            </label>
            <input
              type="text"
              required
              value={form.audioUrl}
              onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <Music className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>
                {isSaving
                  ? isEn
                    ? "Saving to Database..."
                    : "डेटाबेस में सहेजा जा रहा है..."
                  : isEn
                  ? "Save Audio Track"
                  : "ऑडियो सेव करें"}
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

      {/* Audio Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/70 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Play" : "प्ले"}</th>
                <th className="p-3.5">{isEn ? "Title" : "शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Singer / Ashram" : "गायक / आश्रम"}</th>
                <th className="p-3.5">{isEn ? "Category" : "श्रेणी"}</th>
                <th className="p-3.5">{isEn ? "Duration" : "अवधि"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {audioTracks.map((t) => (
                <tr key={t.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => playTrack(t)}
                      className="w-8 h-8 rounded-full bg-gold-gradient text-spiritual-dark flex items-center justify-center shadow-gold-sm hover:scale-110 transition-transform"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </td>
                  <td className="p-3.5 font-bold text-spiritual-ivory">
                    {isEn ? t.titleEn || t.titleHi : t.titleHi}
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/70">{t.speaker}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 text-[10px] uppercase font-bold">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-gold-300">{t.duration}</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(t)}
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
