"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { Video } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Video as VideoIcon, Play, Radio, Sparkles } from "lucide-react";

export default function AdminVideosPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [videos, setVideos] = useState<Video[]>(store.getVideos());
  const [showAddForm, setShowAddForm] = useState(false);

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
    const unsub = store.subscribe(() => {
      setVideos(store.getVideos());
    });
    return () => unsub();
  }, []);

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYouTubeId(form.urlInput);
    const thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

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

  const handleDelete = (id: string) => {
    const confirmMsg = isEn
      ? "Are you sure you want to delete this video?"
      : "क्या आप इस वीडियो को हटाना चाहते हैं?";
    if (confirm(confirmMsg)) {
      store.deleteVideo(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Video & YouTube Satsang CMS" : "वीडियो एवं YouTube सत्संग CMS"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Manage daily satsang, discourses, vani recitations, and live streams"
              : "दैनिक सत्संग, प्रवचन, वाणी गायन व लाइव स्ट्रीम का प्रबंधन करें"}
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
              ? "Add New Video"
              : "नया वीडियो जोड़ें"}
          </span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddVideo}
          className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-4 animate-fade-in"
        >
          <h2 className="text-base font-bold text-gold-300 font-spiritual-heading">
            {isEn ? "Add YouTube Video / Satsang" : "YouTube वीडियो विवरण दर्ज करें"}
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "YouTube Video URL or ID *" : "YouTube Video URL या ID *"}
            </label>
            <input
              type="text"
              required
              value={form.urlInput}
              onChange={(e) => setForm({ ...form, urlInput: e.target.value })}
              placeholder={isEn ? "https://www.youtube.com/watch?v=XXXXX or Video ID" : "https://www.youtube.com/watch?v=XXXXX या ID"}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Video Title (Hindi) *" : "वीडियो शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder={isEn ? "e.g. दैनिक सत्संग एवं वाणी विचार" : "उदा. दैनिक सत्संग एवं वाणी विचार"}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Video Title (English) *" : "Video Title (English) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Daily Satsang & Vani Discourse"
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
                <option value="satsang">{isEn ? "Satsang" : "सत्संग (Satsang)"}</option>
                <option value="pravachan">{isEn ? "Pravachan / Discourse" : "प्रवचन (Pravachan)"}</option>
                <option value="vaniGayan">{isEn ? "Vani Gayan" : "वाणी गायन (Vani Gayan)"}</option>
                <option value="bhajan">{isEn ? "Devotional Bhajan" : "भजन (Bhajan)"}</option>
                <option value="meditation">{isEn ? "Meditation & Chitwani" : "ध्यान (Meditation)"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Speaker / Saint" : "वक्ता / संत"}
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
                placeholder="45:00"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-spiritual-ivory cursor-pointer">
              <input
                type="checkbox"
                checked={form.isLive}
                onChange={(e) => setForm({ ...form, isLive: e.target.checked })}
                className="accent-red-500 w-4 h-4"
              />
              <span className="text-red-400 font-bold">
                {isEn ? "🔴 Mark as Active Live Satsang stream" : "🔴 अभी लाइव सत्संग के रूप में मार्क करें"}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm"
            >
              {isEn ? "Add Video" : "वीडियो जोड़ें"}
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

      {/* Videos List Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
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
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black border border-gold-500/30">
                      <Image src={v.thumbnail} alt="Thumbnail" fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-spiritual-ivory">
                    {isEn ? v.titleEn || v.titleHi : v.titleHi}
                    {v.isLive && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px]">
                        LIVE
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/70">{v.speaker}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px]">
                      {v.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">{v.duration}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(v.id)}
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
