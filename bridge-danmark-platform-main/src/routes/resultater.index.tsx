import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DevInfo, PageHero, Section } from "@/components/site/Bits";
import { distrikter, klubKatalog, resultater } from "@/lib/demo-data";
import { useSession } from "@/lib/session";
import { Search } from "lucide-react";

export const Route = createFileRoute("/resultater/")({
  head: () => ({
    meta: [
      { title: "Resultater – bridge.dk" },
      {
        name: "description",
        content:
          "Resultater fra klubturneringer, distriktsturneringer og DBF-turneringer samlet ét sted. Filtrér på klub, dato, turneringstype, distrikt og spiller.",
      },
      { property: "og:title", content: "Resultater – bridge.dk" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: "Alle bridgeresultater i Danmark på ét sted — klub, distrikt og forbund.",
      },
    ],
  }),
  component: Resultater,
});

const typer = ["Alle typer", "Parturnering", "Holdturnering", "Division", "Bridgefestival"];

function Resultater() {
  const { session } = useSession();
  const [klub, setKlub] = useState("Alle klubber");
  const [type, setType] = useState("Alle typer");
  const [distrikt, setDistrikt] = useState("Alle distrikter");
  const [kunDbf, setKunDbf] = useState(false);
  const [spiller, setSpiller] = useState("");
  const [dato, setDato] = useState("");

  const liste = useMemo(
    () =>
      resultater.filter((r) => {
        const matchKlub = klub === "Alle klubber" || r.klub === klub;
        const matchType = type === "Alle typer" || r.type === type;
        const matchDistrikt = distrikt === "Alle distrikter" || r.distrikt === distrikt;
        const matchDbf = !kunDbf || r.dbf;
        const matchSpiller =
          !spiller.trim() || r.vinder.toLowerCase().includes(spiller.trim().toLowerCase());
        const matchDato = !dato || r.dato.split(".").reverse().join("-") >= dato;
        return matchKlub && matchType && matchDistrikt && matchDbf && matchSpiller && matchDato;
      }),
    [klub, type, distrikt, kunDbf, spiller, dato],
  );

  return (
    <>
      <PageHero
        label="Resultater"
        titel="Resultater"
        beskrivelse="Find resultater fra DBF-turneringer, divisioner og klubber."
      />

      <Section titel="Find resultater">
        <Link
          to="/resultater/divisionsturneringen"
          className="mb-5 block rounded-xl hero-gradient p-6 text-primary-foreground card-shadow transition hover:opacity-95"
        >
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-accent">Primært eksempel</p>
          <p className="mt-1 text-2xl font-bold">Divisionsturneringen 2026/2027</p>
          <p className="mt-1 text-primary-foreground/80">1. division · 2. division · 3. division øst · 3. division vest</p>
          <p className="mt-3 font-semibold text-accent">Se stilling og kampe →</p>
        </Link>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/resultater/divisionsturneringen/$division" params={{ division: "2-division" }} className="rounded-xl border border-border bg-card p-5 card-shadow hover:border-accent">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold">Seneste resultater</p>
              <Badge variant="secondary" className="text-[0.65rem]">Virker</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Kamp 2 i 2. division, 03-10-2026.</p>
          </Link>
          {[
            { t: "Store DBF-turneringer", b: "Mesterskaber og festivaler." },
            { t: "Klubresultater", b: "Klubbernes egne turneringer." },
            { t: "Søg på turnering", b: "Filtrering på type og dato." },
            { t: "Søg på klub", b: "Find resultater for en bestemt klub." },
            { t: "Søg på spiller", b: "Find en spillers resultater." },
          ].map((k) => (
            <div key={k.t} aria-disabled="true" className="rounded-xl border border-dashed border-border bg-card/60 p-5">
              <p className="font-bold text-foreground/80">{k.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{k.b}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kommer senere i prototypen</p>
            </div>
          ))}
        </div>
      </Section>

      <Section titel="Foreløbig turneringsreference" className="pt-0">
        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <Badge variant="secondary">Afventer resultatdata</Badge>
          <h2 className="mt-3 font-display text-xl font-bold">Parmesterskabet 2026</h2>
          <p className="mt-1 text-sm text-muted-foreground">Rødovre Bridgeklub · Klubnr. 2275 · Sektion 761</p>
          <p className="mt-3 text-sm">18. marts 2026 · 16 par · 32 spillere</p>
          <p className="mt-1 text-sm">8 borde · 3 runder · 240 spilresultater</p>
          <p className="mt-3 text-sm text-muted-foreground">Turneringsoplysningerne er verificeret. Resultater, spillernavne og placeringer afventer kildedata.</p>
        </div>
      </Section>

      <Section titel="Søg i resultater" className="pt-0" >
        <span id="sog" />
        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <Select value={klub} onValueChange={setKlub}>
            <SelectTrigger>
              <SelectValue placeholder="Klub" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alle klubber">Alle klubber</SelectItem>
              {Array.from(new Set(resultater.map((r) => r.klub))).map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={dato} onChange={(e) => setDato(e.target.value)} aria-label="Fra dato" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Turneringstype" />
            </SelectTrigger>
            <SelectContent>
              {typer.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={distrikt} onValueChange={setDistrikt}>
            <SelectTrigger>
              <SelectValue placeholder="Distrikt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alle distrikter">Alle distrikter</SelectItem>
              {distrikter.map((d) => (
                <SelectItem key={d.id} value={d.navn}>
                  {d.navn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={spiller}
              onChange={(e) => setSpiller(e.target.value)}
              placeholder="Spiller"
              className="pl-9"
            />
          </div>
          <Button variant={kunDbf ? "accent" : "outline"} onClick={() => setKunDbf((v) => !v)}>
            Kun DBF-turneringer
          </Button>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card card-shadow">
          <table className="w-full text-sm">
            <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Dato</th>
                <th className="px-4 py-3">Turnering</th>
                <th className="hidden px-4 py-3 md:table-cell">Type</th>
                <th className="hidden px-4 py-3 lg:table-cell">Klub / arrangør</th>
                <th className="px-4 py-3">Vinder</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Deltagere</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((r) => (
                <tr key={r.id} className="border-t border-border/70 hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{r.dato}</td>
                  <td className="px-4 py-3 font-semibold">
                    {r.turnering}
                    {r.dbf && (
                      <Badge variant="secondary" className="ml-2 align-middle text-[0.65rem]">
                        DBF
                      </Badge>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{r.type}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {klubKatalog.some((k) => k.nr === r.klubNr && k.harSide) ? (
                      <Link
                        to="/$klubId"
                        params={{ klubId: r.klubNr }}
                        className="hover:text-accent"
                      >
                        {r.klub}
                      </Link>
                    ) : (
                      r.klub
                    )}
                  </td>
                  <td className="px-4 py-3">{r.vinder}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.score}</td>
                  <td className="px-4 py-3 text-right">{r.deltagere}</td>
                </tr>
              ))}
              {!liste.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    Ingen resultater matcher filtrene.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DevInfo
          titel="Resultatvisning"
          felter={[
            { ui: "Resultat", system: "BC3", database: "xxxx.fdb", tabel: "RESULT" },
            { ui: "Kamp", system: "BC3", database: "xxxx.fdb", tabel: "ROUNDMATCH" },
            { ui: "Spil", system: "BC3", database: "xxxx.fdb", tabel: "BOARD" },
          ]}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {session ? (
            <>
              <Button asChild variant="accent">
                <Link to="/medlem">Mine resultater</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/medlem">Mit handicap</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/medlem">Mesterpoint</Link>
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Log ind for at se dine egne resultater, dit handicap og dine mesterpoint.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
