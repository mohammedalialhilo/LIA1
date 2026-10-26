import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Bits";
import { bc3Brugervejledning, opretTurneringTrin } from "@/lib/bc3-guide";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/bc3/brugervejledning/opret-turnering")({
  head: () => ({
    meta: [
      { title: "Opret turnering – BC3 Brugervejledning – bridge.dk" },
      {
        name: "description",
        content:
          "Begynderguide til oprettelse af en klubturnering i BridgeCentral 3: planlægning, rækker, sektioner, dato og BridgeMate-indstillinger.",
      },
      { property: "og:title", content: "Opret turnering – BC3 Brugervejledning" },
      {
        property: "og:description",
        content:
          "Trin-for-trin hjælp til at oprette en planlagt klubturnering i BridgeCentral 3.",
      },
    ],
  }),
  component: OpretTurneringGuide,
});

function OpretTurneringGuide() {
  return (
    <>
      <PageHero
        label="BC3 Brugervejledning"
        titel="Opret en klubturnering"
        beskrivelse="En klubturnering oprettes først som en planlagt turnering. Derefter angives de detaljerede turneringsdata."
      />

      <Section titel="Trin-for-trin">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {opretTurneringTrin.map((trin, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  Trin {i + 1}
                </p>
                <p className="text-sm text-muted-foreground">{trin}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-muted/50 p-5 text-sm text-muted-foreground">
          Dette er begyndelsen på den nye BC3-brugervejledning. Flere vejledninger og
          skærmbilleder tilføjes løbende.
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
