import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DevInfo, PointBadge, Section } from "@/components/site/Bits";
import { erKlubAdmin, useSession } from "@/lib/session";
import { findBegivenhed, findKlub } from "@/lib/demo-data";
import { LayoutDashboard, LogIn } from "lucide-react";

const menu = [
  "Min klub",
  "Mine turneringer",
  "Tilmeldinger",
  "Mine resultater",
  "Mit handicap",
  "Mesterpoint",
  "Min profil",
] as const;
type Punkt = (typeof menu)[number];

export const Route = createFileRoute("/medlem")({
  head: () => ({
    meta: [
      { title: "Min side – bridge.dk" },
      {
        name: "description",
        content:
          "Medlemsområdet på bridge.dk: din klub, dine turneringer, tilmeldinger, resultater, handicap, mesterpoint og profil.",
      },
      { property: "og:title", content: "Min side – bridge.dk" },
      { property: "og:description", content: "Dit medlemsoverblik på bridge.dk." },
    ],
  }),
  component: MedlemsOmraade,
});

function MedlemsOmraade() {
  const { session, aabnLogin } = useSession();
  const [punkt, setPunkt] = useState<Punkt>("Min klub");

  if (!session) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8">
        <h1 className="text-3xl font-bold">Log ind for at se din side</h1>
        <p className="mt-3 text-muted-foreground">
          Medlemsområdet viser dine turneringer, tilmeldinger, resultater, handicap og mesterpoint.
        </p>
        <Button variant="accent" size="lg" className="mt-6" onClick={() => aabnLogin()}>
          <LogIn /> Log ind
        </Button>
      </div>
    );
  }

  const m = session.medlem;
  const klub = findKlub(session.aktivKlub);
  const maxHandicap = Math.max(...m.handicapHistorik.map((h) => h.handicap));

  return (
    <>
      <div className="hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <p className="section-label mb-2">Min side</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{m.navn}</h1>
              <p className="mt-2 text-primary-foreground/80">
                Medlemsnr. {m.medlemsnr} · {klub ? `${klub.nr} – ${klub.navn}` : "—"} · {m.titel}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {klub && klub.nr !== "5000" && (
                <Button asChild variant="subtle">
                  <Link to="/$klubId" params={{ klubId: klub.nr }}>
                    Klubbens side
                  </Link>
                </Button>
              )}
              {erKlubAdmin(m) && (
                <Button asChild variant="hero">
                  <Link to="/bc3/online">
                    <LayoutDashboard /> Åbn Online BC3
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        <nav className="border-t border-primary-foreground/15">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 lg:px-8">
            {menu.map((p) => (
              <button
                key={p}
                onClick={() => setPunkt(p)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 font-display text-sm font-semibold ${
                  punkt === p
                    ? "border-accent text-primary-foreground"
                    : "border-transparent text-primary-foreground/65 hover:text-primary-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {punkt === "Min klub" && klub && (
        <Section titel={`${klub.nr} – ${klub.navn}`} beskrivelse={klub.beskrivelse}>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold">Spilletider</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {klub.spilletider.map((s) => (
                    <li key={s.dag + s.tid} className="flex justify-between gap-3">
                      <span className="font-semibold">{s.dag}</span>
                      <span className="text-muted-foreground">{s.tid}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold">Mit medlemskab</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Primær klub</dt>
                    <dd className="font-semibold">{m.primaerKlub}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Klubber</dt>
                    <dd className="font-semibold">{m.klubber.join(", ")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Handicap</dt>
                    <dd className="font-semibold">{m.handicap.toFixed(1)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold">Klubbens nyheder</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {klub.nyheder.slice(0, 3).map((n) => (
                    <li key={n.titel}>
                      <p className="font-semibold">{n.titel}</p>
                      <p className="text-muted-foreground">{n.dato}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <DevInfo
            titel="Medlem"
            felter={[
              { ui: "Medlem", system: "BC3", tabel: "MEM_MEMBER", status: "MULIG TABEL – SKAL VERIFICERES" },
              { ui: "Medlemskab", system: "BridgeOrg", tabel: "MEDLEMSKABER" },
            ]}
          />
        </Section>
      )}

      {(punkt === "Mine turneringer" || punkt === "Mine resultater") && (
        <Section
          titel={punkt}
          beskrivelse="Demohistorik. Rigtige data indlæses senere fra forbundets systemer."
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Dato</th>
                  <th className="px-4 py-3">Turnering</th>
                  <th className="hidden px-4 py-3 md:table-cell">Type</th>
                  <th className="px-4 py-3">Placering</th>
                  <th className="px-4 py-3 text-right">Score</th>
                  <th className="px-4 py-3 text-right">Point</th>
                </tr>
              </thead>
              <tbody>
                {m.resultater.map((r) => (
                  <tr key={r.dato + r.turnering} className="border-t border-border/70">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{r.dato}</td>
                    <td className="px-4 py-3 font-semibold">{r.turnering}</td>
                    <td className="hidden px-4 py-3 md:table-cell">{r.type}</td>
                    <td className="px-4 py-3">{r.placering}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.score}</td>
                    <td className="px-4 py-3 text-right">{r.point}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DevInfo
            titel="Resultater pr. spiller"
            felter={[
              { ui: "Resultat", system: "BC3", database: "xxxx.fdb", tabel: "RESULT" },
              { ui: "Spiller i sektion", system: "BC3", database: "xxxx.fdb", tabel: "SECTIONPLAYER" },
            ]}
          />
        </Section>
      )}

      {punkt === "Tilmeldinger" && (
        <Section titel="Mine tilmeldinger">
          <div className="grid gap-5 md:grid-cols-2">
            {m.tilmeldinger.map((t) => {
              const b = findBegivenhed(t.begivenhedId);
              return (
                <Card key={t.begivenhedId}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold">{b?.titel ?? t.begivenhedId}</h3>
                      <Badge variant={t.status === "Bekræftet" ? "default" : "secondary"}>
                        {t.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {b?.dato} · Arrangør: {b?.arrangoer}
                    </p>
                    <p className="mt-3 text-sm">{t.rolle}</p>
                    <p className="text-sm text-muted-foreground">Betaling: {t.betaling}</p>
                    {b && (
                      <Button asChild variant="outline" size="sm" className="mt-4">
                        <Link to="/turneringer/$eventId" params={{ eventId: b.id }}>
                          Se begivenhed
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Section>
      )}

      {punkt === "Mit handicap" && (
        <Section
          titel="Mit handicap"
          beskrivelse="Handicap beregnes centralt ud fra indberettede turneringsresultater."
        >
          <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  Aktuelt handicap
                </p>
                <p className="mt-2 font-display text-6xl font-bold text-accent">
                  {m.handicap.toFixed(1)}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Faldet {((m.handicapHistorik[0]?.handicap ?? m.handicap) - m.handicap).toFixed(1)}{" "}
                  siden {m.handicapHistorik[0]?.periode ?? "sæsonstart"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold">Handicaphistorik</h3>
                <ul className="mt-4 space-y-4">
                  {m.handicapHistorik.map((h) => (
                    <li key={h.periode}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-semibold">{h.periode}</span>
                        <span className="font-mono">{h.handicap.toFixed(1)}</span>
                      </div>
                      <Progress value={(h.handicap / maxHandicap) * 100} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card card-shadow">
            <table className="w-full min-w-[42rem] text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Dato</th>
                  <th className="px-4 py-3">Turnering</th>
                  <th className="px-4 py-3">Klub</th>
                  <th className="px-4 py-3">Resultat</th>
                  <th className="px-4 py-3 text-right">Handicap før</th>
                  <th className="px-4 py-3 text-right">Handicap efter</th>
                </tr>
              </thead>
              <tbody>
                {m.handicapPosteringer.map((h) => (
                  <tr key={h.dato + h.turnering} className="border-t border-border/70">
                    <td className="px-4 py-3 whitespace-nowrap">{h.dato}</td>
                    <td className="px-4 py-3 font-semibold">{h.turnering}</td>
                    <td className="px-4 py-3 text-muted-foreground">{h.klub}</td>
                    <td className="px-4 py-3">{h.resultat}</td>
                    <td className="px-4 py-3 text-right font-mono">{h.hcpFoer.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      {h.hcpEfter.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DevInfo
            titel="Handicap"
            felter={[
              { ui: "Handicaphistorik", system: "BridgeOrg", tabel: "HACPOSTERINGER" },
              { ui: "Turnering i beregning", system: "BridgeOrg", tabel: "HACTURNERINGER" },
            ]}
          />
        </Section>
      )}

      {punkt === "Mesterpoint" && (
        <Section titel="Mesterpoint">
          <div className="grid gap-5 md:grid-cols-3">
            {m.mesterpoint.map((p) => (
              <Card key={p.kategori}>
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-bold">{p.kategori}</h3>
                  <p className="mt-3 font-display text-4xl font-bold text-accent">{p.total}</p>
                  <p className="text-sm text-muted-foreground">i alt</p>
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">{p.iAar}</span> point i denne sæson
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card card-shadow">
            <table className="w-full min-w-[38rem] text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Dato</th>
                  <th className="px-4 py-3">Turnering</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-right">Point</th>
                </tr>
              </thead>
              <tbody>
                {m.mesterpointHistorik.map((p) => (
                  <tr key={p.dato + p.turnering} className="border-t border-border/70">
                    <td className="px-4 py-3 whitespace-nowrap">{p.dato}</td>
                    <td className="px-4 py-3 font-semibold">{p.turnering}</td>
                    <td className="px-4 py-3">
                      <PointBadge point={p.kategori} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{p.point}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DevInfo
            titel="Mesterpoint"
            felter={[{ ui: "Mesterpoint", system: "BC3", database: "xxxx.fdb", tabel: "MASTERPOINTS" }]}
          />
        </Section>
      )}

      {punkt === "Min profil" && (
        <Section titel="Min profil" beskrivelse="Demoprofil — oplysninger kan ikke ændres i prototypen.">
          <Card className="max-w-2xl">
            <CardContent className="p-6">
              <dl className="divide-y divide-border text-sm">
                {[
                  ["Navn", m.navn],
                  ["Medlemsnummer", m.medlemsnr],
                  ["E-mail", m.email],
                  ["Født", String(m.foedselsaar)],
                  ["Telefon", m.telefon],
                  ["Adresse", `${m.adresse}, ${m.postnr} ${m.by}`],
                  ["Medlem siden", m.medlemSiden],
                  ["Kontingent", m.kontingent],
                  ["Titel", m.titel],
                  ["Aktuelt handicap", m.handicap.toFixed(1)],
                  ["Primær klub", m.primaerKlub],
                  ["Klubber", m.klubber.join(", ")],
                  ["Roller", m.roller.join(", ")],
                  ["Udvikleradgang", m.udviklerAdgang ? "Ja" : "Nej"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </Section>
      )}
    </>
  );
}
