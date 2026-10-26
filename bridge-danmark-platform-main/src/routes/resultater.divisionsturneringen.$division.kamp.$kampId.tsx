import { createFileRoute, notFound } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageHero } from "@/components/site/Bits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crumbs, PlaceholderMark, scrollTabsList, TeamLink } from "@/components/results/ResultBits";
import { findDivision, findHold, findKamp, findRunde, fmtVp } from "@/lib/results-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resultater/divisionsturneringen/$division/kamp/$kampId")({
  loader: ({ params }) => {
    const division = findDivision(params.division);
    const kamp = findKamp(params.kampId);
    if (!division || !kamp) throw notFound();
    return { division, kamp, runde: findRunde(kamp.round) };
  },
  head: ({ loaderData }) => {
    const t = loaderData
      ? `${findHold(loaderData.kamp.hjemmeId)?.navn} – ${findHold(loaderData.kamp.udeId)?.navn}`
      : "Kamp ikke fundet";
    return {
      meta: [
        { title: `${t} – Resultater – bridge.dk` },
        { name: "description", content: `Kampdetaljer fra divisionsturneringen: ${t}.` },
        { property: "og:title", content: t },
        { property: "og:description", content: "IMP, VP, spillere og spil fra kampen." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: KampSide,
});

function Tom({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">{children}</p>;
}

function KampSide() {
  const { division, kamp, runde } = Route.useLoaderData();
  const h = findHold(kamp.hjemmeId)!;
  const u = findHold(kamp.udeId)!;
  const ds = division.slug;
  const sider = [
    { t: h, imp: kamp.imp[0], vp: kamp.vp[0], vinder: kamp.vp[0] > kamp.vp[1] },
    { t: u, imp: kamp.imp[1], vp: kamp.vp[1], vinder: kamp.vp[1] > kamp.vp[0] },
  ];
  const vinder = sider.find((x) => x.vinder);

  return (
    <>
      <PageHero label={`${division.navn} · Kamp ${kamp.round}`} titel={`${h.navn} – ${u.navn}`}>
        <Crumbs items={[
          { label: "Resultater", to: "/resultater" },
          { label: "Divisionsturneringen", to: "/resultater/divisionsturneringen" },
          { label: division.navn, to: "/resultater/divisionsturneringen/$division", params: { division: ds } },
          { label: `Kamp ${kamp.round}` },
        ]} />
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {kamp.placeholder && <p className="mb-4 text-sm"><PlaceholderMark /> Denne kamp bruger placeholder-tal.</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          {sider.map(({ t, imp, vp, vinder: v }) => (
            <div key={t.teamId} className={cn("rounded-xl border bg-card p-5 card-shadow", v ? "border-accent" : "border-border")}>
              <p className="text-lg font-bold"><TeamLink id={t.teamId} division={ds} /></p>
              <div className="mt-2 flex items-baseline gap-4">
                <p className="font-display text-3xl font-bold">{imp} <span className="text-sm font-semibold text-muted-foreground">IMP</span></p>
                <p className={cn("font-display text-xl font-bold", v && "text-primary")}>{fmtVp(vp)} VP</p>
              </div>
              {v && <p className="mt-1 text-sm font-semibold text-primary">Vinder</p>}
            </div>
          ))}
        </div>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 rounded-xl bg-secondary/60 px-5 py-3 text-sm">
          <div className="flex gap-1.5"><dt className="text-muted-foreground">Division</dt><dd className="font-semibold">{division.navn}</dd></div>
          <div className="flex gap-1.5"><dt className="text-muted-foreground">Kamp</dt><dd className="font-semibold">Kamp {kamp.round}</dd></div>
          <div className="flex gap-1.5"><dt className="text-muted-foreground">Dato</dt><dd className="font-semibold">{runde?.dato}</dd></div>
          <div className="flex gap-1.5"><dt className="text-muted-foreground">Tid</dt><dd className="font-semibold">{runde?.tid}</dd></div>
        </dl>

        <Tabs defaultValue="overblik" className="mt-6">
          <TabsList className={scrollTabsList}>
            {["Overblik", "Halvlege", "Spillere", "Scoresheet", "Spil", "Kortfordeling"].map((t) => (
              <TabsTrigger key={t} value={t.toLowerCase()}>{t}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overblik" className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-border bg-card p-5 card-shadow">
              <p className="font-bold">Opsummering</p>
              <p className="mt-2 text-sm">
                {vinder
                  ? `${vinder.t.navn} vandt kampen med ${kamp.imp[0]}–${kamp.imp[1]} IMP, svarende til ${fmtVp(kamp.vp[0])}–${fmtVp(kamp.vp[1])} VP.`
                  : `Kampen endte uafgjort: ${kamp.imp[0]}–${kamp.imp[1]} IMP og ${fmtVp(kamp.vp[0])}–${fmtVp(kamp.vp[1])} VP.`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">IMP-forskel: {Math.abs(kamp.imp[0] - kamp.imp[1])}</p>
            </div>
            <div className="rounded-xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
              Detaljerede bord- og spilresultater tilkobles senere fra turneringsdata.
            </div>
          </TabsContent>

          <TabsContent value="halvlege" className="mt-5 grid gap-4 sm:grid-cols-2">
            {["1. halvleg", "2. halvleg"].map((t) => (
              <div key={t} className="rounded-xl border border-border bg-card p-5 card-shadow">
                <p className="font-bold">{t}</p>
                <p className="mt-2 text-sm text-muted-foreground">Halvlegsresultatet vises, når turneringsdata tilkobles.</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="spillere" className="mt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {[{ t: h, sp: kamp.hjemmeSpillere }, { t: u, sp: kamp.udeSpillere }].map(({ t, sp }) => (
                <div key={t.teamId} className="rounded-xl border border-border bg-card p-5 card-shadow">
                  <p className="font-bold">{t.navn}</p>
                  {sp.length ? (
                    <ul className="mt-2 space-y-1 text-sm">
                      {sp.map((p) => (
                        <li key={p.playerId}>
                          {p.navn}
                          {p.dbfNr ? <span className="ml-2 text-muted-foreground">DBF-nr. {p.dbfNr}</span> : null}
                          {p.parNr ? <span className="ml-2 text-muted-foreground">Par {p.parNr}</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Spilleropstillingen vises, når turneringsdata tilkobles.</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scoresheet" className="mt-5">
            <Tom>Scoresheet kommer fra de detaljerede resultatdata.</Tom>
          </TabsContent>

          <TabsContent value="spil" className="mt-5">
            <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
              <table className="w-full text-sm">
                <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                  <tr><th className="px-4 py-3">Spil</th><th className="px-4 py-3">Kontrakt</th><th className="px-4 py-3">Resultat</th><th className="px-4 py-3 text-right">IMP</th></tr>
                </thead>
                <tbody>
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Spillene vises her, når turneringsdata tilkobles.</td></tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="kortfordeling" className="mt-5">
            <Tom>Kortdiagrammer for de enkelte spil vises her, når turneringsdata tilkobles.</Tom>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
