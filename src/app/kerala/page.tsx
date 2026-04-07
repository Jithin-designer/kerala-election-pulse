"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, ChevronRight, Vote, Flame } from "lucide-react";
import {
  getAllDistricts,
  getConstituenciesByDistrict,
  getCelebritySeats,
} from "@/lib/data";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function KeralaDistrictsPage() {
  const districts = getAllDistricts();
  const celebSeats = useMemo(() => getCelebritySeats(), []);
  const celebNos = useMemo(() => new Set(celebSeats.map((c) => c.no)), [celebSeats]);

  // Alphabetical order
  const districtList = useMemo(() => {
    return [...districts]
      .sort((a, b) => a.localeCompare(b))
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

      {/* ── Compact Hero ── */}
      <section className="px-5 pt-5 pb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="theme-text-muted text-[9px] uppercase tracking-[0.2em] font-bold">
            Kerala · Assembly Elections 2026
          </p>
          <h2 className="theme-text text-xl font-black tracking-tight leading-none mt-1">
            {totalSeats} Seats · {districtList.length} Districts
          </h2>

          {/* Quick stats chips */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <div
              className="px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1"
              style={{
                background: "var(--theme-border)",
                color: "var(--theme-text-secondary)",
              }}
            >
              <Vote className="w-3 h-3" style={{ color: "var(--theme-accent)" }} />
              <span className="font-bold">{totalSeats}</span> seats
            </div>
            <div
              className="px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1"
              style={{
                background: "var(--theme-border)",
                color: "var(--theme-text-secondary)",
              }}
            >
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="font-bold">{totalHotSeats}</span> hot
            </div>
            <div
              className="px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{
                background: "var(--theme-accent)",
                color: "var(--theme-accent-contrast)",
              }}
            >
              9 Apr · Polling
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── District List View (alphabetical) ── */}
      <section className="px-4 pb-32 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2 px-1 mt-2">
          <h3 className="theme-text text-sm font-bold uppercase tracking-wider">
            Select District
          </h3>
          <Link
            href="/browse"
            className="theme-text-muted text-[11px] font-semibold hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="theme-card overflow-hidden">
          {districtList.map((d, i) => (
            <Link
              key={d.name}
              href={`/browse?district=${encodeURIComponent(d.name)}`}
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.025, duration: 0.25 }}
                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors last:border-none hover:opacity-90"
                style={{ borderBottom: "1px solid var(--theme-border)" }}
              >
                {/* Number */}
                <span
                  className="w-6 text-center font-mono font-bold text-xs shrink-0"
                  style={{ color: "var(--theme-accent)", opacity: 0.5 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <p className="theme-text font-bold text-[15px] leading-tight">
                    {d.name}
                  </p>
                  <p className="theme-text-muted text-[11px] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {d.seats} {d.seats === 1 ? "constituency" : "constituencies"}
                  </p>
                </div>

                {/* Hot badge */}
                {d.hotSeats > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 shrink-0"
                    style={{
                      background: "rgba(255,165,0,0.12)",
                      color: "#fb923c",
                      border: "1px solid rgba(255,165,0,0.25)",
                    }}
                  >
                    <Flame className="w-2.5 h-2.5" />
                    {d.hotSeats}
                  </span>
                )}

                {/* Arrow */}
                <ChevronRight
                  className="w-4 h-4 shrink-0"
                  style={{ color: "var(--theme-accent)", opacity: 0.5 }}
                />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="theme-text-muted text-center text-[10px] mt-4 px-6">
          Tap a district to explore all constituencies and candidates
        </p>
      </section>
    </div>
  );
}
