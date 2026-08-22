"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { store } from "@/lib/data/store";
import { Navbar } from "@/components/header/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const { t, language } = useI18n();
  const isEn = language === "en";
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const cleanId = identifier.trim();
    const cleanPass = password;

    if (!cleanId || !cleanPass) {
      setError(
        isEn
          ? "Please enter username/email and password"
          : "कृपया यूज़रनेम / ईमेल और पासवर्ड दर्ज करें"
      );
      setIsSubmitting(false);
      return;
    }

    // 1. Verify if Admin credentials match
    const isAdmin = store.verifyAdminCredentials(cleanId, cleanPass);

    if (isAdmin) {
      store.setAdminSession(true, cleanId);
      router.push(redirectUrl);
      return;
    }

    // 2. Allow user/seeker demo login if standard email format
    if (cleanId.includes("@") && cleanPass.length >= 4) {
      if (typeof window !== "undefined") {
        localStorage.setItem("prannath_user_role", "user");
        localStorage.setItem("prannath_user_email", cleanId);
      }
      router.push("/dashboard");
      return;
    }

    // 3. Invalid credentials
    setError(
      isEn
        ? "Invalid username or password. Please check your credentials."
        : "अमान्य यूज़रनेम या पासवर्ड। कृपया सही विवरण दर्ज करें।"
    );
    setIsSubmitting(false);
  };

  return (
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-[11px] font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>{isEn ? "Secure Authentication" : "सुरक्षित प्रवेश"}</span>
          </div>
          <h1 className="text-2xl font-bold text-gold-gradient font-spiritual-heading">
            {isEn ? "Portal & Admin Sign In" : "पोर्टल एवं एडमिन लॉगिन"}
          </h1>
          <p className="text-xs text-spiritual-ivory/70 mt-1">
            {isEn
              ? "Enter your credentials to access the portal"
              : "श्री प्राणनाथ जी वाणी पोर्टल में प्रवेश हेतु विवरण दर्ज करें"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs text-center font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Username or Email *" : "यूज़रनेम / ईमेल पता *"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isEn ? "Enter username or email" : "यूज़रनेम या ईमेल दर्ज करें"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-gold-500/30 text-spiritual-ivory placeholder-spiritual-ivory/40 text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gold-300 mb-1">
              {isEn ? "Password *" : "पासवर्ड (Password) *"}
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
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-gold-gradient text-spiritual-dark font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-gold-sm hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            <span>{isSubmitting ? (isEn ? "Verifying..." : "सत्यापन...") : (isEn ? "Sign In" : "लॉगिन करें")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-spiritual-dark text-spiritual-ivory flex flex-col justify-between">
      <Navbar onOpenSearch={() => {}} />
      <Suspense
        fallback={
          <div className="pt-32 pb-16 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
      <Footer />
    </main>
  );
}
