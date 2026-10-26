import { createFileRoute, Link } from "@tanstack/react-router";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { FeltRaekke, Panel } from "@/components/bc3/Bc3Bits";
import { Bc3QueryState } from "@/components/bc3/ApiState";
import { useClub } from "@/hooks/useClub";

export const Route = createFileRoute("/bc3/online/$clubNumber/stamoplysninger")({
  head: () => ({
    meta: [
      { title: "Stamoplysninger – BC3 Online" },
      {
        name: "description",
        content: "Klubbens stamoplysninger fra BC3-databasen: adresse, kontakt og distrikt.",
      },
      { property: "og:title", content: "Stamoplysninger – BC3 Online" },
      {
        property: "og:description",
        content: "Adresse, kontaktoplysninger, website og distrikt for klubben.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Stamoplysninger,
});

function Stamoplysninger() {
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
        "Stamoplysninger",
      ]}
    >
      <div className="max-w-3xl">
        <Panel titel="Stamoplysninger" beskrivelse="Oplysningerne kommer fra BC3 API'et.">
          <Bc3QueryState forespoergsel={klub}>
            {(k) => (
              <dl>
                <FeltRaekke
                  label="Klubnummer"
                  vaerdi={<span className="font-mono">{k.clubNo}</span>}
                />
                <FeltRaekke label="Navn" vaerdi={k.name} />
                <FeltRaekke label="Status" vaerdi={k.status} />
                <FeltRaekke label="Adresse" vaerdi={k.address} />
                <FeltRaekke label="Postnummer" vaerdi={k.postalCode} />
                <FeltRaekke label="By" vaerdi={k.city} />
                <FeltRaekke label="Telefon" vaerdi={k.phone} />
                <FeltRaekke label="E-mail" vaerdi={k.email} />
                <FeltRaekke label="Website" vaerdi={k.website} />
                <FeltRaekke
                  label="Distrikt"
                  vaerdi={<span className="font-mono">{k.districtNo}</span>}
                />
              </dl>
            )}
          </Bc3QueryState>
        </Panel>
      </div>
    </Bc3Layout>
  );
}
