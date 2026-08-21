import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "शोध आलेख एवं आध्यात्मिक प्रकाशन",
  description:
    "साढौली धाम शोध पीठ द्वारा प्रकाशित आध्यात्मिक, दार्शनिक एवं ऐतिहासिक शोध आलेख एवं अमृत विचार।",
  openGraph: {
    title: "शोध आलेख एवं आध्यात्मिक प्रकाशन | Sadhauli Dham",
    description:
      "साढौली धाम शोध पीठ द्वारा प्रकाशित आध्यात्मिक, दार्शनिक एवं ऐतिहासिक आलेख।",
    url: "https://sadhaulidham.com/articles",
    images: [{ url: "https://sadhaulidham.com/assets/hero-reference-1.jpg", width: 1200, height: 630 }],
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
