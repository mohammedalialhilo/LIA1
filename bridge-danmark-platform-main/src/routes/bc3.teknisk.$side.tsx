import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero, Preliminary, Section } from "@/components/site/Bits";
import {
  dokNav,
  dokSider,
  erRelationer,
  erTabeller,
  FORELOEBIG,
  skaermMappinger,
} from "@/lib/demo-data";
import { ArrowRight, ChevronRight } from "lucide-react";
import {
  bc3Skaerme,
  dataFlow,
  integrationsHuller,
  skaermFoelger,
  systemLandskab,
  wikiAabneSpoergsmaal,
} from "@/lib/bc3-docs";
import { Bc3Screen, Bc3SkaermMapping } from "@/components/site/Bc3Screen";

export const Route = createFileRoute("/bc3/teknisk/$side")({
  loader: ({ params }) => {
    const nav = dokNav.find((d) => d.slug === params.side);
    if (!nav) throw notFound();
    const side = dokSider.find((d) => d.slug === params.side) ?? null;
    return { nav, side, erDiagram: params.side === "er-diagrammer" };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Siden findes ikke – bridge.dk" }],
      };
    }
    const t = `${loaderData.nav.titel} – Teknisk dokumentation – bridge.dk`;
    const d = `Foreløbig teknisk dokumentation: ${loaderData.nav.titel} i BC3 og BridgeOrg.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: DokSide,
});

/* ---------- ER-diagrammer som ren opmærkning (ingen opdigtede felter) ---------- */

function Kaede({ noder }: { noder: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {noder.map((n, i) => (
        <span key={n} className="flex items-center gap-2">
          <span className="rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 font-mono text-sm font-semibold">
            {n}
          </span>
          {i < noder.length - 1 && <ArrowRight className="size-4 text-accent" />}
        </span>
      ))}
    </div>
  );
}

function ErDiagrammer() {
  const grupper = Array.from(new Set(erTabeller.map((t) => `${t.system} · ${t.gruppe}`)));
  return (
    <>
      <PageHero
        label="BC3 · Teknisk dokumentation"
        titel="ER-diagrammer"
        beskrivelse="Kendte tabeller i BC3 og BridgeOrg med feltniveau, relationer og mapping fra hvert skærmfelt i prototypen til sit databasefelt."
      />
      <Section titel="Sådan læses modellen">
        <div className="mb-6 max-w-3xl">
          <Preliminary tekst={FORELOEBIG} />
        </div>
        <Card>
          <CardContent className="p-6">
            <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>Tabelnavnene er kendte fra BC3 (xxxx.fdb) og BridgeOrg.</li>
              <li>
                Feltnavne og fremmednøgler er arbejdsforslag og er markeret{" "}
                <span className="font-semibold">ANTAGET</span>, indtil de er verificeret mod en rigtig
                installation. Brug dem ikke som facit.
              </li>
              <li>Relationer med 1:N angiver den formodede retning fra overordnet til underordnet tabel.</li>
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section titel="Tabeller og felter" className="pt-0">
        <div className="space-y-8">
          {grupper.map((g) => (
            <div key={g}>
              <p className="section-label mb-3">{g}</p>
              <div className="grid gap-5 lg:grid-cols-2">
                {erTabeller
                  .filter((t) => `${t.system} · ${t.gruppe}` === g)
                  .map((t) => (
                    <Card key={t.navn}>
                      <CardContent className="p-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/60 px-4 py-3">
                          <span className="font-mono text-sm font-bold">{t.navn}</span>
                          <Badge variant="outline">{t.system}</Badge>
                        </div>
                        <p className="px-4 py-3 text-sm text-muted-foreground">{t.beskrivelse}</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-secondary/40 text-left font-display text-xs uppercase tracking-wide">
                              <tr>
                                <th className="px-4 py-2">Felt</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Nøgle</th>
                                <th className="px-4 py-2">Beskrivelse</th>
                                <th className="px-4 py-2">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {t.felter.map((f) => (
                                <tr key={f.navn} className="border-t border-border/70">
                                  <td className="px-4 py-2 font-mono font-semibold">{f.navn}</td>
                                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{f.type}</td>
                                  <td className="px-4 py-2 text-xs font-semibold">{f.rolle ?? ""}</td>
                                  <td className="px-4 py-2 text-muted-foreground">{f.beskrivelse}</td>
                                  <td className="px-4 py-2">
                                    <Badge variant="outline" className="text-xs">
                                      {f.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section titel="Hierarki og relationer" className="pt-0">
        <div className="space-y-5">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div>
                <h3 className="mb-3 font-display text-lg font-bold">Turneringshierarki</h3>
                <Kaede
                  noder={["MAINTOURNAMENT", "GROUPTOURNAMENT", "SECTION", "ROUND", "ROUNDMATCH", "RESULT"]}
                />
              </div>
              <div>
                <h3 className="mb-3 font-display text-lg font-bold">Deltagere i sektion</h3>
                <Kaede noder={["SECTION", "SECTIONTEAM", "SECTIONPLAYER"]} />
              </div>
              <div>
                <h3 className="mb-3 font-display text-lg font-bold">Spil</h3>
                <Kaede noder={["SECTION", "BOARDSPEC", "BOARD"]} />
              </div>
              <div>
                <h3 className="mb-3 font-display text-lg font-bold">BridgeOrg</h3>
                <Kaede noder={["BRIDGEKLUBBER", "MEDLEMSKABER", "MEDLEMMER"]} />
              </div>
            </CardContent>
          </Card>

          <div className="overflow-x-auto rounded-xl border border-border bg-card card-shadow">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Fra</th>
                  <th className="px-4 py-3">Til</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Via felt</th>
                </tr>
              </thead>
              <tbody>
                {erRelationer.map((r) => (
                  <tr key={r.via} className="border-t border-border/70">
                    <td className="px-4 py-3 font-mono font-semibold">{r.fra}</td>
                    <td className="px-4 py-3 font-mono font-semibold">{r.til}</td>
                    <td className="px-4 py-3">{r.type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.via}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section titel="Skærmfelt → databasefelt" className="pt-0">
        <p className="mb-6 max-w-3xl text-muted-foreground">
          Hver skærm i prototypen er koblet til de tabeller og felter, den skal læse og skrive. Samme mapping
          vises direkte på skærmene, når udviklertilstand er slået til.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          {skaermMappinger.map((m) => (
            <Card key={m.skaerm}>
              <CardContent className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/60 px-4 py-3">
                  <span className="font-display font-bold">{m.skaerm}</span>
                  <span className="font-mono text-xs text-muted-foreground">{m.sti}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/40 text-left font-display text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-2">Skærmfelt</th>
                        <th className="px-4 py-2">Databasefelt</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {m.felter.map((f) => (
                        <tr key={f.felt} className="border-t border-border/70">
                          <td className="px-4 py-2 font-semibold">{f.felt}</td>
                          <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{f.kilde}</td>
                          <td className="px-4 py-2">
                            <Badge variant="outline" className="text-xs">
                              {f.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <DokNavigation aktiv="er-diagrammer" />
    </>
  );
}

function DokNavigation({ aktiv }: { aktiv: string }) {
  return (
    <Section titel="Flere emner" className="pt-0">
      <div className="flex flex-wrap gap-2">
        {dokNav.map((d) => (
          <Link
            key={d.slug}
            to="/bc3/teknisk/$side"
            params={{ side: d.slug }}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
              d.slug === aktiv
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card hover:border-accent"
            }`}
          >
            {d.titel}
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- Systemoversigt */

function Systemoversigt() {
  return (
    <>
      <PageHero
        label="BC3 · Teknisk dokumentation"
        titel="Systemoversigt"
        beskrivelse="De systemer der i dag udgør DBF's it-landskab, hvad de indeholder, hvordan data flyder mellem dem — og hvor hullerne er."
      />

      <Section titel="Systemer i dag">
        <div className="grid gap-5 lg:grid-cols-2">
          {systemLandskab.map((s) => (
            <Card key={s.navn}>
              <CardContent className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/60 px-5 py-3">
                  <span className="font-display text-lg font-bold">{s.navn}</span>
                  <Badge variant="outline">{s.placering}</Badge>
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-sm text-muted-foreground">{s.rolle}</p>
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="section-label">Teknologi</dt>
                      <dd>{s.teknologi}</dd>
                    </div>
                    <div>
                      <dt className="section-label">Ejerskab</dt>
                      <dd>{s.ejer}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="section-label">Data</dt>
                      <dd className="font-mono text-xs text-muted-foreground">{s.data}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {s.integrationer.map((i) => (
                      <span key={i} className="rounded-full border border-border px-3 py-1 text-xs">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section titel="Dataflow: fra bordet til bridge.dk" className="pt-0">
        <div className="mb-6 max-w-3xl">
          <Preliminary tekst={FORELOEBIG} />
        </div>
        <div className="mb-6">
          <Kaede noder={["Bridgemate", "BC3 (xxxx.fdb)", "Indberetning", "BridgeOrg", "bridge.dk"]} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border bg-card card-shadow">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Trin</th>
                <th className="px-4 py-3">System</th>
                <th className="px-4 py-3">Handling</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataFlow.map((f) => (
                <tr key={f.trin} className="border-t border-border/70">
                  <td className="px-4 py-3 font-semibold">{f.trin}</td>
                  <td className="px-4 py-3">{f.system}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.handling}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{f.data}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {f.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section titel="Huller i dagens landskab" className="pt-0">
        <div className="grid gap-4 lg:grid-cols-2">
          {integrationsHuller.map((h) => (
            <Card key={h}>
              <CardContent className="flex gap-3 p-5">
                <ChevronRight className="mt-0.5 size-4 shrink-0 text-accent" />
                <p className="text-sm text-muted-foreground">{h}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section titel="Retning: én samlet platform" className="pt-0">
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="max-w-3xl text-muted-foreground">
              Prototypen viser én flade med fælles login, klubsider, tilmelding, resultater, handicap,
              mesterpoint og butik. BC3's funktioner flyttes gradvist til Online BC3, mens datamodellen
              dokumenteres felt for felt.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { t: "Én konto", b: "Medlemsnummer giver adgang til klubside, tilmelding, resultater og butik." },
                { t: "Én turneringsmodel", b: "Klubturnering og DBF-turnering bruger samme struktur." },
                { t: "Én datakilde", b: "Klub- og medlemsdata vedligeholdes ét sted og læses af resten." },
              ].map((k) => (
                <div key={k.t} className="rounded-xl border border-border p-4">
                  <p className="font-display font-bold">{k.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{k.b}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      <DokNavigation aktiv="systemoversigt" />
    </>
  );
}

/* ---------------------------------------------------------------- Wiki BC3 */

function WikiBc3() {
  const grupper = Array.from(new Set(bc3Skaerme.map((s) => s.gruppe)));
  return (
    <>
      <PageHero
        label="BC3 · Teknisk dokumentation"
        titel="Wiki BC3"
        beskrivelse="Skærm for skærm gennem BC3: vinduer, menusti, felter, knapper, databasefelter og de skærmfølger en turneringsleder faktisk gennemgår."
      />

      <Section titel="Om gengivelserne">
        <div className="mb-6 max-w-3xl">
          <Preliminary tekst={FORELOEBIG} />
        </div>
        <Card>
          <CardContent className="p-6">
            <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>
                Vinduerne nedenfor er <span className="font-semibold">rekonstruktioner</span> af BC3-skærme
                tegnet i browseren — ikke rigtige skærmbilleder. Rigtige billeder indsættes, når de er
                indhentet fra en installation.
              </li>
              <li>Menusti, felter og knapper er de kendte arbejdsgange; databasefelter er markeret ANTAGET.</li>
              <li>Hver skærm har en henvisning til den tilsvarende skærm i den samlede platform.</li>
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section titel="Skærmfølger" className="pt-0">
        <div className="space-y-6">
          {skaermFoelger.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/60 px-5 py-3">
                  <div>
                    <p className="font-display text-lg font-bold">{f.titel}</p>
                    <p className="text-sm text-muted-foreground">{f.beskrivelse}</p>
                  </div>
                  <Badge variant="outline">{f.rolle}</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="bg-secondary/40 text-left font-display text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Skærm i BC3</th>
                        <th className="px-4 py-2">Handling</th>
                        <th className="px-4 py-2">Data</th>
                        <th className="px-4 py-2">I den nye flade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {f.trin.map((t, i) => (
                        <tr key={t.skaerm + i} className="border-t border-border/70">
                          <td className="px-4 py-2 font-semibold">{i + 1}</td>
                          <td className="px-4 py-2 font-semibold">
                            {t.skaermId ? (
                              <a href={`#skaerm-${t.skaermId}`} className="underline decoration-accent">
                                {t.skaerm}
                              </a>
                            ) : (
                              t.skaerm
                            )}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{t.handling}</td>
                          <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{t.data}</td>
                          <td className="px-4 py-2">{t.nyFlade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {grupper.map((g) => (
        <Section key={g} titel={`Skærme: ${g}`} className="pt-0">
          <div className="space-y-8">
            {bc3Skaerme
              .filter((s) => s.gruppe === g)
              .map((s) => (
                <div key={s.id} id={`skaerm-${s.id}`} className="scroll-mt-24">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold">{s.titel}</h3>
                      <p className="font-mono text-xs text-muted-foreground">{s.menusti}</p>
                    </div>
                    <Link
                      to={s.nyFlade.sti}
                      className="rounded-full border border-accent px-4 py-1.5 text-sm font-semibold hover:bg-accent hover:text-accent-foreground"
                    >
                      {s.nyFlade.skaerm} →
                    </Link>
                  </div>
                  <p className="mb-4 max-w-3xl text-sm text-muted-foreground">{s.formaal}</p>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <Bc3Screen skaerm={s} />
                    <div className="space-y-4">
                      <Bc3SkaermMapping skaerm={s} />
                      <Card>
                        <CardContent className="space-y-3 p-5">
                          <div>
                            <p className="section-label mb-1.5">Knapper</p>
                            <ul className="space-y-1.5 text-sm">
                              {s.knapper.map((b) => (
                                <li key={b.navn}>
                                  <span className="font-semibold">{b.navn}</span>{" "}
                                  <span className="text-muted-foreground">— {b.virkning}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="section-label mb-1.5">Tabeller</p>
                            <div className="flex flex-wrap gap-2">
                              {s.tabeller.map((t) => (
                                <span key={t} className="rounded-full border border-border px-3 py-1 font-mono text-xs">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          {s.noter && (
                            <div>
                              <p className="section-label mb-1.5">Noter</p>
                              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                                {s.noter.map((n) => (
                                  <li key={n}>{n}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Section>
      ))}

      <Section titel="Åbne spørgsmål" className="pt-0">
        <div className="overflow-x-auto rounded-xl border border-border bg-card card-shadow">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Emne</th>
                <th className="px-4 py-3">Spørgsmål</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {wikiAabneSpoergsmaal.map((q) => (
                <tr key={q.emne + q.spoergsmaal} className="border-t border-border/70">
                  <td className="px-4 py-3 font-mono font-semibold">{q.emne}</td>
                  <td className="px-4 py-3 text-muted-foreground">{q.spoergsmaal}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="border-gold text-gold-foreground text-xs">
                      {q.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <DokNavigation aktiv="wiki-bc3" />
    </>
  );
}

function DokSide() {
  const { nav, side, erDiagram } = Route.useLoaderData();

  if (erDiagram) return <ErDiagrammer />;
  if (nav.slug === "systemoversigt") return <Systemoversigt />;
  if (nav.slug === "wiki-bc3") return <WikiBc3 />;

  return (
    <>
      <PageHero label="BC3 · Teknisk dokumentation" titel={nav.titel} beskrivelse={side?.intro ?? nav.titel} />
      <Section titel="Indhold">
        <div className="mb-8 max-w-3xl">
          <Preliminary tekst={FORELOEBIG} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {side?.afsnit.map((a) => (
            <Card key={a.overskrift}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold">{a.overskrift}</h2>
                <p className="mt-2 text-muted-foreground">{a.tekst}</p>
                {a.punkter && (
                  <ul className="mt-4 space-y-2 text-sm">
                    {a.punkter.map((p) => (
                      <li key={p} className="rounded-lg border border-border p-3">
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
          {!side && (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Indholdet til denne side er endnu ikke skrevet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {side?.tabeller && (
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Tabel</th>
                  <th className="px-4 py-3">System</th>
                  <th className="px-4 py-3">Beskrivelse</th>
                  <th className="px-4 py-3">Felter</th>
                </tr>
              </thead>
              <tbody>
                {side.tabeller.map((t) => (
                  <tr key={t.navn} className="border-t border-border/70">
                    <td className="px-4 py-3 font-mono font-semibold">{t.navn}</td>
                    <td className="px-4 py-3">{t.system}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.beskrivelse}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-gold text-gold-foreground">
                        SKAL VERIFICERES
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      <DokNavigation aktiv={nav.slug} />
    </>
  );
}
