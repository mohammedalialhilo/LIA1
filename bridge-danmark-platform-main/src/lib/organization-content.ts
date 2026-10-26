/**
 * Redigerbart indhold til distrikts- og kredshjemmesider.
 *
 * Modellen er med vilje holdt som ren data, så den senere kan hentes fra
 * API/BridgeOrg eller redigeres af en distrikts-/kredsadministrator via login.
 * Felter uden indhold vises som neutrale placeholders i UI'et.
 */

export type OrgNewsItem = {
  id: string;
  title: string;
  date: string;
  summary: string;
  url?: string;
};

export type OrgTournamentItem = {
  id: string;
  title: string;
  date: string;
  place?: string;
  url?: string;
};

export type OrgDocumentCategory = "vedtaegter" | "referater" | "generalforsamling" | "turneringsregler" | "kalender" | "andet";

export type OrgDocument = {
  id: string;
  title: string;
  category?: OrgDocumentCategory;
  note?: string;
  url?: string;
};

export type OrgLink = {
  id: string;
  title: string;
  url: string;
  note?: string;
};

export type OrgBoardMember = {
  id: string;
  role: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type OrgContact = {
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
};

/**
 * Klub som den nuværende distriktshjemmeside nævner den. Bruges kun til klubber,
 * der endnu ikke findes i platformens fælles klubkatalog (ingen dublering).
 */
export type OrgClubReference = {
  clubNo: number;
  name: string;
  note?: string;
};

/** Hvor indholdet stammer fra – gør det muligt senere at udskifte kilden. */
export type OrgContentSource = {
  kind: "prototype" | "bridgecms-migration" | "api";
  sourceUrl?: string;
  note?: string;
};

/** Fælles indholdsmodel for både distrikter og kredse (CMS-klar). */
export type OrgSiteContent = {
  /** Forsidetekst — "Om distriktet"/"Om kredsen". */
  about?: string;
  websiteUrl?: string;
  contact?: OrgContact;
  board: OrgBoardMember[];
  news: OrgNewsItem[];
  tournaments: OrgTournamentItem[];
  documents: OrgDocument[];
  links: OrgLink[];
  /** Turneringsplan (typisk et eksternt DBF-link). */
  tournamentPlanUrl?: string;
  /** Klubber nævnt på den gamle hjemmeside, men ikke i klubkataloget endnu. */
  clubReferences?: OrgClubReference[];
  source?: OrgContentSource;
};

const tomtIndhold: OrgSiteContent = {
  board: [],
  news: [],
  tournaments: [],
  documents: [],
  links: [],
};


/**
 * Migreret fra de nuværende BridgeCentral/BridgeCMS-sider (www.bridge.dk/{nr}/).
 * Senere: xxxx.fdb → BridgeCMS-tabeller → .NET API → OrgSiteContent → React.
 */
const vestsjaelland: Partial<OrgSiteContent> = {
  about:
    "Distrikt Vestsjælland arrangerer distriktsturneringer, formidler åbne turneringer i distriktets klubber og samler relevant information for klubberne i den vestlige del af Sjælland. Distriktet hører til Kreds 2.",
  contact: { email: "joiblar@stofanet.dk", phone: "22 35 96 52", note: "Kontakt formand Ib Larsen." },
  board: [{ id: "formand", role: "Formand", name: "Ib Larsen", email: "joiblar@stofanet.dk", phone: "22 35 96 52" }],
  news: [
    { id: "klubledermoede", title: "Klubledermøde", date: "Fredag 6. marts 2026 kl. 17.00", summary: "Caféen, Stenhusbakken, Stenhusvej 21, 4300 Holbæk. Alle klubber opfordres til at sende en eller to repræsentanter.", url: "https://www.bridge.dk/2300/Forside.html" },
    { id: "breddeambassadoer", title: "Bliv breddeambassadør", date: "Sæson 2025/26", summary: "Distriktet søger flere breddeambassadører, der vil hjælpe med at skabe interesse for bridge.", url: "https://www.bridge.dk/2300/Forside.html" },
  ],
  tournaments: [
    { id: "seniorpar", title: "Seniorpar", date: "7. december 2025" },
    { id: "k2-simultan", title: "Kreds 2 Simultan", date: "18. januar 2026" },
    { id: "aaben-par", title: "Åben par", date: "8. februar 2026" },
    { id: "k2-finale", title: "Kreds 2 Simultan – finale", date: "1. marts 2026" },
    { id: "mixpar", title: "Mix-par", date: "Søndag 15. marts 2026 kl. 9.30", place: "Slagelse Bridgecenter, Sverigesvej 7A" },
    { id: "begynder", title: "Begyndermesterskab og klubspillermesterskab", date: "12. april 2026" },
  ],
  documents: [
    { id: "vedtaegter", title: "Vedtægter", category: "vedtaegter", note: "Ligger på den nuværende hjemmeside.", url: "https://www.bridge.dk/2300/Forside.html" },
    { id: "kalender", title: "Turneringskalender 2025/26", category: "kalender", url: "https://bridge.dk/2300/Tournaments.html" },
    { id: "regler", title: "Turneringsregler", category: "turneringsregler", url: "https://bridge.dk/2300/Tournaments.html" },
  ],
  links: [
    { id: "turneringer", title: "Turneringer og resultater", url: "https://bridge.dk/2300/Tournaments.html", note: "Distriktets turneringsside på BridgeCentral." },
    { id: "klubliste", title: "Klubber og spilledage", url: "https://www.bridge.dk/2300/Klubber.html" },
  ],
  clubReferences: [
    [2303, "Asnæs BK"], [2310, "BK 59 Holbæk"], [2312, "Slagelse Bridgeklub"], [2322, "Glumsø Bridgeklub"],
    [2324, "Holbæk BK af 1949"], [2330, "Høng Bridgeklub"], [2337, "Jyderup BK"], [2338, "Torsdags Bridge"],
    [2340, "Kalundborg BK"], [2341, "Korsør Bridge 51"], [2342, "Korsør Kontraktbridgeklub"], [2360, "Ringsted Bridgeklub"],
    [2363, "Rørvig BK"], [2365, "Skælskør og Omegns BK"], [2375, "Sorø Bridgeklub"], [2385, "Svinninge BK"],
    [2390, "Tuse Næs BK"], [2394, "Vig Bridge Club"],
  ].map(([clubNo, name]) => ({ clubNo: clubNo as number, name: name as string })),
  source: { kind: "bridgecms-migration", sourceUrl: "https://www.bridge.dk/2300/" },
};

const storstroem: Partial<OrgSiteContent> = {
  about:
    "Distriktsbestyrelsen i Storstrøm udskriver og arrangerer bridgeturneringer og er bindeled mellem klubberne og Danmarks Bridgeforbund. Distriktet hører til Kreds 2.",
  contact: { email: "dist2400@gmail.com", note: "Send gode idéer og nye tiltag fra klubberne til distriktets mail." },
  news: [
    { id: "aktivitetskalender", title: "Aktivitetskalenderen for 2025/26 er udkommet", date: "Sæson 2025/26", summary: "Distriktets aktiviteter for sæsonen er samlet i én kalender.", url: "https://www.bridge.dk/2400/Forside.html" },
    { id: "dm-hold", title: "Distriktets hold ved DM", date: "2026", summary: "Michael Mulvad, Michael Hvass Miller, Nell Rindahl og Niels Lund fra Turneringsklubben Midtsjælland repræsenterer Distrikt Storstrøm.", url: "https://www.bridge.dk/2400/Forside.html" },
  ],
  tournaments: [
    { id: "distriktshold", title: "Distriktshold (holdturnering, 8 spil pr. kamp)", date: "20/9, 11/10 og 15/11 2026 kl. 13–17", place: "500 kr. pr. hold for alle tre gange" },
    { id: "damepar", title: "Damepar", date: "Søndag 10. januar 2027", place: "Vordingborg · 150 kr. pr. person" },
    { id: "simultan", title: "Kreds 2 Simultan – indledende runde", date: "17. januar 2027", place: "I klubberne" },
    { id: "simultan-finale", title: "Kreds 2 Simultan – finale", date: "7. marts 2027", place: "Formentlig Næstved" },
  ],
  documents: [
    { id: "aktivitetsprogram", title: "Aktivitetsprogram for klubber i Distrikt Storstrøm 2026/27", category: "kalender", url: "https://www.moen-bridgeklub.dk/images/AktivitetsprogramtilklubberiDistriktStorstrm2627-1.pdf" },
    { id: "generalforsamling", title: "Bestyrelse, generalforsamling og referater", category: "referater", note: "Findes under fanen \"Distriktet\" på den nuværende hjemmeside.", url: "https://www.bridge.dk/2400/Forside.html" },
  ],
  links: [
    { id: "guld-soelv", title: "Kommende guld- og sølvturneringer", url: "https://www.bridge.dk/2400/Forside.html", note: "Under fanen \"guld/sølv turn\" på BridgeCentral." },
  ],
  clubReferences: [
    [2405, "Faxe Bridgeklub"], [2407, "Haslev Bridge Klub"], [2424, "Maribo Bridgeklub"], [2428, "Møn Bridgeklub"], [2450, "Bridgeklubben Præstø"],
  ].map(([clubNo, name]) => ({ clubNo: clubNo as number, name: name as string })),
  source: { kind: "bridgecms-migration", sourceUrl: "https://www.bridge.dk/2400/" },
};

const bornholm: Partial<OrgSiteContent> = {
  about:
    "Distrikt Bornholm består af 6 bridgeklubber fordelt over hele øen med over 250 medlemmer. Alle klubber har plads til nye medlemmer, og der undervises nye spillere hvert år. Livet er kort – spil bridge!",
  news: [
    { id: "mesterskaber", title: "Årets mesterskaber er afgjort", date: "Sæson 2025/26", summary: "Se mere under pressemeddelelser på den nuværende hjemmeside.", url: "https://www.bridge.dk/3100/Forside.html" },
  ],
  tournaments: [
    { id: "holdturnering", title: "Distriktets holdturnering – resultater", date: "Sæson 2025/26", url: "https://www.bridge.dk/3100/Forside.html" },
  ],
  documents: [
    { id: "historik", title: "Historiske distriktsresultater før 1. juli 2018 (BC2)", category: "andet", url: "https://www.bridge.dk/3100/Forside.html" },
  ],
  links: [
    { id: "gammel", title: "Distriktets tidligere hjemmeside", url: "https://bridgebornholm.weebly.com/", note: "Arkiv med ældre resultater." },
  ],
  clubReferences: [
    [3110, "Hasle-Rutsker Bridgeklub"], [3120, "Klemensker og omegns kontraktbridgeklub"], [3130, "Neksø Bridgeklub"],
    [3140, "Pedersker Bridgeklub"], [3145, "Rønne Bridgeklub"], [3150, "Spar-2, Rønne"], [3160, "Svaneke Bridgeklub"],
    [3172, "Østerlars/Østermarie BK"], [3175, "Aakirkeby Bridgeklub"],
  ].map(([clubNo, name]) => ({ clubNo: clubNo as number, name: name as string, note: "Fra ældre klubliste – kontrolleres" })),
  source: { kind: "bridgecms-migration", sourceUrl: "https://www.bridge.dk/3100/" },
};

const vestjylland: Partial<OrgSiteContent> = {
  about:
    "Distrikt Vestjylland samler bridgeklubberne i den vestlige og midtvestlige del af Jylland og arrangerer distriktsturneringer som Vestjysk holdturnering, mixpar og generalforsamlingsturnering. Distriktet hører til Kreds 4.",
  documents: [
    { id: "generalforsamlinger", title: "Generalforsamlinger", category: "generalforsamling", note: "Arkiv på den nuværende hjemmeside.", url: "https://www.bridge.dk/4300/" },
  ],
  links: [
    { id: "vestjysk", title: "Vestjysk holdturnering (arkiv)", url: "https://www.bridge.dk/4300/turneringer/2009-10/vestjysk.html" },
  ],
  clubReferences: [
    [4316, "Herning Bridgeklub"], [4399, "Bjerringbro Bridge Klub"],
  ].map(([clubNo, name]) => ({ clubNo: clubNo as number, name: name as string })),
  source: { kind: "bridgecms-migration", sourceUrl: "https://www.bridge.dk/4300/" },
};

/** Indhold pr. distrikt-id. Distrikter uden opslag får neutrale placeholders. */
const districtContent: Record<number, Partial<OrgSiteContent>> = {
  1: {
    about:
      "Distrikt København samler bridgeklubberne i København og det nærmeste hovedstadsområde. Distriktet hører til Kreds 1 og er bindeled mellem klubberne og Danmarks Bridgeforbund.",
  },
  4: vestsjaelland,
  5: storstroem,
  6: bornholm,
  9: vestjylland,
};

/** Indhold pr. kreds-id. */
const circuitContent: Record<number, Partial<OrgSiteContent>> = {
  4: {
    about:
      "Kreds 4 dækker Jylland og Fyn og består af distrikterne Nordjylland, Østjylland, Vestjylland, Sydjylland og Fyn. Kredsen koordinerer turneringssamarbejdet mellem distrikterne.",
    tournamentPlanUrl: "https://www.bridge.dk/4000/Turneringsplan.html",
    links: [
      {
        id: "turneringsplan",
        title: "Kreds 4 turneringsplan",
        url: "https://www.bridge.dk/4000/Turneringsplan.html",
        note: "Ekstern side hos Danmarks Bridgeforbund.",
      },
    ],
  },
};

/** Datakilde-grænseflade: i dag statisk, senere API-kald med samme returform. */
export function getDistrictContent(id: number): OrgSiteContent {
  return { ...tomtIndhold, ...(districtContent[id] ?? {}) };
}

export function getCircuitContent(id: number): OrgSiteContent {
  return { ...tomtIndhold, ...(circuitContent[id] ?? {}) };
}
