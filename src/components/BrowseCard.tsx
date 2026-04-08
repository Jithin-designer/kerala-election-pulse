"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Flame, Users, Share2 } from "lucide-react";
import type { Constituency, OtherCandidate, PartyCandidate } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";
import { getCandidatePhoto } from "@/lib/candidateImages";
import Tag from "./Tag";
import type { DetailCandidate } from "./CandidateDetailModal";

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
  constituencyNo,
  district,
  isWinner,
  onClick,
}: {
  candidate: PartyCandidate;
  alliance: "ldf" | "udf" | "nda";
  constituencyName: string;
  constituencyNo: number;
  district: string;
  isWinner?: boolean;
  onClick?: (c: DetailCandidate) => void;
}) {
  const theme = ALLIANCE[alliance];
  const photo = getCandidatePhoto(candidate.candidate, constituencyName, theme.color);
  const fullParty = getPartyFullName(candidate.party);

  function handleClick() {
    onClick?.({
      name: candidate.candidate,
      party: candidate.party,
      alliance,
      constituency: constituencyName,
      constituencyNo,
      district,
      age: candidate.age,
      education: candidate.education,
      profession: candidate.profession,
      assets: candidate.assets,
      assets_value: candidate.assets_value,
      criminal_cases: candidate.criminal_cases,
    });
  }

  return (
    <button
      onClick={handleClick}
      className="w-full py-2.5 last:border-none text-left cursor-pointer transition-colors hover:opacity-90"
      style={{ borderBottom: "1px solid var(--theme-border)" }}
    >
      <div className="flex gap-3 items-start">
        {/* Photo — WhatsApp-sized 48px */}
        <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden">
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
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="theme-text font-bold text-[15px] leading-tight truncate">
              {candidate.candidate}
              {candidate.age && (
                <span className="theme-text-muted font-semibold text-[12px] ml-1.5">
                  {candidate.age}y
                </span>
              )}
            </p>
            {isWinner && <Tag variant="winner" text="Winner" />}
          </div>

          {/* Affiliation */}
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${theme.pill}`}
            >
              {theme.label}
            </span>
            <span
              className="text-[12px] font-semibold truncate"
              style={{ color: "var(--theme-text-secondary)" }}
            >
              {candidate.party}
            </span>
          </div>

          {/* Tag chips */}
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
    </button>
  );
}

/* ── Other candidate row ── */
function OtherCandidateRow({
  candidate,
  constituencyName,
  constituencyNo,
  district,
  onClick,
}: {
  candidate: OtherCandidate;
  constituencyName: string;
  constituencyNo: number;
  district: string;
  onClick?: (c: DetailCandidate) => void;
}) {
  const initials = candidate.candidate
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  function handleClick() {
    onClick?.({
      name: candidate.candidate,
      party: candidate.party,
      alliance: "oth",
      constituency: constituencyName,
      constituencyNo,
      district,
      age: candidate.age,
      education: candidate.education,
      profession: candidate.profession,
      assets: candidate.assets,
      assets_value: candidate.assets_value,
      criminal_cases: candidate.criminal_cases,
    });
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-start gap-3 py-2.5 last:border-none text-left cursor-pointer transition-colors hover:opacity-90"
      style={{ borderBottom: "1px solid var(--theme-border)" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center theme-text-muted text-xs font-bold shrink-0 mt-0.5"
        style={{ background: "var(--theme-fill)" }}
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
    </button>
  );
}

interface Props {
  constituency: Constituency;
  isCelebrity?: boolean;
  celebrityNote?: string;
  index: number;
  onCandidateClick?: (c: DetailCandidate) => void;
  onShare?: (c: Constituency) => void;
}

export default function BrowseCard({
  constituency,
  isCelebrity,
  celebrityNote,
  index,
  onCandidateClick,
  onShare,
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
        className="theme-card overflow-hidden"
        style={{
          borderRadius: "var(--theme-card-radius, 12px)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* ═══════ Header — name LEFT, share button TOP-RIGHT ═══════ */}
        <div className="px-4 pt-3 pb-2 flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="theme-text text-[17px] font-black leading-tight tracking-tight">
                {constituency.name}
              </h3>
              {isCelebrity && (
                <span className="flex items-center gap-0.5 px-1.5 py-px rounded bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-500/30">
                  <Flame className="w-2.5 h-2.5 text-orange-400" />
                  <span className="text-orange-300 text-[10px] font-bold tracking-wider">
                    HOT
                  </span>
                </span>
              )}
            </div>

            {/* Constituency number + count grouped under name */}
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span
                className="font-mono font-bold text-[12px]"
                style={{ color: "var(--theme-accent)" }}
              >
                #{String(constituency.no).padStart(3, "0")}
              </span>
              <span className="theme-text-muted text-[12px] font-semibold">·</span>
              <span className="text-[12px] font-semibold flex items-center gap-0.5" style={{ color: "var(--theme-text-secondary)" }}>
                <MapPin className="w-3 h-3" />
                {constituency.district}
                {constituency.reserved && (
                  <span
                    className="ml-1 px-1.5 py-px rounded text-[10px] font-bold"
                    style={{
                      background: "var(--theme-fill)",
                      color: "var(--theme-accent)",
                    }}
                  >
                    {constituency.reserved}
                  </span>
                )}
              </span>
              <span className="theme-text-muted text-[12px] font-semibold">·</span>
              <span className="text-[12px] font-semibold" style={{ color: "var(--theme-text-secondary)" }}>
                {totalCandidates} candidates
              </span>
            </div>

            {celebrityNote && (
              <p
                className="text-[11px] italic pl-2 mt-1.5"
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

          {/* Share button — top right, tightly aligned */}
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(constituency);
              }}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 -mt-0.5 -mr-1"
              style={{
                background: "var(--theme-fill)",
                color: "var(--theme-accent)",
              }}
              aria-label={`Share ${constituency.name}`}
              title={`Share ${constituency.name}`}
            >
              <Share2 className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>

        {/* ═══════ Main 3 candidates ═══════ */}
        <div className="px-4">
          {(["ldf", "udf", "nda"] as const).map((a) => (
            <CandidateRow
              key={a}
              candidate={constituency[a]}
              alliance={a}
              constituencyName={constituency.name}
              constituencyNo={constituency.no}
              district={constituency.district}
              onClick={onCandidateClick}
            />
          ))}
        </div>

        {/* ═══════ +X OTHERS toggle ═══════ */}
        {othersCount > 0 && (
          <div className="px-4 pt-1 pb-3">
            <button
              onClick={() => setShowOthers(!showOthers)}
              className="theme-text-muted text-[11px] font-semibold tracking-wider uppercase hover:underline cursor-pointer transition-opacity"
            >
              {showOthers ? (
                <span>− Hide {othersCount} other{othersCount > 1 ? "s" : ""}</span>
              ) : (
                <span>+ {othersCount} OTHER{othersCount > 1 ? "S" : ""}</span>
              )}
            </button>
          </div>
        )}

        {/* Expanded others list */}
        <AnimatePresence>
          {showOthers && othersCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3 h-3 theme-text-muted" />
                  <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest">
                    Other Candidates
                  </p>
                </div>
                {constituency.others.map((o, i) => (
                  <OtherCandidateRow
                    key={i}
                    candidate={o}
                    constituencyName={constituency.name}
                    constituencyNo={constituency.no}
                    district={constituency.district}
                    onClick={onCandidateClick}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
