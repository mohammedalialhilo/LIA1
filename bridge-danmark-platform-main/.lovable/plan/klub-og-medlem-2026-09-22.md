# Klub og medlem

## Resultat

Et nyt hovedområde, der binder kluboversigten, distrikter, kredse og eksisterende klubsider sammen i platformens nuværende design. De eksisterende klub- og BC3-sider bevares.

## Implementering

1. Saml midlertidige organisationsdata i én typed datakilde med distrikter, valgfrie kredse og klubber. Klubposter får separate felter til intern side og ekstern hjemmeside, så data senere kan erstattes af et API.
2. Opret `/klub-og-medlem` med fire genbrugelige funktionskort: Klubber i Danmark, Distrikter og kredse, Kredshjemmesider og Nyeste klubber. Der tilføjes ingen ufærdige medlemsfunktioner.
3. Opret `/distrikter-og-kredse` med 11 distrikter og fire kredse, relationer mellem dem, links til relevante klubvisninger og eksterne hjemmesider i nye faner. Eksisterende `/klubber/distrikter` og distriktsdetaljer bevares.
4. Udbyg `/klubber` med kreds og tydelig adskillelse mellem interne klubsider og eksterne hjemmesider, uden at ændre søgning eller eksisterende klubruter.
5. Tilføj `Klub og medlem` i den fælles top- og mobilnavigation samt opdatér relevante footerlinks.

## Teknisk

- TanStack Router-links bruges til alle interne sider; eksterne adresser bruger almindelige links med ny fane.
- De nye sider genbruger `PageHero`, `Section`, `Card`, `Button` og eksisterende designtokens.
- Hver ny side får unik titel, beskrivelse og sociale metadata samt den eksisterende globale noindex-markering.
- Ingen database, login, backend eller ændringer i BC3 Online indgår.

## Kontrol

- Kontrollér `/klub-og-medlem`, `/klubber` og `/distrikter-og-kredse` på mobil og desktop.
- Kontrollér navigation til `/2132`, `/2133`, distrikter og eksterne hjemmesider.
- Kør eksisterende regressionstests og kontrollér, at klub-, underklub- og BC3-ruter fortsat virker.