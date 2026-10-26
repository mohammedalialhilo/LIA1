import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHero, Section, DevInfo } from "@/components/site/Bits";
import {
  clubsInDistrict,
  getCircuit,
  getDistrict,
  organizationClubs,
  organizationDistricts,
} from "@/lib/organization-data";
import { MapPin, Search, ArrowRight, ExternalLink } from "lucide-react";

type ClubSearch = { distrikt?: string | undefined };

export const Route = createFileRoute("/klubber/")({
  validateSearch: (search: Record<string, unknown>): ClubSearch => ({
    distrikt: typeof search["distrikt"] === "string" ? search["distrikt"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Klubber i Danmark – bridge.dk" },
      {
        name: "description",
        content:
          "Søg blandt bridgeklubber i hele Danmark. Filtrér på område og distrikt, og se klubbens egen side med spilletider, turneringer og resultater.",
      },
      { property: "og:title", content: "Klubber i Danmark – bridge.dk" },
      {
        property: "og:description",
        content: "Klubkatalog med geografisk filtrering, distrikter og kredse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Klubber,
});

function Klubber() {
  const search = Route.useSearch();
  const [soeg, setSoeg] = useState("");
  const [region, setRegion] = useState("Hele landet");
  const [distrikt, setDistrikt] = useState(search.distrikt ?? "Alle distrikter");
  const regions = useMemo(
    () => ["Hele landet", ...new Set(organizationClubs.map((club) => club.region))],
    [],
  );

  useEffect(() => {
    setDistrikt(search.distrikt ?? "Alle distrikter");
  }, [search.distrikt]);

  const filtreret = useMemo(
    () =>
      organizationClubs.filter((club) => {
        const q = soeg.trim().toLowerCase();
        const district = getDistrict(club.districtId);
        const matchSoeg =
          !q ||
          club.name.toLowerCase().includes(q) ||
          club.city.toLowerCase().includes(q) ||
          String(club.clubNo).includes(q);
        const matchRegion = region === "Hele landet" || club.region === region;
        const matchDistrikt = distrikt === "Alle distrikter" || district?.name === distrikt;
        return matchSoeg && matchRegion && matchDistrikt;
      }),
    [soeg, region, distrikt],
  );

  return (
    <>
      <PageHero
        label="Klubber"
        titel="Klubber i Danmark"
        beskrivelse="Find danske bridgeklubber efter klubnummer, navn, område og distrikt, og gå videre til klubbens side."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/distrikter-og-kredse">Distrikter og kredse</Link>
          </Button>
        </div>
      </PageHero>

      <Section titel="Søg efter klub" beskrivelse="Katalogets arkitektur rummer alle klubber i forbundet. Her vises et udsnit som demodata.">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={soeg}
              onChange={(e) => setSoeg(e.target.value)}
              placeholder="Søg klubnavn, by eller klubnummer"
              className="h-11 pl-9"
            />
          </div>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Område" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={distrikt} onValueChange={setDistrikt}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Distrikt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alle distrikter">Alle distrikter</SelectItem>
              {organizationDistricts.map((d) => (
                <SelectItem key={d.id} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DevInfo
          titel="Klubkatalog"
          felter={[
            { ui: "Klubliste", system: "BridgeOrg", tabel: "BRIDGEKLUBBER" },
            { ui: "Klub", system: "BC3", database: "xxxx.fdb", tabel: "MEM_CLUB" },
          ]}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="overflow-hidden rounded-xl border border-border bg-card card-shadow">
            <table className="w-full text-sm">
              <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Nr.</th>
                  <th className="px-4 py-3">Klub</th>
                  <th className="hidden px-4 py-3 md:table-cell">By</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Distrikt</th>
                  <th className="hidden px-4 py-3 xl:table-cell">Kreds</th>
                  <th className="px-4 py-3 text-right">Medlemmer</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtreret.map((club) => {
                  const districtData = getDistrict(club.districtId);
                  const circuitData = getCircuit(club.circuitId);
                  return (
                  <tr key={club.clubNo} className="border-t border-border/70 hover:bg-secondary/40">
                    <td className="px-4 py-3 font-mono">{club.clubNo}</td>
                    <td className="px-4 py-3 font-semibold">{club.name}</td>
                    <td className="hidden px-4 py-3 md:table-cell">{club.city}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {districtData?.name ?? "Ukendt distrikt"}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground xl:table-cell">
                      {circuitData?.name ?? "–"}
                    </td>
                    <td className="px-4 py-3 text-right">{club.members || "–"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                      {club.internalPath ? (
                        <Button asChild size="sm" variant="outline">
                          <Link to="/$klubId" params={{ klubId: String(club.clubNo) }}>
                            bridge.dk/{club.clubNo}
                          </Link>
                        </Button>
                      ) : (
                        <Badge variant="secondary">Side klar til opsætning</Badge>
                      )}
                      {club.websiteUrl && (
                        <Button asChild size="icon" variant="ghost">
                          <a
                            href={club.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Åbn ${club.name}s eksterne hjemmeside`}
                            title="Ekstern hjemmeside"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        </Button>
                      )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {filtreret.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      Ingen klubber matcher din søgning.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <div className="grid aspect-square place-items-center rounded-xl border border-border bg-muted text-center">
              <div className="p-6">
                <MapPin className="mx-auto mb-3 size-7 text-accent" />
                <p className="font-display font-bold">Kort over klubber</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pladsholder. Kortet vil vise klubberne ud fra klubbens adresse.
                </p>
              </div>
            </div>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-display font-bold">Distrikter</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {organizationDistricts.map((district) => (
                    <li key={district.id}>
                      <Link
                        to="/klubber"
                        search={{ distrikt: district.name }}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-secondary"
                      >
                        <span>{district.name}</span>
                        <span className="text-muted-foreground">{clubsInDistrict(district.id).length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="link" className="mt-3 px-2">
                  <Link to="/distrikter-og-kredse">
                    Om distrikter og kredse <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
