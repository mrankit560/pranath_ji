import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ब्रह्मज्ञान तत्व दर्शन एवं मूल सिद्धांत",
  description:
    "तारतम वाणी द्वारा प्रकट परब्रह्म, अक्षरातीत, माया, जीव एवं मोक्ष का गूढ़ आध्यात्मिक विवेचन — साढौली धाम दर्शन।",
  openGraph: {
    title: "ब्रह्मज्ञान तत्व दर्शन एवं मूल सिद्धांत | Sadhauli Dham",
    description:
      "तारतम वाणी द्वारा प्रकट परब्रह्म, अक्षरातीत, माया, जीव एवं मोक्ष का गूढ़ आध्यात्मिक विवेचन।",
    url: "https://sadhaulidham.com/philosophy",
    images: [{ url: "https://sadhaulidham.com/assets/paramdham-mandala.png", width: 1200, height: 630 }],
  },
};

export default function PhilosophyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
