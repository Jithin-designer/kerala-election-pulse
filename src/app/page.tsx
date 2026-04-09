"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Vote,
  Shield,
  IndianRupee,
  GraduationCap,
  Users,
  AlertTriangle,
  MapPin,
  BarChart3,
  Share2,
  Database,
  ExternalLink,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

/* ── Stagger animation helper ── */
const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
});

/* ── States going to polls in 2026 ── */
interface State {
  name: string;
  slug: string;
  status: "live" | "soon";
  pollDate: string;
  flag: string;
  totalSeats: number;
}

const STATES: State[] = [
  { name: "Kerala", slug: "kerala", status: "live", pollDate: "9 April", flag: "🌴", totalSeats: 140 },
  { name: "Tamil Nadu", slug: "tamil-nadu", status: "soon", pollDate: "23 April", flag: "🌅", totalSeats: 234 },
  { name: "West Bengal", slug: "west-bengal", status: "soon", pollDate: "23 & 29 April", flag: "🐯", totalSeats: 294 },
  { name: "Assam", slug: "assam", status: "soon", pollDate: "9 April", flag: "🦏", totalSeats: 126 },
  { name: "Puducherry", slug: "puducherry", status: "soon", pollDate: "9 April", flag: "⚓", totalSeats: 30 },
];

/* ── Key stats from the dataset ── */
const KEY_STATS = [
  { number: "140", label: "Constituencies", icon: MapPin },
  { number: "640+", label: "Candidates tracked", icon: Users },
  { number: "456", label: "Real photos", icon: Database },
  { number: "14", label: "Districts covered", icon: BarChart3 },
];

/* ── What we track ── */
const FEATURES = [
  {
    icon: AlertTriangle,
    title: "Criminal Cases",
    desc: "Pending criminal cases from self-declared affidavits filed with the Election Commission.",
    accent: "#dc2626",
  },
  {
    icon: IndianRupee,
    title: "Assets & Net Worth",
    desc: "Total movable and immovable assets declared by each candidate. Sortable leaderboards.",
    accent: "#059669",
  },
  {
    icon: GraduationCap,
    title: "Education & Profession",
    desc: "Educational qualifications and professional background of every contesting candidate.",
    accent: "#2563eb",
  },
  {
    icon: Shield,
    title: "Alliance & Party Data",
    desc: "LDF, UDF, NDA and independent candidates mapped to every constituency with party affiliations.",
    accent: "#d97706",
  },
  {
    icon: Share2,
    title: "Shareable Cards",
    desc: "Generate branded PNG images of any candidate or constituency and share directly via WhatsApp.",
    accent: "#8b5cf6",
  },
  {
    icon: Vote,
    title: "Live Results (Demo)",
    desc: "Real-time counting simulation with status tracking, margins, and alliance-wise tally.",
    accent: "#0284c7",
  },
];

/* ── Data sources ── */
const SOURCES = [
  { name: "Election Commission of India", url: "https://eci.gov.in", what: "Official constituency & polling data" },
  { name: "MyNeta.info (ADR)", url: "https://myneta.info", what: "Candidate affidavits, criminal cases, assets" },
  { name: "CEO Kerala", url: "https://ceo.kerala.gov.in", what: "State-level election notifications" },
];

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--theme-bg)" }}>

      {/* ═══════════════════════════════════════
          HERO
          ═══════════════════════════════════════ */}
      <section className="px-5 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <ThemeSwitcher compact />
        </div>

        <motion.div {...stagger(0)}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
              style={{
                background: "var(--theme-accent)",
                color: "var(--theme-accent-contrast)",
              }}
            >
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.25em] font-bold"
                style={{ color: "var(--theme-text-muted)" }}
              >
                India Assembly Elections
              </p>
              <h1
                className="text-3xl font-black tracking-tight leading-none"
                style={{ color: "var(--theme-text)" }}
              >
                Election{" "}
                <span style={{ color: "var(--theme-accent)" }}>Pulse</span>{" "}
                <span
                  className="text-[13px] font-semibold ml-1"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  2026
                </span>
              </h1>
            </div>
          </div>

          <p
            className="text-[15px] leading-relaxed max-w-lg"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            The most transparent election tracker for Indian state assembly elections.
            Browse candidates, compare criminal records, track assets, and share data — all sourced
            from official Election Commission affidavits.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-3 mt-5 flex-wrap">
            <Link
              href="/kerala"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-bold transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "var(--theme-accent)",
                color: "var(--theme-accent-contrast)",
              }}
            >
              Explore Kerala
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-bold transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: "var(--theme-fill, var(--theme-surface-hover))",
                color: "var(--theme-text)",
                border: "1px solid var(--theme-border)",
              }}
            >
              Browse All Candidates
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          KEY STATS STRIP
          ═══════════════════════════════════════ */}
      <section className="px-4 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {KEY_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...stagger(i + 2)}
              className="theme-card p-4 flex flex-col gap-1"
            >
              <stat.icon
                className="w-4 h-4 mb-1"
                style={{ color: "var(--theme-accent)" }}
              />
              <span
                className="text-2xl font-black tracking-tight"
                style={{ color: "var(--theme-text)" }}
              >
                {stat.number}
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHAT WE TRACK
          ═══════════════════════════════════════ */}
      <section className="px-5 py-6">
        <motion.div {...stagger(0)}>
          <h2
            className="text-[11px] uppercase tracking-[0.2em] font-bold mb-1"
            style={{ color: "var(--theme-text-muted)" }}
          >
            What We Track
          </h2>
          <p
            className="text-lg font-black tracking-tight mb-5"
            style={{ color: "var(--theme-text)" }}
          >
            Every detail that matters
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              {...stagger(i + 1)}
              className="theme-card p-4 flex gap-3 items-start"
            >
              <div
                className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                style={{ background: feat.accent + "15", color: feat.accent }}
              >
                <feat.icon className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-[14px] font-bold leading-tight"
                  style={{ color: "var(--theme-text)" }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-[12px] leading-relaxed mt-1"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATES GOING TO POLLS
          ═══════════════════════════════════════ */}
      <section className="px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-[11px] uppercase tracking-[0.2em] font-bold mb-1"
              style={{ color: "var(--theme-text-muted)" }}
            >
              States Going to Polls
            </h2>
            <p
              className="text-lg font-black tracking-tight"
              style={{ color: "var(--theme-text)" }}
            >
              2026 Elections
            </p>
          </div>
          <span
            className="text-[12px] font-semibold"
            style={{ color: "var(--theme-text-muted)" }}
          >
            {STATES.length} states
          </span>
        </div>

        <div className="theme-card overflow-hidden">
          {STATES.map((state, i) => {
            const row = (
              <motion.div
                {...stagger(i)}
                className="flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors hover:opacity-90"
                style={{
                  borderBottom: i < STATES.length - 1 ? "1px solid var(--theme-border)" : "none",
                  opacity: state.status === "soon" ? 0.5 : 1,
                }}
              >
                <span className="text-2xl shrink-0">{state.flag}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-[15px] leading-tight"
                    style={{ color: "var(--theme-text)" }}
                  >
                    {state.name}
                  </p>
                  <p
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--theme-text-muted)" }}
                  >
                    {state.totalSeats} seats · Polls: {state.pollDate}
                  </p>
                </div>

                {state.status === "live" ? (
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider shrink-0"
                    style={{
                      background: "var(--theme-accent)",
                      color: "var(--theme-accent-contrast)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "var(--theme-accent-contrast)" }}
                    />
                    LIVE
                  </span>
                ) : (
                  <Lock
                    className="w-4 h-4 shrink-0"
                    style={{ color: "var(--theme-text-muted)" }}
                  />
                )}

                {state.status === "live" && (
                  <ArrowRight
                    className="w-4 h-4 shrink-0"
                    style={{ color: "var(--theme-accent)" }}
                  />
                )}
              </motion.div>
            );

            if (state.status === "live") {
              return <Link key={state.slug} href={`/${state.slug}`}>{row}</Link>;
            }
            return <div key={state.slug} style={{ pointerEvents: "none" }}>{row}</div>;
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          DATA SOURCES
          ═══════════════════════════════════════ */}
      <section className="px-5 py-6">
        <h2
          className="text-[11px] uppercase tracking-[0.2em] font-bold mb-1"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Data Sources
        </h2>
        <p
          className="text-lg font-black tracking-tight mb-4"
          style={{ color: "var(--theme-text)" }}
        >
          100% public data
        </p>

        <div className="space-y-2">
          {SOURCES.map((src) => (
            <div
              key={src.name}
              className="theme-card px-4 py-3 flex items-center gap-3"
            >
              <Database
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--theme-accent)" }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-[13px] flex items-center gap-1"
                  style={{ color: "var(--theme-text)" }}
                >
                  {src.name}
                  <ExternalLink className="w-3 h-3" style={{ color: "var(--theme-text-muted)" }} />
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  {src.what}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-[11px] mt-4 leading-relaxed"
          style={{ color: "var(--theme-text-muted)" }}
        >
          All candidate data is sourced from self-declared affidavits filed with the Election Commission
          of India and compiled by the Association for Democratic Reforms (ADR) via MyNeta.info. Photo coverage
          is ~71% — candidates without photos show generated initials. We do not editorialize or interpret data.
        </p>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer
        className="px-5 py-8 mt-4"
        style={{
          borderTop: "1px solid var(--theme-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "var(--theme-accent)",
              color: "var(--theme-accent-contrast)",
            }}
          >
            <Vote className="w-4 h-4" />
          </div>
          <div>
            <p
              className="text-[14px] font-black"
              style={{ color: "var(--theme-text)" }}
            >
              Kerala Election Pulse
            </p>
            <p
              className="text-[11px]"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Assembly Elections 2026 · Counting 4 May
            </p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap mb-4">
          <Link
            href="/kerala"
            className="text-[12px] font-semibold hover:underline"
            style={{ color: "var(--theme-accent)" }}
          >
            Kerala Districts
          </Link>
          <Link
            href="/browse"
            className="text-[12px] font-semibold hover:underline"
            style={{ color: "var(--theme-accent)" }}
          >
            Browse Candidates
          </Link>
          <Link
            href="/browse/live"
            className="text-[12px] font-semibold hover:underline"
            style={{ color: "var(--theme-accent)" }}
          >
            Live Results
          </Link>
        </div>

        <div className="flex gap-4 flex-wrap mb-4">
          <Link
            href="/terms"
            className="text-[11px] font-semibold hover:underline"
            style={{ color: "var(--theme-text-muted)" }}
          >
            Terms & Disclaimer
          </Link>
          <Link
            href="/terms#privacy"
            className="text-[11px] font-semibold hover:underline"
            style={{ color: "var(--theme-text-muted)" }}
          >
            Privacy
          </Link>
          <Link
            href="/terms#data"
            className="text-[11px] font-semibold hover:underline"
            style={{ color: "var(--theme-text-muted)" }}
          >
            Data Sources
          </Link>
        </div>

        <p
          className="text-[10px] leading-relaxed"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Open civic data project. Not affiliated with any political party.
          Data sourced from ECI self-declared affidavits via MyNeta.info (ADR).
        </p>
        <p
          className="text-[10px] mt-2"
          style={{ color: "var(--theme-text-muted)" }}
        >
          kerala-election-pulse.vercel.app
        </p>
      </footer>
    </main>
  );
}
