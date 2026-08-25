"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { EventItem } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import {
  Plus,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  Radio,
  Sparkles,
  Save,
  X,
  CheckCircle,
  Star,
  ExternalLink,
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { formatEventDateRangeSafe, parseDateSafe } from "@/lib/utils/dateUtils";

export default function AdminEventsPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<EventItem | null>(null);

  const earliestEvent = store.getEarliestUpcomingEvent();

  const [form, setForm] = useState({
    titleHi: "",
    titleEn: "",
    descriptionHi: "",
    descriptionEn: "",
    startDate: "2026-08-30",
    endDate: "2026-09-06",
    timeStr: "09:00 AM – 06:00 PM IST",
    location: "श्री निजानंद आश्रम साढौली धाम, हरिद्वार (उत्तराखण्ड)",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    speaker: "पूज्य संत वृंद",
    eventType: "festival" as EventItem["eventType"],
    livestreamUrl: "https://youtube.com/@sadhaulidham3424",
    status: "upcoming" as EventItem["status"],
  });

  useEffect(() => {
    setEvents(store.getEvents());
    const unsub = store.subscribe(() => {
      setEvents(store.getEvents());
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

    const startAtIso = form.startDate
      ? `${form.startDate}T09:00:00.000Z`
      : new Date().toISOString();

    const endAtIso = form.endDate
      ? `${form.endDate}T18:00:00.000Z`
      : "";

    let savedId = editingId;

    if (editingId) {
      store.updateEvent(editingId, {
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        startAt: startAtIso,
        endAt: endAtIso,
        hasSpecificTime: Boolean(form.timeStr && form.timeStr.trim() !== ""),
        timeStr: form.timeStr,
        location: form.location,
        image: form.image,
        speaker: form.speaker,
        eventType: form.eventType,
        livestreamUrl: form.livestreamUrl,
        status: form.status,
      });
      // Force disk save and await
      await store.saveToStorage("prannath_events_v2", store.getEvents());
      showToast(
        isEn
          ? `✓ Event "${form.titleEn || form.titleHi}" updated and saved to database!`
          : `✓ कार्यक्रम "${form.titleHi}" की तिथि व जानकारी डेटाबेस में सफलतापूर्वक सुरक्षित हो गई!`
      );
      setHighlightedId(editingId);
      setEditingId(null);
    } else {
      const created = store.addEvent({
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        startAt: startAtIso,
        endAt: endAtIso,
        hasSpecificTime: Boolean(form.timeStr && form.timeStr.trim() !== ""),
        timeStr: form.timeStr,
        location: form.location,
        image: form.image,
        speaker: form.speaker,
        eventType: form.eventType,
        livestreamUrl: form.livestreamUrl,
        status: form.status,
      });
      savedId = created.id;
      await store.saveToStorage("prannath_events_v2", store.getEvents());
      setHighlightedId(created.id);
      showToast(
        isEn
          ? `✓ New Event "${form.titleEn || form.titleHi}" added and saved to database!`
          : `✓ नया कार्यक्रम "${form.titleHi}" डेटाबेस में सफलतापूर्वक जुड़ गया!`
      );
    }

    // Immediately update local component state
    setEvents(store.getEvents());
    setIsSaving(false);
    setShowAddForm(false);

    // Scroll smoothly to highlight the saved event in table
    setTimeout(() => {
      const el = document.getElementById(`event-row-${savedId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);

    setForm({
      titleHi: "",
      titleEn: "",
      descriptionHi: "",
      descriptionEn: "",
      startDate: "2026-08-30",
      endDate: "2026-09-06",
      timeStr: "09:00 AM – 06:00 PM IST",
      location: "श्री निजानंद आश्रम साढौली धाम, हरिद्वार (उत्तराखण्ड)",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
      speaker: "पूज्य संत वृंद",
      eventType: "festival",
      livestreamUrl: "https://youtube.com/@sadhaulidham3424",
      status: "upcoming",
    });
  };

  const handleEdit = (ev: EventItem) => {
    setEditingId(ev.id);
    const parsedStart = parseDateSafe(ev.startAt);
    const parsedEnd = parseDateSafe(ev.endAt);

    const startFormatted = parsedStart
      ? `${parsedStart.year}-${String(parsedStart.month + 1).padStart(2, "0")}-${String(parsedStart.day).padStart(2, "0")}`
      : "2026-08-30";

    const endFormatted = parsedEnd
      ? `${parsedEnd.year}-${String(parsedEnd.month + 1).padStart(2, "0")}-${String(parsedEnd.day).padStart(2, "0")}`
      : "";

    setForm({
      titleHi: ev.titleHi || "",
      titleEn: ev.titleEn || "",
      descriptionHi: ev.descriptionHi || "",
      descriptionEn: ev.descriptionEn || "",
      startDate: startFormatted,
      endDate: endFormatted,
      timeStr: ev.timeStr || "09:00 AM – 06:00 PM IST",
      location: ev.location || "श्री निजानंद आश्रम साढौली धाम, हरिद्वार",
      image: ev.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
      speaker: ev.speaker || "पूज्य संत वृंद",
      eventType: ev.eventType || "festival",
      livestreamUrl: ev.livestreamUrl || "",
      status: ev.status || "upcoming",
    });
    setShowAddForm(true);

    // Scroll to top form smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const title = deleteCandidate.titleHi || deleteCandidate.titleEn;
    setIsSaving(true);
    store.deleteEvent(deleteCandidate.id);
    await store.saveToStorage("prannath_events_v2", store.getEvents());
    setEvents(store.getEvents());
    setIsSaving(false);
    setDeleteCandidate(null);
    showToast(
      isEn
        ? `✓ Event "${title}" deleted from database.`
        : `✓ कार्यक्रम "${title}" डेटाबेस से सफलतापूर्वक हटा दिया गया।`
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
                {isEn ? "Delete Event?" : "कार्यक्रम हटाएं?"}
              </h3>
              <p className="text-xs text-spiritual-ivory/70 leading-relaxed">
                {isEn
                  ? `Are you sure you want to permanently delete "${deleteCandidate.titleEn || deleteCandidate.titleHi}"?`
                  : `क्या आप वाकई "${deleteCandidate.titleHi}" को डेटाबेस से स्थायी रूप से हटाना चाहते हैं?`}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Events & Utsav Management" : "महोत्सव व कार्यक्रम प्रबंधन (Events CMS)"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60 mt-1">
            {isEn
              ? "Schedule upcoming festivals, live streams, discourses, and adjust start/end dates"
              : "आगामी महोत्सवों, पावन तिथियों, लाइव प्रसारण व सत्संग कार्यक्रमों की तिथियां व विवरण प्रबंधित करें"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingId(null);
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2 rounded-xl bg-gold-gradient text-spiritual-dark text-xs font-bold flex items-center gap-1.5 shadow-gold-sm hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? "Schedule New Event" : "नया कार्यक्रम जोड़ें"}</span>
          </button>
        </div>
      </div>

      {/* Featured Earliest Upcoming Event Live Banner */}
      {earliestEvent && (
        <div className="spiritual-glass-card rounded-2xl p-4 border border-gold-400/40 bg-gradient-to-r from-amber-500/10 via-gold-500/5 to-spiritual-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <Star className="w-5 h-5 fill-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gold-300 uppercase tracking-wider">
                  {isEn ? "Current Active Homepage Banner Event:" : "होमपेज पर सक्रिय मुख्य आगामी उत्सव:"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {earliestEvent.status === "live" ? "🔴 LIVE" : "UPCOMING"}
                </span>
              </div>
              <h2 className="text-sm font-bold text-spiritual-ivory mt-0.5">
                {isEn ? earliestEvent.titleEn || earliestEvent.titleHi : earliestEvent.titleHi}
              </h2>
              <p className="text-xs text-gold-400/90 font-medium">
                📅 {formatEventDateRangeSafe(earliestEvent.startAt, earliestEvent.endAt, isEn)} {earliestEvent.timeStr && `• ⏰ ${earliestEvent.timeStr}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleEdit(earliestEvent)}
            className="px-3.5 py-1.5 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold hover:bg-gold-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEn ? "Edit Dates & Details" : "इसकी तिथि बदलें / संपादित करें"}</span>
          </button>
        </div>
      )}

      {/* Add / Edit Form Modal / Accordion */}
      {showAddForm && (
        <form
          onSubmit={handleSave}
          className="spiritual-glass-card rounded-2xl p-6 border-2 border-gold-400/50 space-y-4 animate-fade-in shadow-2xl bg-spiritual-navy/80"
        >
          <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
            <h2 className="text-sm font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>
                {editingId
                  ? isEn
                    ? "Edit Event Details & Dates"
                    : "कार्यक्रम की तिथि एवं विवरण संपादित करें"
                  : isEn
                  ? "Schedule New Festival Event"
                  : "नया महोत्सव / कार्यक्रम जोड़ें"}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-spiritual-ivory/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Event Title (Hindi) *" : "कार्यक्रम शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. भव्य श्री कृष्ण जन्माष्टमी एवं तारतम ज्ञान महोत्सव"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Event Title (English)" : "कार्यक्रम शीर्षक (अंग्रेज़ी)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Grand Shri Krishna Janmashtami Festival"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gold-500/5 p-4 rounded-xl border border-gold-500/20">
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isEn ? "Start Date (YYYY-MM-DD) *" : "आरंभ तिथि (Start Date) *"}</span>
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/80 border-2 border-gold-400/60 text-xs text-spiritual-ivory font-bold focus:border-gold-300 focus:outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isEn ? "End Date (Optional)" : "समापन तिथि (End Date - यदि बहुदिवसीय हो)"}</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/80 border-2 border-gold-400/60 text-xs text-spiritual-ivory font-bold focus:border-gold-300 focus:outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Timing Description" : "समय विवरण"}
              </label>
              <input
                type="text"
                value={form.timeStr}
                onChange={(e) => setForm({ ...form, timeStr: e.target.value })}
                placeholder="09:00 AM – 06:00 PM IST"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Event Category" : "कार्यक्रम श्रेणी"}
              </label>
              <select
                value={form.eventType}
                onChange={(e) => setForm({ ...form, eventType: e.target.value as EventItem["eventType"] })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="festival">{isEn ? "Festival / Mahotsav" : "पावन महोत्सव"}</option>
                <option value="discourse">{isEn ? "Katha / Discourse" : "बीतक कथा / प्रवचन"}</option>
                <option value="satsang">{isEn ? "Daily Satsang" : "दैनिक सत्संग"}</option>
                <option value="meditation">{isEn ? "Chitwani & Meditation" : "चितवनी व ध्यान शिविर"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Current Status" : "स्थिति"}
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as EventItem["status"] })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="upcoming">{isEn ? "Upcoming (आगामी)" : "आगामी (Upcoming)"}</option>
                <option value="live">{isEn ? "🔴 Currently Live" : "🔴 अभी लाइव चल रहा है"}</option>
                <option value="completed">{isEn ? "Completed" : "सम्पन्न"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Speaker / Sant" : "वक्ता / संत"}
              </label>
              <input
                type="text"
                value={form.speaker}
                onChange={(e) => setForm({ ...form, speaker: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Location / Dham *" : "स्थान / आश्रम *"}
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Livestream YouTube Link (Optional)" : "लाइव सत्संग यूट्यूब लिंक (वैकल्पिक)"}
              </label>
              <input
                type="text"
                value={form.livestreamUrl}
                onChange={(e) => setForm({ ...form, livestreamUrl: e.target.value })}
                placeholder="https://youtube.com/..."
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Event Banner Image Upload */}
          <div className="p-4 rounded-2xl bg-black/40 border border-gold-500/20">
            <ImageUploadField
              label={isEn ? "Event Banner / Poster Photo *" : "कार्यक्रम बैनर / पोस्टर फोटो *"}
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              recommendedSize="1200 × 630 px"
              aspectRatio="16:9 (लैंडस्केप बैनर)"
              maxSizeMB={5}
              helperText={isEn ? "Displayed as the main promotional photo across Events page and Homepage hero" : "उत्सव एवं कार्यक्रम पेज तथा होमपेज पर मुख्य प्रचार फोटो के रूप में प्रदर्शित होगी"}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Description (Hindi)" : "विवरण (हिन्दी)"}
            </label>
            <textarea
              rows={2}
              value={form.descriptionHi}
              onChange={(e) => setForm({ ...form, descriptionHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari resize-none"
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
                    ? "Update Event Now"
                    : "कार्यक्रम अपडेट करें (Update Event)"
                  : isEn
                  ? "Save Event"
                  : "कार्यक्रम सेव करें"}
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

      {/* Events Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="p-4 bg-spiritual-navy/80 border-b border-gold-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gold-300 font-bold flex items-center gap-2">
            <span>📅 {isEn ? "Total Scheduled Events:" : "कुल सूचीबद्ध कार्यक्रम:"} {events.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/70 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Event Title" : "कार्यक्रम शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Date & Time" : "दिनांक व समय (Date & Time)"}</th>
                <th className="p-3.5">{isEn ? "Location" : "स्थान"}</th>
                <th className="p-3.5">{isEn ? "Type / Status" : "प्रकार व स्थिति"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {events.map((e) => {
                const isHighlighted = highlightedId === e.id;
                return (
                  <tr
                    key={e.id}
                    id={`event-row-${e.id}`}
                    className={`transition-colors ${
                      isHighlighted
                        ? "bg-amber-500/20 ring-1 ring-gold-400"
                        : "hover:bg-gold-500/5"
                    }`}
                  >
                    <td className="p-3.5 font-bold text-spiritual-ivory max-w-xs">
                      <div className="flex items-center gap-2">
                        {earliestEvent?.id === e.id && (
                          <span className="text-amber-400" title="Earliest upcoming event">
                            ⭐
                          </span>
                        )}
                        <span>{isEn ? e.titleEn || e.titleHi : e.titleHi}</span>
                      </div>
                      {e.speaker && (
                        <div className="text-[11px] text-spiritual-ivory/60 font-normal mt-0.5">
                          {e.speaker}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-gold-300">
                      <div className="font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{formatEventDateRangeSafe(e.startAt, e.endAt, isEn)}</span>
                      </div>
                      {e.timeStr && (
                        <div className="text-[10px] text-spiritual-ivory/70 font-mono mt-0.5 ml-5">
                          {e.timeStr}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-spiritual-ivory/70 max-w-[150px] truncate">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold-400/80 shrink-0" />
                        <span className="truncate">{e.location}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold uppercase">
                          {e.eventType}
                        </span>
                        {e.status === "live" && (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(e)}
                        className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 hover:scale-105 transition-all shadow-sm"
                        title={isEn ? "Edit Event" : "कार्यक्रम व तिथि संपादित करें"}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(e)}
                        className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow-sm"
                        title={isEn ? "Delete Event" : "कार्यक्रम हटाएं"}
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
