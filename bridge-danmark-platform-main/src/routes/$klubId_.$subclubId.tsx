import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { CalendarDays, ChevronLeft, Clock, ExternalLink, MapPin, Trophy, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClubFeatureCard } from "@/components/site/ClubFeatureCard";
import { Section } from "@/components/site/Bits";
import { findKlub, spilleholdId } from "@/lib/demo-data";

export const Route = createFileRoute("/$klubId_/$subclubId")({
  loader: ({ params }) => {
    const klub = findKlub(params.klubId);
    const spillehold = klub?.spillehold?.find((hold) => spilleholdId(hold) === params.subclubId);
    if (!klub || !spillehold) throw notFound();
    return { klub, spillehold };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Spillehold ikke fundet – bridge.dk" },
          { name: "description", content: "Det valgte spillehold blev ikke fundet." },
          { property: "og:title", content: "Spillehold ikke fundet – bridge.dk" },
          { property: "og:description", content: "Det valgte spillehold blev ikke fundet." },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ],
      };
    }
    const { klub, spillehold } = loaderData;
    const title = `${spillehold.navn} – ${klub.navn}`;
    const description = `${spillehold.beskrivelse} Se turneringer og officielle resultater for spilleholdet.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: SpilleholdSide,
});

function SpilleholdSide() {
  const { klub, spillehold } = Route.useLoaderData();
  const adresseLinjer = (
    spillehold.spillested
      ? [spillehold.spillested]
      : [
          klub.spillestedNavn,
          klub.adresse,
          klub.postnummer ? `${klub.postnummer} ${klub.by}` : undefined,
        ]
  ).filter(Boolean) as string[];
  const holdId = spilleholdId(spillehold);
  const tema = {
    "--primary": klub.tema.primary,
    "--accent": klub.tema.accent,
    "--ring": klub.tema.primary,
  } as CSSProperties;

  return (
    <div style={tema}>
      <div className="hero-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <Link
            to="/$klubId"
            params={{ klubId: klub.nr }}
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ChevronLeft className="size-4" /> Tilbage til {klub.navn}
          </Link>
          <div className="flex flex-wrap items-start gap-6">
            <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-primary-foreground/95 font-display text-2xl font-bold text-primary">
              {klub.logoTekst}
            </div>
            <div className="min-w-[16rem] flex-1">
              <p className="section-label mb-2">{klub.navn} → Spillehold {holdId}</p>
              <h1 className="max-w-4xl text-3xl font-bold sm:text-4xl">{spillehold.navn}</h1>
              <p className="mt-3 max-w-2xl text-primary-foreground/80">{spillehold.beskrivelse}</p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-primary-foreground/85">
                {spillehold.spilletid && (
                  <span className="flex items-center gap-2"><Clock className="size-4" /> {spillehold.spilletid}</span>
                )}
                {spillehold.holdleder && (
                  <span className="flex items-center gap-2"><UserRound className="size-4" /> Holdleder {spillehold.holdleder}</span>
                )}
                <span className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span>{adresseLinjer.join(", ")}</span>
                </span>
              </div>
              {spillehold.undervisning && (
                <p className="mt-4 font-semibold text-primary-foreground">{spillehold.undervisning}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Section
        label={`${klub.navn} · ${spillehold.navn}`}
        titel="Turneringer og resultater"
        beskrivelse={
          spillehold.resultsUrl
            ? "Turneringer og resultater følger det valgte spillehold."
            : "Spilleholdets officielle turneringsoversigt er endnu ikke oprettet i Danmarks Bridgeforbunds resultatsystem."
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <ClubFeatureCard
            ikon={<CalendarDays className="size-6" />}
            titel="Turneringsoversigt"
            tekst="Se spilleholdets turneringer og spilleaftener i det officielle resultatsystem."
            handling={
              spillehold.resultsUrl ? (
                <Button asChild size="lg" className="w-full">
                  <a href={spillehold.resultsUrl} target="_blank" rel="noreferrer noopener">
                    Se turneringsoversigt <ExternalLink />
                  </a>
                </Button>
              ) : (
                <Badge variant="secondary">Link endnu ikke oprettet</Badge>
              )
            }
          />
          {spillehold.aktuelleTurneringUrl ? (
            <ClubFeatureCard
              ikon={<Trophy className="size-6" />}
              titel="Aktuelle turneringer"
              tekst="Se spilleholdets aktuelle turnering direkte i DBF's resultatsystem."
              handling={
                <Button asChild size="lg" className="w-full">
                  <a href={spillehold.aktuelleTurneringUrl} target="_blank" rel="noreferrer noopener">
                    Se aktuelle turneringer <ExternalLink />
                  </a>
                </Button>
              }
            />
          ) : (
            <ClubFeatureCard
              ikon={<Trophy className="size-6" />}
              titel="Resultater"
              tekst={
                spillehold.resultsUrl
                  ? `Se officielle resultater for ${spillehold.navn}.`
                  : `Resultater for ${spillehold.navn} vises, så snart spilleholdets officielle nummer er bekræftet.`
              }
              handling={
                spillehold.resultsUrl ? (
                  <Button asChild size="lg" className="w-full">
                    <a href={spillehold.resultsUrl} target="_blank" rel="noreferrer noopener">
                      Se resultater <ExternalLink />
                    </a>
                  </Button>
                ) : (
                  <Badge variant="secondary">Link endnu ikke oprettet</Badge>
                )
              }
            />
          )}
          {spillehold.handicapUrl && (
            <ClubFeatureCard
              ikon={<Trophy className="size-6" />}
              titel="Handicap"
              tekst="Se spilleholdets handicapliste hos Danmarks Bridgeforbund."
              handling={
                <Button asChild size="lg" className="w-full">
                  <a href={spillehold.handicapUrl} target="_blank" rel="noreferrer noopener">
                    Se handicapliste <ExternalLink />
                  </a>
                </Button>
              }
            />
          )}
        </div>
      </Section>

      <Section titel="Om spilleholdet" className="bg-secondary/40 pt-10">
        <Card>
          <CardContent className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div><p className="section-label mb-1">Hovedklub</p><p className="font-semibold">{klub.navn}</p></div>
            <div><p className="section-label mb-1">Klubnummer</p><p className="font-mono font-semibold">{klub.nr}{spillehold.clubNo ? ` / ${spillehold.clubNo}` : ""}</p></div>
            <div><p className="section-label mb-1">Aktivitet</p><p className="font-semibold">{spillehold.aktivitet ?? "Bridge"}</p></div>
            <div><p className="section-label mb-1">Spillested</p><p className="font-semibold">{spillehold.spillested ?? klub.spillestedNavn ?? klub.adresse}</p></div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}