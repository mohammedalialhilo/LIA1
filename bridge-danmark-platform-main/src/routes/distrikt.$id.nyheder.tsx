import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Bits";
import { NyhedsListe } from "@/components/site/OrgShell";
import { getDistrict } from "@/lib/organization-data";
import { getDistrictContent } from "@/lib/organization-content";

export const Route = createFileRoute("/distrikt/$id/nyheder")({
  head: ({ params }) => {
    const district = getDistrict(Number(params.id));
    const titel = `Nyheder fra ${district?.name ?? "distriktet"} – Danmarks Bridgeforbund`;
    const beskrivelse = `Nyheder og meddelelser fra ${district?.name ?? "distriktet"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: DistriktNyheder,
});

function DistriktNyheder() {
  const { id } = Route.useParams();
  const district = getDistrict(Number(id))!;
  const indhold = getDistrictContent(district.id);

  return (
    <Section label={district.name} titel="Nyheder">
      <NyhedsListe nyheder={indhold.news} />
    </Section>
  );
}
