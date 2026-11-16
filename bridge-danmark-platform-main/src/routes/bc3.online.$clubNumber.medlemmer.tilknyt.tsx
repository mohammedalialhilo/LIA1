import { createFileRoute, Link } from "@tanstack/react-router";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { Bc3Empty } from "@/components/bc3/ApiState";
import { AssignExistingMember } from "@/components/edituser/AssignExistingMember";
import { useClub } from "@/hooks/useClub";

export const Route = createFileRoute("/bc3/online/$clubNumber/medlemmer/tilknyt")({
  validateSearch: (search: Record<string, unknown>): { clubId?: number } => {
    const clubId = Number(search["clubId"]);
    return Number.isInteger(clubId) && clubId > 0 ? { clubId } : {};
  },
  head: () => ({ meta: [{ title: "Tilføj eksisterende medlem – BC3 Online" }] }),
  component: TilknytMedlem,
});

function TilknytMedlem() {
  const { clubNumber: fdbNo } = Route.useParams();
  const { clubId } = Route.useSearch();
  const klub = useClub(fdbNo);
  const titel = klub.data ? `${klub.data.clubNo} – ${klub.data.name}` : undefined;

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
        <Link key="medlemmer" to="/bc3/online/$clubNumber/medlemmer" params={{ clubNumber: fdbNo }}>
          Medlemmer
        </Link>,
        "Tilføj eksisterende medlem",
      ]}
    >
      {fdbNo === "9999" ? (
        <AssignExistingMember key={clubId ?? "choose"} fdbNo={fdbNo} initialClubId={clubId} />
      ) : (
        <Bc3Empty tekst="Tilknytning af medlemmer er kun tilgængelig for klub 9999." />
      )}
    </Bc3Layout>
  );
}
