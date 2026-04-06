"use client";

import { getAllDistricts, getConstituenciesByDistrict } from "@/lib/data";

interface Props {
  selected: string | null;
  onSelect: (district: string | null) => void;
}

export default function DistrictSelector({ selected, onSelect }: Props) {
  const districts = getAllDistricts();

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selected === null
              ? "bg-gradient-to-r from-gold-dark to-gold text-emerald-deep shadow-[0_0_20px_rgba(212,168,67,0.3)]"
              : "border border-gold/20 text-ivory-dark/60 hover:border-gold/40 hover:text-gold-light"
          }`}
        >
          All Districts
        </button>

        {districts.map((district) => {
          const count = getConstituenciesByDistrict(district).length;
          const isActive = selected === district;

          return (
            <button
              key={district}
              onClick={() => onSelect(isActive ? null : district)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                isActive
                  ? "bg-gradient-to-r from-gold-dark to-gold text-emerald-deep shadow-[0_0_20px_rgba(212,168,67,0.3)]"
                  : "border border-emerald-mid/30 text-ivory-dark/60 hover:border-gold/40 hover:text-gold-light"
              }`}
            >
              {district}
              <span
                className={`ml-1.5 text-xs ${
                  isActive ? "text-emerald-deep/70" : "text-ivory-dark/30"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
