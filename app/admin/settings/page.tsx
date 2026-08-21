"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { SiteSettings, AdminCredentials } from "@/lib/data/types";
import { useI18n } from "@/lib/i18n/context";
import {
  Settings,
  Save,
  CheckCircle,
  Sparkles,
  Shield,
  Key,
  User,
  Mail,
  Lock,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function AdminSettingsPage() {
  const { language } = useI18n();
  const isEn = language === "en";

  const [settings, setSettings] = useState<SiteSettings>(store.getSettings());
  const [adminCreds, setAdminCreds] = useState<AdminCredentials>(store.getAdminCredentials());

  const [toast, setToast] = useState(false);
  const [authToast, setAuthToast] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Security Credentials form state
  const [username, setUsername] = useState(adminCreds.username || "admin");
  const [adminEmail, setAdminEmail] = useState(adminCreds.email || "admin@sadhaulidham.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setSettings(store.getSettings());
      const updatedCreds = store.getAdminCredentials();
      setAdminCreds(updatedCreds);
      setUsername(updatedCreds.username);
      setAdminEmail(updatedCreds.email);
    });
    return () => unsub();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settings);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanUser = username.trim();
    const cleanEmail = adminEmail.trim();

    if (!cleanUser) {
      setAuthError(isEn ? "Username cannot be empty" : "यूज़रनेम खाली नहीं हो सकता");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 5) {
        setAuthError(
          isEn
            ? "New password must be at least 5 characters long"
            : "नया पासवर्ड कम से कम 5 अक्षरों का होना चाहिए"
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        setAuthError(
          isEn ? "New passwords do not match" : "नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते"
        );
        return;
      }
    }

    store.updateAdminCredentials({
      username: cleanUser,
      email: cleanEmail,
      ...(newPassword ? { password: newPassword } : {}),
    });

    setAuthToast(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setAuthToast(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
        <div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Portal & Security Settings" : "पोर्टल एवं सुरक्षा सेटिंग्स"}
          </h1>
          <p className="text-xs text-spiritual-ivory/60">
            {isEn
              ? "Manage admin login credentials, official contact details, and social media links"
              : "एडमिन लॉगिन क्रेडेंशियल्स, आधिकारिक संपर्क विवरण एवं सोशल मीडिया लिंक्स प्रबंधित करें"}
          </p>
        </div>

        {(toast || authToast) && (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            {isEn ? "Saved successfully!" : "सफलतापूर्वक सुरक्षित किया गया!"}
          </span>
        )}
      </div>

      {/* 1. Admin Login Credentials & Security Box */}
      <div className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-6 relative overflow-hidden">
        <div className="flex items-center gap-2 pb-3 border-b border-gold-500/20">
          <Shield className="w-5 h-5 text-gold-400" />
          <h2 className="text-sm font-bold text-gold-gradient uppercase tracking-wider">
            {isEn ? "Admin Login Credentials (Username & Password)" : "एडमिन लॉगिन विवरण (यूज़रनेम एवं पासवर्ड)"}
          </h2>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Admin Username *" : "एडमिन यूज़रनेम (Username) *"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Admin Login Email *" : "एडमिन लॉगिन ईमेल (Email) *"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@sadhaulidham.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gold-500/10">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "New Password (Leave blank to keep current)" : "नया पासवर्ड (पुराना रखने हेतु खाली छोड़ें)"}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                {isEn ? "Confirm New Password" : "नए पासवर्ड की पुष्टि करें"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-spiritual-ivory/50">
              {isEn
                ? "Changes take effect immediately for all subsequent logins."
                : "परिवर्तन अगले सभी लॉगिन पर तुरंत प्रभावी होगा।"}
            </p>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs flex items-center gap-2 shadow-gold-sm hover:scale-105 transition-transform"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEn ? "Update Admin Credentials" : "क्रेडेंशियल्स अपडेट करें"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Portal & Contact Settings */}
      <form
        onSubmit={handleSaveSettings}
        className="spiritual-glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/40 space-y-6"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-gold-500/20">
          <Settings className="w-5 h-5 text-gold-400" />
          <h2 className="text-sm font-bold text-gold-gradient uppercase tracking-wider">
            {isEn ? "Ashram Contact & Location Details" : "आश्रम संपर्क एवं स्थान विवरण"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Official Phone Number *" : "आधिकारिक फोन नंबर (Phone) *"}
            </label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Public Contact Email *" : "सार्वजनिक संपर्क ईमेल (Email) *"}
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Ashram Address (Hindi) *" : "आश्रम का पता (हिन्दी) *"}
            </label>
            <textarea
              rows={2}
              required
              value={settings.addressHi}
              onChange={(e) => setSettings({ ...settings, addressHi: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Ashram Address (English) *" : "Ashram Address (English) *"}
            </label>
            <textarea
              rows={2}
              required
              value={settings.addressEn}
              onChange={(e) => setSettings({ ...settings, addressEn: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gold-500/20">
          <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider">
            {isEn ? "Social Media & Google Maps Links" : "सोशल मीडिया एवं गूगल मैप्स लिंक"}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              Google Maps URL
            </label>
            <input
              type="text"
              value={settings.googleMapsUrl}
              onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Official YouTube Channel URL" : "आधिकारिक YouTube चैनल URL"}
            </label>
            <input
              type="text"
              value={settings.youtubeUrl}
              onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                WhatsApp Channel URL
              </label>
              <input
                type="text"
                value={settings.whatsappUrl}
                onChange={(e) => setSettings({ ...settings, whatsappUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-xs text-spiritual-ivory focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 rounded-xl bg-gold-gradient text-spiritual-dark font-bold text-xs flex items-center gap-2 shadow-gold-sm hover:scale-105 transition-transform"
        >
          <Save className="w-4 h-4" />
          <span>{isEn ? "Save Portal Settings" : "पोर्टल सेटिंग्स सुरक्षित करें"}</span>
        </button>
      </form>
    </div>
  );
}
