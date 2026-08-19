"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { AudioTrack } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Music, Play } from "lucide-react";
import { useAudio } from "@/lib/audio/AudioContext";

export default function AdminAudioPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(store.getAudioTracks());
  const { playTrack } = useAudio();
  const [showAddForm, setShowAddForm] = useState(false);

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
    const unsub = store.subscribe(() => {
      setAudioTracks(store.getAudioTracks());
    });
    return () => unsub();
  }, []);

  const handleAddAudio = (e: React.FormEvent) => {
    e.preventDefault();
    store.addAudioTrack(form);
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

  const handleDelete = (id: string) => {
    const confirmMsg = isEn
      ? "Are you sure you want to delete this audio track?"
      : "क्या आप इस ऑडियो ट्रैक को हटाना चाहते हैं?";
    if (confirm(confirmMsg)) {
      store.deleteAudioTrack(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
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
          className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm"
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
          className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-4 animate-fade-in"
        >
          <h2 className="text-base font-bold text-gold-300 font-spiritual-heading">
            {isEn ? "Add New Audio Track" : "नया ऑडियो ट्रैक जोड़ें"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Audio Title (Hindi) *" : "ऑडियो शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder={isEn ? "e.g. श्री प्राणनाथ जी महाआरती" : "उदा. श्री प्राणनाथ जी महाआरती"}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Audio Title (English) *" : "Audio Title (English) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Shri Prannath Ji Maha Aarti"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Category" : "श्रेणी (Category)"}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="aarti">{isEn ? "Aarti" : "आरती (Aarti)"}</option>
                <option value="nityaNiyam">{isEn ? "Daily Recitation (Nitya Niyam)" : "नित्य नियम (Nitya Niyam)"}</option>
                <option value="vaniGayan">{isEn ? "Vani Gayan" : "वाणी गायन (Vani Gayan)"}</option>
                <option value="bhajan">{isEn ? "Devotional Bhajan" : "भजन (Bhajan)"}</option>
                <option value="chitwani">{isEn ? "Chitwani & Meditation" : "चितवनी (Chitwani)"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Singer / Speaker" : "गायक / वक्ता"}
              </label>
              <input
                type="text"
                value={form.speaker}
                onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Duration" : "अवधि (Duration)"}
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="08:00"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "MP3 Audio URL / Direct Link *" : "MP3 ऑडियो URL / Direct Link *"}
            </label>
            <input
              type="text"
              required
              value={form.audioUrl}
              onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm"
            >
              {isEn ? "Add Audio Track" : "ऑडियो ट्रैक जोड़ें"}
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

      {/* Audio Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
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
              {audioTracks.map((a) => (
                <tr key={a.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5">
                    <button
                      onClick={() => playTrack(a, audioTracks)}
                      className="w-7 h-7 rounded-full bg-gold-gradient text-spiritual-dark flex items-center justify-center shadow-sm"
                      title={isEn ? "Play Track" : "चलाएं"}
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </td>
                  <td className="p-3.5 font-bold text-spiritual-ivory">
                    {isEn ? a.titleEn || a.titleHi : a.titleHi}
                    <div className="text-[10px] text-spiritual-ivory/50 font-normal">
                      {isEn ? a.titleHi : a.titleEn}
                    </div>
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/70">{a.speaker}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 text-[10px]">
                      {a.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">{a.duration}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(a.id)}
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
