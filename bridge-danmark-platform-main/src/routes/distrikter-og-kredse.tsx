import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  ChevronDown,
  ExternalLink,
  Landmark,
  MapPin,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHero, Section } from "@/components/site/Bits";
import {
  clubsInDistrict,
  organizationClubs,
  organizationCircuits,
  organizationDistricts,
} from "@/lib/organization-data";

export const Route = createFileRoute("/distrikter-og-kredse")({
  head: () => ({
    meta: [
      { title: "Distrikter og kredse – bridge.dk" },
      {
        name: "description",
        content: "Find kredse, distrikter og bridgeklubber i Danmarks Bridgeforbunds geografiske organisation.",
      },
      { property: "og:title", content: "Distrikter, kredse og klubber – bridge.dk" },
      {
        property: "og:description",
        content: "Oversigt over DBF's distrikter, kredse og bridgeklubber i Danmark.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DistrikterOgKredse,
});

function DistrikterOgKredse() {
  const [soeg, setSoeg] = useState("");
  const [kredsFilter, setKredsFilter] = useState("alle");
  const [aabneDistrikter, setAabneDistrikter] = useState<Set<number>>(new Set());
  const q = soeg.trim().toLocaleLowerCase("da");

  const kredse = useMemo(() => {
    return organizationCircuits
      .filter((circuit) => kredsFilter === "alle" || String(circuit.id) === kredsFilter)
      .map((circuit) => {
        const districts = organizationDistricts
          .filter((district) => district.circuitId === circuit.id)
          .map((district) => ({ ...district, clubs: clubsInDistrict(district.id) }));
        if (!q) return { circuit, districts };

        const circuitMatches = [circuit.name, circuit.geographicName, circuit.description, circuit.siteNumber]
          .some((value) => String(value ?? "").toLocaleLowerCase("da").includes(q));
        const matchingDistricts = districts.filter((district) => {
          const districtMatches = [district.name, district.description, district.siteNumber]
            .some((value) => String(value ?? "").toLocaleLowerCase("da").includes(q));
          const clubMatches = district.clubs.some((club) =>
            [club.name, club.city, club.clubNo].some((value) =>
              String(value).toLocaleLowerCase("da").includes(q),
            ),
          );
          return circuitMatches || districtMatches || clubMatches;
        });
        return { circuit, districts: matchingDistricts };
      })
      .filter(({ districts }) => districts.length > 0);
  }, [kredsFilter, q]);

  const alleDistrikter = organizationDistricts.map((district) => district.id);
  const alleErAabne = alleDistrikter.every((id) => aabneDistrikter.has(id));
  const erAaben = (districtId: number) => {
    if (q) {
      const district = organizationDistricts.find((item) => item.id === districtId);
      return organizationClubs.some(
        (club) =>
          club.districtId === districtId &&
          [club.name, club.city, club.clubNo].some((value) =>
            String(value).toLocaleLowerCase("da").includes(q),
          ),
      ) || String(district?.siteNumber ?? "").includes(q);
    }
    return aabneDistrikter.has(districtId);
  };

  const skiftDistrikt = (districtId: number) => {
    setAabneDistrikter((current) => {
      const next = new Set(current);
      if (next.has(districtId)) next.delete(districtId);
      else next.add(districtId);
      return next;
    });
  };

  const skiftAlle = () => {
    setAabneDistrikter(alleErAabne ? new Set() : new Set(alleDistrikter));
  };

  return (
    <>
      <PageHero
        label="Klub og medlem"
        titel="Distrikter, kredse og klubber"
        beskrivelse="Danmarks Bridgeforbund er organiseret i 4 kredse og 11 distrikter. Hver bridgeklub hører til et distrikt, og distrikterne er samlet i kredse. Her kan du finde hele organisationen og gå direkte til en kreds, et distrikt eller en klub."
      >
        <div className="flex max-w-4xl flex-col items-center gap-2 text-center text-sm sm:grid sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:text-base">
          {["Danmarks Bridgeforbund", "4 kredse", "11 distrikter", "Bridgeklubber"].map((label, index) => (
            <div key={label} className="contents">
              <div className="rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-3 font-semibold backdrop-blur-sm">
                {label}
              </div>
              {index < 3 && <ArrowRight className="hidden size-4 text-accent sm:block" />}
              {index < 3 && <ArrowDown className="mx-auto size-4 text-accent sm:hidden" />}
            </div>
          ))}
        </div>
      </PageHero>

      <Section
        label="Find bridge i Danmark"
        titel="Find kreds, distrikt eller klub"
        beskrivelse="Danmarks Bridgeforbund er opdelt i 11 distrikter. Distrikterne er samlet i fire kredse, der blandt andet organiserer turneringssamarbejde på tværs af distrikterne. Søg direkte, eller fold et distrikt ud under den kreds, det hører til."
        handling={
          <Button variant="outline" onClick={skiftAlle}>
            <Building2 /> {alleErAabne ? "Skjul klubber" : "Vis alle klubber"}
          </Button>
        }
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(15rem,1fr)]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={soeg}
              onChange={(event) => setSoeg(event.target.value)}
              placeholder="Søg efter kreds, distrikt, klub eller klubnummer"
              aria-label="Søg efter kreds, distrikt, klub eller klubnummer"
              className="h-11 pl-9"
            />
          </div>
          <Select value={kredsFilter} onValueChange={setKredsFilter}>
            <SelectTrigger className="h-11" aria-label="Filtrér efter kreds">
              <SelectValue placeholder="Alle kredse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle kredse</SelectItem>
              {organizationCircuits.map((circuit) => (
                <SelectItem key={circuit.id} value={String(circuit.id)}>{circuit.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div id="kredse" className="mt-8 space-y-7 scroll-mt-24">
          {kredse.map(({ circuit, districts }) => {
            return (
              <section key={circuit.id} className="overflow-hidden rounded-lg border border-border bg-secondary/35">
                <div className="border-b border-border bg-card p-5 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="flex min-w-0 gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                        <Landmark className="size-5" />
                      </span>
                      <div>
                        <p className="section-label">{circuit.siteNumber ? `${circuit.name} · ${circuit.siteNumber}` : circuit.name}</p>
                        <h2 className="mt-1 text-2xl font-bold">{circuit.geographicName}</h2>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{circuit.description}</p>
                        <p className="mt-3 text-sm font-semibold">
                          {districts.length} {districts.length === 1 ? "distrikt" : "distrikter"}
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="default">
                      <Link to="/kreds/$id" params={{ id: String(circuit.id) }}>
                        Kredsens hjemmeside <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
                  {districts.map((district) => {
                    const open = erAaben(district.id) || alleErAabne;
                    return (
                      <Card key={district.id} className="h-fit overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                <MapPin className="size-4" />
                              </span>
                              {district.siteNumber && <Badge variant="secondary">{district.siteNumber}</Badge>}
                            </div>
                            <h3 className="mt-4 text-xl font-bold">{district.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{circuit.name}</p>
                            {district.officialClubCount !== undefined && (
                              <p className="mt-3 text-sm font-semibold">{district.officialClubCount} klubber</p>
                            )}
                            <div className="mt-5 flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => skiftDistrikt(district.id)}
                                aria-expanded={open}
                                aria-controls={`district-clubs-${district.id}`}
                              >
                                {open ? "Skjul klubber" : "Vis klubber"}
                                <ChevronDown className={open ? "rotate-180 transition-transform" : "transition-transform"} />
                              </Button>
                              <Button asChild variant="ghost" size="sm">
                                <Link to="/distrikt/$id" params={{ id: String(district.id) }}>
                                  Distriktets hjemmeside <ArrowRight />
                                </Link>
                              </Button>
                              {district.websiteUrl && (
                                <Button asChild variant="link" size="sm" className="px-1">
                                  <a href={district.websiteUrl} target="_blank" rel="noreferrer">
                                    Besøg nuværende hjemmeside <ExternalLink />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>

                          {open && (
                            <div id={`district-clubs-${district.id}`} className="border-t border-border bg-muted/45 p-5">
                              <p className="mb-3 text-sm font-bold">Klubber i {district.name}</p>
                              {district.clubs.length > 0 ? (
                                <ul className="space-y-2">
                                  {district.clubs.map((club) => (
                                    <li key={club.clubNo} className="flex items-center justify-between gap-3 text-sm">
                                      <div className="min-w-0">
                                        {club.internalPath ? (
                                          <Link
                                            to="/$klubId"
                                            params={{ klubId: String(club.clubNo) }}
                                            className="font-semibold hover:text-accent hover:underline"
                                          >
                                            <span className="font-mono">{club.clubNo}</span> · {club.name}
                                          </Link>
                                        ) : (
                                          <span><span className="font-mono">{club.clubNo}</span> · {club.name}</span>
                                        )}
                                        <p className="text-xs text-muted-foreground">{club.city}</p>
                                      </div>
                                      {club.websiteUrl && (
                                        <Button asChild variant="ghost" size="icon">
                                          <a href={club.websiteUrl} target="_blank" rel="noreferrer" aria-label={`Åbn ${club.name}s eksterne hjemmeside`}>
                                            <ExternalLink />
                                          </a>
                                        </Button>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground">Der er endnu ikke registreret klubber i prototypens katalog.</p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {kredse.length === 0 && (
            <div className="rounded-lg border border-border bg-card px-6 py-10 text-center text-muted-foreground">
              Ingen kredse, distrikter eller klubber matcher din søgning.
            </div>
          )}
        </div>
      </Section>
    </>
  );
}