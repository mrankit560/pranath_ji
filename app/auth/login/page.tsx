"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import { User, Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("कृपया ईमेल और पासवर्ड दर्ज करें");
      return;
    }

    // Check if admin login credentials
    if (email === "admin@sadhaulidham.org" || email === "admin" || password === "admin123") {
      if (typeof window !== "undefined") {
        localStorage.setItem("prannath_user_role", "admin");
        localStorage.setItem("prannath_user_email", email);
      }
      router.push("/admin");
    } else {
      // Normal seeker login
      if (typeof window !== "undefined") {
        localStorage.setItem("prannath_user_role", "user");
        localStorage.setItem("prannath_user_email", email);
      }
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory flex flex-col justify-between">
      <Navbar onOpenSearch={() => {}} />

      <div className="pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md spiritual-glass-card rounded-3xl p-8 border border-gold-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gold-radial pointer-events-none opacity-30" />

          {/* Emblem */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/assets/logo-emblem.png"
              alt="Emblem"
              width={80}
              height={80}
              className="object-contain drop-shadow-[0_0_15px_rgba(244,208,111,0.5)]"
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
              {language === "hi" ? "साधक / एडमिन लॉगिन" : "Seeker & Admin Login"}
            </h1>
            <p className="text-xs text-spiritual-ivory/70 mt-1">
              {language === "hi"
                ? "श्री प्राणनाथ जी परमधाम में प्रवेश करें"
                : "Enter Shri Prannath Ji Paramdham"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                ईमेल पता / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com या admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-spiritual-ivory placeholder-spiritual-ivory/40 text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold-300 mb-1">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-spiritual-ivory placeholder-spiritual-ivory/40 text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-gold-sm hover:scale-[1.02] transition-transform"
            >
              <span>लॉगिन करें (Sign In)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Helper / Demo Credential Note */}
          <div className="mt-6 pt-4 border-t border-gold-500/20 text-center">
            <p className="text-[11px] text-spiritual-ivory/60">
              एडमिन CMS एक्सेस हेतु: <strong className="text-gold-300">admin</strong> / पासवर्ड: <strong className="text-gold-300">admin123</strong>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
