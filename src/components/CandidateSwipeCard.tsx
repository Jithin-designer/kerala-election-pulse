"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  Share2,
  Briefcase,
  AlertTriangle,
  GraduationCap,
  IndianRupee,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  Heart,
} from "lucide-react";
import type { SwipeCandidate } from "@/lib/swipeData";

/* ── Alliance theme map ── */
const ALLIANCE = {
  ldf: {
    label: "LDF",
    color: "#dc2626",
    gradient: "from-red-600 to-red-800",
    pill: "bg-red-500/90 text-white",
    ring: "ring-red-400/50",
    glow: "shadow-red-500/30",
  },
  udf: {
    label: "UDF",
    color: "#2563eb",
    gradient: "from-blue-600 to-blue-800",
    pill: "bg-blue-500/90 text-white",
    ring: "ring-blue-400/50",
    glow: "shadow-blue-500/30",
  },
  nda: {
    label: "NDA",
    color: "#f59e0b",
    gradient: "from-amber-500 to-amber-700",
    pill: "bg-amber-500/90 text-white",
    ring: "ring-amber-400/50",
    glow: "shadow-amber-500/30",
  },
} as const;

/* ── Avatar fallback URL ── */
function avatarUrl(name: string, bgHex: string) {
  const bg = bgHex.replace("#", "");
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=600&background=${bg}&color=fff&bold=true&format=png`;
}

/* ── Swipe threshold ── */
const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY = 500;

/* ── Card Props ── */
interface Props {
  candidate: SwipeCandidate;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  stackIndex: number; // 0 = top card, 1 = behind, 2 = furthest back
}

export default function CandidateSwipeCard({
  candidate,
  onSwipe,
  isTop,
  stackIndex,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const theme = ALLIANCE[candidate.alliance];

  /* ── Drag mechanics ── */
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  /* Stack depth */
  const scale = 1 - stackIndex * 0.045;
  const yOffset = stackIndex * 14;

  function handleDragEnd(_: unknown, info: PanInfo) {
    const shouldSwipe =
      Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
      Math.abs(info.velocity.x) > SWIPE_VELOCITY;
    if (shouldSwipe) {
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  }

  function handleShare() {
    const text = `Check out ${candidate.name} (${candidate.party}) contesting from ${candidate.constituency}! 🗳️\n\n${candidate.tagline}\n\n#KeralaElection2026 #KeralaPulse`;
    if (navigator.share) {
      navigator.share({ title: `${candidate.name} — Kerala Election 2026`, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }

  /* ── Photo source ── */
  const photoSrc = candidate.photo
    ? `/candidates/${candidate.photo}`
    : avatarUrl(candidate.name, theme.color);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: yOffset,
        zIndex: 50 - stackIndex,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={isTop && stackIndex === 0 ? { scale: 0.9, opacity: 0 } : false}
      animate={{
        scale,
        y: yOffset,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 },
      }}
      exit={{
        x: x.get() > 0 ? 600 : -600,
        opacity: 0,
        rotate: x.get() > 0 ? 30 : -30,
        transition: { duration: 0.35, ease: "easeIn" },
      }}
    >
      <div className="h-full w-full rounded-[28px] overflow-hidden shadow-2xl flex flex-col relative bg-black">

        {/* ═══════ SWIPE OVERLAYS ═══════ */}
        {isTop && (
          <>
            {/* RIGHT = LIKE / NETA */}
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute inset-0 z-30 pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-emerald-500/20 rounded-[28px]" />
              <div className="absolute top-12 left-6 border-[3px] border-emerald-400 rounded-xl px-5 py-2 -rotate-12">
                <span className="text-emerald-400 text-3xl font-black tracking-widest">
                  NETA 🔥
                </span>
              </div>
            </motion.div>

            {/* LEFT = NOPE / SKIP */}
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute inset-0 z-30 pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-red-500/10 to-red-500/20 rounded-[28px]" />
              <div className="absolute top-12 right-6 border-[3px] border-red-400 rounded-xl px-5 py-2 rotate-12">
                <span className="text-red-400 text-3xl font-black tracking-widest">
                  SKIP
                </span>
              </div>
            </motion.div>
          </>
        )}

        {/* ═══════ HERO PHOTO ═══════ */}
        <div className="relative flex-[3] min-h-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt={candidate.name}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          {/* ── Floating badges on the photo ── */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
            {/* Alliance pill */}
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider shadow-lg ${theme.pill}`}>
              {theme.label}
            </span>

            {/* Constituency number */}
            <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white/80 text-xs font-bold border border-white/10">
              #{candidate.constituencyNo}
            </span>
          </div>

          {/* ── Stats badges floating at mid-right ── */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
              <Briefcase className="w-3.5 h-3.5 text-gold-light" />
              <span className="text-white text-xs font-bold">{candidate.careerYears}y</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border ${candidate.criminalCases > 0 ? "bg-red-900/60 border-red-500/40" : "bg-emerald-900/40 border-emerald-500/30"}`}>
              <AlertTriangle className={`w-3.5 h-3.5 ${candidate.criminalCases > 0 ? "text-red-400" : "text-emerald-400"}`} />
              <span className={`text-xs font-bold ${candidate.criminalCases > 0 ? "text-red-300" : "text-emerald-300"}`}>
                {candidate.criminalCases === 0 ? "Clean" : `${candidate.criminalCases} case${candidate.criminalCases > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* ── Name & info in gradient zone ── */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
            <div className="flex items-end justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-white text-2xl sm:text-3xl font-black leading-tight mb-1 drop-shadow-lg">
                  {candidate.name}
                  <span className="text-white/40 font-medium text-lg ml-2">
                    {candidate.age}
                  </span>
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white/70 text-sm font-semibold">
                    {candidate.party}
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/50 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {candidate.constituency}
                  </span>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-white/50 text-[13px] mt-2 leading-relaxed italic">
              &ldquo;{candidate.tagline}&rdquo;
            </p>
          </div>
        </div>

        {/* ═══════ BOTTOM SECTION ═══════ */}
        <div className="flex-[1.2] bg-gradient-to-b from-black to-[#0a0a0a] px-5 pt-3 pb-4 flex flex-col">
          {/* Expand/collapse for details */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="flex items-center justify-center gap-1 text-white/30 text-xs mb-3 hover:text-white/50 transition-colors"
          >
            {expanded ? (
              <>
                Less info <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                More info <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>

          {/* Expandable details */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-3 gap-3 mb-4"
            >
              <div className="text-center px-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <GraduationCap className="w-4 h-4 text-gold-light mx-auto mb-1" />
                <p className="text-white/70 text-[11px] font-medium leading-tight">
                  {candidate.education}
                </p>
              </div>
              <div className="text-center px-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <IndianRupee className="w-4 h-4 text-gold-light mx-auto mb-1" />
                <p className="text-white/70 text-[11px] font-medium">
                  {candidate.assets}
                </p>
              </div>
              <div className="text-center px-2 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <MapPin className="w-4 h-4 text-gold-light mx-auto mb-1" />
                <p className="text-white/70 text-[11px] font-medium leading-tight">
                  {candidate.district}
                </p>
              </div>
            </motion.div>
          )}

          {/* Celebrity note */}
          {candidate.note && !expanded && (
            <p className="text-white/25 text-[11px] text-center mb-3 px-4 truncate">
              {candidate.note}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-5 mt-auto">
            {/* Skip button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipe("left");
              }}
              className="w-12 h-12 rounded-full border-2 border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:scale-110 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Share button — the hero CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className={`px-6 py-3 rounded-full bg-gradient-to-r ${theme.gradient} text-white font-bold text-sm flex items-center gap-2 shadow-lg ${theme.glow} hover:scale-105 active:scale-95 transition-all duration-200`}
            >
              <Share2 className="w-4 h-4" />
              Share Profile
            </button>

            {/* Like/Save button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipe("right");
              }}
              className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:scale-110 transition-all duration-200"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
