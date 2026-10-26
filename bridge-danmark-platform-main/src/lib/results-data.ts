/**
 * Resultatdata – PROTOTYPE / MOCKDATA.
 *
 * Fremtidig datakilde: et .NET API, der returnerer JSON samlet fra
 *  - resultat-XML fra det nuværende resultatsystem (resultater.bridge.dk)
 *  - BridgeOrg-data for medlemmer, klubber, handicap og mesterpoint.
 *
 * Frontend må IKKE afhænge af gamle XML-feltnavne eller PHP-parametre
 * (filename, section, round, half osv.). API'et oversætter til modellen her.
 * Felter markeret `placeholder: true` er ikke verificerede data.
 * Kampe i schemaVersion 0.1 ligger i src/data/results/*.json og omsættes her.
 */
import testkamp from "@/data/results/match-270-2-2-8-12.json";
import { isoTilDansk, type ResultMatchDocument, type ResultPlayer, type ResultTeam } from "@/lib/results-schema";


export type Tournament = {
  tournamentId: number;
  slug: string;
  navn: string;
  season: string;
  type: "division" | "dbf" | "klub";
  status: string;
};

export type Division = {
  divisionId: number;
  tournamentId: number;
  slug: string;
  navn: string;
  status: "I gang" | "Ikke startet" | "Afsluttet";
  senesteDato?: string;
  antalHold: number;
  aktiv: boolean; // fuldt klikbar i prototypen
};

export type Player = { playerId: string; navn: string; dbfNr?: number; parNr?: number; placeholder?: boolean };

export type Team = {
  teamId: string;
  teamNumber?: number;
  divisionId: number;
  navn: string;
  spillere: Player[];
};

export type Round = { round: number; dato: string; tid: string; placeholder?: boolean };

export type Match = {
  matchId: string;
  divisionId: number;
  round: number;
  hjemmeId: string;
  udeId: string;
  imp: [number, number];
  vp: [number, number];
  hjemmeSpillere: Player[];
  udeSpillere: Player[];
  placeholder?: boolean;
};

export type Standing = { placering: number; teamId: string; kampe: number; vp: number };

/** Kampdokumenter i schemaVersion 0.1 – eneste kilde til disse kampes data. */
export const kampDokumenter: ResultMatchDocument[] = [testkamp as unknown as ResultMatchDocument];

const tilSpiller = (p: ResultPlayer): Player => ({
  playerId: p.dbfNo != null ? `dbf-${p.dbfNo}` : p.name,
  navn: p.name,
  ...(p.dbfNo != null ? { dbfNr: p.dbfNo } : {}),
  ...(p.pairNumber != null ? { parNr: p.pairNumber } : {}),
});

const modelHold = new Map<string, ResultTeam & { divisionId: number }>();
kampDokumenter.forEach((d) =>
  [d.match.homeTeam, d.match.awayTeam].forEach((t) => modelHold.set(t.name, { ...t, divisionId: d.division.id })),
);

export const tournaments: Tournament[] = [
  { tournamentId: testkamp.tournament.id, slug: "divisionsturneringen", navn: "Divisionsturneringen", season: testkamp.tournament.season, type: "division", status: "I gang" },
];

export const divisioner: Division[] = [
  { divisionId: 1, tournamentId: 270, slug: "1-division", navn: "1. division", status: "I gang", senesteDato: "03-10-2026", antalHold: 10, aktiv: false },
  { divisionId: 2, tournamentId: 270, slug: "2-division", navn: "2. division", status: "I gang", senesteDato: "03-10-2026", antalHold: 12, aktiv: true },
  { divisionId: 3, tournamentId: 270, slug: "3-division-oest", navn: "3. division øst", status: "I gang", senesteDato: "03-10-2026", antalHold: 12, aktiv: false },
  { divisionId: 4, tournamentId: 270, slug: "3-division-vest", navn: "3. division vest", status: "I gang", senesteDato: "03-10-2026", antalHold: 12, aktiv: false },
];

const holdNavne = [
  "Johan Franzen", "Preben Schmidt", "Henning Østergaard", "Erik Wied",
  "Malerfirmaet Nielsen & Justesen", "Michael Beck", "Peter Teisen", "Jens Kofoed",
  "Lars Møller Sørensen", "Øjvind Hulgaard", "Peter B. Hansen", "Vibeke Lund",
];

export const slugify = (s: string) =>
  s.toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa").replace(/&/g, "og")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Hold-id: modellens id når holdet findes i et kampdokument, ellers midlertidig slug. */
const holdId = (navn: string) => modelHold.get(navn)?.id ?? slugify(navn);

export const hold: Team[] = holdNavne.map((navn) => {
  const mt = modelHold.get(navn);
  return {
    teamId: holdId(navn),
    ...(mt ? { teamNumber: mt.teamNumber } : {}),
    divisionId: 2,
    navn,
    spillere: mt ? mt.players.map(tilSpiller) : [],
  };
});

const fraModel: Round[] = kampDokumenter.map((d) => ({
  round: d.round.number,
  dato: isoTilDansk(d.round.date),
  tid: d.round.startTime && d.round.endTime ? `${d.round.startTime}–${d.round.endTime}` : "",
}));

export const runder: Round[] = [
  { round: 1, dato: "19-09-2026", tid: "19:30–23:30", placeholder: true },
  { round: 2, dato: "03-10-2026", tid: "19:30–23:30" },
  { round: 3, dato: "17-10-2026", tid: "19:30–23:30", placeholder: true },
].map((r) => fraModel.find((x) => x.round === r.round) ?? r);

const m = (round: number, a: string, b: string, imp: [number, number], vp: [number, number], placeholder?: boolean): Match => ({
  matchId: `r${round}-${slugify(a)}`,
  divisionId: 2, round, hjemmeId: holdId(a), udeId: holdId(b), imp, vp,
  hjemmeSpillere: [], udeSpillere: [],
  ...(placeholder ? { placeholder } : {}),
});

const kampFraModel = (d: ResultMatchDocument): Match => ({
  matchId: d.match.id,
  divisionId: d.division.id,
  round: d.round.number,
  hjemmeId: d.match.homeTeam.id,
  udeId: d.match.awayTeam.id,
  imp: [d.match.homeTeam.imp ?? 0, d.match.awayTeam.imp ?? 0],
  vp: [d.match.homeTeam.vp ?? 0, d.match.awayTeam.vp ?? 0],
  hjemmeSpillere: d.match.homeTeam.players.map(tilSpiller),
  udeSpillere: d.match.awayTeam.players.map(tilSpiller),
});

export const kampe: Match[] = [
  // Runde 1 – placeholder-tal
  m(1, "Johan Franzen", "Erik Wied", [88, 70], [13.2, 6.8], true),
  m(1, "Preben Schmidt", "Henning Østergaard", [64, 64], [10, 10], true),
  m(1, "Michael Beck", "Jens Kofoed", [102, 80], [14.1, 5.9], true),
  m(1, "Malerfirmaet Nielsen & Justesen", "Peter Teisen", [91, 60], [15.6, 4.4], true),
  m(1, "Vibeke Lund", "Lars Møller Sørensen", [77, 72], [11.2, 8.8], true),
  m(1, "Øjvind Hulgaard", "Peter B. Hansen", [70, 85], [6.9, 13.1], true),
  // Runde 2 – testdata (Malerfirmaet – Michael Beck kommer fra JSON-modellen)
  m(2, "Johan Franzen", "Preben Schmidt", [106, 56], [16.98, 3.02]),
  m(2, "Henning Østergaard", "Erik Wied", [62, 65], [9.42, 10.58]),
  ...kampDokumenter.map(kampFraModel),
  m(2, "Peter Teisen", "Jens Kofoed", [50, 152], [0, 20]),
  m(2, "Lars Møller Sørensen", "Øjvind Hulgaard", [45, 91], [3.41, 16.59]),
  m(2, "Peter B. Hansen", "Vibeke Lund", [86, 96], [8.15, 11.85]),
];

/** Holdet der fremhæves i stillingen (testbrugerens hold). */
export const fremhaevetHoldId = testkamp.match.awayTeam.id;

export const findDivision = (slug: string) => divisioner.find((d) => d.slug === slug);
export const findHold = (id: string) => hold.find((h) => h.teamId === id);
export const findKamp = (id: string) => kampe.find((k) => k.matchId === id);
export const findRunde = (r: number) => runder.find((x) => x.round === r);

export function beregnStilling(divisionId: number): Standing[] {
  const tal = new Map<string, { kampe: number; vp: number }>();
  hold.filter((h) => h.divisionId === divisionId).forEach((h) => tal.set(h.teamId, { kampe: 0, vp: 0 }));
  kampe.filter((k) => k.divisionId === divisionId).forEach((k) => {
    ([[k.hjemmeId, k.vp[0]], [k.udeId, k.vp[1]]] as const).forEach(([id, vp]) => {
      const t = tal.get(id);
      if (t) { t.kampe += 1; t.vp = Math.round((t.vp + vp) * 100) / 100; }
    });
  });
  return [...tal.entries()]
    .sort((a, b) => b[1].vp - a[1].vp)
    .map(([teamId, t], i) => ({ placering: i + 1, teamId, ...t }));
}

export const fmtVp = (v: number) => v.toFixed(2).replace(".", ",");
