"use client";

import Link from "next/link";
import { getMeta } from "@/lib/data";

export default function HeroSection() {
  const meta = getMeta();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,122,82,0.3)_0%,_transparent_70%)]" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-emerald-glow/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-8 animate-fade-in-down">
          <span className="w-2 h-2 rounded-full bg-emerald-glow animate-pulse" />
          <span className="text-gold-light text-sm font-medium tracking-wide">
            POLLING DAY: {new Date(meta.polling_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 animate-fade-in-up [animation-delay:200ms]">
          <span className="text-ivory">Kerala</span>{" "}
          <span className="gold-shimmer">Election</span>
          <br />
          <span className="text-ivory">Pulse</span>{" "}
          <span className="text-gold font-light text-4xl md:text-5xl">2026</span>
        </h1>

        {/* Subtitle */}
        <p className="text-ivory-dark/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up [animation-delay:400ms]">
          {meta.total_constituencies} constituencies. {meta.total_districts} districts.
          <br />
          <span className="text-gold-light">
            Every candidate. Every case. Every rupee.
          </span>
        </p>

        {/* Stats row */}
        <div className="flex justify-center gap-6 md:gap-12 mb-12 animate-fade-in-up [animation-delay:600ms]">
          {[
            { label: "Constituencies", value: "140", color: "text-emerald-glow" },
            { label: "Districts", value: "14", color: "text-gold" },
            { label: "Alliances", value: "3", color: "text-ivory" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-ivory-dark/50 text-xs uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:800ms]">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-dark to-gold text-emerald-deep font-semibold text-lg hover:shadow-[0_0_30px_rgba(212,168,67,0.4)] transition-all duration-300 hover:scale-105"
          >
            Discover Battles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/swipe"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-gold/30 text-gold-light font-medium text-lg hover:bg-gold/10 transition-all duration-300"
          >
            Swipe Netas 🔥
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060e09] to-transparent" />
    </section>
  );
}
