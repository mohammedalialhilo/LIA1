import { createFileRoute, Link } from "@tanstack/react-router";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { FeltRaekke, Panel } from "@/components/bc3/Bc3Bits";
import { Bc3Empty, Bc3Error, Bc3Loading } from "@/components/bc3/ApiState";
import { useClub } from "@/hooks/useClub";
import { useMembers } from "@/hooks/useMembers";
import { useMemberClubs } from "@/hooks/useMemberClubs";
import { useSubClubs } from "@/hooks/useSubClubs";
import { byggMedlemskaber } from "@/lib/bc3-memberships";

export const Route = createFileRoute("/bc3/online/$clubNumber/members/$memberId")({
  head: () => ({
    meta: [
      { title: "Medlem – BC3 Online" },
      {
        name: "description",
        content: "Medlemskort med kontaktoplysninger, underklubber og mesterpoint.",
      },
      { property: "og:title", content: "Medlem – BC3 Online" },
      { property: "og:description", content: "Medlemsoplysninger fra klubbens BC3-database." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MedlemDetalje,
});

function MedlemDetalje() {
  const { clubNumber: fdbNo, memberId } = Route.useParams();
  const klub = useClub(fdbNo);
  const medlemmer = useMembers(fdbNo);
  const medlemsklubber = useMemberClubs(fdbNo);
  const underklubber = useSubClubs(fdbNo);

  const titel = klub.data ? `${klub.data.clubNo} – ${klub.data.name}` : undefined;
  const medlem = medlemmer.data?.find((m) => m.memberID === Number(memberId));

  const medlemskaber = byggMedlemskaber(
    Number(memberId),
    medlemsklubber.data,
    underklubber.data,
    medlemmer.data,
  );

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
        <Link key="m" to="/bc3/online/$clubNumber/medlemmer" params={{ clubNumber: fdbNo }}>
          Medlemmer
        </Link>,
        medlem?.name ?? `Medlem ${memberId}`,
      ]}
    >
      {medlemmer.isPending && <Bc3Loading />}
      {medlemmer.isError && <Bc3Error fejl={medlemmer.error} />}
      {medlemmer.isSuccess && !medlem && (
        <Bc3Empty tekst={`Medlem ${memberId} findes ikke i BC3-databasen ${fdbNo}.`} />
      )}

      {medlem && (
        <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          <Panel titel="Medlem">
            <dl>
              <FeltRaekke label="Navn" vaerdi={medlem.name} />
              <FeltRaekke
                label="DBF-medlemsnummer"
                vaerdi={<span className="font-mono">{medlem.memberNo}</span>}
              />
              <FeltRaekke
                label="Adresse"
                vaerdi={[medlem.address1, medlem.address2].filter(Boolean).join(", ")}
              />
              <FeltRaekke label="Postnummer/by" vaerdi={`${medlem.zipCode} ${medlem.city}`} />
              <FeltRaekke label="Land" vaerdi={medlem.countryCode} />
              <FeltRaekke
                label="Telefon"
                vaerdi={[medlem.phone1, medlem.phone2, medlem.phone3].filter(Boolean).join(" · ")}
              />
              <FeltRaekke label="E-mail" vaerdi={medlem.email} />
              <FeltRaekke label="Klubstart" vaerdi={medlem.clubStart} />
            </dl>
          </Panel>

          <div className="space-y-6">
            <Panel
              titel="Mine spillehold og makkere"
              beskrivelse="Medlemskaber og faste makkere pr. underklub, hentet fra BC3-databasen."
            >
              {medlemsklubber.isPending || underklubber.isPending ? (
                <Bc3Loading />
              ) : medlemskaber.length === 0 ? (
                <Bc3Empty tekst="Medlemmet er ikke knyttet til en underklub." />
              ) : (
                <ul className="space-y-3">
                  {medlemskaber.map((ms) => (
                    <li key={ms.noegle} className="rounded-xl border border-border p-4">
                      <p className="font-display text-base font-bold">{ms.underklubNavn}</p>
                      <p className="text-xs text-muted-foreground">Underklub {ms.underklubId}</p>
                      <div className="mt-3 border-t border-border/60 pt-3">
                        <p className="text-sm text-muted-foreground">Makker</p>
                        {ms.makkerstatus === "fundet" ? (
                          <>
                            <p className="text-sm font-semibold">{ms.makkerNavn}</p>
                            <p className="font-mono text-xs text-muted-foreground">
                              DBF-nr. {ms.makkerNr}
                            </p>
                          </>
                        ) : ms.makkerstatus === "ukendt" ? (
                          <p className="text-sm">
                            Makker registreret, men medlemsoplysninger kunne ikke findes.
                          </p>
                        ) : (
                          <p className="text-sm">Der er ikke registreret en fast makker.</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel titel="Mesterpoint">
              <dl>
                <FeltRaekke label="Bronze" vaerdi={medlem.totalBronze} />
                <FeltRaekke label="Sølv" vaerdi={medlem.totalSilver} />
                <FeltRaekke label="Guld" vaerdi={medlem.totalGold} />
                <FeltRaekke label="Mesterpoint i alt" vaerdi={medlem.totalMaster} />
              </dl>
            </Panel>
          </div>
        </div>
      )}
    </Bc3Layout>
  );
}
