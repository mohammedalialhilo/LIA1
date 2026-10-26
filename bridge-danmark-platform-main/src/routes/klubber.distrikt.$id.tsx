import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero, Section } from "@/components/site/Bits";
import { begivenheder, distrikter, klubKatalog, resultater } from "@/lib/demo-data";

export const Route = createFileRoute("/klubber/distrikt/$id")({
  loader: ({ params }) => {
    const distrikt = distrikter.find((d) => d.id === params.id);
    if (!distrikt) throw notFound();
    return { distrikt };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Distrikt ikke fundet – bridge.dk" }],
      };
    }
    const t = `${loaderData.distrikt.navn} – bridge.dk`;
    const d = `${loaderData.distrikt.navn} i ${loaderData.distrikt.kreds}: klubber, medlemstal og distriktsturneringer.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: DistriktSide,
});

function DistriktSide() {
  const { distrikt } = Route.useLoaderData();
  const klubber = klubKatalog.filter((k) => k.distrikt === distrikt.navn);
  const distriktResultater = resultater.filter((r) => r.distrikt === distrikt.navn);
  const distriktEvents = begivenheder.filter((b) =>
    klubber.some((k) => k.nr === b.klubNr),
  );

  return (
    <>
      <PageHero label={distrikt.kreds} titel={distrikt.navn} beskrivelse={distrikt.beskrivelse}>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-primary-foreground/70">Klubber</p>
            <p className="font-display text-2xl font-bold">{distrikt.klubber}</p>
          </div>
          <div>
            <p className="text-primary-foreground/70">Medlemmer</p>
            <p className="font-display text-2xl font-bold">
              {distrikt.medlemmer.toLocaleString("da-DK")}
            </p>
          </div>
          <div>
            <p className="text-primary-foreground/70">Formand</p>
            <p className="font-display text-2xl font-bold">{distrikt.formand}</p>
          </div>
        </div>
      </PageHero>

      <Section titel="Klubber i distriktet">
        <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
          <table className="w-full text-sm">
            <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Nr.</th>
                <th className="px-4 py-3">Klub</th>
                <th className="px-4 py-3">By</th>
                <th className="px-4 py-3 text-right">Medlemmer</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {klubber.map((k) => (
                <tr key={k.nr} className="border-t border-border/70">
                  <td className="px-4 py-3 font-mono">{k.nr}</td>
                  <td className="px-4 py-3 font-semibold">{k.navn}</td>
                  <td className="px-4 py-3">{k.by}</td>
                  <td className="px-4 py-3 text-right">{k.medlemmer}</td>
                  <td className="px-4 py-3 text-right">
                    {k.harSide ? (
                      <Button asChild size="sm" variant="outline">
                        <Link to="/$klubId" params={{ klubId: k.nr }}>
                          Klubbens side
                        </Link>
                      </Button>
                    ) : (
                      <Badge variant="secondary">Side klar til opsætning</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section titel="Turneringer og resultater i distriktet" className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-bold">Kommende begivenheder</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {distriktEvents.length ? (
                  distriktEvents.map((b) => (
                    <li key={b.id} className="rounded-lg border border-border p-4">
                      <Link
                        to="/turneringer/$eventId"
                        params={{ eventId: b.id }}
                        className="font-semibold hover:text-accent"
                      >
                        {b.titel}
                      </Link>
                      <p className="text-muted-foreground">
                        {b.dato} · {b.arrangoer}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">Ingen demobegivenheder i dette distrikt.</li>
                )}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-bold">Seneste resultater</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {distriktResultater.length ? (
                  distriktResultater.map((r) => (
                    <li key={r.id} className="rounded-lg border border-border p-4">
                      <p className="font-semibold">{r.turnering}</p>
                      <p className="text-muted-foreground">
                        {r.dato} · {r.vinder} · {r.score}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">Ingen demoresultater i dette distrikt.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}
