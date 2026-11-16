import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { Panel } from "@/components/bc3/Bc3Bits";
import { Bc3Empty, Bc3QueryState } from "@/components/bc3/ApiState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportMembers, type MemberSearchFilters } from "@/api/firebirdApi";
import { useSubClubs } from "@/hooks/useSubClubs";
import { useFeeCategories, useSearchMembers } from "@/hooks/useMemberAdministration";

const initial: MemberSearchFilters = { page: 1, pageSize: 25, sort: "name" };
const selectClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

export function MemberSearchList({ fdbNo, titel }: { fdbNo: string; titel?: string | undefined }) {
  const [filters, setFilters] = useState<MemberSearchFilters>(initial);
  const [exporting, setExporting] = useState(false);
  const members = useSearchMembers(fdbNo, filters);
  const clubs = useSubClubs(fdbNo);
  const categories = useFeeCategories(fdbNo);
  const page = filters.page ?? 1;
  const total = members.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / (filters.pageSize ?? 25)));

  function change<K extends keyof MemberSearchFilters>(field: K, value: MemberSearchFilters[K]) {
    setFilters((old) => {
      const next = { ...old, [field]: value, page: 1 };
      if (field === "subclubId" && value === undefined) {
        delete next.isSubstitute;
        delete next.hasPartner;
      }
      return next;
    });
  }

  async function exportCsv() {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await exportMembers(fdbNo, filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bc3-medlemmer-${fdbNo}.csv`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Eksporten mislykkedes.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <Bc3Layout
      fdbNo={fdbNo}
      titel={titel}
      trin={[
        <Link key="bc3" to="/bc3/online">
          BC3 Online
        </Link>,
        <Link key="club" to="/bc3/online/$clubNumber" params={{ clubNumber: fdbNo }}>
          {titel ?? `Klub ${fdbNo}`}
        </Link>,
        "Medlemmer",
      ]}
    >
      <Panel
        titel="Medlemmer"
        beskrivelse="Søg i klubbens BC3-medlemmer."
        handling={
          <div className="bc3-print-hide flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/bc3/online/$clubNumber/medlemmer/tilfoej" params={{ clubNumber: fdbNo }}>
                Tilføj medlem
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link
                to="/bc3/online/$clubNumber/medlemmer/tilknyt"
                params={{ clubNumber: fdbNo }}
                search={{}}
              >
                Tilføj eksisterende medlem
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/bc3/online/$clubNumber/underklubber" params={{ clubNumber: fdbNo }}>
                Administrer medlemmer
              </Link>
            </Button>
          </div>
        }
      >
        <div className="bc3-print-hide space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.query ?? ""}
              onChange={(event) => change("query", event.target.value)}
              placeholder="Søg navn eller medlemsnr."
              className="pl-9"
              aria-label="Søg medlemmer"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1 text-sm">
              Underklub
              <select
                className={selectClass}
                value={filters.subclubId ?? ""}
                onChange={(event) =>
                  change("subclubId", event.target.value ? Number(event.target.value) : undefined)
                }
              >
                <option value="">Alle underklubber</option>
                {clubs.data?.map((club) => (
                  <option key={club.clubID} value={club.clubID}>
                    {club.clubName}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              By
              <Input
                value={filters.city ?? ""}
                onChange={(event) => change("city", event.target.value)}
                placeholder="Alle byer"
              />
            </label>
            <label className="space-y-1 text-sm">
              Kontingentkategori
              <select
                className={selectClass}
                value={filters.feeCategory ?? ""}
                onChange={(event) =>
                  change("feeCategory", event.target.value ? Number(event.target.value) : undefined)
                }
              >
                <option value="">Alle kategorier</option>
                {categories.data?.map((category) => (
                  <option key={category.code} value={category.code}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              Substitut i underklubben
              <select
                className={selectClass}
                disabled={!filters.subclubId}
                value={filters.isSubstitute === undefined ? "" : String(filters.isSubstitute)}
                onChange={(event) =>
                  change(
                    "isSubstitute",
                    event.target.value === "" ? undefined : event.target.value === "true",
                  )
                }
              >
                <option value="">Alle</option>
                <option value="true">Ja</option>
                <option value="false">Nej</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              Fast makker i underklubben
              <select
                className={selectClass}
                disabled={!filters.subclubId}
                value={filters.hasPartner === undefined ? "" : String(filters.hasPartner)}
                onChange={(event) =>
                  change(
                    "hasPartner",
                    event.target.value === "" ? undefined : event.target.value === "true",
                  )
                }
              >
                <option value="">Alle</option>
                <option value="true">Har makker</option>
                <option value="false">Ingen makker</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              Klubstart fra
              <Input
                type="date"
                value={filters.startFrom ?? ""}
                onChange={(event) => change("startFrom", event.target.value || undefined)}
              />
            </label>
            <label className="space-y-1 text-sm">
              Klubstart til
              <Input
                type="date"
                value={filters.startTo ?? ""}
                onChange={(event) => change("startTo", event.target.value || undefined)}
              />
            </label>
            <label className="space-y-1 text-sm">
              Sortér efter
              <select
                className={selectClass}
                value={filters.sort ?? "name"}
                onChange={(event) =>
                  change("sort", event.target.value as MemberSearchFilters["sort"])
                }
              >
                <option value="name">Navn</option>
                <option value="memberNo">Medlemsnr.</option>
                <option value="city">By</option>
                <option value="clubStart">Klubstart</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.descending ?? false}
                onChange={(event) => change("descending", event.target.checked)}
              />{" "}
              Faldende rækkefølge
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...initial })}
            >
              Nulstil filtre
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={exporting}
              onClick={() => void exportCsv()}
            >
              {exporting ? "Eksporterer…" : "Eksportér medlemmer (CSV)"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
              Udskriv vist side
            </Button>
          </div>
        </div>
        <Bc3QueryState forespoergsel={members}>
          {(result) => (
            <>
              <p className="my-3 text-sm text-muted-foreground" aria-live="polite">
                {result.total} medlemmer matcher søgningen.{" "}
                {result.total > 0 && `Side ${page} af ${pages}.`}
              </p>
              {result.items.length === 0 ? (
                <Bc3Empty tekst="Ingen medlemmer matcher filtrene." />
              ) : (
                <>
                  <div className="bc3-print-hide grid gap-3 md:hidden">
                    {result.items.map((member) => (
                      <Card key={member.memberId}>
                        <CardContent className="p-4">
                          <Link
                            to="/bc3/online/$clubNumber/members/$memberId"
                            params={{ clubNumber: fdbNo, memberId: String(member.memberId) }}
                            className="block"
                          >
                            <p className="font-display font-bold">{member.name}</p>
                            <p className="font-mono text-xs text-muted-foreground">
                              {member.memberNo}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">{member.city}</p>
                            {member.subclubs && <p className="mt-1 text-sm">{member.subclubs}</p>}
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="bc3-member-table hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medlemsnr.</TableHead>
                          <TableHead>Navn</TableHead>
                          <TableHead>Underklubber</TableHead>
                          <TableHead>By</TableHead>
                          <TableHead>Telefon</TableHead>
                          <TableHead>E-mail</TableHead>
                          <TableHead>Klubstart</TableHead>
                          <TableHead>Kontingentkategori</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.items.map((member) => (
                          <TableRow key={member.memberId}>
                            <TableCell className="font-mono">{member.memberNo}</TableCell>
                            <TableCell className="font-semibold">
                              <Link
                                to="/bc3/online/$clubNumber/members/$memberId"
                                params={{ clubNumber: fdbNo, memberId: String(member.memberId) }}
                                className="hover:text-primary hover:underline"
                              >
                                {member.name}
                              </Link>
                            </TableCell>
                            <TableCell>{member.subclubs}</TableCell>
                            <TableCell>{member.city}</TableCell>
                            <TableCell>{member.phone1}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.clubStart}</TableCell>
                            <TableCell>
                              {categories.data?.find(
                                (category) => category.code === member.feeCategoryCode,
                              )?.name ?? "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
              <div className="bc3-print-hide mt-4 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setFilters((old) => ({ ...old, page: page - 1 }))}
                >
                  Forrige
                </Button>
                <span className="text-sm">
                  Side {page} af {pages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= pages}
                  onClick={() => setFilters((old) => ({ ...old, page: page + 1 }))}
                >
                  Næste
                </Button>
              </div>
            </>
          )}
        </Bc3QueryState>
      </Panel>
    </Bc3Layout>
  );
}
