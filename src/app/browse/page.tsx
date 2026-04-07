"use client";

import { Suspense, useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  X,
  MapPin,
  Filter,
  Flame,
  ChevronRight,
  Trophy,
  IndianRupee,
  AlertTriangle,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  getAllDistricts,
  getAllConstituencies,
  getConstituenciesByDistrict,
  getCelebritySeats,
  searchConstituencies,
  type Constituency,
  type PartyCandidate,
} from "@/lib/data";
import BrowseCard from "@/components/BrowseCard";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import CandidateDetailModal, {
  type DetailCandidate,
} from "@/components/CandidateDetailModal";

/* ── Tab types ── */
type Tab = "constituencies" | "cases" | "networth" | "party";

/* ── Flatten all candidates for leaderboards ── */
interface FlatCandidate {
  name: string;
  party: string;
  alliance: string;
  constituency: string;
  district: string;
  age: number | null;
  education: string;
  profession: string;
  assets_value: number;
  assets: string;
  criminal_cases: number;
}

function flattenCandidates(constituencies: Constituency[]): FlatCandidate[] {
  const result: FlatCandidate[] = [];
  for (const c of constituencies) {
    for (const a of ["ldf", "udf", "nda"] as const) {
      const cand = c[a];
      result.push({
        name: cand.candidate,
        party: cand.party,
        alliance: a.toUpperCase(),
        constituency: c.name,
        district: c.district,
        age: cand.age,
        education: cand.education,
        profession: cand.profession,
        assets_value: cand.assets_value,
        assets: cand.assets,
        criminal_cases: cand.criminal_cases,
      });
    }
    for (const o of c.others || []) {
      result.push({
        name: o.candidate,
        party: o.party,
        alliance: "OTH",
        constituency: c.name,
        district: c.district,
        age: o.age,
        education: o.education,
        profession: o.profession,
        assets_value: o.assets_value,
        assets: o.assets,
        criminal_cases: o.criminal_cases,
      });
    }
  }
  return result;
}

function formatAssets(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return value > 0 ? `₹${value}` : "";
}

const ALLIANCE_COLORS: Record<string, string> = {
  LDF: "text-red-400",
  UDF: "text-blue-400",
  NDA: "text-amber-400",
  OTH: "text-white/40",
};

/* ── Leaderboard Row ── */
function LeaderboardRow({
  rank,
  candidate,
  metric,
  metricLabel,
  metricColor,
}: {
  rank: number;
  candidate: FlatCandidate;
  metric: string;
  metricLabel?: string;
  metricColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-none">
      <span className={`w-7 text-center font-black text-sm ${rank <= 3 ? "text-gold" : "text-white/20"}`}>
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate">
          {candidate.name}
          {candidate.age && <span className="text-white/25 font-normal text-xs ml-1">{candidate.age}y</span>}
        </p>
        <p className="text-white/30 text-[11px] truncate">
          <span className={ALLIANCE_COLORS[candidate.alliance] || "text-white/30"}>
            {candidate.alliance}
          </span>
          {" · "}{candidate.party} · {candidate.constituency}
        </p>
      </div>
      <span className={`font-bold text-sm shrink-0 ${metricColor || "text-white/60"}`}>
        {metric}
      </span>
    </div>
  );
}

/* ── Party Card ── */
function PartySection({
  party,
  candidates,
}: {
  party: string;
  candidates: FlatCandidate[];
}) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? candidates : candidates.slice(0, 5);

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
        <div>
          <h3 className="text-white font-bold text-sm">{party}</h3>
          <p className="text-white/25 text-[10px]">{candidates.length} candidates</p>
        </div>
      </div>
      <div className="px-4">
        {display.map((c, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.03] last:border-none">
            <span className="w-5 text-white/15 text-[10px] text-center font-mono">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs font-semibold truncate">{c.name}</p>
              <p className="text-white/25 text-[10px] truncate">{c.constituency} · {c.district}</p>
            </div>
            {c.assets_value > 0 && (
              <span className="text-emerald-glow/60 text-[10px] font-semibold shrink-0">
                {formatAssets(c.assets_value)}
              </span>
            )}
            {c.criminal_cases > 0 && (
              <span className="text-red-400/60 text-[10px] shrink-0">{c.criminal_cases}c</span>
            )}
          </div>
        ))}
      </div>
      {candidates.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2.5 text-gold/50 text-xs font-medium hover:text-gold/80 transition-colors border-t border-white/[0.04]"
        >
          {showAll ? "Show less" : `Show all ${candidates.length}`}
        </button>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--theme-bg)" }} />}>
      <BrowsePageInner />
    </Suspense>
  );
}

function BrowsePageInner() {
  const searchParams = useSearchParams();
  const initialDistrict = searchParams.get("district");

  const [activeTab, setActiveTab] = useState<Tab>("constituencies");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(initialDistrict);
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState<DetailCandidate | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const districts = getAllDistricts();
  const allConstituencies = useMemo(() => getAllConstituencies(), []);
  const celebSeats = useMemo(() => getCelebritySeats(), []);
  const celebNos = useMemo(() => new Set(celebSeats.map((c) => c.no)), [celebSeats]);

  const allCandidates = useMemo(() => flattenCandidates(allConstituencies), [allConstituencies]);

  const districtConstituencies = useMemo(() => {
    if (!selectedDistrict) return [];
    return getConstituenciesByDistrict(selectedDistrict);
  }, [selectedDistrict]);

  const filteredConstituencies = useMemo(() => {
    if (searchQuery.length >= 2) return searchConstituencies(searchQuery);
    if (selectedConstituency) {
      const all = selectedDistrict
        ? getConstituenciesByDistrict(selectedDistrict)
        : allConstituencies;
      return all.filter((c) => c.name === selectedConstituency);
    }
    if (selectedDistrict) return getConstituenciesByDistrict(selectedDistrict);
    return allConstituencies;
  }, [selectedDistrict, selectedConstituency, searchQuery, allConstituencies]);

  const groupedByDistrict = useMemo(() => {
    if (selectedDistrict || searchQuery.length >= 2) return null;
    return districts.map((district) => ({
      district,
      constituencies: getConstituenciesByDistrict(district),
    }));
  }, [selectedDistrict, searchQuery, districts]);

  // Leaderboards
  const casesLeaderboard = useMemo(
    () => allCandidates.filter((c) => c.criminal_cases > 0).sort((a, b) => b.criminal_cases - a.criminal_cases).slice(0, 20),
    [allCandidates]
  );
  const networthLeaderboard = useMemo(
    () => allCandidates.filter((c) => c.assets_value > 0).sort((a, b) => b.assets_value - a.assets_value).slice(0, 20),
    [allCandidates]
  );

  // Party grouping
  const byParty = useMemo(() => {
    const map = new Map<string, FlatCandidate[]>();
    for (const c of allCandidates) {
      const list = map.get(c.party) || [];
      list.push(c);
      map.set(c.party, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [allCandidates]);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  function clearFilters() {
    setSelectedDistrict(null);
    setSelectedConstituency(null);
    setSearchQuery("");
    setShowSearch(false);
  }

  const hasActiveFilter = selectedDistrict || selectedConstituency || searchQuery;

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "constituencies", label: "All", icon: <MapPin className="w-3.5 h-3.5" /> },
    { key: "cases", label: "Cases", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { key: "networth", label: "Net Worth", icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { key: "party", label: "By Party", icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "color-mix(in srgb, var(--theme-bg) 80%, transparent)", borderBottom: "1px solid var(--theme-border)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Home</span>
          </Link>
          <h1 className="theme-text font-black text-lg tracking-tight">
            Browse <span className="theme-accent">Battles</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(""); }}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              style={{ background: "var(--theme-border)", color: "var(--theme-text-secondary)" }}
            >
              {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
            <ThemeSwitcher compact />
          </div>
        </div>

        {/* Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    ref={searchRef} type="text" value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSelectedDistrict(null); setSelectedConstituency(null); setActiveTab("constituencies"); }}
                    placeholder="Search candidates, constituencies..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* District filter (only for constituencies tab) */}
        {activeTab === "constituencies" && (
          <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 w-max">
              <button
                onClick={clearFilters}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  !selectedDistrict ? "bg-white/15 text-white" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08]"
                }`}
              >
                <Filter className="w-3 h-3" />
                All
              </button>
              {districts.map((d) => {
                const count = getConstituenciesByDistrict(d).length;
                const isActive = selectedDistrict === d;
                return (
                  <button key={d} onClick={() => { setSelectedDistrict(isActive ? null : d); setSelectedConstituency(null); setSearchQuery(""); setShowSearch(false); }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive ? "bg-white/15 text-white" : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08]"
                    }`}
                  >
                    {d}
                    <span className={`text-[10px] ${isActive ? "text-white/50" : "text-white/20"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Constituency sub-filter */}
        <AnimatePresence>
          {activeTab === "constituencies" && selectedDistrict && districtConstituencies.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5">
              <div className="px-4 py-2.5 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1.5 w-max">
                  <button onClick={() => setSelectedConstituency(null)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${!selectedConstituency ? "bg-white/15 text-white" : "text-white/30 hover:text-white/50"}`}
                  >All ({districtConstituencies.length})</button>
                  {districtConstituencies.map((c) => (
                    <button key={c.no} onClick={() => setSelectedConstituency(selectedConstituency === c.name ? null : c.name)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${selectedConstituency === c.name ? "bg-white/15 text-white" : "text-white/30 hover:text-white/50"}`}
                    >
                      {celebNos.has(c.no) && <Flame className="w-2.5 h-2.5 text-orange-400" />}
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Results summary ── */}
      {activeTab === "constituencies" && (
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <p className="text-white/25 text-xs">
            <span className="text-gold font-bold">
              {groupedByDistrict ? allConstituencies.length : filteredConstituencies.length}
            </span> constituencies
            {selectedDistrict && <span> in <span className="text-gold-light">{selectedDistrict}</span></span>}
            {searchQuery && <span> for &ldquo;<span className="text-gold-light">{searchQuery}</span>&rdquo;</span>}
          </p>
          {hasActiveFilter && (
            <button onClick={clearFilters} className="text-white/25 text-xs flex items-center gap-1 hover:text-white/50 transition-colors">
              Clear <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* ═══════ CONTENT ═══════ */}
      <main className="pb-32">

        {/* ── TAB: Constituencies ── */}
        {activeTab === "constituencies" && (
          <>
            {groupedByDistrict ? (
              <div className="space-y-10">
                {groupedByDistrict.map((group) => (
                  <section key={group.district}>
                    <div className="flex items-center justify-between px-5 mb-4">
                      <div>
                        <h2 className="text-white font-bold text-lg">{group.district}</h2>
                        <p className="text-white/20 text-xs">{group.constituencies.length} constituencies</p>
                      </div>
                      <button onClick={() => { setSelectedDistrict(group.district); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="flex items-center gap-1 text-gold/60 text-xs font-medium hover:text-gold transition-colors"
                      >
                        View all <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="px-4 space-y-4">
                      {group.constituencies.map((c, i) => {
                        const celeb = celebSeats.find((cs) => cs.no === c.no);
                        return <BrowseCard key={c.no} constituency={c} index={i} isCelebrity={celebNos.has(c.no)} celebrityNote={celeb?.note} onCandidateClick={setDetailCandidate} />;
                      })}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="px-4 space-y-4 pt-2">
                {filteredConstituencies.map((c, i) => {
                  const celeb = celebSeats.find((cs) => cs.no === c.no);
                  return <BrowseCard key={c.no} constituency={c} index={i} isCelebrity={celebNos.has(c.no)} celebrityNote={celeb?.note} onCandidateClick={setDetailCandidate} />;
                })}
              </div>
            )}
            {filteredConstituencies.length === 0 && !groupedByDistrict && (
              <div className="text-center py-20 px-6">
                <p className="text-white/20 text-lg mb-2">No results found</p>
                <p className="text-white/10 text-sm">Try a different search or filter</p>
              </div>
            )}
          </>
        )}

        {/* ── TAB: Cases Leaderboard ── */}
        {activeTab === "cases" && (
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 mb-4 px-1">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <h2 className="text-white font-bold text-lg">Cases Leaderboard</h2>
                <p className="text-white/25 text-xs">Candidates with most pending criminal cases</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden px-3">
              {casesLeaderboard.map((c, i) => (
                <LeaderboardRow
                  key={i}
                  rank={i + 1}
                  candidate={c}
                  metric={`${c.criminal_cases} cases`}
                  metricColor="text-red-400"
                />
              ))}
              {casesLeaderboard.length === 0 && (
                <p className="text-white/20 text-sm py-8 text-center">No criminal case data available</p>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: Net Worth Leaderboard ── */}
        {activeTab === "networth" && (
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 mb-4 px-1">
              <IndianRupee className="w-5 h-5 text-emerald-glow" />
              <div>
                <h2 className="text-white font-bold text-lg">Net Worth Leaderboard</h2>
                <p className="text-white/25 text-xs">Wealthiest candidates by declared assets</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden px-3">
              {networthLeaderboard.map((c, i) => (
                <LeaderboardRow
                  key={i}
                  rank={i + 1}
                  candidate={c}
                  metric={formatAssets(c.assets_value)}
                  metricColor="text-emerald-glow"
                />
              ))}
              {networthLeaderboard.length === 0 && (
                <p className="text-white/20 text-sm py-8 text-center">No asset data available</p>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: By Party ── */}
        {activeTab === "party" && (
          <div className="px-4 pt-4 space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Users className="w-5 h-5 text-gold" />
              <div>
                <h2 className="text-white font-bold text-lg">Candidates by Party</h2>
                <p className="text-white/25 text-xs">All parties contesting Kerala 2026</p>
              </div>
            </div>
            {byParty.map(([party, candidates]) => (
              <PartySection key={party} party={party} candidates={candidates} />
            ))}
          </div>
        )}
      </main>

      {/* ═══════ Pinned Bottom Nav Tabs ═══════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{
          background: "color-mix(in srgb, var(--theme-bg) 90%, transparent)",
          borderTop: "1px solid var(--theme-border)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-center justify-around max-w-2xl mx-auto px-2 py-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  clearFilters();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                style={{
                  color: isActive ? "var(--theme-accent)" : "var(--theme-text-muted)",
                }}
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all"
                  style={{
                    background: isActive ? "var(--theme-accent)" : "transparent",
                    color: isActive ? "var(--theme-accent-contrast)" : "var(--theme-text-muted)",
                  }}
                >
                  {tab.icon}
                </div>
                <span className="text-[10px] font-bold tracking-wide">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Candidate Detail Modal ── */}
      <CandidateDetailModal
        candidate={detailCandidate}
        onClose={() => setDetailCandidate(null)}
      />
    </div>
  );
}
