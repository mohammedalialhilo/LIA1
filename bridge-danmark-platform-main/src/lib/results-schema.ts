/**
 * Resultatmodel schemaVersion "0.1".
 *
 * Samme struktur forventes senere returneret som JSON fra .NET API'et.
 * `sourceRefs` er KUN til import-/API-laget (kobling til XML og BridgeOrg)
 * og må ikke bruges af UI til visning eller navigation.
 */

export type SchemaVersion = "0.1";

export type SourceRefs = {
  resultXml?: { file?: string; organizerFolder?: string; tournamentId?: number; section?: number; round?: number };
  bridgeOrg?: { hacTournamentId?: number; hacTournamentIds?: number[]; memberId?: number };
};

export type ResultTournament = {
  id: number;
  name: string;
  type: "division" | "dbf" | "club";
  season: string;
  organizerClubNo: number | null;
  status: "planned" | "ongoing" | "finished";
  sourceRefs?: SourceRefs;
};

export type ResultDivision = {
  id: number;
  tournamentId: number;
  slug: string;
  name: string;
  sourceRefs?: SourceRefs;
};

export type ResultRound = {
  tournamentId: number;
  divisionId: number;
  number: number;
  name: string;
  date: string | null; // ISO yyyy-mm-dd
  startTime: string | null; // HH:mm
  endTime: string | null;
  timeZone: string;
};

export type ResultPlayer = {
  dbfNo: number | null;
  name: string;
  pairNumber: number | null;
  seat: "N" | "E" | "S" | "W" | null;
  sourceRefs?: SourceRefs;
};

export type ResultTeam = {
  /** Egen stabil reference inden for turnering og division, fx "270-2-8". */
  id: string;
  /** Originalt holdnummer i turneringen – ikke globalt unikt. */
  teamNumber: number;
  name: string;
  imp: number | null;
  vp: number | null;
  players: ResultPlayer[];
};

export type ResultBoardTable = {
  room: "open" | "closed";
  contract: string | null;
  declarer: "N" | "E" | "S" | "W" | null;
  result: number | null;
  scoreNS: number | null;
};

export type ResultBoard = {
  boardNo: number;
  dealer: "N" | "E" | "S" | "W" | null;
  vulnerability: "None" | "NS" | "EW" | "All" | null;
  deal: Record<"N" | "E" | "S" | "W", string[] | null>;
  tables: ResultBoardTable[];
  homeImp: number | null;
  awayImp: number | null;
};

export type ResultHalf = {
  number: number;
  homeImp: number | null;
  awayImp: number | null;
  boards: ResultBoard[];
  sourceRefs?: SourceRefs;
};

export type ResultMatch = {
  id: string;
  tournamentId: number;
  divisionId: number;
  roundNumber: number;
  status: "scheduled" | "playing" | "finished";
  scoring: { method: "IMP"; vpScale: string | null };
  homeTeam: ResultTeam;
  awayTeam: ResultTeam;
  winnerTeamNumber: number | null;
  impDifference: number | null;
  halves: ResultHalf[];
  sourceRefs?: SourceRefs;
};

export type ResultMatchDocument = {
  schemaVersion: SchemaVersion;
  tournament: ResultTournament;
  division: ResultDivision;
  round: ResultRound;
  match: ResultMatch;
  extensions: { standings: unknown; multiTeam: unknown; handicap: unknown; masterPoints: unknown };
};

/** "2026-10-03" → "03-10-2026" */
export const isoTilDansk = (iso: string | null) => (iso ? iso.split("-").reverse().join("-") : "");
