import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Bits";
import { KlubTabel } from "@/components/site/OrgShell";
import { getCircuit, organizationClubs } from "@/lib/organization-data";

export const Route = createFileRoute("/kreds/$id/klubber")({
  head: ({ params }) => {
    const circuit = getCircuit(Number(params.id));
    const titel = `Klubber i ${circuit?.name ?? "kredsen"} – Danmarks Bridgeforbund`;
    const beskrivelse = `Bridgeklubber i ${circuit?.name ?? "kredsen"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: KredsKlubber,
});

function KredsKlubber() {
  const { id } = Route.useParams();
  const circuit = getCircuit(Number(id))!;
  const klubber = organizationClubs.filter((club) => club.circuitId === circuit.id);

  return (
    <Section
      label={circuit.name}
      titel="Klubber i kredsen"
      beskrivelse="Klubberne hentes fra platformens fælles klubkatalog."
    >
      <KlubTabel klubber={klubber} />
    </Section>
  );
}
