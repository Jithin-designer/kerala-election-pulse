import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Calistoga,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SaaS Mobile theme — Calistoga for hero headlines (high-tech boutique)
const calistoga = Calistoga({
  variable: "--font-calistoga",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// SaaS Mobile theme — JetBrains Mono for data labels / stats
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kerala Election Pulse 2026 | Live Candidate Tracker",
  description:
    "Track Kerala Assembly Election 2026 candidates, criminal cases, assets, and live results — the most interactive election experience.",
  keywords: "Kerala election 2026, candidate tracker, criminal cases, assembly election, LDF, UDF, NDA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme=""
      className={`${geistSans.variable} ${geistMono.variable} ${calistoga.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Synchronous theme bootstrap — runs before paint to prevent FOUC */}
        <script src="/theme-init.js" />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="site-container">
          {children}
        </div>
      </body>
    </html>
  );
}
