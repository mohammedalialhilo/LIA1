# DBF Bridge Platform – systemgennemgang, kravspecifikation og MVP-plan

Status: analyse og planlægning (oktober 2026). Ingen sider, data eller integrationer er ændret som led i denne gennemgang.

Begreber brugt i dokumentet:
- **Verificeret** = afprøvet i browser/test mod reelle eller dokumenterede data.
- **Kun kode/UI** = findes i brugerflade eller kode, men bygger på demodata eller er ikke afprøvet mod reelle data.
- **Mangler** = ikke påbegyndt.
- Kravkilder: **[E]** eksisterende funktionalitet, **[D]** dokumenteret krav (opgavebeskrivelser/regelværk), **[F]** nyt forslag.

---

## 1. Nuværende implementering

Teknik: TanStack Start (React 19, Vite), Tailwind, TanStack Query. Ingen database, ingen backend, ingen rigtig autentifikation. Global `noindex, nofollow`.

| Område | Routes | Implementeret | Reelle data | Kun prototype | Mangler |
|---|---|---|---|---|---|
| Offentlige sider | `/`, `/om-dbf`, `/dbf`, `/butik` | Forside, DBF-info, butik | Faste tekster | Butik (ingen betaling), nyheder | CMS, nyhedsredigering |
| Navigation | `SiteHeader`, `SiteFooter` | Fælles top-/mobilmenu, footer | – | – | Sprog, rollebaseret menu |
| Login og roller | `LoginDialog`, `src/lib/session.tsx`, `/medlem` | Demologin for tre demomedlemmer, roller (medlem/klubadmin/dbf), klubskift | Ingen | Hele området – state kun i hukommelsen | Rigtigt login, brugere, rettigheder |
| BC3-login | `/bc3/login/$fdbNo`, `src/services/bc3Auth.ts` | Ærlig login-UI; returnerer "not-implemented" | – | `TEMPORARY_DEVELOPMENT_ACCESS = true` | Auth-endpoint i Magnus' API |
| Online BC3 | `/bc3/online/$clubNumber/...` | Stamoplysninger, medlemmer, medlemsdetalje, underklubber, makkerpar | **Ja – Magnus' Firebird-API** (Clubs, SubClubs, Members, MemberClubs) mod 9999.fdb | – | Turneringer, sektioner, runder, deltagere, resultater, skrivning |
| BC3-medlemsformular | `/bc3/online/.../medlemmer` | Nyt/rediger medlem | – | Session-lokal store (ikke gemt i API) | Skrive-endpoints |
| BC3-dokumentation | `/bc3`, `/bc3/teknisk/*`, `/bc3/brugervejledning/*` | ER-diagrammer, tabelbeskrivelser, to guides | Delvist dokumenteret struktur | Rekonstruerede dele er mærket | Verifikation mod skemaet |
| Klubadmin | `/klubadmin` | Selvbetjening af klubtekster mv. | – | Lokal state | Persistens, rettigheder, publicering |
| Klubsider | `/$klubId`, `/$klubId/$subclubId` | Fælles klubskabelon, spillehold/underklubber, eksterne DBF-links | **Ja** for 2132 og 2133 (verificerede tekster, links, clubno) | 2275, 4470, 9999 m.fl. er demodata | Redigering, nyheder, medlemmer |
| Klub- og medlemsoversigt | `/klub-og-medlem`, `/klubber`, `/klubber/distrikt*` | Kort, klubliste med distrikt/kreds, interne/eksterne links | Klubnavne/-numre delvist reelle | Medlemstal er demo | Officielt klubregister fra BridgeOrg |
| Distrikter og kredse | `/distrikter-og-kredse`, `/distrikt/$id/*`, `/kreds/$id/*` | 11 distrikter, 4 kredse, hierarki, søgning, CMS-klar indholdsmodel | Struktur verificeret via bridge.dk; indhold migreret for distrikt 4, 5, 6, 9 | Bornholm-klubliste (2012), Vestjylland-intro (AI-tekst) | Redigering, API, officielle tal |
| Turneringer og tilmelding | `/turneringer`, `/turneringer/$eventId`, `.../tilmelding` | Liste, detalje, tilmeldingsflow, regler (§§ 15, 22, 29) | Regeltekster | Turneringer og tilmeldinger er demodata | Rigtig tilmelding, betaling, venteliste |
| Resultater | `/resultater/*` | Divisionsturneringen 2026/2027: divisioner, stilling, kampe, hold, kampdetalje | **Kun kamp 2** (03-10-2026, Malerfirmaet 97/10,39 – Michael Beck 95/9,61) | Kamp 1 og 3 markeret placeholder; stilling afventer data | Parturneringer, spil, scoresheet, historik, import |
| HCP og MP | Eksterne links fra klubsider | Links til medlemmer.bridge.dk og ranglister | Links er reelle | – | Egne visninger fra dokumenterede data |

API og data:
- `src/api/firebirdApi.ts` – eneste sted med API-adresse (`VITE_FIREBIRD_API_URL`, standard `http://localhost:5083`). Virker kun, hvor API'et kører lokalt; den publicerede side kan ikke nå det.
- `src/hooks/*` – TanStack Query-hooks; ingen demo-fallback.
- `src/data/results/match-270-2-2-8-12.json` – schemaVersion 0.1, typet af `results-schema.ts`.
- `src/lib/demo-data.ts` (~90 KB) – hardcodede klubber, medlemmer, turneringer. Største kilde til prototypedata.
- `src/lib/organization-data.ts`, `organization-content.ts` – organisationshierarki og CMS-klart indhold.
- `src/data/bc3/*` – ældre demomedlemmer/klubber (bruges ikke af API-siderne).
- Tests: `demo-data.gentofte.test.ts`, `demo-data.ungdomsbridge.test.ts`.

Genbrugelige komponenter: `PageHero`, `Section` (Bits), `ClubFeatureCard`, `OrgShell` (brødkrumme, lokal navigation, lister), `Bc3Layout`, `ApiState`, `StatusBadge`, `ResultBits` (MatchCard, PlaceholderMark, Crumbs), shadcn-UI.

---

## 2. Gap analysis – prototype mod MVP

| MVP-punkt | Findes i dag | Gap |
|---|---|---|
| 1. Klubprofil og medlemmer | Klubprofil (API) og medlemsliste for 9999 via Magnus' API | Samme for 2275; fælles datakilde for offentlig klubside og BC3; adgangskontrol på medlemsdata |
| 2. Simpel klubhjemmeside | Klubskabelon + klubadmin med lokal state | Lagring, login, rolle "klubredaktør", publiceringsflow |
| 3. Virkelig turnering | Én divisionskamp som JSON | BC3-turneringsendpoints eller XML-import; parturnering |
| 4. Deltagere, placeringer, spil | UI til kamp/hold/stilling | Reelle deltagere, placeringer, spilfordelinger, scoresheet |
| 5. HCP og MP | Kun eksterne links | Dokumenteret datakilde (BridgeOrg/HAC) og visning |
| 6. Publicering | Ingen | Status "kladde/publiceret", link fra klubside til resultatportal |

Tværgående gaps: rigtig autentifikation, persistens, server-API på offentlig adresse, adskillelse af demo og reelle data i `demo-data.ts`, landeneutrale ID'er.

---

## 3. Kravspecifikation pr. spor

Prioritet for første MVP: **M**ust, **S**hould, **C**ould, **W**on't.

### Spor 1 – DBF-portal
- Formål: moderne efterfølger til bridge.dk. Brugere: medlemmer, nye spillere, klubber, DBF-sekretariat.
- Funktionelle krav: klubsøgning [E] M; organisationshierarki [E] M; resultatportal [E/D] M; turneringskalender [E] S; nyheder med redigering [F] S; tilmelding [E-demo] C; butik [E-demo] W.
- Roller: anonym (læse), medlem, DBF-redaktør.
- Data: klubber/organisation (BridgeOrg), resultater (Spor 6), nyheder (Spor 5 CMS).
- Afhængigheder: 4, 5, 6.
- Accept: alle offentlige data kommer fra API eller er mærket; ingen indeksering før godkendelse.
- Risici/åbne spørgsmål: officiel status i forhold til DBF; ejerskab af indhold; domæne.

### Spor 2 – Klubhjemmesider (CMS)
- Formål: klubber vedligeholder egne sider. Brugere: klubadministratorer, klubmedlemmer, besøgende.
- Krav: profil, spilletider, spillehold [E] M; redigering med lagring [F] M; nyheder og aktiviteter [F] S; medlemsliste kun for medlemmer [F] S; flersproget indhold [D] C; eget domæne [F] W.
- Roller: klubadmin, klubredaktør, medlem, anonym.
- Data: klubtabel + indhold i SQL Server; spillehold fra BC3 SubClubs.
- Afhængigheder: 5 (login/roller), 3 (spillehold), 6 (resultater).
- Accept: klubadmin for 2275 kan redigere og publicere en side, som anonym kan se.
- Risici: GDPR for medlemsdata; mange klubber har eksisterende sider/BridgeCMS.

### Spor 3 – Online BridgeCentral
- Formål: webudgave af BC3. Brugere: klubadministratorer, turneringsledere.
- Krav: læse stamdata, medlemmer, underklubber, makkerpar [E, verificeret] M; turneringer/sektioner/runder/deltagere/resultater læse [D] M; skrive medlemmer [E-UI] S; oprette turnering [D-guide] C; fuld BC3-paritet W.
- Roller: klubadmin, turneringsleder, læseadgang.
- Data: Firebird 2.5 klubdatabaser via Magnus' API.
- Afhængigheder: 5 (auth-endpoint), 6 (resultatformat).
- Accept: 2275 og 9999 vises med reelle turneringsdata uden fallback.
- Risici: ingen auth-endpoint endnu; samtidig skrivning med desktop-BC3; udokumenterede felter.

### Spor 4 – Nyt BridgeOrg
- Formål: central database for medlemmer, klubber, HCP, MP. Brugere: DBF, klubber, systemer.
- Krav: læse-API for klubber og medlemmer [F] M (for MVP: kun læse fra Firebird 3.0); HCP og MP læse [D] M; nyt SQL Server-skema [F] S; migrering [F] W i MVP.
- Roller: DBF-administrator, systemklienter.
- Afhængigheder: 5, 7.
- Risici: datakvalitet, GDPR, ejerskab af BridgeOrg; dokumentation af HCP-beregning.

### Spor 5 – Fælles platform
- Formål: login, brugere, roller, organisationer, API.
- Krav: rigtigt login [F] M; roller pr. organisation (forbund/kreds/distrikt/klub) [F] M; generelle organisations-ID'er uafhængige af danske klubnumre [D] M; audit-log [F] S; flere forbund/sprog [D] S; SSO med BeckCRM [D-undersøges] C.
- Afhængigheder: alle spor afhænger af dette.
- Risici: valg mellem BeckCRM-genbrug og standard (ASP.NET Identity/OpenID Connect).

### Spor 6 – Turneringsresultater
- Formål: bedre resultatvisning. Brugere: spillere, klubber, DBF.
- Krav: holdkampe med IMP/VP [E, delvist verificeret] M; parturnering med placeringer [D] M; spilresultater og kortfordeling [E-UI] S; stilling beregnet fra data [E-UI] S; historik og spillerprofil [F] C.
- Data: schemaVersion 0.1 JSON; senere fra API.
- Afhængigheder: 3, 7.
- Accept: én reel turnering vises komplet uden placeholdere.
- Risici: XML-formater varierer mellem RealBridge, Bridge+More, BBO.

### Spor 7 – BeckHACReader
- Formål: .NET-program til import og validering af XML. Brugere: DBF, turneringsledere.
- Krav: læse Bridge+More XML (Helsinge 2139) [D] M; validering med fejlrapport [D] M; output i schemaVersion 0.1 [F] M; RealBridge/BBO [D] S; HCP- og MP-beregning [D] C i MVP.
- Afhængigheder: 4 (medlemsnumre), 6 (format).
- Risici: manglende eksempelfiler og formatdokumentation.

---

## 4. Teknisk arkitekturskitse

```text
 React (dbf.ibridge.dk)  ──►  ASP.NET Core API (Platform-API)
    TanStack Query               │  auth, roller, organisationer, CMS
                                 ├──► SQL Server (nye platformdata)
                                 ├──► Firebird 2.5 klub-DB'er (via Magnus' API / adapter)
                                 └──► Firebird 3.0 BridgeOrg (læse-adapter)
 BeckHACReader (.NET) ──► validerede resultater (schemaVersion JSON) ──► API
```

Principper:
- Frontend kender kun Platform-API'et; adresser samles ét sted (som i dag `firebirdApi.ts`).
- Generelle ID'er (`organizationId`, `federationId`), med danske klubnumre som eksterne referencer – jf. `sourceRefs`-mønstret.
- Sprog via oversættelsesnøgler fra start i nye moduler [F].
- Strangler-migration: eksisterende DBF-systemer kører uændret; ny platform læser først (read-only adaptere), skriver senere modul for modul. Eksterne DBF-links bevares, indtil et modul er godkendt som erstatning.

---

## 5. Første MVP – referenceklub

Referenceklub: **Rødovre 2275** (har BC3-data); **9999** som testklub; **Helsinge 2139** til XML-import.

1. Klubprofil og medlemmer fra BC3-API (eksisterer for 9999 – udvid til 2275).
2. Simpel klubhjemmeside med lagret indhold og klubadmin-login.
3. Én virkelig turnering fra BC3 eller Bridge+More XML.
4. Deltagere, placeringer og spilresultater fra samme kilde.
5. HCP og MP fra dokumenteret kilde (BridgeOrg) – ellers eksterne links.
6. Publicér resultatet på klubsiden og i `/resultater`.

### Prioriteret MVP-backlog
1. **M** Indhent rigtig turneringsfil (XML/BC3) for 2275 eller 2139 og definér schemaVersion 0.2 for parturnering.
2. **M** Vis parturnering (deltagere, placeringer) i `/resultater` fra JSON.
3. **M** BC3-API: dokumentér og tilføj turneringsendpoints (Magnus).
4. **M** Platform-API skitse + rigtigt login (afløser demosession).
5. **M** Flyt reelle klubdata ud af `demo-data.ts` til typede, mærkede datakilder.
6. **S** Klubadmin med lagring for 2275.
7. **S** Spilresultater og kortfordeling.
8. **S** HCP/MP-læseendpoint fra BridgeOrg.
9. **C** Publiceringsflow (kladde/publiceret).
10. **C** Flersprog i nye moduler.

### Forslag til opgavefordeling (studerende)
- Hold A – Frontend/resultater (Spor 6, React).
- Hold B – BeckHACReader og XML-format (Spor 7, .NET).
- Hold C – Platform-API, login og roller (Spor 5, ASP.NET Core + SQL Server).
- Hold D – BC3-turneringsendpoints og Firebird-adapter (Spor 3/4, sammen med Magnus).
- Hold E – Klub-CMS (Spor 2) når Hold C har login klar.

---

## 6. Manglende oplysninger – skal afklares med projektejer

1. Rigtige XML-filer fra Bridge+More (Helsinge 2139), RealBridge og BBO.
2. En komplet BC3-turnering for 2275 eller 9999 og tilladelse til at vise den.
3. Dokumentation af BC3-turneringstabeller og eventuelle endpoints hos Magnus.
4. Planlagt auth-endpoint i Magnus' API, eller valg af fælles login (BeckCRM?).
5. Adgang til og dokumentation af BridgeOrg (Firebird 3.0), inkl. HCP- og MP-beregning.
6. GDPR: hvilke medlemsdata må vises offentligt og for hvem.
7. Hosting af API'et, så den publicerede side kan nå det.
8. Rigtige tal for kamp 1/3, spillernavne og stilling i divisionsturneringen.
9. DBF's holdning til projektets status og brug af bridge.dk-indhold.
10. Hvilke lande/forbund der er reelle målgrupper ud over Danmark.

---

## 7. Anbefalet første implementeringsopgave

**Indlæs én rigtig parturnering fra Helsinge 2139 (Bridge+More XML) eller Rødovre 2275 (BC3) og vis den i resultatportalen.**

Konkret: få én reel fil, udvid schemaVersion til parturnering (deltagere, placeringer, spilresultater), konvertér filen til JSON i `src/data/results/` uden opdigtede felter, og vis den under `/resultater` samt med link fra klubsiden. Det afprøver Spor 6 og 7 og formatet til det kommende API med mindst mulig risiko, og det kræver hverken login eller database.
