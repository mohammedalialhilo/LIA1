export type GuideTopic = {
  slug?: string;
  titel: string;
  tekst: string;
};

export const bc3Brugervejledning: GuideTopic[] = [
  {
    titel: "Kom godt i gang",
    tekst: "Installation af BC3, klubforbindelse og grundlæggende opsætning.",
  },
  {
    titel: "Medlemmer",
    tekst: "Find eksisterende medlemmer, opret medlemmer korrekt, ret medlemsdata og undgå dubletter.",
  },
  {
    slug: "opret-turnering",
    titel: "Opret turnering",
    tekst: "Planlæg en klubturnering, vælg rækker og sektioner, dato og tidspunkt samt BridgeMate-indstillinger.",
  },
  {
    titel: "Turneringsdata",
    tekst: "Vælg turneringsform, mesterpoint, skifteplan, antal par eller hold og øvrige turneringsindstillinger.",
  },
  {
    slug: "tilmeldinger-og-startliste",
    titel: "Tilmeldinger og startliste",
    tekst: "Tilføj spillere, vedligehold tilmeldinger og overfør deltagere til den endelige startliste.",
  },
  {
    titel: "BridgeMate",
    tekst: "Start BridgeMate, opsæt indtastning og hent resultater fra bordene.",
  },
  {
    titel: "Resultater",
    tekst: "Kontroller resultater, udskriv stillinger og send resultater til hjemmesiden.",
  },
  {
    titel: "Avancerede turneringer",
    tekst: "Flere rækker, holdturneringer, fleksible turneringer og særlige skifteplaner.",
  },
];

export const opretTurneringTrin = [
  "Gå til Klubturneringer og vælg 'Planlæg ny klubturnering'.",
  "Angiv turneringens navn.",
  "Vælg om spillerne skal indtaste udspil i BridgeMate.",
  "Angiv antal rækker. Hvis der er flere rækker, vælges om de er lige stærke eller styrkeinddelte.",
  "Angiv antal sektioner/spilledage.",
  "Kontroller dato og tidspunkt for sektionen eller sektionerne og gem turneringen.",
];

export type GuideStep = {
  overskrift: string;
  tekst: string;
  valgmuligheder?: { overskrift: string; tekst: string }[];
  bemærkning?: string;
};

export const tilmeldingerStartlisteTrin: GuideStep[] = [
  {
    overskrift: "Åbn startlisten",
    tekst: "Vælg den relevante turnering og klik på 'Vedligehold startliste'.",
  },
  {
    overskrift: "Tilmeld spillerne",
    tekst: "Spillere kan tilmeldes på flere måder.",
    valgmuligheder: [
      {
        overskrift: "Vedligehold tilmeldinger",
        tekst: "Find og tilmeld spillere eller makkerpar fra klubbens medlemmer.",
      },
      {
        overskrift: "Indlæs CSV-fil",
        tekst: "Indlæs en deltagerliste fra en CSV-fil med spillernes DBF-medlemsnumre.",
      },
      {
        overskrift: "Manuel indtastning",
        tekst: "Bruges blandt andet til spillere, som ikke findes blandt klubbens normale medlemmer.",
      },
    ],
  },
  {
    overskrift: "Kontroller deltagerlisten",
    tekst: "Kontroller at de rigtige spillere eller par står på deltagerlisten.",
    bemærkning: "Ved parturneringer skal hvert par bestå af to individuelle spillere.",
  },
  {
    overskrift: "Overfør til startlisten",
    tekst: "Overfør spillerne eller parrene fra deltagerlisten til startlisten.",
    bemærkning: "I BC3 vises deltagerlisten til venstre og startlisten til højre.",
  },
  {
    overskrift: "Kontroller placeringen",
    tekst: "Kontroller parnumre, placeringer og eventuelle substitutter eller oversiddere, før turneringen startes.",
  },
  {
    overskrift: "Klar til BridgeMate",
    tekst: "Når startlisten er korrekt, er turneringen klar til at blive sendt videre til BridgeMate.",
  },
];
