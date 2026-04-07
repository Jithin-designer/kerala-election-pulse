"use client";

/**
 * /browse/teams — Teams Fluent UI demo of the Browse page.
 * Mobile-first. Static (no live engine). One screen, one purpose:
 * filter by district, scan constituencies, tap to see all 3 candidates.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Bell, HelpCircle, ChevronRight } from "lucide-react";
import {
  getAllConstituencies,
  getAllDistricts,
  type Constituency,
} from "@/lib/data";

/* ───── Fluent v9 light tokens ───── */
const F = {
  bg: "#f5f5f5",
  surface: "#ffffff",
  surfaceAlt: "#fafafa",
  surfaceHover: "#f3f2f1",
  border: "#e1dfdd",
  borderStrong: "#d1d1d1",
  text1: "#242424",
  text2: "#616161",
  text3: "#8a8886",
  text4: "#a19f9d",
  brand: "#6264a7",
  brandTint: "#e8ebfa",
  brandText: "#33344a",
  ldf: "#c4314b",
  ldfTint: "#fde7e9",
  udf: "#0078d4",
  udfTint: "#deecf9",
  nda: "#f7630c",
  ndaTint: "#fff4ce",
} as const;

const FONT_STACK =
  '"Segoe UI Variable", "Segoe UI", -apple-system, BlinkMacSystemFont, system-ui, "Helvetica Neue", Arial, sans-serif';

type Alliance = "ldf" | "udf" | "nda";
const ALLIANCE_META: Record<Alliance, { label: string; color: string; tint: string }> = {
  ldf: { label: "LDF", color: F.ldf, tint: F.ldfTint },
  udf: { label: "UDF", color: F.udf, tint: F.udfTint },
  nda: { label: "NDA", color: F.nda, tint: F.ndaTint },
};

/* Persona avatar — Fluent pattern */
function Persona({ name, alliance, size = 32 }: { name: string; alliance: Alliance; size?: number }) {
  const initials = name
    .replace(/^(Adv\.|Dr\.|Mr\.|Ms\.)\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: ALLIANCE_META[alliance].color,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size <= 28 ? 11 : 12,
        fontWeight: 600,
        flexShrink: 0,
        letterSpacing: 0.2,
      }}
    >
      {initials}
    </div>
  );
}

function pillStyle(bg: string, color: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 8px",
    borderRadius: 999,
    background: bg,
    color,
    fontSize: 10,
    fontWeight: 600,
    lineHeight: "16px",
    whiteSpace: "nowrap",
  };
}

export default function BrowseTeamsPage() {
  const constituencies = useMemo(() => getAllConstituencies(), []);
  const districts = useMemo(() => getAllDistricts(), []);
  const [district, setDistrict] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedNo, setSelectedNo] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = constituencies;
    if (district) list = list.filter((c) => c.district === district);
    if (query.trim().length >= 2) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.ldf.candidate.toLowerCase().includes(q) ||
          c.udf.candidate.toLowerCase().includes(q) ||
          c.nda.candidate.toLowerCase().includes(q)
      );
    }
    return list;
  }, [constituencies, district, query]);

  const selected: Constituency | null = selectedNo
    ? constituencies.find((c) => c.no === selectedNo) ?? null
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: F.bg,
        color: F.text1,
        fontFamily: FONT_STACK,
        fontSize: 14,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        @keyframes fluentSlideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fluentSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .t-row { transition: background 80ms ease; cursor: pointer; }
        .t-row:hover { background: ${F.surfaceHover}; }
        .t-row.is-selected { background: ${F.brandTint}; }
        .t-pivot button.is-active::after {
          content: ""; position: absolute; left: 12px; right: 12px; bottom: 0;
          height: 2px; background: ${F.brand}; border-radius: 2px 2px 0 0;
        }
        .t-pivot button { position: relative; }
        .t-chip { transition: background 80ms ease, border-color 80ms ease; }
        .t-chip:hover { background: ${F.surfaceHover}; }
        .t-search:focus-within { box-shadow: 0 0 0 1px ${F.brand}; }

        /* Mobile first */
        .t-topbar { padding: 0 12px !important; gap: 10px !important; }
        .t-brand-text { display: none; }
        .t-search { flex: 1; }
        .t-topbar-icons { display: none !important; }
        .t-pivot { padding: 0 !important; overflow-x: auto; }
        .t-pivot::-webkit-scrollbar { display: none; }
        .t-pivot { scrollbar-width: none; }
        .t-pivot button { padding: 0 14px !important; flex-shrink: 0; }
        .t-main { padding: 14px 12px 60px !important; }
        .t-title { font-size: 18px !important; }
        .t-subtitle { font-size: 11px !important; }
        .t-chips-row { padding: 0 12px !important; }
        .t-list-header { display: none !important; }
        .t-row-mobile { display: flex !important; }
        .t-row-desktop { display: none !important; }
        .t-side-panel {
          top: auto !important; right: 0 !important; left: 0 !important; bottom: 0 !important;
          width: 100% !important; max-height: 80vh !important;
          border-radius: 12px 12px 0 0 !important;
          animation: fluentSheetUp 240ms cubic-bezier(0.33,0,0.1,1) both !important;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.10) !important;
        }
        .t-sheet-handle-wrap { display: flex !important; }

        @media (min-width: 768px) {
          .t-topbar { padding: 0 20px !important; gap: 16px !important; }
          .t-brand-text { display: inline; }
          .t-search { flex: 0 0 auto; width: 280px; }
          .t-topbar-icons { display: inline-flex !important; }
          .t-pivot { padding: 0 20px !important; }
          .t-pivot button { padding: 0 12px !important; }
          .t-main { padding: 20px !important; max-width: 1200px; margin: 0 auto !important; }
          .t-title { font-size: 22px !important; }
          .t-subtitle { font-size: 13px !important; }
          .t-chips-row { padding: 0 !important; }
          .t-list-header { display: grid !important; }
          .t-row-mobile { display: none !important; }
          .t-row-desktop { display: grid !important; }
          .t-side-panel {
            top: 92px !important; right: 20px !important; left: auto !important; bottom: auto !important;
            width: 360px !important; max-height: calc(100vh - 112px) !important;
            border-radius: 4px !important;
            animation: fluentSlideIn 220ms ease both !important;
            box-shadow: 0 8px 16px rgba(0,0,0,0.10), 0 0 2px rgba(0,0,0,0.12) !important;
          }
          .t-sheet-handle-wrap { display: none !important; }
        }
      `}</style>

      {/* TOP BAR */}
      <header
        className="t-topbar"
        style={{
          height: 48,
          background: F.brand,
          color: "#fff",
          display: "flex",
          alignItems: "center",
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
          <span className="t-brand-text" style={{ fontSize: 14, fontWeight: 600 }}>
            Kerala Election Pulse
          </span>
        </Link>

        <div
          className="t-search"
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
            placeholder="Search constituencies, candidates"
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

        <button className="t-topbar-icons" style={iconBtn}>
          <Bell size={16} />
        </button>
        <button className="t-topbar-icons" style={iconBtn}>
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

      {/* PIVOT */}
      <div
        className="t-pivot"
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
          { key: "browse", label: "Browse", active: true },
          { key: "live", label: "Live", active: false },
          { key: "cand", label: "Candidates", active: false },
          { key: "party", label: "Parties", active: false },
        ].map((t) => (
          <button
            key={t.key}
            className={t.active ? "is-active" : ""}
            style={{
              background: "transparent",
              border: "none",
              height: 44,
              fontSize: 14,
              fontWeight: 600,
              color: t.active ? F.text1 : F.text2,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <main className="t-main">
        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <h1 className="t-title" style={{ fontWeight: 600, color: F.text1, margin: 0, letterSpacing: -0.2 }}>
            Browse Constituencies
          </h1>
          <p className="t-subtitle" style={{ color: F.text2, margin: "3px 0 0", fontWeight: 400 }}>
            {constituencies.length} constituencies · {districts.length} districts · Source: ECI
          </p>
        </div>

        {/* District filter chips — scrollable horizontally */}
        <div
          className="t-chips-row"
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 12,
            marginLeft: -12,
            marginRight: -12,
            scrollbarWidth: "none",
          }}
        >
          <style>{`.t-chips-row::-webkit-scrollbar { display: none; }`}</style>
          {[null, ...districts].map((d, i) => {
            const active = district === d;
            const count = d ? constituencies.filter((c) => c.district === d).length : constituencies.length;
            return (
              <button
                key={d ?? "all"}
                className="t-chip"
                onClick={() => setDistrict(d)}
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
                  flexShrink: 0,
                  marginLeft: i === 0 ? 12 : 0,
                  marginRight: i === districts.length ? 12 : 0,
                  whiteSpace: "nowrap",
                }}
              >
                {d ?? "All districts"}
                <span style={{ color: active ? F.brand : F.text3, fontSize: 11 }}>{count}</span>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: 12, color: F.text3, marginBottom: 10 }}>
          Showing <span style={{ color: F.text1, fontWeight: 600 }}>{filtered.length}</span>
          {district ? ` in ${district}` : ""}
        </div>

        {/* LIST */}
        <section
          style={{
            background: F.surface,
            border: `1px solid ${F.border}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Desktop header */}
          <div
            className="t-list-header"
            style={{
              gridTemplateColumns: "minmax(220px, 1.4fr) 1fr 1fr 1fr",
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
            <span>LDF</span>
            <span>UDF</span>
            <span>NDA</span>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: F.text3, fontSize: 13 }}>
              No constituencies match.
            </div>
          )}

          {filtered.map((c) => {
            const isSelected = selectedNo === c.no;
            return (
              <div key={c.no} style={{ borderBottom: `1px solid ${F.border}` }}>
                {/* DESKTOP ROW */}
                <div
                  className={`t-row t-row-desktop${isSelected ? " is-selected" : ""}`}
                  onClick={() => setSelectedNo(isSelected ? null : c.no)}
                  style={{
                    gridTemplateColumns: "minmax(220px, 1.4fr) 1fr 1fr 1fr",
                    padding: "10px 16px",
                    alignItems: "center",
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

                  {(["ldf", "udf", "nda"] as const).map((a) => {
                    const cand = c[a];
                    return (
                      <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <Persona name={cand.candidate} alliance={a} size={26} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: F.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {cand.candidate}
                          </div>
                          <div style={{ fontSize: 10, color: F.text3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {cand.party}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* MOBILE ROW */}
                <div
                  className={`t-row t-row-mobile${isSelected ? " is-selected" : ""}`}
                  onClick={() => setSelectedNo(isSelected ? null : c.no)}
                  style={{
                    flexDirection: "column",
                    gap: 10,
                    padding: "12px 14px",
                  }}
                >
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
                      }}
                    >
                      {c.no.toString().padStart(3, "0")}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: F.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "18px" }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: F.text3, lineHeight: "14px" }}>{c.district}</div>
                    </div>
                    <ChevronRight size={16} style={{ color: F.text3, flexShrink: 0 }} />
                  </div>

                  {/* 3 candidates row, compact */}
                  <div style={{ display: "flex", gap: 6, paddingLeft: 40, width: "100%" }}>
                    {(["ldf", "udf", "nda"] as const).map((a) => {
                      const cand = c[a];
                      const meta = ALLIANCE_META[a];
                      return (
                        <div
                          key={a}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 7px",
                            borderRadius: 4,
                            background: meta.tint,
                            border: `1px solid ${meta.color}22`,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: meta.color,
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 9, color: meta.color, fontWeight: 600, lineHeight: "10px", letterSpacing: 0.2 }}>
                              {meta.label}
                            </div>
                            <div style={{ fontSize: 11, color: F.text1, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "14px" }}>
                              {cand.candidate.split(" ").slice(0, 2).join(" ")}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <p style={{ marginTop: 16, fontSize: 11, color: F.text3, textAlign: "center" }}>
          Demo · Microsoft Teams Fluent UI styling · Tap a row for details
        </p>
      </main>

      {/* DETAIL PANEL / BOTTOM SHEET */}
      {selected && (
        <>
          <div
            className="t-sheet-handle-wrap"
            onClick={() => setSelectedNo(null)}
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
            className="t-side-panel"
            style={{
              position: "fixed",
              background: F.surface,
              border: `1px solid ${F.border}`,
              zIndex: 25,
              overflow: "auto",
            }}
          >
            <div
              className="t-sheet-handle-wrap"
              style={{ display: "none", paddingTop: 8, paddingBottom: 4, justifyContent: "center" }}
            >
              <span style={{ width: 36, height: 4, borderRadius: 2, background: F.borderStrong }} />
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
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  background: "transparent",
                  border: "none",
                  color: F.text2,
                  cursor: "pointer",
                  fontSize: 20,
                  lineHeight: 1,
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: F.text3, fontWeight: 600, marginBottom: 8, letterSpacing: 0.3 }}>
                MAIN CANDIDATES
              </div>
              {(["ldf", "udf", "nda"] as const).map((a) => {
                const cand = selected[a];
                const meta = ALLIANCE_META[a];
                return (
                  <div
                    key={a}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      borderRadius: 4,
                      border: `1px solid ${F.border}`,
                      borderLeft: `3px solid ${meta.color}`,
                      marginBottom: 8,
                      background: F.surface,
                    }}
                  >
                    <Persona name={cand.candidate} alliance={a} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: F.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {cand.candidate}
                      </div>
                      <div style={{ fontSize: 11, color: F.text3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {cand.party}
                      </div>
                      {(cand.age !== null || cand.education) && (
                        <div style={{ fontSize: 10, color: F.text3, marginTop: 3 }}>
                          {cand.age !== null && <span>{cand.age}y</span>}
                          {cand.age !== null && cand.education && " · "}
                          {cand.education}
                        </div>
                      )}
                    </div>
                    <span style={pillStyle(meta.tint, meta.color)}>{meta.label}</span>
                  </div>
                );
              })}

              {selected.others.length > 0 && (
                <>
                  <div style={{ fontSize: 11, color: F.text3, fontWeight: 600, margin: "16px 0 8px", letterSpacing: 0.3 }}>
                    OTHER CANDIDATES · {selected.others.length}
                  </div>
                  {selected.others.slice(0, 8).map((o, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        borderBottom: `1px solid ${F.border}`,
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: F.surfaceHover,
                          color: F.text3,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {o.candidate.split(" ")[0]?.[0] ?? "?"}
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 12, color: F.text1, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {o.candidate}
                        </div>
                        <div style={{ fontSize: 10, color: F.text3 }}>{o.party}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
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
