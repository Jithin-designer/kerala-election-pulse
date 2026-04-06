"use client";

import { useState, useRef, useEffect } from "react";
import { searchConstituencies, type Constituency } from "@/lib/data";

interface Props {
  onSelect: (constituency: Constituency) => void;
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Constituency[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchConstituencies(query).slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search candidates, constituencies, or districts..."
          className="w-full pl-12 pr-4 py-3.5 rounded-full glass-card text-ivory placeholder-ivory-dark/30 focus:outline-none focus:ring-2 focus:ring-gold/30 text-sm"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-card rounded-2xl overflow-hidden z-50 shadow-2xl">
          {results.map((c) => (
            <button
              key={c.no}
              onClick={() => {
                onSelect(c);
                setQuery("");
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gold/5 transition-colors border-b border-white/5 last:border-none"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gold font-semibold text-sm">
                    {c.name}
                  </span>
                  <span className="text-ivory-dark/40 text-xs ml-2">
                    {c.district}
                  </span>
                </div>
                <span className="text-ivory-dark/20 text-xs font-mono">
                  #{c.no}
                </span>
              </div>
              <div className="flex gap-3 mt-1">
                <span className="text-red-400/60 text-xs">{c.ldf.candidate}</span>
                <span className="text-blue-400/60 text-xs">{c.udf.candidate}</span>
                <span className="text-amber-400/60 text-xs">{c.nda.candidate}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
