# Gentofte Bridgeklub som klubside på /2132

## Mål
Gentofte Bridgeklub bliver en rigtig klubside i den eksisterende platform på `/2132`, bygget på den fælles klubdatamodel — ikke som særskilt side eller specialkode. Det forkerte klubnummer 6122 rettes til 2132.

## Indhold hentet fra klubbens nuværende hjemmeside
Kun oplysninger der faktisk står på bridge.dk/2132 og /2132/Klubben.html bruges:
- Spillested: Ordrup Sognegård, Henrik Hertz Vej 1, 2920 Charlottenlund
- Mandag 14.00–17.30 turneringsbridge (holdleder Ronny Neis)
- Mandag 18.45–22.15 turneringsbridge (holdleder Søren Debois)
- Mandag 18.00–18.30 undervisning ved Lars Øgaard for alle interesserede
- Turneringsledere: Ronny Neis og Søren Debois
- Kontingent: ét hold 2.000 kr., to hold 3.000 kr., 50 % rabat på efterfølgende hold, 260 kr. rabat hvis man primært er medlem af en anden klub
- Åbent hus: 60 kr. pr. gang, unge under 26 gratis
- Passivt medlemskab 500 kr./år inkl. Dansk Bridge med de fire nævnte fordele
- Klubregler (ordensregler og turneringsreglement) gengives i strukturerede accordion-afsnit

Der opfindes ikke bestyrelsesmedlemmer, telefonnumre, e-mailadresser, resultater eller medlemstal. Medlemstal udelades for Gentofte, da der ikke findes en reel kilde.

## Sådan bygges det

### Klubdata (konfiguration, ikke kode)
Klubmodellen i `src/lib/demo-data.ts` udvides med valgfri felter, så alle klubber senere kan oprettes automatisk fra BC3/API:
- `medlemmer` gøres valgfri, så en klub kan vises uden medlemstal
- `spillestedNavn`, `postnummer`, `by` som separate linjer til klubhoved og kontakt
- `eksterneLinks`: `resultsUrl`, `handicapUrl`, `masterpointsUrl`, `legacyWebsiteUrl`
- `aabentHus`: tekst, pris, tidspunkter, tilmeldingslink
- `klubIndhold`: sektioner med titel + afsnit (klubaktiviteter, medlemskab, kontingent, passivt medlemskab, klubregler, vedtægter) hvor de lange regelafsnit vises som accordion

Gentofte tilføjes som fuld klub med `nr: "2132"`, `kortNavn: "GBK"`, `logoTekst: "GBK"`, distrikt Nordsjælland, adresse Henrik Hertz Vej 1, 2920 Charlottenlund og temaet "klubbens eget" i en afdæmpet grøn/blå identitet.

### Rettelse af klubnummer
Den forkerte post `6122 – Gentofte Bridgeklub` fjernes fra listen over klubber uden egen side. Gentofte optræder derefter kun én gang i klubkataloget med nummer 2132 og med link til `/2132`. Søgning på "Gentofte", "Gentofte Bridgeklub", "2132" og "Charlottenlund" rammer klubben, fordi by sættes til Charlottenlund og klubnavnet indeholder Gentofte.

### Klubsiden (fælles komponent, konfigurerbart udtryk)
`src/routes/$klubId.tsx` udvides generisk — ingen Gentofte-specifik kode:
- Klubhoved: monogram, `bridge.dk/2132 · Distrikt Nordsjælland`, klubnavn, undertitel "Bridge, fællesskab og turnering i Gentofte", spillested i tre linjer, knapperne LOG IND I 2132 og TILMELDING samt mærket "Udseende: klubbens eget". Medlemstal vises kun, når klubben har et
- Lokal klubnavigation udvides med Handicap og Mesterpoint, som kun vises for klubber med de tilsvarende links
- Ny sektion med fire store kort på forsiden — Turneringer, Seneste resultater, Handicap, Mesterpoint — med store klikflader og god kontrast. Resultater/handicap/mesterpoint peger på DBF's egne systemer for klub 2132 og åbnes i ny fane; ingen opdigtede tal
- Velkomstsektion "Velkommen i Gentofte Bridgeklub" med spilletidskort
- Sektion "Spil bridge i Gentofte" med åbent hus mandag aften, spilstart 18.45, undervisning fra 18.00, 60 kr. pr. spiller, gratis for unge under 26, og knappen "Tilmeld dig åbent hus" der indtil videre peger på klubbens nuværende side
- Fanen "Klubben" viser de strukturerede afsnit med accordion for klubregler og vedtægter, når klubben har CMS-indhold
- Kontakt viser klubnavn, klubnr. 2132 og spillestedet med klikbart kortlink; kontaktpersoner vises kun med de roller, der faktisk står i kilden (turneringsledere)

### Forside og oversigt
Gentofte tilføjes som endnu et aktivt klubeksempel på forsiden uden at ændre de eksisterende eksempler. `/2275`, `/4470` og `/9999` berøres ikke ud over de fælles, valgfri modeludvidelser.

## Til sidst
`/2132` og `/klubber` kontrolleres i browseren, så du kan se klubsiden og det rettede klubnummer.
