/**
 * Systemoversigt + Wiki BC3 — indholdsdata.
 *
 * VIGTIGT: Skærmgengivelserne nedenfor er rekonstruktioner af BC3-vinduer
 * (menuer, felter og knapper tegnet i browseren), ikke rigtige skærmbilleder.
 * Prototypen har ikke adgang til en BC3-installation. Alt der ikke er bekræftet
 * er markeret ANTAGET / SKAL VERIFICERES.
 */

export type SystemKort = {
  navn: string;
  rolle: string;
  teknologi: string;
  data: string;
  ejer: string;
  placering: "Klub-pc" | "Central" | "Web" | "Ved bordet";
  integrationer: string[];
};

export const systemLandskab: SystemKort[] = [
  {
    navn: "BridgeCentral 3 (BC3)",
    rolle: "Klubbens system til medlemmer, klubturneringer, afvikling, resultater og mesterpoint.",
    teknologi: "Windows-klient (Delphi), Firebird-database",
    data: "xxxx.fdb pr. klub, hvor xxxx er klubnummeret",
    ejer: "Klubben (lokalt), understøttet af DBF",
    placering: "Klub-pc",
    integrationer: ["Bridgemate Control", "BridgeOrg (indberetning)", "bridge.dk (resultatvisning)"],
  },
  {
    navn: "BridgeOrg",
    rolle: "Forbundets centrale register over klubber, medlemmer, medlemskaber, handicap og bordafgifter.",
    teknologi: "Central database med administrationsflade",
    data: "BRIDGEKLUBBER, MEDLEMMER, MEDLEMSKABER, HACTURNERINGER, HACPOSTERINGER, BORDAFGIFTER",
    ejer: "DBF's sekretariat",
    placering: "Central",
    integrationer: ["BC3 (medlems- og resultatudveksling)", "bridge.dk", "Kontingentopkrævning"],
  },
  {
    navn: "Bridgemate",
    rolle: "Indtastning af kontrakt og resultat ved bordet samt visning af score for spillerne.",
    teknologi: "Bridgemate II/III-terminaler, Bridgemate Control Software, server ved bordene",
    data: "Egen arbejdsdatabase, som BC3 læser resultater fra",
    ejer: "Klubben",
    placering: "Ved bordet",
    integrationer: ["BC3 på samme pc"],
  },
  {
    navn: "bridge.dk",
    rolle: "Offentligt website, klubsider, nyheder, turneringskalender og resultatvisning.",
    teknologi: "Website (i dag flere separate løsninger, klubsider hos forskellige udbydere)",
    data: "Redaktionelt indhold plus visning af data fra de øvrige systemer",
    ejer: "DBF og klubberne",
    placering: "Web",
    integrationer: ["BridgeOrg", "BC3-resultater", "Bridgebutikken"],
  },
  {
    navn: "Bridgebutikken",
    rolle: "Salg af spillekort, materialer, bøger og udstyr.",
    teknologi: "Selvstændig webshop",
    data: "Varer, ordrer og kunder i eget system",
    ejer: "DBF",
    placering: "Web",
    integrationer: ["bridge.dk (link i dag)"],
  },
  {
    navn: "Kursusadministration (Kursusklub 9999)",
    rolle: "Kursister oprettes i klub 9999, indtil de bliver medlem af en rigtig klub.",
    teknologi: "Håndteres i dag i BridgeOrg/BC3-sammenhæng",
    data: "Medlemsposter med klubnummer 9999",
    ejer: "DBF og undervisere",
    placering: "Central",
    integrationer: ["BridgeOrg", "BC3"],
  },
];

export type FlowTrin = {
  trin: string;
  system: string;
  handling: string;
  data: string;
  status: "KENDT" | "ANTAGET";
};

export const dataFlow: FlowTrin[] = [
  {
    trin: "1. Spillet afvikles",
    system: "Bridgemate",
    handling: "Spillerne indtaster kontrakt og resultat ved bordet.",
    data: "Bord, par/hold, spilnummer, kontrakt, score",
    status: "KENDT",
  },
  {
    trin: "2. Resultater hentes ind",
    system: "BC3 på klub-pc",
    handling: "Bridgemate Control afleverer resultaterne til den kørende turnering i BC3.",
    data: "RESULT knyttet til ROUNDMATCH i den aktive SECTION",
    status: "ANTAGET",
  },
  {
    trin: "3. Turneringen beregnes",
    system: "BC3",
    handling: "Score, placeringer og mesterpoint beregnes for gruppeturneringen.",
    data: "RESULT, SECTIONPLAYER/SECTIONTEAM, MASTERPOINTS",
    status: "ANTAGET",
  },
  {
    trin: "4. Indberetning",
    system: "BC3 → BridgeOrg",
    handling: "Klubben indberetter turnering og resultater til forbundet.",
    data: "HACTURNERINGER og HACPOSTERINGER pr. medlem",
    status: "ANTAGET",
  },
  {
    trin: "5. Central beregning",
    system: "BridgeOrg",
    handling: "Handicap opdateres, og mesterpoint samles pr. medlem.",
    data: "HCP før/efter pr. postering",
    status: "ANTAGET",
  },
  {
    trin: "6. Visning",
    system: "bridge.dk / klubside",
    handling: "Resultat, handicap og mesterpoint vises for medlem og offentlighed.",
    data: "Læsning af de centrale data",
    status: "ANTAGET",
  },
];

export const integrationsHuller = [
  "Der findes ikke et dokumenteret API mellem BC3 og forbundets systemer — udvekslingen sker via filer/indberetning og skal kortlægges.",
  "Klubsider ligger i dag hos flere udbydere uden fælles datamodel; en klub kan ikke gense sine turneringsdata på tværs.",
  "Medlemmer har flere logins (klubside, tilmelding, butik) — én fælles konto mangler.",
  "Tilmelding til turneringer sker via mail, regneark og flere forskellige formularer.",
  "Bridgebutikken er ikke koblet til medlemsdata, så klubrabatter håndteres manuelt.",
];

/* ---------------------------------------------------------------- Wiki BC3: skærme */

export type SkaermFelt = {
  etiket: string;
  vaerdi?: string;
  type: "tekst" | "dropdown" | "dato" | "tal" | "afkryds";
  kilde: string;
  status: "KENDT" | "ANTAGET";
};

export type Bc3Skaerm = {
  id: string;
  titel: string;
  vindue: string;
  menusti: string;
  formaal: string;
  gruppe: "Medlemmer" | "Turnering" | "Afvikling" | "Resultater" | "Klub";
  tabeller: string[];
  felter: SkaermFelt[];
  knapper: { navn: string; virkning: string }[];
  tabel?: { kolonner: string[]; raekker: string[][] };
  nyFlade: { skaerm: string; sti: string };
  noter?: string[];
};

export const bc3Skaerme: Bc3Skaerm[] = [
  {
    id: "medlemsliste",
    titel: "Medlemskartotek",
    vindue: "BridgeCentral 3 — Medlemmer [2275 Rødovre Bridgeklub]",
    menusti: "Medlemmer → Medlemskartotek",
    formaal:
      "Klubbens medlemsliste med stamdata, medlemsnummer, kontingentstatus og handicap. Bruges ved sæsonopstart og ved oprettelse af nye medlemmer.",
    gruppe: "Medlemmer",
    tabeller: ["MEM_MEMBER", "MEM_CLUB", "MEDLEMSKABER"],
    felter: [
      { etiket: "Medlemsnr.", vaerdi: "301045", type: "tal", kilde: "MEM_MEMBER.MEMBERNO", status: "ANTAGET" },
      { etiket: "Fornavn", vaerdi: "Jens", type: "tekst", kilde: "MEM_MEMBER.FIRSTNAME", status: "ANTAGET" },
      { etiket: "Efternavn", vaerdi: "Ahlmann", type: "tekst", kilde: "MEM_MEMBER.LASTNAME", status: "ANTAGET" },
      { etiket: "Adresse", vaerdi: "Rødovrevej 128", type: "tekst", kilde: "MEM_MEMBER.ADDRESS", status: "ANTAGET" },
      { etiket: "Postnr./by", vaerdi: "2610 Rødovre", type: "tekst", kilde: "MEM_MEMBER.ZIPCODE + CITY", status: "ANTAGET" },
      { etiket: "E-mail", vaerdi: "jens.ahlmann@demo.dk", type: "tekst", kilde: "MEM_MEMBER.EMAIL", status: "ANTAGET" },
      { etiket: "Telefon", vaerdi: "28 44 91 07", type: "tekst", kilde: "MEM_MEMBER.PHONE", status: "ANTAGET" },
      { etiket: "Fødselsdato", vaerdi: "12-03-1958", type: "dato", kilde: "MEM_MEMBER.BIRTHDATE", status: "ANTAGET" },
      { etiket: "Klub", vaerdi: "2275 Rødovre", type: "dropdown", kilde: "MEM_MEMBER.CLUBNO → MEM_CLUB.CLUBNO", status: "ANTAGET" },
      { etiket: "Kontingent betalt", vaerdi: "2026/27", type: "afkryds", kilde: "MEDLEMSKABER.KONTINGENTSTATUS", status: "ANTAGET" },
    ],
    knapper: [
      { navn: "Ny", virkning: "Opretter en tom medlemspost i MEM_MEMBER." },
      { navn: "Gem", virkning: "Skriver stamdata til MEM_MEMBER." },
      { navn: "Slet", virkning: "Markerer/fjerner medlem — konsekvens for historiske resultater skal verificeres." },
      { navn: "Hent fra forbund", virkning: "Henter medlemsdata fra BridgeOrg. Formatet skal verificeres." },
    ],
    tabel: {
      kolonner: ["Medlemsnr.", "Navn", "Klub", "Handicap", "Kontingent"],
      raekker: [
        ["301045", "Jens Ahlmann", "2275", "12,8", "Betalt"],
        ["301102", "Kirsten Damgaard (demo)", "2275", "18,4", "Betalt"],
        ["301188", "Hans Bruun (demo)", "2275", "24,1", "Mangler"],
        ["301240", "Lise Overgaard (demo)", "2275", "31,7", "Betalt"],
      ],
    },
    nyFlade: { skaerm: "Online BC3 → Spillere", sti: "/bc3/online" },
    noter: ["Feltnavnene i MEM_MEMBER er ikke bekræftet og skal læses fra en rigtig xxxx.fdb."],
  },
  {
    id: "opret-turnering",
    titel: "Opret turnering",
    vindue: "BridgeCentral 3 — Ny turnering",
    menusti: "Turnering → Ny turnering",
    formaal:
      "Opretter turneringen på øverste niveau med navn, dato, spilleform og pointtype. Herefter oprettes grupper/rækker og sektioner.",
    gruppe: "Turnering",
    tabeller: ["MAINTOURNAMENT", "GROUPTOURNAMENT"],
    felter: [
      { etiket: "Turneringsnavn", vaerdi: "Klubturnering efterår — 3. aften", type: "tekst", kilde: "MAINTOURNAMENT.NAME", status: "ANTAGET" },
      { etiket: "Startdato", vaerdi: "24-09-2026", type: "dato", kilde: "MAINTOURNAMENT.STARTDATE", status: "ANTAGET" },
      { etiket: "Klub", vaerdi: "2275", type: "dropdown", kilde: "MAINTOURNAMENT.CLUBNO", status: "ANTAGET" },
      { etiket: "Spilleform", vaerdi: "Parturnering", type: "dropdown", kilde: "GROUPTOURNAMENT (spilleform) — felt ukendt", status: "ANTAGET" },
      { etiket: "Antal grupper/rækker", vaerdi: "2", type: "tal", kilde: "Antal rækker i GROUPTOURNAMENT", status: "ANTAGET" },
      { etiket: "Pointtype", vaerdi: "Bronze", type: "dropdown", kilde: "MASTERPOINTS.CATEGORY", status: "ANTAGET" },
    ],
    knapper: [
      { navn: "Opret", virkning: "Indsætter række i MAINTOURNAMENT og de valgte GROUPTOURNAMENT-rækker." },
      { navn: "Annullér", virkning: "Lukker vinduet uden at skrive." },
    ],
    nyFlade: { skaerm: "Klubadmin → Turneringer", sti: "/klubadmin" },
  },
  {
    id: "sektioner",
    titel: "Sektioner og bevægelse",
    vindue: "BridgeCentral 3 — Sektioner",
    menusti: "Turnering → Rækker → Sektioner",
    formaal:
      "Fastlægger sektioner under en gruppe/række, vælger bevægelse (movement), antal borde og antal runder.",
    gruppe: "Turnering",
    tabeller: ["SECTION", "ROUND", "BOARDSPEC"],
    felter: [
      { etiket: "Sektion", vaerdi: "A", type: "tekst", kilde: "SECTION.LETTER", status: "ANTAGET" },
      { etiket: "Bevægelse", vaerdi: "Howell 7 borde", type: "dropdown", kilde: "SECTION.MOVEMENT", status: "ANTAGET" },
      { etiket: "Antal borde", vaerdi: "7", type: "tal", kilde: "Afledt af ROUNDMATCH.TABLENO", status: "ANTAGET" },
      { etiket: "Antal runder", vaerdi: "13", type: "tal", kilde: "ROUND.ROUNDNO (højeste)", status: "ANTAGET" },
      { etiket: "Spil pr. runde", vaerdi: "2", type: "tal", kilde: "BOARDSPEC.BOARDNO pr. runde", status: "ANTAGET" },
    ],
    knapper: [
      { navn: "Generér runder", virkning: "Opretter ROUND og ROUNDMATCH ud fra den valgte bevægelse." },
      { navn: "Udskriv guidekort", virkning: "Printer bordkort. Ingen databaseskrivning." },
    ],
    nyFlade: { skaerm: "Online BC3 → Startlister", sti: "/bc3/online" },
  },
  {
    id: "deltagere",
    titel: "Deltagere / startliste",
    vindue: "BridgeCentral 3 — Deltagere i sektion A",
    menusti: "Turnering → Deltagere",
    formaal: "Tilmelder par eller hold til sektionen og knytter spillerne til medlemsnumre.",
    gruppe: "Afvikling",
    tabeller: ["SECTIONPLAYER", "SECTIONTEAM", "MEM_MEMBER"],
    felter: [
      { etiket: "Par-/holdnr.", vaerdi: "3", type: "tal", kilde: "SECTIONTEAM.TEAMNO", status: "ANTAGET" },
      { etiket: "Navn på hold", vaerdi: "Ahlmann/Damgaard", type: "tekst", kilde: "SECTIONTEAM.TEAMNAME", status: "ANTAGET" },
      { etiket: "Spiller 1 medlemsnr.", vaerdi: "301045", type: "tal", kilde: "SECTIONPLAYER.MEMBERNO", status: "ANTAGET" },
      { etiket: "Spiller 2 medlemsnr.", vaerdi: "301102", type: "tal", kilde: "SECTIONPLAYER.MEMBERNO", status: "ANTAGET" },
      { etiket: "Retning", vaerdi: "NS", type: "dropdown", kilde: "SECTIONPLAYER.DIRECTION", status: "ANTAGET" },
    ],
    knapper: [
      { navn: "Tilføj par", virkning: "Indsætter SECTIONTEAM + to SECTIONPLAYER-rækker." },
      { navn: "Hent fra medlemsliste", virkning: "Slår medlemsnummer op i MEM_MEMBER." },
    ],
    tabel: {
      kolonner: ["Par", "Nord/Syd", "Øst/Vest", "Bord", "Retning"],
      raekker: [
        ["1", "Overgaard/Bruun (demo)", "—", "1", "NS"],
        ["2", "Ahlmann/Damgaard", "—", "2", "NS"],
        ["3", "Kjær/Holm (demo)", "—", "3", "ØV"],
      ],
    },
    nyFlade: { skaerm: "Tilmelding → Deltagere", sti: "/turneringer" },
  },
  {
    id: "bridgemate",
    titel: "Bridgemate Control",
    vindue: "Bridgemate Control Software — Session 24-09-2026",
    menusti: "Turnering → Bridgemate → Start session",
    formaal:
      "Sender bevægelse og spil til terminalerne og henter resultater tilbage, mens turneringen kører.",
    gruppe: "Afvikling",
    tabeller: ["ROUNDMATCH", "RESULT", "BOARDSPEC"],
    felter: [
      { etiket: "Session", vaerdi: "24-09-2026 19:00", type: "dato", kilde: "Bridgemate-arbejdsdatabase", status: "ANTAGET" },
      { etiket: "Sektion", vaerdi: "A", type: "dropdown", kilde: "SECTION.LETTER", status: "ANTAGET" },
      { etiket: "Terminaler fundet", vaerdi: "7", type: "tal", kilde: "Kun Bridgemate", status: "KENDT" },
      { etiket: "Automatisk hentning", vaerdi: "Til", type: "afkryds", kilde: "Kun Bridgemate", status: "KENDT" },
    ],
    knapper: [
      { navn: "Start server", virkning: "Åbner forbindelsen til bordene." },
      { navn: "Hent resultater", virkning: "Skriver resultater til RESULT via ROUNDMATCH." },
    ],
    nyFlade: { skaerm: "Online BC3 → Turneringsafvikling", sti: "/bc3/online" },
    noter: ["Overførselsformat mellem Bridgemate og BC3 er ikke dokumenteret — SKAL VERIFICERES."],
  },
  {
    id: "resultatindtastning",
    titel: "Manuel resultatindtastning",
    vindue: "BridgeCentral 3 — Indtastning, runde 4, bord 2",
    menusti: "Turnering → Indtastning",
    formaal: "Indtaster kontrakt og resultat, når Bridgemate ikke bruges, eller ved rettelser.",
    gruppe: "Resultater",
    tabeller: ["RESULT", "ROUNDMATCH", "ROUND"],
    felter: [
      { etiket: "Runde", vaerdi: "4", type: "tal", kilde: "ROUND.ROUNDNO", status: "ANTAGET" },
      { etiket: "Bord", vaerdi: "2", type: "tal", kilde: "ROUNDMATCH.TABLENO", status: "ANTAGET" },
      { etiket: "Spil", vaerdi: "7", type: "tal", kilde: "RESULT.BOARDNO", status: "ANTAGET" },
      { etiket: "Kontrakt", vaerdi: "4♥ +1", type: "tekst", kilde: "RESULT.CONTRACT", status: "ANTAGET" },
      { etiket: "Score", vaerdi: "650", type: "tal", kilde: "RESULT.SCORE", status: "ANTAGET" },
      { etiket: "Point (MP)", vaerdi: "8", type: "tal", kilde: "RESULT.MATCHPOINTS", status: "ANTAGET" },
    ],
    knapper: [
      { navn: "Gem spil", virkning: "Indsætter/opdaterer række i RESULT." },
      { navn: "Næste bord", virkning: "Skifter ROUNDMATCH." },
    ],
    nyFlade: { skaerm: "Online BC3 → Resultater", sti: "/bc3/online" },
  },
  {
    id: "beregning",
    titel: "Beregning og resultatliste",
    vindue: "BridgeCentral 3 — Resultat, Klubturnering efterår 3. aften",
    menusti: "Turnering → Beregn → Resultatliste",
    formaal: "Beregner scorer, placeringer og mesterpoint og danner resultatliste til opslag og web.",
    gruppe: "Resultater",
    tabeller: ["RESULT", "SECTIONPLAYER", "MASTERPOINTS"],
    felter: [
      { etiket: "Beregningsmetode", vaerdi: "Matchpoint (%)", type: "dropdown", kilde: "Ikke dokumenteret", status: "ANTAGET" },
      { etiket: "Tildel mesterpoint", vaerdi: "Ja", type: "afkryds", kilde: "MASTERPOINTS", status: "ANTAGET" },
      { etiket: "Kategori", vaerdi: "Bronze", type: "dropdown", kilde: "MASTERPOINTS.CATEGORY", status: "ANTAGET" },
    ],
    knapper: [
      { navn: "Beregn", virkning: "Opdaterer scorer og danner MASTERPOINTS-poster." },
      { navn: "Udskriv", virkning: "Danner resultatliste (pdf/print)." },
      { navn: "Eksportér til web", virkning: "Danner filen, der lægges på klubsiden. Formatet skal verificeres." },
    ],
    tabel: {
      kolonner: ["Plads", "Par", "Score", "Procent", "Mesterpoint"],
      raekker: [
        ["1", "Ahlmann/Damgaard", "182", "62,4 %", "Bronze 4"],
        ["2", "Kjær/Holm (demo)", "176", "60,1 %", "Bronze 3"],
        ["3", "Overgaard/Bruun (demo)", "168", "57,3 %", "Bronze 2"],
      ],
    },
    nyFlade: { skaerm: "Resultater", sti: "/resultater" },
  },
  {
    id: "indberetning",
    titel: "Indberetning til forbundet",
    vindue: "BridgeCentral 3 — Indberetning",
    menusti: "Klub → Indberetning til DBF",
    formaal:
      "Sender turnering og resultater til forbundet, så handicap, mesterpoint og bordafgifter kan opdateres centralt.",
    gruppe: "Klub",
    tabeller: ["HACTURNERINGER", "HACPOSTERINGER", "BORDAFGIFTER"],
    felter: [
      { etiket: "Periode", vaerdi: "September 2026", type: "dropdown", kilde: "BORDAFGIFTER.PERIODE", status: "ANTAGET" },
      { etiket: "Turnering", vaerdi: "Klubturnering efterår — 3. aften", type: "dropdown", kilde: "HACTURNERINGER.TURNERINGSNAVN", status: "ANTAGET" },
      { etiket: "Antal borde", vaerdi: "7", type: "tal", kilde: "BORDAFGIFTER.ANTAL_BORDE", status: "ANTAGET" },
      { etiket: "Indgår i handicap", vaerdi: "Ja", type: "afkryds", kilde: "HACTURNERINGER", status: "ANTAGET" },
    ],
    knapper: [
      { navn: "Dan indberetning", virkning: "Danner filen/kaldet til forbundets system. Mekanismen skal verificeres." },
      { navn: "Send", virkning: "Overfører til BridgeOrg." },
    ],
    nyFlade: { skaerm: "DBF administration → Turneringer", sti: "/dbf" },
    noter: ["Om indberetningen sker som fil, webservice eller manuel upload er ikke afklaret."],
  },
];

/* ---------------------------------------------------------------- Skærmfølger */

export type SkaermFoelge = {
  id: string;
  titel: string;
  beskrivelse: string;
  rolle: string;
  trin: { skaermId?: string; skaerm: string; handling: string; data: string; nyFlade: string }[];
};

export const skaermFoelger: SkaermFoelge[] = [
  {
    id: "saesonopstart",
    titel: "Sæsonopstart: medlemmer og kontingent",
    beskrivelse: "Følgen klubkassereren gennemgår, når en ny sæson begynder.",
    rolle: "Klubkasserer / klubadministrator",
    trin: [
      {
        skaermId: "medlemsliste",
        skaerm: "Medlemskartotek",
        handling: "Gennemgå medlemsliste, ret adresser og opret nye medlemmer.",
        data: "MEM_MEMBER",
        nyFlade: "Online BC3 → Spillere",
      },
      {
        skaerm: "Hent medlemsdata fra forbundet",
        handling: "Afstem klubbens liste med forbundets register.",
        data: "MEDLEMMER, MEDLEMSKABER",
        nyFlade: "Automatisk afstemning i den samlede platform",
      },
      {
        skaerm: "Kontingentopkrævning",
        handling: "Markér betalt kontingent for sæsonen.",
        data: "MEDLEMSKABER.KONTINGENTSTATUS",
        nyFlade: "Klubadmin → Medlemmer",
      },
      {
        skaerm: "Udskriv medlemsliste",
        handling: "Print eller eksportér listen til klubbens brug.",
        data: "Læsning",
        nyFlade: "Eksport fra Online BC3",
      },
    ],
  },
  {
    id: "klubaften",
    titel: "Klubaften: fra oprettelse til resultat på nettet",
    beskrivelse: "Den fulde følge for en almindelig klubaften med Bridgemate.",
    rolle: "Turneringsleder",
    trin: [
      {
        skaermId: "opret-turnering",
        skaerm: "Ny turnering",
        handling: "Opret turneringen med navn, dato og pointtype.",
        data: "MAINTOURNAMENT, GROUPTOURNAMENT",
        nyFlade: "Klubadmin → Turneringer",
      },
      {
        skaermId: "sektioner",
        skaerm: "Sektioner og bevægelse",
        handling: "Vælg bevægelse, antal borde og runder; generér runder.",
        data: "SECTION, ROUND, ROUNDMATCH",
        nyFlade: "Online BC3 → Startlister",
      },
      {
        skaermId: "deltagere",
        skaerm: "Deltagere",
        handling: "Tilmeld par/hold og knyt medlemsnumre.",
        data: "SECTIONTEAM, SECTIONPLAYER",
        nyFlade: "Tilmelding + Online BC3 → Tilmeldinger",
      },
      {
        skaermId: "bridgemate",
        skaerm: "Bridgemate Control",
        handling: "Start session, spil afvikles, resultater hentes løbende.",
        data: "RESULT",
        nyFlade: "Online BC3 → Turneringsafvikling",
      },
      {
        skaermId: "resultatindtastning",
        skaerm: "Indtastning",
        handling: "Ret enkeltspil eller indtast manuelt.",
        data: "RESULT",
        nyFlade: "Online BC3 → Resultater",
      },
      {
        skaermId: "beregning",
        skaerm: "Beregn og resultatliste",
        handling: "Beregn score, tildel mesterpoint, udskriv liste.",
        data: "RESULT, MASTERPOINTS",
        nyFlade: "Resultater på bridge.dk og klubsiden",
      },
      {
        skaermId: "indberetning",
        skaerm: "Indberetning til DBF",
        handling: "Send turnering og resultater til forbundet.",
        data: "HACTURNERINGER, HACPOSTERINGER, BORDAFGIFTER",
        nyFlade: "Sker automatisk i den samlede platform",
      },
    ],
  },
  {
    id: "handicapfoelge",
    titel: "Handicap: fra resultat til nyt handicap",
    beskrivelse: "Følgen der ender med, at medlemmet ser sit nye handicap.",
    rolle: "Klub + forbund + medlem",
    trin: [
      {
        skaermId: "beregning",
        skaerm: "Resultatliste i BC3",
        handling: "Turneringen beregnes og godkendes.",
        data: "RESULT",
        nyFlade: "Online BC3 → Resultater",
      },
      {
        skaermId: "indberetning",
        skaerm: "Indberetning",
        handling: "Turneringen markeres som handicapgivende og indberettes.",
        data: "HACTURNERINGER",
        nyFlade: "Automatisk indberetning",
      },
      {
        skaerm: "Central handicapberegning",
        handling: "Forbundet danner en postering pr. deltager med HCP før og efter.",
        data: "HACPOSTERINGER.HCP_FOER / HCP_EFTER",
        nyFlade: "DBF administration → Handicap",
      },
      {
        skaerm: "Medlemmets side",
        handling: "Medlemmet ser aktuelt handicap og hele posteringshistorikken.",
        data: "Læsning af HACPOSTERINGER",
        nyFlade: "Min side → Mit handicap",
      },
    ],
  },
];

export const wikiAabneSpoergsmaal = [
  { emne: "MEM_MEMBER", spoergsmaal: "Præcise feltnavne og datatyper for stamdata, samt om medlemsnummer er primærnøgle.", status: "SKAL VERIFICERES" },
  { emne: "SECTIONPLAYER", spoergsmaal: "Hvordan knyttes en spiller til medlemsnummer, og hvad sker der for gæstespillere uden medlemsnummer?", status: "SKAL VERIFICERES" },
  { emne: "RESULT", spoergsmaal: "Nøglestruktur: er der én række pr. spil pr. par, eller pr. bord/runde?", status: "SKAL VERIFICERES" },
  { emne: "Bridgemate", spoergsmaal: "Format og retning for overførsel mellem Bridgemate-databasen og BC3.", status: "SKAL VERIFICERES" },
  { emne: "Indberetning", spoergsmaal: "Sker indberetning til BridgeOrg som fil, webservice eller manuel upload?", status: "SKAL VERIFICERES" },
  { emne: "MASTERPOINTS", spoergsmaal: "Beregnes point i BC3 eller centralt, og hvor ligger den gældende sats?", status: "SKAL VERIFICERES" },
  { emne: "Mesterpointsatser", spoergsmaal: "Hvilke satser gælder for guld, sølv og bronze pr. turneringstype?", status: "SKAL VERIFICERES" },
];
