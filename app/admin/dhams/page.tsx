"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { HolyDham } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import {
  Plus,
  Trash2,
  Edit3,
  MapPin,
  ExternalLink,
  Save,
  X,
  Camera,
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Star,
  Sparkles,
} from "lucide-react";

export default function AdminDhamsPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [dhams, setDhams] = useState<HolyDham[]>(() => store.getDhams());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<HolyDham | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    nameHi: "",
    nameEn: "",
    descriptionHi: "",
    descriptionEn: "",
    location: "हरिद्वार, उत्तराखण्ड",
    mapUrl: "https://maps.app.goo.gl/n5oY9okf86WyuiKN9?g_st=com.google.maps.preview.copy",
    imageUrl: "/assets/sadhauli-dham-2.jpg",
    images: ["/assets/sadhauli-dham-2.jpg"] as string[],
    phone: "+91 99271 97390",
    order: 1,
    featured: true,
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  useEffect(() => {
    setDhams(store.getDhams());
    const unsub = store.subscribe(() => {
      setDhams(store.getDhams());
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const updated = [...form.images, newImageUrl.trim()];
    setForm({
      ...form,
      images: updated,
      imageUrl: form.imageUrl || newImageUrl.trim(),
    });
    setNewImageUrl("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setForm((prev) => {
            const updated = [...prev.images, result];
            return {
              ...prev,
              images: updated,
              imageUrl: prev.imageUrl || result,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = form.images.filter((_, idx) => idx !== indexToRemove);
    const newCover =
      form.images[indexToRemove] === form.imageUrl
        ? updated[0] || "/assets/sadhauli-dham-2.jpg"
        : form.imageUrl;

    setForm({
      ...form,
      images: updated.length > 0 ? updated : ["/assets/sadhauli-dham-2.jpg"],
      imageUrl: newCover,
    });

    if (previewSlideIdx >= updated.length) {
      setPreviewSlideIdx(Math.max(0, updated.length - 1));
    }
  };

  const handleSetCover = (imgUrl: string) => {
    setForm({ ...form, imageUrl: imgUrl });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const validImages =
      form.images && form.images.length > 0
        ? form.images.filter((img) => img.trim() !== "")
        : [form.imageUrl || "/assets/sadhauli-dham-2.jpg"];

    const primaryCover = form.imageUrl || validImages[0] || "/assets/sadhauli-dham-2.jpg";

    let savedId = editingId;

    if (editingId) {
      store.updateDham(editingId, {
        nameHi: form.nameHi,
        nameEn: form.nameEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        location: form.location,
        mapUrl: form.mapUrl,
        imageUrl: primaryCover,
        images: validImages,
        phone: form.phone,
        order: Number(form.order),
        featured: form.featured,
      });
      await store.saveToStorage("prannath_dhams_v2", store.getDhams());
      showToast(
        isEn
          ? `✓ Holy Dham "${form.nameEn || form.nameHi}" updated and saved to database!`
          : `✓ पावन धाम "${form.nameHi}" की जानकारी डेटाबेस में सुरक्षित हो गई!`
      );
      setHighlightedId(editingId);
      setEditingId(null);
    } else {
      const created = store.addDham({
        nameHi: form.nameHi,
        nameEn: form.nameEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        location: form.location,
        mapUrl: form.mapUrl,
        imageUrl: primaryCover,
        images: validImages,
        phone: form.phone,
        order: Number(form.order),
        featured: form.featured,
      });
      savedId = created.id;
      await store.saveToStorage("prannath_dhams_v2", store.getDhams());
      setHighlightedId(created.id);
      showToast(
        isEn
          ? `✓ New Holy Dham "${form.nameEn || form.nameHi}" added and saved to database!`
          : `✓ नया धाम "${form.nameHi}" डेटाबेस में सफलतापूर्वक जुड़ गया!`
      );
    }

    setDhams(store.getDhams());
    setIsSaving(false);
    setShowAddForm(false);
    setForm({
      nameHi: "",
      nameEn: "",
      descriptionHi: "",
      descriptionEn: "",
      location: "",
      mapUrl: "",
      imageUrl: "/assets/sadhauli-dham-2.jpg",
      images: ["/assets/sadhauli-dham-2.jpg"],
      phone: "+91 99271 97390",
      order: dhams.length + 1,
      featured: true,
    });
  };

  const handleEdit = (dham: HolyDham) => {
    setEditingId(dham.id);
    const existingImages =
      dham.images && dham.images.length > 0
        ? dham.images
        : [dham.imageUrl || "/assets/sadhauli-dham-2.jpg"];

    setForm({
      nameHi: dham.nameHi || "",
      nameEn: dham.nameEn || "",
      descriptionHi: dham.descriptionHi || "",
      descriptionEn: dham.descriptionEn || "",
      location: dham.location || "",
      mapUrl: dham.mapUrl || "",
      imageUrl: dham.imageUrl || existingImages[0],
      images: existingImages,
      phone: dham.phone || "+91 99271 97390",
      order: dham.order || 1,
      featured: dham.featured ?? true,
    });
    setPreviewSlideIdx(0);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const name = deleteCandidate.nameHi || deleteCandidate.nameEn;
    setIsSaving(true);
    store.deleteDham(deleteCandidate.id);
    await store.saveToStorage("prannath_dhams_v2", store.getDhams());
    setDhams(store.getDhams());
    setIsSaving(false);
    setDeleteCandidate(null);
    showToast(
      isEn
        ? `✓ Holy Dham "${name}" deleted from database.`
        : `✓ पावन धाम "${name}" डेटाबेस से हटा दिया गया।`
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
                {isEn ? "Delete Holy Dham?" : "पावन धाम हटाएं?"}
              </h3>
              <p className="text-xs text-spiritual-ivory/70 leading-relaxed">
                {isEn
                  ? `Are you sure you want to delete "${deleteCandidate.nameEn || deleteCandidate.nameHi}"?`
                  : `क्या आप वाकई "${deleteCandidate.nameHi}" को हटाना चाहते हैं?`}
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
            {isEn ? "Holy Dhams & Ashrams CMS" : "पावन धाम व आश्रम प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Manage sacred Prannathi ashrams (Sadhauli Dham, Gondar Dham, Surat, Panna etc.) with Multiple Photos & Sliders"
              : "साढौली धाम, गोंदर धाम, सूरत, पन्ना आदि पावन तीर्थों की तस्वीरें, गैलरी, गूगल मैप्स व संपर्क प्रबंधित करें"}
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
              ? "Add New Dham"
              : "नया धाम जोड़ें"}
          </span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <form
          onSubmit={handleSave}
          className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-6 animate-fade-in shadow-2xl bg-spiritual-navy/80"
        >
          <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
            <h2 className="text-base font-bold text-gold-300 font-spiritual-heading">
              {editingId
                ? isEn
                  ? "Edit Holy Dham Details"
                  : "पावन धाम विवरण संपादित करें"
                : isEn
                ? "Add New Holy Dham to Portal"
                : "पोर्टल में नया पावन धाम जोड़ें"}
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
                {isEn ? "Dham Name (English) *" : "धाम का नाम (अंग्रेज़ी) *"}
              </label>
              <input
                type="text"
                required
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                placeholder="e.g. Shri Nijanand Ashram Sadhauli Dham"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Location / City *" : "स्थान / शहर *"}
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="उदा. हरिद्वार, उत्तराखण्ड"
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
                {isEn ? "Contact Phone" : "संपर्क फोन नंबर"}
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 99271 97390"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Multiple Photo Gallery & Cover Selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-gold-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-500/20 pb-3">
              <div>
                <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>{isEn ? "Dham Photo Gallery & Slider Images" : "धाम फोटो गैलरी एवं स्लाइडर तस्वीरें"}</span>
                </h3>
                <p className="text-[11px] text-spiritual-ivory/60">
                  {isEn
                    ? "Upload multiple high-resolution photos of the temple, mandir complex, and events"
                    : "मंदिर, आश्रम परिसर एवं आयोजनों की एक से अधिक तस्वीरें अपलोड करें"}
                </p>
              </div>

              <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform self-start sm:self-auto">
                <Upload className="w-3.5 h-3.5" />
                <span>{isEn ? "Upload Photos" : "तस्वीरें अपलोड करें"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick URL Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder={isEn ? "Or paste image web URL (https://...)" : "या वेब फोटो लिंक (URL) पेस्ट करें"}
                className="flex-1 p-2 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold hover:bg-gold-500/30"
              >
                {isEn ? "Add URL" : "जोड़ें"}
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {form.images.map((img, idx) => {
                const isCover = form.imageUrl === img;
                return (
                  <div
                    key={idx}
                    className={`group relative rounded-xl overflow-hidden aspect-[4/3] bg-black/60 border-2 transition-all ${
                      isCover ? "border-gold-400 ring-2 ring-gold-400/40 shadow-lg" : "border-gold-500/20 hover:border-gold-500/50"
                    }`}
                  >
                    <Image src={img} alt={`Dham Photo ${idx + 1}`} fill className="object-cover" />

                    {isCover && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-gold-500 text-spiritual-dark text-[9px] font-extrabold flex items-center gap-0.5 shadow">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>COVER</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(img)}
                          className="px-2 py-1 rounded bg-gold-gradient text-spiritual-dark text-[10px] font-bold shadow hover:scale-105"
                        >
                          {isEn ? "Make Cover" : "कवर बनाएं"}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded-lg bg-red-600/80 text-white hover:bg-red-600"
                        title={isEn ? "Remove" : "हटाएं"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Description & Spiritual Importance (Hindi) *" : "धाम परिचय एवं आध्यात्मिक महत्व (हिन्दी) *"}
            </label>
            <textarea
              rows={3}
              required
              value={form.descriptionHi}
              onChange={(e) => setForm({ ...form, descriptionHi: e.target.value })}
              placeholder="इस पावन धाम का परिचय एवं साधना महत्व..."
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-gold-500/20">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none hover:scale-105 transition-transform"
            >
              <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>
                {isSaving
                  ? isEn
                    ? "Saving to Database..."
                    : "डेटाबेस में सहेजा जा रहा है..."
                  : editingId
                  ? isEn
                    ? "Update Dham"
                    : "धाम अपडेट करें"
                  : isEn
                  ? "Save Dham"
                  : "धाम सेव करें"}
              </span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-xl bg-spiritual-card border border-gold-500/20 text-xs text-spiritual-ivory/70 disabled:opacity-50"
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
            <thead className="bg-black/70 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Cover & Name" : "कवर फोटो व नाम"}</th>
                <th className="p-3.5">{isEn ? "Gallery" : "गैलरी तस्वीरें"}</th>
                <th className="p-3.5">{isEn ? "Location" : "स्थान"}</th>
                <th className="p-3.5">{isEn ? "Google Maps" : "गूगल मैप्स"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {dhams.map((dham) => {
                const photosCount = (dham.images && dham.images.length) || 1;
                const coverPhoto = dham.imageUrl || dham.images?.[0] || "/assets/sadhauli-dham-2.jpg";
                const isHighlighted = highlightedId === dham.id;

                return (
                  <tr
                    key={dham.id}
                    className={`transition-colors ${
                      isHighlighted
                        ? "bg-amber-500/20 ring-1 ring-gold-400"
                        : "hover:bg-gold-500/5"
                    }`}
                  >
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-gold-500/30">
                        <Image src={coverPhoto} alt={dham.nameHi} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-spiritual-ivory block truncate">
                          {isEn ? dham.nameEn : dham.nameHi}
                        </span>
                        <span className="text-[10px] text-gold-muted block truncate">{dham.location}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-[11px] font-bold text-gold-300 inline-flex items-center gap-1">
                        <Camera className="w-3 h-3 text-gold-400" />
                        <span>
                          {photosCount} {isEn ? "Photos" : "तस्वीरें"}
                        </span>
                      </span>
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

                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(dham)}
                        className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 hover:scale-105 transition-all shadow-sm"
                        title={isEn ? "Edit Dham" : "संपादित करें"}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(dham)}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow-sm"
                        title={isEn ? "Delete Dham" : "हटाएं"}
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
