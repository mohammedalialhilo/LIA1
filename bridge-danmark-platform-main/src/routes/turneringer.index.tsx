import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DevInfo, PageHero, PointBadge, Section } from "@/components/site/Bits";
import { RegelSamling } from "@/components/site/Regler";
import { begivenheder, eventFiltre, findBegivenhed } from "@/lib/demo-data";
import { useSession } from "@/lib/session";
import { CalendarDays, Search, Users } from "lucide-react";

export const Route = createFileRoute("/turneringer/")({
  head: () => ({
    meta: [
      { title: "Turneringer & tilmelding – bridge.dk" },
      {
        name: "description",
        content:
          "Se og tilmeld dig turneringer, kurser og events — både Danmarks Bridgeforbunds turneringer og klubbernes egne.",
      },
      { property: "og:title", content: "Turneringer & tilmelding – bridge.dk" },
      {
        property: "og:description",
        content: "Individuel, par- og holdtilmelding til DBF- og klubturneringer i ét system.",
      },
    ],
  }),
  component: Turneringer,
});

function Turneringer() {
  const [filter, setFilter] = useState<string>("Alle");
  const [soeg, setSoeg] = useState("");
  const { session } = useSession();
  const minKlub = session?.aktivKlub;

  const liste = useMemo(
    () =>
      begivenheder.filter((b) => {
        const q = soeg.trim().toLowerCase();
        const matchSoeg =
          !q || b.titel.toLowerCase().includes(q) || b.arrangoer.toLowerCase().includes(q);
        const matchFilter =
          filter === "Alle"
            ? true
            : filter === "DBF"
              ? b.arrangoerType === "DBF"
              : filter === "Min klub"
                ? !!minKlub && b.klubNr === minKlub
                : b.type === filter;
        return matchSoeg && matchFilter;
      }),
    [filter, soeg, minKlub],
  );

  const mineTilmeldinger = session?.medlem.tilmeldinger ?? [];

  return (
    <>
      <PageHero
        label="Turneringer & tilmelding"
        titel="Alle turneringer, kurser og events ét sted"
        beskrivelse="Danmarks Bridgeforbund og klubberne bruger samme tilmeldingssystem. Tilmeld dig individuelt, som par eller som hold."
      />

      <Section titel="Begivenheder" beskrivelse="Filtrér på arrangør og type. Klik en begivenhed for detaljer og tilmelding.">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {eventFiltre.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              disabled={f === "Min klub" && !minKlub}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors disabled:opacity-40 ${
                filter === f
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card hover:border-accent"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="relative ml-auto min-w-[15rem]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={soeg}
              onChange={(e) => setSoeg(e.target.value)}
              placeholder="Søg begivenhed eller arrangør"
              className="pl-9"
            />
          </div>
        </div>

        {!minKlub && (
          <p className="mb-6 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
            Log ind for at bruge filteret “Min klub” og se dine tilmeldinger.
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {liste.map((b) => (
            <Card key={b.id} className="flex flex-col overflow-hidden">
              <div className={b.arrangoerType === "DBF" ? "hero-gradient h-1.5" : "accent-gradient h-1.5"} />
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge variant="secondary">{b.type}</Badge>
                  <PointBadge point={b.point} />
                </div>
                <h3 className="text-lg font-bold leading-snug">{b.titel}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" /> {b.dato}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{b.sted}</p>
                <div className="mt-4 rounded-lg bg-secondary/60 p-3 text-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Arrangør</p>
                  <p className="font-semibold">{b.arrangoer}</p>
                </div>
                <div className="mt-4 flex flex-1 items-end justify-between gap-3 border-t border-border pt-4 text-sm">
                  <div>
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-4" /> {b.tilmeldte}/{b.pladser}
                    </p>
                    <p className="font-semibold">{b.pris}</p>
                  </div>
                  <Button asChild size="sm" variant="accent">
                    <Link to="/turneringer/$eventId" params={{ eventId: b.id }}>
                      Se begivenhed
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DevInfo
          titel="Begivenhedsliste"
          felter={[
            { ui: "Turnering", system: "BC3", database: "xxxx.fdb", tabel: "MAINTOURNAMENT" },
            { ui: "Række/gruppe", system: "BC3", database: "xxxx.fdb", tabel: "GROUPTOURNAMENT" },
            { ui: "Tilmeldte", system: "BC3", database: "xxxx.fdb", tabel: "SECTIONPLAYER" },
          ]}
        />
      </Section>

      {session && (
        <Section titel="Mine tilmeldinger" className="pt-0">
          <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Begivenhed</th>
                  <th className="hidden px-4 py-3 md:table-cell">Arrangør</th>
                  <th className="px-4 py-3">Rolle</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Betaling</th>
                </tr>
              </thead>
              <tbody>
                {mineTilmeldinger.map((t) => {
                  const b = findBegivenhed(t.begivenhedId);
                  return (
                    <tr key={t.begivenhedId} className="border-t border-border/70">
                      <td className="px-4 py-3 font-semibold">
                        {b ? (
                          <Link
                            to="/turneringer/$eventId"
                            params={{ eventId: b.id }}
                            className="hover:text-accent"
                          >
                            {b.titel}
                          </Link>
                        ) : (
                          t.begivenhedId
                        )}
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">{b?.arrangoer}</td>
                      <td className="px-4 py-3">{t.rolle}</td>
                      <td className="px-4 py-3">
                        <Badge variant={t.status === "Bekræftet" ? "default" : "secondary"}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{t.betaling}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      )}
      <Section
        titel="Regler for tilmelding og deltagelse"
        beskrivelse="Uddrag af Danmarks Bridgeforbunds officielle bestemmelser om deltagelse, tilmelding, holdsammensætning, substitutter og afvikling."
      >
        <RegelSamling />
      </Section>

    </>
  );
}
