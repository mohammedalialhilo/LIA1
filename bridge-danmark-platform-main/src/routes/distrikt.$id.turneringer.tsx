import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Bits";
import { TurneringsListe } from "@/components/site/OrgShell";
import { getDistrict } from "@/lib/organization-data";
import { getDistrictContent } from "@/lib/organization-content";

export const Route = createFileRoute("/distrikt/$id/turneringer")({
  head: ({ params }) => {
    const district = getDistrict(Number(params.id));
    const titel = `Turneringer i ${district?.name ?? "distriktet"} – Danmarks Bridgeforbund`;
    const beskrivelse = `Kommende turneringer i ${district?.name ?? "distriktet"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: DistriktTurneringer,
});

function DistriktTurneringer() {
  const { id } = Route.useParams();
  const district = getDistrict(Number(id))!;
  const indhold = getDistrictContent(district.id);

  return (
    <Section label={district.name} titel="Kommende turneringer">
      <TurneringsListe turneringer={indhold.tournaments} />
    </Section>
  );
}
