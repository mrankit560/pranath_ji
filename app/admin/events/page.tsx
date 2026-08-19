"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { EventItem } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import { Plus, Trash2, Edit3, Calendar, MapPin, Radio, Sparkles, Save, X, Clock } from "lucide-react";

export default function AdminEventsPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [events, setEvents] = useState<EventItem[]>(store.getEvents());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    titleHi: "",
    titleEn: "",
    descriptionHi: "",
    descriptionEn: "",
    startAt: "2026-09-04T09:00:00.000Z",
    endAt: "2026-09-06T18:00:00.000Z",
    hasSpecificTime: true,
    timeStr: "09:00 AM – 06:00 PM IST",
    location: "श्री निजानंद आश्रम साढौली धाम, हरिद्वार (उत्तराखण्ड)",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    speaker: "पूज्य संत वृंद",
    eventType: "festival" as EventItem["eventType"],
    livestreamUrl: "https://youtube.com/@sadhaulidham3424",
    status: "upcoming" as EventItem["status"],
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setEvents(store.getEvents());
    });
    return () => unsub();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      store.updateEvent(editingId, {
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        startAt: form.startAt,
        endAt: form.endAt,
        hasSpecificTime: form.hasSpecificTime,
        timeStr: form.timeStr,
        location: form.location,
        image: form.image,
        speaker: form.speaker,
        eventType: form.eventType,
        livestreamUrl: form.livestreamUrl,
        status: form.status,
      });
      setEditingId(null);
    } else {
      store.addEvent({
        titleHi: form.titleHi,
        titleEn: form.titleEn,
        descriptionHi: form.descriptionHi,
        descriptionEn: form.descriptionEn,
        startAt: form.startAt,
        endAt: form.endAt,
        hasSpecificTime: form.hasSpecificTime,
        timeStr: form.timeStr,
        location: form.location,
        image: form.image,
        speaker: form.speaker,
        eventType: form.eventType,
        livestreamUrl: form.livestreamUrl,
        status: form.status,
      });
    }

    setShowAddForm(false);
    setForm({
      titleHi: "",
      titleEn: "",
      descriptionHi: "",
      descriptionEn: "",
      startAt: "2026-09-04T09:00:00.000Z",
      endAt: "2026-09-06T18:00:00.000Z",
      hasSpecificTime: true,
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
    setForm({
      titleHi: ev.titleHi || "",
      titleEn: ev.titleEn || "",
      descriptionHi: ev.descriptionHi || "",
      descriptionEn: ev.descriptionEn || "",
      startAt: ev.startAt || "2026-09-04T09:00:00.000Z",
      endAt: ev.endAt || "",
      hasSpecificTime: ev.hasSpecificTime ?? true,
      timeStr: ev.timeStr || "09:00 AM – 06:00 PM IST",
      location: ev.location || "श्री निजानंद आश्रम साढौली धाम, हरिद्वार",
      image: ev.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
      speaker: ev.speaker || "पूज्य संत वृंद",
      eventType: ev.eventType || "festival",
      livestreamUrl: ev.livestreamUrl || "",
      status: ev.status || "upcoming",
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const confirmMsg = isEn
      ? "Are you sure you want to delete this event?"
      : "क्या आप वाकई इस कार्यक्रम को हटाना चाहते हैं?";
    if (confirm(confirmMsg)) {
      store.deleteEvent(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Festival & Events Calendar CMS" : "उत्सव एवं आश्रम कार्यक्रम कैलेंडर प्रबंधन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Manage festivals and events for the year (the earliest event is automatically featured on the Home Page)"
              : "वर्ष भर के उत्सवों एवं सत्संग कार्यक्रमों का प्रबंधन (निकटतम कार्यक्रम स्वतः होमपेज पर प्रदर्शित होता है)"}
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
              ? "Add New Event"
              : "नया कार्यक्रम जोड़ें"}
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
                  ? "Edit Festival Event"
                  : "कार्यक्रम संपादित करें"
                : isEn
                ? "Add New Festival Event"
                : "नया कार्यक्रम जोड़ें"}
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
                {isEn ? "Event Title (Hindi) *" : "कार्यक्रम शीर्षक (हिन्दी) *"}
              </label>
              <input
                type="text"
                required
                value={form.titleHi}
                onChange={(e) => setForm({ ...form, titleHi: e.target.value })}
                placeholder="उदा. भव्य श्री कृष्ण जन्माष्टमी महोत्सव"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Event Title (English)" : "कार्यक्रम शीर्षक (English)"}
              </label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="Grand Shri Krishna Janmashtami Celebration"
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Event Date (ISO/Date) *" : "दिनांक (Start Date) *"}
              </label>
              <input
                type="datetime-local"
                value={form.startAt.slice(0, 16)}
                onChange={(e) => setForm({ ...form, startAt: new Date(e.target.value).toISOString() })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Event Type *" : "कार्यक्रम प्रकार *"}
              </label>
              <select
                value={form.eventType}
                onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="festival">{isEn ? "Festival / Celebration" : "उत्सव / महोत्सव"}</option>
                <option value="satsang">{isEn ? "Satsang Discourse" : "सत्संग प्रवचन"}</option>
                <option value="meditation">{isEn ? "Meditation Camp" : "साधना शिविर"}</option>
                <option value="special">{isEn ? "Special Gathering" : "विशेष आयोजन"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Status" : "स्थिति"}
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="upcoming">{isEn ? "Upcoming" : "आगामी (Upcoming)"}</option>
                <option value="live">{isEn ? "🔴 Live Now" : "🔴 लाइव जारी (Live Now)"}</option>
                <option value="completed">{isEn ? "Completed" : "सम्पन्न (Completed)"}</option>
              </select>
            </div>
          </div>

          {/* Optional Time Section */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-gold-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasTimeCheck"
                checked={form.hasSpecificTime}
                onChange={(e) => setForm({ ...form, hasSpecificTime: e.target.checked })}
                className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400"
              />
              <label htmlFor="hasTimeCheck" className="text-xs font-semibold text-gold-300 cursor-pointer">
                {isEn ? "Set specific start/end time for this event" : "इस कार्यक्रम के लिए निश्चित समय सेट करें (वैकल्पिक)"}
              </label>
            </div>

            {form.hasSpecificTime && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-gold-muted/80 mb-1">
                    {isEn ? "Time Display String (e.g. 09:00 AM – 06:00 PM)" : "समय विवरण (उदा. प्रातः ०९:०० से सायं ०६:०० बजे)"}
                  </label>
                  <input
                    type="text"
                    value={form.timeStr}
                    onChange={(e) => setForm({ ...form, timeStr: e.target.value })}
                    placeholder="09:00 AM – 06:00 PM IST"
                    className="w-full p-2 rounded-xl bg-black/70 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gold-muted/80 mb-1">
                    {isEn ? "End DateTime (Optional)" : "समापन तिथि/समय (वैकल्पिक)"}
                  </label>
                  <input
                    type="datetime-local"
                    value={form.endAt ? form.endAt.slice(0, 16) : ""}
                    onChange={(e) => setForm({ ...form, endAt: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                    className="w-full p-2 rounded-xl bg-black/70 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Location / Venue *" : "स्थान / पावन धाम *"}
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
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs shadow-gold-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? (isEn ? "Update Event" : "कार्यक्रम अपडेट करें") : (isEn ? "Save Event" : "कार्यक्रम सेव करें")}</span>
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

      {/* Events Table */}
      <div className="spiritual-glass-card rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-spiritual-ivory">
            <thead className="bg-black/60 border-b border-gold-500/30 text-gold-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">{isEn ? "Event Title" : "कार्यक्रम शीर्षक"}</th>
                <th className="p-3.5">{isEn ? "Date & Time" : "दिनांक व समय"}</th>
                <th className="p-3.5">{isEn ? "Location" : "स्थान"}</th>
                <th className="p-3.5">{isEn ? "Type" : "प्रकार"}</th>
                <th className="p-3.5 text-right">{isEn ? "Actions" : "कार्य"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-500/10">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-spiritual-ivory max-w-xs">
                    {isEn ? e.titleEn || e.titleHi : e.titleHi}
                  </td>
                  <td className="p-3.5 font-mono text-gold-300">
                    <div>
                      {new Date(e.startAt).toLocaleDateString(isEn ? "en-US" : "hi-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    {e.timeStr && (
                      <div className="text-[10px] text-amber-400">
                        {e.timeStr}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 text-spiritual-ivory/70 max-w-[150px] truncate">{e.location}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-semibold uppercase">
                      {e.eventType}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(e)}
                      className="p-1.5 rounded-lg border border-gold-500/30 text-gold-300 hover:bg-gold-500/20"
                      title={isEn ? "Edit" : "संपादित करें"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
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
