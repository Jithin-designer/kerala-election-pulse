"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  Share2,
  Flame,
  Users,
} from "lucide-react";
import type { Constituency, OtherCandidate } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";
import { getCandidatePhoto } from "@/lib/candidateImages";

const ALLIANCE = {
  ldf: {
    label: "LDF",
    color: "#dc2626",
    gradient: "from-red-600 to-red-800",
    pill: "bg-red-500/90 text-white",
    ring: "ring-red-500/40",
    bar: "bg-red-500",
  },
  udf: {
    label: "UDF",
    color: "#2563eb",
    gradient: "from-blue-600 to-blue-800",
    pill: "bg-blue-500/90 text-white",
    ring: "ring-blue-500/40",
    bar: "bg-blue-500",
  },
  nda: {
    label: "NDA",
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-700",
    pill: "bg-amber-500/90 text-white",
    ring: "ring-amber-500/40",
    bar: "bg-amber-500",
  },
} as const;

/* ── Main alliance candidate row with photo ── */
function CandidateRow({
  name,
  party,
  alliance,
  constituencyName,
  isExpanded,
}: {
  name: string;
  party: string;
  alliance: "ldf" | "udf" | "nda";
  constituencyName: string;
  isExpanded: boolean;
}) {
  const theme = ALLIANCE[alliance];
  const photo = getCandidatePhoto(name, constituencyName, theme.color);

  return (
    <div className="flex items-center gap-3.5 py-3 border-b border-white/[0.04] last:border-none">
      {/* Photo circle */}
      <div className={`w-14 h-14 rounded-full ring-[2.5px] ${theme.ring} shrink-0 overflow-hidden`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-[15px] leading-tight truncate">
          {name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${theme.pill}`}>
            {theme.label}
          </span>
          <span className="text-white/40 text-xs">{party}</span>
        </div>

        {/* Expanded: full party name */}
        <AnimatePresence>
          {isExpanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-white/25 text-[11px] mt-1.5 overflow-hidden"
            >
              {getPartyFullName(party)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── "Others" candidate row (no alliance, simpler) ── */
function OtherCandidateRow({ candidate }: { candidate: OtherCandidate }) {
  const initials = candidate.candidate
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/[0.03] last:border-none">
      <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center text-white/40 text-xs font-bold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/60 font-semibold text-xs truncate">
          {candidate.candidate}
        </p>
        <p className="text-white/25 text-[10px] truncate">{candidate.party}</p>
      </div>
      {candidate.criminal_cases > 0 && (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/20 shrink-0">
          {candidate.criminal_cases} case{candidate.criminal_cases > 1 ? "s" : ""}
        </span>
      )}
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

  const othersCount = constituency.others?.length ?? 0;
  const totalCandidates = 3 + othersCount;

  function handleShare() {
    const text = `${constituency.name} (${constituency.district}) — Kerala Election 2026\n\nLDF: ${constituency.ldf.candidate} (${constituency.ldf.party})\nUDF: ${constituency.udf.candidate} (${constituency.udf.party})\nNDA: ${constituency.nda.candidate} (${constituency.nda.party})${othersCount > 0 ? `\n+${othersCount} others` : ""}\n\n#KeralaElection2026`;
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
      <div className="h-full rounded-[24px] overflow-hidden bg-gradient-to-b from-[#111b14] to-[#0a0a0a] border border-white/[0.08] shadow-xl flex flex-col">
        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between mb-1">
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
              <p className="text-white/30 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {constituency.district}
                {constituency.reserved && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-gold/10 text-gold-light border border-gold/20">
                    {constituency.reserved}
                  </span>
                )}
              </p>
            </div>
            <span className="text-gold/15 text-3xl font-black font-mono ml-2">
              {String(constituency.no).padStart(3, "0")}
            </span>
          </div>

          {celebrityNote && (
            <p className="text-gold-light/50 text-[11px] italic border-l-2 border-gold/30 pl-2 mt-2">
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

        {/* ── Contenders label ── */}
        <p className="text-white/15 text-[9px] font-bold uppercase tracking-[0.25em] text-center mt-3 mb-0">
          Contenders
        </p>

        {/* ── Main 3 candidates with photos ── */}
        <div className="px-5 flex-1">
          {(["ldf", "udf", "nda"] as const).map((a) => (
            <CandidateRow
              key={a}
              name={constituency[a].candidate}
              party={constituency[a].party}
              alliance={a}
              constituencyName={constituency.name}
              isExpanded={expanded}
            />
          ))}
        </div>

        {/* ── Others section (expanded) ── */}
        <AnimatePresence>
          {expanded && othersCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pt-2 pb-1">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-3 h-3 text-white/20" />
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                    +{othersCount} Other Candidate{othersCount > 1 ? "s" : ""}
                  </p>
                </div>
                {constituency.others.map((o, i) => (
                  <OtherCandidateRow key={i} candidate={o} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom actions ── */}
        <div className="px-5 pb-4 pt-3 flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-xs font-semibold hover:bg-white/10 hover:text-white/70 transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-gold/10 border border-gold/20 text-gold-light text-xs font-semibold hover:bg-gold/15 transition-all active:scale-95"
          >
            {expanded ? (
              <>
                Less <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                More Info
                {othersCount > 0 && (
                  <span className="text-gold/40 text-[10px]">+{othersCount}</span>
                )}
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
