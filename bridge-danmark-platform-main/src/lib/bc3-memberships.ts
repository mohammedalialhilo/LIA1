import type { Member, MemberClub, SubClub } from "@/api/firebirdApi";

/**
 * Relationen: medlem → MEM_CLUB (MemberClubs) → underklub → partnerID → medlem.
 * Alt kobles på ID'er — aldrig på navne.
 */
export type Makkerstatus = "ingen" | "ukendt" | "fundet";

export interface Spilleholdsmedlemskab {
  /** Unik nøgle til React (MEM_CLUB-id + underklub). */
  noegle: string;
  underklubId: number;
  underklubNavn: string;
  makkerstatus: Makkerstatus;
  makkerNavn?: string;
  makkerNr?: number;
}

export function byggMedlemskaber(
  medlemId: number,
  memberClubs: MemberClub[] | undefined,
  subClubs: SubClub[] | undefined,
  members: Member[] | undefined,
): Spilleholdsmedlemskab[] {
  const raekker = (memberClubs ?? []).filter((r) => r.memberID === medlemId);

  const setUnderklubber = new Set<number>();
  const resultat: Spilleholdsmedlemskab[] = [];

  for (const r of raekker) {
    // Undgå dubletter, hvis API'et returnerer samme relation flere gange.
    if (setUnderklubber.has(r.clubID)) continue;
    setUnderklubber.add(r.clubID);

    const underklub = subClubs?.find((u) => u.clubID === r.clubID);
    const partnerId = r.partnerID;

    let makkerstatus: Makkerstatus = "ingen";
    let makkerNavn: string | undefined;
    let makkerNr: number | undefined;

    // Vis aldrig medlemmet selv som sin egen makker.
    if (partnerId && partnerId > 0 && partnerId !== medlemId) {
      const makker = members?.find((m) => m.memberID === partnerId);
      if (makker) {
        makkerstatus = "fundet";
        makkerNavn = makker.name;
        makkerNr = makker.memberNo;
      } else {
        makkerstatus = "ukendt";
      }
    }

    resultat.push({
      noegle: `${r.memberClubID}-${r.clubID}`,
      underklubId: r.clubID,
      underklubNavn: underklub?.clubName ?? `Underklub ${r.clubID}`,
      makkerstatus,
      ...(makkerNavn !== undefined ? { makkerNavn } : {}),
      ...(makkerNr !== undefined ? { makkerNr } : {}),
    });
  }

  return resultat.sort((a, b) => a.underklubNavn.localeCompare(b.underklubNavn, "da"));
}

export interface MakkerparPerson {
  memberID: number;
  navn: string;
  memberNo?: number;
}

export interface Makkerpar {
  /** Stabil nøgle: min(id)-max(id) — samme par kan kun optræde én gang. */
  noegle: string;
  a: MakkerparPerson;
  b: MakkerparPerson | null;
  /** Partner-ID fandtes, men medlemsoplysninger kunne ikke slås op. */
  makkerUkendt: boolean;
}

export interface MakkerparOversigt {
  par: Makkerpar[];
  udenMakker: MakkerparPerson[];
  problemer: { person: MakkerparPerson; tekst: string }[];
}

function tilPerson(m: Member): MakkerparPerson {
  return { memberID: m.memberID, navn: m.name, memberNo: m.memberNo };
}

/**
 * Bygger makkerpar for ÉN underklub ud fra MEM_CLUB-relationerne (MemberClubs).
 * Relationer matches udelukkende på ID'er — aldrig på navne.
 */
export function byggMakkerpar(
  underklubId: number,
  memberClubs: MemberClub[] | undefined,
  members: Member[] | undefined,
): MakkerparOversigt {
  const raekker = (memberClubs ?? []).filter((r) => r.clubID === underklubId);
  const medlemIndex = new Map((members ?? []).map((m) => [m.memberID, m]));
  const links = new Map(raekker.map((row) => [row.memberID, row]));
  const person = (id: number): MakkerparPerson => {
    const found = medlemIndex.get(id);
    return found ? tilPerson(found) : { memberID: id, navn: `Medlem ${id}` };
  };
  const par: Makkerpar[] = [];
  const udenMakker: MakkerparPerson[] = [];
  const problemer: MakkerparOversigt["problemer"] = [];
  for (const row of links.values()) {
    const partnerId = row.partnerID > 0 ? row.partnerID : 0;
    const incoming = raekker.filter((candidate) => candidate.partnerID === row.memberID);
    if (!partnerId) {
      if (incoming.length > 0 || row.partnerFirst !== "F")
        problemer.push({
          person: person(row.memberID),
          tekst: "Ufuldstændig makkerreference i BC3.",
        });
      else udenMakker.push(person(row.memberID));
      continue;
    }
    const target = links.get(partnerId);
    if (
      partnerId === row.memberID ||
      !target ||
      target.partnerID !== row.memberID ||
      target.partnerFirst === row.partnerFirst ||
      incoming.length !== 1
    ) {
      problemer.push({
        person: person(row.memberID),
        tekst: `Makkerreference til medlem ${partnerId} er ufuldstændig.`,
      });
      continue;
    }
    if (row.memberID > partnerId) continue;
    par.push({
      noegle: `${row.memberID}-${partnerId}`,
      a: person(row.memberID),
      b: medlemIndex.has(partnerId) ? person(partnerId) : null,
      makkerUkendt: !medlemIndex.has(partnerId),
    });
  }
  udenMakker.sort((a, b) => a.navn.localeCompare(b.navn, "da"));
  par.sort((x, y) => x.a.navn.localeCompare(y.a.navn, "da"));
  problemer.sort((a, b) => a.person.navn.localeCompare(b.person.navn, "da"));
  return { par, udenMakker, problemer };
}
