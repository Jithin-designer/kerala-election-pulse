"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  X,
  MapPin,
  Filter,
  Flame,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  getAllDistricts,
  getAllConstituencies,
  getConstituenciesByDistrict,
  getCelebritySeats,
  searchConstituencies,
  type Constituency,
} from "@/lib/data";
import BrowseCard from "@/components/BrowseCard";

export default function BrowsePage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const districts = getAllDistricts();
  const celebSeats = useMemo(() => getCelebritySeats(), []);
  const celebNos = useMemo(() => new Set(celebSeats.map((c) => c.no)), [celebSeats]);

  // District constituencies for the constituency pill filter
  const districtConstituencies = useMemo(() => {
    if (!selectedDistrict) return [];
    return getConstituenciesByDistrict(selectedDistrict);
  }, [selectedDistrict]);

  // Filtered results
  const filteredConstituencies = useMemo(() => {
    if (searchQuery.length >= 2) {
      return searchConstituencies(searchQuery);
    }
    if (selectedConstituency) {
      const all = selectedDistrict
        ? getConstituenciesByDistrict(selectedDistrict)
        : getAllConstituencies();
      return all.filter((c) => c.name === selectedConstituency);
    }
    if (selectedDistrict) {
      return getConstituenciesByDistrict(selectedDistrict);
    }
    return getAllConstituencies();
  }, [selectedDistrict, selectedConstituency, searchQuery]);

  // Group by district for the "All Districts" view
  const groupedByDistrict = useMemo(() => {
    if (selectedDistrict || searchQuery.length >= 2) return null;

    const groups: { district: string; constituencies: Constituency[] }[] = [];
    for (const district of districts) {
      groups.push({
        district,
        constituencies: getConstituenciesByDistrict(district),
      });
    }
    return groups;
  }, [selectedDistrict, searchQuery, districts]);

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

  return (
    <div className="min-h-screen bg-black">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Home</span>
          </Link>

          <h1 className="text-white font-black text-lg tracking-tight">
            Browse <span className="text-gold">Battles</span>
          </h1>

          <button
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchQuery("");
            }}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
          >
            {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedDistrict(null);
                      setSelectedConstituency(null);
                    }}
                    placeholder="Search candidates, constituencies..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── District Filter Pills ── */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max">
            <button
              onClick={clearFilters}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !selectedDistrict
                  ? "bg-gold text-black shadow-lg shadow-gold/20"
                  : "bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/10"
              }`}
            >
              <Filter className="w-3 h-3" />
              All Districts
            </button>
            {districts.map((d) => {
              const count = getConstituenciesByDistrict(d).length;
              const isActive = selectedDistrict === d;
              return (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDistrict(isActive ? null : d);
                    setSelectedConstituency(null);
                    setSearchQuery("");
                    setShowSearch(false);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-gold text-black shadow-lg shadow-gold/20"
                      : "bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/10"
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {d}
                  <span className={`text-[10px] ${isActive ? "text-black/50" : "text-white/25"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Constituency Sub-filter (when a district is selected) ── */}
        <AnimatePresence>
          {selectedDistrict && districtConstituencies.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="px-4 py-2.5 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1.5 w-max">
                  <button
                    onClick={() => setSelectedConstituency(null)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                      !selectedConstituency
                        ? "bg-white/15 text-white"
                        : "text-white/30 hover:text-white/50"
                    }`}
                  >
                    All ({districtConstituencies.length})
                  </button>
                  {districtConstituencies.map((c) => (
                    <button
                      key={c.no}
                      onClick={() =>
                        setSelectedConstituency(
                          selectedConstituency === c.name ? null : c.name
                        )
                      }
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                        selectedConstituency === c.name
                          ? "bg-white/15 text-white"
                          : "text-white/30 hover:text-white/50"
                      }`}
                    >
                      {celebNos.has(c.no) && (
                        <Flame className="w-2.5 h-2.5 text-orange-400" />
                      )}
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
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <p className="text-white/25 text-xs">
          Showing{" "}
          <span className="text-gold font-bold">
            {groupedByDistrict
              ? getAllConstituencies().length
              : filteredConstituencies.length}
          </span>{" "}
          constituencies
          {selectedDistrict && (
            <span>
              {" "}in <span className="text-gold-light">{selectedDistrict}</span>
            </span>
          )}
          {searchQuery && (
            <span>
              {" "}matching &ldquo;<span className="text-gold-light">{searchQuery}</span>&rdquo;
            </span>
          )}
        </p>
        {hasActiveFilter && (
          <button
            onClick={clearFilters}
            className="text-white/25 text-xs flex items-center gap-1 hover:text-white/50 transition-colors"
          >
            Clear <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ═══════ CONTENT ═══════ */}
      <main className="pb-12">
        {groupedByDistrict ? (
          /* ── ALL DISTRICTS VIEW: horizontal scroll per district ── */
          <div className="space-y-8">
            {groupedByDistrict.map((group) => (
              <section key={group.district}>
                {/* District header */}
                <div className="flex items-center justify-between px-5 mb-3">
                  <div>
                    <h2 className="text-white font-bold text-lg">
                      {group.district}
                    </h2>
                    <p className="text-white/20 text-xs">
                      {group.constituencies.length} constituencies
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDistrict(group.district);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center gap-1 text-gold/60 text-xs font-medium hover:text-gold transition-colors"
                  >
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Horizontal scroll */}
                <div className="overflow-x-auto scrollbar-hide pl-5 pr-2">
                  <div className="flex gap-4 pb-2 w-max">
                    {group.constituencies.map((c, i) => {
                      const celeb = celebSeats.find((cs) => cs.no === c.no);
                      return (
                        <BrowseCard
                          key={c.no}
                          constituency={c}
                          index={i}
                          isCelebrity={celebNos.has(c.no)}
                          celebrityNote={celeb?.note}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* ── FILTERED VIEW: horizontal scroll for results ── */
          <div className="overflow-x-auto scrollbar-hide pl-5 pr-2 pt-2">
            <div className="flex gap-4 pb-4 w-max">
              {filteredConstituencies.map((c, i) => {
                const celeb = celebSeats.find((cs) => cs.no === c.no);
                return (
                  <BrowseCard
                    key={c.no}
                    constituency={c}
                    index={i}
                    isCelebrity={celebNos.has(c.no)}
                    celebrityNote={celeb?.note}
                  />
                );
              })}
            </div>
          </div>
        )}

        {filteredConstituencies.length === 0 && !groupedByDistrict && (
          <div className="text-center py-20 px-6">
            <p className="text-white/20 text-lg mb-2">No results found</p>
            <p className="text-white/10 text-sm">Try a different search or filter</p>
          </div>
        )}
      </main>
    </div>
  );
}
