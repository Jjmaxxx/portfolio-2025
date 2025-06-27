import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Justin Lee's Portfolio",
  description: "Next.js, Three.js, TailwindCSS, ShadCN",
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
