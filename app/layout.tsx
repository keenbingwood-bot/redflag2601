import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Using Inter font for clean, professional look (similar to Geist)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RedFlag.buzz - TL;DR for Job Descriptions",
  description: "Skip the corporate jargon. Decode hidden risks in seconds.",
  keywords: ["job description", "red flags", "risk analysis", "career", "job search"],
  authors: [{ name: "RedFlag.buzz" }],
  openGraph: {
    title: "RedFlag.buzz - TL;DR for Job Descriptions",
    description: "Skip the corporate jargon. Decode hidden risks in seconds.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen bg-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}
