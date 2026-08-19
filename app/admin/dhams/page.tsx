"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { HolyDham } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Edit3, MapPin, ExternalLink, Save, X } from "lucide-react";

export default function AdminDhamsPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [dhams, setDhams] = useState<HolyDham[]>(store.getDhams());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    nameHi: "",
    nameEn: "",
    descriptionHi: "",
    descriptionEn: "",
    location: "हरिद्वार, उत्तराखण्ड",
    mapUrl: "https://maps.app.goo.gl/n5oY9okf86WyuiKN9?g_st=com.google.maps.preview.copy",
    imageUrl: "/assets/hero-reference-1.jpg",
    phone: "+91 99271 97390",
    order: 1,
    featured: true,
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setDhams(store.getDhams());
    });
    return () => unsub();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      store.updateDham(editingId, {
        nameHi: form.nameHi,
        nameEn: form.nameEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        location: form.location,
        mapUrl: form.mapUrl,
        imageUrl: form.imageUrl,
        phone: form.phone,
        order: Number(form.order),
        featured: form.featured,
      });
      setEditingId(null);
    } else {
      store.addDham({
        nameHi: form.nameHi,
        nameEn: form.nameEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        location: form.location,
        mapUrl: form.mapUrl,
        imageUrl: form.imageUrl,
        phone: form.phone,
        order: Number(form.order),
        featured: form.featured,
      });
    }

    setShowAddForm(false);
    setForm({
      nameHi: "",
      nameEn: "",
      descriptionHi: "",
      descriptionEn: "",
      location: "",
      mapUrl: "",
      imageUrl: "/assets/hero-reference-1.jpg",
      phone: "+91 99271 97390",
      order: dhams.length + 1,
      featured: true,
    });
  };

  const handleEdit = (dham: HolyDham) => {
    setEditingId(dham.id);
    setForm({
      nameHi: dham.nameHi || "",
      nameEn: dham.nameEn || "",
      descriptionHi: dham.descriptionHi || "",
      descriptionEn: dham.descriptionEn || "",
      location: dham.location || "",
      mapUrl: dham.mapUrl || "",
      imageUrl: dham.imageUrl || "/assets/hero-reference-1.jpg",
      phone: dham.phone || "+91 99271 97390",
      order: dham.order || 1,
      featured: dham.featured ?? true,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const confirmMsg = isEn
      ? "Are you sure you want to delete this Holy Dham location?"
      : "क्या आप वाकई इस पावन धाम स्थान को हटाना चाहते हैं?";
    if (confirm(confirmMsg)) {
      store.deleteDham(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Holy Dham Locations CMS" : "पवित्र आश्रम व धाम स्थान प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Manage Ashram Dham locations, descriptions, photos, and direct Google Maps links for Home Page"
              : "साढौली धाम, गोंदर धाम एवं अन्य आश्रम स्थानों की फोटो, विवरण एवं गूगल मैप्स लिंक प्रबंधित करें"}
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
              ? "Add Holy Dham"
              : "नया धाम जोड़ें"}
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
                  ? "Edit Holy Dham Location"
                  : "धाम विवरण संपादित करें"
                : isEn
                ? "Add New Holy Dham Location"
                : "नया पावन धाम जोड़ें"}
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
                {isEn ? "Dham Name (Hindi) *" : "धाम का नाम (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.nameHi}
                onChange={(e) => setForm({ ...form, nameHi: e.target.value })}
                placeholder="उदा. श्री निजानंद आश्रम साढौली धाम"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Dham Name (English)" : "धाम का नाम (English)"}
              </label>
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                placeholder="Shri Nijanand Aashram Sadhauli Dham"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Location / City *" : "स्थान / शहर (Location) *"}
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="हरिद्वार, उत्तराखण्ड"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Google Maps URL *" : "गूगल मैप्स लिंक (Google Maps URL) *"}
              </label>
              <input
                type="text"
                required
                value={form.mapUrl}
                onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Dham Photo URL" : "फोटो लिंक (Image URL)"}
              </label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="/assets/hero-reference-1.jpg या फोटो लिंक"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Description (Hindi)" : "विवरण (हिन्दी)"}
            </label>
            <textarea
              rows={3}
              value={form.descriptionHi}
              onChange={(e) => setForm({ ...form, descriptionHi: e.target.value })}
              placeholder="इस पावन धाम का परिचय एवं साधना महत्व..."
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? (isEn ? "Update Dham" : "धाम अपडेट करें") : (isEn ? "Save Dham" : "धाम सेव करें")}</span>
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

      {/* Dhams List Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Dham Name" : "धाम का नाम"}</th>
                <th className="p-3.5">{isEn ? "Location" : "स्थान"}</th>
                <th className="p-3.5">{isEn ? "Google Maps" : "गूगल मैप्स"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {dhams.map((dham) => (
                <tr key={dham.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-spiritual-ivory">
                    {isEn ? dham.nameEn : dham.nameHi}
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/80">{dham.location}</td>
                  <td className="p-3.5">
                    <a
                      href={dham.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>{isEn ? "View Map" : "मैप लिंक"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(dham)}
                      className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                      title={isEn ? "Edit" : "संपादित करें"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dham.id)}
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
