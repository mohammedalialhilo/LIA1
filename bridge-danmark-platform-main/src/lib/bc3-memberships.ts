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

  // Ét medlemskab pr. medlem i denne underklub (fjerner dubletter fra API'et).
  const partnerAf = new Map<number, number | null>();
  for (const r of raekker) {
    if (partnerAf.has(r.memberID)) continue;
    const pid = r.partnerID && r.partnerID > 0 && r.partnerID !== r.memberID ? r.partnerID : null;
    partnerAf.set(r.memberID, pid);
  }

  const sorteret = [...partnerAf.keys()]
    .map((id) => ({ id, medlem: medlemIndex.get(id) }))
    .sort((x, y) => (x.medlem?.name ?? "").localeCompare(y.medlem?.name ?? "", "da"));

  const brugt = new Set<number>();
  const par: Makkerpar[] = [];
  const udenMakker: MakkerparPerson[] = [];

  for (const { id, medlem } of sorteret) {
    if (brugt.has(id)) continue;
    const person: MakkerparPerson = medlem
      ? tilPerson(medlem)
      : { memberID: id, navn: `Medlem ${id}` };
    const partnerId = partnerAf.get(id) ?? null;

    if (partnerId === null) {
      brugt.add(id);
      udenMakker.push(person);
      continue;
    }

    const partner = medlemIndex.get(partnerId);
    brugt.add(id);
    brugt.add(partnerId);
    par.push({
      noegle: `${Math.min(id, partnerId)}-${Math.max(id, partnerId)}`,
      a: person,
      b: partner ? tilPerson(partner) : null,
      makkerUkendt: !partner,
    });
  }

  udenMakker.sort((a, b) => a.navn.localeCompare(b.navn, "da"));
  par.sort((x, y) => x.a.navn.localeCompare(y.a.navn, "da"));
  return { par, udenMakker };
}
