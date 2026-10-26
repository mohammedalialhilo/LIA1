import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Bits";
import { bc3Brugervejledning, tilmeldingerStartlisteTrin } from "@/lib/bc3-guide";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/bc3/brugervejledning/tilmeldinger-og-startliste")({
  head: () => ({
    meta: [
      { title: "Tilmeldinger og startliste – BC3 Brugervejledning – bridge.dk" },
      {
        name: "description",
        content:
          "Begynderguide til tilmelding af spillere og opbygning af startlisten i BridgeCentral 3: deltagerliste, startliste, BridgeMate.",
      },
      { property: "og:title", content: "Tilmeldinger og startliste – BC3 Brugervejledning" },
      {
        property: "og:description",
        content:
          "Trin-for-trin hjælp til tilmelding af spillere og overførsel til startlisten i BridgeCentral 3.",
      },
    ],
  }),
  component: TilmeldingerStartlisteGuide,
});

function TilmeldingerStartlisteGuide() {
  return (
    <>
      <PageHero
        label="BC3 Brugervejledning"
        titel="Tilmeldinger og startliste"
        beskrivelse="Når turneringen og turneringsdata er oprettet, skal spillerne tilmeldes og placeres på startlisten."
      />

      <Section titel="Vigtig forskel">
        <div className="rounded-xl border border-gold/50 bg-gold/10 p-5 text-sm">
          <p className="font-semibold text-gold-foreground">
            Vigtigt: Deltagerliste og startliste er ikke det samme.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-gold-foreground/90">
            <li>
              <strong>Deltagerlisten</strong> indeholder de spillere eller par, der er tilmeldt
              turneringen.
            </li>
            <li>
              <strong>Startlisten</strong> bestemmer den endelige placering og de numre, der bruges,
              når turneringen afvikles.
            </li>
          </ul>
        </div>
      </Section>

      <Section titel="Trin-for-trin">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tilmeldingerStartlisteTrin.map((trin, i) => (
            <Card key={i} className="flex flex-col">
              <CardContent className="flex flex-col p-6">
                <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  Trin {i + 1}
                </p>
                <h3 className="mb-2 text-lg font-bold">{trin.overskrift}</h3>
                <p className="text-sm text-muted-foreground">{trin.tekst}</p>

                {trin.valgmuligheder && (
                  <div className="mt-4 grid gap-3">
                    {trin.valgmuligheder.map((valg) => (
                      <div
                        key={valg.overskrift}
                        className="rounded-lg border border-border bg-muted/40 p-3"
                      >
                        <p className="text-sm font-semibold">{valg.overskrift}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{valg.tekst}</p>
                      </div>
                    ))}
                  </div>
                )}

                {trin.bemærkning && (
                  <p className="mt-4 text-sm italic text-muted-foreground">{trin.bemærkning}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-muted/50 p-5 text-sm text-muted-foreground">
          Dette er begyndelsen på den nye BC3-brugervejledning. Flere vejledninger og
          skærmbilleder tilføjes løbende.
        </div>
      </Section>

      <Section titel="Næste vejledning">
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-accent">
                Kommer snart
              </p>
              <h3 className="mt-1 text-lg font-bold">BridgeMate</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Her gennemgår vi senere, hvordan BridgeMate startes, hvordan turneringen sendes til
                bordene, og hvordan resultaterne hentes tilbage til BC3.
              </p>
            </div>
            <ArrowRight className="size-6 shrink-0 text-accent/70" />
          </div>
        </div>
      </Section>

      <section className="pb-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Button asChild variant="outline">
            <Link to="/bc3">
              <ArrowLeft className="mr-2 size-4" />
              Tilbage til BC3
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
