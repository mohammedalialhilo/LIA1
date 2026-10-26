import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ExternalLink, Landmark, Map, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClubFeatureCard } from "@/components/site/ClubFeatureCard";
import { PageHero, Section } from "@/components/site/Bits";
import { recentlyAddedClubs } from "@/lib/organization-data";

export const Route = createFileRoute("/klub-og-medlem")({
  head: () => ({
    meta: [
      { title: "Klub og medlem – bridge.dk" },
      {
        name: "description",
        content: "Find danske bridgeklubber, distrikter og kredse samt de vigtigste klub- og medlemsområder.",
      },
      { property: "og:title", content: "Klub og medlem – bridge.dk" },
      {
        property: "og:description",
        content: "Indgangen til klubber, distrikter og kredse under Danmarks Bridgeforbund.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KlubOgMedlem,
});

function KlubOgMedlem() {
  return (
    <>
      <PageHero
        label="Danmarks Bridgeforbund"
        titel="Klub og medlem"
        beskrivelse="Find bridgeklubber, distrikter og kredse og få adgang til de vigtigste klub- og medlemsfunktioner."
      />

      <Section
        titel="Find vej til din klub"
        beskrivelse="Gå direkte til kluboversigten eller se, hvordan klubberne er organiseret i distrikter og kredse."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <ClubFeatureCard
            ikon={<Building2 className="size-6" />}
            titel="Klubber i Danmark"
            tekst="Find bridgeklubber i hele Danmark og gå videre til klubbens hjemmeside og oplysninger."
            handling={
              <Button asChild variant="outline">
                <Link to="/klubber">Find en klub <ArrowRight /></Link>
              </Button>
            }
          />
          <ClubFeatureCard
            ikon={<Map className="size-6" />}
            titel="Distrikter og kredse"
            tekst="Se DBF's 11 distrikter og fire kredse, og find de klubber, der hører til hvert område."
            handling={
              <Button asChild variant="outline">
                <Link to="/distrikter-og-kredse">Se organisationen <ArrowRight /></Link>
              </Button>
            }
          />
          <ClubFeatureCard
            ikon={<Landmark className="size-6" />}
            titel="Kredshjemmesider"
            tekst="Gå til kredsoversigten, og find de registrerede hjemmesider og klubber for hver kreds."
            handling={
              <Button asChild variant="outline">
                <Link to="/distrikter-og-kredse" hash="kredse">Se kredse <ArrowRight /></Link>
              </Button>
            }
          />
        </div>
      </Section>

      <Section
        label="Klubkatalog"
        titel="Nyeste klubber"
        beskrivelse="Her kan de senest tilføjede klubber vises. I prototypen vises de seneste klubsider, der er oprettet på platformen."
        className="pt-0"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {recentlyAddedClubs.map((club) => (
            <Card key={club.clubNo}>
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">Klub {club.clubNo}</span>
                </div>
                <h3 className="font-display text-xl font-bold">{club.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{club.city}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <Link to="/$klubId" params={{ klubId: String(club.clubNo) }}>
                      Se klubside <ArrowRight />
                    </Link>
                  </Button>
                  {club.websiteUrl && (
                    <Button asChild variant="ghost">
                      <a href={club.websiteUrl} target="_blank" rel="noreferrer">
                        Ekstern hjemmeside <ExternalLink />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}