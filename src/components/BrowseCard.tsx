"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Flame, Users, ChevronRight } from "lucide-react";
import type { Constituency, OtherCandidate, PartyCandidate } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";
import { getCandidatePhoto } from "@/lib/candidateImages";
import Tag from "./Tag";

const ALLIANCE = {
  ldf: { label: "LDF", color: "#dc2626", pill: "bg-red-500/90 text-white" },
  udf: { label: "UDF", color: "#2563eb", pill: "bg-blue-500/90 text-white" },
  nda: { label: "NDA", color: "#f59e0b", pill: "bg-amber-500/90 text-white" },
} as const;

function formatAssets(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return value > 0 ? `₹${value}` : "";
}

/* ── Main alliance candidate row ── */
function CandidateRow({
  candidate,
  alliance,
  constituencyName,
  isWinner,
}: {
  candidate: PartyCandidate;
  alliance: "ldf" | "udf" | "nda";
  constituencyName: string;
  isWinner?: boolean;
}) {
  const theme = ALLIANCE[alliance];
  const photo = getCandidatePhoto(candidate.candidate, constituencyName, theme.color);
  const fullParty = getPartyFullName(candidate.party);

  return (
    <div
      className="py-3.5 last:border-none"
      style={{ borderBottom: "1px solid var(--theme-border)" }}
    >
      <div className="flex gap-3.5">
        {/* Photo — no stroke/border */}
        <div className="w-16 h-16 rounded-full shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={candidate.candidate}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="theme-text font-bold text-[15px] leading-tight truncate">
              {candidate.candidate}
              {candidate.age && (
                <span className="theme-text-muted font-normal text-xs ml-1.5">
                  {candidate.age}y
                </span>
              )}
            </p>
            {isWinner && <Tag variant="winner" text="Winner" />}
          </div>

          {/* Affiliation */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${theme.pill}`}
            >
              {theme.label}
            </span>
            <span
              className="theme-text-secondary text-[11px] truncate"
              style={{ opacity: 0.7 }}
            >
              {candidate.party}
              {fullParty !== candidate.party ? ` · ${fullParty}` : ""}
            </span>
          </div>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {candidate.education && <Tag variant="education" text={candidate.education} />}
            {candidate.profession && <Tag variant="profession" text={candidate.profession} />}
            {candidate.assets_value > 0 && (
              <Tag variant="assets" text={formatAssets(candidate.assets_value)} />
            )}
            {candidate.criminal_cases > 0 && (
              <Tag
                variant="cases"
                text={`${candidate.criminal_cases} case${candidate.criminal_cases > 1 ? "s" : ""}`}
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
    <div
      className="flex items-start gap-3 py-2.5 last:border-none"
      style={{ borderBottom: "1px solid var(--theme-border)" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center theme-text-muted text-xs font-bold shrink-0 mt-0.5"
        style={{ background: "var(--theme-border)" }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="theme-text-secondary font-semibold text-xs truncate">
          {candidate.candidate}
          {candidate.age && (
            <span className="theme-text-muted font-normal ml-1">{candidate.age}y</span>
          )}
        </p>
        <p className="theme-text-muted text-[10px] truncate">{candidate.party}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {candidate.education && <Tag variant="education" text={candidate.education} />}
          {candidate.assets_value > 0 && (
            <Tag variant="assets" text={formatAssets(candidate.assets_value)} />
          )}
          {candidate.criminal_cases > 0 && (
            <Tag
              variant="cases"
              text={`${candidate.criminal_cases} case${candidate.criminal_cases > 1 ? "s" : ""}`}
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
  onOpenDetail?: (c: Constituency) => void;
}

export default function BrowseCard({
  constituency,
  isCelebrity,
  celebrityNote,
  index,
  onOpenDetail,
}: Props) {
  const [showOthers, setShowOthers] = useState(false);
  const othersCount = constituency.others?.length ?? 0;
  const totalCandidates = 3 + othersCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.03, 0.3),
        duration: 0.3,
        ease: "easeOut",
      }}
      className="w-full"
    >
      <div
        className="theme-card overflow-hidden cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
        onClick={() => onOpenDetail?.(constituency)}
      >
        {/* ═══════ Header — everything LEFT-aligned ═══════ */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="theme-text text-xl font-black leading-tight">
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

          {/* Constituency number + count grouped under name */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="font-mono font-black text-xs"
              style={{ color: "var(--theme-accent)", opacity: 0.5 }}
            >
              #{String(constituency.no).padStart(3, "0")}
            </span>
            <span className="theme-text-muted text-xs">·</span>
            <span className="theme-text-muted text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {constituency.district}
              {constituency.reserved && (
                <span
                  className="ml-1 px-1.5 py-0.5 rounded text-[9px]"
                  style={{
                    background: "var(--theme-border)",
                    color: "var(--theme-accent)",
                  }}
                >
                  {constituency.reserved}
                </span>
              )}
            </span>
            <span className="theme-text-muted text-xs">·</span>
            <span className="theme-text-muted text-xs">
              {totalCandidates} candidates
            </span>
          </div>

          {celebrityNote && (
            <p
              className="text-[11px] italic pl-2 mt-2"
              style={{
                color: "var(--theme-accent-light)",
                opacity: 0.6,
                borderLeft: "2px solid var(--theme-accent)",
              }}
            >
              {celebrityNote}
            </p>
          )}
        </div>

        {/* ═══════ Main 3 candidates ═══════ */}
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

        {/* ═══════ Bottom row: +X OTHERS + View More ═══════ */}
        <div className="px-5 pt-1 pb-4 flex items-center justify-between gap-3">
          {othersCount > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOthers(!showOthers);
              }}
              className="theme-text-muted text-[11px] font-semibold tracking-wider uppercase hover:underline cursor-pointer transition-opacity"
            >
              {showOthers ? (
                <span>− Hide {othersCount} other{othersCount > 1 ? "s" : ""}</span>
              ) : (
                <span>+ {othersCount} OTHER{othersCount > 1 ? "S" : ""}</span>
              )}
            </button>
          ) : (
            <span />
          )}

          {/* View More link → opens detail modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail?.(constituency);
            }}
            className="theme-text-muted text-[11px] font-semibold tracking-wider uppercase hover:underline cursor-pointer flex items-center gap-0.5"
            style={{ color: "var(--theme-accent)", opacity: 0.7 }}
          >
            VIEW MORE
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Expanded others list (inline) */}
        <AnimatePresence>
          {showOthers && othersCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3 h-3 theme-text-muted" />
                  <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest">
                    Other Candidates
                  </p>
                </div>
                {constituency.others.map((o, i) => (
                  <OtherCandidateRow key={i} candidate={o} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
