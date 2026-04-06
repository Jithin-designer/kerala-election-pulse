"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import type { Constituency } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";

interface Props {
  constituency: Constituency;
  isCelebrity?: boolean;
  celebrityNote?: string;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  stackIndex: number;
}

const allianceMeta = {
  ldf: {
    label: "LDF",
    color: "#dc2626",
    gradient: "from-red-600 to-red-800",
    ring: "ring-red-500/40",
    pill: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  udf: {
    label: "UDF",
    color: "#2563eb",
    gradient: "from-blue-600 to-blue-800",
    ring: "ring-blue-500/40",
    pill: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  nda: {
    label: "NDA",
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-700",
    ring: "ring-amber-500/40",
    pill: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
} as const;

function CandidateRow({
  name,
  party,
  alliance,
  expanded,
  onToggle,
}: {
  name: string;
  party: string;
  alliance: "ldf" | "udf" | "nda";
  expanded: boolean;
  onToggle: () => void;
}) {
  const meta = allianceMeta[alliance];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="w-full text-left"
    >
      <div
        className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
          expanded
            ? "bg-white/10 scale-[1.02] shadow-lg"
            : "bg-white/[0.04] hover:bg-white/[0.07]"
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white font-bold text-sm ring-2 ${meta.ring} shrink-0`}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-ivory font-semibold text-[15px] leading-tight truncate">
            {name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${meta.pill}`}
            >
              {meta.label}
            </span>
            <span className="text-ivory-dark/50 text-xs">{party}</span>
          </div>

          {/* Expanded info */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 pt-2 border-t border-white/10"
            >
              <p className="text-ivory-dark/60 text-xs">
                {getPartyFullName(party)}
              </p>
            </motion.div>
          )}
        </div>

        {/* Expand indicator */}
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          className="w-4 h-4 text-ivory-dark/30 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </div>
    </button>
  );
}

const SWIPE_THRESHOLD = 120;

export default function SwipeCard({
  constituency,
  isCelebrity,
  celebrityNote,
  onSwipe,
  isTop,
  stackIndex,
}: Props) {
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(
    null
  );

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  // Stack depth effect
  const scale = 1 - stackIndex * 0.05;
  const yOffset = stackIndex * 10;

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  }

  return (
    <motion.div
      className="absolute inset-0 touch-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: yOffset,
        zIndex: 50 - stackIndex,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      animate={
        isTop
          ? undefined
          : { scale, y: yOffset, transition: { duration: 0.3 } }
      }
      exit={{
        x: x.get() > 0 ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="h-full w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#111b14] to-[#0a1a0e] border border-white/10 shadow-2xl flex flex-col relative">
        {/* Swipe overlays */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute inset-0 bg-emerald-glow/10 rounded-3xl z-10 pointer-events-none flex items-center justify-center"
            >
              <div className="border-4 border-emerald-glow rounded-xl px-8 py-3 rotate-[-20deg]">
                <span className="text-emerald-glow text-4xl font-black tracking-wider">
                  SAVE
                </span>
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute inset-0 bg-red-500/10 rounded-3xl z-10 pointer-events-none flex items-center justify-center"
            >
              <div className="border-4 border-red-500 rounded-xl px-8 py-3 rotate-[20deg]">
                <span className="text-red-500 text-4xl font-black tracking-wider">
                  SKIP
                </span>
              </div>
            </motion.div>
          </>
        )}

        {/* Card header */}
        <div className="px-6 pt-6 pb-4">
          {/* Top row: number + hot badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-ivory-dark/20 text-4xl font-black font-mono">
              {String(constituency.no).padStart(3, "0")}
            </span>
            {isCelebrity && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-500/30 text-pink-300 text-[11px] font-bold tracking-wider animate-pulse">
                HOT SEAT
              </span>
            )}
          </div>

          {/* Constituency name */}
          <h2 className="text-3xl font-black text-ivory leading-tight mb-1">
            {constituency.name}
          </h2>
          <p className="text-ivory-dark/40 text-sm flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {constituency.district} District
            {constituency.reserved && (
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-gold/10 text-gold-light border border-gold/20">
                {constituency.reserved}
              </span>
            )}
          </p>

          {/* Celebrity note */}
          {celebrityNote && (
            <p className="mt-3 text-gold-light/70 text-xs italic border-l-2 border-gold/40 pl-3 py-1 bg-gold/5 rounded-r-lg">
              {celebrityNote}
            </p>
          )}
        </div>

        {/* Alliance color bar */}
        <div className="flex h-1 mx-6 rounded-full overflow-hidden">
          <div className="flex-1 bg-red-500" />
          <div className="flex-1 bg-blue-500" />
          <div className="flex-1 bg-amber-500" />
        </div>

        {/* Candidates — scrollable area */}
        <div className="flex-1 px-5 py-4 space-y-2 overflow-y-auto">
          <p className="text-center text-ivory-dark/25 text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
            The Contenders
          </p>

          {(["ldf", "udf", "nda"] as const).map((alliance) => (
            <CandidateRow
              key={alliance}
              name={constituency[alliance].candidate}
              party={constituency[alliance].party}
              alliance={alliance}
              expanded={expandedCandidate === alliance}
              onToggle={() =>
                setExpandedCandidate(
                  expandedCandidate === alliance ? null : alliance
                )
              }
            />
          ))}
        </div>

        {/* Bottom hint */}
        {isTop && (
          <div className="px-6 pb-5 pt-2 flex items-center justify-between text-ivory-dark/20 text-xs">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Skip
            </span>
            <span className="text-ivory-dark/15">Swipe or tap candidates</span>
            <span className="flex items-center gap-1">
              Save
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
