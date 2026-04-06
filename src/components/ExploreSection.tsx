"use client";

import { useState, useMemo } from "react";
import {
  getAllConstituencies,
  getConstituenciesByDistrict,
  getCelebritySeats,
  type Constituency,
} from "@/lib/data";
import DistrictSelector from "./DistrictSelector";
import SearchBar from "./SearchBar";
import BattleCard from "./BattleCard";
import AllianceStats from "./AllianceStats";

export default function ExploreSection() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [focusedConstituency, setFocusedConstituency] = useState<Constituency | null>(null);

  const celebSeats = useMemo(() => getCelebritySeats(), []);
  const celebNos = useMemo(() => new Set(celebSeats.map((c) => c.no)), [celebSeats]);

  const constituencies = useMemo(() => {
    if (focusedConstituency) return [focusedConstituency];
    if (selectedDistrict) return getConstituenciesByDistrict(selectedDistrict);
    return getAllConstituencies();
  }, [selectedDistrict, focusedConstituency]);

  const handleSearch = (c: Constituency) => {
    setFocusedConstituency(c);
    setSelectedDistrict(null);
  };

  const handleDistrictSelect = (d: string | null) => {
    setSelectedDistrict(d);
    setFocusedConstituency(null);
  };

  return (
    <section id="explore" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-3">
            Explore <span className="gold-shimmer">All Battles</span>
          </h2>
          <p className="text-ivory-dark/50 max-w-lg mx-auto mb-8">
            140 constituencies, 3 alliances, one epic showdown
          </p>

          {/* Search */}
          <div className="mb-8">
            <SearchBar onSelect={handleSearch} />
          </div>

          {/* Alliance stats */}
          <AllianceStats />

          {/* District filter */}
          <DistrictSelector
            selected={selectedDistrict}
            onSelect={handleDistrictSelect}
          />
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6 mt-10">
          <p className="text-ivory-dark/40 text-sm">
            Showing{" "}
            <span className="text-gold font-semibold">
              {constituencies.length}
            </span>{" "}
            {constituencies.length === 1 ? "constituency" : "constituencies"}
            {selectedDistrict && (
              <span>
                {" "}
                in <span className="text-gold-light">{selectedDistrict}</span>
              </span>
            )}
          </p>
          {(focusedConstituency || selectedDistrict) && (
            <button
              onClick={() => {
                setFocusedConstituency(null);
                setSelectedDistrict(null);
              }}
              className="text-gold/60 text-sm hover:text-gold transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Battle cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {constituencies.map((c, i) => {
            const celebSeat = celebSeats.find((cs) => cs.no === c.no);
            return (
              <BattleCard
                key={c.no}
                constituency={c}
                index={i}
                isCelebrity={celebNos.has(c.no)}
                celebrityNote={celebSeat?.note}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
