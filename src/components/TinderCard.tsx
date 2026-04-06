"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Share2,
  Flame,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Users,
} from "lucide-react";
import type { Constituency } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";
import { getCandidatePhoto } from "@/lib/candidateImages";

const ALLIANCE = {
  ldf: {
    label: "LDF",
    color: "#dc2626",
    gradient: "from-red-600 to-red-800",
    border: "border-red-500",
    pill: "bg-red-500 text-white",
    pillSubtle: "bg-red-500/15 text-red-300 border-red-500/25",
    text: "text-red-400",
    bg: "bg-red-500",
  },
  udf: {
    label: "UDF",
    color: "#2563eb",
    gradient: "from-blue-600 to-blue-800",
    border: "border-blue-500",
    pill: "bg-blue-500 text-white",
    pillSubtle: "bg-blue-500/15 text-blue-300 border-blue-500/25",
    text: "text-blue-400",
    bg: "bg-blue-500",
  },
  nda: {
    label: "NDA",
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-700",
    border: "border-amber-500",
    pill: "bg-amber-500 text-white",
    pillSubtle: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    text: "text-amber-400",
    bg: "bg-amber-500",
  },
} as const;

interface Props {
  constituency: Constituency;
  isCelebrity?: boolean;
  celebrityNote?: string;
  index: number;
}

export default function TinderCard({
  constituency,
  isCelebrity,
  celebrityNote,
  index,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState<"ldf" | "udf" | "nda" | null>(null);

  const alliances = ["ldf", "udf", "nda"] as const;

  function handleShare() {
    const text = `${constituency.name} (${constituency.district}) — Kerala Election 2026\n\nLDF: ${constituency.ldf.candidate} (${constituency.ldf.party})\nUDF: ${constituency.udf.candidate} (${constituency.udf.party})\nNDA: ${constituency.nda.candidate} (${constituency.nda.party})\n\n#KeralaElection2026`;
    if (navigator.share) {
      navigator.share({ title: `${constituency.name} — Kerala 2026`, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="w-[85vw] sm:w-[360px] shrink-0 snap-start"
    >
      <div className="rounded-[28px] overflow-hidden bg-black border border-white/[0.08] shadow-2xl flex flex-col">
        {/* ═══════ TRIPLE PHOTO HERO ═══════ */}
        <div className="relative">
          {/* Three photos side by side */}
          <div className="flex h-[280px] sm:h-[320px]">
            {alliances.map((alliance) => {
              const candidate = constituency[alliance];
              const theme = ALLIANCE[alliance];
              const photo = getCandidatePhoto(
                candidate.candidate,
                constituency.name,
                theme.color
              );
              const isActive = activeCandidate === alliance;

              return (
                <button
                  key={alliance}
                  onClick={() =>
                    setActiveCandidate(isActive ? null : alliance)
                  }
                  className={`relative flex-1 overflow-hidden transition-all duration-300 ${
                    activeCandidate && !isActive ? "opacity-40 scale-[0.97]" : ""
                  } ${isActive ? "flex-[1.6]" : ""}`}
                >
                  {/* Photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={candidate.candidate}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Alliance color top strip */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${theme.bg}`} />

                  {/* Bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Alliance badge */}
                  <span
                    className={`absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider shadow-lg ${theme.pill}`}
                  >
                    {theme.label}
                  </span>

                  {/* Name at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 text-center">
                    <p className="text-white font-bold text-[12px] sm:text-[13px] leading-tight line-clamp-2 drop-shadow-lg">
                      {candidate.candidate}
                    </p>
                    <p className="text-white/50 text-[10px] mt-0.5">
                      {candidate.party}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Constituency overlay — top left */}
          <div className="absolute top-3 left-3 z-10">
            {isCelebrity && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-orange-500/30 mb-1.5">
                <Flame className="w-3 h-3 text-orange-400" />
                <span className="text-orange-300 text-[9px] font-bold tracking-wider">
                  HOT SEAT
                </span>
              </span>
            )}
          </div>

          {/* Constituency number — top right */}
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/50 text-[11px] font-bold font-mono border border-white/10">
            #{constituency.no}
          </span>
        </div>

        {/* ═══════ INFO SECTION ═══════ */}
        <div className="px-5 pt-4 pb-2">
          {/* Constituency name */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-white text-[22px] font-black leading-tight">
                {constituency.name}
              </h3>
              <p className="text-white/30 text-sm flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {constituency.district} District
                {constituency.reserved && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-gold/10 text-gold-light border border-gold/20">
                    {constituency.reserved}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Celebrity note */}
          {celebrityNote && (
            <p className="text-gold-light/50 text-[11px] italic border-l-2 border-gold/30 pl-2 mt-2">
              {celebrityNote}
            </p>
          )}
        </div>

        {/* ═══════ ACTIVE CANDIDATE DETAIL (tap a photo to expand) ═══════ */}
        <AnimatePresence>
          {activeCandidate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {(() => {
                const c = constituency[activeCandidate];
                const theme = ALLIANCE[activeCandidate];
                return (
                  <div className="px-5 pb-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {c.candidate.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            {c.candidate}
                          </p>
                          <p className={`text-xs ${theme.text}`}>
                            {c.party} · {theme.label}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 text-[10px]">
                          <GraduationCap className="w-3 h-3" />
                          {getPartyFullName(c.party)}
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] text-white/40 text-[10px]">
                          <Users className="w-3 h-3" />
                          {theme.label} Front
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ EXPAND ALL / ACTIONS ═══════ */}
        <div className="px-5 pb-4 pt-1">
          {/* Expand for all 3 candidates detail */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="space-y-2">
                  {alliances.map((a) => {
                    const c = constituency[a];
                    const theme = ALLIANCE[a];
                    return (
                      <div
                        key={a}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                      >
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                        >
                          {c.candidate
                            .split(" ")
                            .map((w) => w[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-xs truncate">
                            {c.candidate}
                          </p>
                          <p className="text-white/30 text-[10px] truncate">
                            {c.party} · {getPartyFullName(c.party)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${theme.pillSubtle}`}
                        >
                          {theme.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-xs font-semibold hover:bg-white/10 hover:text-white/70 transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button
              onClick={() => {
                setExpanded(!expanded);
                setActiveCandidate(null);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-gold/10 border border-gold/20 text-gold-light text-xs font-semibold hover:bg-gold/15 transition-all active:scale-95"
            >
              {expanded ? (
                <>
                  Less <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  More Info <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
