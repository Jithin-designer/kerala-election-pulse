"use client";

import type { Constituency } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";

interface Props {
  constituency: Constituency;
  index: number;
  isCelebrity?: boolean;
  celebrityNote?: string;
}

const allianceStyles = {
  ldf: {
    color: "#dc2626",
    label: "LDF",
    gradient: "from-red-600/20 to-transparent",
    border: "border-red-500/20",
    text: "text-red-400",
  },
  udf: {
    color: "#2563eb",
    label: "UDF",
    gradient: "from-blue-600/20 to-transparent",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  nda: {
    color: "#f59e0b",
    label: "NDA",
    gradient: "from-amber-600/20 to-transparent",
    border: "border-amber-500/20",
    text: "text-amber-400",
  },
};

function ContenderRow({
  candidate,
  party,
  alliance,
}: {
  candidate: string;
  party: string;
  alliance: "ldf" | "udf" | "nda";
}) {
  const style = allianceStyles[alliance];
  const initials = candidate
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${style.gradient} border ${style.border} transition-all hover:scale-[1.02]`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
        style={{ backgroundColor: style.color + "cc" }}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-ivory font-semibold text-sm truncate">{candidate}</p>
        <p className="text-ivory-dark/50 text-xs truncate">
          {party} &middot; {getPartyFullName(party)}
        </p>
      </div>
      <span
        className={`px-2 py-0.5 rounded text-xs font-bold ${style.text} bg-white/5 shrink-0`}
      >
        {style.label}
      </span>
    </div>
  );
}

export default function BattleCard({
  constituency,
  isCelebrity,
  celebrityNote,
}: Props) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-[0_0_40px_rgba(212,168,67,0.15)] transition-all duration-300 group hover:-translate-y-1">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-gold font-bold text-lg">{constituency.name}</h3>
              {isCelebrity && (
                <span className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold-light text-[10px] font-bold tracking-wider animate-pulse">
                  HOT SEAT
                </span>
              )}
            </div>
            <p className="text-ivory-dark/40 text-sm">{constituency.district} District</p>
          </div>
          <span className="text-ivory-dark/20 text-2xl font-bold font-mono group-hover:text-gold/30 transition-colors">
            {String(constituency.no).padStart(3, "0")}
          </span>
        </div>

        {celebrityNote && (
          <p className="text-gold-light/60 text-xs mt-2 italic border-l-2 border-gold/30 pl-2">
            {celebrityNote}
          </p>
        )}
      </div>

      {/* Three-way battle bar */}
      <div className="flex h-1 mx-5 rounded-full overflow-hidden mb-4">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-blue-500" />
        <div className="flex-1 bg-amber-500" />
      </div>

      {/* Contenders */}
      <div className="px-5 pb-5 space-y-2">
        <ContenderRow
          candidate={constituency.ldf.candidate}
          party={constituency.ldf.party}
          alliance="ldf"
        />
        <ContenderRow
          candidate={constituency.udf.candidate}
          party={constituency.udf.party}
          alliance="udf"
        />
        <ContenderRow
          candidate={constituency.nda.candidate}
          party={constituency.nda.party}
          alliance="nda"
        />
      </div>
    </div>
  );
}
