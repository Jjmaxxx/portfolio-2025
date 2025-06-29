import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Justin Lee's Portfolio",
  description: "Made with Next.js, Three.js, TailwindCSS",
  applicationName: "Justin Lee Portfolio",
  authors: [{ name: "Justin Lee" }],
  keywords: ["Justin Lee", "Portfolio", "Next.js", "Fullstack", "Cloud", "Developer"],
  creator: "Justin Lee",
  metadataBase: new URL("https://justinlee.dev"),
  openGraph: {
    title: "Justin Lee's Portfolio",
    description: "Explore my projects!",
    url: "https://justinlee.dev",
    images: [
      {
        url: "/buggah.png",
        width: 1200,
        height: 630,
        alt: "Justin Lee Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
