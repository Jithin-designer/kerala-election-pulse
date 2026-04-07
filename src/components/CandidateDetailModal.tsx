"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import {
  X,
  MapPin,
  Share2,
  GraduationCap,
  Briefcase,
  IndianRupee,
  AlertTriangle,
  Calendar,
  Vote,
  Loader2,
} from "lucide-react";
import { getPartyFullName } from "@/lib/data";
import { getCandidatePhoto } from "@/lib/candidateImages";

const ALLIANCE = {
  ldf: { label: "LDF", color: "#dc2626", gradient: "from-red-600 to-red-800" },
  udf: { label: "UDF", color: "#2563eb", gradient: "from-blue-600 to-blue-800" },
  nda: { label: "NDA", color: "#f59e0b", gradient: "from-amber-500 to-amber-700" },
  oth: { label: "OTH", color: "#6b7280", gradient: "from-gray-600 to-gray-800" },
} as const;

export interface DetailCandidate {
  name: string;
  party: string;
  alliance: "ldf" | "udf" | "nda" | "oth";
  constituency: string;
  constituencyNo: number;
  district: string;
  age: number | null;
  education: string;
  profession: string;
  assets: string;
  assets_value: number;
  criminal_cases: number;
}

function formatAssets(value: number, fallback: string): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  if (value > 0) return `₹${value.toLocaleString("en-IN")}`;
  return fallback || "—";
}

/* ── Stat block ── */
function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="p-3.5 rounded-2xl"
      style={{
        background: "var(--theme-border)",
        border: "var(--theme-card-border)",
      }}
    >
      <div
        className="flex items-center gap-1.5 theme-text-muted text-[9px] uppercase font-bold tracking-wider mb-1.5"
      >
        {icon}
        {label}
      </div>
      <p className="theme-text font-bold text-sm leading-tight" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}

interface Props {
  candidate: DetailCandidate | null;
  onClose: () => void;
}

export default function CandidateDetailModal({ candidate, onClose }: Props) {
  const shareableRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  // Lock body scroll
  useEffect(() => {
    if (candidate) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [candidate]);

  // ESC to close
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!candidate) return null;

  const theme = ALLIANCE[candidate.alliance];
  const photo = getCandidatePhoto(candidate.name, candidate.constituency, theme.color);
  const fullParty = getPartyFullName(candidate.party);

  async function handleShare() {
    if (!candidate || !shareableRef.current) return;
    setSharing(true);

    try {
      // Capture the shareable card as PNG
      const dataUrl = await htmlToImage.toPng(shareableRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#0a0a0a",
      });

      // Convert dataUrl → Blob → File
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${candidate.name.replace(/\s+/g, "-")}-kerala2026.png`, {
        type: "image/png",
      });

      const shareData: ShareData = {
        title: `${candidate.name} — Kerala 2026`,
        text: `${candidate.name} · ${candidate.party} · ${candidate.constituency}\n#KeralaElection2026`,
        files: [file],
      };

      // Try native share with file
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        // Fallback: text-only share
        await navigator.share({ title: shareData.title, text: shareData.text });
      } else {
        // Final fallback: download the PNG
        const link = document.createElement("a");
        link.download = file.name;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      // User cancelled or share failed — silently ignore
      console.warn("Share failed:", err);
    } finally {
      setSharing(false);
    }
  }

  return (
    <AnimatePresence>
      {candidate && (
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[201] sm:p-6"
          >
            <div
              className="theme-card overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] sm:max-w-lg sm:w-full sm:rounded-3xl rounded-t-3xl rounded-b-none sm:rounded-b-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Hero with Photo ── */}
              <div className="relative">
                {/* Drag handle */}
                <div className="sm:hidden pt-3 pb-1 flex justify-center">
                  <div
                    className="w-10 h-1 rounded-full"
                    style={{ background: "var(--theme-border)" }}
                  />
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)",
                    color: "#FFFFFF",
                  }}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Photo + alliance accent */}
                <div className="relative px-6 pt-2 pb-4 flex items-center gap-4">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden shrink-0"
                    style={{
                      boxShadow: `0 0 0 4px ${theme.color}20, 0 8px 24px ${theme.color}40`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="theme-text text-xl font-black leading-tight">
                      {candidate.name}
                    </h2>
                    {candidate.age && (
                      <p className="theme-text-muted text-xs mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {candidate.age} years old
                      </p>
                    )}

                    {/* Alliance pill */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider text-white"
                        style={{ background: theme.color }}
                      >
                        {theme.label}
                      </span>
                      <span className="theme-text-secondary text-[11px] font-semibold">
                        {candidate.party}
                      </span>
                    </div>
                    {fullParty !== candidate.party && (
                      <p className="theme-text-muted text-[10px] mt-1 truncate">
                        {fullParty}
                      </p>
                    )}
                  </div>
                </div>

                {/* Constituency banner */}
                <div
                  className="mx-5 px-3 py-2 rounded-xl flex items-center gap-2 text-xs"
                  style={{
                    background: "var(--theme-border)",
                    color: "var(--theme-text-secondary)",
                  }}
                >
                  <Vote className="w-3.5 h-3.5" style={{ color: "var(--theme-accent)" }} />
                  <span className="font-bold">Contesting from</span>
                  <span>{candidate.constituency}</span>
                  <span className="theme-text-muted">·</span>
                  <MapPin className="w-3 h-3 theme-text-muted" />
                  <span className="theme-text-muted">{candidate.district}</span>
                  <span
                    className="ml-auto font-mono font-black text-[10px]"
                    style={{ color: "var(--theme-accent)", opacity: 0.7 }}
                  >
                    #{String(candidate.constituencyNo).padStart(3, "0")}
                  </span>
                </div>
              </div>

              {/* ── Stats grid ── */}
              <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5">
                <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest mb-2.5">
                  Profile Details
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <Stat
                    icon={<GraduationCap className="w-2.5 h-2.5" />}
                    label="Education"
                    value={candidate.education || "Not declared"}
                  />
                  <Stat
                    icon={<Briefcase className="w-2.5 h-2.5" />}
                    label="Profession"
                    value={candidate.profession || "Not declared"}
                  />
                  <Stat
                    icon={<IndianRupee className="w-2.5 h-2.5" />}
                    label="Net Worth"
                    value={formatAssets(candidate.assets_value, candidate.assets)}
                    color="var(--theme-accent)"
                  />
                  <Stat
                    icon={<AlertTriangle className="w-2.5 h-2.5" />}
                    label="Criminal Cases"
                    value={
                      candidate.criminal_cases > 0
                        ? `${candidate.criminal_cases} pending`
                        : "Clean record"
                    }
                    color={candidate.criminal_cases > 0 ? "#dc2626" : "#059669"}
                  />
                </div>

                {/* Disclaimer */}
                <p className="theme-text-muted text-[10px] mt-4 text-center italic">
                  Data sourced from MyNeta.info & Election Commission of India
                </p>
              </div>

              {/* ── Sticky Share Footer ── */}
              <div
                className="px-5 py-4"
                style={{
                  borderTop: "1px solid var(--theme-border)",
                  background: "var(--theme-surface)",
                  paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
                }}
              >
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-70 disabled:cursor-wait"
                  style={{
                    background: theme.color,
                    color: "#FFFFFF",
                    boxShadow: `0 4px 16px ${theme.color}40`,
                  }}
                >
                  {sharing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating image…
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Share {candidate.name.split(" ")[0]}&apos;s Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ═══════ Off-screen shareable card (for image capture) ═══════ */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: "-9999px",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <div
              ref={shareableRef}
              style={{
                width: "1080px",
                background: "linear-gradient(160deg, #0a0a0a 0%, #111b14 100%)",
                color: "#f5f0e8",
                fontFamily: "system-ui, -apple-system, sans-serif",
                padding: "60px 50px",
              }}
            >
              {/* Brand header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#d4a843",
                    color: "#060e09",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: 900,
                  }}
                >
                  K
                </div>
                <div>
                  <p style={{ fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>
                    Kerala Election Pulse
                  </p>
                  <p style={{ fontSize: "16px", color: "#d4a843", fontWeight: 700, margin: 0 }}>
                    Assembly Elections 2026
                  </p>
                </div>
                <div style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: "999px", background: theme.color, color: "#fff", fontSize: "14px", fontWeight: 900, letterSpacing: "0.1em" }}>
                  {theme.label}
                </div>
              </div>

              {/* Photo + name */}
              <div style={{ display: "flex", gap: "30px", alignItems: "center", marginBottom: "40px" }}>
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    boxShadow: `0 0 0 8px ${theme.color}25, 0 12px 40px ${theme.color}55`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={candidate.name}
                    crossOrigin="anonymous"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1.05, margin: 0, color: "#fff" }}>
                    {candidate.name}
                  </h1>
                  {candidate.age && (
                    <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)", margin: "8px 0 0 0" }}>
                      {candidate.age} years old
                    </p>
                  )}
                  <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "20px", color: "#fff", fontWeight: 600 }}>{candidate.party}</span>
                    {fullParty !== candidate.party && (
                      <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>· {fullParty}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Constituency banner */}
              <div
                style={{
                  padding: "18px 24px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: "30px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  Contesting from
                </div>
                <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>
                  {candidate.constituency}
                </div>
                <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>
                  · {candidate.district}
                </div>
                <div style={{ marginLeft: "auto", fontSize: "20px", fontWeight: 900, fontFamily: "monospace", color: "#d4a843", opacity: 0.7 }}>
                  #{String(candidate.constituencyNo).padStart(3, "0")}
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "30px" }}>
                <div style={{ padding: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px" }}>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, margin: 0 }}>
                    Education
                  </p>
                  <p style={{ fontSize: "20px", color: "#fff", fontWeight: 700, marginTop: "8px", marginBottom: 0 }}>
                    {candidate.education || "Not declared"}
                  </p>
                </div>
                <div style={{ padding: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px" }}>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, margin: 0 }}>
                    Profession
                  </p>
                  <p style={{ fontSize: "20px", color: "#fff", fontWeight: 700, marginTop: "8px", marginBottom: 0 }}>
                    {candidate.profession || "Not declared"}
                  </p>
                </div>
                <div style={{ padding: "24px", background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.2)", borderRadius: "20px" }}>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, margin: 0 }}>
                    Net Worth
                  </p>
                  <p style={{ fontSize: "26px", color: "#d4a843", fontWeight: 800, marginTop: "8px", marginBottom: 0 }}>
                    {formatAssets(candidate.assets_value, candidate.assets)}
                  </p>
                </div>
                <div
                  style={{
                    padding: "24px",
                    background: candidate.criminal_cases > 0 ? "rgba(220,38,38,0.1)" : "rgba(5,150,105,0.1)",
                    border: `1px solid ${candidate.criminal_cases > 0 ? "rgba(220,38,38,0.25)" : "rgba(5,150,105,0.25)"}`,
                    borderRadius: "20px",
                  }}
                >
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, margin: 0 }}>
                    Criminal Cases
                  </p>
                  <p
                    style={{
                      fontSize: "26px",
                      color: candidate.criminal_cases > 0 ? "#dc2626" : "#059669",
                      fontWeight: 800,
                      marginTop: "8px",
                      marginBottom: 0,
                    }}
                  >
                    {candidate.criminal_cases > 0 ? `${candidate.criminal_cases} pending` : "Clean record"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: "40px",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
                  Data: MyNeta.info · Election Commission of India
                </p>
                <p style={{ fontSize: "13px", color: "#d4a843", fontWeight: 700, margin: 0 }}>
                  kerala-election-pulse.vercel.app
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
