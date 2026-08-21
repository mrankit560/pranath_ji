import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "चितवनी एवं ध्यान साधना",
  description:
    "परमधाम के २४ पक्षों एवं युगल स्वरूप के ध्यान की सम्पूर्ण विधि, ध्यान ग्रन्थ एवं वीडियो मार्गदर्शिका — साढौली धाम ध्यान साधना।",
  openGraph: {
    title: "चितवनी एवं ध्यान साधना | Sadhauli Dham",
    description:
      "परमधाम के २४ पक्षों एवं युगल स्वरूप के ध्यान की सम्पूर्ण विधि, ध्यान ग्रन्थ एवं वीडियो मार्गदर्शिका।",
    url: "https://sadhaulidham.com/meditation",
    images: [{ url: "https://sadhaulidham.com/assets/paramdham-mandala.png", width: 1200, height: 630 }],
  },
};

export default function MeditationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
