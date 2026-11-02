/**
 * Adgang til Magnus' ASP.NET Core Firebird-API.
 *
 * Dette er det ENESTE sted, hvor API-adressen og endpoints er defineret.
 * React-komponenter må ikke selv kende URL'er — de bruger hooks i src/hooks/.
 */

export const API_BASE_URL: string =
  (import.meta.env["VITE_FIREBIRD_API_URL"] as string | undefined) ?? "http://localhost:5083";

export const isDevelopment = import.meta.env.DEV;

/** GET /api/Clubs/{fdbNo} */
export interface Club {
  clubNo: number;
  name: string;
  status: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  districtNo: number;
}

/** GET /api/Clubs/{fdbNo}/SubClubs */
export interface SubClub {
  clubID: number;
  orgClubID: number;
  clubName: string;
  gameDay: number;
  leaderID: number;
  noSmoking: string;
  isVisible: string;
  remoteProfileID: number;
  lastChangedBy: string;
  gameTime: string;
}

/** GET /api/Clubs/{fdbNo}/Members */
export interface Member {
  memberID: number;
  memberNo: number;
  name: string;
  address1: string;
  address2: string;
  countryCode: string;
  zipCode: string;
  city: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email: string;
  clubStart: string;
  totalBronze: number;
  totalSilver: number;
  totalGold: number;
  totalMaster: number;
}

/** GET /api/Clubs/{fdbNo}/MemberClubs */
export interface MemberClub {
  memberClubID: number;
  memberID: number;
  clubID: number;
  partnerID: number;
  partnerFirst: string;
  isSubstitute: string;
  groupIndex: number;
  lastChangedBy: string;
  lastChangedDate: string;
}

/** /api/Clubs/{fdbNo}/SubClubs/{clubId}/Members */
export interface ClubMember {
  memberId: number;
  clubId: number;
  memberNo: number | null;
  name: string | null;
  address1: string | null;
  address2: string | null;
  countryCode: string | null;
  zipCode: string | null;
  city: string | null;
  phone1: string | null;
  phone2: string | null;
  phone3: string | null;
  email: string | null;
  clubStart: string | null;
}

export type CreateClubMember = Pick<ClubMember, "name"> &
  Partial<
    Pick<
      ClubMember,
      "memberNo" | "email" | "phone1" | "address1" | "zipCode" | "city" | "countryCode"
    >
  >;

export type UpdateClubMember = Partial<
  Pick<ClubMember, "name" | "email" | "phone1" | "address1" | "zipCode" | "city" | "countryCode">
>;

export class Bc3ApiError extends Error {
  status?: number | undefined;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "Bc3ApiError";
    this.status = status;
  }
}

async function apiGet<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Bc3ApiError("Kan ikke oprette forbindelse til BC3 API.");
  }
  if (!res.ok) {
    throw new Bc3ApiError(`BC3 API svarede med fejl ${res.status}.`, res.status);
  }
  return (await res.json()) as T;
}

async function apiWrite<T>(
  method: "POST" | "PUT",
  path: string,
  body: CreateClubMember | UpdateClubMember,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Bc3ApiError("Kan ikke oprette forbindelse til BC3 API.");
  }
  if (!res.ok) {
    throw new Bc3ApiError(`BC3 API svarede med fejl ${res.status}.`, res.status);
  }
  return (await res.json()) as T;
}

export function getClub(fdbNo: number | string) {
  return apiGet<Club>(`/api/Clubs/${fdbNo}`);
}

export function getSubClubs(fdbNo: number | string) {
  return apiGet<SubClub[]>(`/api/Clubs/${fdbNo}/SubClubs`);
}

export function getMembers(fdbNo: number | string) {
  return apiGet<Member[]>(`/api/Clubs/${fdbNo}/Members`);
}

export function getMemberClubs(fdbNo: number | string) {
  return apiGet<MemberClub[]>(`/api/Clubs/${fdbNo}/MemberClubs`);
}

function clubMembersPath(fdbNo: number | string, clubId: number | string) {
  return `/api/Clubs/${fdbNo}/SubClubs/${clubId}/Members`;
}

export function getClubMembers(fdbNo: number | string, clubId: number | string) {
  return apiGet<ClubMember[]>(clubMembersPath(fdbNo, clubId));
}

export function createClubMember(
  fdbNo: number | string,
  clubId: number | string,
  input: CreateClubMember,
) {
  return apiWrite<ClubMember>("POST", clubMembersPath(fdbNo, clubId), input);
}

export function updateClubMember(
  fdbNo: number | string,
  clubId: number | string,
  memberId: number,
  input: UpdateClubMember,
) {
  return apiWrite<ClubMember>("PUT", `${clubMembersPath(fdbNo, clubId)}/${memberId}`, input);
}

/** "J"/"Y"/"1"/"true" tolkes som ja — API'et leverer tekstflag. */
export function flagErJa(v: string | undefined | null): boolean {
  if (!v) return false;
  return ["j", "y", "t", "1", "true", "ja"].includes(String(v).trim().toLowerCase());
}
