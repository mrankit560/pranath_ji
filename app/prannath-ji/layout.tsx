import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "महामति श्री प्राणनाथ जी जीवन व सन्देश",
  description:
    "महामति श्री प्राणनाथ जी का दिव्य प्राकट्य, लीला चरित्र, बीतक इतिहास एवं अखंड परमधाम का पावन संदेश।",
  openGraph: {
    title: "महामति श्री प्राणनाथ जी जीवन व सन्देश | Sadhauli Dham",
    description:
      "महामति श्री प्राणनाथ जी का दिव्य प्राकट्य, लीला चरित्र, बीतक इतिहास एवं अखंड परमधाम का संदेश।",
    url: "https://sadhaulidham.com/prannath-ji",
    images: [{ url: "https://sadhaulidham.com/assets/hero-reference-1.jpg", width: 1200, height: 630 }],
  },
};

export default function PrannathJiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
