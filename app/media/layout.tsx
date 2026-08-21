import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "मीडिया केंद्र — वीडियो सत्संग एवं यूट्यूब",
  description:
    "साढौली धाम से दैनिक सत्संग, अमृतवाणी प्रवचन एवं आधिकारिक यूट्यूब चैनल के माध्यम से दिव्य दर्शन एवं प्रवचन।",
  openGraph: {
    title: "मीडिया केंद्र — वीडियो सत्संग एवं यूट्यूब | Sadhauli Dham",
    description:
      "साढौली धाम से दैनिक सत्संग, अमृतवाणी प्रवचन एवं आधिकारिक यूट्यूब चैनल के माध्यम से दिव्य दर्शन।",
    url: "https://sadhaulidham.com/media",
    images: [{ url: "https://sadhaulidham.com/assets/hero-reference-2.jpg", width: 1200, height: 630 }],
  },
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
