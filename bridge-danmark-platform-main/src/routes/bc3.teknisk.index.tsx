import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero, Preliminary, Section } from "@/components/site/Bits";
import { dokNav, FORELOEBIG } from "@/lib/demo-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/bc3/teknisk/")({
  head: () => ({
    meta: [
      { title: "Teknisk dokumentation – BC3 og BridgeOrg – bridge.dk" },
      {
        name: "description",
        content:
          "Dokumentation af den nuværende BC3- og BridgeOrg-datamodel: systemoversigt, databaser, ER-diagrammer, resultatflow, handicap og mesterpoint.",
      },
      { property: "og:title", content: "Teknisk dokumentation – BC3 og BridgeOrg" },
      {
        property: "og:description",
        content: "Foreløbig dokumentation af BC3- og BridgeOrg-datamodellen.",
      },
    ],
  }),
  component: TekniskOversigt,
});

function TekniskOversigt() {
  return (
    <>
      <PageHero
        label="BC3 · Teknisk dokumentation"
        titel="Teknisk dokumentation"
        beskrivelse="Dokumentationen beskriver de nuværende systemer og databaser, mens den nye online flade designes. Den er beregnet til udviklere og teknisk personale — ikke til almindelige medlemmer."
      />

      <Section titel="Emner">
        <div className="mb-8 max-w-3xl">
          <Preliminary tekst={FORELOEBIG} />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {dokNav.map((d) => (
            <Link key={d.slug} to="/bc3/teknisk/$side" params={{ side: d.slug }}>
              <Card className="h-full transition-shadow hover:lift-shadow">
                <CardContent className="flex items-center justify-between gap-3 p-6">
                  <h2 className="text-lg font-bold">{d.titel}</h2>
                  <ArrowRight className="size-4 text-accent" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
