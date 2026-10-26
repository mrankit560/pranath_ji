"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSelector } from "@/components/header/LanguageSelector";
import { store } from "@/lib/data/store";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Flower2,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  MapPin,
  Info,
  Compass,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useI18n();
  const isEn = language === "en";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = store.isAdminAuthenticated();
      if (!isAuth) {
        setIsAuthenticated(false);
        setIsChecking(false);
        // Automatic redirect to login page
        window.location.replace("/auth/login?redirect=" + encodeURIComponent(pathname));
      } else {
        setIsAuthenticated(true);
        setIsChecking(false);
      }
    }
  }, [pathname]);

  const navItems = [
    {
      href: "/admin",
      label: isEn ? "Dashboard Overview" : "डैशबोर्ड अवलोकन",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/prannath-ji",
      label: isEn ? "Shree Prannath Ji Articles" : "श्री प्राणनाथ जी लेख CMS",
      icon: Sparkles,
    },
    {
      href: "/admin/adhyatmik-gyan",
      label: isEn ? "Aadhyatmik Gyan Blogs" : "आध्यात्मिक ज्ञान ब्लॉग",
      icon: Compass,
    },
    {
      href: "/admin/books",
      label: isEn ? "PDF Library Books" : "PDF ग्रंथालय व पुस्तकें",
      icon: BookOpen,
    },
    {
      href: "/admin/videos",
      label: isEn ? "Media Centre Videos" : "मीडिया केंद्र वीडियो",
      icon: Video,
    },
    {
      href: "/admin/meditation",
      label: isEn ? "Meditation (Chitwani CMS)" : "चितवनी ध्यान CMS",
      icon: Flower2,
    },
    {
      href: "/admin/events",
      label: isEn ? "Festival Events Calendar" : "उत्सव एवं कार्यक्रम",
      icon: Calendar,
    },
    {
      href: "/admin/dhams",
      label: isEn ? "Holy Dham Locations" : "पवित्र आश्रम व धाम स्थान",
      icon: MapPin,
    },
    {
      href: "/admin/about",
      label: isEn ? "Home About Us Content" : "होम 'हमारे बारे में' सामग्री",
      icon: Info,
    },
    {
      href: "/admin/settings",
      label: isEn ? "Portal & Social Settings" : "पोर्टल व सोशल सेटिंग्स",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    store.setAdminSession(false);
    window.location.href = "/auth/login";
  };

  if (isChecking || !isAuthenticated) {
    const loginUrl = "/auth/login?redirect=" + encodeURIComponent(pathname);
    return (
      <div className="min-h-screen bg-surface text-ink flex items-center justify-center p-4">
        <div className="text-center p-8 spiritual-glass-card rounded-3xl border border-line max-w-md w-full space-y-4 shadow-2xl">
          <ShieldCheck className="w-14 h-14 text-gold-700 mx-auto animate-pulse" />
          <div>
            <h2 className="text-lg font-bold text-ink mb-1 font-spiritual-heading">
              {isEn ? "Admin Security Verification" : "एडमिन सुरक्षा सत्यापन"}
            </h2>
            <p className="text-xs text-ink/70">
              {isEn
                ? "Admin login session is required to access the CMS."
                : "एडमिन CMS पोर्टल में प्रवेश हेतु सक्रिय लॉगिन सत्र आवश्यक है।"}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-surface-sunk/80 border border-line text-left text-xs space-y-1">
            <div className="text-[11px] font-bold text-gold-700 uppercase">
              {isEn ? "Default Admin Credentials:" : "डिफ़ॉल्ट एडमिन क्रेडेंशियल्स:"}
            </div>
            <div className="text-ink/80 font-mono text-[11px]">
              {isEn ? "Username:" : "यूज़रनेम:"} <span className="text-gold-800 font-bold">admin</span>
            </div>
            <div className="text-ink/80 font-mono text-[11px]">
              {isEn ? "Password:" : "पासवर्ड:"} <span className="text-gold-800 font-bold">admin123</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              href={loginUrl}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold-gradient text-on-gold font-bold text-xs shadow-gold-sm hover:scale-105 transition-transform"
            >
              {isEn ? "Sign In to Admin Portal" : "एडमिन लॉगिन करें"}
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-card border border-line text-ink/70 text-xs hover:bg-white/5"
            >
              {isEn ? "Return to Home" : "मुख्य पृष्ठ पर जाएं"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-ink flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-surface-2/95 border-r border-line p-5 backdrop-blur-xl flex-shrink-0">
        <div>
          {/* Logo & Portal Title */}
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/assets/logo-emblem.png"
                alt="Emblem"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_10px_rgba(168,128,26,0.25)]"
              />
            </div>
            <div>
              <span className="text-sm font-bold text-gold-gradient font-spiritual-heading block leading-normal py-0.5 overflow-visible">
                {isEn ? "Sadhauli Dham Admin" : "साढौली धाम एडमिन"}
              </span>
              <span className="text-[10px] text-gold-muted/80 font-semibold block tracking-wider uppercase">
                {isEn ? "Paramdham CMS" : "परमधाम CMS"}
              </span>
            </div>
          </Link>

          {/* Language Switcher in Sidebar */}
          <div className="mb-6 flex items-center justify-between p-2.5 rounded-xl bg-surface-sunk/70 border border-line">
            <span className="text-[11px] font-semibold text-gold-700">
              {isEn ? "Language" : "भाषा"}:
            </span>
            <LanguageSelector />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gold-gradient text-on-gold font-bold shadow-gold-sm"
                      : "text-ink/80 hover:bg-gold-500/10 hover:text-gold-700"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-line space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-gold-700/80 hover:bg-gold-500/10 hover:text-gold-800 transition-colors"
          >
            <span>{isEn ? "Live Website ↗" : "लाइव वेबसाइट देखें ↗"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-500/15 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{isEn ? "Logout" : "लॉगआउट"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Admin Header */}
        <header className="lg:hidden flex items-center justify-between bg-surface-2 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-1.5 rounded-lg border border-line text-gold-700"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-sm font-bold text-gold-gradient font-spiritual-heading leading-normal py-0.5 overflow-visible">
              {isEn ? "Paramdham CMS" : "परमधाम CMS"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button onClick={handleLogout} className="p-1.5 text-red-700">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-surface-2 border-b border-line p-4 space-y-1 animate-fade-in">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                    isActive
                      ? "bg-gold-gradient text-on-gold font-bold"
                      : "text-ink/80 hover:bg-gold-500/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Dynamic Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
