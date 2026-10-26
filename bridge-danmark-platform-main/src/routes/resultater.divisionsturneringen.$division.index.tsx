import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Bits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crumbs, MatchCard, PlaceholderMark, scrollTabsList, TeamLink } from "@/components/results/ResultBits";
import { findDivision, findHold, fmtVp, fremhaevetHoldId, hold, kampe, runder } from "@/lib/results-data";
import { cn } from "@/lib/utils";

const FREMHAEVET = fremhaevetHoldId;

export const Route = createFileRoute("/resultater/divisionsturneringen/$division/")({
  loader: ({ params }) => {
    const division = findDivision(params.division);
    if (!division || !division.aktiv) throw notFound();
    return { division };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `Divisionsturneringen 2026/2027 – ${loaderData.division.navn}` : "Division ikke fundet";
    return {
      meta: [
        { title: `${t} – bridge.dk` },
        { name: "description", content: "Stilling, kampe, hold og multihold i divisionsturneringen." },
        { property: "og:title", content: t },
        { property: "og:description", content: "Stilling, kampe, hold og multihold i divisionsturneringen." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: DivisionSide,
});

function DivisionSide() {
  const { division } = Route.useLoaderData();
  const holdListe = [...hold.filter((h) => h.divisionId === division.divisionId)].sort((x, y) => x.navn.localeCompare(y.navn, "da"));
  const ds = division.slug;

  return (
    <>
      <PageHero label="Divisionsturneringen" titel={`Divisionsturneringen 2026/2027 – ${division.navn}`}>
        <Crumbs items={[{ label: "Resultater", to: "/resultater" }, { label: "Divisionsturneringen", to: "/resultater/divisionsturneringen" }, { label: division.navn }]} />
      </PageHero>
      <Section titel={division.navn}>
        <p className="mb-4 text-sm text-muted-foreground">
          Divisionsturneringen 2026/2027 · <span className="font-semibold text-foreground">{division.navn}</span>
        </p>
        <Tabs defaultValue="kampe">
          <TabsList className={scrollTabsList}>
            <TabsTrigger value="stilling">Stilling</TabsTrigger>
            <TabsTrigger value="kampe">Kampe</TabsTrigger>
            <TabsTrigger value="hold">Hold</TabsTrigger>
            <TabsTrigger value="multihold">Multihold</TabsTrigger>
          </TabsList>

          <TabsContent value="kampe" className="mt-6">
            <Tabs defaultValue="2">
              <TabsList className={scrollTabsList}>
                {runder.map((r) => <TabsTrigger key={r.round} value={String(r.round)}>Kamp {r.round}</TabsTrigger>)}
              </TabsList>
              {runder.map((r) => {
                const liste = kampe.filter((k) => k.round === r.round && k.divisionId === division.divisionId);
                return (
                  <TabsContent key={r.round} value={String(r.round)} className="mt-5">
                    <p className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Kamp {r.round}</span> · {r.dato} · {r.tid}
                      {r.placeholder && <PlaceholderMark />}
                    </p>
                    {liste.length ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {liste.map((k) => <MatchCard key={k.matchId} kamp={k} division={ds} />)}
                      </div>
                    ) : (
                      <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">Kampen er endnu ikke spillet.</p>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>

          <TabsContent value="stilling" className="mt-6">
            <p className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <PlaceholderMark /> Foreløbig prototype – fuld stilling tilkobles senere. Placering, kampe og VP vises, når komplette stillingsdata foreligger.
            </p>
            <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
              <table className="w-full text-sm">
                <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                  <tr><th className="px-4 py-3">Placering</th><th className="px-4 py-3">Hold</th><th className="hidden px-4 py-3 text-right sm:table-cell">Kampe</th><th className="px-4 py-3 text-right">VP</th></tr>
                </thead>
                <tbody>
                  {holdListe.map((h) => (
                    <tr key={h.teamId} className={cn("border-t border-border/70", h.teamId === FREMHAEVET && "bg-accent/10 font-semibold")}>
                      <td className="px-4 py-3 text-muted-foreground">–</td>
                      <td className="px-4 py-3"><TeamLink id={h.teamId} division={ds} /></td>
                      <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">–</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">–</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="hold" className="mt-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {hold.filter((h) => h.divisionId === division.divisionId).map((h) => (
                <Link key={h.teamId} to="/resultater/divisionsturneringen/$division/hold/$holdId" params={{ division: ds, holdId: h.teamId }}
                  className={cn("rounded-xl border border-border bg-card p-4 font-semibold card-shadow hover:border-accent", h.teamId === FREMHAEVET && "border-accent")}>
                  {h.navn}
                  <span className="mt-1 block text-sm font-normal text-muted-foreground">{h.teamNumber ? `Hold nr. ${h.teamNumber}` : "Holdnummer kommer senere"}</span>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="multihold" className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"><PlaceholderMark /> Prototype – svarer til multihold-visningerne i det gamle resultatsystem.</div>
            <Tabs defaultValue="bord">
              <TabsList className={scrollTabsList}>
                <TabsTrigger value="bord">Bordresultater</TabsTrigger>
                <TabsTrigger value="res">Resultater</TabsTrigger>
                <TabsTrigger value="stil">Stilling</TabsTrigger>
              </TabsList>
              <TabsContent value="bord" className="mt-4 grid gap-3 md:grid-cols-2">
                {kampe.filter((k) => k.round === 2).map((k, i) => (
                  <div key={k.matchId} className="rounded-xl border border-border bg-card p-4 text-sm card-shadow">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Bord {i + 1}</p>
                    <p className="break-words">{findHold(k.hjemmeId)?.navn} – {findHold(k.udeId)?.navn}</p>
                    <p className="mt-1 font-mono font-semibold">{k.imp[0]} – {k.imp[1]} IMP</p>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="res" className="mt-4 grid gap-2">
                {kampe.filter((k) => k.round === 2).flatMap((k) => [[k.hjemmeId, k.vp[0]], [k.udeId, k.vp[1]]] as const)
                  .sort((a, b) => b[1] - a[1]).map(([id, vp]) => (
                    <div key={id} className="flex justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2 text-sm">
                      <span className="break-words">{findHold(id)?.navn}</span><span className="font-mono font-semibold">{fmtVp(vp)} VP</span>
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="stil" className="mt-4 grid gap-2">
                <p className="rounded-xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">Data kommer senere – multiholdstillingen tilkobles fra turneringsdata.</p>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </Section>
    </>
  );
}
