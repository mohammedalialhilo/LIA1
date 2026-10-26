import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Bits";
import { NyhedsListe } from "@/components/site/OrgShell";
import { getCircuit } from "@/lib/organization-data";
import { getCircuitContent } from "@/lib/organization-content";

export const Route = createFileRoute("/kreds/$id/nyheder")({
  head: ({ params }) => {
    const circuit = getCircuit(Number(params.id));
    const titel = `Nyheder fra ${circuit?.name ?? "kredsen"} – Danmarks Bridgeforbund`;
    const beskrivelse = `Nyheder og meddelelser fra ${circuit?.name ?? "kredsen"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: KredsNyheder,
});

function KredsNyheder() {
  const { id } = Route.useParams();
  const circuit = getCircuit(Number(id))!;
  const indhold = getCircuitContent(circuit.id);

  return (
    <Section label={circuit.name} titel="Nyheder">
      <NyhedsListe nyheder={indhold.news} />
    </Section>
  );
}
