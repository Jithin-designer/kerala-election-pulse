"use client";

const alliances = [
  {
    name: "LDF",
    full: "Left Democratic Front",
    color: "#dc2626",
    gradient: "from-red-700 to-red-500",
    seats: 140,
    leadParty: "CPI(M)",
  },
  {
    name: "UDF",
    full: "United Democratic Front",
    color: "#2563eb",
    gradient: "from-blue-700 to-blue-500",
    seats: 140,
    leadParty: "INC",
  },
  {
    name: "NDA",
    full: "National Democratic Alliance",
    color: "#f59e0b",
    gradient: "from-amber-600 to-amber-400",
    seats: 140,
    leadParty: "BJP",
  },
];

export default function AllianceStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
      {alliances.map((a) => (
        <div
          key={a.name}
          className="glass-card rounded-2xl p-5 text-center hover:scale-[1.02] transition-transform"
        >
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${a.gradient} text-white font-bold text-lg mb-3`}
          >
            {a.name[0]}
          </div>
          <h3 className="text-ivory font-bold text-xl">{a.name}</h3>
          <p className="text-ivory-dark/40 text-xs mb-2">{a.full}</p>
          <p className="text-ivory-dark/50 text-sm">
            Lead: <span className="text-gold-light">{a.leadParty}</span>
          </p>
          <div className="mt-3 pt-3 border-t border-white/5">
            <span className="text-ivory-dark/30 text-xs uppercase tracking-widest">
              Contesting
            </span>
            <p className="text-2xl font-bold" style={{ color: a.color }}>
              {a.seats}
            </p>
            <span className="text-ivory-dark/30 text-xs">seats</span>
          </div>
        </div>
      ))}
    </div>
  );
}
