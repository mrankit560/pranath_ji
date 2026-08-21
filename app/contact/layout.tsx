import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "संपर्क करें | श्री निजानंद आश्रम साढौली धाम",
  description:
    "श्री निजानंद आश्रम साढौली धाम (हरिद्वार) से संपर्क करें — पता, दूरभाष नंबर, ईमेल, गूगल मैप्स दिशा-निर्देश एवं आध्यात्मिक जिज्ञासा प्रपत्र।",
  openGraph: {
    title: "संपर्क करें | श्री निजानंद आश्रम साढौली धाम",
    description:
      "साढौली धाम हरिद्वार संपर्क विवरण, पता, फोन नंबर व गूगल मैप्स लोकेशन।",
    url: "https://sadhaulidham.com/contact",
    images: [{ url: "https://sadhaulidham.com/assets/hero-reference-1.jpg", width: 1200, height: 630 }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
