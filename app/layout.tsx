import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { AudioProvider } from "@/lib/audio/AudioContext";
import { LanguageWelcomeModal } from "@/components/header/LanguageWelcomeModal";
import { PersistentAudioPlayer } from "@/components/audio/PersistentAudioPlayer";

export const metadata: Metadata = {
  metadataBase: new URL("https://sadhaulidham.com"),
  title: {
    default: "साढौली धाम | श्री प्राणनाथ जी वाणी — Sadhauli Dham",
    template: "%s | Sadhauli Dham",
  },
  description:
    "श्री निजानंद आश्रम साढौली धाम, हरिद्वार (उत्तराखण्ड) — The official spiritual sanctuary of Mahamati Shri Prannath Ji, Tartam Vani, Satsang, and Digital Library (sadhaulidham.com).",
  keywords: [
    "Sadhauli Dham",
    "साढौली धाम",
    "sadhaulidham.com",
    "Sadhauli Dham Haridwar",
    "Shri Prannath Ji",
    "श्री प्राणनाथ जी",
    "Paramdham",
    "परमधाम",
    "Tartam Vani",
    "तारतम वाणी",
    "Nijanand Sampradaya",
    "निजानंद सम्प्रदाय",
    "Brahm Gyan",
    "ब्रह्मज्ञान",
    "Spiritual Library",
  ],
  authors: [{ name: "Sadhauli Dham Research & Media Council" }],
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: "https://sadhaulidham.com",
    title: "साढौली धाम | श्री प्राणनाथ जी वाणी — Sadhauli Dham",
    description:
      "श्री निजानंद आश्रम साढौली धाम, हरिद्वार — The official spiritual sanctuary of Divine Wisdom, Tartam Vani & Nijanand Sampradaya.",
    images: [
      {
        url: "https://sadhaulidham.com/assets/hero-reference-1.jpg",
        width: 1200,
        height: 630,
        alt: "Sadhauli Dham Haridwar",
      },
    ],
    siteName: "साढौली धाम | Shri Prannath Ji Vani (sadhaulidham.com)",
  },
  twitter: {
    card: "summary_large_image",
    title: "साढौली धाम | श्री प्राणनाथ जी वाणी — Sadhauli Dham",
    description:
      "श्री निजानंद आश्रम साढौली धाम, हरिद्वार — The official spiritual sanctuary of Divine Wisdom, Tartam Vani & Nijanand Sampradaya.",
    images: ["https://sadhaulidham.com/assets/hero-reference-1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="dark">
      <body className="bg-[#080605] text-[#F7F1E3] antialiased selection:bg-gold-500 selection:text-black">
        <I18nProvider>
          <AudioProvider>
            <LanguageWelcomeModal />
            {children}
            <PersistentAudioPlayer />
          </AudioProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
