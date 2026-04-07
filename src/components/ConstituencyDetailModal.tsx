"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Share2,
  Flame,
  Users,
  Vote,
  TrendingUp,
} from "lucide-react";
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

/* ── Detailed candidate card ── */
function DetailedCandidate({
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
    <div
      className="p-4 rounded-2xl"
      style={{
        background: "var(--theme-border)",
        border: "var(--theme-card-border)",
      }}
    >
      <div className="flex gap-4">
        {/* Larger photo */}
        <div className="w-20 h-20 rounded-2xl shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={candidate.candidate}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + age */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="theme-text font-bold text-base leading-tight">
              {candidate.candidate}
            </h4>
            {candidate.age && (
              <span className="theme-text-muted text-xs font-normal">
                {candidate.age} years
              </span>
            )}
          </div>

          {/* Alliance pill */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${theme.pill}`}
            >
              {theme.label}
            </span>
            <span
              className="theme-text-secondary text-[11px]"
              style={{ opacity: 0.8 }}
            >
              {candidate.party}
              {fullParty !== candidate.party ? ` · ${fullParty}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed info grid */}
      <div className="mt-3 pt-3 grid grid-cols-2 gap-2" style={{ borderTop: "1px solid var(--theme-border)" }}>
        {candidate.education && (
          <div>
            <p className="theme-text-muted text-[9px] uppercase font-bold tracking-wider mb-0.5">Education</p>
            <p className="theme-text-secondary text-xs font-medium">{candidate.education}</p>
          </div>
        )}
        {candidate.profession && (
          <div>
            <p className="theme-text-muted text-[9px] uppercase font-bold tracking-wider mb-0.5">Profession</p>
            <p className="theme-text-secondary text-xs font-medium truncate">{candidate.profession}</p>
          </div>
        )}
        {candidate.assets_value > 0 && (
          <div>
            <p className="theme-text-muted text-[9px] uppercase font-bold tracking-wider mb-0.5">Net Worth</p>
            <p className="theme-text-secondary text-xs font-medium" style={{ color: "var(--theme-accent)" }}>
              {formatAssets(candidate.assets_value)}
            </p>
          </div>
        )}
        {candidate.criminal_cases > 0 && (
          <div>
            <p className="theme-text-muted text-[9px] uppercase font-bold tracking-wider mb-0.5">Criminal Cases</p>
            <p className="text-xs font-bold" style={{ color: "#dc2626" }}>
              {candidate.criminal_cases} pending
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Compact other-candidate row ── */
function OtherCandidateDetail({ candidate }: { candidate: OtherCandidate }) {
  const initials = candidate.candidate
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <div
      className="flex items-start gap-3 py-3"
      style={{ borderBottom: "1px solid var(--theme-border)" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center theme-text-muted text-xs font-bold shrink-0"
        style={{ background: "var(--theme-border)" }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="theme-text-secondary font-semibold text-sm truncate">
          {candidate.candidate}
          {candidate.age && (
            <span className="theme-text-muted font-normal text-xs ml-1.5">
              {candidate.age}y
            </span>
          )}
        </p>
        <p className="theme-text-muted text-[11px] truncate">{candidate.party}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
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
  constituency: Constituency | null;
  isCelebrity?: boolean;
  celebrityNote?: string;
  onClose: () => void;
}

export default function ConstituencyDetailModal({
  constituency,
  isCelebrity,
  celebrityNote,
  onClose,
}: Props) {
  // Lock body scroll when open
  useEffect(() => {
    if (constituency) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [constituency]);

  // ESC key to close
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!constituency) return null;

  const othersCount = constituency.others?.length ?? 0;
  const totalCandidates = 3 + othersCount;

  function handleShare() {
    if (!constituency) return;
    const text = `${constituency.name} (${constituency.district}) — Kerala Election 2026\n\nLDF: ${constituency.ldf.candidate} (${constituency.ldf.party})\nUDF: ${constituency.udf.candidate} (${constituency.udf.party})\nNDA: ${constituency.nda.candidate} (${constituency.nda.party})${othersCount > 0 ? `\n+${othersCount} other candidates` : ""}\n\n#KeralaElection2026`;
    if (navigator.share) {
      navigator.share({ title: `${constituency.name} — Kerala 2026`, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }

  return (
    <AnimatePresence>
      {constituency && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
          />

          {/* Modal sheet */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[201] sm:p-6"
          >
            <div
              className="theme-card overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] sm:max-w-2xl sm:w-full sm:rounded-3xl rounded-t-3xl rounded-b-none sm:rounded-b-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Sticky Header ── */}
              <div
                className="sticky top-0 z-10 px-5 pt-5 pb-4 backdrop-blur-xl"
                style={{
                  background: "color-mix(in srgb, var(--theme-surface) 95%, transparent)",
                  borderBottom: "1px solid var(--theme-border)",
                }}
              >
                {/* Drag handle (mobile) */}
                <div
                  className="w-10 h-1 rounded-full mx-auto mb-3 sm:hidden"
                  style={{ background: "var(--theme-border)" }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="theme-text text-2xl font-black leading-tight">
                        {constituency.name}
                      </h2>
                      {isCelebrity && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-500/30">
                          <Flame className="w-3 h-3 text-orange-400" />
                          <span className="text-orange-300 text-[10px] font-bold tracking-wider">
                            HOT
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className="font-mono font-black text-xs"
                        style={{ color: "var(--theme-accent)", opacity: 0.6 }}
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
                      <span className="theme-text-muted text-xs flex items-center gap-1">
                        <Vote className="w-3 h-3" />
                        {totalCandidates} candidates
                      </span>
                    </div>

                    {celebrityNote && (
                      <p
                        className="text-xs italic pl-2 mt-2"
                        style={{
                          color: "var(--theme-accent-light)",
                          opacity: 0.7,
                          borderLeft: "2px solid var(--theme-accent)",
                        }}
                      >
                        {celebrityNote}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    style={{
                      background: "var(--theme-border)",
                      color: "var(--theme-text-secondary)",
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Scrollable body ── */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                {/* Section: Main contenders */}
                <div>
                  <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    Main Contenders
                  </p>
                  <div className="space-y-2.5">
                    {(["ldf", "udf", "nda"] as const).map((a) => (
                      <DetailedCandidate
                        key={a}
                        candidate={constituency[a]}
                        alliance={a}
                        constituencyName={constituency.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Section: Other candidates */}
                {othersCount > 0 && (
                  <div className="pt-3">
                    <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      Other Candidates ({othersCount})
                    </p>
                    {constituency.others.map((o, i) => (
                      <OtherCandidateDetail key={i} candidate={o} />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Sticky Footer with Share ── */}
              <div
                className="px-5 py-4"
                style={{
                  borderTop: "1px solid var(--theme-border)",
                  background: "var(--theme-surface)",
                }}
              >
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  style={{
                    background: "var(--theme-accent)",
                    color: "var(--theme-accent-contrast)",
                  }}
                >
                  <Share2 className="w-4 h-4" />
                  Share This Constituency
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
