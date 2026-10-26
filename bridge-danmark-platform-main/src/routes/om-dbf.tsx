import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Bits";
import { nyheder } from "@/lib/demo-data";
import laerBillede from "@/assets/laer-bridge.jpg";

export const Route = createFileRoute("/om-dbf")({
  head: () => ({
    meta: [
      { title: "Om Danmarks Bridgeforbund – bridge.dk" },
      {
        name: "description",
        content:
          "Danmarks Bridgeforbund samler klubberne i seks distrikter og fire kredse. Læs om forbundet, Dansk Bridge, undervisning og kontakt sekretariatet.",
      },
      { property: "og:title", content: "Om Danmarks Bridgeforbund – bridge.dk" },
      {
        property: "og:description",
        content: "Forbundet, medlemsbladet Dansk Bridge, undervisning og kontakt.",
      },
    ],
  }),
  component: OmDbf,
});

function OmDbf() {
  return (
    <>
      <PageHero
        label="Om DBF"
        titel="Danmarks Bridgeforbund"
        beskrivelse="Forbundet organiserer dansk bridge: klubber, distrikter, kredse, turneringer, undervisning, handicap og mesterpoint."
      />

      <Section titel="Forbundet i korte træk">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold">Organisation</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Klubberne er samlet i distrikter, som igen hører under fire kredse. Repræsentantskabet
                er forbundets øverste myndighed.
              </p>
              <Button asChild variant="link" className="mt-3 px-0">
                <Link to="/klubber/distrikter">Distrikter og kredse</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold">Dansk Bridge</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Forbundets medlemsblad udkommer flere gange årligt med reportager, spilanalyser og
                nyheder fra klubberne.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold">Sekretariatet</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Asylgade 13, 5000 Odense C · 48 47 52 13 · dbf@demo.bridge.dk (demo).
                Sekretariatet hjælper klubber med medlemsadministration og BridgeCentral.
              </p>
              <Button asChild variant="link" className="mt-3 px-0">
                <Link to="/bc3">Support til BC3</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      <section className="bg-sand py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <img
            src={laerBillede}
            alt="Undervisning i bridge"
            width={1200}
            height={900}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover lift-shadow"
          />
          <div>
            <p className="section-label mb-2">Lær at spille bridge</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Bridge kan læres i alle aldre</h2>
            <p className="mt-3 text-muted-foreground">
              Forbundet uddanner undervisere og udvikler materiale, så klubberne kan tilbyde kurser af
              høj kvalitet. Kursister oprettes i Kursusklub 9999, indtil de melder sig ind i en klub.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="accent">
                <Link to="/turneringer">Find et kursus</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/klubber">Find en klub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section titel="Nyheder fra forbundet">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {nyheder.map((n) => (
            <article key={n.titel} className="rounded-xl border border-border bg-card p-5 card-shadow">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {n.kategori} · {n.dato}
              </p>
              <h3 className="mt-1 font-bold">{n.titel}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{n.resume}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
