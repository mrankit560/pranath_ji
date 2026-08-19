import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { AudioProvider } from "@/lib/audio/AudioContext";
import { LanguageWelcomeModal } from "@/components/header/LanguageWelcomeModal";
import { PersistentAudioPlayer } from "@/components/audio/PersistentAudioPlayer";

export const metadata: Metadata = {
  metadataBase: new URL("https://sadhaulidham.org"),
  title: "श्री प्राणनाथ जी परमधाम | Shri Prannath Ji Paramdham",
  description:
    "Shri Nijanand Ashram Sadhauli Dham, Haridwar — A Full-Stack Multilingual Spiritual Knowledge & Digital Library Platform for Tartam Vani, Paramdham Wisdom, Satsang, Pravachan, Audio & Meditation.",
  keywords: [
    "Shri Prannath Ji",
    "श्री प्राणनाथ जी",
    "Paramdham",
    "परमधाम",
    "Tartam Vani",
    "तारतम वाणी",
    "Sadhauli Dham Haridwar",
    "साढौली धाम",
    "Nijanand Sampradaya",
    "निजानंद सम्प्रदाय",
    "Brahm Gyan",
    "ब्रह्मज्ञान",
    "Spiritual Library",
  ],
  authors: [{ name: "Sadhauli Dham Research & Media Council" }],
  openGraph: {
    title: "श्री प्राणनाथ जी परमधाम | Shri Prannath Ji Paramdham",
    description:
      "Shri Nijanand Ashram Sadhauli Dham, Haridwar — The Sacred Paramdham of Divine Wisdom, Tartam Vani & Spiritual Knowledge.",
    images: ["/assets/hero-reference-1.jpg"],
    siteName: "Shri Prannath Ji Paramdham",
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
