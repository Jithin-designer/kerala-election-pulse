"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, Vote } from "lucide-react";

interface State {
  name: string;
  slug: string;
  status: "live" | "soon";
  pollDate: string;
  flag: string;
  totalSeats: number;
}

// Assembly Elections 2026 — only states going to polls in 2026
const STATES: State[] = [
  { name: "Kerala", slug: "kerala", status: "live", pollDate: "9 April", flag: "🌴", totalSeats: 140 },
  { name: "Tamil Nadu", slug: "tamil-nadu", status: "soon", pollDate: "23 April", flag: "🌅", totalSeats: 234 },
  { name: "West Bengal", slug: "west-bengal", status: "soon", pollDate: "23 & 29 April", flag: "🐯", totalSeats: 294 },
  { name: "Assam", slug: "assam", status: "soon", pollDate: "9 April", flag: "🦏", totalSeats: 126 },
  { name: "Puducherry", slug: "puducherry", status: "soon", pollDate: "9 April", flag: "⚓", totalSeats: 30 },
];

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
      {/* ── Compact Hero ── */}
      <section className="px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
            style={{
              background: "var(--theme-accent)",
              color: "var(--theme-accent-contrast)",
            }}
          >
            <Vote className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="theme-text-muted text-[9px] uppercase tracking-[0.2em] font-bold">
              Assembly Elections
            </p>
            <h1 className="theme-text text-2xl font-black tracking-tight leading-none mt-0.5">
              <span className="theme-accent">2026</span>
              <span className="theme-text-muted text-[11px] font-medium ml-2">
                · Counting 4 May
              </span>
            </h1>
          </div>
        </motion.div>
      </section>

      {/* ── State Selection ── */}
      <section className="px-4 pb-32 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1 mt-2">
          <h2 className="theme-text text-sm font-bold uppercase tracking-wider">Select Your State</h2>
          <span className="theme-text-muted text-xs">{STATES.length} going to polls</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STATES.map((state, i) => {
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="theme-card p-4 cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden"
                style={{ minHeight: "130px" }}
              >
                {/* Live badge */}
                {state.status === "live" && (
                  <span
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider"
                    style={{
                      background: "var(--theme-accent)",
                      color: "var(--theme-accent-contrast)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    LIVE
                  </span>
                )}

                {/* Soon lock */}
                {state.status === "soon" && (
                  <span className="absolute top-2 right-2 theme-text-muted">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}

                {/* Flag emoji */}
                <div className="text-3xl mb-2">{state.flag}</div>

                {/* State name */}
                <h3 className="theme-text font-bold text-sm leading-tight">
                  {state.name}
                </h3>

                {/* Meta */}
                <div className="theme-text-muted text-[10px] mt-1 leading-tight">
                  <div>{state.totalSeats} seats</div>
                  <div className="theme-accent font-semibold mt-0.5" style={{ opacity: 0.8 }}>
                    Polls: {state.pollDate}
                  </div>
                </div>

                {/* Arrow for live */}
                {state.status === "live" && (
                  <div
                    className="absolute bottom-3 right-3 flex items-center theme-accent"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );

            if (state.status === "live") {
              return (
                <Link key={state.slug} href={`/${state.slug}`}>
                  {card}
                </Link>
              );
            }
            return (
              <div key={state.slug} style={{ opacity: 0.5, pointerEvents: "none" }}>
                {card}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="theme-text-muted text-center text-[11px] mt-8 px-6">
          More states coming soon. Data sourced from the Election Commission of India and MyNeta.info.
        </p>
      </section>
    </main>
  );
}
