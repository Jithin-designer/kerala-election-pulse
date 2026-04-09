import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
