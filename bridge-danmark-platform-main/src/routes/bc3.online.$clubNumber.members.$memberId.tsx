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
import { FeeCategoryEditor } from "@/components/edituser/FeeCategoryEditor";
import {
  useFeeCategories,
  useMemberAdministration,
  useMemberHistory,
} from "@/hooks/useMemberAdministration";

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
  const administration = useMemberAdministration(fdbNo, Number(memberId));
  const categories = useFeeCategories(fdbNo);
  const history = useMemberHistory(fdbNo, Number(memberId));

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
          <div className="space-y-6">
            <Panel
              titel="Personlige oplysninger"
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
                <FeltRaekke label="Klubstart" vaerdi={medlem.clubStart} />
              </dl>
            </Panel>
            <Panel titel="Kontaktoplysninger">
              <dl>
                <FeltRaekke label="Adresse" vaerdi={medlem.address1 || "—"} />
                <FeltRaekke label="Adresse 2" vaerdi={medlem.address2 || "—"} />
                <FeltRaekke
                  label="Postnummer/by"
                  vaerdi={[medlem.zipCode, medlem.city].filter(Boolean).join(" ") || "—"}
                />
                <FeltRaekke label="Land" vaerdi={medlem.countryCode || "—"} />
                <FeltRaekke label="Telefon" vaerdi={medlem.phone1 || "—"} />
                <FeltRaekke label="Telefon 2" vaerdi={medlem.phone2 || "—"} />
                <FeltRaekke label="Telefon 3" vaerdi={medlem.phone3 || "—"} />
                <FeltRaekke label="E-mail" vaerdi={medlem.email || "—"} />
              </dl>
            </Panel>
          </div>

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
                      <p className="mt-1 text-xs text-muted-foreground">Tilknyttet underklubben</p>
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

            {fdbNo === "9999" && (
              <Panel
                titel="Medlemskabstype og kontingent"
                beskrivelse="BC3 registrerer en kontingentkategori på medlemmet. Lokale satser og betalingsposter er ikke tilgængelige i klub 9999."
              >
                {administration.isPending || categories.isPending ? (
                  <Bc3Loading />
                ) : administration.isError || categories.isError ? (
                  <Bc3Error fejl={administration.error ?? categories.error} />
                ) : (
                  <div className="space-y-3">
                    <dl>
                      <FeltRaekke
                        label="Kontingentkategori"
                        vaerdi={administration.data.feeCategoryName}
                      />
                      <FeltRaekke
                        label="Senest ændret"
                        vaerdi={
                          administration.data.statusChanged
                            ? new Date(administration.data.statusChanged).toLocaleString("da-DK")
                            : "—"
                        }
                      />
                    </dl>
                    <FeeCategoryEditor
                      fdbNo={fdbNo}
                      memberId={medlem.memberID}
                      memberName={medlem.name}
                      administration={administration.data}
                      categories={categories.data}
                    />
                    <p className="text-xs text-muted-foreground">
                      Underklubmedlemskaber har ingen særskilt inaktiv tilstand eller slutdato i den
                      lokale BC3-database.
                    </p>
                  </div>
                )}
              </Panel>
            )}

            <Panel titel="Mesterpoint">
              <dl>
                <FeltRaekke label="Bronze" vaerdi={medlem.totalBronze} />
                <FeltRaekke label="Sølv" vaerdi={medlem.totalSilver} />
                <FeltRaekke label="Guld" vaerdi={medlem.totalGold} />
                <FeltRaekke label="Mesterpoint i alt" vaerdi={medlem.totalMaster} />
              </dl>
            </Panel>

            {fdbNo === "9999" && (
              <Panel
                titel="Medlemshistorik"
                beskrivelse="De seneste 100 poster, som BC3 faktisk har gemt i sin log."
              >
                {history.isPending ? (
                  <Bc3Loading />
                ) : history.isError ? (
                  <Bc3Error fejl={history.error} />
                ) : history.data.length === 0 ? (
                  <Bc3Empty tekst="Ingen logposter fundet for medlemmet." />
                ) : (
                  <ol className="max-h-96 space-y-3 overflow-y-auto">
                    {history.data.map((entry) => (
                      <li key={entry.logId} className="rounded-lg border border-border p-3 text-sm">
                        <p>
                          {[entry.text1, entry.value1, entry.text2, entry.value2]
                            .filter(Boolean)
                            .join(" ")}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          <time dateTime={entry.at}>
                            {new Date(entry.at).toLocaleString("da-DK")}
                          </time>
                          {entry.actor ? ` · ${entry.actor}` : ""}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </Panel>
            )}
          </div>
        </div>
      )}
    </Bc3Layout>
  );
}
