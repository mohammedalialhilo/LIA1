# Ret Gentofte til hovedklub med spillehold

## Mål
`/2132` bliver Gentofte Bridgeklubs hovedside. Den præsenterer klubben og tre spillehold, mens turneringer, resultater, handicap og mesterpoint flyttes til interne spilleholdssider.

## Fælles model og routing
- Udvid den eksisterende klubdatamodel med en generel type for offentlige spillehold/underklubber: `clubNo`, navn, dag/tid, beskrivelse, leder, undervisning og resultatlink.
- Brug klubbens eksisterende `eksterneLinks` til de fælles handicap- og mesterpointlinks.
- Tilføj én generisk offentlig rute `/$klubId/$subclubId`, der slår både hovedklub og spillehold op i data. Gentofte bliver dermed konfigurationsdata, ikke tre særskilte sider.
- Genbrug den eksisterende klubheader, tema, kort, knapper, globale header/footer og den kendte hovedklub → underklub-tankegang fra BC3 Online. Andre klubbers data og eksisterende sider ændres ikke.

## Gentofte-data
Tilføj disse tre spillehold under hovedklub 2132:
- `4` — Mandag eftermiddag, mandag 14.00–17.30, Ronny Neis, resultater med `mainclubno=2132&clubno=4`.
- `3` — Mandag aften / åbent hus, mandag 18.45–22.15, undervisning ca. 18.00–18.30, Søren Debois, resultater med `mainclubno=2132&clubno=3`.
- `2` — Sommer- og sølvturneringer, sommerbridge, åbent hus, sølvturneringer og særlige arrangementer, resultater med `mainclubno=2132&clubno=2`.

Det nuværende forkerte resultatlink med `clubno=1` fjernes.

## Hovedsiden `/2132`
- Behold klubnavn, klubnummer, distrikt og spillested tydeligt øverst.
- Begræns Gentofte-navigationen til almindeligt klubindhold: Forside, Klubben, Spillehold, Nyheder og Kontakt.
- Fjern sektionen med de fire funktionskort fra hovedforsiden.
- Gør de tre spillehold til det vigtigste indhold med store, lette kort, som åbner `/2132/4`, `/2132/3` og `/2132/2`.
- Behold almindeligt klubindhold efter spilleholdene.
- Ændr åbent hus-knappen til den interne side `/2132/3`.

## Generisk spilleholdsside
- Vis brødkrumme og tydelig relation: Gentofte Bridgeklub → valgt spillehold.
- Vis spilleholdets faktiske tider, beskrivelse, leder og eventuel undervisning.
- Vis funktionskortene her: Kommende turneringer, Seneste resultater, Handicap og Mesterpoint.
- Resultatkortet bruger altid det valgte spilleholds `clubNo`; handicap og mesterpoint bruger hovedklub 2132 som krævet af de eksisterende systemer.
- Ingen falske turneringer eller resultater tilføjes; officielle sider åbnes i ny fane.

## Kontrol
- Kontrollér desktop og mobil for `/2132`, `/2132/4`, `/2132/3` og `/2132/2`.
- Kontrollér links, tilbage-navigation, at `clubno` skifter korrekt, og at `/2275`, `/4470` og `/9999` fortsat virker uændret.
