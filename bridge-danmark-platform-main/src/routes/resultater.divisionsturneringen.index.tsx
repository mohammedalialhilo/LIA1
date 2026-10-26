import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Bits";
import { Badge } from "@/components/ui/badge";
import { Crumbs } from "@/components/results/ResultBits";
import { divisioner, tournaments } from "@/lib/results-data";

export const Route = createFileRoute("/resultater/divisionsturneringen/")({
  head: () => ({
    meta: [
      { title: "Divisionsturneringen 2026/2027 – Resultater – bridge.dk" },
      { name: "description", content: "Stilling og kampe i Divisionsturneringen 2026/2027: 1. division, 2. division, 3. division øst og vest." },
      { property: "og:title", content: "Divisionsturneringen 2026/2027" },
      { property: "og:description", content: "Følg divisionerne i dansk bridge – stilling, kampe og hold." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DivisionsOversigt,
});

function DivisionsOversigt() {
  const t = tournaments[0]!;
  return (
    <>
      <PageHero label={`Sæson ${t.season}`} titel={`${t.navn} ${t.season}`} beskrivelse="Vælg en division for at se stilling, kampe og hold.">
        <Crumbs items={[{ label: "Resultater", to: "/resultater" }, { label: t.navn }]} />
      </PageHero>
      <Section titel="Divisioner">
        <div className="grid gap-4 sm:grid-cols-2">
          {divisioner.map((d) => {
            const body = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold">{d.navn}</h3>
                  <Badge variant="secondary">{d.status}</Badge>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div><dt className="text-muted-foreground">Sæson</dt><dd className="font-semibold">{t.season}</dd></div>
                  <div><dt className="text-muted-foreground">Seneste</dt><dd className="font-semibold">{d.senesteDato}</dd></div>
                  <div><dt className="text-muted-foreground">Hold</dt><dd className="font-semibold">{d.antalHold}</dd></div>
                </dl>
                <p className="mt-4 text-sm font-semibold text-primary">
                  {d.aktiv ? "Se stilling og kampe →" : "Kommer senere i prototypen"}
                </p>
              </>
            );
            return d.aktiv ? (
              <Link key={d.divisionId} to="/resultater/divisionsturneringen/$division" params={{ division: d.slug }}
                className="rounded-xl border border-border bg-card p-5 card-shadow transition hover:border-accent">
                {body}
              </Link>
            ) : (
              <div key={d.divisionId} className="rounded-xl border border-dashed border-border bg-card/60 p-5 opacity-80">{body}</div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
