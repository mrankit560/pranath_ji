import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF लाइब्रेरी — तारतम वाणी एवं आध्यात्मिक ग्रन्थ",
  description:
    "श्री बीतक साहेब, तारतम वाणी के १४ ग्रन्थ, टीकाएं, एवं साधना पुस्तकें ऑनलाइन पढ़ें और डाउनलोड करें — साढौली धाम ई-ग्रंथालय।",
  openGraph: {
    title: "PDF लाइब्रेरी — तारतम वाणी एवं आध्यात्मिक ग्रन्थ | Sadhauli Dham",
    description:
      "श्री बीतक साहेब, तारतम वाणी के १४ ग्रन्थ एवं साधना पुस्तकें ऑनलाइन पढ़ें और डाउनलोड करें।",
    url: "https://sadhaulidham.com/library",
    images: [{ url: "https://sadhaulidham.com/assets/hero-reference-1.jpg", width: 1200, height: 630 }],
  },
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
