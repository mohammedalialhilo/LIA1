/**
 * Uddrag af DBf's officielle bestemmelser, gældende fra 1. september 2026.
 * Kilder (citeret, ikke omskrevet):
 *  - Spillerhåndbogen:        https://www.bridge.dk/lov/love17/tr2609/n15.htm
 *  - Turneringslederhåndbogen: https://www.bridge.dk/lov/love17/tr2609/n22.htm
 *  - DBf's turneringer:       https://www.bridge.dk/lov/love17/tr2609/n29.htm
 * Samlet indgang: https://www2.bridge.dk/Regler.aspx?ID=17869
 */

export type Kilde = "n15" | "n22" | "n29";

export const kilder: Record<Kilde, { titel: string; url: string }> = {
  n15: { titel: "DBf's spillerhåndbog", url: "https://www.bridge.dk/lov/love17/tr2609/n15.htm" },
  n22: {
    titel: "DBf's turneringslederhåndbog",
    url: "https://www.bridge.dk/lov/love17/tr2609/n22.htm",
  },
  n29: { titel: "DBf's turneringer", url: "https://www.bridge.dk/lov/love17/tr2609/n29.htm" },
};

export const reglerIndgang = "https://www2.bridge.dk/Regler.aspx?ID=17869";
export const reglerGyldighed = "Gyldig fra 1. september 2026";

export type Regel = {
  id: string;
  paragraf: string;
  titel: string;
  kilde: Kilde;
  /** Emner: bruges til at vise de rigtige regler på det rigtige trin i tilmeldingen. */
  emner: string[];
  punkter: string[];
};

export const regler: Regel[] = [
  {
    id: "301a",
    paragraf: "§ 301 A",
    titel: "Medlemskab af DBf",
    kilde: "n29",
    emner: ["deltagelse", "begivenhed"],
    punkter: [
      "Kun spillere, der på spilletidspunktet er registreret i DBf's medlemssystem som værende medlem af en klub under DBf, har ret til at deltage i DBf's mesterskabsturneringer, medmindre andet udtrykkeligt fremgår af turneringens propositioner.",
      "For enhver af DBf's mesterskabsturneringer, hvor der er krav om medlemskab, gælder dette krav også de tilhørende kvalifikationsturneringer, hvad enten disse er arrangeret af DBf, en kreds, et distrikt eller en klub.",
      "Hvis § 301A1 ikke er opfyldt, gives normalt dispensation, hvis spilleren kan dokumentere indbetalt kontingent i form af en netbankoverførsel eller en giroindbetaling. Andre former for dokumentation er ikke tilstrækkelige til at udløse dispensation.",
    ],
  },
  {
    id: "301b",
    paragraf: "§ 301 B",
    titel: "Tilmelding til kvalifikationsturneringer",
    kilde: "n29",
    emner: ["deltagelse", "begivenhed"],
    punkter: [
      "Et par eller et hold kan tilmelde sig en kvalifikationsturnering i ethvert distrikt, hvor en eller flere af parrets eller holdets spillere er medlem af mindst én klub. Der skal til enhver tid spille mindst én spiller, der er medlem af en klub i distriktet, uanset om der bruges substitutter.",
    ],
  },
  {
    id: "303a",
    paragraf: "§ 303 A",
    titel: "Tilmelding",
    kilde: "n29",
    emner: ["tilmelding", "oplysninger"],
    punkter: [
      "Tilmelding skal ske skriftligt eller pr. e-mail til den turneringsansvarlige.",
      "Tilmeldingen skal indeholde navne på samtlige spillere samt adresse og telefonnummer på en kontaktperson (for hold normalt holdkaptajnen). For DBf-medlemmer skal medlemsnummer desuden oplyses.",
      "Kontaktpersonen er bl.a. ansvarlig for turneringsindskud, rejsegodtgørelser og lignende mellemværender med DBf.",
    ],
  },
  {
    id: "303b",
    paragraf: "§ 303 B",
    titel: "Betaling af turneringsindskud",
    kilde: "n29",
    emner: ["betaling", "bekraeftelse"],
    punkter: [
      "En tilmelding er ikke gyldig, før turneringsindskud og bidrag til evt. rejsepulje er betalt.",
      "Betaling kan ske i vedlagt check, pr. giro eller ved bankoverførsel.",
    ],
  },
  {
    id: "303c",
    paragraf: "§ 303 C",
    titel: "Holdsammensætning",
    kilde: "n29",
    emner: ["deltagere", "hold"],
    punkter: [
      "For hvert hold skal der tilmeldes 4-6 spillere. Desuden kan der angives en ikke-spillende holdkaptajn.",
      "Den turneringsansvarlige kan tillade, at der ved tilmeldingsfristen tilmeldes færre end 4 spillere. I dette tilfælde skal holdet meddele holdets endelige sammensætning inden en frist, som den turneringsansvarlige fastsætter, og altid inden holdet påbegynder sin første kamp i turneringen.",
      "Efter at et hold har påbegyndt sin første kamp, kan en spiller tilføjes, hvis der ikke allerede er tilmeldt 6 spillere, spilleren ikke er tilmeldt et andet hold i turneringen, og spilleren ikke har optrådt som substitut på et andet hold i samme eller lavere række i samme turnering.",
    ],
  },
  {
    id: "303d",
    paragraf: "§ 303 D",
    titel: "Holdnavne",
    kilde: "n29",
    emner: ["hold"],
    punkter: [
      "Hvis holdkaptajnen er en af holdets spillere, kan holdkaptajnens navn bruges som holdets navn.",
      "Hvis holdkaptajnen ikke er en af holdets spillere, kan holdets navn angives som »Team« fulgt af holdkaptajnens navn.",
      "Hvis samtlige holdets tilmeldte spillere er medlemmer af samme klub, kan klubbens navn bruges som holdets navn, selv om klubben ikke sponsorerer holdet.",
    ],
  },
  {
    id: "305a",
    paragraf: "§ 305 A",
    titel: "Substitutter i parturneringer",
    kilde: "n29",
    emner: ["deltagere", "par"],
    punkter: [
      "Spillerne skal informere turneringslederen eller den turneringsansvarlige, inden en udskiftning finder sted, herunder hvis en substitut indsættes i første runde.",
      "Der skal til ethvert tidspunkt spille mindst én spiller fra det par, der oprindeligt var tilmeldt den pågældende fase af turneringen.",
      "En spiller må ikke optræde som substitut, hvis spilleren er tilmeldt et andet par i den igangværende fase af turneringen, medmindre det pågældende par har trukket sig fra turneringen.",
      "Enhver substitut skal opfylde turneringens betingelser om køn, alder og spillestyrke.",
    ],
  },
  {
    id: "305b",
    paragraf: "§ 305 B",
    titel: "For sen ankomst i første runde i et parmesterskab",
    kilde: "n29",
    emner: ["afvikling"],
    punkter: [
      "Hvis et par ikke har taget plads ved bordet senest 5 minutter efter det officielle starttidspunkt for en fase af et parmesterskab, indsætter den turneringsansvarlige eller turneringslederen hurtigst muligt et reservepar.",
    ],
  },
  {
    id: "307a",
    paragraf: "§ 307 A",
    titel: "Mobiltelefoner og elektronisk udstyr",
    kilde: "n29",
    emner: ["afvikling", "ordensregler"],
    punkter: [
      "Mobiltelefoner, smartwatches og lignende elektronisk udstyr, som spilleren medbringer i spillelokalet under en runde, skal lægges på eller i nærheden af bordet, og skal være slukket eller eventuelt i flytilstand (»lydløs« eller »forstyr ikke« er ikke tilstrækkeligt).",
      "Hvis udstyret ikke er slukket eller i flytilstand, eller hvis det giver et hørbart signal, straffes deltageren med et standardfradrag.",
      "Hvis udstyret betjenes, bortset fra slukning, straffes deltageren med to standardfradrag.",
    ],
  },
  {
    id: "307c",
    paragraf: "§ 307 C",
    titel: "Medier",
    kilde: "n29",
    emner: ["bekraeftelse", "ordensregler"],
    punkter: [
      "Enhver deltager accepterer ved sin tilmelding, at hele eller dele af begivenheden kan blive filmet, fotograferet eller på anden måde dokumenteret eller offentliggjort af DBf eller af andre, som har fået tilladelse af DBf til dette.",
      "Enhver deltager anses ved sin tilmelding for at have givet DBf tilladelse til at tage billeder eller film af deltagerne under turneringen og til at bruge sådant materiale til bridgens fremme.",
    ],
  },
  {
    id: "307de",
    paragraf: "§ 307 D-E",
    titel: "Mesterpoint og sprog",
    kilde: "n29",
    emner: ["afvikling", "begivenhed"],
    punkter: [
      "Der spilles i alle turneringer om mesterpoint efter de af Turneringskomiteen fastlagte regler.",
      "Det officielle sprog i turneringerne er dansk. Hvis der opstår misforståelser pga. sprogproblemer, vil en spiller, hvis manglende danskkundskaber forårsagede misforståelsen, normalt blive betragtet som ansvarlig for misforståelsen.",
    ],
  },
  {
    id: "111",
    paragraf: "§ 111",
    titel: "Brug af systemkort",
    kilde: "n15",
    emner: ["afvikling", "systemkort"],
    punkter: [
      "Ved hver rundes begyndelse skal hvert par uopfordret fremlægge to ens, læselige og korrekt udfyldte officielle systemkort til modstandernes orientering i hele runden.",
      "Turneringsarrangøren kan i turneringens propositioner fastlægge bestemmelser om, hvilke systemkort der kan bruges: DBf's parturneringssystemkort (»de små«), DBf's holdturneringssystemkort (»de store«) eller WBF's systemkort.",
      "Medmindre turneringsarrangøren har fastlagt andre bestemmelser, skal DBf's parturneringssystemkort (»de små«) bruges.",
    ],
  },
  {
    id: "101",
    paragraf: "§ 101",
    titel: "Tilladte makkeraftaler",
    kilde: "n15",
    emner: ["systemkort", "afvikling"],
    punkter: [
      "I holdturneringer er alle systemer og makkeraftaler tilladt.",
      "Holdturneringer med færre end 16 spil pr. runde behandles i denne forbindelse som parturneringer.",
    ],
  },
  {
    id: "x80",
    paragraf: "§ X80",
    titel: "Turneringsarrangørens ansvar",
    kilde: "n22",
    emner: ["afvikling", "arrangoer"],
    punkter: [
      "Turneringslederhåndbogen fastlægger bl.a. regelgrundlaget for turneringsarrangøren, hvad der sker, hvis en turnering ikke kan afvikles efter planen, og hvornår et annonceret turneringsformat må ændres.",
      "Håndbogen indeholder desuden retningslinjer for strafpoint og standardfradrag, for sen ankomst, tidsoverskridelse, annullerede spil samt appelfrist og appelinstanser.",
    ],
  },
];

export function reglerForEmne(emne: string) {
  return regler.filter((r) => r.emner.includes(emne));
}
