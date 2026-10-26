import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/site/Bits";
import { getCircuit, organizationDistricts } from "@/lib/organization-data";

export const Route = createFileRoute("/kreds/$id/distrikter")({
  head: ({ params }) => {
    const circuit = getCircuit(Number(params.id));
    const titel = `Distrikter i ${circuit?.name ?? "kredsen"} – Danmarks Bridgeforbund`;
    const beskrivelse = `Distrikterne der hører til ${circuit?.name ?? "kredsen"}.`;
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
      ],
    };
  },
  component: KredsDistrikter,
});

function KredsDistrikter() {
  const { id } = Route.useParams();
  const circuit = getCircuit(Number(id))!;
  const districts = organizationDistricts.filter((d) => d.circuitId === circuit.id);

  return (
    <Section label={circuit.name} titel="Distrikter i kredsen">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {districts.map((d) => (
          <Card key={d.id} className="h-full">
            <CardContent className="flex h-full flex-col p-6">
              <span className="mb-4 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <h3 className="font-display text-xl font-bold">{d.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.description}</p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link to="/distrikt/$id" params={{ id: String(d.id) }}>
                    Gå til distriktet <ArrowRight />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
