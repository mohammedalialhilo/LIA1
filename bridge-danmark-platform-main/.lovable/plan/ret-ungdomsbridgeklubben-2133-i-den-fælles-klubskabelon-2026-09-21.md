# Ret Ungdomsbridgeklubben 2133 i den fælles klubskabelon

## Ændringer
- Udvid den fælles klubkonfiguration med valgfrie sektionstekster, aktivitetskort, turnerings-/resultatkort og kontaktlink, så 2133 bruger samme sidearkitektur som 2132 uden særskilt sidekode.
- Opdatér 2133 med det ønskede klubhoved, velkomstindhold, tre aktivitetskort og tre kort til nye unge spillere.
- Vis den samme fælles DBF-sektion som på 2132 med Mesterpoint, Rangliste og Handicap; Bronzestilling tilføjes kun, hvis en officiel side kan bekræftes.
- Tilføj én samlet sektion til Turneringsoversigt og Resultater, begge med den officielle kluboversigt for `mainclubno=2133&clubno=1` og uden et opdigtet tournament-id.
- Giv 2133 den fælles klubnavigation med relevante faner og ingen MBridge-, spilleholds- eller falske underklublinks.
- Bevar 2132 og alle andre klubbers data, links og visning uændret.

## Kontrol
- Sammenlign `/2133` og `/2132` på desktop og mobil for fælles header, navigation, bredder, kort, afstande og footer.
- Kontrollér, at hver 2133-sektion kun vises én gang, at alle eksterne links åbner korrekt, og at ingen MBridge- eller `/2133/x`-links findes.
- Kør de eksisterende regressionstest og kontrollér den seneste fejllog.
