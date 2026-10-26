import { flereKlubber, klubber } from "@/lib/demo-data";

/** Midlertidig organisationsmodel. Kan senere erstattes af samme form fra et API. */
export type OrganizationDistrict = {
  id: number;
  /** Traditionelt bridge.dk-organisationsnummer. Ikke det tekniske database-ID. */
  siteNumber?: number;
  name: string;
  description: string;
  circuitId: number;
  /** Nuværende (gamle) hjemmeside, fx BridgeCentral/BridgeCMS. */
  websiteUrl?: string;
  /** Platform bag den nuværende hjemmeside – bruges i migrationsperioden. */
  legacyPlatform?: "BridgeCentral";
  /** Officielle tal leveres senere af API/BridgeOrg. Vises kun, når de findes. */
  officialClubCount?: number;
  officialMemberCount?: number;
  legacyDetailId?: string;
};

export type OrganizationCircuit = {
  id: number;
  /** Traditionelt bridge.dk-organisationsnummer, når det er dokumenteret. */
  siteNumber?: number;
  name: string;
  geographicName: string;
  description: string;
  websiteUrl?: string;
};

export type OrganizationClub = {
  clubNo: number;
  name: string;
  districtId: number;
  circuitId?: number | null;
  city: string;
  region: string;
  members?: number | undefined;
  internalPath?: string | undefined;
  websiteUrl?: string | undefined;
  recentlyAdded?: boolean;
};

export const organizationCircuits: OrganizationCircuit[] = [
  {
    id: 1,
    name: "Kreds 1",
    geographicName: "København",
    description: "Distrikt København.",
  },
  {
    id: 2,
    siteNumber: 2000,
    name: "Kreds 2",
    geographicName: "Sjælland uden København",
    description: "Distrikterne Nordsjælland, Østsjælland, Vestsjælland og Storstrøm.",
  },
  {
    id: 3,
    siteNumber: 3000,
    name: "Kreds 3",
    geographicName: "Bornholm",
    description: "Distrikt Bornholm.",
  },
  {
    id: 4,
    siteNumber: 4000,
    name: "Kreds 4",
    geographicName: "Jylland og Fyn",
    description: "Distrikterne Nordjylland, Østjylland, Vestjylland, Sydjylland og Fyn.",
    websiteUrl: "https://www.bridge.dk/4000/Turneringsplan.html",
  },
];

export const organizationDistricts: OrganizationDistrict[] = [
  {
    id: 1,
    name: "Distrikt København",
    description: "Bridgeklubber i København og det nærmeste hovedstadsområde.",
    circuitId: 1,
    legacyDetailId: "6",
  },
  {
    id: 2,
    siteNumber: 2100,
    name: "Distrikt Nordsjælland",
    description: "Bridgeklubber i Nordsjælland.",
    circuitId: 2,
  },
  {
    id: 3,
    siteNumber: 2200,
    name: "Distrikt Østsjælland",
    description: "Bridgeklubber på den østlige del af Sjælland.",
    circuitId: 2,
  },
  {
    id: 4,
    siteNumber: 2300,
    websiteUrl: "https://www.bridge.dk/2300/",
    legacyPlatform: "BridgeCentral",
    name: "Distrikt Vestsjælland",
    description: "Bridgeklubber på den vestlige del af Sjælland.",
    circuitId: 2,
  },
  {
    id: 5,
    siteNumber: 2400,
    websiteUrl: "https://www.bridge.dk/2400/",
    legacyPlatform: "BridgeCentral",
    name: "Distrikt Storstrøm",
    description: "Bridgeklubber i den sydlige del af Sjælland og på øerne.",
    circuitId: 2,
    legacyDetailId: "5",
  },
  {
    id: 6,
    siteNumber: 3100,
    websiteUrl: "https://www.bridge.dk/3100/",
    legacyPlatform: "BridgeCentral",
    name: "Distrikt Bornholm",
    description: "Bridgeklubber på Bornholm.",
    circuitId: 3,
  },
  {
    id: 7,
    siteNumber: 4100,
    name: "Distrikt Nordjylland",
    description: "Bridgeklubber i Nordjylland.",
    circuitId: 4,
    legacyDetailId: "1",
  },
  {
    id: 8,
    siteNumber: 4200,
    name: "Distrikt Østjylland",
    description: "Bridgeklubber i den østlige del af Jylland.",
    circuitId: 4,
    legacyDetailId: "2",
  },
  {
    id: 9,
    siteNumber: 4300,
    websiteUrl: "https://www.bridge.dk/4300/",
    legacyPlatform: "BridgeCentral",
    name: "Distrikt Vestjylland",
    description: "Bridgeklubber i den vestlige del af Jylland.",
    circuitId: 4,
  },
  {
    id: 10,
    siteNumber: 4400,
    name: "Distrikt Sydjylland",
    description: "Bridgeklubber i Sydjylland.",
    circuitId: 4,
    legacyDetailId: "3",
  },
  {
    id: 11,
    siteNumber: 4500,
    name: "Distrikt Fyn",
    description: "Bridgeklubber på Fyn og de omkringliggende øer.",
    circuitId: 4,
    legacyDetailId: "4",
  },
];

const districtAliases: Record<string, number> = {
  "Distrikt København": 1,
  "Distrikt Storkøbenhavn": 1,
  "Distrikt Nordsjælland": 2,
  "Distrikt Østsjælland": 3,
  "Distrikt Vestsjælland": 4,
  "Distrikt Sjælland Syd": 5,
  "Distrikt Storstrøm": 5,
  "Distrikt Bornholm": 6,
  "Distrikt Nordjylland": 7,
  "Distrikt Midtjylland": 8,
  "Distrikt Østjylland": 8,
  "Distrikt Vestjylland": 9,
  "Distrikt Sydjylland": 10,
  "Distrikt Fyn": 11,
};

function districtIdFor(name: string): number {
  return districtAliases[name] ?? 1;
}

function circuitIdFor(districtId: number): number | null {
  return organizationDistricts.find((district) => district.id === districtId)?.circuitId ?? null;
}

export const organizationClubs: OrganizationClub[] = [
  ...klubber
    .filter((club) => club.nr !== "5000")
    .map((club) => {
      const districtId = districtIdFor(club.distrikt);
      return {
        clubNo: Number(club.nr),
        name: club.navn,
        districtId,
        circuitId: circuitIdFor(districtId),
        city: club.by,
        region: club.region,
        members: club.medlemmer,
        internalPath: `/${club.nr}`,
        websiteUrl: club.eksterneLinks?.legacyWebsiteUrl,
        recentlyAdded: club.nr === "2132" || club.nr === "2133",
      } satisfies OrganizationClub;
    }),
  ...flereKlubber.map((club) => {
    const districtId = districtIdFor(club.distrikt);
    return {
      clubNo: Number(club.nr),
      name: club.navn,
      districtId,
      circuitId: circuitIdFor(districtId),
      city: club.by,
      region: club.region,
      members: club.medlemmer,
    } satisfies OrganizationClub;
  }),
].sort((a, b) => a.clubNo - b.clubNo);

export function getDistrict(id: number) {
  return organizationDistricts.find((district) => district.id === id);
}

export function getCircuit(id: number | null | undefined) {
  return organizationCircuits.find((circuit) => circuit.id === id);
}

export function clubsInDistrict(districtId: number) {
  return organizationClubs.filter((club) => club.districtId === districtId);
}

export const recentlyAddedClubs = organizationClubs.filter((club) => club.recentlyAdded);