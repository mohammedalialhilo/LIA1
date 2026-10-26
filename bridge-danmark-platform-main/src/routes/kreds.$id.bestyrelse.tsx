import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Bits";
import { BestyrelseOgKontakt } from "@/components/site/OrgShell";
import { getCircuit } from "@/lib/organization-data";
import { getCircuitContent } from "@/lib/organization-content";

export const Route = createFileRoute("/kreds/$id/bestyrelse")({
  head: ({ params }) => {
    const circuit = getCircuit(Number(params.id));
    const titel = `Bestyrelse og kontakt – ${circuit?.name ?? "kredsen"}`;
    const beskrivelse = `Bestyrelse og kontaktoplysninger for ${circuit?.name ?? "kredsen"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: KredsBestyrelse,
});

function KredsBestyrelse() {
  const { id } = Route.useParams();
  const circuit = getCircuit(Number(id))!;
  const indhold = getCircuitContent(circuit.id);

  return (
    <Section label={circuit.name} titel="Bestyrelse og kontakt">
      <BestyrelseOgKontakt bestyrelse={indhold.board} kontakt={indhold.contact} />
    </Section>
  );
}
