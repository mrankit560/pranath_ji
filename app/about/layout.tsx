import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "आश्रम परिचय | श्री निजानंद आश्रम साढौली धाम, हरिद्वार",
  description:
    "श्री निजानंद आश्रम साढौली धाम (हरिद्वार) का पावन इतिहास, आध्यात्मिक उद्देश्य, परमहंस परंपरा, सेवा गतिविधियाँ एवं आश्रम दर्शन।",
  openGraph: {
    title: "आश्रम परिचय | श्री निजानंद आश्रम साढौली धाम, हरिद्वार",
    description:
      "श्री निजानंद आश्रम साढौली धाम (हरिद्वार) का पावन इतिहास, आध्यात्मिक उद्देश्य एवं सेवा गतिविधियाँ।",
    url: "https://sadhaulidham.com/about",
    images: [{ url: "https://sadhaulidham.com/assets/sadhauli-dham-1.jpg", width: 1200, height: 630 }],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
