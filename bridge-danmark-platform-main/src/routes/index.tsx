import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Section, PointBadge } from "@/components/site/Bits";
import { begivenheder, klubKatalog, nyheder, resultater, varer } from "@/lib/demo-data";
import { useSession } from "@/lib/session";
import heroBillede from "@/assets/hero-bridge.jpg";
import festivalBillede from "@/assets/festival.jpg";
import laerBillede from "@/assets/laer-bridge.jpg";
import butikBillede from "@/assets/butik.jpg";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  MapPin,
  Newspaper,
  Search,
  ShoppingBag,
  Trophy,
  Users,
  MonitorCog,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "bridge.dk – Bridge i Danmark for alle" },
      {
        name: "description",
        content:
          "Find en bridgeklub, tilmeld dig turneringer, se resultater, handicap og mesterpoint — og få adgang til BridgeCentral og Bridgebutikken.",
      },
      { property: "og:title", content: "bridge.dk – Bridge i Danmark for alle" },
      {
        property: "og:description",
        content: "Klubber, turneringer, resultater, BC3 og Bridgebutikken samlet ét sted.",
      },
    ],
  }),
  component: Forside,
});

function Forside() {
  const { aabnLogin } = useSession();
  const kommende = begivenheder.slice(0, 4);
  const senesteResultater = resultater.slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroBillede}
          alt="Bridgespillere ved bordene i en dansk turneringshal"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="hero-gradient absolute inset-0 opacity-[0.86]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-primary-foreground lg:px-8 lg:py-32">
          <p className="section-label mb-4">Danmarks Bridgeforbund</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
            Bridge er bedst, når vi spiller sammen
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
            Find en klub tæt på dig, tilmeld dig turneringer og følg dine resultater, handicap og
            mesterpoint. Alt samlet ét sted på bridge.dk.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/klubber">
                <MapPin /> Find en bridgeklub
              </Link>
            </Button>
            <Button asChild size="xl" variant="subtle">
              <Link to="/turneringer">
                <CalendarDays /> Turneringer & tilmelding
              </Link>
            </Button>
            <Button size="xl" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground" onClick={() => aabnLogin()}>
              Log ind som medlem
            </Button>
          </div>
          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["257", "klubber"],
              ["19.100", "medlemmer"],
              ["6", "distrikter"],
              ["4", "kredse"],
            ].map(([tal, tekst]) => (
              <div key={tekst}>
                <dt className="font-display text-3xl font-bold">{tal}</dt>
                <dd className="text-sm uppercase tracking-wide text-primary-foreground/70">{tekst}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Aktuelt fra DBF */}
      <Section
        label="Aktuelt fra Danmarks Bridgeforbund"
        titel="Det vigtigste lige nu"
        handling={
          <Button asChild variant="outline">
            <Link to="/om-dbf">
              Alle nyheder <ArrowRight />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {nyheder.slice(0, 3).map((n, i) => (
            <Card key={n.titel} className={i === 0 ? "lg:row-span-2" : ""}>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-3 text-xs">
                  <Badge variant="secondary">{n.kategori}</Badge>
                  <span className="text-muted-foreground">{n.dato}</span>
                </div>
                <h3 className={i === 0 ? "text-2xl font-bold" : "text-lg font-bold"}>{n.titel}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{n.resume}</p>
                {i === 0 && (
                  <img
                    src={laerBillede}
                    alt="Bridgespillere omkring et bord"
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="mt-5 aspect-[4/3] w-full rounded-xl object-cover"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Find en bridgeklub */}
      <section className="bg-sand py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="section-label mb-2">Find en bridgeklub</p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Der er en klub i nærheden af dig
              </h2>
              <p className="mt-3 text-muted-foreground">
                Søg blandt klubber i hele landet, filtrér på område og distrikt — og se klubbens
                spilletider, turneringer og resultater på klubbens egen side på bridge.dk.
              </p>
              <form className="mt-6 flex flex-wrap gap-3">
                <div className="relative min-w-[16rem] flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Søg by, klubnavn eller klubnummer" className="h-11 pl-9" />
                </div>
                <Button asChild size="lg" variant="accent">
                  <Link to="/klubber">Søg klubber</Link>
                </Button>
              </form>
              <div className="mt-6 flex flex-wrap gap-2 text-sm">
                {klubKatalog.filter((k) => k.harSide).map((k) => (
                  <Link
                    key={k.nr}
                    to="/$klubId"
                    params={{ klubId: k.nr }}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 font-medium hover:border-accent hover:text-accent"
                  >
                    {k.nr} – {k.navn}
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted lift-shadow">
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <MapPin className="mx-auto mb-3 size-8 text-accent" />
                  <p className="font-display text-lg font-bold">Kortvisning</p>
                  <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                    Pladsholder — kort med alle danske bridgeklubber indsættes her.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kommende turneringer */}
      <Section
        label="Kommende turneringer og events"
        titel="Tilmeld dig næste turnering"
        beskrivelse="Både forbundets turneringer og klubbernes egne turneringer, kurser og events."
        handling={
          <Button asChild variant="outline">
            <Link to="/turneringer">
              Se alle begivenheder <ArrowRight />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {kommende.map((b) => (
            <Card key={b.id} className="flex flex-col overflow-hidden transition-shadow hover:lift-shadow">
              <div className="accent-gradient h-1.5" />
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge variant="secondary">{b.type}</Badge>
                  <PointBadge point={b.point} />
                </div>
                <h3 className="text-lg font-bold leading-snug">{b.titel}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {b.dato} · {b.sted}
                </p>
                <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                  Arrangør
                </p>
                <p className="text-sm font-semibold">{b.arrangoer}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">
                    {b.tilmeldte}/{b.pladser} tilmeldt
                  </span>
                  <Button asChild size="sm" variant="accent">
                    <Link to="/turneringer/$eventId" params={{ eventId: b.id }}>
                      Tilmelding
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Bridgefestival */}
      <section className="relative isolate overflow-hidden">
        <img
          src={festivalBillede}
          alt="Dansk Bridgefestival med fyldt hal og farvede bannere"
          width={1600}
          height={1000}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-deep/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-primary-foreground lg:px-8">
          <p className="section-label mb-3">Dansk Bridgefestival</p>
          <h2 className="max-w-2xl text-3xl font-bold sm:text-5xl">
            10 dage med bridge, sommer og fællesskab
          </h2>
          <p className="mt-4 max-w-xl text-primary-foreground/85">
            Festivalen 2027 afvikles 8.–17. juli i Svendborg med åbne turneringer for alle niveauer,
            undervisning og socialt program. Tilmelding sker samme sted som alle andre turneringer.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/turneringer">
                Se festivalprogrammet
              </Link>
            </Button>
            <Button asChild size="xl" variant="subtle">
              <Link to="/turneringer/$eventId" params={{ eventId: "festival-aabent-par" }}>
                Tilmeld dig Åbent par
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Seneste resultater */}
      <Section
        label="Seneste resultater"
        titel="Resultater fra klub, distrikt og forbund"
        handling={
          <Button asChild variant="outline">
            <Link to="/resultater">
              Alle resultater <ArrowRight />
            </Link>
          </Button>
        }
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
          <table className="w-full text-sm">
            <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Dato</th>
                <th className="px-4 py-3">Turnering</th>
                <th className="hidden px-4 py-3 sm:table-cell">Klub / arrangør</th>
                <th className="px-4 py-3">Vinder</th>
                <th className="px-4 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {senesteResultater.map((r) => (
                <tr key={r.id} className="border-t border-border/70 hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{r.dato}</td>
                  <td className="px-4 py-3 font-semibold">{r.turnering}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{r.klub}</td>
                  <td className="px-4 py-3">{r.vinder}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* BC3 + Dansk Bridge + guld/sølv */}
      <Section label="For klubber og medlemmer" titel="Systemer, blad og turneringstyper">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-brand-deep text-primary-foreground">
            <CardContent className="p-7">
              <MonitorCog className="mb-4 size-7 text-accent" />
              <h3 className="text-2xl font-bold">BridgeCentral / BC3</h3>
              <p className="mt-3 text-sm text-primary-foreground/80">
                Forbundets system til medlems- og klubadministration, turneringer, resultater,
                handicap og mesterpoint. Se vejledninger, support og den kommende online udgave.
              </p>
              <Button asChild variant="hero" className="mt-6">
                <Link to="/bc3">Gå til BC3</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-7">
              <Newspaper className="mb-4 size-7 text-accent" />
              <h3 className="text-2xl font-bold">Dansk Bridge</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Forbundets medlemsblad med reportager, spilanalyser og stof fra klubberne. Læs seneste
                nummer og find artikelarkivet.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/om-dbf">Læs Dansk Bridge</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-7">
              <Trophy className="mb-4 size-7 text-accent" />
              <h3 className="text-2xl font-bold">Guld, sølv og åbne turneringer</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Alle åbne turneringer i Danmark samlet i én kalender — med point, arrangør, pris og
                direkte tilmelding.
              </p>
              <div className="mt-4 flex gap-2">
                <PointBadge point="Guld" />
                <PointBadge point="Sølv" />
                <PointBadge point="Bronze" />
              </div>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/turneringer">Se kalenderen</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Lær at spille bridge + inspiration */}
      <section className="bg-sand py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:px-8">
          <Card className="overflow-hidden">
            <img
              src={laerBillede}
              alt="Undervisning i bridge omkring et bord"
              width={1200}
              height={900}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
            <CardContent className="p-7">
              <GraduationCap className="mb-3 size-7 text-accent" />
              <h3 className="text-2xl font-bold">Lær at spille bridge</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Bridge kan læres i alle aldre. Over 90 klubber udbyder begynderkurser, og du kan
                starte som kursist i Kursusklub 9999, indtil du finder din klub.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="accent">
                  <Link to="/turneringer">Find et kursus</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/$klubId" params={{ klubId: "9999" }}>
                    Kursusklub 9999
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-7">
              <Users className="mb-3 size-7 text-accent" />
              <h3 className="text-2xl font-bold">Inspiration til klubber</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Idéer og værktøjer til klubbestyrelsen: medlemshvervning, undervisning, turneringsformer
                og en klubhjemmeside der er klar til brug fra dag ét.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  ["Klubhjemmeside på bridge.dk", "Standardskabelon med eget indhold, logo og farver."],
                  ["Turneringstilmelding", "Lad medlemmerne tilmelde sig online — også til klubturneringer."],
                  ["Online BC3", "Klubadministration i browseren, samme sted som klubbens side."],
                ].map(([t, b]) => (
                  <li key={t} className="rounded-lg border border-border bg-background p-4">
                    <p className="font-semibold">{t}</p>
                    <p className="text-muted-foreground">{b}</p>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/bc3">Værktøjer til klubben</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bridgebutikken */}
      <Section
        label="Bridgebutikken"
        titel="Alt til klubben og spilleren"
        handling={
          <Button asChild variant="outline">
            <Link to="/butik">
              Gå til butikken <ArrowRight />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={butikBillede}
              alt="Spillekort, meldekasser og bridgebøger"
              width={1400}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {varer.slice(0, 4).map((v) => (
              <Card key={v.id}>
                <CardContent className="p-5">
                  {v.maerkat && (
                    <Badge variant="secondary" className="mb-2">
                      {v.maerkat}
                    </Badge>
                  )}
                  <h3 className="font-bold leading-snug">{v.navn}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{v.kategori}</p>
                  <p className="mt-3 font-display text-lg font-bold text-accent">{v.pris}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Nyheder */}
      <Section label="Nyheder" titel="Fra klubberne og forbundet">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nyheder.map((n) => (
            <article key={n.titel} className="rounded-xl border border-border bg-card p-5 card-shadow">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <ShoppingBag className="hidden" />
                <span className="font-semibold uppercase tracking-wide text-accent">{n.kategori}</span>
                <span>·</span>
                <span>{n.dato}</span>
              </div>
              <h3 className="font-bold">{n.titel}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{n.resume}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
