import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ExternalLink,
  FileText,
  Info,
  Link2,
  Map,
  Newspaper,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Bits";
import {
  BestyrelseOgKontakt,
  InfoKort,
  LinkListe,
  NyhedsListe,
  TomtFelt,
  TurneringsListe,
} from "@/components/site/OrgShell";
import {
  clubsInDistrict,
  getCircuit,
  organizationDistricts,
} from "@/lib/organization-data";
import { getCircuitContent } from "@/lib/organization-content";

export const Route = createFileRoute("/kreds/$id/")({
  head: ({ params }) => {
    const circuit = getCircuit(Number(params.id));
    const titel = `${circuit?.name ?? "Kreds"} – Danmarks Bridgeforbund`;
    const beskrivelse = circuit?.description ?? "Kredsens side hos Danmarks Bridgeforbund.";
    return {
      meta: [
        { title: titel },
        { name: "description", content: beskrivelse },
        { property: "og:title", content: titel },
        { property: "og:description", content: beskrivelse },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: KredsForside,
});

function KredsForside() {
  const { id } = Route.useParams();
  const circuit = getCircuit(Number(id))!;
  const indhold = getCircuitContent(circuit.id);
  const districts = organizationDistricts.filter((d) => d.circuitId === circuit.id);
  const klubAntal = districts.reduce((sum, d) => sum + clubsInDistrict(d.id).length, 0);

  return (
    <Section
      label="Kredsens forside"
      titel={`Velkommen til ${circuit.name}`}
      beskrivelse="Her samles kredsens information, distrikter, klubber, turneringsplan og kontakt."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <InfoKort ikon={<Info className="size-5" />} titel="Om kredsen">
          <p>{indhold.about ?? circuit.description}</p>
        </InfoKort>

        <InfoKort
          ikon={<Map className="size-5" />}
          titel="Distrikter i kredsen"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/kreds/$id/distrikter" params={{ id }}>
                Se distrikter <ArrowRight />
              </Link>
            </Button>
          }
        >
          <ul className="space-y-1">
            {districts.map((d) => (
              <li key={d.id}>
                <Link
                  to="/distrikt/$id"
                  params={{ id: String(d.id) }}
                  className="font-semibold text-foreground hover:text-accent"
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </InfoKort>

        <InfoKort
          ikon={<Building2 className="size-5" />}
          titel="Klubber"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/kreds/$id/klubber" params={{ id }}>
                Se klubber <ArrowRight />
              </Link>
            </Button>
          }
        >
          <p>{klubAntal} klubber er registreret i kredsens distrikter.</p>
        </InfoKort>

        <InfoKort
          ikon={<Newspaper className="size-5" />}
          titel="Nyheder"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/kreds/$id/nyheder" params={{ id }}>
                Alle nyheder <ArrowRight />
              </Link>
            </Button>
          }
        >
          <NyhedsListe nyheder={indhold.news.slice(0, 2)} />
        </InfoKort>

        <InfoKort
          ikon={<CalendarDays className="size-5" />}
          titel="Kommende turneringer"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/kreds/$id/turneringer" params={{ id }}>
                Se turneringer <ArrowRight />
              </Link>
            </Button>
          }
        >
          <TurneringsListe turneringer={indhold.tournaments.slice(0, 2)} />
        </InfoKort>

        <InfoKort ikon={<CalendarDays className="size-5" />} titel="Turneringsplan">
          {indhold.tournamentPlanUrl ? (
            <Button asChild variant="outline" size="sm">
              <a href={indhold.tournamentPlanUrl} target="_blank" rel="noreferrer">
                Se turneringsplan <ExternalLink />
              </a>
            </Button>
          ) : (
            <TomtFelt tekst="Turneringsplanen bliver tilføjet senere." />
          )}
        </InfoKort>

        <InfoKort
          ikon={<Users className="size-5" />}
          titel="Bestyrelse og kontakt"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/kreds/$id/bestyrelse" params={{ id }}>
                Se bestyrelsen <ArrowRight />
              </Link>
            </Button>
          }
        >
          <BestyrelseOgKontakt bestyrelse={indhold.board.slice(0, 2)} kontakt={indhold.contact} />
        </InfoKort>

        <InfoKort
          ikon={<FileText className="size-5" />}
          titel="Dokumenter"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/kreds/$id/dokumenter" params={{ id }}>
                Se dokumenter <ArrowRight />
              </Link>
            </Button>
          }
        >
          <p>Referater, vedtægter og andre dokumenter kan lægges ind her.</p>
        </InfoKort>

        <InfoKort ikon={<Link2 className="size-5" />} titel="Eksterne links">
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
        </InfoKort>
      </div>
    </Section>
  );
}
