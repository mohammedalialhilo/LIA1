# Bridge Centralized

reate a new prototype for a future unified Danish Bridge Federation platform at bridge.dk.

IMPORTANT:

The starting point is the PUBLIC bridge.dk website and the member/club experience.

This is NOT only a technical documentation site.

The prototype should demonstrate how the following can become one coherent platform:

- public bridge.dk
- bridge clubs and club websites
- member login
- tournament and event registration
- online BridgeCentral / BC3
- results
- handicap and masterpoints
- Bridgebutikken
- technical BC3/BridgeOrg documentation

All visible UI must be in Danish.

Use DEMO DATA only.

==================================================
VISUAL IDENTITY
==================================================

Use the current Bridgefestival.dk visual identity as the main design inspiration.

The new bridge.dk, club pages, registration system, online BC3 and Bridgebutikken should feel like parts of the same family.

Use a modern, welcoming bridge identity with:

- strong typography
- clear navigation
- large images where relevant
- cards for content and events
- clear calls to action
- clean tables for tournament and administrative information

Do NOT copy Bridgefestival.dk pixel-for-pixel.

Create a reusable design system inspired by it.

IMPORTANT:

The existing iBridge / DBF booking demo is also a useful visual and functional reference for the registration flow.

Keep the registration experience visually consistent with the rest of bridge.dk.

==================================================
MAIN NAVIGATION
==================================================

Create this main public navigation:

Forside
Klubber
Turneringer & tilmelding
BC3
Resultater
Bridgebutikken
Om DBF

And a prominent:

LOG IND

button.

==================================================
1. FORSIDE
==================================================

Use the CURRENT bridge.dk as inspiration for the type of content DBF needs, but redesign it completely using the Bridgefestival-inspired visual identity.

Create sections such as:

- Aktuelt fra Danmarks Bridgeforbund
- Find en bridgeklub
- Kommende turneringer og events
- Dansk Bridgefestival
- Seneste resultater
- BridgeCentral / BC3
- Dansk Bridge
- Guld-, sølv- og åbne turneringer
- Lær at spille bridge
- Inspiration til klubber
- Bridgebutikken
- Nyheder

The new homepage should give both:

- existing bridge members
- new potential players

a clear entry into the Danish bridge community.

==================================================
2. KLUBBER
==================================================

Create a main navigation item:

"Klubber"

Use the concepts from the current DBF pages:

"Klubber i Danmark"
and
"Distrikter og kredse"

Create:

- searchable club directory
- map placeholder
- geographical filtering
- district filtering
- list of districts
- district pages
- information about the four kredse

The architecture must support all Danish bridge clubs.

Example demo clubs:

2275 – Rødovre Bridgeklub
4470 – Kolding Bridge Center
9999 – Kursusklub 9999

Clicking a club opens:

bridge.dk/2275
bridge.dk/4470
bridge.dk/9999

==================================================
3. CLUB WEBSITE
==================================================

Each club has its own public website within bridge.dk.

Example:

bridge.dk/2275

Use the same standard visual identity as bridge.dk.

Typical club navigation:

Forside
Klubben
Spilletider
Turneringer
Tilmelding
Resultater
Nyheder
Kontakt

The club page should include:

- club name
- logo
- address
- playing times
- club description
- news
- coming events
- tournament calendar
- results
- contact information

Some clubs have a simple structure.

Example:

2275 – Rødovre Bridgeklub

Other clubs can contain several subclubs / playing groups.

Example:

4470 – Kolding Bridge Center

Show the underlying clubs/playing groups clearly when relevant.

Do NOT show unnecessary hierarchy for simple clubs.

==================================================
4. CLUB DESIGN FLEXIBILITY
==================================================

Bridge.dk provides a standard Bridgefestival-inspired club template.

However, clubs must later be able to customize their website.

Prepare the architecture for:

- custom logo
- custom colors
- custom images
- typography
- content
- page structure

Some clubs may use the standard bridge.dk identity.

Others may retain a much stronger individual identity.

Do not implement multiple CMS technologies now.

Only demonstrate that club content and appearance are configurable.

==================================================
5. LOGIN
==================================================

Create a login dialog containing:

Medlemsnummer / e-mail
Adgangskode

and:

Vælg klub

LOGIN LOGIC:

If a member logs in from their own club page, enter that club context.

Example:

bridge.dk/2275
→ login
→ club 2275

If a member logs in from bridge.dk without club context:
→ use their primary club.

If a member logs in while visiting another club to which they do not belong:
→ normally enter their primary club.

If the member belongs to or administers several clubs:
→ allow the member to select an authorized club in the login dialog.

==================================================
6. MEMBER AREA
==================================================

After login preserve the same visual identity.

Member menu:

Min klub
Mine turneringer
Tilmeldinger
Mine resultater
Mit handicap
Mesterpoint
Min profil

Create realistic demo tournament histories.

One demo member in Rødovre should primarily demonstrate:

- holdturnering
- division
- some pair tournaments
- handicap history

A second anonymized demo member in Kolding should primarily demonstrate:

- pair tournaments
- handicap history

Real screenshots and data will be supplied later.

==================================================
7. TURNERINGER & TILMELDING
==================================================

Create a major public section:

"Turneringer & tilmelding"

This must support BOTH:

A. DBF events and tournaments

and

B. individual club tournaments/events.

The registration platform should be inspired functionally and visually by the existing DBF booking demo shown on iBridge.dk.

Use this registration flow:

Begivenheder
→ Begivenhed
→ Tilmelding
→ Hold / par / individuel information
→ Deltagere
→ Bekræftelse
→ Betaling when relevant

Support:

- individuel tilmelding
- partilmelding
- holdtilmelding
- kurser
- events
- Bridgefestival activities
- club tournaments

Each event must have an organizer.

Examples:

Arrangør:
Danmarks Bridgeforbund

or:

Arrangør:
Rødovre Bridgeklub

or:

Arrangør:
Kolding Bridge Center

Create filters:

Alle
DBF
Min klub
Parturnering
Holdturnering
Kurser
Events
Bridgefestival

A logged-in member should be able to see:

Mine tilmeldinger

Do NOT implement real payment yet.

==================================================
8. BC3 AS MAIN MENU ITEM
==================================================

Create a top-level main menu item:

"BC3"

BC3 should have TWO purposes:

A. information/support about BridgeCentral

B. entry into the future online club administration system

Public BC3 landing page:

BridgeCentral / BC3

Explain that BC3 is the existing DBF system for:

- medlemsadministration
- klubadministration
- turneringsadministration
- resultater
- handicap
- mesterpoint

Create sections such as:

Om BridgeCentral
Kom godt i gang
Bridgemate
Turneringsadministration
Support
Dokumentation
Teknisk dokumentation

The existing DBF BC3 information should be used as content inspiration.

==================================================
9. ONLINE BC3
==================================================

When an authorized club member/admin is logged in, show:

"Åbn Online BC3"

Online BC3 should use the SAME modern bridge.dk identity.

Do NOT reproduce the old Windows visual style.

Initial online BC3 menu:

Dashboard
Spillere
Klubturneringer
Tilmeldinger
Startlister
Turneringsafvikling
Resultater
Handicap
Mesterpoint
Klubadministration

Do not implement all functionality yet.

These screens will later be recreated using screenshots from the real BC3 application.

==================================================
10. DBF EMPLOYEE CONTEXT
==================================================

Authorized DBF employees default to:

5000 – Danmarks Bridgeforbund

This represents the central DBF administration environment.

DBF dashboard:

Klubber
Medlemmer
Turneringer
Tilmeldinger
Resultater
Handicap
Mesterpoint
Distrikter
Systemadministration

==================================================
11. BC3 TECHNICAL DOCUMENTATION
==================================================

Inside the BC3 section create:

"Teknisk dokumentation"

This is NOT the primary experience for normal members.

Create subpages:

Systemoversigt
BC3 database
BridgeOrg database
ER-diagrammer
Bridgemate
Resultatflow
Handicap
Mesterpoint
Services
Wiki BC3

==================================================
12. ER DIAGRAMS
==================================================

Already include preliminary ER diagram pages.

BC3 preliminary model:

MAINTOURNAMENT
→ GROUPTOURNAMENT
→ SECTION
→ ROUND
→ ROUNDMATCH
→ RESULT

Also show associated tables:

SECTION
→ SECTIONTEAM
→ SECTIONPLAYER

SECTION
→ BOARDSPEC
→ BOARD

Other known BC3 tables include:

MEM_MEMBER
MEM_CLUB
MASTERPOINTS

BridgeOrg known tables include:

BRIDGEKLUBBER
MEDLEMMER
MEDLEMSKABER
HACTURNERINGER
HACPOSTERINGER
BORDAFGIFTER

Clearly mark the diagrams:

"FORELØBIG MODEL – relationer og felter verificeres løbende"

Do NOT invent undocumented fields or foreign keys.

==================================================
13. DEVELOPER MODE
==================================================

Create a toggle available to authorized technical users:

"Udviklertilstand"

Normal members do NOT see this.

When enabled, screens can display technical mapping information.

Example:

UI:
Startliste

System:
BC3

Database:
xxxx.fdb

Table:
SECTIONPLAYER

Field:
Ikke dokumenteret endnu

Status:
SKAL VERIFICERES

Another example:

UI:
Spiller

Possible table:
MEM_MEMBER

The goal is to document the CURRENT BC3 database while designing the future online interface.

Later we will supply real BC3 screenshots and map individual:

screens
fields
buttons
tables
database fields

to the new UI.

==================================================
14. BRIDGEBUTIKKEN
==================================================

Create Bridgebutikken as a full part of bridge.dk.

Use the same identity.

Demo categories:

Spillekort
Bridgeborde
Bridgemate / udstyr
Bøger
Undervisningsmateriale
Gaver

Create a modern shop front.

No real commerce backend is required yet.

==================================================
15. RESULTS
==================================================

Create a main public section:

"Resultater"

Later it will combine results currently spread across several DBF systems.

Create initial demo filters:

Klub
Dato
Turneringstype
DBF-turnering
Distrikt
Spiller

From a member profile it should also be possible to reach:

Mine resultater
Mit handicap
Mesterpoint

==================================================
16. FIRST BUILD PRIORITY
==================================================

For THIS FIRST BUILD prioritize:

1. bridge.dk homepage
2. overall Bridgefestival-inspired design
3. main navigation
4. Klubber directory
5. sample club page
6. Turneringer & tilmelding
7. BC3 public landing page
8. initial Online BC3 dashboard
9. technical documentation navigation
10. preliminary ER diagrams
11. Bridgebutikken
12. login dialog

Do NOT attempt to implement every BC3 feature.

Do NOT connect real databases.

Do NOT implement scoring.

Do NOT implement real authentication.

Do NOT implement payment.

Do NOT invent technical database fields.

The main objective is to show how the PUBLIC bridge.dk website, club websites, tournament registration, member login, Online BC3 and technical documentation can become ONE coherent platform.reate a new prototype for a future unified Danish Bridge Federation platform at bridge.dk.

IMPORTANT:

The starting point is the PUBLIC bridge.dk website and the member/club experience.

This is NOT only a technical documentation site.

The prototype should demonstrate how the following can become one coherent platform:

- public bridge.dk
- bridge clubs and club websites
- member login
- tournament and event registration
- online BridgeCentral / BC3
- results
- handicap and masterpoints
- Bridgebutikken
- technical BC3/BridgeOrg documentation

All visible UI must be in Danish.

Use DEMO DATA only.

==================================================
VISUAL IDENTITY
==================================================

Use the current Bridgefestival.dk visual identity as the main design inspiration.

The new bridge.dk, club pages, registration system, online BC3 and Bridgebutikken should feel like parts of the same family.

Use a modern, welcoming bridge identity with:

- strong typography
- clear navigation
- large images where relevant
- cards for content and events
- clear calls to action
- clean tables for tournament and administrative information

Do NOT copy Bridgefestival.dk pixel-for-pixel.

Create a reusable design system inspired by it.

IMPORTANT:

The existing iBridge / DBF booking demo is also a useful visual and functional reference for the registration flow.

Keep the registration experience visually consistent with the rest of bridge.dk.

==================================================
MAIN NAVIGATION
==================================================

Create this main public navigation:

Forside
Klubber
Turneringer & tilmelding
BC3
Resultater
Bridgebutikken
Om DBF

And a prominent:

LOG IND

button.

==================================================
1. FORSIDE
==================================================

Use the CURRENT bridge.dk as inspiration for the type of content DBF needs, but redesign it completely using the Bridgefestival-inspired visual identity.

Create sections such as:

- Aktuelt fra Danmarks Bridgeforbund
- Find en bridgeklub
- Kommende turneringer og events
- Dansk Bridgefestival
- Seneste resultater
- BridgeCentral / BC3
- Dansk Bridge
- Guld-, sølv- og åbne turneringer
- Lær at spille bridge
- Inspiration til klubber
- Bridgebutikken
- Nyheder

The new homepage should give both:

- existing bridge members
- new potential players

a clear entry into the Danish bridge community.

==================================================
2. KLUBBER
==================================================

Create a main navigation item:

"Klubber"

Use the concepts from the current DBF pages:

"Klubber i Danmark"
and
"Distrikter og kredse"

Create:

- searchable club directory
- map placeholder
- geographical filtering
- district filtering
- list of districts
- district pages
- information about the four kredse

The architecture must support all Danish bridge clubs.

Example demo clubs:

2275 – Rødovre Bridgeklub
4470 – Kolding Bridge Center
9999 – Kursusklub 9999

Clicking a club opens:

bridge.dk/2275
bridge.dk/4470
bridge.dk/9999

==================================================
3. CLUB WEBSITE
==================================================

Each club has its own public website within bridge.dk.

Example:

bridge.dk/2275

Use the same standard visual identity as bridge.dk.

Typical club navigation:

Forside
Klubben
Spilletider
Turneringer
Tilmelding
Resultater
Nyheder
Kontakt

The club page should include:

- club name
- logo
- address
- playing times
- club description
- news
- coming events
- tournament calendar
- results
- contact information

Some clubs have a simple structure.

Example:

2275 – Rødovre Bridgeklub

Other clubs can contain several subclubs / playing groups.

Example:

4470 – Kolding Bridge Center

Show the underlying clubs/playing groups clearly when relevant.

Do NOT show unnecessary hierarchy for simple clubs.

==================================================
4. CLUB DESIGN FLEXIBILITY
==================================================

Bridge.dk provides a standard Bridgefestival-inspired club template.

However, clubs must later be able to customize their website.

Prepare the architecture for:

- custom logo
- custom colors
- custom images
- typography
- content
- page structure

Some clubs may use the standard bridge.dk identity.

Others may retain a much stronger individual identity.

Do not implement multiple CMS technologies now.

Only demonstrate that club content and appearance are configurable.

==================================================
5. LOGIN
==================================================

Create a login dialog containing:

Medlemsnummer / e-mail
Adgangskode

and:

Vælg klub

LOGIN LOGIC:

If a member logs in from their own club page, enter that club context.

Example:

bridge.dk/2275
→ login
→ club 2275

If a member logs in from bridge.dk without club context:
→ use their primary club.

If a member logs in while visiting another club to which they do not belong:
→ normally enter their primary club.

If the member belongs to or administers several clubs:
→ allow the member to select an authorized club in the login dialog.

==================================================
6. MEMBER AREA
==================================================

After login preserve the same visual identity.

Member menu:

Min klub
Mine turneringer
Tilmeldinger
Mine resultater
Mit handicap
Mesterpoint
Min profil

Create realistic demo tournament histories.

One demo member in Rødovre should primarily demonstrate:

- holdturnering
- division
- some pair tournaments
- handicap history

A second anonymized demo member in Kolding should primarily demonstrate:

- pair tournaments
- handicap history

Real screenshots and data will be supplied later.

==================================================
7. TURNERINGER & TILMELDING
==================================================

Create a major public section:

"Turneringer & tilmelding"

This must support BOTH:

A. DBF events and tournaments

and

B. individual club tournaments/events.

The registration platform should be inspired functionally and visually by the existing DBF booking demo shown on iBridge.dk.

Use this registration flow:

Begivenheder
→ Begivenhed
→ Tilmelding
→ Hold / par / individuel information
→ Deltagere
→ Bekræftelse
→ Betaling when relevant

Support:

- individuel tilmelding
- partilmelding
- holdtilmelding
- kurser
- events
- Bridgefestival activities
- club tournaments

Each event must have an organizer.

Examples:

Arrangør:
Danmarks Bridgeforbund

or:

Arrangør:
Rødovre Bridgeklub

or:

Arrangør:
Kolding Bridge Center

Create filters:

Alle
DBF
Min klub
Parturnering
Holdturnering
Kurser
Events
Bridgefestival

A logged-in member should be able to see:

Mine tilmeldinger

Do NOT implement real payment yet.

==================================================
8. BC3 AS MAIN MENU ITEM
==================================================

Create a top-level main menu item:

"BC3"

BC3 should have TWO purposes:

A. information/support about BridgeCentral

B. entry into the future online club administration system

Public BC3 landing page:

BridgeCentral / BC3

Explain that BC3 is the existing DBF system for:

- medlemsadministration
- klubadministration
- turneringsadministration
- resultater
- handicap
- mesterpoint

Create sections such as:

Om BridgeCentral
Kom godt i gang
Bridgemate
Turneringsadministration
Support
Dokumentation
Teknisk dokumentation

The existing DBF BC3 information should be used as content inspiration.

==================================================
9. ONLINE BC3
==================================================

When an authorized club member/admin is logged in, show:

"Åbn Online BC3"

Online BC3 should use the SAME modern bridge.dk identity.

Do NOT reproduce the old Windows visual style.

Initial online BC3 menu:

Dashboard
Spillere
Klubturneringer
Tilmeldinger
Startlister
Turneringsafvikling
Resultater
Handicap
Mesterpoint
Klubadministration

Do not implement all functionality yet.

These screens will later be recreated using screenshots from the real BC3 application.

==================================================
10. DBF EMPLOYEE CONTEXT
==================================================

Authorized DBF employees default to:

5000 – Danmarks Bridgeforbund

This represents the central DBF administration environment.

DBF dashboard:

Klubber
Medlemmer
Turneringer
Tilmeldinger
Resultater
Handicap
Mesterpoint
Distrikter
Systemadministration

==================================================
11. BC3 TECHNICAL DOCUMENTATION
==================================================

Inside the BC3 section create:

"Teknisk dokumentation"

This is NOT the primary experience for normal members.

Create subpages:

Systemoversigt
BC3 database
BridgeOrg database
ER-diagrammer
Bridgemate
Resultatflow
Handicap
Mesterpoint
Services
Wiki BC3

==================================================
12. ER DIAGRAMS
==================================================

Already include preliminary ER diagram pages.

BC3 preliminary model:

MAINTOURNAMENT
→ GROUPTOURNAMENT
→ SECTION
→ ROUND
→ ROUNDMATCH
→ RESULT

Also show associated tables:

SECTION
→ SECTIONTEAM
→ SECTIONPLAYER

SECTION
→ BOARDSPEC
→ BOARD

Other known BC3 tables include:

MEM_MEMBER
MEM_CLUB
MASTERPOINTS

BridgeOrg known tables include:

BRIDGEKLUBBER
MEDLEMMER
MEDLEMSKABER
HACTURNERINGER
HACPOSTERINGER
BORDAFGIFTER

Clearly mark the diagrams:

"FORELØBIG MODEL – relationer og felter verificeres løbende"

Do NOT invent undocumented fields or foreign keys.

==================================================
13. DEVELOPER MODE
==================================================

Create a toggle available to authorized technical users:

"Udviklertilstand"

Normal members do NOT see this.

When enabled, screens can display technical mapping information.

Example:

UI:
Startliste

System:
BC3

Database:
xxxx.fdb

Table:
SECTIONPLAYER

Field:
Ikke dokumenteret endnu

Status:
SKAL VERIFICERES

Another example:

UI:
Spiller

Possible table:
MEM_MEMBER

The goal is to document the CURRENT BC3 database while designing the future online interface.

Later we will supply real BC3 screenshots and map individual:

screens
fields
buttons
tables
database fields

to the new UI.

==================================================
14. BRIDGEBUTIKKEN
==================================================

Create Bridgebutikken as a full part of bridge.dk.

Use the same identity.

Demo categories:

Spillekort
Bridgeborde
Bridgemate / udstyr
Bøger
Undervisningsmateriale
Gaver

Create a modern shop front.

No real commerce backend is required yet.

==================================================
15. RESULTS
==================================================

Create a main public section:

"Resultater"

Later it will combine results currently spread across several DBF systems.

Create initial demo filters:

Klub
Dato
Turneringstype
DBF-turnering
Distrikt
Spiller

From a member profile it should also be possible to reach:

Mine resultater
Mit handicap
Mesterpoint

==================================================
16. FIRST BUILD PRIORITY
==================================================

For THIS FIRST BUILD prioritize:

1. bridge.dk homepage
2. overall Bridgefestival-inspired design
3. main navigation
4. Klubber directory
5. sample club page
6. Turneringer & tilmelding
7. BC3 public landing page
8. initial Online BC3 dashboard
9. technical documentation navigation
10. preliminary ER diagrams
11. Bridgebutikken
12. login dialog

Do NOT attempt to implement every BC3 feature.

Do NOT connect real databases.

Do NOT implement scoring.

Do NOT implement real authentication.

Do NOT implement payment.

Do NOT invent technical database fields.

The main objective is to show how the PUBLIC bridge.dk website, club websites, tournament registration, member login, Online BC3 and technical documentation can become ONE coherent platform.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bridge-danmark-platform.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/feda8963-18db-4631-b239-4f03e180b291).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
