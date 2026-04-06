"use client";

import { motion } from "framer-motion";
import { getPartyFullName } from "@/lib/data";

interface Props {
  candidate: string;
  party: string;
  alliance: "ldf" | "udf" | "nda";
  constituency: string;
  constituencyNo: number;
  district: string;
}

const allianceConfig = {
  ldf: {
    label: "LDF",
    gradient: "from-red-700 to-red-500",
    border: "border-ldf-red/40",
    glow: "hover:shadow-[0_0_30px_rgba(220,38,38,0.25)]",
    bg: "bg-ldf-red",
    accent: "text-red-400",
    badge: "bg-red-900/60 text-red-300",
    ring: "ring-red-500/30",
    icon: "bg-gradient-to-br from-red-600 to-red-800",
  },
  udf: {
    label: "UDF",
    gradient: "from-blue-700 to-blue-500",
    border: "border-udf-blue/40",
    glow: "hover:shadow-[0_0_30px_rgba(37,99,235,0.25)]",
    bg: "bg-udf-blue",
    accent: "text-blue-400",
    badge: "bg-blue-900/60 text-blue-300",
    ring: "ring-blue-500/30",
    icon: "bg-gradient-to-br from-blue-600 to-blue-800",
  },
  nda: {
    label: "NDA",
    gradient: "from-amber-600 to-amber-400",
    border: "border-nda-saffron/40",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    bg: "bg-nda-saffron",
    accent: "text-amber-400",
    badge: "bg-amber-900/60 text-amber-300",
    ring: "ring-amber-500/30",
    icon: "bg-gradient-to-br from-amber-500 to-amber-700",
  },
};

export default function CandidateCard({
  candidate,
  party,
  alliance,
  constituency,
  constituencyNo,
  district,
}: Props) {
  const config = allianceConfig[alliance];
  const initials = candidate
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass-card rounded-2xl overflow-hidden ${config.glow} transition-shadow duration-300`}
    >
      {/* Top color bar */}
      <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

      <div className="p-5">
        {/* Alliance badge + constituency */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${config.badge}`}
          >
            {config.label}
          </span>
          <span className="text-ivory-dark/40 text-xs font-mono">
            #{constituencyNo}
          </span>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-full ${config.icon} flex items-center justify-center text-white font-bold text-lg ring-2 ${config.ring} shrink-0`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-ivory font-semibold text-lg leading-tight truncate">
              {candidate}
            </h3>
            <p className={`text-sm ${config.accent} font-medium`}>{party}</p>
            <p className="text-ivory-dark/40 text-xs mt-0.5 truncate" title={getPartyFullName(party)}>
              {getPartyFullName(party)}
            </p>
          </div>
        </div>

        {/* Constituency info */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <svg
            className="w-4 h-4 text-gold/50 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-ivory-dark/60 text-sm">
            {constituency}, <span className="text-gold/60">{district}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
