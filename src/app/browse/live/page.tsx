"use client";

/**
 * /browse/live — Live Results Dashboard
 *
 * Visual language: Microsoft Teams / Fluent UI v9.
 * - Strict 4px corner radius (Fluent rule: only 0, 4, or fully rounded)
 * - SemiBold (600) max — never bold for hierarchy, use neutral gray tone instead
 * - Real Fluent neutral palette (#e1dfdd, #242424, #616161, #8a8886)
 * - Brand: #6264a7 (Teams purple)
 * - Subtle Fluent shadow4 elevation only — no custom shadows
 * - Segoe UI with system fallback chain
 *
 * Live engine: in-memory state machine ticks every 3.2s.
 * Each tick: promote pending → counting, advance counting progress, declare
 * finished seats. Swap this for a real ECI feed when available.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  Circle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Filter as FilterIcon,
  ArrowUpRight,
  Dot,
} from "lucide-react";
import { getAllConstituencies, type Constituency } from "@/lib/data";

/* ────────────────────────────────────────────────────────────
   FLUENT TOKENS — scoped to this page via inline style
   These are real Fluent UI v9 light theme values.
   ──────────────────────────────────────────────────────────── */
const F = {
  // Neutrals
  bg: "#f5f5f5", // canvas
  surface: "#ffffff", // card / row
  surfaceAlt: "#fafafa", // alt row hover-base
  surfaceHover: "#f3f2f1", // hover
  border: "#e1dfdd", // neutralStroke1 — the iconic Teams divider
  borderStrong: "#d1d1d1",
  text1: "#242424", // neutralForeground1
  text2: "#616161", // neutralForeground2
  text3: "#8a8886", // neutralForeground3 (legacy Teams gray)
  text4: "#a19f9d",
  // Brand (Teams purple)
  brand: "#6264a7",
  brandHover: "#464775",
  brandTint: "#e8ebfa",
  brandText: "#33344a",
  // Status
  success: "#13a10e",
  successTint: "#dff6dd",
  danger: "#c4314b",
  dangerTint: "#fde7e9",
  warning: "#f7630c",
  warningTint: "#fff4ce",
  info: "#0078d4",
  infoTint: "#deecf9",
} as const;

const FONT_STACK =
  '"Segoe UI Variable", "Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Arial, sans-serif';

/* Alliance → Fluent semantic color */
const ALLIANCE_META = {
  ldf: { label: "LDF", color: F.danger, tint: F.dangerTint },
  udf: { label: "UDF", color: F.info, tint: F.infoTint },
  nda: { label: "NDA", color: F.warning, tint: F.warningTint },
} as const;

type Alliance = keyof typeof ALLIANCE_META;

/* ────────────────────────────────────────────────────────────
   LIVE STATE MACHINE
   ──────────────────────────────────────────────────────────── */
type SeatStatus = "pending" | "counting" | "declared";

interface LiveSeat {
  no: number;
  status: SeatStatus;
  progress: number; // 0..100
  leadAlliance: Alliance | null;
  margin: number; // % lead
  declaredAt: number | null;
}

function pickWeightedAlliance(): Alliance {
  // Weights ~roughly competitive Kerala race
  const r = Math.random();
  if (r < 0.46) return "ldf";
  if (r < 0.92) return "udf";
  return "nda";
}

function initialiseSeats(constituencies: Constituency[]): Map<number, LiveSeat> {
  const map = new Map<number, LiveSeat>();
  for (const c of constituencies) {
    map.set(c.no, {
      no: c.no,
      status: "pending",
      progress: 0,
      leadAlliance: null,
      margin: 0,
      declaredAt: null,
    });
  }
  // Pre-seed: ~12 already declared, ~18 mid-count so the page never looks empty
  const all = Array.from(map.values());
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 12; i++) {
    const s = shuffled[i];
    s.status = "declared";
    s.progress = 100;
    s.leadAlliance = pickWeightedAlliance();
    s.margin = 4 + Math.floor(Math.random() * 22);
    s.declaredAt = Date.now() - (12 - i) * 60_000;
  }
  for (let i = 12; i < 30; i++) {
    const s = shuffled[i];
    s.status = "counting";
    s.progress = 15 + Math.floor(Math.random() * 70);
    s.leadAlliance = pickWeightedAlliance();
    s.margin = 1 + Math.floor(Math.random() * 14);
  }
  return map;
}

function tick(prev: Map<number, LiveSeat>): Map<number, LiveSeat> {
  const next = new Map(prev);
  const all = Array.from(next.values());

  // 1. Promote 1–2 pending → counting
  const pendings = all.filter((s) => s.status === "pending");
  const promoteN = Math.min(pendings.length, Math.random() < 0.7 ? 2 : 1);
  for (let i = 0; i < promoteN; i++) {
    const idx = Math.floor(Math.random() * pendings.length);
    const seat = pendings.splice(idx, 1)[0];
    if (!seat) continue;
    next.set(seat.no, {
      ...seat,
      status: "counting",
      progress: 5 + Math.floor(Math.random() * 10),
      leadAlliance: pickWeightedAlliance(),
      margin: 1 + Math.floor(Math.random() * 6),
    });
  }

  // 2. Advance counting seats
  for (const seat of all) {
    if (seat.status !== "counting") continue;
    const advance = 6 + Math.floor(Math.random() * 14);
    const newProgress = Math.min(100, seat.progress + advance);
    // Margin can shift slightly
    const marginShift = Math.floor(Math.random() * 3) - 1;
    let newLead = seat.leadAlliance;
    let newMargin = Math.max(0, seat.margin + marginShift);
    // 8% chance the lead flips while close (margin < 3)
    if (newMargin < 3 && Math.random() < 0.08) {
      newLead = pickWeightedAlliance();
      newMargin = 1 + Math.floor(Math.random() * 4);
    }
    if (newProgress >= 100) {
      next.set(seat.no, {
        ...seat,
        status: "declared",
        progress: 100,
        leadAlliance: newLead,
        margin: Math.max(2, newMargin),
        declaredAt: Date.now(),
      });
    } else {
      next.set(seat.no, {
        ...seat,
        progress: newProgress,
        leadAlliance: newLead,
        margin: newMargin,
      });
    }
  }
  return next;
}

/* ────────────────────────────────────────────────────────────
   AVATAR — Fluent Persona pattern
   ──────────────────────────────────────────────────────────── */
function Persona({ name, alliance, size = 28 }: { name: string; alliance: Alliance | null; size?: number }) {
  const initials = name
    .replace(/^(Adv\.|Dr\.|Mr\.|Ms\.)\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  const bg = alliance ? ALLIANCE_META[alliance].color : F.text3;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size <= 28 ? 11 : 13,
        fontWeight: 600,
        flexShrink: 0,
        letterSpacing: 0.2,
      }}
    >
      {initials}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   STATUS PILL — Fluent presence/badge pattern
   ──────────────────────────────────────────────────────────── */
function StatusBadge({ status, leadAlliance }: { status: SeatStatus; leadAlliance: Alliance | null }) {
  if (status === "pending") {
    return (
      <span style={pillStyle(F.surfaceHover, F.text3)}>
        <Circle size={8} style={{ color: F.text4 }} />
        Yet to count
      </span>
    );
  }
  if (status === "counting") {
    const c = leadAlliance ? ALLIANCE_META[leadAlliance].color : F.text3;
    return (
      <span style={pillStyle(F.surfaceHover, c)}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: c,
            animation: "fluentPulse 1.4s ease-in-out infinite",
          }}
        />
        Counting
      </span>
    );
  }
  // declared
  const c = leadAlliance ? ALLIANCE_META[leadAlliance].color : F.success;
  const tint = leadAlliance ? ALLIANCE_META[leadAlliance].tint : F.successTint;
  return (
    <span style={pillStyle(tint, c)}>
      <CheckCircle2 size={11} strokeWidth={2.5} />
      Declared
    </span>
  );
}

function pillStyle(bg: string, color: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 10px 3px 8px",
    borderRadius: 999,
    background: bg,
    color,
    fontSize: 11,
    fontWeight: 600,
    lineHeight: "16px",
    whiteSpace: "nowrap",
  };
}

/* ────────────────────────────────────────────────────────────
   STAT CARD — Fluent dashboard pattern
   ──────────────────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  total,
  delta,
  accent,
  icon,
}: {
  label: string;
  value: number;
  total?: number;
  delta?: string;
  accent: string;
  icon: React.ReactNode;
}) {
  const pct = total ? (value / total) * 100 : 0;
  return (
    <div
      className="live-statcard"
      style={{
        background: F.surface,
        border: `1px solid ${F.border}`,
        borderRadius: 4,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 6 }}>
        <span
          className="live-statcard-label"
          style={{
            color: F.text2,
            fontWeight: 600,
            letterSpacing: 0.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: accent + "1a",
            color: accent,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexWrap: "wrap" }}>
        <span
          className="live-statcard-value"
          style={{ fontWeight: 600, color: F.text1, letterSpacing: -0.4 }}
        >
          {value}
        </span>
        {total !== undefined && (
          <span style={{ fontSize: 12, color: F.text3, fontWeight: 400 }}>/ {total}</span>
        )}
        {delta && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: F.success,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ArrowUpRight size={11} />
            {delta}
          </span>
        )}
      </div>
      {total !== undefined && (
        <div
          style={{
            marginTop: 10,
            height: 3,
            background: F.surfaceHover,
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: accent,
              transition: "width 800ms cubic-bezier(0.33, 0, 0.1, 1)",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────────────── */
export default function LiveResultsPage() {
  const constituencies = useMemo(() => getAllConstituencies(), []);
  const [seats, setSeats] = useState<Map<number, LiveSeat>>(() => initialiseSeats(constituencies));
  const [tickAt, setTickAt] = useState(Date.now());
  const [filter, setFilter] = useState<"all" | "counting" | "declared" | Alliance>("all");
  const [query, setQuery] = useState("");
  const [selectedNo, setSelectedNo] = useState<number | null>(null);

  // Live engine
  useEffect(() => {
    const id = window.setInterval(() => {
      setSeats((s) => tick(s));
      setTickAt(Date.now());
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  // Derived totals
  const totals = useMemo(() => {
    let pending = 0,
      counting = 0,
      declared = 0;
    const lead: Record<Alliance, number> = { ldf: 0, udf: 0, nda: 0 };
    const won: Record<Alliance, number> = { ldf: 0, udf: 0, nda: 0 };
    seats.forEach((s) => {
      if (s.status === "pending") pending++;
      else if (s.status === "counting") {
        counting++;
        if (s.leadAlliance) lead[s.leadAlliance]++;
      } else {
        declared++;
        if (s.leadAlliance) {
          won[s.leadAlliance]++;
          lead[s.leadAlliance]++;
        }
      }
    });
    return { pending, counting, declared, lead, won, total: seats.size };
  }, [seats]);

  // Recently declared (last 5)
  const recent = useMemo(() => {
    return Array.from(seats.values())
      .filter((s) => s.declaredAt !== null)
      .sort((a, b) => (b.declaredAt ?? 0) - (a.declaredAt ?? 0))
      .slice(0, 5);
  }, [seats]);

  // Filtered list rows
  const rows = useMemo(() => {
    const enriched = constituencies.map((c) => {
      const live = seats.get(c.no)!;
      return { c, live };
    });

    let filtered = enriched;
    if (filter === "counting") filtered = filtered.filter((r) => r.live.status === "counting");
    else if (filter === "declared") filtered = filtered.filter((r) => r.live.status === "declared");
    else if (filter === "ldf" || filter === "udf" || filter === "nda")
      filtered = filtered.filter((r) => r.live.leadAlliance === filter);

    if (query.trim().length >= 2) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.c.name.toLowerCase().includes(q) ||
          r.c.district.toLowerCase().includes(q) ||
          r.c.ldf.candidate.toLowerCase().includes(q) ||
          r.c.udf.candidate.toLowerCase().includes(q) ||
          r.c.nda.candidate.toLowerCase().includes(q)
      );
    }

    // Sort: counting first (most progress), then pending, then declared (most recent)
    return filtered.sort((a, b) => {
      const order = { counting: 0, pending: 1, declared: 2 } as const;
      const oa = order[a.live.status];
      const ob = order[b.live.status];
      if (oa !== ob) return oa - ob;
      if (a.live.status === "counting") return b.live.progress - a.live.progress;
      if (a.live.status === "declared") return (b.live.declaredAt ?? 0) - (a.live.declaredAt ?? 0);
      return a.c.no - b.c.no;
    });
  }, [constituencies, seats, filter, query]);

  const selected = selectedNo ? constituencies.find((c) => c.no === selectedNo) : null;
  const selectedLive = selectedNo ? seats.get(selectedNo) : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: F.bg,
        color: F.text1,
        fontFamily: FONT_STACK,
        fontSize: 14,
        lineHeight: 1.4,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        @keyframes fluentPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }
        @keyframes fluentSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fluentSheetUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .fluent-row { transition: background 80ms ease; }
        .fluent-row:hover { background: ${F.surfaceHover}; cursor: pointer; }
        .fluent-row.is-selected { background: ${F.brandTint}; }
        .fluent-pivot button { position: relative; }
        .fluent-pivot button.is-active::after {
          content: ""; position: absolute; left: 12px; right: 12px; bottom: 0;
          height: 2px; background: ${F.brand}; border-radius: 2px 2px 0 0;
        }
        .fluent-chip { transition: background 80ms ease, border-color 80ms ease; }
        .fluent-chip:hover { background: ${F.surfaceHover}; }
        .fluent-icon-btn { transition: background 80ms ease; }
        .fluent-icon-btn:hover { background: ${F.surfaceHover}; }
        .fluent-search:focus-within { border-color: ${F.brand} !important; box-shadow: 0 0 0 1px ${F.brand}; }
        .fluent-fade-in { animation: fluentSlideIn 220ms ease both; }

        /* ───── MOBILE-FIRST LAYOUT ───── */
        .live-topbar { padding: 0 12px !important; gap: 10px !important; }
        .live-brand-text { display: none; }
        .live-search { width: auto !important; flex: 1; max-width: none !important; }
        .live-topbar-icons { display: none !important; }
        .live-pivot { padding: 0 !important; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .live-pivot::-webkit-scrollbar { display: none; }
        .live-pivot { scrollbar-width: none; }
        .live-pivot button { padding: 0 14px !important; flex-shrink: 0; }
        .live-pivot-status { display: none !important; }
        .live-pivot-status-mobile { display: flex !important; }
        .live-main { padding: 14px 12px 80px !important; max-width: none !important; }
        .live-title { font-size: 18px !important; }
        .live-subtitle { font-size: 11px !important; }
        .live-actions { display: none !important; }
        .live-statgrid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; margin-bottom: 14px !important; }
        .live-statcard { padding: 12px 14px 10px !important; }
        .live-statcard-value { font-size: 22px !important; line-height: 26px !important; }
        .live-statcard-label { font-size: 10px !important; }
        .live-recent { padding: 10px 12px !important; margin-bottom: 14px !important; }
        .live-recent-card { min-width: 220px !important; }
        .live-list-header { display: none !important; }
        .live-row-desktop { display: none !important; }
        .live-row-mobile { display: flex !important; }
        .live-side-panel {
          top: auto !important;
          right: 0 !important;
          left: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          max-height: 78vh !important;
          border-radius: 12px 12px 0 0 !important;
          border-bottom: none !important;
          animation: fluentSheetUp 240ms cubic-bezier(0.33, 0, 0.1, 1) both !important;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.10) !important;
        }
        .live-sheet-handle { display: block !important; }

        @media (min-width: 768px) {
          .live-topbar { padding: 0 20px !important; gap: 16px !important; }
          .live-brand-text { display: inline; }
          .live-search { width: 280px !important; flex: 0 0 auto; max-width: 32vw !important; }
          .live-topbar-icons { display: inline-flex !important; }
          .live-pivot { padding: 0 20px !important; overflow-x: visible; }
          .live-pivot button { padding: 0 12px !important; }
          .live-pivot-status { display: flex !important; }
          .live-pivot-status-mobile { display: none !important; }
          .live-main { padding: 20px !important; max-width: 1400px !important; }
          .live-title { font-size: 22px !important; }
          .live-subtitle { font-size: 13px !important; }
          .live-actions { display: inline-flex !important; }
          .live-statgrid { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important; gap: 12px !important; margin-bottom: 20px !important; }
          .live-statcard { padding: 16px 18px 14px !important; }
          .live-statcard-value { font-size: 28px !important; line-height: 32px !important; }
          .live-statcard-label { font-size: 12px !important; }
          .live-recent { padding: 12px 16px !important; margin-bottom: 20px !important; }
          .live-recent-card { min-width: 240px !important; }
          .live-list-header { display: grid !important; }
          .live-row-desktop { display: grid !important; }
          .live-row-mobile { display: none !important; }
          .live-side-panel {
            top: 92px !important;
            right: 20px !important;
            left: auto !important;
            bottom: auto !important;
            width: 340px !important;
            max-height: calc(100vh - 112px) !important;
            border-radius: 4px !important;
            border-bottom: 1px solid ${F.border} !important;
            animation: fluentSlideIn 220ms ease both !important;
            box-shadow: 0 8px 16px rgba(0,0,0,0.10), 0 0 2px rgba(0,0,0,0.12) !important;
          }
          .live-sheet-handle { display: none !important; }
        }
      `}</style>

      {/* ═══════════════ TOP BAR (48px) ═══════════════ */}
      <header
        className="live-topbar"
        style={{
          height: 48,
          background: F.brand,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none", flexShrink: 0 }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: "#fff",
              color: F.brand,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: -0.5,
            }}
          >
            K
          </span>
          <span className="live-brand-text" style={{ fontSize: 14, fontWeight: 600, letterSpacing: 0.1 }}>
            Kerala Election Pulse
          </span>
        </Link>

        <div
          className="fluent-search live-search"
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.13)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 4,
            padding: "5px 10px",
          }}
        >
          <Search size={14} style={{ opacity: 0.85, flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 13,
              flex: 1,
              minWidth: 0,
              fontFamily: "inherit",
            }}
          />
        </div>

        <button className="fluent-icon-btn live-topbar-icons" style={iconBtn}>
          <Bell size={16} />
        </button>
        <button className="fluent-icon-btn live-topbar-icons" style={iconBtn}>
          <Settings size={16} />
        </button>
        <button className="fluent-icon-btn live-topbar-icons" style={iconBtn}>
          <HelpCircle size={16} />
        </button>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#fff",
            color: F.brand,
            fontSize: 11,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ECI
        </div>
      </header>

      {/* ═══════════════ PIVOT TABS ═══════════════ */}
      <div
        className="fluent-pivot live-pivot"
        style={{
          background: F.surface,
          borderBottom: `1px solid ${F.border}`,
          display: "flex",
          alignItems: "center",
          gap: 4,
          height: 44,
          position: "sticky",
          top: 48,
          zIndex: 20,
        }}
      >
        {[
          { key: "live", label: "Live" },
          { key: "const", label: "Constituencies" },
          { key: "cand", label: "Candidates" },
          { key: "party", label: "Parties" },
          { key: "compare", label: "Compare" },
        ].map((t, i) => (
          <button
            key={t.key}
            className={i === 0 ? "is-active" : ""}
            style={{
              background: "transparent",
              border: "none",
              padding: "0 12px",
              height: 44,
              fontSize: 14,
              fontWeight: 600,
              color: i === 0 ? F.text1 : F.text2,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
        <div
          className="live-pivot-status"
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, paddingRight: 20, flexShrink: 0 }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: F.danger,
              animation: "fluentPulse 1.4s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 12, color: F.text2, fontWeight: 600 }}>
            Live · updated {Math.max(0, Math.floor((Date.now() - tickAt) / 1000))}s ago
          </span>
        </div>
      </div>

      {/* Mobile-only live status strip (replaces the live indicator hidden in scroll-pivot) */}
      <div
        className="live-pivot-status-mobile"
        style={{
          display: "none",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          background: F.surface,
          borderBottom: `1px solid ${F.border}`,
          position: "sticky",
          top: 92,
          zIndex: 19,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: F.danger,
            animation: "fluentPulse 1.4s ease-in-out infinite",
          }}
        />
        <span style={{ fontSize: 11, color: F.text2, fontWeight: 600 }}>
          Live · updated {Math.max(0, Math.floor((Date.now() - tickAt) / 1000))}s ago · {totals.declared}/{totals.total} declared
        </span>
      </div>

      {/* ═══════════════ DASHBOARD ═══════════════ */}
      <main className="live-main" style={{ margin: "0 auto" }}>
        {/* Page title */}
        <div style={{ marginBottom: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <h1 className="live-title" style={{ fontWeight: 600, color: F.text1, margin: 0, letterSpacing: -0.2 }}>
              Kerala Assembly Election 2026
            </h1>
            <p className="live-subtitle" style={{ color: F.text2, margin: "3px 0 0", fontWeight: 400 }}>
              Live counting · 4 May 2026 · Source: ECI
            </p>
          </div>
          <div className="live-actions" style={{ alignItems: "center", gap: 8 }}>
            <button style={ghostBtn}>
              <FilterIcon size={13} />
              Filters
            </button>
            <button style={primaryBtn}>Export</button>
          </div>
        </div>

        {/* Stat grid */}
        <section
          className="live-statgrid"
          style={{
            display: "grid",
          }}
        >
          <StatCard
            label="DECLARED"
            value={totals.declared}
            total={totals.total}
            accent={F.brand}
            icon={<CheckCircle2 size={12} />}
          />
          <StatCard
            label="LDF LEAD"
            value={totals.lead.ldf}
            delta={`+${totals.won.ldf}`}
            accent={ALLIANCE_META.ldf.color}
            icon={<TrendingUp size={12} />}
          />
          <StatCard
            label="UDF LEAD"
            value={totals.lead.udf}
            delta={`+${totals.won.udf}`}
            accent={ALLIANCE_META.udf.color}
            icon={<TrendingUp size={12} />}
          />
          <StatCard
            label="NDA LEAD"
            value={totals.lead.nda}
            delta={`+${totals.won.nda}`}
            accent={ALLIANCE_META.nda.color}
            icon={<TrendingUp size={12} />}
          />
        </section>

        {/* Recent calls strip */}
        {recent.length > 0 && (
          <section
            className="live-recent"
            style={{
              background: F.surface,
              border: `1px solid ${F.border}`,
              borderRadius: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={14} style={{ color: F.brand }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: F.text1, letterSpacing: 0.2 }}>
                  RECENTLY DECLARED
                </span>
              </div>
              <span style={{ fontSize: 11, color: F.text3 }}>Auto-refreshing</span>
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 2 }}>
              {recent.map((s) => {
                const c = constituencies.find((cc) => cc.no === s.no);
                if (!c || !s.leadAlliance) return null;
                const meta = ALLIANCE_META[s.leadAlliance];
                const winner = c[s.leadAlliance];
                return (
                  <div
                    key={s.no}
                    className="fluent-fade-in live-recent-card"
                    style={{
                      flex: "0 0 auto",
                      border: `1px solid ${F.border}`,
                      borderLeft: `3px solid ${meta.color}`,
                      borderRadius: 4,
                      padding: "10px 12px",
                      background: F.surfaceAlt,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Persona name={winner.candidate} alliance={s.leadAlliance} size={24} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: F.text1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {winner.candidate}
                        </div>
                        <div style={{ fontSize: 11, color: F.text3 }}>
                          {winner.party} · {c.name}
                        </div>
                      </div>
                      <span style={pillStyle(meta.tint, meta.color)}>{meta.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: F.text2 }}>
                      Margin {s.margin}% · Declared {Math.max(1, Math.floor((Date.now() - (s.declaredAt ?? 0)) / 60000))}m ago
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Filter chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {(
            [
              { key: "all", label: `All · ${totals.total}` },
              { key: "counting", label: `Counting · ${totals.counting}` },
              { key: "declared", label: `Declared · ${totals.declared}` },
              { key: "ldf", label: `LDF lead · ${totals.lead.ldf}`, color: ALLIANCE_META.ldf.color },
              { key: "udf", label: `UDF lead · ${totals.lead.udf}`, color: ALLIANCE_META.udf.color },
              { key: "nda", label: `NDA lead · ${totals.lead.nda}`, color: ALLIANCE_META.nda.color },
            ] as const
          ).map((chip) => {
            const active = filter === chip.key;
            return (
              <button
                key={chip.key}
                className="fluent-chip"
                onClick={() => setFilter(chip.key as typeof filter)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  borderRadius: 4,
                  border: `1px solid ${active ? F.brand : F.border}`,
                  background: active ? F.brandTint : F.surface,
                  color: active ? F.brandText : F.text2,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  height: 28,
                }}
              >
                {"color" in chip && chip.color && (
                  <span
                    style={{ width: 8, height: 8, borderRadius: "50%", background: chip.color }}
                  />
                )}
                {chip.label}
              </button>
            );
          })}
          <span style={{ marginLeft: "auto", fontSize: 12, color: F.text3 }}>
            Showing {rows.length} of {totals.total}
          </span>
        </div>

        {/* List */}
        <section
          style={{
            background: F.surface,
            border: `1px solid ${F.border}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* List header (desktop only) */}
          <div
            className="live-list-header"
            style={{
              gridTemplateColumns: "minmax(220px, 1.4fr) minmax(220px, 1.6fr) 110px 130px 90px",
              padding: "10px 16px",
              background: F.surfaceAlt,
              borderBottom: `1px solid ${F.border}`,
              fontSize: 11,
              fontWeight: 600,
              color: F.text2,
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            <span>Constituency</span>
            <span>Leading candidate</span>
            <span>Status</span>
            <span>Progress</span>
            <span style={{ textAlign: "right" }}>Margin</span>
          </div>

          {rows.length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: F.text3, fontSize: 13 }}>
              No constituencies match these filters.
            </div>
          )}

          {rows.map(({ c, live }) => {
            const lead = live.leadAlliance ? c[live.leadAlliance] : null;
            const meta = live.leadAlliance ? ALLIANCE_META[live.leadAlliance] : null;
            const isSelected = selectedNo === c.no;
            return (
              <div key={c.no} style={{ borderBottom: `1px solid ${F.border}` }}>
                {/* ─── DESKTOP ROW (≥768px) ─── */}
                <div
                  className={`fluent-row live-row-desktop${isSelected ? " is-selected" : ""}`}
                  onClick={() => setSelectedNo(isSelected ? null : c.no)}
                  style={{
                    gridTemplateColumns: "minmax(220px, 1.4fr) minmax(220px, 1.6fr) 110px 130px 90px",
                    padding: "10px 16px",
                    alignItems: "center",
                    fontSize: 13,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 4,
                        background: F.surfaceHover,
                        color: F.text2,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {c.no.toString().padStart(3, "0")}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: F.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: F.text3 }}>{c.district}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    {lead && live.leadAlliance ? (
                      <>
                        <Persona name={lead.candidate} alliance={live.leadAlliance} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: F.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {lead.candidate}
                          </div>
                          <div style={{ fontSize: 11, color: F.text3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {lead.party}
                          </div>
                        </div>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, color: F.text4 }}>—</span>
                    )}
                  </div>
                  <div>
                    <StatusBadge status={live.status} leadAlliance={live.leadAlliance} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: F.surfaceHover, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${live.progress}%`,
                          height: "100%",
                          background: meta ? meta.color : F.text4,
                          transition: "width 800ms cubic-bezier(0.33, 0, 0.1, 1)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: F.text2, width: 30, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {live.progress}%
                    </span>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: 13,
                      fontWeight: 600,
                      color: live.status === "pending" ? F.text4 : F.text1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {live.status === "pending" ? "—" : `${live.margin}%`}
                  </div>
                </div>

                {/* ─── MOBILE ROW (<768px) ─── */}
                <div
                  className={`fluent-row live-row-mobile${isSelected ? " is-selected" : ""}`}
                  onClick={() => setSelectedNo(isSelected ? null : c.no)}
                  style={{
                    flexDirection: "column",
                    gap: 8,
                    padding: "11px 14px 12px",
                  }}
                >
                  {/* Top line: # + name/district + status */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                    <span
                      style={{
                        minWidth: 30,
                        height: 22,
                        padding: "0 6px",
                        borderRadius: 4,
                        background: F.surfaceHover,
                        color: F.text3,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 600,
                        flexShrink: 0,
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: 0.2,
                      }}
                    >
                      {c.no.toString().padStart(3, "0")}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: F.text1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: "18px",
                        }}
                      >
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: F.text3, lineHeight: "14px" }}>{c.district}</div>
                    </div>
                    <StatusBadge status={live.status} leadAlliance={live.leadAlliance} />
                  </div>

                  {/* Bottom line: avatar + candidate + margin */}
                  {lead && live.leadAlliance ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", paddingLeft: 40 }}>
                      <Persona name={lead.candidate} alliance={live.leadAlliance} size={24} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: F.text1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: "16px",
                          }}
                        >
                          {lead.candidate}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: F.text3,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {lead.party}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: F.text1, fontVariantNumeric: "tabular-nums", lineHeight: "16px" }}>
                          {live.status === "pending" ? "—" : `${live.margin}%`}
                        </span>
                        <span style={{ fontSize: 10, color: F.text3, fontVariantNumeric: "tabular-nums" }}>
                          {live.progress}% counted
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ paddingLeft: 40, fontSize: 11, color: F.text4 }}>Awaiting first round</div>
                  )}

                  {/* Progress bar */}
                  <div style={{ marginLeft: 40, marginRight: 0, height: 3, width: "calc(100% - 40px)", background: F.surfaceHover, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${live.progress}%`,
                        height: "100%",
                        background: meta ? meta.color : F.text4,
                        transition: "width 800ms cubic-bezier(0.33, 0, 0.1, 1)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Footer note */}
        <p style={{ marginTop: 16, fontSize: 11, color: F.text3, textAlign: "center" }}>
          <Dot size={10} style={{ display: "inline" }} /> Demo feed · numbers update every 3.2 seconds. Wire to live ECI data when available.
        </p>
      </main>

      {/* ═══════════════ SIDE PANEL / BOTTOM SHEET ═══════════════ */}
      {selected && selectedLive && (
        <>
          {/* Backdrop — only shows on mobile via the bottom sheet */}
          <div
            onClick={() => setSelectedNo(null)}
            className="live-sheet-handle"
            style={{
              display: "none",
              position: "fixed",
              inset: 0,
              background: "rgba(36, 36, 36, 0.32)",
              zIndex: 24,
              animation: "fluentSlideIn 200ms ease both",
            }}
          />
          <aside
            className="live-side-panel"
            style={{
              position: "fixed",
              background: F.surface,
              border: `1px solid ${F.border}`,
              zIndex: 25,
              overflow: "auto",
            }}
          >
            {/* Sheet drag handle (mobile only) */}
            <div
              className="live-sheet-handle"
              style={{
                display: "none",
                width: "100%",
                paddingTop: 8,
                paddingBottom: 4,
                justifyContent: "center",
              }}
            >
              <span style={{ width: 36, height: 4, borderRadius: 2, background: F.borderStrong, display: "block" }} />
            </div>
          <div
            style={{
              padding: "14px 16px",
              borderBottom: `1px solid ${F.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: F.text3, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase" }}>
                Constituency #{selected.no.toString().padStart(3, "0")}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: F.text1, marginTop: 2 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: F.text2 }}>{selected.district} district</div>
            </div>
            <button
              onClick={() => setSelectedNo(null)}
              className="fluent-icon-btn"
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                background: "transparent",
                border: "none",
                color: F.text2,
                cursor: "pointer",
                fontSize: 18,
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: F.text3, fontWeight: 600, marginBottom: 8, letterSpacing: 0.3 }}>
              CANDIDATES
            </div>
            {(["ldf", "udf", "nda"] as const).map((a) => {
              const cand = selected[a];
              const meta = ALLIANCE_META[a];
              const isLead = selectedLive.leadAlliance === a;
              return (
                <div
                  key={a}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 4,
                    background: isLead ? meta.tint : "transparent",
                    border: `1px solid ${isLead ? meta.color : F.border}`,
                    marginBottom: 6,
                  }}
                >
                  <Persona name={cand.candidate} alliance={a} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: F.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {cand.candidate}
                    </div>
                    <div style={{ fontSize: 11, color: F.text3 }}>{cand.party}</div>
                  </div>
                  {isLead && <span style={pillStyle(meta.tint, meta.color)}>Leading</span>}
                </div>
              );
            })}

            <div style={{ marginTop: 16, fontSize: 11, color: F.text3, fontWeight: 600, marginBottom: 8, letterSpacing: 0.3 }}>
              COUNTING STATUS
            </div>
            <div style={{ background: F.surfaceAlt, border: `1px solid ${F.border}`, borderRadius: 4, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: F.text2, fontWeight: 600 }}>Progress</span>
                <span style={{ fontSize: 12, color: F.text1, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {selectedLive.progress}%
                </span>
              </div>
              <div style={{ height: 6, background: F.surfaceHover, borderRadius: 0, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${selectedLive.progress}%`,
                    height: "100%",
                    background: selectedLive.leadAlliance ? ALLIANCE_META[selectedLive.leadAlliance].color : F.text3,
                    transition: "width 800ms cubic-bezier(0.33, 0, 0.1, 1)",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: F.text2 }}>
                <span>Status</span>
                <StatusBadge status={selectedLive.status} leadAlliance={selectedLive.leadAlliance} />
              </div>
              {selectedLive.status !== "pending" && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: F.text2 }}>
                  <span>Margin</span>
                  <span style={{ color: F.text1, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                    {selectedLive.margin}%
                  </span>
                </div>
              )}
            </div>
          </div>
          </aside>
        </>
      )}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 4,
  background: "transparent",
  border: "none",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  height: 32,
  borderRadius: 4,
  border: `1px solid ${F.border}`,
  background: F.surface,
  color: F.text1,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: FONT_STACK,
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 16px",
  height: 32,
  borderRadius: 4,
  border: `1px solid ${F.brand}`,
  background: F.brand,
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: FONT_STACK,
};
