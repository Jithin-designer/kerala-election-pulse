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
  AlertTriangle,
} from "lucide-react";
import type { Constituency, OtherCandidate, PartyCandidate } from "@/lib/data";
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

function formatAssets(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return value > 0 ? `₹${value}` : "";
}

/* ── Chip: small info tag ── */
function Chip({ icon, text, color }: { icon: React.ReactNode; text: string; color?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] ${color || "theme-text-muted"}`}
      style={!color ? { background: "var(--theme-border)" } : undefined}
    >
      {icon}
      {text}
    </span>
  );
}

/* ── Main alliance candidate row ── */
function CandidateRow({
  candidate,
  alliance,
  constituencyName,
}: {
  candidate: PartyCandidate;
  alliance: "ldf" | "udf" | "nda";
  constituencyName: string;
}) {
  const theme = ALLIANCE[alliance];
  const photo = getCandidatePhoto(candidate.candidate, constituencyName, theme.color);
  const fullParty = getPartyFullName(candidate.party);

  return (
    <div className="py-3.5 last:border-none" style={{ borderBottom: "1px solid var(--theme-border)" }}>
      <div className="flex gap-3.5">
        {/* Photo */}
        <div className={`w-16 h-16 rounded-full ring-[2.5px] ${theme.ring} shrink-0 overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt={candidate.candidate} className="w-full h-full object-cover" draggable={false} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="theme-text font-bold text-[15px] leading-tight truncate">
            {candidate.candidate}
            {candidate.age && (
              <span className="theme-text-muted font-normal text-xs ml-1.5">{candidate.age}y</span>
            )}
          </p>

          {/* Affiliation */}
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${theme.pill}`}>
              {theme.label}
            </span>
            <span className="theme-text-secondary text-[11px] truncate" style={{ opacity: 0.7 }}>
              {candidate.party}{fullParty !== candidate.party ? ` · ${fullParty}` : ""}
            </span>
          </div>

          {/* Detail chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {candidate.education && (
              <Chip icon={<GraduationCap className="w-2.5 h-2.5" />} text={candidate.education} />
            )}
            {candidate.profession && (
              <Chip icon={<Briefcase className="w-2.5 h-2.5" />} text={candidate.profession} />
            )}
            {candidate.assets_value > 0 && (
              <Chip icon={<IndianRupee className="w-2.5 h-2.5" />} text={formatAssets(candidate.assets_value)} />
            )}
            {candidate.criminal_cases > 0 && (
              <Chip
                icon={<AlertTriangle className="w-2.5 h-2.5" />}
                text={`${candidate.criminal_cases} case${candidate.criminal_cases > 1 ? "s" : ""}`}
                color="bg-red-500/10 text-red-400"
              />
            )}
          </div>
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
    <div className="flex items-start gap-3 py-2.5 last:border-none" style={{ borderBottom: "1px solid var(--theme-border)" }}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center theme-text-muted text-xs font-bold shrink-0 mt-0.5" style={{ background: "var(--theme-border)" }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="theme-text-secondary font-semibold text-xs truncate">
          {candidate.candidate}
          {candidate.age && <span className="theme-text-muted font-normal ml-1">{candidate.age}y</span>}
        </p>
        <p className="theme-text-muted text-[10px] truncate">{candidate.party}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {candidate.education && (
            <Chip icon={<GraduationCap className="w-2 h-2" />} text={candidate.education} />
          )}
          {candidate.assets_value > 0 && (
            <Chip icon={<IndianRupee className="w-2 h-2" />} text={formatAssets(candidate.assets_value)} />
          )}
          {candidate.criminal_cases > 0 && (
            <Chip
              icon={<AlertTriangle className="w-2 h-2" />}
              text={`${candidate.criminal_cases} case${candidate.criminal_cases > 1 ? "s" : ""}`}
              color="bg-red-500/10 text-red-400"
            />
          )}
        </div>
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

export default function BrowseCard({ constituency, isCelebrity, celebrityNote, index }: Props) {
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
      <div className="theme-card overflow-hidden">
        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="theme-text text-xl font-black leading-tight">
                  {constituency.name}
                </h3>
                {isCelebrity && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-500/30">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-300 text-[10px] font-bold tracking-wider">HOT</span>
                  </span>
                )}
              </div>
              <p className="theme-text-muted text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {constituency.district}
                {constituency.reserved && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px]" style={{ background: "var(--theme-border)", color: "var(--theme-accent)" }}>
                    {constituency.reserved}
                  </span>
                )}
                <span className="ml-auto theme-text-muted text-[10px]">{totalCandidates} candidates</span>
              </p>
            </div>
            <span className="text-3xl font-black font-mono ml-2 select-none" style={{ color: "var(--theme-accent)", opacity: 0.12 }}>
              {String(constituency.no).padStart(3, "0")}
            </span>
          </div>
          {celebrityNote && (
            <p className="text-[11px] italic pl-2 mt-2" style={{ color: "var(--theme-accent-light)", opacity: 0.6, borderLeft: "2px solid var(--theme-accent)" }}>
              {celebrityNote}
            </p>
          )}
        </div>

        {/* ── Main 3 candidates ── */}
        <div className="px-5">
          {(["ldf", "udf", "nda"] as const).map((a) => (
            <CandidateRow
              key={a}
              candidate={constituency[a]}
              alliance={a}
              constituencyName={constituency.name}
            />
          ))}
        </div>

        {/* ── Others ── */}
        {othersCount > 0 && (
          <div className="px-5 pt-2 pb-1">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3 h-3 theme-text-muted" />
              <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest">
                +{othersCount} Other{othersCount > 1 ? "s" : ""}
              </p>
            </div>
            {constituency.others.map((o, i) => (
              <OtherCandidateRow key={i} candidate={o} />
            ))}
          </div>
        )}

        {/* ── Share ── */}
        <div className="px-5 pb-4 pt-3">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full theme-text-muted text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
            style={{ background: "var(--theme-border)", border: "var(--theme-card-border)" }}
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
}
