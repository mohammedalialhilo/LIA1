import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Bits";
import { distrikter, kredse } from "@/lib/demo-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/klubber/distrikter")({
  head: () => ({
    meta: [
      { title: "Distrikter og kredse – bridge.dk" },
      {
        name: "description",
        content:
          "Danmarks Bridgeforbund er organiseret i distrikter samlet i fire kredse. Se distrikternes klubber, medlemstal og turneringer.",
      },
      { property: "og:title", content: "Distrikter og kredse – bridge.dk" },
      {
        property: "og:description",
        content: "Oversigt over distrikter og de fire kredse i Danmarks Bridgeforbund.",
      },
    ],
  }),
  component: Distrikter,
});

function Distrikter() {
  return (
    <>
      <PageHero
        label="Klubber"
        titel="Distrikter og kredse"
        beskrivelse="Klubberne er organiseret i distrikter, og distrikterne er samlet i fire kredse. Distrikter og kredse afvikler turneringer og er bindeled mellem klubberne og forbundet."
      />

      <Section titel="De fire kredse" beskrivelse="Kredsene koordinerer turneringer på tværs af distrikterne.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {kredse.map((k) => (
            <Card key={k.navn} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold">{k.navn}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{k.beskrivelse}</p>
                <ul className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
                  {k.distrikter.map((d) => (
                    <li key={d} className="font-medium">
                      {d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section titel="Distrikter" className="pt-0">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {distrikter.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-6">
                <p className="section-label mb-1">{d.kreds}</p>
                <h3 className="text-xl font-bold">{d.navn}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.beskrivelse}</p>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Klubber</dt>
                    <dd className="font-display font-bold">{d.klubber}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Medlemmer</dt>
                    <dd className="font-display font-bold">{d.medlemmer.toLocaleString("da-DK")}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Region</dt>
                    <dd className="font-semibold">{d.region}</dd>
                  </div>
                </dl>
                <Button asChild variant="link" className="mt-3 px-0">
                  <Link to="/klubber/distrikt/$id" params={{ id: d.id }}>
                    Gå til distriktet <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
