import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DevInfo } from "@/components/site/Bits";
import { RegelBoks } from "@/components/site/Regler";
import { findBegivenhed } from "@/lib/demo-data";
import { useSession } from "@/lib/session";
import { ArrowLeft, ArrowRight, Check, CreditCard } from "lucide-react";

export const Route = createFileRoute("/turneringer/$eventId/tilmelding")({
  loader: ({ params }) => {
    const begivenhed = findBegivenhed(params.eventId);
    if (!begivenhed) throw notFound();
    return { begivenhed };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tilmelding ikke fundet – bridge.dk" }],
      };
    }
    const t = `Tilmelding: ${loaderData.begivenhed.titel} – bridge.dk`;
    const d = `Tilmeld dig ${loaderData.begivenhed.titel}. Arrangør: ${loaderData.begivenhed.arrangoer}.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: Tilmelding,
});

function Tilmelding() {
  const { begivenhed: b } = Route.useLoaderData();
  const { session, aabnLogin } = useSession();
  const [trin, setTrin] = useState(0);

  const formLabel =
    b.tilmeldingsform === "hold"
      ? "Holdoplysninger"
      : b.tilmeldingsform === "par"
        ? "Paroplysninger"
        : "Deltageroplysninger";

  const trinListe = [
    "Begivenhed",
    formLabel,
    "Deltagere",
    "Bekræftelse",
    ...(b.betaling ? ["Betaling"] : []),
  ];

  const antalDeltagere = b.tilmeldingsform === "hold" ? 4 : b.tilmeldingsform === "par" ? 2 : 1;
  const [deltagere, setDeltagere] = useState<{ nr: string; navn: string }[]>(
    Array.from({ length: antalDeltagere }, (_, i) =>
      i === 0 && session
        ? { nr: session.medlem.medlemsnr, navn: session.medlem.navn.replace(" (demo)", "") }
        : { nr: "", navn: "" },
    ),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <Link
        to="/turneringer/$eventId"
        params={{ eventId: b.id }}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Tilbage til begivenheden
      </Link>

      <h1 className="text-3xl font-bold">Tilmelding</h1>
      <p className="mt-2 text-muted-foreground">
        {b.titel} · {b.dato} · Arrangør: {b.arrangoer}
      </p>

      {/* Trinindikator */}
      <ol className="mt-8 flex flex-wrap gap-2">
        {trinListe.map((t, i) => (
          <li key={t} className="flex items-center gap-2">
            <button
              onClick={() => setTrin(i)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
                i === trin
                  ? "border-accent bg-accent text-accent-foreground"
                  : i < trin
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground"
              }`}
            >
              <span className="grid size-5 place-items-center rounded-full bg-background/40 text-xs">
                {i < trin ? <Check className="size-3" /> : i + 1}
              </span>
              {t}
            </button>
            {i < trinListe.length - 1 && <ArrowRight className="size-4 text-muted-foreground" />}
          </li>
        ))}
      </ol>

      <Card className="mt-8">
        <CardContent className="p-7">
          {trin === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Begivenhed</h2>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                {[
                  ["Begivenhed", b.titel],
                  ["Arrangør", b.arrangoer],
                  ["Dato", b.dato],
                  ["Sted", b.sted],
                  ["Tilmeldingsform", b.tilmeldingsform],
                  ["Pris", b.pris],
                  ["Frist", b.tilmeldingsfrist],
                  ["Pladser", `${b.tilmeldte} af ${b.pladser} optaget`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border p-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                    <dd className="font-semibold capitalize">{v}</dd>
                  </div>
                ))}
              </dl>
              {!session && (
                <div className="rounded-lg border border-border bg-secondary/50 p-4 text-sm">
                  <p className="font-semibold">Log ind for at tilmelde dig som medlem</p>
                  <p className="mt-1 text-muted-foreground">
                    Dine oplysninger udfyldes automatisk, når du er logget ind.
                  </p>
                  <Button variant="accent" size="sm" className="mt-3" onClick={() => aabnLogin()}>
                    Log ind
                  </Button>
                </div>
              )}
              <RegelBoks emne="deltagelse" titel="Betingelser for deltagelse (DBf's bestemmelser)" />
            </div>
          )}

          {trin === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">{formLabel}</h2>
              {b.tilmeldingsform === "hold" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="holdnavn">Holdnavn</Label>
                      <Input id="holdnavn" placeholder="fx Rødovre 1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="klub">Klub</Label>
                      <Input id="klub" defaultValue={session?.aktivKlub ?? ""} placeholder="Klubnummer" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kaptajn">Holdkaptajn</Label>
                      <Input
                        id="kaptajn"
                        defaultValue={session?.medlem.navn.replace(" (demo)", "") ?? ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="raekke">Ønsket række / division</Label>
                      <Input id="raekke" placeholder="fx 2. division" />
                    </div>
                  </div>
                </>
              )}
              {b.tilmeldingsform === "par" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="parnavn">Parnavn (valgfrit)</Label>
                    <Input id="parnavn" placeholder="fx Ahlmann – Vad" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="raekke2">Ønsket række</Label>
                    <Input id="raekke2" placeholder="fx A-rækken" />
                  </div>
                </div>
              )}
              {b.tilmeldingsform === "individuel" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="partner">Har du en partner?</Label>
                    <Input id="partner" placeholder="Medlemsnummer eller navn — kan udfyldes senere" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niveau">Niveau</Label>
                    <Input id="niveau" placeholder="fx begynder / øvet" />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="bemaerk">Bemærkninger til arrangøren</Label>
                <Textarea id="bemaerk" placeholder="Allergier, ønsker om spilletid m.m." />
              </div>
              <RegelBoks
                emne={b.tilmeldingsform === "hold" ? "hold" : "tilmelding"}
                titel="Krav til tilmeldingen"
              />
            </div>
          )}

          {trin === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Deltagere</h2>
              <p className="text-sm text-muted-foreground">
                {b.tilmeldingsform === "hold"
                  ? "Et hold består af 4–6 spillere. Tilføj medlemsnumre — navne hentes automatisk."
                  : b.tilmeldingsform === "par"
                    ? "Angiv begge spillere i parret."
                    : "Angiv deltagerens oplysninger."}
              </p>
              <div className="space-y-3">
                {deltagere.map((d, i) => (
                  <div key={i} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[10rem_1fr]">
                    <div className="space-y-2">
                      <Label>Medlemsnummer</Label>
                      <Input
                        value={d.nr}
                        onChange={(e) =>
                          setDeltagere((v) =>
                            v.map((x, j) => (j === i ? { ...x, nr: e.target.value } : x)),
                          )
                        }
                        placeholder="fx 301045"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Navn</Label>
                      <Input
                        value={d.navn}
                        onChange={(e) =>
                          setDeltagere((v) =>
                            v.map((x, j) => (j === i ? { ...x, navn: e.target.value } : x)),
                          )
                        }
                        placeholder="Fornavn Efternavn"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {b.tilmeldingsform === "hold" && (
                <Button
                  variant="outline"
                  onClick={() => setDeltagere((v) => [...v, { nr: "", navn: "" }])}
                  disabled={deltagere.length >= 6}
                >
                  Tilføj spiller
                </Button>
              )}
              <RegelBoks
                emne={b.tilmeldingsform === "hold" ? "hold" : "par"}
                titel={b.tilmeldingsform === "hold" ? "Holdsammensætning og substitutter" : "Substitutter og udskiftning"}
              />
              <DevInfo
                titel="Deltagere"
                felter={[
                  { ui: "Deltager", system: "BC3", database: "xxxx.fdb", tabel: "SECTIONPLAYER" },
                  { ui: "Hold", system: "BC3", database: "xxxx.fdb", tabel: "SECTIONTEAM" },
                  { ui: "Spiller", system: "BC3", tabel: "MEM_MEMBER", status: "MULIG TABEL – SKAL VERIFICERES" },
                ]}
              />
            </div>
          )}

          {trin === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Bekræftelse</h2>
              <div className="rounded-lg border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Begivenhed", b.titel],
                      ["Arrangør", b.arrangoer],
                      ["Dato", b.dato],
                      ["Tilmeldingsform", b.tilmeldingsform],
                      ["Deltagere", deltagere.map((d) => d.navn || d.nr || "—").join(", ")],
                      ["Pris", b.pris],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-border/70 last:border-0">
                        <th className="w-44 px-4 py-3 text-left font-medium text-muted-foreground">{k}</th>
                        <td className="px-4 py-3 font-semibold capitalize">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <RegelBoks emne="bekraeftelse" titel="Det accepterer du ved tilmeldingen" />
              <label className="flex items-start gap-3 text-sm">
                <Checkbox className="mt-0.5" />
                <span>
                  Jeg bekræfter oplysningerne og accepterer arrangørens betingelser for afmelding.
                </span>
              </label>
              {!b.betaling && (
                <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                  <Check className="size-4 text-primary" />
                  <p>Tilmeldingen er registreret (demo). Der skal ikke betales for denne begivenhed.</p>
                </div>
              )}
            </div>
          )}

          {trin === 4 && b.betaling && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Betaling</h2>
              <div className="rounded-lg border border-border p-5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Beløb</span>
                  <span className="font-display text-2xl font-bold">{b.pris}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-gold/50 bg-gold/10 p-4 text-sm">
                <CreditCard className="mt-0.5 size-4 text-gold-foreground" />
                <p className="font-semibold text-gold-foreground">
                  Betaling er ikke implementeret i prototypen. Her vil betalingsløsningen ligge.
                </p>
              </div>
              <Badge variant="secondary">Status: Tilmeldt — afventer betaling (demo)</Badge>
              <RegelBoks emne="betaling" titel="Betaling af turneringsindskud" />
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
            <Button variant="outline" disabled={trin === 0} onClick={() => setTrin((t) => t - 1)}>
              <ArrowLeft /> Forrige
            </Button>
            {trin < trinListe.length - 1 ? (
              <Button variant="accent" onClick={() => setTrin((t) => t + 1)}>
                Næste <ArrowRight />
              </Button>
            ) : (
              <Button asChild variant="accent">
                <Link to="/turneringer">Afslut og se begivenheder</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
