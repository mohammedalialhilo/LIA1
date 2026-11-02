import { createFileRoute, Link } from "@tanstack/react-router";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { Bc3Empty } from "@/components/bc3/ApiState";
import { AddMember } from "@/components/edituser/AddMember";
import { useClub } from "@/hooks/useClub";

export const Route = createFileRoute("/bc3/online/$clubNumber/medlemmer/tilfoej")({
  head: () => ({ meta: [{ title: "Tilføj medlem – BC3 Online" }] }),
  component: TilfoejMedlem,
});

function TilfoejMedlem() {
  const { clubNumber: fdbNo } = Route.useParams();
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
        "Tilføj medlem",
      ]}
    >
      {fdbNo === "9999" ? (
        <AddMember fdbNo={fdbNo} />
      ) : (
        <Bc3Empty tekst="Tilføjelse af medlemmer er kun tilgængelig for klub 9999." />
      )}
    </Bc3Layout>
  );
}
