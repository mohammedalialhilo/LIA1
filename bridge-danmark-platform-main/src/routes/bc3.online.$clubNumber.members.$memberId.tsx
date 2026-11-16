import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { FeltRaekke, Panel } from "@/components/bc3/Bc3Bits";
import { Bc3Empty, Bc3Error, Bc3Loading } from "@/components/bc3/ApiState";
import { useClub } from "@/hooks/useClub";
import { useMembers } from "@/hooks/useMembers";
import { useMemberClubs } from "@/hooks/useMemberClubs";
import { useSubClubs } from "@/hooks/useSubClubs";
import { byggMedlemskaber } from "@/lib/bc3-memberships";
import { MembershipActions } from "@/components/edituser/MembershipActions";
import { PartnerActions } from "@/components/edituser/PartnerActions";

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
  const redigeringsklub = medlemskaber[0];

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
          <Panel
            titel="Medlem"
            handling={
              fdbNo === "9999" && redigeringsklub ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    to="/bc3/online/$clubNumber/subclubs/$clubId"
                    params={{
                      clubNumber: fdbNo,
                      clubId: String(redigeringsklub.underklubId),
                    }}
                    search={{ editMemberId: Number(memberId) }}
                    hash="edituser"
                  >
                    Rediger medlem
                  </Link>
                </Button>
              ) : null
            }
          >
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
              <FeltRaekke
                label="Postnummer/by"
                vaerdi={[medlem.zipCode, medlem.city].filter(Boolean).join(" ") || "—"}
              />
              <FeltRaekke label="Land" vaerdi={medlem.countryCode || "—"} />
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
              titel="Makker og substitutstatus"
              beskrivelse="Medlemskaber, faste makkere og substitutstatus pr. underklub."
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
                        {fdbNo === "9999" && medlemsklubber.data && medlemmer.data ? (
                          <PartnerActions
                            fdbNo={fdbNo}
                            clubId={ms.underklubId}
                            clubName={ms.underklubNavn}
                            member={medlem}
                            link={medlemsklubber.data.find(
                              (row) =>
                                row.memberID === medlem.memberID && row.clubID === ms.underklubId,
                            )!}
                            allLinks={medlemsklubber.data}
                            members={medlemmer.data}
                          />
                        ) : (
                          <p className="text-sm">
                            Fast makker:{" "}
                            {ms.makkerstatus === "fundet"
                              ? ms.makkerNavn
                              : ms.makkerstatus === "ukendt"
                                ? "Ukendt medlem"
                                : "Ingen"}
                          </p>
                        )}
                      </div>
                      {fdbNo === "9999" && medlemsklubber.data && underklubber.data && (
                        <div className="mt-3 border-t border-border/60 pt-3">
                          <MembershipActions
                            fdbNo={fdbNo}
                            memberId={medlem.memberID}
                            memberName={medlem.name}
                            memberNo={medlem.memberNo}
                            sourceClubId={ms.underklubId}
                            sourceClubName={ms.underklubNavn}
                            partnerName={ms.makkerstatus === "fundet" ? ms.makkerNavn : undefined}
                            memberClubs={medlemsklubber.data}
                            subClubs={underklubber.data}
                          />
                        </div>
                      )}
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
