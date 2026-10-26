# Hierarkisk side for distrikter, kredse og klubber

## Resultat
Redesign `/distrikter-og-kredse` som én søgbar “Find bridge i Danmark”-side, hvor hierarkiet DBF → kreds → distrikt → klub kan forstås og bruges uden at forlade oversigten.

## Ændringer
- Udvid den fælles organisationsmodel med valgfrie, dokumenterede `siteNumber`-felter og korte geografiske betegnelser. De eksisterende interne ID’er, relationer og routes bevares.
- Erstat den nuværende todelte liste med:
  - ny introduktion og en enkel firetrinsforklaring,
  - søgning på kreds, distrikt, klubnavn, by og klubnummer,
  - filter for alle kredse eller én bestemt kreds,
  - “Vis alle klubber” / “Skjul klubber”.
- Vis fire kredssektioner. Hver sektion indeholder kredsens beskrivelse, antal distrikter og klubber samt et internt link til kredsens eksisterende hjemmeside.
- Vis distrikterne inde i deres kreds som kompakte, foldbare kort med navn, eventuelt sikkert organisationsnummer, klubantal og link til distriktets eksisterende hjemmeside.
- Når et distrikt åbnes, vises klubberne fra det fælles klubkatalog. Interne klubsider linkes kun, når de findes; eksterne hjemmesider bevares som eksterne links.
- Lad en klubsøgning automatisk vise og åbne det relevante distrikt. Søgning på kreds eller distrikt viser den relevante del af hierarkiet.

## Bevares
- Alle eksisterende `/kreds/:id`, `/distrikt/:id` og klubroutes.
- Den fælles navigation, designsystemet og datarelationerne.
- Ingen nye nummerbaserede route-aliases.

## Kontrol
- Kontrollér søgningerne Gentofte, 2132, Helsinge, 2139, Østjylland, 4200 og Kreds 4.
- Kontrollér kredsfilter, fold ud/skjul alle og mobil-/desktopvisning.
- Kontrollér links til kredse, distrikter, interne klubsider og eksterne klubhjemmesider.
- Kontrollér at eksisterende kreds-, distrikts- og klubsider stadig åbner korrekt.
