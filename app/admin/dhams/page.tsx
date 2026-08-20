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
    imageUrl: "/assets/sadhauli-dham-2.jpg",
    images: ["/assets/sadhauli-dham-2.jpg"] as string[],
    phone: "+91 99271 97390",
    order: 1,
    featured: true,
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setDhams(store.getDhams());
    });
    return () => unsub();
  }, []);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const validImages =
      form.images && form.images.length > 0
        ? form.images.filter((img) => img.trim() !== "")
        : [form.imageUrl || "/assets/sadhauli-dham-2.jpg"];

    const primaryCover = form.imageUrl || validImages[0] || "/assets/sadhauli-dham-2.jpg";

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
      setEditingId(null);
    } else {
      store.addDham({
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
    }

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
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible">
            {isEn ? "Holy Dham Locations & Photo Gallery CMS" : "पावन आश्रम व धाम फोटो गैलरी प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Upload multiple photos, manage sliders, update descriptions and Google Maps coordinates for Holy Dhams"
              : "साढौली धाम, गोंदर धाम एवं अन्य आश्रमों के लिए कई फोटो अपलोड करें, स्लाइडर प्रबंधित करें व मैप्स लिंक अपडेट करें"}
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

      {/* Add / Edit Form with Multi-Photo Uploader & Live Slider Preview */}
      {showAddForm && (
        <form
          onSubmit={handleSave}
          className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-6 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gold-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <h3 className="text-sm font-bold text-gold-300 uppercase tracking-wider">
                {editingId
                  ? isEn
                    ? "Edit Holy Dham & Photo Slider"
                    : "धाम व फोटो स्लाइडर संपादित करें"
                  : isEn
                  ? "Add New Holy Dham Location"
                  : "नया पावन धाम व फोटो गैलरी जोड़ें"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="p-1 text-spiritual-ivory/60 hover:text-gold-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Names */}
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

          {/* Location & Map & Phone */}
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
                {isEn ? "Contact Phone Number" : "सम्पर्क फोन नंबर (Phone)"}
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

          {/* ================================================================= */}
          {/* MULTI-PHOTO GALLERY & SLIDER MANAGEMENT SECTION */}
          {/* ================================================================= */}
          <div className="p-5 rounded-2xl bg-black/50 border border-gold-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gold-500/20">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-bold text-gold-300 uppercase tracking-wider">
                  {isEn ? "Dham Photo Gallery & Slider Images" : "धाम फोटो गैलरी एवं स्लाइडर तस्वीरें"}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-gold-500/20 text-[10px] font-bold text-gold-300">
                  {form.images.length} {isEn ? "Photos" : "तस्वीरें"}
                </span>
              </div>

              <span className="text-[11px] text-spiritual-ivory/60">
                {isEn
                  ? "Upload photos from device or paste image URLs"
                  : "कंप्यूटर/फोन से फोटो अपलोड करें या इमेज लिंक जोड़ें"}
              </span>
            </div>

            {/* Input Options: 1. Paste URL | 2. Upload from Device */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Add Photo URL */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gold-muted">
                  {isEn ? "Add Photo by URL / Path:" : "फोटो लिंक द्वारा जोड़ें (URL/Path):"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="उदा. /assets/sadhauli-dham-1.jpg या https://..."
                    className="flex-1 p-2 rounded-xl bg-black/70 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 rounded-xl bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-spiritual-dark text-xs font-bold transition-colors flex items-center gap-1 border border-gold-400/40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? "Add" : "जोड़ें"}</span>
                  </button>
                </div>
              </div>

              {/* Option B: Local File Upload */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-gold-muted">
                  {isEn ? "Upload Photos from Device:" : "डिवाइस से फोटो अपलोड करें:"}
                </label>
                <label className="flex items-center justify-center gap-2 p-2 rounded-xl bg-black/70 border border-dashed border-gold-400/50 hover:border-gold-400 cursor-pointer text-xs text-gold-300 transition-colors">
                  <Upload className="w-4 h-4 text-gold-400" />
                  <span>{isEn ? "Choose Image Files..." : "फोटो फाइल चुनें (JPG, PNG)..."}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Thumbnail Strip with Cover Selection & Delete */}
            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-semibold text-gold-muted">
                {isEn ? "Current Photos (Click Star to Set Cover):" : "वर्तमान तस्वीरें (कवर फोटो सेट करने के लिए स्टार पर क्लिक करें):"}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {form.images.map((img, idx) => {
                  const isCover = img === form.imageUrl;
                  return (
                    <div
                      key={idx}
                      className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-video bg-black/80 ${
                        isCover
                          ? "border-gold-400 shadow-[0_0_12px_rgba(244,208,111,0.6)] scale-102"
                          : "border-gold-500/20 hover:border-gold-500/60"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Dham photo ${idx + 1}`}
                        fill
                        className="object-cover"
                      />

                      {/* Cover Badge */}
                      {isCover && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-gold-500 text-spiritual-dark text-[9px] font-extrabold shadow-sm flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{isEn ? "Cover" : "मुख्य"}</span>
                        </span>
                      )}

                      {/* Hover Actions Bar */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(img)}
                            className="p-1.5 rounded-lg bg-gold-500/30 hover:bg-gold-500 text-gold-300 hover:text-spiritual-dark transition-colors"
                            title={isEn ? "Set as Cover Photo" : "मुख्य फोटो बनाएं"}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-lg bg-red-500/30 hover:bg-red-500 text-red-300 hover:text-white transition-colors"
                          title={isEn ? "Delete Photo" : "फोटो हटाएं"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Slider Preview Box */}
            {form.images.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gold-500/20">
                <div className="flex items-center justify-between text-[11px] text-gold-muted mb-2">
                  <span className="font-semibold">{isEn ? "Live Slider Preview:" : "लाइव स्लाइडर पूर्वावलोकन:"}</span>
                  <span>
                    {previewSlideIdx + 1} / {form.images.length}
                  </span>
                </div>

                <div className="relative h-44 sm:h-52 w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-gold-500/40 bg-black">
                  <Image
                    src={form.images[previewSlideIdx] || form.imageUrl}
                    alt="Slider Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {form.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewSlideIdx((prev) =>
                            prev === 0 ? form.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/70 hover:bg-gold-500 text-gold-300 hover:text-spiritual-dark transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewSlideIdx((prev) =>
                            prev === form.images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/70 hover:bg-gold-500 text-gold-300 hover:text-spiritual-dark transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Description (Hindi) *" : "विवरण (हिन्दी) *"}
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

                return (
                  <tr key={dham.id} className="hover:bg-gold-500/5 transition-colors">
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
