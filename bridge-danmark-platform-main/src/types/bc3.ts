/**
 * Datamodel for BC3 Online (frontend-demo).
 *
 * VIGTIGT: Der er ingen databaseforbindelse. Alle typer beskriver kun formen på
 * de lokale demo-data i src/data/bc3/. Feltnavne er inspireret af BC3-konceptet
 * og er ANTAGET indtil de er verificeret mod en rigtig installation.
 *
 * Nøgleprincip: lokale BC3-id'er er kun unikke inde i én klubdatabase.
 * Brug derfor altid sourceClubNumber + memberId (eller + subclubId) som nøgle.
 */

/** BC3-statuskoder (ANTAGET). */
export type MemberStatus = 1 | 4;

export type ClubStatus = "aktiv" | "demo";

export type Club = {
  clubNumber: number;
  name: string;
  status: ClubStatus;
  /** Kort beskrivelse af klubmiljøet i demoen. */
  description: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  district: string;
  /** Demo-kontaktperson (opdigtet). */
  contactPerson: string;
};

export type Subclub = {
  /** Lokalt id i klubbens BC3-database — ikke globalt unikt. */
  id: number;
  sourceClubNumber: number;
  name: string;
  weekday: string;
  time: string;
  leader: string;
  status: "Aktiv" | "Passiv";
  memberIds: number[];
};

export type Member = {
  sourceClubNumber: number;
  /** Lokalt BC3-id — kun unikt inden for sourceClubNumber. */
  memberId: number;
  /** Id i BridgeOrg (organisationsniveau). */
  orgMemberId: number;
  /** Medlemsnummer brugt i forbundet. */
  memberNumber: number;
  status: MemberStatus;
  firstName: string;
  middleName?: string | undefined;
  lastName: string;
  displayName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  mobile: string;
  email: string;
  isPrimaryClub: boolean;
  handicap: number;
  /** Lokale underklub-id'er i samme klubdatabase. */
  subclubIds: number[];
  /** Bridge-identifikation på online-platforme (ANTAGET placering i BC3/BridgeOrg). */
  realBridgeId?: string | undefined;
  bboId?: string | undefined;
  intoBridgeId?: string | undefined;
};

export const memberStatusLabel: Record<MemberStatus, string> = {
  1: "Aktiv",
  4: "Passiv",
};

/** Sammensat nøgle — lokale id'er kolliderer på tværs af klubber. */
export function memberKey(m: Pick<Member, "sourceClubNumber" | "memberId">) {
  return `${m.sourceClubNumber}/${m.memberId}`;
}

export function subclubKey(s: Pick<Subclub, "sourceClubNumber" | "id">) {
  return `${s.sourceClubNumber}/${s.id}`;
}
