import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DevInfo, PointBadge, Section } from "@/components/site/Bits";
import { ClubFeatureCard } from "@/components/site/ClubFeatureCard";
import type { KlubIndholdSektion } from "@/lib/demo-data";
import { begivenheder, findKlub, resultater, spilleholdId } from "@/lib/demo-data";
import {
  Award,
  BarChart3,
  CalendarDays,
  Clock,
  ExternalLink,
  LineChart,
  LogIn,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const alleFaner = [
  "Forside",
  "Klubben",
  "Spillehold",
  "Aktiviteter",
  "Spilletider",
  "Turneringer",
  "Tilmelding",
  "Resultater",
  "Handicap",
  "Mesterpoint",
  "Nyheder",
  "Kontakt",
] as const;
type Fane = (typeof alleFaner)[number];

/** Viser klubbens CMS-indhold. Samme komponent for alle klubber. */
function KlubIndhold({ sektioner }: { sektioner: KlubIndholdSektion[] }) {
  const almindelige = sektioner.filter((s) => !s.accordion);
  const foldede = sektioner.filter((s) => s.accordion);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {almindelige.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-bold">{s.titel}</h3>
              <div className="mt-3 space-y-4 text-sm leading-relaxed">
                {s.afsnit.map((a, i) => (
                  <div key={s.id + i}>
                    {a.titel && <p className="mb-1.5 font-semibold">{a.titel}</p>}
                    {a.tekst && <p className="text-muted-foreground">{a.tekst}</p>}
                    {a.punkter && (
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted-foreground">
                        {a.punkter.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {foldede.length > 0 && (
        <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-5 card-shadow">
          {foldede.map((s) => (
            <AccordionItem key={s.id} value={s.id}>
              <AccordionTrigger className="text-left font-display text-base font-bold">
                {s.titel}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm leading-relaxed">
                {s.afsnit.map((a, i) => (
                  <div key={s.id + i}>
                    {a.titel && <p className="mb-1.5 font-semibold">{a.titel}</p>}
                    {a.tekst && <p className="text-muted-foreground">{a.tekst}</p>}
                    {a.punkter && (
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted-foreground">
                        {a.punkter.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export const Route = createFileRoute("/$klubId")({
  loader: ({ params }) => {
    const klub = findKlub(params.klubId);
    if (!klub || klub.nr === "5000") throw notFound();
    return { klub };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Klub ikke fundet – bridge.dk" }],
      };
    }
    const k = loaderData.klub;
    const t = `${k.navn} (${k.nr}) – bridge.dk`;
    const d = `${k.navn} i ${k.by}: spillehold, klubinformation, nyheder og kontakt.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: KlubSide,
});

function KlubSide() {
  const { klub } = Route.useLoaderData();
  const [fane, setFane] = useState<Fane>("Forside");

  const klubEvents = begivenheder.filter((b) => b.klubNr === klub.nr);
  const klubResultater = resultater.filter((r) => r.klubNr === klub.nr);
  const harGrupper = !!klub.undergrupper?.length;
  const harSpillehold = !!klub.spillehold?.length;
  const links = klub.eksterneLinks ?? {};
  /* Faner vises kun, når klubben har indhold eller link til dem. */
  const faner = alleFaner.filter((f) => {
    if (harSpillehold && klub.aktivitetskort?.length) {
      return ["Forside", "Klubben", "Spillehold", "Aktiviteter", "Nyheder", "Kontakt"].includes(f);
    }
    if (harSpillehold) return ["Forside", "Klubben", "Spillehold", "Nyheder", "Kontakt"].includes(f);
    if (klub.aktivitetskort?.length) {
      return ["Forside", "Klubben", "Aktiviteter", "Turneringer", "Resultater", "Handicap", "Mesterpoint", "Nyheder", "Kontakt"].includes(f);
    }
    if (klub.rekrutteringskort?.length) return ["Forside", "Klubben", "Kontakt"].includes(f);
    if (f === "Spillehold") return false;
    return (f !== "Handicap" || !!links.handicapUrl) && (f !== "Mesterpoint" || !!links.masterpointsUrl);
  });
  const adresseLinjer = [
    klub.spillestedNavn,
    klub.adresse,
    klub.postnummer ? `${klub.postnummer} ${klub.by}` : undefined,
  ].filter(Boolean) as string[];
  const fuldAdresse = adresseLinjer.length > 1 ? adresseLinjer.join(", ") : klub.adresse;
  const kortLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fuldAdresse)}`;

  /* Klubtemaet demonstrerer, at udseendet er konfigurerbart pr. klub. */
  const tema = {
    "--primary": klub.tema.primary,
    "--accent": klub.tema.accent,
    "--ring": klub.tema.primary,
  } as React.CSSProperties;

  return (
    <div style={tema}>
      {/* Klubbens header */}
      <div className="hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="flex flex-wrap items-start gap-6">
            <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-primary-foreground/95 font-display text-2xl font-bold text-primary">
              {klub.logoTekst}
            </div>
            <div className="min-w-[16rem] flex-1">
              <p className="section-label mb-1">
                {klub.headerLabel ?? `Klubnr. ${klub.nr} · ${klub.distrikt}`}
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">{klub.navn}</h1>
              <p className="mt-2 text-primary-foreground/80">{klub.tema.overskrift}</p>
              <div className="mt-3 flex flex-wrap items-start gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
                {adresseLinjer.length > 0 && (
                  <span className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <span className="font-semibold">Spillested</span>
                      {adresseLinjer.length > 1 ? (
                        adresseLinjer.map((l) => <span key={l} className="block">{l}</span>)
                      ) : (
                        <span className="block">{adresseLinjer[0]}</span>
                      )}
                    </span>
                  </span>
                )}
                {typeof klub.medlemmer === "number" && (
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4" /> {klub.medlemmer} medlemmer
                  </span>
                )}
                <Badge variant="secondary" className="text-xs">
                  Udseende: {klub.tema.stil === "standard" ? "bridge.dk standard" : "klubbens eget"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* BC3-login for den aktuelle klub — klubnummeret er dynamisk. */}
              <Button asChild variant="hero" size="lg">
                <Link to="/bc3/login/$fdbNo" params={{ fdbNo: klub.nr }}>
                  <LogIn /> LOG IND I {klub.nr}
                </Link>
              </Button>
              <Button asChild variant="subtle" size="sm">
                <Link to="/bc3/online/$clubNumber/dashboard" params={{ clubNumber: klub.nr }}>
                  Klubadministration
                </Link>
              </Button>
              {klub.kontaktCta ? (
                <Button variant="subtle" size="lg" onClick={() => setFane("Kontakt")}>
                  {klub.kontaktCta}
                </Button>
              ) : harSpillehold ? (
                klub.eksterneLinks?.tilmeldingUrl ? (
                  <Button asChild variant="subtle" size="lg">
                    <a
                      href={klub.eksterneLinks.tilmeldingUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Tilmelding <ExternalLink />
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="subtle" size="lg">
                    <Link to="/$klubId/$subclubId" params={{ klubId: klub.nr, subclubId: "3" }}>
                      Tilmelding
                    </Link>
                  </Button>
                )
              ) : (
                <Button variant="subtle" size="lg" onClick={() => setFane("Tilmelding")}>
                  Tilmelding
                </Button>
              )}
            </div>
          </div>
        </div>

        <nav className="border-t border-primary-foreground/15">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 lg:px-8">
            {faner.map((f) => (
              <button
                key={f}
                onClick={() => setFane(f)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 font-display text-sm font-semibold transition-colors ${
                  fane === f
                    ? "border-accent text-primary-foreground"
                    : "border-transparent text-primary-foreground/65 hover:text-primary-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {fane === "Forside" && (
        <>
           <Section titel={klub.forsideTitel ?? `Velkommen til ${klub.navn}`} beskrivelse={klub.beskrivelse}>
            {!harSpillehold && !klub.rekrutteringskort?.length && <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <Clock className="mb-3 size-6 text-accent" />
                  <h3 className="font-display text-lg font-bold">Spilletider</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {klub.spilletider.slice(0, 4).map((s) => (
                      <li key={s.dag + s.tid} className="flex justify-between gap-3">
                        <span className="font-semibold">{s.dag}</span>
                        <span className="text-muted-foreground">{s.tid}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="link" className="mt-2 px-0" onClick={() => setFane("Spilletider")}>
                    Alle spilletider
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <CalendarDays className="mb-3 size-6 text-accent" />
                  <h3 className="font-display text-lg font-bold">Kommende begivenheder</h3>
                  <ul className="mt-3 space-y-3 text-sm">
                    {klubEvents.slice(0, 3).map((b) => (
                      <li key={b.id}>
                        <Link
                          to="/turneringer/$eventId"
                          params={{ eventId: b.id }}
                          className="font-semibold hover:text-accent"
                        >
                          {b.titel}
                        </Link>
                        <p className="text-muted-foreground">{b.dato}</p>
                      </li>
                    ))}
                    {!klubEvents.length && (
                      <li className="text-muted-foreground">Ingen begivenheder i demodata.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="mb-3 size-6 text-accent" />
                  <h3 className="font-display text-lg font-bold">Ny i bridge?</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Kom forbi en spilleaften og hør nærmere, eller tilmeld dig klubbens kursus. Vi
                    hjælper dig med at finde en partner.
                  </p>
                  <Button variant="accent" className="mt-4" onClick={() => setFane("Kontakt")}>
                    Kontakt klubben
                  </Button>
                </CardContent>
              </Card>
            </div>}
          </Section>

          {harSpillehold && (
            <Section
              label="Vores spillehold"
              titel={klub.spilleholdTitel ?? `Spil bridge i ${klub.by}`}
              beskrivelse={
                klub.spilleholdBeskrivelse ??
                "Vælg det spillehold eller den aktivitet, der passer dig. Hvert spillehold har sin egen side med turneringer og resultater."
              }
              className="bg-secondary/40"
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {klub.spillehold?.map((hold) => (
                  <ClubFeatureCard
                    key={spilleholdId(hold)}
                    ikon={<CalendarDays className="size-6" />}
                    titel={hold.navn}
                    tekst={[hold.spilletid, hold.aktivitet, hold.beskrivelse].filter(Boolean).join(" · ")}
                    handling={
                      <Button asChild size="lg" className="w-full">
                        <Link
                          to="/$klubId/$subclubId"
                          params={{ klubId: klub.nr, subclubId: spilleholdId(hold) }}
                        >
                          {hold.clubNo === 2 ? "Se turneringer" : `Se ${hold.navn}`}
                        </Link>
                      </Button>
                    }
                  />
                ))}
              </div>
            </Section>
          )}

          {klub.aktivitetskort?.length ? (
            <Section
              label="Klubbens aktiviteter"
              titel={klub.aktiviteterTitel ?? "Aktiviteter"}
              {...(klub.aktiviteterBeskrivelse ? { beskrivelse: klub.aktiviteterBeskrivelse } : {})}
              {...(!harSpillehold ? { className: "bg-secondary/40" } : {})}
            >
              <div className="grid gap-6 md:grid-cols-3">
                {klub.aktivitetskort.map((kort) => (
                  <ClubFeatureCard
                    key={kort.titel}
                    ikon={<CalendarDays className="size-6" />}
                    titel={kort.titel}
                    tekst={kort.tekst}
                    handling={null}
                  />
                ))}
              </div>
            </Section>
          ) : null}

          {klub.rekrutteringskort?.length ? (
            <Section
              label={klub.rekrutteringsLabel ?? "Kom med"}
              titel={klub.rekrutteringsTitel ?? "Bridge, fællesskab og nye udfordringer"}
              {...(klub.rekrutteringsBeskrivelse ? { beskrivelse: klub.rekrutteringsBeskrivelse } : {})}
              {...(!klub.aktivitetskort?.length ? { className: "bg-secondary/40 pt-10" } : {})}
            >
              <div className="grid gap-6 md:grid-cols-3">
                {klub.rekrutteringskort.map((kort) => (
                  <ClubFeatureCard
                    key={kort.titel}
                    ikon={<Sparkles className="size-6" />}
                    titel={kort.titel}
                    tekst={kort.tekst}
                    handling={
                      kort.titel === "Vil du være med?" ? (
                        <Button className="w-full" size="lg" onClick={() => setFane("Kontakt")}>
                          Kontakt os
                        </Button>
                      ) : null
                    }
                  />
                ))}
              </div>
            </Section>
          ) : null}

          {(links.masterpointsUrl || links.rankingUrl || links.bronzeStandingsUrl || links.handicapUrl) && (
            <Section
              label="Danmarks Bridgeforbund"
              titel={klub.dbfLinksTitel ?? "Mesterpoint og klubstillinger"}
              beskrivelse={klub.dbfLinksBeskrivelse ?? `Se de klubfælles oplysninger for ${klub.navn}.`}
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {links.masterpointsUrl && (
                  <ClubFeatureCard
                    ikon={<Award className="size-6" />}
                    titel="Mesterpoint"
                    tekst={klub.masterpointsTekst ?? `Se ${klub.navn}s medlemmer fordelt efter mesterpointtitel samt deres bronze-, sølv-, guld- og samlede mesterpoint.`}
                    handling={
                      <Button asChild size="lg" className="w-full">
                        <a href={links.masterpointsUrl} target="_blank" rel="noreferrer noopener">
                          Se mesterpoint <ExternalLink />
                        </a>
                      </Button>
                    }
                  />
                )}
                {links.rankingUrl && (
                  <ClubFeatureCard
                    ikon={<Trophy className="size-6" />}
                    titel="Rangliste"
                    tekst={klub.rankingTekst ?? `Se ${klub.navn}s officielle rangliste hos Danmarks Bridgeforbund.`}
                    handling={
                      <Button asChild size="lg" className="w-full">
                        <a href={links.rankingUrl} target="_blank" rel="noreferrer noopener">
                          Se rangliste <ExternalLink />
                        </a>
                      </Button>
                    }
                  />
                )}
                {links.bronzeStandingsUrl && (
                  <ClubFeatureCard
                    ikon={<BarChart3 className="size-6" />}
                    titel="Bronzestilling"
                    tekst={`Se ${klub.navn}s aktuelle bronzestilling.`}
                    handling={
                      <Button asChild size="lg" className="w-full">
                        <a href={links.bronzeStandingsUrl} target="_blank" rel="noreferrer noopener">
                          Se bronzestilling <ExternalLink />
                        </a>
                      </Button>
                    }
                  />
                )}
                {links.handicapUrl && (
                  <ClubFeatureCard
                    ikon={<LineChart className="size-6" />}
                    titel="Handicap"
                    tekst="Se medlemmernes aktuelle handicap og klubrangering."
                    handling={
                      <Button asChild size="lg" className="w-full">
                        <a href={links.handicapUrl} target="_blank" rel="noreferrer noopener">
                          Se handicapliste <ExternalLink />
                        </a>
                      </Button>
                    }
                  />
                )}
              </div>
            </Section>
          )}

          {klub.resultatkort?.length ? (
            <Section
              label="Officielt resultatsystem"
              titel={klub.resultaterTitel ?? "Turneringer og resultater"}
              {...(klub.resultaterBeskrivelse ? { beskrivelse: klub.resultaterBeskrivelse } : {})}
              className="bg-secondary/40"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {klub.resultatkort.map((kort) => (
                  <ClubFeatureCard
                    key={kort.titel}
                    ikon={kort.titel === "Resultater" ? <Trophy className="size-6" /> : <CalendarDays className="size-6" />}
                    titel={kort.titel}
                    tekst={kort.tekst}
                    handling={
                      <Button asChild size="lg" className="w-full">
                        <a href={kort.url} target="_blank" rel="noreferrer noopener">
                          {kort.knaptekst} <ExternalLink />
                        </a>
                      </Button>
                    }
                  />
                ))}
              </div>
            </Section>
          ) : null}

          {!harSpillehold && !!links.resultsUrl && !klub.resultatkort?.length && (
            <Section
              label="Klubbens tal"
              titel="Turneringer, resultater, handicap og mesterpoint"
              beskrivelse={`Resultater, handicap og mesterpoint hentes fra Danmarks Bridgeforbunds egne systemer for klubnummer ${klub.nr}.`}
              className="bg-secondary/40"
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <ClubFeatureCard
                  ikon={<CalendarDays className="size-6" />}
                  titel="Turneringer"
                  tekst="Se klubbens turneringer og spilleaftener i sæsonen."
                  handling={
                    <Button size="lg" className="w-full" onClick={() => setFane("Turneringer")}>
                      Se turneringer
                    </Button>
                  }
                />
                <ClubFeatureCard
                  ikon={<Trophy className="size-6" />}
                  titel="Seneste resultater"
                  tekst="Se klubbens resultater i forbundets resultatsystem."
                  handling={
                    <Button size="lg" className="w-full" onClick={() => setFane("Resultater")}>
                      Se resultater
                    </Button>
                  }
                />
                <ClubFeatureCard
                  ikon={<LineChart className="size-6" />}
                  titel="Handicap"
                  tekst="Se medlemmernes aktuelle handicap og klubrangering."
                  handling={
                    links.handicapUrl ? (
                      <Button size="lg" className="w-full" onClick={() => setFane("Handicap")}>
                        Se handicap
                      </Button>
                    ) : (
                      <Badge variant="secondary">Kommer senere</Badge>
                    )
                  }
                />
                <ClubFeatureCard
                  ikon={<Award className="size-6" />}
                  titel="Mesterpoint"
                  tekst="Se klubbens mesterpoint og rangliste."
                  handling={
                    links.masterpointsUrl ? (
                      <Button size="lg" className="w-full" onClick={() => setFane("Mesterpoint")}>
                        Se mesterpoint
                      </Button>
                    ) : (
                      <Badge variant="secondary">Kommer senere</Badge>
                    )
                  }
                />
              </div>
            </Section>
          )}

          {klub.aabentHus && (
            <Section
              label="Ny i bridge"
              titel={`Spil bridge i ${klub.by}`}
              beskrivelse={klub.aabentHus.tekst}
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                <Card>
                  <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
                    <div>
                      <p className="section-label mb-1">Spilstart</p>
                      <p className="text-lg font-semibold">{klub.aabentHus.spilstart}</p>
                    </div>
                    {klub.aabentHus.undervisning && (
                      <div>
                        <p className="section-label mb-1">Undervisning</p>
                        <p className="text-lg font-semibold">{klub.aabentHus.undervisning}</p>
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <p className="section-label mb-1">Pris ved åbent hus</p>
                      <p className="text-lg font-semibold">{klub.aabentHus.pris}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold">Tilmeld dig åbent hus</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {harSpillehold
                        ? "Læs om aftenholdet, undervisningen og klubbens åbne mandag aften."
                        : "Tilmeldingen sker indtil videre på klubbens eksisterende hjemmeside. Senere overtages den af bridge.dk's fælles tilmelding."}
                    </p>
                    {harSpillehold ? (
                      <Button asChild size="lg" variant="accent" className="mt-4 w-full">
                        <Link to="/$klubId/$subclubId" params={{ klubId: klub.nr, subclubId: "3" }}>
                          Læs om Mandag aften / åbent hus
                        </Link>
                      </Button>
                    ) : klub.aabentHus.tilmeldingUrl ? (
                      <Button asChild size="lg" variant="accent" className="mt-4 w-full">
                        <a
                          href={klub.aabentHus.tilmeldingUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Tilmeld dig åbent hus <ExternalLink />
                        </a>
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            </Section>
          )}

          {harGrupper && (
            <Section
              titel="Klubber og spillegrupper i centret"
              beskrivelse="Centret rummer flere selvstændige klubber og spillegrupper under samme tag."
              className="pt-0"
            >
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {klub.undergrupper!.map((g) => (
                  <Card key={g.navn}>
                    <CardContent className="p-5">
                      <h3 className="font-bold">{g.navn}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{g.beskrivelse}</p>
                      <p className="mt-3 text-sm font-semibold">{g.medlemmer} medlemmer</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          )}

          {(!klub.rekrutteringskort?.length || klub.nyheder.length > 0) && <Section titel="Nyt fra klubben" className="pt-0">
            <div className="grid gap-5 md:grid-cols-3">
              {klub.nyheder.map((n) => (
                <article key={n.titel} className="rounded-xl border border-border bg-card p-5 card-shadow">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{n.dato}</p>
                  <h3 className="mt-1 font-bold">{n.titel}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{n.tekst}</p>
                </article>
              ))}
            </div>
          </Section>}
        </>
      )}

      {fane === "Spillehold" && harSpillehold && (
        <Section
          titel="Spillehold og aktiviteter"
          beskrivelse="Vælg et spillehold for at se tider, turneringer og officielle resultater."
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {klub.spillehold?.map((hold) => (
              <ClubFeatureCard
                key={spilleholdId(hold)}
                ikon={<CalendarDays className="size-6" />}
                titel={hold.navn}
                tekst={[hold.spilletid, hold.aktivitet, hold.beskrivelse].filter(Boolean).join(" · ")}
                handling={
                  <Button asChild size="lg" className="w-full">
                    <Link
                      to="/$klubId/$subclubId"
                      params={{ klubId: klub.nr, subclubId: spilleholdId(hold) }}
                    >
                      Åbn spillehold
                    </Link>
                  </Button>
                }
              />
            ))}
          </div>
        </Section>
      )}

      {fane === "Aktiviteter" && klub.aktivitetskort?.length && (
        <Section
          label="Klubbens aktiviteter"
          titel={klub.aktiviteterTitel ?? "Aktiviteter"}
          {...(klub.aktiviteterBeskrivelse ? { beskrivelse: klub.aktiviteterBeskrivelse } : {})}
        >
          <div className="grid gap-6 md:grid-cols-3">
            {klub.aktivitetskort.map((kort) => (
              <ClubFeatureCard
                key={kort.titel}
                ikon={<CalendarDays className="size-6" />}
                titel={kort.titel}
                tekst={kort.tekst}
                handling={null}
              />
            ))}
          </div>
        </Section>
      )}

      {fane === "Klubben" && (
        <Section titel="Om klubben" beskrivelse={klub.beskrivelse}>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardContent className="space-y-3 p-6 text-sm">
                <h3 className="font-display text-lg font-bold">Praktiske oplysninger</h3>
                <p>
                  <span className="text-muted-foreground">Klubnummer:</span>{" "}
                  <span className="font-mono">{klub.nr}</span>
                </p>
                {adresseLinjer.length > 0 && (
                  <p>
                    <span className="text-muted-foreground">Adresse:</span> {fuldAdresse}
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">Distrikt:</span> {klub.distrikt}
                </p>
                <p>
                  <span className="text-muted-foreground">Kreds:</span> {klub.kreds}
                </p>
                <p>
                  <span className="text-muted-foreground">Medlemmer:</span>{" "}
                  {typeof klub.medlemmer === "number" ? klub.medlemmer : "Ikke oplyst"}
                </p>
              </CardContent>
            </Card>
            {adresseLinjer.length > 0 && <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-bold">Klubbens udseende på bridge.dk</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Klubben kan selv vælge logo, farver, billeder, typografi, indhold og sidestruktur.
                  Denne klub bruger{" "}
                  {klub.tema.stil === "standard"
                    ? "bridge.dk’s standardudtryk."
                    : "sit eget farvesæt oven på standardskabelonen."}
                </p>
                <div className="mt-4 flex gap-3">
                  <span
                    className="size-10 rounded-lg border border-border"
                    style={{ background: klub.tema.primary }}
                  />
                  <span
                    className="size-10 rounded-lg border border-border"
                    style={{ background: klub.tema.accent }}
                  />
                  <span className="grid size-10 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
                    {klub.logoTekst}
                  </span>
                </div>
              </CardContent>
            </Card>}
          </div>
          {klub.klubIndhold?.length ? (
            <div className="mt-8">
              <KlubIndhold sektioner={klub.klubIndhold} />
            </div>
          ) : null}
          <DevInfo
            titel="Klubstamdata"
            felter={[
              { ui: "Klub", system: "BridgeOrg", tabel: "BRIDGEKLUBBER" },
              { ui: "Klub (lokalt)", system: "BC3", database: `${klub.nr}.fdb`, tabel: "MEM_CLUB" },
              { ui: "Medlemstal", system: "BridgeOrg", tabel: "MEDLEMSKABER" },
            ]}
          />
        </Section>
      )}

      {fane === "Spilletider" && (
        <Section titel="Spilletider" beskrivelse="Klubbens faste spilletider i den aktuelle sæson.">
          <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Dag</th>
                  <th className="px-4 py-3">Tid</th>
                  <th className="px-4 py-3">Spilleform</th>
                  {harGrupper && <th className="px-4 py-3">Klub / gruppe</th>}
                </tr>
              </thead>
              <tbody>
                {klub.spilletider.map((s) => (
                  <tr key={s.dag + s.tid + s.beskrivelse} className="border-t border-border/70">
                    <td className="px-4 py-3 font-semibold">{s.dag}</td>
                    <td className="px-4 py-3 font-mono">{s.tid}</td>
                    <td className="px-4 py-3">{s.beskrivelse}</td>
                    {harGrupper && (
                      <td className="px-4 py-3 text-muted-foreground">{s.gruppe ?? "—"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {fane === "Turneringer" && (
        klub.resultatkort?.length ? (
          <Section
            titel="Turneringsoversigt"
            beskrivelse="Turneringer hentes fra Danmarks Bridgeforbunds officielle resultatsystem."
          >
            <div className="max-w-xl">
              {klub.resultatkort.slice(0, 1).map((kort) => (
                <ClubFeatureCard
                  key={kort.titel}
                  ikon={<CalendarDays className="size-6" />}
                  titel={kort.titel}
                  tekst={kort.tekst}
                  handling={
                    <Button asChild size="lg" className="w-full">
                      <a href={kort.url} target="_blank" rel="noreferrer noopener">
                        {kort.knaptekst} <ExternalLink />
                      </a>
                    </Button>
                  }
                />
              ))}
            </div>
          </Section>
        ) : (
        <Section titel="Turneringskalender" beskrivelse="Klubbens turneringer, kurser og events.">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {klubEvents.map((b) => (
              <Card key={b.id}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary">{b.type}</Badge>
                    <PointBadge point={b.point} />
                  </div>
                  <h3 className="font-bold">{b.titel}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {b.dato} · {b.tid}
                  </p>
                  <p className="mt-3 text-sm">{b.pris}</p>
                  <Button asChild size="sm" variant="accent" className="mt-4">
                    <Link to="/turneringer/$eventId" params={{ eventId: b.id }}>
                      Se og tilmeld
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {!klubEvents.length && (
              <p className="text-muted-foreground">Ingen turneringer i demodata for denne klub.</p>
            )}
          </div>
        </Section>
        )
      )}

      {fane === "Tilmelding" && (
        <Section
          titel="Tilmelding"
          beskrivelse="Tilmelding til klubbens turneringer sker i samme system som forbundets turneringer."
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Begivenhed</th>
                  <th className="px-4 py-3">Form</th>
                  <th className="hidden px-4 py-3 md:table-cell">Frist</th>
                  <th className="px-4 py-3">Pladser</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {klubEvents.map((b) => (
                  <tr key={b.id} className="border-t border-border/70">
                    <td className="px-4 py-3 font-semibold">{b.titel}</td>
                    <td className="px-4 py-3 capitalize">{b.tilmeldingsform}</td>
                    <td className="hidden px-4 py-3 md:table-cell">{b.tilmeldingsfrist}</td>
                    <td className="px-4 py-3">
                      {b.tilmeldte}/{b.pladser}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild size="sm" variant="accent">
                        <Link to="/turneringer/$eventId/tilmelding" params={{ eventId: b.id }}>
                          Tilmeld
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DevInfo
            titel="Tilmelding"
            felter={[
              { ui: "Tilmelding", system: "BC3", database: `${klub.nr}.fdb`, tabel: "SECTIONPLAYER" },
              { ui: "Hold", system: "BC3", database: `${klub.nr}.fdb`, tabel: "SECTIONTEAM" },
            ]}
          />
        </Section>
      )}

      {fane === "Resultater" && (
        klub.resultatkort?.length ? (
          <Section titel="Resultater" beskrivelse="Resultater hentes fra Danmarks Bridgeforbunds officielle resultatsystem.">
            <div className="max-w-xl">
              {klub.resultatkort.slice(1, 2).map((kort) => (
                <ClubFeatureCard
                  key={kort.titel}
                  ikon={<Trophy className="size-6" />}
                  titel={kort.titel}
                  tekst={kort.tekst}
                  handling={
                    <Button asChild size="lg" className="w-full">
                      <a href={kort.url} target="_blank" rel="noreferrer noopener">
                        {kort.knaptekst} <ExternalLink />
                      </a>
                    </Button>
                  }
                />
              ))}
            </div>
          </Section>
        ) : (
        <Section titel="Resultater" beskrivelse="Resultater fra klubbens turneringer.">
          {links.resultsUrl && (
            <Card className="mb-6">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
                <p className="max-w-xl text-sm text-muted-foreground">
                  Klubbens officielle resultater ligger i Danmarks Bridgeforbunds resultatsystem for
                  klubnummer {klub.nr}. Tabellen nedenfor er platformens demodata.
                </p>
                <Button asChild size="lg">
                  <a href={links.resultsUrl} target="_blank" rel="noreferrer noopener">
                    <Trophy /> Åbn klubbens resultater <ExternalLink />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Dato</th>
                  <th className="px-4 py-3">Turnering</th>
                  <th className="px-4 py-3">Vinder</th>
                  <th className="px-4 py-3 text-right">Score</th>
                  <th className="px-4 py-3 text-right">Deltagere</th>
                </tr>
              </thead>
              <tbody>
                {klubResultater.map((r) => (
                  <tr key={r.id} className="border-t border-border/70">
                    <td className="px-4 py-3 text-muted-foreground">{r.dato}</td>
                    <td className="px-4 py-3 font-semibold">{r.turnering}</td>
                    <td className="px-4 py-3">{r.vinder}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.score}</td>
                    <td className="px-4 py-3 text-right">{r.deltagere}</td>
                  </tr>
                ))}
                {!klubResultater.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      Ingen resultater i demodata.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <DevInfo
            titel="Resultatvisning"
            felter={[
              { ui: "Resultat", system: "BC3", database: `${klub.nr}.fdb`, tabel: "RESULT" },
              { ui: "Sektion", system: "BC3", database: `${klub.nr}.fdb`, tabel: "SECTION" },
            ]}
          />
        </Section>
        )
      )}

      {fane === "Handicap" && links.handicapUrl && (
        <Section
          titel="Handicap"
          beskrivelse="Se medlemmernes aktuelle handicap og klubrangering. Tallene kommer fra Danmarks Bridgeforbunds handicapsystem."
        >
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
              <p className="max-w-xl text-sm text-muted-foreground">
                Handicaplisten vedligeholdes af forbundet og åbnes på medlemmer.bridge.dk for
                klubnummer {klub.nr}.
              </p>
              <Button asChild size="lg">
                <a href={links.handicapUrl} target="_blank" rel="noreferrer noopener">
                  <BarChart3 /> Åbn klubbens handicapliste <ExternalLink />
                </a>
              </Button>
            </CardContent>
          </Card>
        </Section>
      )}

      {fane === "Mesterpoint" && links.masterpointsUrl && (
        <Section
          titel="Mesterpoint"
          beskrivelse="Se klubbens mesterpoint og rangliste hos Danmarks Bridgeforbund."
        >
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
              <p className="max-w-xl text-sm text-muted-foreground">
                Ranglisten er forbundets officielle mesterpointliste for klubnummer {klub.nr}.
              </p>
              <Button asChild size="lg">
                <a href={links.masterpointsUrl} target="_blank" rel="noreferrer noopener">
                  <Award /> Åbn klubbens rangliste <ExternalLink />
                </a>
              </Button>
            </CardContent>
          </Card>
        </Section>
      )}

      {fane === "Nyheder" && (
        <Section titel="Nyheder" beskrivelse="Klubbens egne nyheder redigeres af klubbens webansvarlige.">
          <div className="grid gap-5 md:grid-cols-2">
            {klub.nyheder.map((n) => (
              <article key={n.titel} className="rounded-xl border border-border bg-card p-6 card-shadow">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{n.dato}</p>
                <h3 className="mt-1 text-xl font-bold">{n.titel}</h3>
                <p className="mt-2 text-muted-foreground">{n.tekst}</p>
              </article>
            ))}
          </div>
        </Section>
      )}

      {fane === "Kontakt" && (
        <Section titel="Kontakt" beskrivelse={`Kontakt ${klub.navn}.`}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {klub.kontakt.map((k) => (
              <Card key={k.rolle}>
                <CardContent className="p-6">
                  <p className="section-label mb-1">{k.rolle}</p>
                  <h3 className="text-lg font-bold">{k.navn}</h3>
                  {k.email && (
                    <p className="mt-3 flex items-center gap-2 text-sm">
                      <Mail className="size-4 shrink-0 text-accent" /> {k.email}
                    </p>
                  )}
                  {k.telefon && (
                    <p className="mt-1.5 flex items-center gap-2 text-sm">
                      <Phone className="size-4 shrink-0 text-accent" /> {k.telefon}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            <Card>
              <CardContent className="p-6">
                <p className="section-label mb-1">Klubnr. {klub.nr}</p>
                <h3 className="text-lg font-bold">Spillested</h3>
                <p className="mt-3 flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    {adresseLinjer.length > 1
                      ? adresseLinjer.map((l) => <span key={l} className="block">{l}</span>)
                      : klub.adresse}
                  </span>
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <a href={kortLink} target="_blank" rel="noreferrer noopener">
                    Vis på kort <ExternalLink />
                  </a>
                </Button>
              </CardContent>
            </Card>
            {links.legacyWebsiteUrl && (
              <Card>
                <CardContent className="p-6">
                  <p className="section-label mb-1">Klubbens tidligere side</p>
                  <h3 className="text-lg font-bold">bridge.dk/{klub.nr} (gammel version)</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Indholdet er ved at blive flyttet til den nye platform. Den gamle side er stadig
                    tilgængelig.
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <a href={links.legacyWebsiteUrl} target="_blank" rel="noreferrer noopener">
                      Åbn den gamle side <ExternalLink />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
            {klub.juniorInfoUrl && (
              <Card>
                <CardContent className="p-6">
                  <p className="section-label mb-1">Mere information</p>
                  <h3 className="text-lg font-bold">Juniorbridge i Danmark</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Læs om juniorbridge, juniorcamps, Ungdomsbridgeklubben og Dansk Skolebridge hos Danmarks Bridgeforbund.
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <a href={klub.juniorInfoUrl} target="_blank" rel="noreferrer noopener">
                      Læs om juniorbridge <ExternalLink />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
