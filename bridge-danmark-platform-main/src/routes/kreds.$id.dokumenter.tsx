import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Bits";
import { DokumentListe, LinkListe } from "@/components/site/OrgShell";
import { getCircuit } from "@/lib/organization-data";
import { getCircuitContent } from "@/lib/organization-content";

export const Route = createFileRoute("/kreds/$id/dokumenter")({
  head: ({ params }) => {
    const circuit = getCircuit(Number(params.id));
    const titel = `Dokumenter og links – ${circuit?.name ?? "kredsen"}`;
    const beskrivelse = `Dokumenter og eksterne links for ${circuit?.name ?? "kredsen"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: KredsDokumenter,
});

function KredsDokumenter() {
  const { id } = Route.useParams();
  const circuit = getCircuit(Number(id))!;
  const indhold = getCircuitContent(circuit.id);

  return (
    <>
      <Section label={circuit.name} titel="Dokumenter">
        <DokumentListe dokumenter={indhold.documents} />
      </Section>
      <Section titel="Eksterne links" className="pt-0">
        <LinkListe
          links={
            circuit.websiteUrl
              ? [
                  {
                    id: "hjemmeside",
                    title: "Kredsens nuværende hjemmeside",
                    url: circuit.websiteUrl,
                  },
                  ...indhold.links.filter((l) => l.url !== circuit.websiteUrl),
                ]
              : indhold.links
          }
        />
      </Section>
    </>
  );
}
