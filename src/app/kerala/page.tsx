"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, ChevronRight, Vote } from "lucide-react";
import {
  getAllDistricts,
  getConstituenciesByDistrict,
  getCelebritySeats,
} from "@/lib/data";
import ThemeSwitcher from "@/components/ThemeSwitcher";

/* Geographic ordering: North → South */
const DISTRICT_ORDER = [
  "Kasaragodu",
  "Kannur",
  "Wayanad",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Thrissur",
  "Ernakulam",
  "Idukki",
  "Kottayam",
  "Alappuzha",
  "Pathanamthitta",
  "Kollam",
  "Thiruvananthapuram",
];

/* Friendly emoji per district */
const DISTRICT_EMOJI: Record<string, string> = {
  Kasaragodu: "🏖️",
  Kannur: "🪔",
  Wayanad: "🌿",
  Kozhikode: "🥥",
  Malappuram: "🕌",
  Palakkad: "🌾",
  Thrissur: "🐘",
  Ernakulam: "🚢",
  Idukki: "⛰️",
  Kottayam: "📚",
  Alappuzha: "🛶",
  Pathanamthitta: "🛕",
  Kollam: "🥔",
  Thiruvananthapuram: "🏛️",
};

export default function KeralaDistrictsPage() {
  const districts = getAllDistricts();
  const celebSeats = useMemo(() => getCelebritySeats(), []);
  const celebNos = useMemo(() => new Set(celebSeats.map((c) => c.no)), [celebSeats]);

  // Build district list with seat counts and hot seat counts
  const districtList = useMemo(() => {
    return DISTRICT_ORDER.filter((d) => districts.includes(d))
      .map((district) => {
        const constituencies = getConstituenciesByDistrict(district);
        const hotSeats = constituencies.filter((c) => celebNos.has(c.no)).length;
        return {
          name: district,
          seats: constituencies.length,
          hotSeats,
        };
      })
      .filter((d) => d.seats > 0);
  }, [districts, celebNos]);

  const totalSeats = districtList.reduce((sum, d) => sum + d.seats, 0);
  const totalHotSeats = districtList.reduce((sum, d) => sum + d.hotSeats, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: "color-mix(in srgb, var(--theme-bg) 80%, transparent)",
          borderBottom: "1px solid var(--theme-border)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 theme-text-secondary hover:opacity-80 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">States</span>
          </Link>

          <h1 className="theme-text font-black text-lg tracking-tight">
            🌴 <span className="theme-accent">Kerala</span>
          </h1>

          <ThemeSwitcher compact />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-5 pt-8 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="theme-text-muted text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
            Assembly Elections 2026
          </p>
          <h2 className="theme-text text-3xl md:text-4xl font-black tracking-tight leading-none mb-2">
            Kerala&apos;s <span className="theme-accent">Battles</span>
          </h2>
          <p className="theme-text-secondary text-sm">
            {totalSeats} constituencies across {districtList.length} districts
          </p>

          {/* Quick stats */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <div
              className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5"
              style={{
                background: "var(--theme-border)",
                color: "var(--theme-text-secondary)",
              }}
            >
              <Vote className="w-3 h-3" style={{ color: "var(--theme-accent)" }} />
              <span className="font-bold">{totalSeats}</span> seats
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5"
              style={{
                background: "var(--theme-border)",
                color: "var(--theme-text-secondary)",
              }}
            >
              🔥 <span className="font-bold">{totalHotSeats}</span> hot seats
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-xs"
              style={{
                background: "var(--theme-accent)",
                color: "var(--theme-accent-contrast)",
              }}
            >
              <span className="font-bold">9 Apr</span> · Polling
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── District Grid ── */}
      <section className="px-4 pb-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="theme-text font-bold text-sm uppercase tracking-wider">
            Select District
          </h3>
          <Link
            href="/browse"
            className="theme-text-muted text-[11px] font-semibold hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {districtList.map((d, i) => (
            <Link
              key={d.name}
              href={`/browse?district=${encodeURIComponent(d.name)}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="theme-card p-4 cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98] relative"
                style={{ minHeight: "120px" }}
              >
                {/* Hot seat badge */}
                {d.hotSeats > 0 && (
                  <span
                    className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5"
                    style={{
                      background: "rgba(255,165,0,0.15)",
                      color: "#fb923c",
                      border: "1px solid rgba(255,165,0,0.3)",
                    }}
                  >
                    🔥 {d.hotSeats}
                  </span>
                )}

                {/* Emoji */}
                <div className="text-3xl mb-1.5">
                  {DISTRICT_EMOJI[d.name] || "📍"}
                </div>

                {/* Name */}
                <h4 className="theme-text font-bold text-sm leading-tight mb-1">
                  {d.name}
                </h4>

                {/* Seats */}
                <div className="flex items-center justify-between">
                  <p className="theme-text-muted text-[11px] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {d.seats} seats
                  </p>
                  <ChevronRight
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--theme-accent)", opacity: 0.5 }}
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="theme-text-muted text-center text-[11px] mt-8 px-6">
          Tap a district to explore all constituencies and candidates
        </p>
      </section>
    </div>
  );
}
