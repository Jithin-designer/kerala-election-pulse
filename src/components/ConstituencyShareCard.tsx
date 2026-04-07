"use client";

/**
 * ConstituencyShareCard
 *
 * Page-level controller that captures a constituency as a PNG and triggers
 * the native share sheet. The off-screen 900px shareable div is only mounted
 * while a constituency is set, so we avoid 140 hidden DOM trees.
 *
 * Usage:
 *   const [share, setShare] = useState<Constituency | null>(null);
 *   <ConstituencyShareCard constituency={share} onDone={() => setShare(null)} />
 */

import { useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";
import type { Constituency } from "@/lib/data";
import { getPartyFullName } from "@/lib/data";
import { getCandidatePhoto } from "@/lib/candidateImages";

const ALLIANCE = {
  ldf: { label: "LDF", color: "#dc2626" },
  udf: { label: "UDF", color: "#2563eb" },
  nda: { label: "NDA", color: "#f59e0b" },
} as const;

function formatAssets(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return value > 0 ? `₹${value}` : "—";
}

interface Props {
  constituency: Constituency | null;
  onDone: () => void;
}

export default function ConstituencyShareCard({ constituency, onDone }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!constituency) return;
    let cancelled = false;

    // Wait one tick so the off-screen div is in the DOM and images get a chance to load.
    const timer = window.setTimeout(async () => {
      if (cancelled || !ref.current) return;
      try {
        const dataUrl = await htmlToImage.toPng(ref.current, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: "#0a0a0a",
        });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File(
          [blob],
          `${constituency.name.replace(/\s+/g, "-")}-kerala2026.png`,
          { type: "image/png" }
        );
        const shareData: ShareData = {
          title: `${constituency.name} — Kerala 2026`,
          text: `${constituency.name} (${constituency.district}) — Kerala Assembly Election 2026\n#KeralaElection2026`,
          files: [file],
        };
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else if (navigator.share) {
          await navigator.share({ title: shareData.title, text: shareData.text });
        } else {
          const link = document.createElement("a");
          link.download = file.name;
          link.href = dataUrl;
          link.click();
        }
      } catch (err) {
        console.warn("Constituency share failed:", err);
      } finally {
        if (!cancelled) onDone();
      }
    }, 500); // give images time to fetch

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [constituency, onDone]);

  if (!constituency) return null;

  const total = 3 + (constituency.others?.length ?? 0);

  return (
    <>
      {/* Tiny on-screen "Generating image…" toast */}
      <div
        style={{
          position: "fixed",
          bottom: "calc(env(safe-area-inset-bottom) + 80px)",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 18px",
          borderRadius: 999,
          background: "rgba(10,10,10,0.92)",
          color: "#f5f0e8",
          fontSize: 13,
          fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          zIndex: 300,
          pointerEvents: "none",
        }}
      >
        Generating share image…
      </div>

      {/* Off-screen shareable card */}
      <div
        style={{ position: "fixed", top: 0, left: "-9999px", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div
          ref={ref}
          style={{
            width: "900px",
            background: "linear-gradient(180deg, #0a0a0a 0%, #0d1410 100%)",
            color: "#f5f0e8",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "44px 44px 40px",
            borderRadius: "32px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Brand header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#d4a843",
                  color: "#060e09",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  fontWeight: 900,
                }}
              >
                K
              </div>
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 700,
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  Kerala Election Pulse
                </p>
                <p style={{ fontSize: "16px", color: "#d4a843", fontWeight: 700, margin: "2px 0 0 0" }}>
                  Assembly Elections 2026
                </p>
              </div>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                textAlign: "right",
              }}
            >
              Constituency
              <div
                style={{
                  fontSize: "20px",
                  color: "#d4a843",
                  fontFamily: "monospace",
                  letterSpacing: 0,
                  marginTop: 2,
                }}
              >
                #{String(constituency.no).padStart(3, "0")}
              </div>
            </div>
          </div>

          {/* Constituency title */}
          <div style={{ marginBottom: "28px" }}>
            <h1
              style={{
                fontSize: "52px",
                fontWeight: 900,
                lineHeight: 1.05,
                margin: 0,
                color: "#fff",
                letterSpacing: "-0.015em",
              }}
            >
              {constituency.name}
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.5)",
                margin: "8px 0 0 0",
                fontWeight: 500,
              }}
            >
              {constituency.district} district
              {constituency.reserved ? `  ·  ${constituency.reserved}` : ""}
              {`  ·  ${total} candidates`}
            </p>
          </div>

          {/* 3 main candidate cards stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {(["ldf", "udf", "nda"] as const).map((a) => {
              const cand = constituency[a];
              const theme = ALLIANCE[a];
              const photo = getCandidatePhoto(cand.candidate, constituency.name, theme.color);
              const fullParty = getPartyFullName(cand.party);
              return (
                <div
                  key={a}
                  style={{
                    padding: "20px 22px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderLeft: `4px solid ${theme.color}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "92px",
                      height: "92px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      flexShrink: 0,
                      boxShadow: `0 0 0 4px ${theme.color}25`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={cand.candidate}
                      crossOrigin="anonymous"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: 999,
                          background: theme.color,
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: 900,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {theme.label}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.6)",
                          fontWeight: 600,
                        }}
                      >
                        {cand.party}
                        {fullParty !== cand.party ? ` · ${fullParty}` : ""}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "26px",
                        fontWeight: 900,
                        margin: "2px 0 8px 0",
                        color: "#fff",
                        lineHeight: 1.15,
                      }}
                    >
                      {cand.candidate}
                      {cand.age && (
                        <span
                          style={{
                            fontSize: "16px",
                            color: "rgba(255,255,255,0.45)",
                            fontWeight: 600,
                            marginLeft: "10px",
                          }}
                        >
                          {cand.age}y
                        </span>
                      )}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {cand.education && (
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.75)",
                            fontWeight: 600,
                          }}
                        >
                          {cand.education}
                        </span>
                      )}
                      {cand.assets_value > 0 && (
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: "rgba(212,168,67,0.08)",
                            border: "1px solid rgba(212,168,67,0.22)",
                            fontSize: "11px",
                            color: "#d4a843",
                            fontWeight: 700,
                          }}
                        >
                          {formatAssets(cand.assets_value)}
                        </span>
                      )}
                      {cand.criminal_cases > 0 && (
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: "rgba(220,38,38,0.10)",
                            border: "1px solid rgba(220,38,38,0.28)",
                            fontSize: "11px",
                            color: "#ef4444",
                            fontWeight: 700,
                          }}
                        >
                          {cand.criminal_cases} case{cand.criminal_cases > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              paddingTop: "18px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
              Data: MyNeta.info · Election Commission of India
            </p>
            <p style={{ fontSize: "12px", color: "#d4a843", fontWeight: 700, margin: 0 }}>
              kerala-election-pulse.vercel.app
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
