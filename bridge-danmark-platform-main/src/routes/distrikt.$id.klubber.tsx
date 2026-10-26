import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Bits";
import { KlubReferencer, KlubTabel } from "@/components/site/OrgShell";
import { clubsInDistrict, getDistrict } from "@/lib/organization-data";
import { getDistrictContent } from "@/lib/organization-content";

export const Route = createFileRoute("/distrikt/$id/klubber")({
  head: ({ params }) => {
    const district = getDistrict(Number(params.id));
    const titel = `Klubber i ${district?.name ?? "distriktet"} – Danmarks Bridgeforbund`;
    const beskrivelse = `Bridgeklubber der hører til ${district?.name ?? "distriktet"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: DistriktKlubber,
});

function DistriktKlubber() {
  const { id } = Route.useParams();
  const district = getDistrict(Number(id))!;
  const klubber = clubsInDistrict(district.id);
  const katalogNumre = new Set(klubber.map((k) => k.clubNo));
  const referencer = (getDistrictContent(district.id).clubReferences ?? []).filter(
    (k) => !katalogNumre.has(k.clubNo),
  );

  return (
    <Section
      label={district.name}
      titel="Klubber i distriktet"
      beskrivelse="Klubberne hentes fra platformens fælles klubkatalog."
      handling={
        <Button asChild variant="outline">
          <Link to="/klubber">Hele kluboversigten <ArrowRight /></Link>
        </Button>
      }
    >
      <KlubTabel klubber={klubber} />
      {referencer.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 font-display text-xl font-bold">Klubber fra den nuværende hjemmeside</h3>
          <KlubReferencer klubber={referencer} kildeUrl={district.websiteUrl} />
        </div>
      )}
    </Section>
  );
}
