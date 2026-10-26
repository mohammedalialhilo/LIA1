import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DevInfo, PointBadge, Section } from "@/components/site/Bits";
import { RegelBoks } from "@/components/site/Regler";
import { findBegivenhed } from "@/lib/demo-data";
import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";

export const Route = createFileRoute("/turneringer/$eventId/")({
  loader: ({ params }) => {
    const begivenhed = findBegivenhed(params.eventId);
    if (!begivenhed) throw notFound();
    return { begivenhed };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Begivenhed ikke fundet – bridge.dk" },
        ],
      };
    }
    const b = loaderData.begivenhed;
    const t = `${b.titel} – bridge.dk`;
    const d = `${b.dato} · ${b.sted}. Arrangør: ${b.arrangoer}. ${b.tilmeldingsform === "hold" ? "Holdtilmelding" : b.tilmeldingsform === "par" ? "Partilmelding" : "Individuel tilmelding"}.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: BegivenhedSide,
});

function BegivenhedSide() {
  const { begivenhed: b } = Route.useLoaderData();

  return (
    <>
      <div className="hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <Link
            to="/turneringer"
            className="mb-6 inline-flex items-center gap-2 text-sm text-primary-foreground/75 hover:text-primary-foreground"
          >
            <ArrowLeft className="size-4" /> Alle begivenheder
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{b.type}</Badge>
                <PointBadge point={b.point} />
                <Badge variant="outline" className="border-primary-foreground/40 text-primary-foreground">
                  {b.arrangoerType === "DBF" ? "Danmarks Bridgeforbund" : "Klubarrangement"}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold sm:text-4xl">{b.titel}</h1>
              <p className="mt-4 text-primary-foreground/85">{b.beskrivelse}</p>
              <div className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-accent" /> {b.dato}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="size-4 text-accent" /> {b.tid}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-accent" /> {b.sted}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="size-4 text-accent" /> {b.tilmeldte} af {b.pladser} pladser optaget
                </p>
              </div>
            </div>

            <Card className="w-full max-w-sm">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Arrangør</p>
                <p className="font-display text-lg font-bold">{b.arrangoer}</p>
                <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tilmeldingsform</dt>
                    <dd className="font-semibold capitalize">{b.tilmeldingsform}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pris</dt>
                    <dd className="font-semibold">{b.pris}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Frist</dt>
                    <dd className="font-semibold">{b.tilmeldingsfrist}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Betaling</dt>
                    <dd className="font-semibold">{b.betaling ? "Ja, ved tilmelding" : "Ingen"}</dd>
                  </div>
                </dl>
                <Button asChild variant="accent" size="lg" className="mt-5 w-full">
                  <Link to="/turneringer/$eventId/tilmelding" params={{ eventId: b.id }}>
                    <Ticket /> Tilmeld dig
                  </Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Demoflow — der gennemføres ingen betaling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Section titel="Program" beskrivelse="Foreløbigt program for begivenheden.">
        <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
          <table className="w-full text-sm">
            <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Tidspunkt</th>
                <th className="px-4 py-3">Punkt</th>
              </tr>
            </thead>
            <tbody>
              {b.program.map((p) => (
                <tr key={p.tid + p.punkt} className="border-t border-border/70">
                  <td className="whitespace-nowrap px-4 py-3 font-mono">{p.tid}</td>
                  <td className="px-4 py-3">{p.punkt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <RegelBoks emne="afvikling" titel="Regler for afvikling" />
          <RegelBoks emne="systemkort" titel="Systemkort og makkeraftaler" />
        </div>

        <DevInfo
          titel="Begivenhed"
          felter={[
            { ui: "Begivenhed", system: "BC3", database: "xxxx.fdb", tabel: "MAINTOURNAMENT" },
            { ui: "Sektion", system: "BC3", database: "xxxx.fdb", tabel: "SECTION" },
            { ui: "Runde", system: "BC3", database: "xxxx.fdb", tabel: "ROUND" },
          ]}
        />
      </Section>
    </>
  );
}
