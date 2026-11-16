import { createFileRoute, Link } from "@tanstack/react-router";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { FeltRaekke, Panel, StatCard } from "@/components/bc3/Bc3Bits";
import { Bc3Empty, Bc3Error, Bc3Loading } from "@/components/bc3/ApiState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarClock, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { flagErJa } from "@/api/firebirdApi";
import { useClub } from "@/hooks/useClub";
import { useSubClubs } from "@/hooks/useSubClubs";
import { useMembers } from "@/hooks/useMembers";
import { useMemberClubs } from "@/hooks/useMemberClubs";
import { byggMakkerpar } from "@/lib/bc3-memberships";
import EditUser from "@/components/edituser/edituser";
import { MembershipActions } from "@/components/edituser/MembershipActions";
import { PartnerActions } from "@/components/edituser/PartnerActions";
import { useSubstitutes } from "@/hooks/usePartnerManagement";
import { useState } from "react";

export const Route = createFileRoute("/bc3/online/$clubNumber/subclubs/$clubId")({
  validateSearch: (search: Record<string, unknown>): { editMemberId?: number } => {
    const memberId = Number(search["editMemberId"]);
    return Number.isInteger(memberId) && memberId > 0 ? { editMemberId: memberId } : {};
  },
  head: () => ({
    meta: [
      { title: "Underklub – BC3 Online" },
      {
        name: "description",
        content: "Underklubbens spilledag, spilletid og medlemmer fra BC3-databasen.",
      },
      { property: "og:title", content: "Underklub – BC3 Online" },
      {
        property: "og:description",
        content: "Spilledag, spilletid og medlemsliste for underklubben.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UnderklubDetalje,
});

function UnderklubDetalje() {
  const { clubNumber: fdbNo, clubId } = Route.useParams();
  const { editMemberId } = Route.useSearch();
  const klub = useClub(fdbNo);
  const underklubber = useSubClubs(fdbNo);
  const medlemmer = useMembers(fdbNo);
  const medlemsklubber = useMemberClubs(fdbNo);
  const [partnerFilter, setPartnerFilter] = useState("");
  const substitutter = useSubstitutes(fdbNo, Number(clubId), partnerFilter, fdbNo === "9999");

  const titel = klub.data ? `${klub.data.clubNo} – ${klub.data.name}` : undefined;
  const underklub = underklubber.data?.find((u) => u.clubID === Number(clubId));

  const medlemsIds = new Set(
    (medlemsklubber.data ?? []).filter((r) => r.clubID === Number(clubId)).map((r) => r.memberID),
  );
  const underklubMedlemmer = (medlemmer.data ?? []).filter((m) => medlemsIds.has(m.memberID));
  const makkerpar = byggMakkerpar(Number(clubId), medlemsklubber.data, medlemmer.data);
  const filter = partnerFilter.trim().toLocaleLowerCase("da");
  const matches = (name: string, number?: number) =>
    !filter ||
    name.toLocaleLowerCase("da").includes(filter) ||
    String(number ?? "").includes(filter);
  const synligePar = makkerpar.par.filter(
    (pair) =>
      matches(pair.a.navn, pair.a.memberNo) || (pair.b && matches(pair.b.navn, pair.b.memberNo)),
  );
  const udenMakker = makkerpar.udenMakker.filter((person) => matches(person.navn, person.memberNo));
  const problemer = makkerpar.problemer.filter((problem) =>
    matches(problem.person.navn, problem.person.memberNo),
  );

  function partnerHandlinger(memberId: number) {
    if (fdbNo !== "9999" || !underklub || !medlemmer.data || !medlemsklubber.data) return null;
    const member = medlemmer.data.find((person) => person.memberID === memberId);
    const link = medlemsklubber.data.find(
      (row) => row.clubID === underklub.clubID && row.memberID === memberId,
    );
    return member && link ? (
      <PartnerActions
        fdbNo={fdbNo}
        clubId={underklub.clubID}
        clubName={underklub.clubName}
        member={member}
        link={link}
        allLinks={medlemsklubber.data}
        members={medlemmer.data}
        compact
      />
    ) : null;
  }

  return (
    <Bc3Layout
      fdbNo={fdbNo}
      titel={titel}
      trin={[
        <Link key="bc3" to="/bc3/online">
          BC3 Online
        </Link>,
        <Link key="klub" to="/bc3/online/$clubNumber" params={{ clubNumber: fdbNo }}>
          {titel ?? `Klub ${fdbNo}`}
        </Link>,
        <Link key="u" to="/bc3/online/$clubNumber/underklubber" params={{ clubNumber: fdbNo }}>
          Underklubber
        </Link>,
        underklub?.clubName ?? `Underklub ${clubId}`,
      ]}
    >
      {underklubber.isPending && <Bc3Loading />}
      {underklubber.isError && <Bc3Error fejl={underklubber.error} />}
      {underklubber.isSuccess && !underklub && (
        <Bc3Empty tekst={`Underklub ${clubId} findes ikke i BC3-databasen ${fdbNo}.`} />
      )}

      {underklub && (
        <>
          <h2 className="mb-6 font-display text-2xl font-bold">{underklub.clubName}</h2>

          <div className="grid gap-5 sm:grid-cols-3">
            <StatCard titel="Spilledag" vaerdi={underklub.gameDay} ikon={<CalendarClock />} />
            <StatCard titel="Spilletid" vaerdi={underklub.gameTime} ikon={<Clock />} />
            <StatCard
              titel="Antal medlemmer"
              vaerdi={medlemsklubber.isSuccess ? medlemsIds.size : "—"}
              ikon={<Users />}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Panel titel={`Medlemmer i ${underklub.clubName}`}>
                {medlemmer.isPending || medlemsklubber.isPending ? (
                  <Bc3Loading />
                ) : medlemmer.isError || medlemsklubber.isError ? (
                  <Bc3Error fejl={medlemmer.error ?? medlemsklubber.error} />
                ) : underklubMedlemmer.length === 0 ? (
                  <Bc3Empty tekst="Ingen medlemmer er knyttet til denne underklub." />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medlemsnr.</TableHead>
                          <TableHead>Navn</TableHead>
                          <TableHead>By</TableHead>
                          {fdbNo === "9999" && <TableHead>Handlinger</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {underklubMedlemmer.map((m) => (
                          <TableRow key={m.memberID}>
                            <TableCell className="font-mono">{m.memberNo}</TableCell>
                            <TableCell className="font-semibold">
                              <Link
                                to="/bc3/online/$clubNumber/members/$memberId"
                                params={{ clubNumber: fdbNo, memberId: String(m.memberID) }}
                                className="hover:text-primary hover:underline"
                              >
                                {m.name}
                              </Link>
                            </TableCell>
                            <TableCell>{m.city}</TableCell>
                            {fdbNo === "9999" && medlemsklubber.data && underklubber.data && (
                              <TableCell>
                                <MembershipActions
                                  fdbNo={fdbNo}
                                  memberId={m.memberID}
                                  memberName={m.name}
                                  memberNo={m.memberNo}
                                  sourceClubId={underklub.clubID}
                                  sourceClubName={underklub.clubName}
                                  partnerName={
                                    medlemmer.data?.find(
                                      (person) =>
                                        person.memberID ===
                                        (medlemsklubber.data?.find(
                                          (link) =>
                                            link.memberID === m.memberID &&
                                            link.clubID === underklub.clubID,
                                        )?.partnerID ||
                                          medlemsklubber.data?.find(
                                            (link) =>
                                              link.clubID === underklub.clubID &&
                                              link.partnerID === m.memberID,
                                          )?.memberID),
                                    )?.name
                                  }
                                  memberClubs={medlemsklubber.data}
                                  subClubs={underklubber.data}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Panel>
            </div>

            <Panel titel="Underklubdetaljer">
              <dl>
                <FeltRaekke
                  label="Lokalt id"
                  vaerdi={<span className="font-mono">{underklub.clubID}</span>}
                />
                <FeltRaekke label="Klubnavn" vaerdi={underklub.clubName} />
                <FeltRaekke label="Spilledag" vaerdi={underklub.gameDay} />
                <FeltRaekke label="Spilletid" vaerdi={underklub.gameTime} />
                <FeltRaekke label="Synlig" vaerdi={flagErJa(underklub.isVisible) ? "Ja" : "Nej"} />
                <FeltRaekke label="Rygfri" vaerdi={flagErJa(underklub.noSmoking) ? "Ja" : "Nej"} />
              </dl>
            </Panel>
          </div>

          <div className="mt-6">
            <Panel
              titel="Makkerpar"
              beskrivelse={`Faste makkere, ledige spillere og substitutter i ${underklub.clubName}.`}
            >
              <div className="mb-4">
                <label htmlFor="partner-filter" className="mb-1 block text-sm font-medium">
                  Søg i makkere og substitutter
                </label>
                <input
                  id="partner-filter"
                  value={partnerFilter}
                  onChange={(event) => setPartnerFilter(event.target.value)}
                  placeholder="Navn eller medlemsnummer"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 sm:max-w-sm"
                />
              </div>
              {medlemmer.isPending || medlemsklubber.isPending ? (
                <Bc3Loading />
              ) : medlemmer.isError || medlemsklubber.isError ? (
                <Bc3Error fejl={medlemmer.error ?? medlemsklubber.error} />
              ) : synligePar.length === 0 && udenMakker.length === 0 && problemer.length === 0 ? (
                <Bc3Empty
                  tekst={
                    filter
                      ? "Ingen medlemmer matcher søgningen."
                      : "Ingen medlemmer er knyttet til denne underklub."
                  }
                />
              ) : (
                <div className="space-y-6">
                  {synligePar.length > 0 && (
                    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {synligePar.map((p) => (
                        <li key={p.noegle} className="rounded-xl border border-border p-4">
                          <p className="font-display text-base font-bold">
                            {p.a.navn} <span className="text-muted-foreground">&amp;</span>{" "}
                            {p.b ? p.b.navn : "Ukendt medlem"}
                          </p>
                          <p className="mt-1 font-mono text-xs text-muted-foreground">
                            DBF-nr. {p.a.memberNo ?? "—"}
                            {p.b ? ` · ${p.b.memberNo ?? "—"}` : ""}
                          </p>
                          {p.makkerUkendt && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Makker er registreret, men medlemsoplysninger kunne ikke findes.
                            </p>
                          )}
                          <div className="mt-3 border-t border-border pt-3">
                            <Button asChild size="sm" variant="link" className="px-0">
                              <Link
                                to="/bc3/online/$clubNumber/members/$memberId"
                                params={{ clubNumber: fdbNo, memberId: String(p.a.memberID) }}
                              >
                                Se medlem
                              </Link>
                            </Button>
                            {partnerHandlinger(p.a.memberID)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {udenMakker.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-display text-base font-bold">Mangler makker</h3>
                      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {udenMakker.map((m) => (
                          <li
                            key={m.memberID}
                            className="rounded-xl border border-dashed border-border bg-muted/40 p-4"
                          >
                            <p className="font-semibold">{m.navn}</p>
                            <p className="font-mono text-xs text-muted-foreground">
                              DBF-nr. {m.memberNo ?? "—"}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Ingen makker registreret
                            </p>
                            <div className="mt-3 border-t border-border pt-3">
                              {partnerHandlinger(m.memberID)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {problemer.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-display text-base font-bold">
                        Kræver kontrol i BC3
                      </h3>
                      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {problemer.map(({ person, tekst }) => (
                          <li
                            key={person.memberID}
                            className="rounded-xl border border-destructive/50 p-4"
                          >
                            <p className="font-semibold">{person.navn}</p>
                            <p className="text-sm text-destructive">{tekst}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {fdbNo === "9999" && (
                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="font-display text-base font-bold">Tilgængelige substitutter</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Medlemmer markeret som substitut i denne underklub.
                  </p>
                  {substitutter.isPending ? (
                    <Bc3Loading />
                  ) : substitutter.isError ? (
                    <Bc3Error fejl={substitutter.error} />
                  ) : substitutter.data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Ingen substitutter fundet.</p>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {substitutter.data.map((person) => (
                        <li
                          key={person.memberId}
                          className="rounded-lg border border-border px-3 py-2 text-sm"
                        >
                          {person.name} · {person.memberNo ?? "—"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Panel>
          </div>

          {fdbNo === "9999" && (
            <>
              <div className="mt-6 flex justify-end">
                <Button asChild variant="outline">
                  <Link
                    to="/bc3/online/$clubNumber/medlemmer/tilknyt"
                    params={{ clubNumber: fdbNo }}
                    search={{ clubId: Number(clubId) }}
                  >
                    Tilføj eksisterende medlem
                  </Link>
                </Button>
              </div>
              <EditUser
                key={`${fdbNo}:${clubId}`}
                fdbNo={fdbNo}
                clubId={clubId}
                initialMemberId={editMemberId}
              />
            </>
          )}
        </>
      )}
    </Bc3Layout>
  );
}
