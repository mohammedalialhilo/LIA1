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
import { flagErJa } from "@/api/firebirdApi";
import { useClub } from "@/hooks/useClub";
import { useSubClubs } from "@/hooks/useSubClubs";
import { useMembers } from "@/hooks/useMembers";
import { useMemberClubs } from "@/hooks/useMemberClubs";
import { byggMakkerpar } from "@/lib/bc3-memberships";

export const Route = createFileRoute("/bc3/online/$clubNumber/subclubs/$clubId")({
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
  const klub = useClub(fdbNo);
  const underklubber = useSubClubs(fdbNo);
  const medlemmer = useMembers(fdbNo);
  const medlemsklubber = useMemberClubs(fdbNo);

  const titel = klub.data ? `${klub.data.clubNo} – ${klub.data.name}` : undefined;
  const underklub = underklubber.data?.find((u) => u.clubID === Number(clubId));

  const medlemsIds = new Set(
    (medlemsklubber.data ?? []).filter((r) => r.clubID === Number(clubId)).map((r) => r.memberID),
  );
  const underklubMedlemmer = (medlemmer.data ?? []).filter((m) => medlemsIds.has(m.memberID));
  const makkerpar = byggMakkerpar(Number(clubId), medlemsklubber.data, medlemmer.data);

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
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medlemsnr.</TableHead>
                          <TableHead>Navn</TableHead>
                          <TableHead>By</TableHead>
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
              beskrivelse={`Registrerede makkerpar i ${underklub.clubName} — og medlemmer der mangler en makker.`}
            >
              {medlemmer.isPending || medlemsklubber.isPending ? (
                <Bc3Loading />
              ) : medlemmer.isError || medlemsklubber.isError ? (
                <Bc3Error fejl={medlemmer.error ?? medlemsklubber.error} />
              ) : makkerpar.par.length === 0 && makkerpar.udenMakker.length === 0 ? (
                <Bc3Empty tekst="Ingen medlemmer er knyttet til denne underklub." />
              ) : (
                <div className="space-y-6">
                  {makkerpar.par.length > 0 && (
                    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {makkerpar.par.map((p) => (
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
                        </li>
                      ))}
                    </ul>
                  )}

                  {makkerpar.udenMakker.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-display text-base font-bold">Mangler makker</h3>
                      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {makkerpar.udenMakker.map((m) => (
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
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Panel>
          </div>
        </>
      )}
    </Bc3Layout>
  );
}
