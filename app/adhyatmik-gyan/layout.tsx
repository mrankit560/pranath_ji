import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "आध्यात्मिक ज्ञान एवं सत्संग लेख",
  description:
    "आत्मज्ञान, अक्षरातीत परब्रह्म, प्रेम, सेवा और साधना पर ज्ञानवर्धक शोध आलेख, सत्संग एवं तत्व ज्ञान।",
  openGraph: {
    title: "आध्यात्मिक ज्ञान एवं सत्संग लेख | Sadhauli Dham",
    description:
      "आत्मज्ञान, अक्षरातीत परब्रह्म, प्रेम, सेवा और साधना पर ज्ञानवर्धक शोध आलेख।",
    url: "https://sadhaulidham.com/adhyatmik-gyan",
    images: [{ url: "https://sadhaulidham.com/assets/hero-reference-2.jpg", width: 1200, height: 630 }],
  },
};

export default function AdhyatmikGyanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
