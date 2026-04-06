"use client";

import { getCelebritySeats, getConstituencyByNo } from "@/lib/data";
import BattleCard from "./BattleCard";

export default function CelebritySpotlight() {
  const celebSeats = getCelebritySeats();

  return (
    <section id="celebrities" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 mb-4">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-gold-light text-sm font-medium tracking-wide">
              HOT SEATS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-3">
            Celebrity <span className="gold-shimmer">Spotlight</span>
          </h2>
          <p className="text-ivory-dark/50 max-w-lg mx-auto">
            The most-watched battles — from the Chief Minister&apos;s seat to Bollywood stars entering the arena
          </p>
        </div>

        {/* Celebrity battle cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {celebSeats.map((cs, i) => {
            const constituency = getConstituencyByNo(cs.no);
            if (!constituency) return null;
            return (
              <BattleCard
                key={cs.no}
                constituency={constituency}
                index={i}
                isCelebrity
                celebrityNote={cs.note}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
