import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Bits";
import { BestyrelseOgKontakt } from "@/components/site/OrgShell";
import { getDistrict } from "@/lib/organization-data";
import { getDistrictContent } from "@/lib/organization-content";

export const Route = createFileRoute("/distrikt/$id/bestyrelse")({
  head: ({ params }) => {
    const district = getDistrict(Number(params.id));
    const titel = `Bestyrelse og kontakt – ${district?.name ?? "distriktet"}`;
    const beskrivelse = `Bestyrelse og kontaktoplysninger for ${district?.name ?? "distriktet"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: DistriktBestyrelse,
});

function DistriktBestyrelse() {
  const { id } = Route.useParams();
  const district = getDistrict(Number(id))!;
  const indhold = getDistrictContent(district.id);

  return (
    <Section label={district.name} titel="Bestyrelse og kontakt">
      <BestyrelseOgKontakt bestyrelse={indhold.board} kontakt={indhold.contact} />
    </Section>
  );
}
