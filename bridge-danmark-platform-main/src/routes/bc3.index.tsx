import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero, Section } from "@/components/site/Bits";
import { erKlubAdmin, useSession } from "@/lib/session";
import { dokNav } from "@/lib/demo-data";
import { bc3Brugervejledning } from "@/lib/bc3-guide";
import {
  BookOpen,
  Headset,
  LayoutDashboard,
  ListChecks,
  MonitorCog,
  Tablet,
  Trophy,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/bc3/")({
  head: () => ({
    meta: [
      { title: "BridgeCentral / BC3 – bridge.dk" },
      {
        name: "description",
        content:
          "BC3 er DBF's system til medlems- og klubadministration, turneringer, resultater, handicap og mesterpoint. Find vejledninger, support og Online BC3.",
      },
      { property: "og:title", content: "BridgeCentral / BC3 – bridge.dk" },
      {
        property: "og:description",
        content: "Vejledninger, support, Bridgemate, turneringsadministration og teknisk dokumentation.",
      },
    ],
  }),
  component: Bc3,
});

const afsnit = [
  {
    ikon: BookOpen,
    titel: "Om BridgeCentral",
    tekst:
      "BridgeCentral (BC3) er forbundets system til klubbernes daglige administration. Klubben har sin egen database og bruger systemet til medlemmer, kontingent, turneringer og indberetning.",
  },
  {
    ikon: ListChecks,
    titel: "Kom godt i gang",
    tekst:
      "Installation, opdatering af klubbens database, oprettelse af sæson, medlemsliste og de første klubturneringer. Se også webinaret om sæsonopstart.",
  },
  {
    ikon: Tablet,
    titel: "Bridgemate",
    tekst:
      "Opsætning af Bridgemate-server og enheder, indlæsning af turnering, visning af resultater ved bordet og fejlfinding.",
  },
  {
    ikon: Trophy,
    titel: "Turneringsadministration",
    tekst:
      "Oprettelse af par-, hold- og individuelle turneringer, rækkeinddeling, startlister, afvikling og beregning.",
  },
  {
    ikon: Headset,
    titel: "Support",
    tekst:
      "Sekretariatet hjælper klubberne med BC3. Skriv til support (demo) eller ring i åbningstiden — husk klubnummer.",
  },
  {
    ikon: Wrench,
    titel: "Dokumentation",
    tekst:
      "Vejledninger, videoer og ofte stillede spørgsmål til klubbens administratorer og turneringsledere.",
  },
];

const faq = [
  {
    q: "Hvordan indberetter klubben resultater?",
    a: "Resultater indberettes fra BC3 efter afvikling. Det præcise flow beskrives i den tekniske dokumentation under Resultatflow.",
  },
  {
    q: "Hvor ligger klubbens data?",
    a: "Hver klub har sin egen database (xxxx.fdb, hvor xxxx er klubnummeret). Centrale stamdata ligger i BridgeOrg.",
  },
  {
    q: "Bliver BC3 online?",
    a: "Ja. Online BC3 er under udvikling og får samme udseende som resten af bridge.dk. Prototypen viser den kommende menu og dashboard.",
  },
];

function Bc3() {
  const { session } = useSession();
  const kanAdministrere = erKlubAdmin(session?.medlem);

  return (
    <>
      <PageHero
        label="BC3"
        titel="BridgeCentral / BC3"
        beskrivelse="BC3 er DBF's system til medlemsadministration, klubadministration, turneringsadministration, resultater, handicap og mesterpoint."
      >
        <div className="flex flex-wrap gap-3">
          {kanAdministrere ? (
            <Button asChild variant="hero" size="lg">
              <Link to="/bc3/online">
                <LayoutDashboard /> Åbn Online BC3
              </Link>
            </Button>
          ) : (
            <Button asChild variant="hero" size="lg">
              <Link to="/bc3/teknisk">Teknisk dokumentation</Link>
            </Button>
          )}
          <Button asChild variant="subtle" size="lg">
            <Link to="/bc3/teknisk">Dokumentation og datamodel</Link>
          </Button>
        </div>
        {!kanAdministrere && (
          <p className="mt-4 text-sm text-primary-foreground/70">
            Online BC3 åbnes af klubbens administratorer efter login.
          </p>
        )}
      </PageHero>

      <Section titel="BC3 dækker klubbens administration">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {afsnit.map((a) => (
            <Card key={a.titel}>
              <CardContent className="p-6">
                <a.ikon className="mb-3 size-6 text-accent" />
                <h3 className="text-xl font-bold">{a.titel}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.tekst}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <section className="bg-sand py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="section-label mb-2">Online BC3</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Klubadministration i browseren</h2>
            <p className="mt-3 text-muted-foreground">
              Online BC3 samler klubbens administration på bridge.dk med samme udtryk som resten af
              platformen. Den første demo fokuserer på klubber, underklubber og medlemmer.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="accent">
                <Link to="/bc3/online">
                  <MonitorCog /> Se Online BC3
                </Link>
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-bold">Teknisk dokumentation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Dokumentationen af den nuværende BC3- og BridgeOrg-datamodel. Ikke den primære
                oplevelse for almindelige medlemmer.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {dokNav.map((d) => (
                  <li key={d.slug}>
                    <Link
                      to="/bc3/teknisk/$side"
                      params={{ side: d.slug }}
                      className="block rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:border-accent hover:text-accent"
                    >
                      {d.titel}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Section
        titel="BC3 Brugervejledning"
        beskrivelse="Trin-for-trin hjælp til BridgeCentral 3 og BridgeMate"
      >
        <p className="mb-8 max-w-3xl text-muted-foreground">
          Her samler vi vejledninger til den daglige brug af BridgeCentral 3. Guiden bygges løbende
          ud og tager udgangspunkt i Danmarks Bridgeforbunds eksisterende BC3- og
          BridgeMate-materiale.
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bc3Brugervejledning.map((emne) =>
            emne.slug ? (
              <Link
                key={emne.titel}
                to={
                  emne.slug === "tilmeldinger-og-startliste"
                    ? "/bc3/brugervejledning/tilmeldinger-og-startliste"
                    : "/bc3/brugervejledning/opret-turnering"
                }
              >
                <Card className="h-full transition-shadow hover:lift-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold">{emne.titel}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{emne.tekst}</p>
                    <p className="mt-3 text-sm font-medium text-accent">Åbn vejledning &rarr;</p>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card key={emne.titel} className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-muted-foreground">{emne.titel}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{emne.tekst}</p>
                  <p className="mt-3 text-xs font-medium text-muted-foreground/70">
                    Kommer snart
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </Section>

      <Section titel="Ofte stillede spørgsmål">
        <Accordion type="single" collapsible className="max-w-3xl">
          {faq.map((f, i) => (
            <AccordionItem key={f.q} value={`i${i}`}>
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
