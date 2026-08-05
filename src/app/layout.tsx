import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zaney.dev"),
  title: "zaney.dev",
  description: "Zane's desktop — daily games, experiments, and more.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "zaney.dev",
    description: "Zane's desktop — daily games, experiments, and more.",
    url: "https://zaney.dev",
    siteName: "zaney.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "zaney.dev",
    description: "Zane's desktop — daily games, experiments, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
