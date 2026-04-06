"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Share2,
  Flame,
  Users,
  GraduationCap,
  IndianRupee,
  Briefcase,
} from "lucide-react";
import type { Constituency, OtherCandidate } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";
import { getCandidatePhoto } from "@/lib/candidateImages";

const ALLIANCE = {
  ldf: {
    label: "LDF",
    color: "#dc2626",
    pill: "bg-red-500/90 text-white",
    ring: "ring-red-500/50",
  },
  udf: {
    label: "UDF",
    color: "#2563eb",
    pill: "bg-blue-500/90 text-white",
    ring: "ring-blue-500/50",
  },
  nda: {
    label: "NDA",
    color: "#f59e0b",
    pill: "bg-amber-500/90 text-white",
    ring: "ring-amber-500/50",
  },
} as const;

/* ── Main candidate row: photo + name + party + age/education/assets ── */
function CandidateRow({
  name,
  party,
  alliance,
  constituencyName,
}: {
  name: string;
  party: string;
  alliance: "ldf" | "udf" | "nda";
  constituencyName: string;
}) {
  const theme = ALLIANCE[alliance];
  const photo = getCandidatePhoto(name, constituencyName, theme.color);
  const fullParty = getPartyFullName(party);

  return (
    <div className="flex gap-3.5 py-3.5 border-b border-white/[0.04] last:border-none">
      {/* Photo */}
      <div className={`w-16 h-16 rounded-full ring-[2.5px] ${theme.ring} shrink-0 overflow-hidden`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-[15px] leading-tight truncate">
          {name}
        </p>

        {/* Affiliation */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${theme.pill}`}>
            {theme.label}
          </span>
          <span className="text-white/50 text-[11px] truncate">
            {party}{fullParty !== party ? ` · ${fullParty}` : ""}
          </span>
        </div>

        {/* Detail chips: education, assets */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] text-white/35 text-[10px]">
            <Briefcase className="w-2.5 h-2.5" />
            Political Leader
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Other candidate row ── */
function OtherCandidateRow({ candidate }: { candidate: OtherCandidate }) {
  const initials = candidate.candidate
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.03] last:border-none">
      <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-white/30 text-xs font-bold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/60 font-semibold text-xs truncate">
          {candidate.candidate}
        </p>
        <p className="text-white/25 text-[10px] truncate">{candidate.party}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {candidate.education && (
          <span className="flex items-center gap-0.5 text-white/20 text-[9px]">
            <GraduationCap className="w-2.5 h-2.5" />
            {candidate.education.length > 12
              ? candidate.education.slice(0, 12) + "…"
              : candidate.education}
          </span>
        )}
        {candidate.assets && (
          <span className="flex items-center gap-0.5 text-white/20 text-[9px]">
            <IndianRupee className="w-2.5 h-2.5" />
            {candidate.assets}
          </span>
        )}
        {candidate.criminal_cases > 0 && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">
            {candidate.criminal_cases} case{candidate.criminal_cases > 1 ? "s" : ""}
          </span>
        )}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <div className="rounded-[20px] overflow-hidden bg-gradient-to-b from-[#111b14] to-[#0a0a0a] border border-white/[0.08] shadow-xl">
        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start justify-between">
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
                {constituency.district} District
                {constituency.reserved && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-gold/10 text-gold-light border border-gold/20">
                    {constituency.reserved}
                  </span>
                )}
                <span className="ml-auto text-white/15 text-[10px]">
                  {totalCandidates} candidates
                </span>
              </p>
            </div>
            <span className="text-gold/12 text-3xl font-black font-mono ml-2 select-none">
              {String(constituency.no).padStart(3, "0")}
            </span>
          </div>

          {celebrityNote && (
            <p className="text-gold-light/50 text-[11px] italic border-l-2 border-gold/30 pl-2 mt-2">
              {celebrityNote}
            </p>
          )}
        </div>

        {/* ── Main 3 candidates (always expanded) ── */}
        <div className="px-5">
          {(["ldf", "udf", "nda"] as const).map((a) => (
            <CandidateRow
              key={a}
              name={constituency[a].candidate}
              party={constituency[a].party}
              alliance={a}
              constituencyName={constituency.name}
            />
          ))}
        </div>

        {/* ── Others section (always visible if present) ── */}
        {othersCount > 0 && (
          <div className="px-5 pt-2 pb-1">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3 h-3 text-white/15" />
              <p className="text-white/15 text-[10px] font-bold uppercase tracking-widest">
                +{othersCount} Other{othersCount > 1 ? "s" : ""}
              </p>
            </div>
            {constituency.others.map((o, i) => (
              <OtherCandidateRow key={i} candidate={o} />
            ))}
          </div>
        )}

        {/* ── Share button ── */}
        <div className="px-5 pb-4 pt-3">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs font-semibold hover:bg-white/[0.08] hover:text-white/60 transition-all active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Constituency
          </button>
        </div>
      </div>
    </motion.div>
  );
}
