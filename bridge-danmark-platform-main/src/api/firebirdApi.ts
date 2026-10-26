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

/** "J"/"Y"/"1"/"true" tolkes som ja — API'et leverer tekstflag. */
export function flagErJa(v: string | undefined | null): boolean {
  if (!v) return false;
  return ["j", "y", "t", "1", "true", "ja"].includes(String(v).trim().toLowerCase());
}
