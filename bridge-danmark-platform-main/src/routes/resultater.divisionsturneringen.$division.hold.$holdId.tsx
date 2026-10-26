import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Bits";
import { Crumbs, MatchCard } from "@/components/results/ResultBits";
import { findDivision, findHold, kampe } from "@/lib/results-data";

export const Route = createFileRoute("/resultater/divisionsturneringen/$division/hold/$holdId")({
  loader: ({ params }) => {
    const division = findDivision(params.division);
    const team = findHold(params.holdId);
    if (!division || !team) throw notFound();
    return { division, team };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `Hold ${loaderData.team.navn}` : "Hold ikke fundet";
    return {
      meta: [
        { title: `${t} – Divisionsturneringen – bridge.dk` },
        { name: "description", content: `${t}: placering, kampe, VP og spillere i divisionsturneringen.` },
        { property: "og:title", content: t },
        { property: "og:description", content: "Placering, kampe, VP og spillere." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: HoldSide,
});

function HoldSide() {
  const { division, team } = Route.useLoaderData();
  const holdKampe = kampe.filter((k) => !k.placeholder).filter((k) => k.hjemmeId === team.teamId || k.udeId === team.teamId).sort((a, b) => b.round - a.round);

  return (
    <>
      <PageHero label={division.navn} titel={team.navn}>
        <Crumbs items={[
          { label: "Resultater", to: "/resultater" },
          { label: "Divisionsturneringen", to: "/resultater/divisionsturneringen" },
          { label: division.navn, to: "/resultater/divisionsturneringen/$division", params: { division: division.slug } },
          { label: team.navn },
        ]} />
      </PageHero>
      <Section titel="Holdet">
        <div className="grid gap-3 sm:grid-cols-3">
          {[["Placering", "Afventer komplette stillingsdata"], ["Kampe", "Afventer komplette kampdata"], ["Samlet VP", "Afventer komplette stillingsdata"]].map(([l, v]) => (
            <div key={l} className="rounded-xl border border-dashed border-border bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">{l}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
        <h3 className="mb-3 mt-8 text-xl font-bold">Spillere</h3>
        {team.spillere.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
            Spilleropstilling kommer, når turneringsdata tilkobles.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {team.spillere.map((p) => (
              <li key={p.playerId} className="rounded-lg border border-border bg-card px-4 py-2 text-sm">{p.navn}{p.dbfNr ? <span className="ml-2 text-muted-foreground">DBF-nr. {p.dbfNr}</span> : null}</li>
            ))}
          </ul>
        )}
        <h3 className="mb-3 mt-8 text-xl font-bold">Seneste resultater</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {holdKampe.map((k) => <MatchCard key={k.matchId} kamp={k} division={division.slug} />)}
        </div>
      </Section>
    </>
  );
}
