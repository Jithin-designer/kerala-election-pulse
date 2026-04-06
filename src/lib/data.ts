import rawData from "../kerala2026_candidates.json";

export interface PartyCandidate {
  party: string;
  candidate: string;
}

export interface OtherCandidate {
  candidate: string;
  party: string;
  criminal_cases: number;
  education: string;
  assets: string;
}

export interface Constituency {
  no: number;
  district: string;
  name: string;
  reserved: string | null;
  ldf: PartyCandidate;
  udf: PartyCandidate;
  nda: PartyCandidate;
  others: OtherCandidate[];
}

export interface CelebritySeat {
  no: number;
  name: string;
  note: string;
}

export interface ElectionData {
  meta: {
    election: string;
    polling_date: string;
    result_date: string;
    total_constituencies: number;
    total_districts: number;
    source: string;
    note: string;
    generated: string;
  };
  districts: string[];
  constituencies: Constituency[];
  celebrity_seats: CelebritySeat[];
  party_abbreviations: Record<string, string>;
}

const data = rawData as ElectionData;

export function getAllDistricts(): string[] {
  return data.districts;
}

export function getConstituenciesByDistrict(district: string): Constituency[] {
  return data.constituencies.filter(
    (c) => c.district.toLowerCase() === district.toLowerCase()
  );
}

export function getConstituencyByNo(no: number): Constituency | undefined {
  return data.constituencies.find((c) => c.no === no);
}

export function getCelebritySeats(): CelebritySeat[] {
  return data.celebrity_seats;
}

export function getCelebrityConstituencies(): Constituency[] {
  return data.celebrity_seats
    .map((cs) => data.constituencies.find((c) => c.no === cs.no))
    .filter(Boolean) as Constituency[];
}

export function getPartyFullName(abbr: string): string {
  return data.party_abbreviations[abbr] || abbr;
}

export function getPartyColor(alliance: "ldf" | "udf" | "nda"): string {
  switch (alliance) {
    case "ldf":
      return "#dc2626";
    case "udf":
      return "#2563eb";
    case "nda":
      return "#f59e0b";
  }
}

export function getPartyBgClass(alliance: "ldf" | "udf" | "nda"): string {
  switch (alliance) {
    case "ldf":
      return "bg-ldf-red";
    case "udf":
      return "bg-udf-blue";
    case "nda":
      return "bg-nda-saffron";
  }
}

export function searchConstituencies(query: string): Constituency[] {
  const q = query.toLowerCase();
  return data.constituencies.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.ldf.candidate.toLowerCase().includes(q) ||
      c.udf.candidate.toLowerCase().includes(q) ||
      c.nda.candidate.toLowerCase().includes(q)
  );
}

export function getAllConstituencies(): Constituency[] {
  return data.constituencies;
}

export function getMeta() {
  return data.meta;
}

export { data };
