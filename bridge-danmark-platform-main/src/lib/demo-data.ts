/**
 * DEMODATA til bridge.dk-prototypen.
 * Intet af dette er hentet fra rigtige systemer — alle tal og navne er opdigtede
 * til demonstration. Rigtige data og skærmbilleder leveres senere.
 */

export type Kreds = "Kreds Nord" | "Kreds Midt" | "Kreds Syd" | "Kreds Øst";

export type Distrikt = {
  id: string;
  navn: string;
  kreds: Kreds;
  region: string;
  klubber: number;
  medlemmer: number;
  formand: string;
  beskrivelse: string;
};

export const distrikter: Distrikt[] = [
  {
    id: "1",
    navn: "Distrikt Nordjylland",
    kreds: "Kreds Nord",
    region: "Nordjylland",
    klubber: 42,
    medlemmer: 3120,
    formand: "Karen Bjerregaard (demo)",
    beskrivelse:
      "Distriktet dækker klubber fra Skagen til Hobro og afvikler distriktsturneringer i hold og par gennem hele sæsonen.",
  },
  {
    id: "2",
    navn: "Distrikt Midtjylland",
    kreds: "Kreds Midt",
    region: "Midtjylland",
    klubber: 55,
    medlemmer: 4310,
    formand: "Peter Holm (demo)",
    beskrivelse:
      "Et af forbundets største distrikter med stærke traditioner for holdturnering og undervisning af nye spillere.",
  },
  {
    id: "3",
    navn: "Distrikt Sydjylland",
    kreds: "Kreds Syd",
    region: "Syddanmark",
    klubber: 38,
    medlemmer: 2680,
    formand: "Lise Dahl (demo)",
    beskrivelse:
      "Distriktet samler klubberne i Sønderjylland og Trekantområdet, herunder Kolding Bridge Center.",
  },
  {
    id: "4",
    navn: "Distrikt Fyn",
    kreds: "Kreds Syd",
    region: "Fyn",
    klubber: 27,
    medlemmer: 1740,
    formand: "Mogens Riis (demo)",
    beskrivelse: "Fynske klubber med fælles distriktsturneringer i Odense og Svendborg.",
  },
  {
    id: "5",
    navn: "Distrikt Sjælland Syd",
    kreds: "Kreds Øst",
    region: "Sjælland",
    klubber: 31,
    medlemmer: 2050,
    formand: "Birgitte Sand (demo)",
    beskrivelse: "Klubber i Næstved, Roskilde, Køge og Vordingborg-området.",
  },
  {
    id: "6",
    navn: "Distrikt Storkøbenhavn",
    kreds: "Kreds Øst",
    region: "Hovedstaden",
    klubber: 64,
    medlemmer: 5210,
    formand: "Anders Krog (demo)",
    beskrivelse:
      "Landets tættest befolkede distrikt med mange klubber, bl.a. Rødovre Bridgeklub, og et højt turneringsniveau.",
  },
];

export const kredse: { navn: Kreds; beskrivelse: string; distrikter: string[] }[] = [
  {
    navn: "Kreds Nord",
    beskrivelse:
      "Kredsen samler de nordjyske distrikter og koordinerer kredsturneringer samt kvalifikation til divisionerne.",
    distrikter: ["Distrikt Nordjylland"],
  },
  {
    navn: "Kreds Midt",
    beskrivelse: "Midtjyske distrikter med fælles kredsfinaler i hold og par.",
    distrikter: ["Distrikt Midtjylland"],
  },
  {
    navn: "Kreds Syd",
    beskrivelse: "Syd- og Sønderjylland samt Fyn. Kredsen står bl.a. for kredsholdturneringen.",
    distrikter: ["Distrikt Sydjylland", "Distrikt Fyn"],
  },
  {
    navn: "Kreds Øst",
    beskrivelse: "Sjælland, Lolland-Falster, Bornholm og hovedstadsområdet.",
    distrikter: ["Distrikt Sjælland Syd", "Distrikt Storkøbenhavn"],
  },
];

export type Spilletid = { dag: string; tid: string; beskrivelse: string; gruppe?: string };

export type KlubTema = {
  /** Demonstrerer at klubber kan konfigurere eget udtryk. */
  primary: string;
  accent: string;
  overskrift: string;
  stil: "standard" | "individuel";
};

/**
 * Eksterne systemer pr. klub. Konfigurationsdata, så klubber senere kan
 * oprettes automatisk fra BC3/BridgeOrg i stedet for at kodes manuelt.
 */
export type KlubLinks = {
  resultsUrl?: string;
  handicapUrl?: string;
  masterpointsUrl?: string;
  rankingUrl?: string;
  bronzeStandingsUrl?: string;
  legacyWebsiteUrl?: string;
  /** Klubbens egen tilmelding (fx MBridge). Åbnes i ny fane. */
  tilmeldingUrl?: string;
};

export type KlubAabentHus = {
  tekst: string;
  spilstart: string;
  undervisning?: string;
  pris: string;
  tilmeldingUrl?: string;
};

export type KlubIndholdAfsnit = { titel?: string; tekst?: string; punkter?: string[] };

/** CMS-indhold pr. klub. Kommer senere fra klubbens eget CMS eller BC3/API. */
export type KlubIndholdSektion = {
  id: string;
  titel: string;
  afsnit: KlubIndholdAfsnit[];
  /** Lange afsnit vises sammenklappet, så siden ikke bliver uendelig lang. */
  accordion?: boolean;
};

export type KlubRekrutteringskort = {
  titel: string;
  tekst: string;
};

export type KlubAktivitetskort = {
  titel: string;
  tekst: string;
};

export type KlubResultatkort = {
  titel: string;
  tekst: string;
  knaptekst: string;
  url: string;
};

/** Offentligt spillehold under en hovedklub. Data kan senere komme fra BC3/API. */
export type KlubSpillehold = {
  /** Intern rute-id under klubben: /{klubnr}/{id}. Standard er clubNo. */
  id?: string;
  /** DBF-klubnummer for spilleholdet. Udelades, indtil værdien er verificeret. */
  clubNo?: number;
  /** DBF-hovedklubnummer, hvis det afviger fra klubbens eget nummer. */
  mainClubNo?: number;
  navn: string;
  spilletid?: string;
  beskrivelse: string;
  aktivitet?: string;
  holdleder?: string;
  undervisning?: string;
  spillested?: string;
  /** Officiel turneringsoversigt. Udelades, når linket ikke er verificeret. */
  resultsUrl?: string;
  /** Valgfrit link til spilleholdets aktuelle turnering i DBF's resultatsystem. */
  aktuelleTurneringUrl?: string;
  /** Valgfrit turneringsnummer i DBF's resultatsystem. */
  currentTournament?: string;
  /** Valgfrit handicaplink, hvis spilleholdet har sin egen liste. */
  handicapUrl?: string;
};

/** Rute-id for et spillehold under en klub. */
export function spilleholdId(hold: KlubSpillehold): string {
  return hold.id ?? String(hold.clubNo);
}

export type Klub = {
  nr: string;
  navn: string;
  kortNavn: string;
  distrikt: string;
  kreds: Kreds;
  by: string;
  region: string;
  adresse: string;
  /** Udelades, når der ikke findes en reel kilde til medlemstallet. */
  medlemmer?: number | undefined;
  spillestedNavn?: string;
  postnummer?: string;
  logoTekst: string;
  headerLabel?: string;
  beskrivelse: string;
  spilletider: Spilletid[];
  undergrupper?: { navn: string; beskrivelse: string; medlemmer: number }[];
  spillehold?: KlubSpillehold[];
  spilleholdTitel?: string;
  spilleholdBeskrivelse?: string;
  kontakt: { rolle: string; navn: string; email: string; telefon: string }[];
  nyheder: { dato: string; titel: string; tekst: string }[];
  tema: KlubTema;
  eksterneLinks?: KlubLinks;
  aabentHus?: KlubAabentHus;
  klubIndhold?: KlubIndholdSektion[];
  /** Valgfri forsidetekst og kontakt-CTA til klubber med et særligt rekrutteringsfokus. */
  forsideTitel?: string;
  kontaktCta?: string;
  rekrutteringskort?: KlubRekrutteringskort[];
  rekrutteringsLabel?: string;
  rekrutteringsTitel?: string;
  rekrutteringsBeskrivelse?: string;
  aktivitetskort?: KlubAktivitetskort[];
  aktiviteterTitel?: string;
  aktiviteterBeskrivelse?: string;
  resultatkort?: KlubResultatkort[];
  resultaterTitel?: string;
  resultaterBeskrivelse?: string;
  juniorInfoUrl?: string;
  dbfLinksTitel?: string;
  dbfLinksBeskrivelse?: string;
  masterpointsTekst?: string;
  rankingTekst?: string;
};

export const klubber: Klub[] = [
  {
    nr: "2132",
    navn: "Gentofte Bridgeklub",
    kortNavn: "GBK",
    distrikt: "Distrikt Nordsjælland",
    kreds: "Kreds Øst",
    by: "Charlottenlund",
    region: "Hovedstaden",
    adresse: "Henrik Hertz Vej 1",
    spillestedNavn: "Ordrup Sognegård",
    postnummer: "2920",
    logoTekst: "GBK",
    beskrivelse:
      "Gentofte Bridgeklub spiller i Ordrup Sognegård og tilbyder både eftermiddagsbridge og aftenbridge om mandagen. Klubben har undervisning før aftenbridgen for alle interesserede.",
    spilletider: [
      { dag: "Mandag", tid: "14.00 – 17.30", beskrivelse: "Turneringsbridge (holdleder Ronny Neis)" },
      {
        dag: "Mandag",
        tid: "18.45 – 22.15",
        beskrivelse: "Turneringsbridge (holdleder Søren Debois)",
      },
      {
        dag: "Mandag",
        tid: "18.00 – 18.30",
        beskrivelse: "Undervisning ved Lars Øgaard for alle interesserede",
      },
    ],
    spillehold: [
      {
        clubNo: 4,
        navn: "Mandag eftermiddag",
        spilletid: "Mandag 14.00 – 17.30",
        aktivitet: "Turneringsbridge",
        beskrivelse: "Fast eftermiddagshold med turneringsbridge i Ordrup Sognegård.",
        holdleder: "Ronny Neis",
        resultsUrl:
          "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2132&clubno=4",
        aktuelleTurneringUrl:
          "https://resultater.bridge.dk/template/turnering.php?mainclubno=2132&clubno=4&tournament=483",
      },
      {
        clubNo: 3,
        navn: "Mandag aften / åbent hus",
        spilletid: "Mandag 18.45 – 22.15",
        aktivitet: "Turneringsbridge og åbent hus",
        beskrivelse: "Turneringsbridge og åbent hus. Nye spillere og gæster er velkomne.",
        holdleder: "Søren Debois",
        undervisning: "Undervisning fra ca. kl. 18.00 – 18.30",
        resultsUrl:
          "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2132&clubno=3",
      },
      {
        clubNo: 2,
        navn: "Sommer- og sølvturneringer",
        aktivitet: "Særlige turneringer",
        beskrivelse:
          "Sommerbridge, åbne turneringer, sølvturneringer og andre særlige arrangementer.",
        resultsUrl:
          "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2132&clubno=2",
      },
    ],
    kontakt: [
      {
        rolle: "Turneringsledere",
        navn: "Ronny Neis og Søren Debois",
        email: "",
        telefon: "",
      },
    ],
    nyheder: [],
    tema: {
      primary: "oklch(0.42 0.07 190)",
      accent: "oklch(0.55 0.1 150)",
      overskrift: "Bridge, fællesskab og turnering i Gentofte",
      stil: "individuel",
    },
    eksterneLinks: {
      handicapUrl: "https://medlemmer.bridge.dk/klubhac.php?Klubnr=2132",
      masterpointsUrl: "https://www.bridge.dk/mp/mp2132.html",
      rankingUrl: "https://www.bridge.dk/mp/ranglister/rangliste2132.html",
      bronzeStandingsUrl: "https://www.bridge.dk/2132/Bronzestilling.html",
      legacyWebsiteUrl: "https://www.bridge.dk/2132/",
      tilmeldingUrl: "https://mbridge.dk/files7/index.php?klubnr=2132&ak=1",
    },
    aabentHus: {
      tekst:
        "Gentofte Bridgeklub har åbent hus mandag aften. Du er velkommen til at komme forbi og spille med — og der er undervisning før spillestart for alle interesserede.",
      spilstart: "Spilstart kl. 18.45",
      undervisning: "Undervisning fra kl. 18.00",
      pris: "60 kr. pr. spiller pr. gang. Unge under 26 år spiller gratis.",
    },
    klubIndhold: [
      {
        id: "klubaktiviteter",
        titel: "Klubaktiviteter",
        afsnit: [
          {
            tekst:
              "Klubben spiller i Ordrup Sognegård, Henrik Hertz Vej 1, 2920 Charlottenlund. Der spilles turneringsbridge mandag eftermiddag og mandag aften, og der er undervisning før aftenbridgen.",
          },
          {
            punkter: [
              "Mandag kl. 14.00 – 17.30: turneringsbridge, holdleder Ronny Neis",
              "Mandag kl. 18.45 – 22.15: turneringsbridge, holdleder Søren Debois",
              "Mandag kl. 18.00 – 18.30: undervisning ved Lars Øgaard for alle interesserede",
              "Turneringsledere: Ronny Neis og Søren Debois",
              "Kaffeværter: medlemmerne skiftes efter klubbens kaffeliste-ordning",
            ],
          },
          {
            tekst:
              "De enkelte holds sæsonplaner findes under sæsonplanerne på klubbens hjemmeside.",
          },
        ],
      },
      {
        id: "kontingent",
        titel: "Kontingent",
        afsnit: [
          {
            punkter: [
              "Ét hold: 2.000 kr. — to hold: 3.000 kr.",
              "Aktive medlemmer, der spiller på mere end ét hold, får 50 % rabat på kontingentet til de efterfølgende hold.",
              "Er man primært medlem af en anden klub end GBK, gives 260 kr. rabat i kontingentet.",
              "Åbent hus: 60 kr. pr. gang. Unge under 26 år spiller gratis.",
            ],
          },
          {
            tekst:
              "Bank: Arbejdernes Landsbank, filialen i Lyngby, reg.nr. 5366, konto 0241211.",
          },
        ],
      },
      {
        id: "passivt-medlemskab",
        titel: "Passivt medlemskab",
        afsnit: [
          {
            tekst:
              "Man kan være passivt medlem af klubben for 500 kr. om året inkl. abonnement på Dansk Bridge.",
          },
          {
            titel: "Fordele ved passivt medlemskab",
            punkter: [
              "Man er blandt de første, der bliver tilbudt ledige pladser senere på sæsonen eller den næste sæson.",
              "Klubben anvender ofte passive medlemmer som substitutter.",
              "Man er velkommen til at deltage i klubbens juleafslutning — gratis.",
              "Man er velkommen til at deltage i klubbens sæsonafslutning og generalforsamling — gratis.",
            ],
          },
        ],
      },
      {
        id: "klubregler",
        titel: "Klubregler",
        accordion: true,
        afsnit: [
          {
            tekst:
              "Klubreglerne er et supplement til klubbens vedtægter og beskriver de almindelige forhold i klubben og for dens medlemmer. De udarbejdes og opdateres løbende af bestyrelsen og spilleudvalget i forening. Medlemmerne kan få indflydelse på udformningen gennem henvendelse til bestyrelsen eller spilleudvalget, eller på generalforsamlingen under “Eventuelt”.",
          },
          {
            titel: "1. Almindelige ordensregler",
            tekst:
              "Ordensreglerne fastlægger retningslinjer for, hvordan klubben fungerer i det daglige, og hvilke rettigheder og pligter medlemmerne har i samværet med de øvrige medlemmer.",
            punkter: [
              "Parkering: tillades ved Ordrup Kirke i de markerede båse samt på Kirkevej og Morescosvej.",
              "Drikkevarer: øl, sodavand, kaffe og te kan købes — betal det korrekte beløb i den opstillede kasse, og brug engangsemballagen.",
              "Rygning er ikke tilladt i sognegården. Der luftes ud i spillelokalet i pauserne.",
              "Opstilling og afrydning: kirketjenerne stiller bordene op, mens nedtagning og oprydning er klubbens forpligtelse, og alle medlemmer deltager.",
              "Materiel: klubbens materiel behandles skånsomt — undgå at bøje meldingskort og spillekort.",
              "Medlemsorientering: informationer gives på klubtavlen og på klubbens hjemmeside, og medlemmer med oplyst e-mail får nyheder direkte.",
              "Etikette og etik: man omgås hinanden høfligt, hjælper nye medlemmer til rette, møder i god tid og forklarer sine meldinger omhyggeligt.",
              "Substitutter ved forfald: medlemmet skaffer selv en substitut. Klubben fører en substitutliste, som kan rekvireres hos formanden.",
              "Turneringslederafgørelser: uregelmæssigheder afgøres af en turneringsleder, og der spilles ikke videre, før afgørelsen er truffet. Enhver afgørelse kan appelleres.",
            ],
          },
          {
            titel: "2. Turneringsreglement",
            tekst:
              "Turneringsreglementet skal sikre god tone og orden under afvikling af turneringer i klubbens regi, hjælpe spillerne med at forstå de turneringsansvarliges dispositioner og hjælpe de turneringsansvarlige med at disponere ensartet og korrekt.",
            punkter: [
              "Spilleperiode: sæsonen strækker sig fra september til april og slutter med generalforsamlingen. Spilleudvalget fremlægger en sæsonplan ved sæsonstart.",
              "Regelgrundlag: klubreglementet, DBF’s spillerhåndbog, turneringsbestemmelser (§ 306) og turneringslederhåndbog samt de internationale love for turneringsbridge.",
              "Systemer: højkunstige systemer er tilladt i A-rækken efter § 306. I de øvrige rækker anvendes naturlige og almindelige, kunstige systemer.",
              "Systemkort: et korrekt udfyldt systemkort pr. spiller er obligatorisk og lægges uopfordret frem på bordet.",
              "Turneringsledelse: spilleudvalget tilrettelægger turneringerne og udpeger turneringsledere. Appel skal meddeles inden de implicerede forlader spillelokalet og senest ½ time efter sektionens afslutning.",
              "Turneringskomité: fungerer som klubbens lov- og regelfortolkende udvalg og vejleder turneringslederen ved appelsager.",
              "Meldekasser: anvendes i alle klubbens turneringer efter DBF’s regler.",
              "Tidsoverskridelser: normalt 7 minutter pr. spil og 1 minut pr. rundeskift, med varselsignal 5 minutter før rundeskift.",
              "Substitutter: ethvert aktivt medlem, der er forhindret, skaffer selv en substitut med tilsvarende spillestyrke.",
            ],
          },
        ],
      },
      {
        id: "vedtaegter",
        titel: "Vedtægter",
        accordion: true,
        afsnit: [
          {
            tekst:
              "Klubbens vedtægter er beskrevet på klubbens nuværende hjemmeside sammen med klubreglerne. Vedtægterne er endnu ikke migreret ord for ord til bridge.dk — brug derfor klubbens eksisterende side, indtil klubbens CMS-indhold overføres.",
          },
        ],
      },
    ],
  },
  {
    nr: "2133",
    navn: "Ungdomsbridgeklubben",
    kortNavn: "UBK",
    distrikt: "Distrikt Nordsjælland",
    kreds: "Kreds Øst",
    by: "København og Aarhus",
    region: "Hele landet",
    adresse: "København og Aarhus",
    logoTekst: "UBK",
    headerLabel: "2133 · Ungdomsbridgeklubben",
    beskrivelse:
      "Ungdomsbridgeklubben er for børn og unge, der har lyst til at lære bridge, spille turneringer og være en del af et fællesskab med andre unge bridgespillere. Man kan være med både som ny spiller og som mere erfaren juniorspiller. Ungdomsbridgeklubben er en del af det danske juniorbridgemiljø og arbejder sammen med Danmarks Bridgeforbund og Dansk Skolebridge om aktiviteter for børn og unge.",
    spilletider: [],
    kontakt: [
      {
        rolle: "Kontakt",
        navn: "Ella Rosthøj",
        email: "ella@bridge.dk",
        telefon: "",
      },
    ],
    nyheder: [],
    tema: {
      primary: "oklch(0.42 0.12 205)",
      accent: "oklch(0.68 0.16 145)",
      overskrift: "Bridge for børn og unge – fællesskab, læring og turnering",
      stil: "individuel",
    },
    eksterneLinks: {
      resultsUrl:
        "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2133&clubno=1",
      handicapUrl: "https://medlemmer.bridge.dk/klubhac.php?Klubnr=2133",
      masterpointsUrl: "https://www.bridge.dk/mp/mp2133.html",
      rankingUrl: "https://www.bridge.dk/mp/ranglister/rangliste2133.html",
      bronzeStandingsUrl: "https://www.bridge.dk/2133/Bronzestilling.html",
    },
    forsideTitel: "Velkommen i Ungdomsbridgeklubben",
    kontaktCta: "Kom og prøv bridge",
    spilleholdTitel: "Spil ungdomsbridge",
    spilleholdBeskrivelse:
      "Vælg det spillehold, der passer dig. Hvert spillehold har sin egen side med information, turneringer og resultater.",
    spillehold: [
      {
        id: "1",
        navn: "Ungdomsbridge København",
        beskrivelse: "Ungdomsbridge for børn og unge i København.",
        aktivitet: "Ungdomsbridge",
        spillested: "København",
      },
      {
        id: "2",
        navn: "Ungdomsbridge Aarhus",
        beskrivelse: "Ungdomsbridge for børn og unge i Aarhus.",
        aktivitet: "Ungdomsbridge",
        spillested: "Aarhus",
      },
    ],
    aktiviteterTitel: "Aktiviteter for unge",
    aktiviteterBeskrivelse:
      "Ud over klubbens spillehold findes der aktiviteter for unge bridgespillere i hele landet.",
    aktivitetskort: [
      {
        titel: "Juniorcamps",
        tekst: "Danmarks Bridgeforbund arrangerer juniorcamps for unge bridgespillere.",
      },
      {
        titel: "Mesterskaber",
        tekst: "Information om junior- og ungdomsturneringer.",
      },
    ],
    dbfLinksTitel: "Mesterpoint og klubstillinger",
    dbfLinksBeskrivelse:
      "Se de officielle oplysninger for Ungdomsbridgeklubben hos Danmarks Bridgeforbund.",
    masterpointsTekst: "Se medlemmernes mesterpoint og titler.",
    rankingTekst: "Se Ungdomsbridgeklubbens officielle rangliste.",
    resultaterTitel: "Turneringer og resultater",
    resultaterBeskrivelse:
      "Turneringer og resultater hentes fra Danmarks Bridgeforbunds officielle resultatsystem.",
    juniorInfoUrl: "https://www2.bridge.dk/Juniorbridge.aspx?ID=17815",
    resultatkort: [
      {
        titel: "Turneringsoversigt",
        tekst: "Se Ungdomsbridgeklubbens turneringer og spillearrangementer i DBF's officielle resultatsystem.",
        knaptekst: "Se turneringsoversigt",
        url: "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2133&clubno=1",
      },
      {
        titel: "Resultater",
        tekst: "Se Ungdomsbridgeklubbens officielle resultatoversigt.",
        knaptekst: "Se resultater",
        url: "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2133&clubno=1",
      },
    ],
    rekrutteringsLabel: "Ny i bridge",
    rekrutteringsTitel: "Bridge er også for unge",
    rekrutteringsBeskrivelse:
      "Bridge er et kortspil, hvor samarbejde, logik og taktik er vigtigere end held. Du behøver ikke kunne bridge i forvejen. Ungdomsbridgeklubben og Danmarks Bridgeforbund har aktiviteter for både helt nye spillere og unge, der allerede spiller bridge.",
    rekrutteringskort: [
      {
        titel: "Nye spillere",
        tekst: "Du kan begynde uden at kende reglerne.",
      },
      {
        titel: "Andre unge",
        tekst: "Mød andre børn og unge, der spiller bridge.",
      },
      {
        titel: "Turneringer",
        tekst: "Når du har lyst, kan du deltage i turneringer og juniorarrangementer.",
      },
    ],
  },
  {
    nr: "2275",
    navn: "Rødovre Bridgeklub",
    kortNavn: "Rødovre BK",
    distrikt: "Distrikt Storkøbenhavn",
    kreds: "Kreds Øst",
    by: "Rødovre",
    region: "Hovedstaden",
    adresse: "Rødovre Parkvej 150, 2610 Rødovre",
    medlemmer: 148,
    logoTekst: "RBK",
    beskrivelse:
      "Rødovre Bridgeklub er en aktiv klub i Storkøbenhavn med både turneringsbridge og hyggebridge. Vi spiller i lyse lokaler på Rødovregaard, har egne Bridgemates og tilbyder undervisning for nye spillere hvert efterår.",
    spilletider: [
      { dag: "Mandag", tid: "19.00 – 22.30", beskrivelse: "Klubturnering, par (åben for alle)" },
      { dag: "Torsdag", tid: "19.00 – 22.30", beskrivelse: "Holdturnering og divisionstræning" },
      { dag: "Onsdag", tid: "13.30 – 16.30", beskrivelse: "Eftermiddagsbridge" },
    ],
    kontakt: [
      {
        rolle: "Formand",
        navn: "Jens Ahlmann (demo)",
        email: "formand@demo.bridge.dk",
        telefon: "20 00 00 01",
      },
      {
        rolle: "Turneringsleder",
        navn: "Susanne Vad (demo)",
        email: "tl@demo.bridge.dk",
        telefon: "20 00 00 02",
      },
    ],
    nyheder: [
      {
        dato: "2. september 2026",
        titel: "Sæsonstart mandag den 7. september",
        tekst:
          "Vi åbner sæsonen med parturnering og efterfølgende kaffe. Husk tilmelding via klubbens tilmeldingsside.",
      },
      {
        dato: "26. august 2026",
        titel: "Nyt hold i 2. division",
        tekst: "Klubbens førstehold er rykket op og møder i første runde Hillerød (demo).",
      },
      {
        dato: "14. august 2026",
        titel: "Begynderkursus starter 24. september",
        tekst: "10 aftener med erfaren underviser. Ingen forudsætninger nødvendige.",
      },
    ],
    tema: {
      primary: "oklch(0.4 0.09 220)",
      accent: "oklch(0.68 0.17 35)",
      overskrift: "Bridge i hjertet af Rødovre",
      stil: "standard",
    },
  },
  {
    nr: "4470",
    navn: "Kolding Bridge Center",
    kortNavn: "Kolding BC",
    distrikt: "Distrikt Sydjylland",
    kreds: "Kreds Syd",
    by: "Kolding",
    region: "Syddanmark",
    adresse: "Bredgade 24, 6000 Kolding",
    medlemmer: 412,
    logoTekst: "KBC",
    beskrivelse:
      "Kolding Bridge Center er et samlingssted for flere klubber og spillegrupper under samme tag. Centret har bridge næsten alle ugens dage, egne lokaler med 40 borde og et stort udvalg af turneringer for alle niveauer.",
    undergrupper: [
      {
        navn: "Kolding Bridgeklub af 1946",
        beskrivelse: "Klubbens turneringsafdeling med par- og holdturnering mandag og torsdag.",
        medlemmer: 186,
      },
      {
        navn: "Kolding Eftermiddagsbridge",
        beskrivelse: "Dagbridge tirsdag og fredag med handicapberegning.",
        medlemmer: 134,
      },
      {
        navn: "Kolding Juniorbridge",
        beskrivelse: "Undervisning og turnering for spillere under 25 år.",
        medlemmer: 28,
      },
      {
        navn: "Kolding Onsdagspar",
        beskrivelse: "Åben parturnering uden tilmeldingspligt.",
        medlemmer: 64,
      },
    ],
    spilletider: [
      {
        dag: "Mandag",
        tid: "19.00 – 22.30",
        beskrivelse: "Parturnering",
        gruppe: "Kolding Bridgeklub af 1946",
      },
      {
        dag: "Tirsdag",
        tid: "13.00 – 16.30",
        beskrivelse: "Eftermiddagsbridge",
        gruppe: "Kolding Eftermiddagsbridge",
      },
      {
        dag: "Onsdag",
        tid: "19.00 – 22.30",
        beskrivelse: "Åben parturnering",
        gruppe: "Kolding Onsdagspar",
      },
      {
        dag: "Torsdag",
        tid: "19.00 – 22.30",
        beskrivelse: "Holdturnering",
        gruppe: "Kolding Bridgeklub af 1946",
      },
      {
        dag: "Fredag",
        tid: "13.00 – 16.30",
        beskrivelse: "Eftermiddagsbridge",
        gruppe: "Kolding Eftermiddagsbridge",
      },
      {
        dag: "Søndag",
        tid: "10.00 – 13.00",
        beskrivelse: "Juniortræning",
        gruppe: "Kolding Juniorbridge",
      },
    ],
    kontakt: [
      {
        rolle: "Centerleder",
        navn: "Hans Bruun (demo)",
        email: "center@demo.bridge.dk",
        telefon: "20 00 00 11",
      },
      {
        rolle: "Turneringsleder",
        navn: "Mette Bruhn (demo)",
        email: "tl.kolding@demo.bridge.dk",
        telefon: "20 00 00 12",
      },
    ],
    nyheder: [
      {
        dato: "1. september 2026",
        titel: "Alle fire spillegrupper er klar til sæsonen",
        tekst: "Se de opdaterede spilletider og tilmeld dig den gruppe, der passer dig bedst.",
      },
      {
        dato: "20. august 2026",
        titel: "Kolding Grand Prix 10. oktober",
        tekst: "Sølvpointturnering med plads til 60 par. Tilmelding er åben.",
      },
    ],
    tema: {
      primary: "oklch(0.42 0.1 160)",
      accent: "oklch(0.72 0.15 55)",
      overskrift: "Bridge alle ugens dage i Kolding",
      stil: "individuel",
    },
  },
  {
    nr: "9999",
    navn: "Kursusklub 9999",
    kortNavn: "Kursusklub",
    distrikt: "Distrikt Midtjylland",
    kreds: "Kreds Midt",
    by: "Landsdækkende",
    region: "Hele landet",
    adresse: "Danmarks Bridgeforbund, Asylgade 13, 5000 Odense C",
    medlemmer: 96,
    logoTekst: "K99",
    beskrivelse:
      "Kursusklub 9999 er forbundets klub for kursister og nye spillere, der endnu ikke har valgt en klub. Klubben bruges til undervisningsforløb, prøvemedlemskaber og online kurser.",
    spilletider: [
      { dag: "Efter aftale", tid: "—", beskrivelse: "Undervisningsforløb i hele landet" },
    ],
    kontakt: [
      {
        rolle: "Kursusansvarlig",
        navn: "DBF Sekretariat (demo)",
        email: "kursus@demo.bridge.dk",
        telefon: "48 47 52 13",
      },
    ],
    nyheder: [
      {
        dato: "28. august 2026",
        titel: "Nye kursusforløb i 12 klubber",
        tekst: "Kursister oprettes automatisk i Kursusklub 9999 og kan flyttes til en klub bagefter.",
      },
    ],
    tema: {
      primary: "oklch(0.45 0.1 285)",
      accent: "oklch(0.7 0.15 40)",
      overskrift: "Din første bridgeklub",
      stil: "standard",
    },
  },
  {
    nr: "5000",
    navn: "Danmarks Bridgeforbund",
    kortNavn: "DBF",
    distrikt: "Landsdækkende",
    kreds: "Kreds Øst",
    by: "Odense",
    region: "Hele landet",
    adresse: "Asylgade 13, 5000 Odense C",
    medlemmer: 0,
    logoTekst: "DBF",
    beskrivelse:
      "Forbundets centrale administration. Klubnummer 5000 bruges som kontekst for DBF-medarbejdere i Online BC3.",
    spilletider: [],
    kontakt: [
      {
        rolle: "Sekretariat",
        navn: "DBF (demo)",
        email: "dbf@demo.bridge.dk",
        telefon: "48 47 52 13",
      },
    ],
    nyheder: [],
    tema: {
      primary: "oklch(0.4 0.09 220)",
      accent: "oklch(0.68 0.17 35)",
      overskrift: "Danmarks Bridgeforbund",
      stil: "standard",
    },
  },
];

/** Flere klubber udelukkende til at vise at katalogarkitekturen skalerer. */
export const flereKlubber: Pick<
  Klub,
  "nr" | "navn" | "distrikt" | "kreds" | "by" | "region" | "medlemmer"
>[] = [
  {
    nr: "2139",
    navn: "Helsinge Bridgeklub",
    distrikt: "Distrikt Nordsjælland",
    kreds: "Kreds Øst",
    by: "Helsinge",
    region: "Nordsjælland",
  },
  {
    nr: "1015",
    navn: "Aalborg Bridgeklub",
    distrikt: "Distrikt Nordjylland",
    kreds: "Kreds Nord",
    by: "Aalborg",
    region: "Nordjylland",
    medlemmer: 264,
  },
  {
    nr: "1102",
    navn: "Hjørring Bridgeklub",
    distrikt: "Distrikt Nordjylland",
    kreds: "Kreds Nord",
    by: "Hjørring",
    region: "Nordjylland",
    medlemmer: 118,
  },
  {
    nr: "2043",
    navn: "Aarhus Bridgecenter",
    distrikt: "Distrikt Midtjylland",
    kreds: "Kreds Midt",
    by: "Aarhus",
    region: "Midtjylland",
    medlemmer: 388,
  },
  {
    nr: "2110",
    navn: "Silkeborg Bridgeklub",
    distrikt: "Distrikt Midtjylland",
    kreds: "Kreds Midt",
    by: "Silkeborg",
    region: "Midtjylland",
    medlemmer: 142,
  },
  {
    nr: "3312",
    navn: "Esbjerg Bridgeklub",
    distrikt: "Distrikt Sydjylland",
    kreds: "Kreds Syd",
    by: "Esbjerg",
    region: "Syddanmark",
    medlemmer: 176,
  },
  {
    nr: "3450",
    navn: "Odense Bridgeklub",
    distrikt: "Distrikt Fyn",
    kreds: "Kreds Syd",
    by: "Odense",
    region: "Fyn",
    medlemmer: 231,
  },
  {
    nr: "4180",
    navn: "Svendborg Bridgeklub",
    distrikt: "Distrikt Fyn",
    kreds: "Kreds Syd",
    by: "Svendborg",
    region: "Fyn",
    medlemmer: 97,
  },
  {
    nr: "5120",
    navn: "Roskilde Bridgeklub",
    distrikt: "Distrikt Sjælland Syd",
    kreds: "Kreds Øst",
    by: "Roskilde",
    region: "Sjælland",
    medlemmer: 205,
  },
  {
    nr: "5233",
    navn: "Næstved Bridgeklub",
    distrikt: "Distrikt Sjælland Syd",
    kreds: "Kreds Øst",
    by: "Næstved",
    region: "Sjælland",
    medlemmer: 134,
  },
  {
    nr: "6011",
    navn: "København Bridgeklub",
    distrikt: "Distrikt Storkøbenhavn",
    kreds: "Kreds Øst",
    by: "København",
    region: "Hovedstaden",
    medlemmer: 302,
  },
  {
    nr: "6240",
    navn: "Hillerød Bridgeklub",
    distrikt: "Distrikt Storkøbenhavn",
    kreds: "Kreds Øst",
    by: "Hillerød",
    region: "Hovedstaden",
    medlemmer: 156,
  },
];

export type KlubOversigt = {
  nr: string;
  navn: string;
  distrikt: string;
  kreds: Kreds;
  by: string;
  region: string;
  medlemmer?: number | undefined;
  harSide: boolean;
};

export const klubKatalog: KlubOversigt[] = [
  ...klubber
    .filter((k) => k.nr !== "5000")
    .map((k) => ({
      nr: k.nr,
      navn: k.navn,
      distrikt: k.distrikt,
      kreds: k.kreds,
      by: k.by,
      region: k.region,
      medlemmer: k.medlemmer,
      harSide: true,
    })),
  ...flereKlubber.map((k) => ({ ...k, harSide: false })),
].sort((a, b) => a.nr.localeCompare(b.nr));

export function findKlub(nr: string) {
  return klubber.find((k) => k.nr === nr);
}

export const regioner = [
  "Hele landet",
  "Nordjylland",
  "Midtjylland",
  "Syddanmark",
  "Fyn",
  "Sjælland",
  "Hovedstaden",
];

/* ---------------------------------------------------------------- Begivenheder */

export type EventType =
  | "Parturnering"
  | "Holdturnering"
  | "Kurser"
  | "Events"
  | "Bridgefestival";

export type Tilmeldingsform = "individuel" | "par" | "hold";

export type Begivenhed = {
  id: string;
  titel: string;
  type: EventType;
  arrangoer: string;
  arrangoerType: "DBF" | "Klub";
  klubNr?: string;
  sted: string;
  dato: string;
  datoISO: string;
  tid: string;
  tilmeldingsform: Tilmeldingsform;
  pris: string;
  point: "Guld" | "Sølv" | "Bronze" | "Åben" | "Ingen";
  pladser: number;
  tilmeldte: number;
  tilmeldingsfrist: string;
  beskrivelse: string;
  program: { tid: string; punkt: string }[];
  betaling: boolean;
};

export const begivenheder: Begivenhed[] = [
  {
    id: "dm-par-2026",
    titel: "DM for par 2026 — finalen",
    type: "Parturnering",
    arrangoer: "Danmarks Bridgeforbund",
    arrangoerType: "DBF",
    sted: "Idrættens Hus, Brøndby",
    dato: "24.–25. oktober 2026",
    datoISO: "2026-10-24",
    tid: "10.00 – 18.30",
    tilmeldingsform: "par",
    pris: "700 kr. pr. par",
    point: "Guld",
    pladser: 96,
    tilmeldte: 71,
    tilmeldingsfrist: "10. oktober 2026",
    beskrivelse:
      "Årets vigtigste parturnering med guldpoint. Finalen spilles over to dage med 14 runder à 3 spil. Kvalifikation via distrikts- og kredsturneringer.",
    program: [
      { tid: "Lørdag 09.30", punkt: "Indskrivning og morgenkaffe" },
      { tid: "Lørdag 10.00", punkt: "Runde 1–7" },
      { tid: "Søndag 10.00", punkt: "Runde 8–14" },
      { tid: "Søndag 18.00", punkt: "Præmieoverrækkelse" },
    ],
    betaling: true,
  },
  {
    id: "divisionsturnering-2026",
    titel: "Divisionsturneringen 2026/27 — 1. runde",
    type: "Holdturnering",
    arrangoer: "Danmarks Bridgeforbund",
    arrangoerType: "DBF",
    sted: "Flere spillesteder",
    dato: "3. oktober 2026",
    datoISO: "2026-10-03",
    tid: "10.00 – 19.00",
    tilmeldingsform: "hold",
    pris: "1.800 kr. pr. hold (sæson)",
    point: "Guld",
    pladser: 128,
    tilmeldte: 112,
    tilmeldingsfrist: "15. september 2026",
    beskrivelse:
      "Holdturnering i divisioner fra 1. division til 5. division. Hold tilmeldes af klubben og består af 4–6 spillere.",
    program: [
      { tid: "10.00", punkt: "1. kamp (32 spil)" },
      { tid: "14.30", punkt: "2. kamp (32 spil)" },
    ],
    betaling: true,
  },
  {
    id: "festival-aabent-par",
    titel: "Dansk Bridgefestival — Åbent par",
    type: "Bridgefestival",
    arrangoer: "Danmarks Bridgeforbund",
    arrangoerType: "DBF",
    sted: "Svendborg Idrætscenter",
    dato: "11.–12. juli 2027",
    datoISO: "2027-07-11",
    tid: "13.00 – 20.00",
    tilmeldingsform: "par",
    pris: "540 kr. pr. par",
    point: "Guld",
    pladser: 320,
    tilmeldte: 188,
    tilmeldingsfrist: "1. juli 2027",
    beskrivelse:
      "Festivalens store åbne parturnering. Alle kan deltage uanset niveau, og der spilles i grupper efter styrke.",
    program: [
      { tid: "Dag 1 13.00", punkt: "Kvalifikation" },
      { tid: "Dag 2 13.00", punkt: "A-, B- og C-finaler" },
    ],
    betaling: true,
  },
  {
    id: "festival-holdmix",
    titel: "Dansk Bridgefestival — Mix-hold",
    type: "Bridgefestival",
    arrangoer: "Danmarks Bridgeforbund",
    arrangoerType: "DBF",
    sted: "Svendborg Idrætscenter",
    dato: "13. juli 2027",
    datoISO: "2027-07-13",
    tid: "10.00 – 18.00",
    tilmeldingsform: "hold",
    pris: "800 kr. pr. hold",
    point: "Sølv",
    pladser: 64,
    tilmeldte: 22,
    tilmeldingsfrist: "1. juli 2027",
    beskrivelse: "Holdturnering hvor hvert par skal bestå af en dame og en herre.",
    program: [{ tid: "10.00", punkt: "5 kampe à 10 spil" }],
    betaling: true,
  },
  {
    id: "tl-kursus-efteraar",
    titel: "Turneringslederkursus, trin 1",
    type: "Kurser",
    arrangoer: "Danmarks Bridgeforbund",
    arrangoerType: "DBF",
    sted: "Odense, Asylgade 13",
    dato: "19. september 2026",
    datoISO: "2026-09-19",
    tid: "10.00 – 16.00",
    tilmeldingsform: "individuel",
    pris: "450 kr.",
    point: "Ingen",
    pladser: 24,
    tilmeldte: 19,
    tilmeldingsfrist: "12. september 2026",
    beskrivelse:
      "Grundkursus i turneringsledelse: lovregler, Bridgemate, opsætning af turneringer i BridgeCentral og praktisk afvikling.",
    program: [
      { tid: "10.00", punkt: "Lovregler i praksis" },
      { tid: "13.00", punkt: "Bridgemate og BC3" },
      { tid: "15.00", punkt: "Cases og afslutning" },
    ],
    betaling: true,
  },
  {
    id: "bc3-webinar",
    titel: "Webinar: Kom godt i gang med BC3-sæsonen",
    type: "Events",
    arrangoer: "Danmarks Bridgeforbund",
    arrangoerType: "DBF",
    sted: "Online",
    dato: "9. september 2026",
    datoISO: "2026-09-09",
    tid: "19.00 – 20.30",
    tilmeldingsform: "individuel",
    pris: "Gratis",
    point: "Ingen",
    pladser: 200,
    tilmeldte: 87,
    tilmeldingsfrist: "9. september 2026",
    beskrivelse:
      "Gennemgang af sæsonopstart i BridgeCentral: medlemsliste, kontingent, oprettelse af klubturnering og indberetning.",
    program: [{ tid: "19.00", punkt: "Live gennemgang og spørgsmål" }],
    betaling: false,
  },
  {
    id: "roedovre-klubturnering",
    titel: "Rødovre mandagsturnering — efterår",
    type: "Parturnering",
    arrangoer: "Rødovre Bridgeklub",
    arrangoerType: "Klub",
    klubNr: "2275",
    sted: "Rødovregaard, Rødovre",
    dato: "7. september 2026 – 14. december 2026",
    datoISO: "2026-09-07",
    tid: "19.00 – 22.30",
    tilmeldingsform: "par",
    pris: "400 kr. pr. spiller (sæson)",
    point: "Bronze",
    pladser: 48,
    tilmeldte: 38,
    tilmeldingsfrist: "5. september 2026",
    beskrivelse:
      "Klubbens faste parturnering over 14 mandage. Der spilles i to rækker med op- og nedrykning.",
    program: [{ tid: "19.00", punkt: "7 runder à 3 spil" }],
    betaling: true,
  },
  {
    id: "roedovre-holdturnering",
    titel: "Rødovre klubholdturnering",
    type: "Holdturnering",
    arrangoer: "Rødovre Bridgeklub",
    arrangoerType: "Klub",
    klubNr: "2275",
    sted: "Rødovregaard, Rødovre",
    dato: "10. september 2026 – 11. marts 2027",
    datoISO: "2026-09-10",
    tid: "19.00 – 22.30",
    tilmeldingsform: "hold",
    pris: "300 kr. pr. spiller",
    point: "Bronze",
    pladser: 16,
    tilmeldte: 11,
    tilmeldingsfrist: "5. september 2026",
    beskrivelse: "Holdturnering med 4-mandshold over 10 torsdage.",
    program: [{ tid: "19.00", punkt: "2 kampe à 8 spil" }],
    betaling: true,
  },
  {
    id: "roedovre-begynderkursus",
    titel: "Begynderkursus i Rødovre",
    type: "Kurser",
    arrangoer: "Rødovre Bridgeklub",
    arrangoerType: "Klub",
    klubNr: "2275",
    sted: "Rødovregaard, Rødovre",
    dato: "24. september 2026",
    datoISO: "2026-09-24",
    tid: "19.00 – 21.30",
    tilmeldingsform: "individuel",
    pris: "700 kr. for 10 aftener",
    point: "Ingen",
    pladser: 20,
    tilmeldte: 12,
    tilmeldingsfrist: "20. september 2026",
    beskrivelse:
      "Lær bridge fra bunden. Materiale og kort er inkluderet, og du bliver oprettet som kursist i Kursusklub 9999.",
    program: [{ tid: "19.00", punkt: "Undervisning og spil ved bordene" }],
    betaling: true,
  },
  {
    id: "kolding-grand-prix",
    titel: "Kolding Grand Prix 2026",
    type: "Parturnering",
    arrangoer: "Kolding Bridge Center",
    arrangoerType: "Klub",
    klubNr: "4470",
    sted: "Kolding Bridge Center, Bredgade 24",
    dato: "10. oktober 2026",
    datoISO: "2026-10-10",
    tid: "10.00 – 17.30",
    tilmeldingsform: "par",
    pris: "300 kr. pr. par",
    point: "Sølv",
    pladser: 60,
    tilmeldte: 44,
    tilmeldingsfrist: "5. oktober 2026",
    beskrivelse:
      "Åben sølvpointturnering med frokost inkluderet. Alle par kan deltage, og der spilles 30 spil.",
    program: [
      { tid: "10.00", punkt: "Runde 1–5" },
      { tid: "12.30", punkt: "Frokost" },
      { tid: "13.30", punkt: "Runde 6–10" },
    ],
    betaling: true,
  },
  {
    id: "kolding-onsdagspar",
    titel: "Kolding onsdagspar — efterårssæson",
    type: "Parturnering",
    arrangoer: "Kolding Bridge Center",
    arrangoerType: "Klub",
    klubNr: "4470",
    sted: "Kolding Bridge Center",
    dato: "2. september 2026 – 16. december 2026",
    datoISO: "2026-09-02",
    tid: "19.00 – 22.30",
    tilmeldingsform: "individuel",
    pris: "50 kr. pr. aften",
    point: "Bronze",
    pladser: 40,
    tilmeldte: 27,
    tilmeldingsfrist: "Løbende",
    beskrivelse:
      "Åben parturnering hvor du kan tilmelde dig alene — vi finder en partner, hvis du mangler.",
    program: [{ tid: "19.00", punkt: "8 runder à 3 spil" }],
    betaling: false,
  },
  {
    id: "kolding-juniorcamp",
    titel: "Juniorbridge-camp i Kolding",
    type: "Events",
    arrangoer: "Kolding Bridge Center",
    arrangoerType: "Klub",
    klubNr: "4470",
    sted: "Kolding Bridge Center",
    dato: "17.–18. oktober 2026",
    datoISO: "2026-10-17",
    tid: "10.00 – 16.00",
    tilmeldingsform: "individuel",
    pris: "250 kr.",
    point: "Ingen",
    pladser: 32,
    tilmeldte: 14,
    tilmeldingsfrist: "10. oktober 2026",
    beskrivelse: "Weekend med undervisning, turnering og socialt program for spillere under 25 år.",
    program: [
      { tid: "Dag 1", punkt: "Undervisning og holdturnering" },
      { tid: "Dag 2", punkt: "Parturnering og præmier" },
    ],
    betaling: true,
  },
];

export const eventFiltre = [
  "Alle",
  "DBF",
  "Min klub",
  "Parturnering",
  "Holdturnering",
  "Kurser",
  "Events",
  "Bridgefestival",
] as const;

export function findBegivenhed(id: string) {
  return begivenheder.find((b) => b.id === id);
}

/* ---------------------------------------------------------------- Resultater */

export type Resultat = {
  id: string;
  turnering: string;
  type: EventType | "Division";
  klub: string;
  klubNr: string;
  distrikt: string;
  dato: string;
  dbf: boolean;
  vinder: string;
  score: string;
  deltagere: number;
};

export const resultater: Resultat[] = [
  {
    id: "r1",
    turnering: "Rødovre mandagsturnering, runde 1",
    type: "Parturnering",
    klub: "Rødovre Bridgeklub",
    klubNr: "2275",
    distrikt: "Distrikt Storkøbenhavn",
    dato: "01.09.2026",
    dbf: false,
    vinder: "J. Ahlmann – S. Vad",
    score: "62,4 %",
    deltagere: 34,
  },
  {
    id: "r2",
    turnering: "Kolding onsdagspar, runde 1",
    type: "Parturnering",
    klub: "Kolding Bridge Center",
    klubNr: "4470",
    distrikt: "Distrikt Sydjylland",
    dato: "02.09.2026",
    dbf: false,
    vinder: "Medlem 4470-118 – P. Jessen",
    score: "58,9 %",
    deltagere: 26,
  },
  {
    id: "r3",
    turnering: "2. division øst, runde 1",
    type: "Division",
    klub: "Rødovre Bridgeklub",
    klubNr: "2275",
    distrikt: "Distrikt Storkøbenhavn",
    dato: "30.08.2026",
    dbf: true,
    vinder: "Rødovre 1",
    score: "14–6",
    deltagere: 8,
  },
  {
    id: "r4",
    turnering: "Distriktsparturnering, Storkøbenhavn",
    type: "Parturnering",
    klub: "Distrikt Storkøbenhavn",
    klubNr: "6011",
    distrikt: "Distrikt Storkøbenhavn",
    dato: "24.08.2026",
    dbf: true,
    vinder: "L. Bech – K. Munk",
    score: "64,1 %",
    deltagere: 48,
  },
  {
    id: "r5",
    turnering: "Kolding Grand Prix 2025 (arkiv)",
    type: "Parturnering",
    klub: "Kolding Bridge Center",
    klubNr: "4470",
    distrikt: "Distrikt Sydjylland",
    dato: "11.10.2025",
    dbf: false,
    vinder: "T. Kjær – M. Bruhn",
    score: "61,7 %",
    deltagere: 58,
  },
  {
    id: "r6",
    turnering: "DM for hold 2026, finale",
    type: "Holdturnering",
    klub: "Danmarks Bridgeforbund",
    klubNr: "5000",
    distrikt: "Landsdækkende",
    dato: "17.05.2026",
    dbf: true,
    vinder: "Hold Nord (demo)",
    score: "156–121",
    deltagere: 16,
  },
  {
    id: "r7",
    turnering: "Dansk Bridgefestival, Åbent par 2026",
    type: "Bridgefestival",
    klub: "Danmarks Bridgeforbund",
    klubNr: "5000",
    distrikt: "Landsdækkende",
    dato: "12.07.2026",
    dbf: true,
    vinder: "A. Krog – B. Sand",
    score: "63,8 %",
    deltagere: 312,
  },
  {
    id: "r8",
    turnering: "Rødovre eftermiddagsbridge",
    type: "Parturnering",
    klub: "Rødovre Bridgeklub",
    klubNr: "2275",
    distrikt: "Distrikt Storkøbenhavn",
    dato: "27.08.2026",
    dbf: false,
    vinder: "E. Holt – G. Prip",
    score: "57,2 %",
    deltagere: 18,
  },
];

/* ---------------------------------------------------------------- Medlemmer */

export type Rolle = "medlem" | "klubadmin" | "dbf";

export type MedlemsResultat = {
  dato: string;
  turnering: string;
  type: string;
  placering: string;
  score: string;
  point: string;
};

export type Medlem = {
  medlemsnr: string;
  navn: string;
  email: string;
  foedselsaar: number;
  primaerKlub: string;
  klubber: string[];
  roller: Rolle[];
  udviklerAdgang: boolean;
  handicap: number;
  handicapHistorik: { periode: string; handicap: number }[];
  mesterpoint: { kategori: string; iAar: number; total: number }[];
  titel: string;
  adresse: string;
  postnr: string;
  by: string;
  telefon: string;
  medlemSiden: string;
  kontingent: string;
  handicapPosteringer: {
    dato: string;
    turnering: string;
    klub: string;
    resultat: string;
    hcpFoer: number;
    hcpEfter: number;
  }[];
  mesterpointHistorik: {
    dato: string;
    turnering: string;
    kategori: "Guld" | "Sølv" | "Bronze";
    point: number;
  }[];
  resultater: MedlemsResultat[];
  tilmeldinger: { begivenhedId: string; status: string; rolle: string; betaling: string }[];
};

export const medlemmer: Medlem[] = [
  {
    medlemsnr: "301045",
    navn: "Jens Ahlmann (demo)",
    email: "jens.demo@bridge.dk",
    foedselsaar: 1962,
    primaerKlub: "2275",
    klubber: ["2275", "9999"],
    roller: ["medlem", "klubadmin"],
    udviklerAdgang: true,
    handicap: 12.4,
    handicapHistorik: [
      { periode: "2023/24", handicap: 18.1 },
      { periode: "2024/25", handicap: 15.6 },
      { periode: "2025/26 H1", handicap: 14.2 },
      { periode: "2025/26 H2", handicap: 13.1 },
      { periode: "2026/27", handicap: 12.4 },
    ],
    mesterpoint: [
      { kategori: "Guldpoint", iAar: 14, total: 96 },
      { kategori: "Sølvpoint", iAar: 31, total: 402 },
      { kategori: "Bronzepoint", iAar: 118, total: 2140 },
    ],
    titel: "Distriktsmester (demo)",
    adresse: "Rødovrevej 128",
    postnr: "2610",
    by: "Rødovre",
    telefon: "28 44 91 07",
    medlemSiden: "1994",
    kontingent: "Betalt for 2026/27",
    handicapPosteringer: [
      {
        dato: "01.09.2026",
        turnering: "Rødovre mandagsturnering, runde 1",
        klub: "2275 Rødovre Bridgeklub",
        resultat: "62,4 %",
        hcpFoer: 12.6,
        hcpEfter: 12.4,
      },
      {
        dato: "30.08.2026",
        turnering: "2. division øst, runde 1",
        klub: "5000 Danmarks Bridgeforbund",
        resultat: "14–6",
        hcpFoer: 12.8,
        hcpEfter: 12.6,
      },
      {
        dato: "17.05.2026",
        turnering: "DM for hold 2026, kvartfinale",
        klub: "5000 Danmarks Bridgeforbund",
        resultat: "121–133",
        hcpFoer: 12.7,
        hcpEfter: 12.8,
      },
      {
        dato: "12.04.2026",
        turnering: "Kredsholdturnering Øst, finalerunde",
        klub: "5000 Danmarks Bridgeforbund",
        resultat: "112–104",
        hcpFoer: 13.0,
        hcpEfter: 12.7,
      },
      {
        dato: "08.03.2026",
        turnering: "Distriktsparturnering Storkøbenhavn",
        klub: "5000 Danmarks Bridgeforbund",
        resultat: "58,9 %",
        hcpFoer: 13.1,
        hcpEfter: 13.0,
      },
      {
        dato: "19.01.2026",
        turnering: "Rødovre klubholdturnering, runde 6",
        klub: "2275 Rødovre Bridgeklub",
        resultat: "18–2",
        hcpFoer: 13.4,
        hcpEfter: 13.1,
      },
      {
        dato: "24.11.2025",
        turnering: "Rødovre mandagsturnering, runde 11",
        klub: "2275 Rødovre Bridgeklub",
        resultat: "56,1 %",
        hcpFoer: 13.6,
        hcpEfter: 13.4,
      },
      {
        dato: "06.10.2025",
        turnering: "Rødovre mandagsturnering, runde 4",
        klub: "2275 Rødovre Bridgeklub",
        resultat: "51,2 %",
        hcpFoer: 13.5,
        hcpEfter: 13.6,
      },
    ],
    mesterpointHistorik: [
      { dato: "01.09.2026", turnering: "Rødovre mandagsturnering, runde 1", kategori: "Bronze", point: 8 },
      { dato: "30.08.2026", turnering: "2. division øst, runde 1", kategori: "Guld", point: 6 },
      { dato: "12.07.2026", turnering: "Dansk Bridgefestival, Åbent par", kategori: "Guld", point: 4 },
      { dato: "17.05.2026", turnering: "DM for hold 2026, kvartfinale", kategori: "Guld", point: 4 },
      { dato: "12.04.2026", turnering: "Kredsholdturnering Øst, finalerunde", kategori: "Sølv", point: 5 },
      { dato: "08.03.2026", turnering: "Distriktsparturnering Storkøbenhavn", kategori: "Sølv", point: 3 },
      { dato: "19.01.2026", turnering: "Rødovre klubholdturnering, runde 6", kategori: "Bronze", point: 6 },
      { dato: "24.11.2025", turnering: "Rødovre mandagsturnering, runde 11", kategori: "Bronze", point: 4 },
    ],
    resultater: [
      {
        dato: "30.08.2026",
        turnering: "2. division øst, runde 1",
        type: "Holdturnering / division",
        placering: "1. plads",
        score: "14–6",
        point: "6 guldpoint",
      },
      {
        dato: "01.09.2026",
        turnering: "Rødovre mandagsturnering, runde 1",
        type: "Parturnering (klub)",
        placering: "1. plads",
        score: "62,4 %",
        point: "8 bronzepoint",
      },
      {
        dato: "17.05.2026",
        turnering: "DM for hold 2026, kvartfinale",
        type: "Holdturnering / division",
        placering: "5.–8. plads",
        score: "121–133",
        point: "4 guldpoint",
      },
      {
        dato: "12.04.2026",
        turnering: "Kredsholdturnering Øst, finalerunde",
        type: "Holdturnering",
        placering: "2. plads",
        score: "112–104",
        point: "5 sølvpoint",
      },
      {
        dato: "08.03.2026",
        turnering: "Distriktsparturnering Storkøbenhavn",
        type: "Parturnering",
        placering: "4. plads",
        score: "58,9 %",
        point: "3 sølvpoint",
      },
      {
        dato: "19.01.2026",
        turnering: "Rødovre klubholdturnering, runde 6",
        type: "Holdturnering (klub)",
        placering: "1. plads",
        score: "18–2",
        point: "6 bronzepoint",
      },
      {
        dato: "24.11.2025",
        turnering: "Rødovre mandagsturnering, runde 11",
        type: "Parturnering (klub)",
        placering: "3. plads",
        score: "56,1 %",
        point: "4 bronzepoint",
      },
    ],
    tilmeldinger: [
      {
        begivenhedId: "divisionsturnering-2026",
        status: "Bekræftet",
        rolle: "Holdkaptajn, Rødovre 1",
        betaling: "Betalt (demo)",
      },
      {
        begivenhedId: "roedovre-klubturnering",
        status: "Bekræftet",
        rolle: "Par med Susanne Vad",
        betaling: "Betalt (demo)",
      },
      {
        begivenhedId: "dm-par-2026",
        status: "Afventer partner",
        rolle: "Par — partner mangler bekræftelse",
        betaling: "Ikke betalt",
      },
      {
        begivenhedId: "tl-kursus-efteraar",
        status: "Bekræftet",
        rolle: "Deltager",
        betaling: "Betalt (demo)",
      },
    ],
  },
  {
    medlemsnr: "447118",
    navn: "Medlem 4470-118 (anonymiseret demo)",
    email: "medlem118@demo.bridge.dk",
    foedselsaar: 1955,
    primaerKlub: "4470",
    klubber: ["4470"],
    roller: ["medlem"],
    udviklerAdgang: false,
    handicap: 26.8,
    handicapHistorik: [
      { periode: "2023/24", handicap: 34.5 },
      { periode: "2024/25", handicap: 31.2 },
      { periode: "2025/26 H1", handicap: 29.4 },
      { periode: "2025/26 H2", handicap: 27.6 },
      { periode: "2026/27", handicap: 26.8 },
    ],
    mesterpoint: [
      { kategori: "Guldpoint", iAar: 0, total: 4 },
      { kategori: "Sølvpoint", iAar: 9, total: 63 },
      { kategori: "Bronzepoint", iAar: 74, total: 918 },
    ],
    titel: "Klubmester i par 2025 (demo)",
    adresse: "Bakkevej 12",
    postnr: "6000",
    by: "Kolding",
    telefon: "40 12 88 53",
    medlemSiden: "2008",
    kontingent: "Betalt for 2026/27",
    handicapPosteringer: [
      {
        dato: "02.09.2026",
        turnering: "Kolding onsdagspar, runde 1",
        klub: "4470 Kolding Bridge Center",
        resultat: "58,9 %",
        hcpFoer: 27.1,
        hcpEfter: 26.8,
      },
      {
        dato: "28.08.2026",
        turnering: "Kolding eftermiddagsbridge, runde 2",
        klub: "4470 Kolding Bridge Center",
        resultat: "53,4 %",
        hcpFoer: 27.3,
        hcpEfter: 27.1,
      },
      {
        dato: "11.10.2025",
        turnering: "Kolding Grand Prix 2025",
        klub: "4470 Kolding Bridge Center",
        resultat: "56,8 %",
        hcpFoer: 27.6,
        hcpEfter: 27.3,
      },
      {
        dato: "22.04.2025",
        turnering: "Klubmesterskab i par, Kolding",
        klub: "4470 Kolding Bridge Center",
        resultat: "60,2 %",
        hcpFoer: 28.4,
        hcpEfter: 27.6,
      },
      {
        dato: "17.03.2025",
        turnering: "Kolding mandagsturnering, runde 9",
        klub: "4470 Kolding Bridge Center",
        resultat: "55,0 %",
        hcpFoer: 28.6,
        hcpEfter: 28.4,
      },
      {
        dato: "13.01.2025",
        turnering: "Kolding mandagsturnering, runde 3",
        klub: "4470 Kolding Bridge Center",
        resultat: "49,1 %",
        hcpFoer: 28.5,
        hcpEfter: 28.6,
      },
    ],
    mesterpointHistorik: [
      { dato: "02.09.2026", turnering: "Kolding onsdagspar, runde 1", kategori: "Bronze", point: 7 },
      { dato: "28.08.2026", turnering: "Kolding eftermiddagsbridge, runde 2", kategori: "Bronze", point: 2 },
      { dato: "11.10.2025", turnering: "Kolding Grand Prix 2025", kategori: "Sølv", point: 2 },
      { dato: "22.04.2025", turnering: "Klubmesterskab i par, Kolding", kategori: "Bronze", point: 10 },
      { dato: "17.03.2025", turnering: "Kolding mandagsturnering, runde 9", kategori: "Bronze", point: 3 },
    ],
    resultater: [
      {
        dato: "02.09.2026",
        turnering: "Kolding onsdagspar, runde 1",
        type: "Parturnering (klub)",
        placering: "1. plads",
        score: "58,9 %",
        point: "7 bronzepoint",
      },
      {
        dato: "28.08.2026",
        turnering: "Kolding eftermiddagsbridge, runde 2",
        type: "Parturnering (klub)",
        placering: "5. plads",
        score: "53,4 %",
        point: "2 bronzepoint",
      },
      {
        dato: "11.10.2025",
        turnering: "Kolding Grand Prix 2025",
        type: "Parturnering (sølv)",
        placering: "9. plads",
        score: "56,8 %",
        point: "2 sølvpoint",
      },
      {
        dato: "22.04.2025",
        turnering: "Klubmesterskab i par, Kolding",
        type: "Parturnering (klub)",
        placering: "1. plads",
        score: "60,2 %",
        point: "10 bronzepoint",
      },
      {
        dato: "17.03.2025",
        turnering: "Kolding mandagsturnering, runde 9",
        type: "Parturnering (klub)",
        placering: "4. plads",
        score: "55,0 %",
        point: "3 bronzepoint",
      },
    ],
    tilmeldinger: [
      {
        begivenhedId: "kolding-grand-prix",
        status: "Bekræftet",
        rolle: "Par med P. Jessen",
        betaling: "Betalt (demo)",
      },
      {
        begivenhedId: "kolding-onsdagspar",
        status: "Bekræftet",
        rolle: "Individuel tilmelding",
        betaling: "Betales ved bordet",
      },
    ],
  },
  {
    medlemsnr: "500012",
    navn: "DBF-medarbejder (demo)",
    email: "medarbejder@demo.bridge.dk",
    foedselsaar: 1980,
    primaerKlub: "5000",
    klubber: ["5000", "2275", "4470", "9999"],
    roller: ["medlem", "klubadmin", "dbf"],
    udviklerAdgang: true,
    handicap: 20.0,
    handicapHistorik: [
      { periode: "2025/26", handicap: 21.4 },
      { periode: "2026/27", handicap: 20.0 },
    ],
    mesterpoint: [
      { kategori: "Guldpoint", iAar: 2, total: 18 },
      { kategori: "Sølvpoint", iAar: 6, total: 74 },
      { kategori: "Bronzepoint", iAar: 40, total: 610 },
    ],
    titel: "Sekretariatet",
    adresse: "Asylgade 13",
    postnr: "5000",
    by: "Odense C",
    telefon: "33 24 44 80",
    medlemSiden: "2012",
    kontingent: "Betalt for 2026/27",
    handicapPosteringer: [
      {
        dato: "12.07.2026",
        turnering: "Dansk Bridgefestival, Åbent par",
        klub: "5000 Danmarks Bridgeforbund",
        resultat: "54,6 %",
        hcpFoer: 20.4,
        hcpEfter: 20.0,
      },
      {
        dato: "04.05.2026",
        turnering: "Sekretariatets torsdagspar",
        klub: "5000 Danmarks Bridgeforbund",
        resultat: "52,1 %",
        hcpFoer: 20.7,
        hcpEfter: 20.4,
      },
      {
        dato: "18.11.2025",
        turnering: "Rødovre mandagsturnering, gæst",
        klub: "2275 Rødovre Bridgeklub",
        resultat: "50,4 %",
        hcpFoer: 21.4,
        hcpEfter: 20.7,
      },
    ],
    mesterpointHistorik: [
      { dato: "12.07.2026", turnering: "Dansk Bridgefestival, Åbent par", kategori: "Guld", point: 1 },
      { dato: "04.05.2026", turnering: "Sekretariatets torsdagspar", kategori: "Bronze", point: 3 },
      { dato: "18.11.2025", turnering: "Rødovre mandagsturnering, gæst", kategori: "Bronze", point: 2 },
    ],
    resultater: [
      {
        dato: "12.07.2026",
        turnering: "Dansk Bridgefestival, Åbent par",
        type: "Parturnering (guld)",
        placering: "31. plads",
        score: "54,6 %",
        point: "1 guldpoint",
      },
    ],
    tilmeldinger: [
      {
        begivenhedId: "festival-aabent-par",
        status: "Bekræftet",
        rolle: "Par",
        betaling: "Betalt (demo)",
      },
    ],
  },
];

export function findMedlem(idEllerEmail: string) {
  const v = idEllerEmail.trim().toLowerCase();
  return medlemmer.find(
    (m) => m.medlemsnr.toLowerCase() === v || m.email.toLowerCase() === v,
  );
}

/* ---------------------------------------------------------------- Butik */

export const butikKategorier = [
  { navn: "Spillekort", antal: 24, beskrivelse: "Bridgekort i alle udgaver — plast, papir og storskrift." },
  { navn: "Bridgeborde", antal: 9, beskrivelse: "Klapborde, bordduge og bordnumre til klubben." },
  { navn: "Bridgemate / udstyr", antal: 18, beskrivelse: "Bridgemate-enheder, servere, tilbehør og reservedele." },
  { navn: "Bøger", antal: 96, beskrivelse: "Dansk og international bridgelitteratur." },
  { navn: "Undervisningsmateriale", antal: 32, beskrivelse: "Kursusmapper, lærerhæfter og øvelsesspil." },
  { navn: "Gaver", antal: 15, beskrivelse: "Præmier og værtindegaver med bridgemotiv." },
];

export type Vare = {
  id: string;
  navn: string;
  kategori: string;
  pris: string;
  beskrivelse: string;
  maerkat?: string;
};

export const varer: Vare[] = [
  {
    id: "v1",
    navn: "Bridgekort, plast (2 spil)",
    kategori: "Spillekort",
    pris: "129 kr.",
    beskrivelse: "Slidstærke plastkort med stort indeks. Klubpris ved 10+ sæt.",
    maerkat: "Bedst sælgende",
  },
  {
    id: "v2",
    navn: "Bridgemate II — enhed",
    kategori: "Bridgemate / udstyr",
    pris: "1.395 kr.",
    beskrivelse: "Til klubber der udvider antallet af borde. Kræver Bridgemate-server.",
  },
  {
    id: "v3",
    navn: "Meldekasser, sæt à 4",
    kategori: "Bridgemate / udstyr",
    pris: "749 kr.",
    beskrivelse: "Komplet sæt meldekasser i klubkvalitet.",
  },
  {
    id: "v4",
    navn: "Bridgebord, 80×80 cm",
    kategori: "Bridgeborde",
    pris: "1.150 kr.",
    beskrivelse: "Foldbart bord med grøn filtoverflade.",
  },
  {
    id: "v5",
    navn: "Systemhæfte: Dansk Standard",
    kategori: "Bøger",
    pris: "189 kr.",
    beskrivelse: "Klassikeren om det danske standardsystem.",
    maerkat: "Nyhed",
  },
  {
    id: "v6",
    navn: "Kursusmappe — Trin 1",
    kategori: "Undervisningsmateriale",
    pris: "245 kr.",
    beskrivelse: "Elevmateriale til klubbens begynderkursus. 10 lektioner.",
  },
  {
    id: "v7",
    navn: "Bridgekort med storskrift",
    kategori: "Spillekort",
    pris: "99 kr.",
    beskrivelse: "Ekstra store tal — populære i eftermiddagsklubber.",
  },
  {
    id: "v8",
    navn: "Gavekort til Bridgebutikken",
    kategori: "Gaver",
    pris: "fra 100 kr.",
    beskrivelse: "Den sikre præmie til klubturneringen.",
  },
  {
    id: "v9",
    navn: "Krus “Én ned igen”",
    kategori: "Gaver",
    pris: "119 kr.",
    beskrivelse: "Keramikkrus med bridgehumor.",
  },
];

/* ---------------------------------------------------------------- Nyheder */

export const nyheder = [
  {
    dato: "5. september 2026",
    kategori: "Forbundet",
    titel: "Én samlet platform på bridge.dk",
    resume:
      "Bestyrelsen har godkendt arbejdet med at samle bridge.dk, klubsider, tilmelding, BridgeCentral og Bridgebutikken i én løsning.",
  },
  {
    dato: "3. september 2026",
    kategori: "Turnering",
    titel: "Divisionsturneringen er klar til 1. runde",
    resume: "128 hold er tilmeldt sæsonen 2026/27. Startlister offentliggøres 20. september.",
  },
  {
    dato: "1. september 2026",
    kategori: "BC3",
    titel: "Ny vejledning til sæsonopstart i BridgeCentral",
    resume: "Trin-for-trin guide til medlemsliste, kontingent og oprettelse af klubturneringer.",
  },
  {
    dato: "28. august 2026",
    kategori: "Undervisning",
    titel: "Rekordmange begynderkurser i efteråret",
    resume: "Over 90 klubber udbyder kurser. Kursister oprettes i Kursusklub 9999.",
  },
  {
    dato: "22. august 2026",
    kategori: "Festival",
    titel: "Dansk Bridgefestival 2027 flytter til Svendborg",
    resume: "Festivalen afvikles 8.–17. juli 2027 med plads til flere deltagere end nogensinde.",
  },
  {
    dato: "18. august 2026",
    kategori: "Handicap",
    titel: "Handicapberegningen er opdateret",
    resume: "Alle klubturneringer indgår nu i beregningen med samme vægt uanset spilleform.",
  },
];

/* ---------------------------------------------------------------- BC3 dokumentation */

export type DokSide = {
  slug: string;
  titel: string;
  intro: string;
  afsnit: { overskrift: string; tekst: string; punkter?: string[] }[];
  tabeller?: { navn: string; system: "BC3" | "BridgeOrg"; beskrivelse: string }[];
};

export const dokSider: DokSide[] = [
  {
    slug: "systemoversigt",
    titel: "Systemoversigt",
    intro:
      "Overblik over de systemer, der i dag udgør DBF’s it-landskab, og hvordan de forholder sig til den kommende samlede platform.",
    afsnit: [
      {
        overskrift: "Nuværende systemer",
        tekst: "Data er i dag fordelt på flere systemer med forskellige databaser og ejerskab.",
        punkter: [
          "BridgeCentral / BC3 — klubbens lokale system til medlemmer, turneringer og resultater (Firebird-database pr. klub).",
          "BridgeOrg — forbundets centrale database med klubber, medlemmer, medlemskaber, handicap og bordafgifter.",
          "Bridgemate — indtastning af resultater ved bordet.",
          "bridge.dk — offentligt website og klubsider.",
          "Bridgebutikken — webshop.",
        ],
      },
      {
        overskrift: "Retning",
        tekst:
          "Prototypen viser en samlet brugerflade. Datamodellen for BC3 og BridgeOrg dokumenteres parallelt, så eksisterende felter kan mappes til den nye flade.",
      },
    ],
  },
  {
    slug: "bc3-database",
    titel: "BC3 database",
    intro:
      "BC3 anvender en Firebird-database pr. klub (xxxx.fdb, hvor xxxx er klubnummeret). Dokumentationen nedenfor omfatter alene tabeller, der er kendte i dag.",
    afsnit: [
      {
        overskrift: "Status for dokumentationen",
        tekst:
          "Kun tabelnavne, som er bekræftet, er nævnt. Felter og relationer må ikke antages, før de er verificeret mod en rigtig database.",
      },
    ],
    tabeller: [
      { navn: "MAINTOURNAMENT", system: "BC3", beskrivelse: "Turnering på øverste niveau." },
      { navn: "GROUPTOURNAMENT", system: "BC3", beskrivelse: "Gruppe/række under en turnering." },
      { navn: "SECTION", system: "BC3", beskrivelse: "Sektion under en gruppeturnering." },
      { navn: "ROUND", system: "BC3", beskrivelse: "Runde i en sektion." },
      { navn: "ROUNDMATCH", system: "BC3", beskrivelse: "Kamp/møde i en runde." },
      { navn: "RESULT", system: "BC3", beskrivelse: "Resultatpost." },
      { navn: "SECTIONTEAM", system: "BC3", beskrivelse: "Hold tilknyttet en sektion." },
      { navn: "SECTIONPLAYER", system: "BC3", beskrivelse: "Spiller tilknyttet en sektion." },
      { navn: "BOARDSPEC", system: "BC3", beskrivelse: "Specifikation af spil/fordelinger." },
      { navn: "BOARD", system: "BC3", beskrivelse: "Enkeltspil." },
      { navn: "MEM_MEMBER", system: "BC3", beskrivelse: "Medlem (feltnavne ikke dokumenteret endnu)." },
      { navn: "MEM_CLUB", system: "BC3", beskrivelse: "Klub (feltnavne ikke dokumenteret endnu)." },
      { navn: "MASTERPOINTS", system: "BC3", beskrivelse: "Mesterpoint (feltnavne ikke dokumenteret endnu)." },
    ],
  },
  {
    slug: "bridgeorg-database",
    titel: "BridgeOrg database",
    intro:
      "BridgeOrg er forbundets centrale database. Nedenstående tabeller er kendte; feltniveau er endnu ikke dokumenteret.",
    afsnit: [
      {
        overskrift: "Anvendelse",
        tekst:
          "BridgeOrg indeholder de centrale stamdata om klubber og medlemmer samt handicap- og afgiftsposteringer.",
      },
    ],
    tabeller: [
      { navn: "BRIDGEKLUBBER", system: "BridgeOrg", beskrivelse: "Klubber i forbundet." },
      { navn: "MEDLEMMER", system: "BridgeOrg", beskrivelse: "Medlemmer." },
      { navn: "MEDLEMSKABER", system: "BridgeOrg", beskrivelse: "Medlemskaber, relation mellem medlem og klub." },
      { navn: "HACTURNERINGER", system: "BridgeOrg", beskrivelse: "Turneringer der indgår i handicapberegning." },
      { navn: "HACPOSTERINGER", system: "BridgeOrg", beskrivelse: "Handicapposteringer." },
      { navn: "BORDAFGIFTER", system: "BridgeOrg", beskrivelse: "Bordafgifter." },
    ],
  },
  {
    slug: "bridgemate",
    titel: "Bridgemate",
    intro: "Bridgemate bruges til resultatindtastning ved bordet og til at vise resultater for spillerne.",
    afsnit: [
      {
        overskrift: "Rolle i flowet",
        tekst:
          "Bridgemate-serveren afleverer resultater til BC3 på den klub-pc, der afvikler turneringen. Den præcise integration dokumenteres senere.",
      },
      {
        overskrift: "Udestående",
        tekst: "Format og felter for overførsel skal verificeres mod en rigtig opsætning.",
      },
    ],
  },
  {
    slug: "resultatflow",
    titel: "Resultatflow",
    intro: "Fra spil ved bordet til visning af resultat på bridge.dk.",
    afsnit: [
      {
        overskrift: "Foreløbigt flow",
        tekst: "Kæden nedenfor er en foreløbig beskrivelse og skal verificeres.",
        punkter: [
          "Bridgemate ved bordet",
          "BC3 på klubbens pc (xxxx.fdb)",
          "Indberetning til forbundets systemer",
          "Handicap- og mesterpointberegning",
          "Visning på bridge.dk / klubside",
        ],
      },
    ],
  },
  {
    slug: "handicap",
    titel: "Handicap",
    intro: "Handicap beregnes centralt på grundlag af indberettede turneringsresultater.",
    afsnit: [
      {
        overskrift: "Kendte tabeller",
        tekst: "HACTURNERINGER og HACPOSTERINGER i BridgeOrg er de kendte tabeller på området.",
      },
      {
        overskrift: "Beregningsregler",
        tekst: "Reglerne dokumenteres, når de er verificeret. Der opfindes ingen formler i denne prototype.",
      },
    ],
    tabeller: [
      { navn: "HACTURNERINGER", system: "BridgeOrg", beskrivelse: "Turneringer i handicapberegning." },
      { navn: "HACPOSTERINGER", system: "BridgeOrg", beskrivelse: "Posteringer pr. medlem." },
    ],
  },
  {
    slug: "mesterpoint",
    titel: "Mesterpoint",
    intro: "Mesterpoint tildeles i guld, sølv og bronze afhængigt af turneringstype.",
    afsnit: [
      {
        overskrift: "Kendte tabeller",
        tekst: "MASTERPOINTS er kendt i BC3. Sammenhæng til de centrale systemer skal verificeres.",
      },
    ],
    tabeller: [{ navn: "MASTERPOINTS", system: "BC3", beskrivelse: "Mesterpoint pr. spiller/turnering." }],
  },
  {
    slug: "services",
    titel: "Services",
    intro: "Integrationer og services mellem klubsystem, centrale systemer og web.",
    afsnit: [
      {
        overskrift: "Status",
        tekst:
          "Der er endnu ikke dokumenteret et samlet API. Denne side samler de integrationer, der identificeres undervejs.",
      },
    ],
  },
  {
    slug: "wiki-bc3",
    titel: "Wiki BC3",
    intro: "Samling af noter, spørgsmål og verifikationer under arbejdet med at dokumentere BC3.",
    afsnit: [
      {
        overskrift: "Arbejdsform",
        tekst:
          "Hver skærm i det nuværende BC3 mappes til skærme, felter, knapper, tabeller og databasefelter i den nye flade. Uafklarede punkter markeres SKAL VERIFICERES.",
      },
      {
        overskrift: "Åbne spørgsmål",
        tekst: "Feltnavne i MEM_MEMBER, relation mellem SECTIONPLAYER og medlemsnummer, samt nøgler i RESULT.",
      },
    ],
  },
];

export const dokNav = [
  { slug: "systemoversigt", titel: "Systemoversigt" },
  { slug: "bc3-database", titel: "BC3 database" },
  { slug: "bridgeorg-database", titel: "BridgeOrg database" },
  { slug: "er-diagrammer", titel: "ER-diagrammer" },
  { slug: "bridgemate", titel: "Bridgemate" },
  { slug: "resultatflow", titel: "Resultatflow" },
  { slug: "handicap", titel: "Handicap" },
  { slug: "mesterpoint", titel: "Mesterpoint" },
  { slug: "services", titel: "Services" },
  { slug: "wiki-bc3", titel: "Wiki BC3" },
];

export const FORELOEBIG = "FORELØBIG MODEL – relationer og felter verificeres løbende";

/* ---------------------------------------------------------------- ER-model med felter */

export type FeltStatus = "KENDT" | "ANTAGET";

export type ErFelt = {
  navn: string;
  type: string;
  rolle?: "PK" | "FK" | "";
  beskrivelse: string;
  status: FeltStatus;
};

export type ErTabel = {
  navn: string;
  system: "BC3" | "BridgeOrg";
  gruppe: string;
  beskrivelse: string;
  felter: ErFelt[];
};

/**
 * VIGTIGT: Tabelnavnene er kendte. Feltnavnene er IKKE endeligt dokumenteret og
 * er derfor markeret ANTAGET, indtil de er verificeret mod en rigtig BC3-database
 * (xxxx.fdb) og mod BridgeOrg. Intet felt herunder må bruges som facit.
 */
export const erTabeller: ErTabel[] = [
  {
    navn: "MAINTOURNAMENT",
    system: "BC3",
    gruppe: "Turneringshierarki",
    beskrivelse: "Turnering på øverste niveau i BC3.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Turneringens nøgle.", status: "ANTAGET" },
      { navn: "NAME", type: "VARCHAR", beskrivelse: "Turneringens navn.", status: "ANTAGET" },
      { navn: "STARTDATE", type: "DATE", beskrivelse: "Startdato.", status: "ANTAGET" },
      { navn: "CLUBNO", type: "INTEGER", rolle: "FK", beskrivelse: "Klubnummer (MEM_CLUB).", status: "ANTAGET" },
    ],
  },
  {
    navn: "GROUPTOURNAMENT",
    system: "BC3",
    gruppe: "Turneringshierarki",
    beskrivelse: "Gruppe/række under en turnering.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Gruppens nøgle.", status: "ANTAGET" },
      { navn: "MAINTOURNAMENTID", type: "INTEGER", rolle: "FK", beskrivelse: "Til MAINTOURNAMENT.", status: "ANTAGET" },
      { navn: "NAME", type: "VARCHAR", beskrivelse: "Gruppens/rækkens navn.", status: "ANTAGET" },
    ],
  },
  {
    navn: "SECTION",
    system: "BC3",
    gruppe: "Turneringshierarki",
    beskrivelse: "Sektion under en gruppeturnering.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Sektionens nøgle.", status: "ANTAGET" },
      { navn: "GROUPTOURNAMENTID", type: "INTEGER", rolle: "FK", beskrivelse: "Til GROUPTOURNAMENT.", status: "ANTAGET" },
      { navn: "LETTER", type: "CHAR", beskrivelse: "Sektionsbogstav (A, B, C …).", status: "ANTAGET" },
      { navn: "MOVEMENT", type: "VARCHAR", beskrivelse: "Bevægelse/skema.", status: "ANTAGET" },
    ],
  },
  {
    navn: "ROUND",
    system: "BC3",
    gruppe: "Turneringshierarki",
    beskrivelse: "Runde i en sektion.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Rundens nøgle.", status: "ANTAGET" },
      { navn: "SECTIONID", type: "INTEGER", rolle: "FK", beskrivelse: "Til SECTION.", status: "ANTAGET" },
      { navn: "ROUNDNO", type: "INTEGER", beskrivelse: "Rundenummer.", status: "ANTAGET" },
    ],
  },
  {
    navn: "ROUNDMATCH",
    system: "BC3",
    gruppe: "Turneringshierarki",
    beskrivelse: "Kamp/møde mellem to par eller hold i en runde.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Kampens nøgle.", status: "ANTAGET" },
      { navn: "ROUNDID", type: "INTEGER", rolle: "FK", beskrivelse: "Til ROUND.", status: "ANTAGET" },
      { navn: "TABLENO", type: "INTEGER", beskrivelse: "Bordnummer.", status: "ANTAGET" },
      { navn: "NSPAIR", type: "INTEGER", beskrivelse: "Nord/syd-par eller -hold.", status: "ANTAGET" },
      { navn: "EWPAIR", type: "INTEGER", beskrivelse: "Øst/vest-par eller -hold.", status: "ANTAGET" },
    ],
  },
  {
    navn: "RESULT",
    system: "BC3",
    gruppe: "Turneringshierarki",
    beskrivelse: "Resultatpost pr. spil/kamp.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Resultatets nøgle.", status: "ANTAGET" },
      { navn: "ROUNDMATCHID", type: "INTEGER", rolle: "FK", beskrivelse: "Til ROUNDMATCH.", status: "ANTAGET" },
      { navn: "BOARDNO", type: "INTEGER", beskrivelse: "Spilnummer.", status: "ANTAGET" },
      { navn: "CONTRACT", type: "VARCHAR", beskrivelse: "Meldt kontrakt.", status: "ANTAGET" },
      { navn: "SCORE", type: "INTEGER", beskrivelse: "Score i point.", status: "ANTAGET" },
      { navn: "MATCHPOINTS", type: "NUMERIC", beskrivelse: "Score i matchpoint/IMP.", status: "ANTAGET" },
    ],
  },
  {
    navn: "SECTIONTEAM",
    system: "BC3",
    gruppe: "Deltagere",
    beskrivelse: "Hold eller par tilknyttet en sektion.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Holdets nøgle.", status: "ANTAGET" },
      { navn: "SECTIONID", type: "INTEGER", rolle: "FK", beskrivelse: "Til SECTION.", status: "ANTAGET" },
      { navn: "TEAMNO", type: "INTEGER", beskrivelse: "Hold-/parnummer.", status: "ANTAGET" },
      { navn: "TEAMNAME", type: "VARCHAR", beskrivelse: "Holdnavn.", status: "ANTAGET" },
    ],
  },
  {
    navn: "SECTIONPLAYER",
    system: "BC3",
    gruppe: "Deltagere",
    beskrivelse: "Spiller tilknyttet en sektion (tilmelding/startliste).",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Postens nøgle.", status: "ANTAGET" },
      { navn: "SECTIONID", type: "INTEGER", rolle: "FK", beskrivelse: "Til SECTION.", status: "ANTAGET" },
      { navn: "SECTIONTEAMID", type: "INTEGER", rolle: "FK", beskrivelse: "Til SECTIONTEAM.", status: "ANTAGET" },
      { navn: "MEMBERNO", type: "INTEGER", rolle: "FK", beskrivelse: "Medlemsnummer (MEM_MEMBER). Relationen er et åbent punkt.", status: "ANTAGET" },
      { navn: "PLAYERNAME", type: "VARCHAR", beskrivelse: "Spillerens navn som vist i startliste.", status: "ANTAGET" },
      { navn: "DIRECTION", type: "CHAR", beskrivelse: "Retning/plads ved bordet.", status: "ANTAGET" },
    ],
  },
  {
    navn: "BOARDSPEC",
    system: "BC3",
    gruppe: "Spil",
    beskrivelse: "Specifikation af det enkelte spils fordeling.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Nøgle.", status: "ANTAGET" },
      { navn: "SECTIONID", type: "INTEGER", rolle: "FK", beskrivelse: "Til SECTION.", status: "ANTAGET" },
      { navn: "BOARDNO", type: "INTEGER", beskrivelse: "Spilnummer.", status: "ANTAGET" },
      { navn: "DEALER", type: "CHAR", beskrivelse: "Giver.", status: "ANTAGET" },
      { navn: "VULNERABILITY", type: "CHAR", beskrivelse: "Zoneforhold.", status: "ANTAGET" },
    ],
  },
  {
    navn: "BOARD",
    system: "BC3",
    gruppe: "Spil",
    beskrivelse: "Det enkelte spil som spillet ved bordet.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Nøgle.", status: "ANTAGET" },
      { navn: "BOARDSPECID", type: "INTEGER", rolle: "FK", beskrivelse: "Til BOARDSPEC.", status: "ANTAGET" },
      { navn: "NORTHHAND", type: "VARCHAR", beskrivelse: "Nords kort.", status: "ANTAGET" },
      { navn: "EASTHAND", type: "VARCHAR", beskrivelse: "Østs kort.", status: "ANTAGET" },
      { navn: "SOUTHHAND", type: "VARCHAR", beskrivelse: "Syds kort.", status: "ANTAGET" },
      { navn: "WESTHAND", type: "VARCHAR", beskrivelse: "Vests kort.", status: "ANTAGET" },
    ],
  },
  {
    navn: "MEM_MEMBER",
    system: "BC3",
    gruppe: "Medlemmer",
    beskrivelse: "Medlem i klubbens BC3-database.",
    felter: [
      { navn: "MEMBERNO", type: "INTEGER", rolle: "PK", beskrivelse: "Medlemsnummer.", status: "ANTAGET" },
      { navn: "FIRSTNAME", type: "VARCHAR", beskrivelse: "Fornavn.", status: "ANTAGET" },
      { navn: "LASTNAME", type: "VARCHAR", beskrivelse: "Efternavn.", status: "ANTAGET" },
      { navn: "ADDRESS", type: "VARCHAR", beskrivelse: "Adresse.", status: "ANTAGET" },
      { navn: "ZIPCODE", type: "VARCHAR", beskrivelse: "Postnummer.", status: "ANTAGET" },
      { navn: "CITY", type: "VARCHAR", beskrivelse: "By.", status: "ANTAGET" },
      { navn: "EMAIL", type: "VARCHAR", beskrivelse: "E-mail.", status: "ANTAGET" },
      { navn: "PHONE", type: "VARCHAR", beskrivelse: "Telefon.", status: "ANTAGET" },
      { navn: "BIRTHDATE", type: "DATE", beskrivelse: "Fødselsdato.", status: "ANTAGET" },
      { navn: "CLUBNO", type: "INTEGER", rolle: "FK", beskrivelse: "Klub (MEM_CLUB).", status: "ANTAGET" },
    ],
  },
  {
    navn: "MEM_CLUB",
    system: "BC3",
    gruppe: "Medlemmer",
    beskrivelse: "Klubben som ejer BC3-databasen (xxxx.fdb).",
    felter: [
      { navn: "CLUBNO", type: "INTEGER", rolle: "PK", beskrivelse: "Klubnummer, fx 2275.", status: "ANTAGET" },
      { navn: "CLUBNAME", type: "VARCHAR", beskrivelse: "Klubnavn.", status: "ANTAGET" },
      { navn: "DISTRICT", type: "VARCHAR", beskrivelse: "Distrikt.", status: "ANTAGET" },
    ],
  },
  {
    navn: "MASTERPOINTS",
    system: "BC3",
    gruppe: "Point",
    beskrivelse: "Mesterpoint pr. spiller og turnering.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Nøgle.", status: "ANTAGET" },
      { navn: "MEMBERNO", type: "INTEGER", rolle: "FK", beskrivelse: "Til MEM_MEMBER.", status: "ANTAGET" },
      { navn: "MAINTOURNAMENTID", type: "INTEGER", rolle: "FK", beskrivelse: "Til MAINTOURNAMENT.", status: "ANTAGET" },
      { navn: "CATEGORY", type: "VARCHAR", beskrivelse: "Guld, sølv eller bronze.", status: "ANTAGET" },
      { navn: "POINTS", type: "NUMERIC", beskrivelse: "Antal point.", status: "ANTAGET" },
    ],
  },
  {
    navn: "BRIDGEKLUBBER",
    system: "BridgeOrg",
    gruppe: "Stamdata",
    beskrivelse: "Klubber i forbundet.",
    felter: [
      { navn: "KLUBNR", type: "INTEGER", rolle: "PK", beskrivelse: "Klubnummer.", status: "ANTAGET" },
      { navn: "KLUBNAVN", type: "VARCHAR", beskrivelse: "Klubbens navn.", status: "ANTAGET" },
      { navn: "DISTRIKT", type: "VARCHAR", beskrivelse: "Distrikt.", status: "ANTAGET" },
      { navn: "KREDS", type: "VARCHAR", beskrivelse: "Kreds.", status: "ANTAGET" },
    ],
  },
  {
    navn: "MEDLEMMER",
    system: "BridgeOrg",
    gruppe: "Stamdata",
    beskrivelse: "Medlemmer centralt i forbundet.",
    felter: [
      { navn: "MEDLEMSNR", type: "INTEGER", rolle: "PK", beskrivelse: "Medlemsnummer.", status: "ANTAGET" },
      { navn: "NAVN", type: "VARCHAR", beskrivelse: "Navn.", status: "ANTAGET" },
      { navn: "EMAIL", type: "VARCHAR", beskrivelse: "E-mail (login-identifikation).", status: "ANTAGET" },
      { navn: "HANDICAP", type: "NUMERIC", beskrivelse: "Aktuelt handicap.", status: "ANTAGET" },
    ],
  },
  {
    navn: "MEDLEMSKABER",
    system: "BridgeOrg",
    gruppe: "Stamdata",
    beskrivelse: "Relation mellem medlem og klub, inkl. sæson og kontingent.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Nøgle.", status: "ANTAGET" },
      { navn: "MEDLEMSNR", type: "INTEGER", rolle: "FK", beskrivelse: "Til MEDLEMMER.", status: "ANTAGET" },
      { navn: "KLUBNR", type: "INTEGER", rolle: "FK", beskrivelse: "Til BRIDGEKLUBBER.", status: "ANTAGET" },
      { navn: "SAESON", type: "VARCHAR", beskrivelse: "Sæson, fx 2026/27.", status: "ANTAGET" },
      { navn: "KONTINGENTSTATUS", type: "VARCHAR", beskrivelse: "Betalt/ikke betalt.", status: "ANTAGET" },
    ],
  },
  {
    navn: "HACTURNERINGER",
    system: "BridgeOrg",
    gruppe: "Handicap",
    beskrivelse: "Turneringer der indgår i handicapberegningen.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Nøgle.", status: "ANTAGET" },
      { navn: "KLUBNR", type: "INTEGER", rolle: "FK", beskrivelse: "Til BRIDGEKLUBBER.", status: "ANTAGET" },
      { navn: "TURNERINGSNAVN", type: "VARCHAR", beskrivelse: "Turneringens navn.", status: "ANTAGET" },
      { navn: "DATO", type: "DATE", beskrivelse: "Spilledato.", status: "ANTAGET" },
    ],
  },
  {
    navn: "HACPOSTERINGER",
    system: "BridgeOrg",
    gruppe: "Handicap",
    beskrivelse: "Handicapposteringer pr. medlem.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Nøgle.", status: "ANTAGET" },
      { navn: "HACTURNERINGID", type: "INTEGER", rolle: "FK", beskrivelse: "Til HACTURNERINGER.", status: "ANTAGET" },
      { navn: "MEDLEMSNR", type: "INTEGER", rolle: "FK", beskrivelse: "Til MEDLEMMER.", status: "ANTAGET" },
      { navn: "RESULTAT", type: "NUMERIC", beskrivelse: "Opnået resultat i procent.", status: "ANTAGET" },
      { navn: "HCP_FOER", type: "NUMERIC", beskrivelse: "Handicap før postering.", status: "ANTAGET" },
      { navn: "HCP_EFTER", type: "NUMERIC", beskrivelse: "Handicap efter postering.", status: "ANTAGET" },
    ],
  },
  {
    navn: "BORDAFGIFTER",
    system: "BridgeOrg",
    gruppe: "Økonomi",
    beskrivelse: "Bordafgifter pr. klub og periode.",
    felter: [
      { navn: "ID", type: "INTEGER", rolle: "PK", beskrivelse: "Nøgle.", status: "ANTAGET" },
      { navn: "KLUBNR", type: "INTEGER", rolle: "FK", beskrivelse: "Til BRIDGEKLUBBER.", status: "ANTAGET" },
      { navn: "PERIODE", type: "VARCHAR", beskrivelse: "Afregningsperiode.", status: "ANTAGET" },
      { navn: "ANTAL_BORDE", type: "INTEGER", beskrivelse: "Antal borde i perioden.", status: "ANTAGET" },
      { navn: "BELOEB", type: "NUMERIC", beskrivelse: "Beløb i kroner.", status: "ANTAGET" },
    ],
  },
];

export type ErRelation = { fra: string; til: string; type: "1:N" | "1:1"; via: string };

export const erRelationer: ErRelation[] = [
  { fra: "MAINTOURNAMENT", til: "GROUPTOURNAMENT", type: "1:N", via: "GROUPTOURNAMENT.MAINTOURNAMENTID" },
  { fra: "GROUPTOURNAMENT", til: "SECTION", type: "1:N", via: "SECTION.GROUPTOURNAMENTID" },
  { fra: "SECTION", til: "ROUND", type: "1:N", via: "ROUND.SECTIONID" },
  { fra: "ROUND", til: "ROUNDMATCH", type: "1:N", via: "ROUNDMATCH.ROUNDID" },
  { fra: "ROUNDMATCH", til: "RESULT", type: "1:N", via: "RESULT.ROUNDMATCHID" },
  { fra: "SECTION", til: "SECTIONTEAM", type: "1:N", via: "SECTIONTEAM.SECTIONID" },
  { fra: "SECTIONTEAM", til: "SECTIONPLAYER", type: "1:N", via: "SECTIONPLAYER.SECTIONTEAMID" },
  { fra: "MEM_MEMBER", til: "SECTIONPLAYER", type: "1:N", via: "SECTIONPLAYER.MEMBERNO" },
  { fra: "SECTION", til: "BOARDSPEC", type: "1:N", via: "BOARDSPEC.SECTIONID" },
  { fra: "BOARDSPEC", til: "BOARD", type: "1:1", via: "BOARD.BOARDSPECID" },
  { fra: "MEM_CLUB", til: "MEM_MEMBER", type: "1:N", via: "MEM_MEMBER.CLUBNO" },
  { fra: "MEM_MEMBER", til: "MASTERPOINTS", type: "1:N", via: "MASTERPOINTS.MEMBERNO" },
  { fra: "BRIDGEKLUBBER", til: "MEDLEMSKABER", type: "1:N", via: "MEDLEMSKABER.KLUBNR" },
  { fra: "MEDLEMMER", til: "MEDLEMSKABER", type: "1:N", via: "MEDLEMSKABER.MEDLEMSNR" },
  { fra: "HACTURNERINGER", til: "HACPOSTERINGER", type: "1:N", via: "HACPOSTERINGER.HACTURNERINGID" },
  { fra: "MEDLEMMER", til: "HACPOSTERINGER", type: "1:N", via: "HACPOSTERINGER.MEDLEMSNR" },
  { fra: "BRIDGEKLUBBER", til: "BORDAFGIFTER", type: "1:N", via: "BORDAFGIFTER.KLUBNR" },
];

/** Mapping fra skærmfelt i prototypen til tabel og felt i BC3/BridgeOrg. */
export type SkaermMapping = {
  skaerm: string;
  sti: string;
  felter: { felt: string; kilde: string; status: FeltStatus }[];
};

export const skaermMappinger: SkaermMapping[] = [
  {
    skaerm: "Min profil",
    sti: "/medlem",
    felter: [
      { felt: "Navn", kilde: "MEDLEMMER.NAVN / MEM_MEMBER.FIRSTNAME + LASTNAME", status: "ANTAGET" },
      { felt: "Medlemsnummer", kilde: "MEDLEMMER.MEDLEMSNR", status: "ANTAGET" },
      { felt: "E-mail", kilde: "MEDLEMMER.EMAIL", status: "ANTAGET" },
      { felt: "Telefon", kilde: "MEM_MEMBER.PHONE", status: "ANTAGET" },
      { felt: "Adresse / postnr / by", kilde: "MEM_MEMBER.ADDRESS, ZIPCODE, CITY", status: "ANTAGET" },
      { felt: "Født", kilde: "MEM_MEMBER.BIRTHDATE", status: "ANTAGET" },
      { felt: "Kontingent", kilde: "MEDLEMSKABER.KONTINGENTSTATUS", status: "ANTAGET" },
      { felt: "Klub", kilde: "MEDLEMSKABER.KLUBNR → BRIDGEKLUBBER.KLUBNAVN", status: "ANTAGET" },
    ],
  },
  {
    skaerm: "Mit handicap",
    sti: "/medlem",
    felter: [
      { felt: "Aktuelt handicap", kilde: "MEDLEMMER.HANDICAP", status: "ANTAGET" },
      { felt: "Dato", kilde: "HACTURNERINGER.DATO", status: "ANTAGET" },
      { felt: "Turnering", kilde: "HACTURNERINGER.TURNERINGSNAVN", status: "ANTAGET" },
      { felt: "Klub", kilde: "HACTURNERINGER.KLUBNR → BRIDGEKLUBBER.KLUBNAVN", status: "ANTAGET" },
      { felt: "Resultat", kilde: "HACPOSTERINGER.RESULTAT", status: "ANTAGET" },
      { felt: "Handicap før / efter", kilde: "HACPOSTERINGER.HCP_FOER, HCP_EFTER", status: "ANTAGET" },
    ],
  },
  {
    skaerm: "Mesterpoint",
    sti: "/medlem",
    felter: [
      { felt: "Kategori (guld/sølv/bronze)", kilde: "MASTERPOINTS.CATEGORY", status: "ANTAGET" },
      { felt: "Point", kilde: "MASTERPOINTS.POINTS", status: "ANTAGET" },
      { felt: "Turnering", kilde: "MASTERPOINTS.MAINTOURNAMENTID → MAINTOURNAMENT.NAME", status: "ANTAGET" },
      { felt: "Dato", kilde: "MAINTOURNAMENT.STARTDATE", status: "ANTAGET" },
    ],
  },
  {
    skaerm: "Turneringer og tilmelding",
    sti: "/turneringer",
    felter: [
      { felt: "Turneringsnavn", kilde: "MAINTOURNAMENT.NAME", status: "ANTAGET" },
      { felt: "Dato", kilde: "MAINTOURNAMENT.STARTDATE", status: "ANTAGET" },
      { felt: "Arrangør", kilde: "MAINTOURNAMENT.CLUBNO → MEM_CLUB.CLUBNAME", status: "ANTAGET" },
      { felt: "Række/gruppe", kilde: "GROUPTOURNAMENT.NAME", status: "ANTAGET" },
      { felt: "Tilmeldt deltager", kilde: "SECTIONPLAYER.MEMBERNO, PLAYERNAME", status: "ANTAGET" },
      { felt: "Hold/par", kilde: "SECTIONTEAM.TEAMNO, TEAMNAME", status: "ANTAGET" },
    ],
  },
  {
    skaerm: "Startlister (Online BC3)",
    sti: "/bc3/online",
    felter: [
      { felt: "Sektion", kilde: "SECTION.LETTER", status: "ANTAGET" },
      { felt: "Runde", kilde: "ROUND.ROUNDNO", status: "ANTAGET" },
      { felt: "Bord", kilde: "ROUNDMATCH.TABLENO", status: "ANTAGET" },
      { felt: "NS / ØV", kilde: "ROUNDMATCH.NSPAIR, EWPAIR", status: "ANTAGET" },
      { felt: "Spiller", kilde: "SECTIONPLAYER.PLAYERNAME", status: "ANTAGET" },
    ],
  },
  {
    skaerm: "Resultater",
    sti: "/resultater",
    felter: [
      { felt: "Turnering", kilde: "MAINTOURNAMENT.NAME", status: "ANTAGET" },
      { felt: "Spilnummer", kilde: "RESULT.BOARDNO / BOARDSPEC.BOARDNO", status: "ANTAGET" },
      { felt: "Kontrakt", kilde: "RESULT.CONTRACT", status: "ANTAGET" },
      { felt: "Score", kilde: "RESULT.SCORE", status: "ANTAGET" },
      { felt: "Procent/point", kilde: "RESULT.MATCHPOINTS", status: "ANTAGET" },
      { felt: "Fordeling", kilde: "BOARD.NORTHHAND, EASTHAND, SOUTHHAND, WESTHAND", status: "ANTAGET" },
    ],
  },
  {
    skaerm: "Klubber og klubsider",
    sti: "/klubber",
    felter: [
      { felt: "Klubnummer", kilde: "BRIDGEKLUBBER.KLUBNR", status: "ANTAGET" },
      { felt: "Klubnavn", kilde: "BRIDGEKLUBBER.KLUBNAVN", status: "ANTAGET" },
      { felt: "Distrikt / kreds", kilde: "BRIDGEKLUBBER.DISTRIKT, KREDS", status: "ANTAGET" },
      { felt: "Antal medlemmer", kilde: "COUNT(MEDLEMSKABER.MEDLEMSNR)", status: "ANTAGET" },
    ],
  },
  {
    skaerm: "DBF administration",
    sti: "/dbf",
    felter: [
      { felt: "Medlemskaber pr. klub", kilde: "MEDLEMSKABER.KLUBNR, SAESON", status: "ANTAGET" },
      { felt: "Bordafgift", kilde: "BORDAFGIFTER.ANTAL_BORDE, BELOEB", status: "ANTAGET" },
      { felt: "Periode", kilde: "BORDAFGIFTER.PERIODE", status: "ANTAGET" },
    ],
  },
];
