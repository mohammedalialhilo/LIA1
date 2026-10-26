import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Bits";
import { TomtFelt, TurneringsListe } from "@/components/site/OrgShell";
import { getCircuit } from "@/lib/organization-data";
import { getCircuitContent } from "@/lib/organization-content";

export const Route = createFileRoute("/kreds/$id/turneringer")({
  head: ({ params }) => {
    const circuit = getCircuit(Number(params.id));
    const titel = `Turneringer i ${circuit?.name ?? "kredsen"} – Danmarks Bridgeforbund`;
    const beskrivelse = `Turneringer og turneringsplan for ${circuit?.name ?? "kredsen"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: KredsTurneringer,
});

function KredsTurneringer() {
  const { id } = Route.useParams();
  const circuit = getCircuit(Number(id))!;
  const indhold = getCircuitContent(circuit.id);

  return (
    <>
      <Section label={circuit.name} titel="Kommende turneringer">
        <TurneringsListe turneringer={indhold.tournaments} />
      </Section>
      <Section titel="Turneringsplan" className="pt-0">
        {indhold.tournamentPlanUrl ? (
          <Button asChild variant="outline">
            <a href={indhold.tournamentPlanUrl} target="_blank" rel="noreferrer">
              Se turneringsplan <ExternalLink />
            </a>
          </Button>
        ) : (
          <TomtFelt tekst="Turneringsplanen bliver tilføjet senere." />
        )}
      </Section>
    </>
  );
}
