import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/site/Bits";
import { DokumentListe, LinkListe } from "@/components/site/OrgShell";
import { getDistrict } from "@/lib/organization-data";
import { getDistrictContent } from "@/lib/organization-content";

export const Route = createFileRoute("/distrikt/$id/dokumenter")({
  head: ({ params }) => {
    const district = getDistrict(Number(params.id));
    const titel = `Dokumenter og links – ${district?.name ?? "distriktet"}`;
    const beskrivelse = `Dokumenter og links for ${district?.name ?? "distriktet"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: DistriktDokumenter,
});

function DistriktDokumenter() {
  const { id } = Route.useParams();
  const district = getDistrict(Number(id))!;
  const indhold = getDistrictContent(district.id);

  return (
    <>
      <Section label={district.name} titel="Dokumenter">
        <DokumentListe dokumenter={indhold.documents} />
      </Section>
      <Section titel="Links" className="pt-0">
        <LinkListe
          links={
            district.websiteUrl
              ? [
                  {
                    id: "hjemmeside",
                    title: "Distriktets nuværende hjemmeside",
                    url: district.websiteUrl,
                  },
                  ...indhold.links,
                ]
              : indhold.links
          }
        />
      </Section>
    </>
  );
}
