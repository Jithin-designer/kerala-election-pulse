"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  Share2,
  Flame,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import type { Constituency } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";

const ALLIANCE = {
  ldf: {
    label: "LDF",
    color: "#dc2626",
    gradient: "from-red-600 to-red-800",
    pill: "bg-red-500/90 text-white",
    pillSubtle: "bg-red-500/15 text-red-300 border border-red-500/20",
    ring: "ring-red-400/50",
    bar: "bg-red-500",
  },
  udf: {
    label: "UDF",
    color: "#2563eb",
    gradient: "from-blue-600 to-blue-800",
    pill: "bg-blue-500/90 text-white",
    pillSubtle: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
    ring: "ring-blue-400/50",
    bar: "bg-blue-500",
  },
  nda: {
    label: "NDA",
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-700",
    pill: "bg-amber-500/90 text-white",
    pillSubtle: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
    ring: "ring-amber-400/50",
    bar: "bg-amber-500",
  },
} as const;

function avatarUrl(name: string, bgHex: string) {
  const bg = bgHex.replace("#", "");
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=${bg}&color=fff&bold=true&format=png`;
}

function CandidateRow({
  name,
  party,
  alliance,
  isExpanded,
}: {
  name: string;
  party: string;
  alliance: "ldf" | "udf" | "nda";
  isExpanded: boolean;
}) {
  const theme = ALLIANCE[alliance];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* Avatar */}
      <div
        className={`w-11 h-11 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold text-sm ring-2 ${theme.ring} shrink-0`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-tight truncate">
          {name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${theme.pillSubtle}`}>
            {theme.label}
          </span>
          <span className="text-white/40 text-xs truncate">{party}</span>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-white/30 text-[11px] mt-1.5 pt-1.5 border-t border-white/5">
                {getPartyFullName(party)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface Props {
  constituency: Constituency;
  isCelebrity?: boolean;
  celebrityNote?: string;
  index: number;
}

export default function BrowseCard({
  constituency,
  isCelebrity,
  celebrityNote,
  index,
}: Props) {
  const [expanded, setExpanded] = useState(false);

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      className="w-[82vw] sm:w-[340px] shrink-0 snap-start"
    >
      <div className="h-full rounded-[24px] overflow-hidden bg-gradient-to-b from-[#111b14] to-[#0a0a0a] border border-white/8 shadow-xl flex flex-col">
        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white text-xl font-black leading-tight">
                  {constituency.name}
                </h3>
                {isCelebrity && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-500/30">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-300 text-[10px] font-bold tracking-wider">
                      HOT
                    </span>
                  </span>
                )}
              </div>
              <p className="text-white/35 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {constituency.district}
                {constituency.reserved && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-gold/10 text-gold-light border border-gold/20">
                    {constituency.reserved}
                  </span>
                )}
              </p>
            </div>
            <span className="text-white/10 text-2xl font-black font-mono ml-2">
              {String(constituency.no).padStart(3, "0")}
            </span>
          </div>

          {celebrityNote && (
            <p className="text-gold-light/50 text-[11px] italic border-l-2 border-gold/30 pl-2 mt-1 mb-1">
              {celebrityNote}
            </p>
          )}
        </div>

        {/* ── Alliance bar ── */}
        <div className="flex h-1 mx-5 rounded-full overflow-hidden">
          <div className={`flex-1 ${ALLIANCE.ldf.bar}`} />
          <div className={`flex-1 ${ALLIANCE.udf.bar}`} />
          <div className={`flex-1 ${ALLIANCE.nda.bar}`} />
        </div>

        {/* ── Candidates ── */}
        <div className="px-5 pt-2 pb-1 flex-1">
          <p className="text-white/15 text-[9px] font-bold uppercase tracking-[0.2em] text-center mb-1">
            Contenders
          </p>
          {(["ldf", "udf", "nda"] as const).map((a) => (
            <CandidateRow
              key={a}
              name={constituency[a].candidate}
              party={constituency[a].party}
              alliance={a}
              isExpanded={expanded}
            />
          ))}
        </div>

        {/* ── Bottom actions ── */}
        <div className="px-5 pb-4 pt-2 flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs font-semibold hover:bg-white/10 hover:text-white/80 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-gold/10 border border-gold/20 text-gold-light text-xs font-semibold hover:bg-gold/15 transition-all"
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
    </motion.div>
  );
}
