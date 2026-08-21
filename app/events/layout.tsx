import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "उत्सव एवं कार्यक्रम",
  description:
    "श्री निजानंद आश्रम साढौली धाम (हरिद्वार) में आयोजित होने वाले आगामी आध्यात्मिक महोत्सव, गुरु पूर्णिमा, श्रीकृष्ण जन्माष्टमी व ध्यान शिविर।",
  openGraph: {
    title: "उत्सव एवं कार्यक्रम | Sadhauli Dham",
    description:
      "साढौली धाम में आगामी आध्यात्मिक महोत्सव, अखंड वाणी परायण एवं ध्यान शिविर की जानकारी।",
    url: "https://sadhaulidham.com/events",
    images: [{ url: "https://sadhaulidham.com/assets/hero-reference-1.jpg", width: 1200, height: 630 }],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
