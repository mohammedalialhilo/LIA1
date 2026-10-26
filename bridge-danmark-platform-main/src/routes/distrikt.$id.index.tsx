import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  ExternalLink,
  Globe,
  CalendarDays,
  FileText,
  Info,
  Link2,
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
  TurneringsListe,
} from "@/components/site/OrgShell";
import { clubsInDistrict, getCircuit, getDistrict } from "@/lib/organization-data";
import { getDistrictContent } from "@/lib/organization-content";

export const Route = createFileRoute("/distrikt/$id/")({
  head: ({ params }) => {
    const district = getDistrict(Number(params.id));
    const titel = `${district?.name ?? "Distrikt"} – Danmarks Bridgeforbund`;
    const beskrivelse =
      district?.description ?? "Distriktets side hos Danmarks Bridgeforbund.";
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
  component: DistriktForside,
});

function DistriktForside() {
  const { id } = Route.useParams();
  const district = getDistrict(Number(id))!;
  const circuit = getCircuit(district.circuitId);
  const indhold = getDistrictContent(district.id);
  const klubber = clubsInDistrict(district.id);

  return (
    <Section
      label="Distriktets forside"
      titel={`Velkommen til ${district.name}`}
      beskrivelse="Her samles distriktets information, klubber, turneringer og kontaktoplysninger."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <InfoKort ikon={<Info className="size-5" />} titel="Om distriktet">
          <p>{indhold.about ?? district.description}</p>
          {circuit && <p className="mt-2 font-semibold text-foreground">Hører til {circuit.name}</p>}
        </InfoKort>

        <InfoKort
          ikon={<Newspaper className="size-5" />}
          titel="Nyheder"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/distrikt/$id/nyheder" params={{ id }}>
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
              <Link to="/distrikt/$id/turneringer" params={{ id }}>
                Se turneringer <ArrowRight />
              </Link>
            </Button>
          }
        >
          <TurneringsListe turneringer={indhold.tournaments.slice(0, 2)} />
        </InfoKort>

        <InfoKort
          ikon={<Building2 className="size-5" />}
          titel="Klubber i distriktet"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/distrikt/$id/klubber" params={{ id }}>
                Se klubber i distriktet <ArrowRight />
              </Link>
            </Button>
          }
        >
          <p>Find distriktets bridgeklubber, spilledage og links til klubbernes egne sider.</p>
          {klubber.length > 0 && (
            <ul className="mt-3 space-y-1">
              {klubber.slice(0, 3).map((k) => (
                <li key={k.clubNo}>
                  <span className="font-mono">{k.clubNo}</span> · {k.name}
                </li>
              ))}
            </ul>
          )}
        </InfoKort>

        <InfoKort
          ikon={<Users className="size-5" />}
          titel="Bestyrelse og kontakt"
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/distrikt/$id/bestyrelse" params={{ id }}>
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
              <Link to="/distrikt/$id/dokumenter" params={{ id }}>
                Se dokumenter <ArrowRight />
              </Link>
            </Button>
          }
        >
          {indhold.documents.length ? (
            <ul className="space-y-1">
              {indhold.documents.slice(0, 4).map((d) => (
                <li key={d.id} className="font-semibold text-foreground">{d.title}</li>
              ))}
            </ul>
          ) : (
            <p>Vedtægter, referater og andre dokumenter kan lægges ind her.</p>
          )}
        </InfoKort>

        <InfoKort ikon={<Link2 className="size-5" />} titel="Links">
          <LinkListe links={indhold.links} />
        </InfoKort>

        {district.websiteUrl && (
          <InfoKort
            ikon={<Globe className="size-5" />}
            titel="Nuværende hjemmeside"
            handling={
              <Button asChild variant="outline" size="sm">
                <a href={district.websiteUrl} target="_blank" rel="noreferrer">
                  Besøg den eksisterende {district.legacyPlatform ?? ""}-side <ExternalLink />
                </a>
              </Button>
            }
          >
            <p>
              Under migrationsperioden findes distriktets gamle hjemmeside stadig som supplement. Denne side
              bliver på sigt erstatningen.
            </p>
          </InfoKort>
        )}
      </div>
    </Section>
  );
}
