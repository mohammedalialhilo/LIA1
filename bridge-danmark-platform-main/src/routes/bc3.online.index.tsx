import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database } from "lucide-react";
import { API_BASE_URL, isDevelopment } from "@/api/firebirdApi";

/** Vis kun de klubnumre, som den valgte lokale API-kilde er sat op til. */
const fdbDatabaser =
  import.meta.env["VITE_BC3_API_SOURCE"] === "mssql"
    ? [
        {
          fdbNo: "2132",
          navn: "Klub 2132",
          beskrivelse: "Tilgængelig via det lokale SQL Server API.",
        },
        {
          fdbNo: "2133",
          navn: "Klub 2133",
          beskrivelse: "Tilgængelig via det lokale SQL Server API.",
        },
      ]
    : [
        {
          fdbNo: "9999",
          navn: "Kursusklub",
          beskrivelse: "DBF's kursus- og testmiljø. Data hentes fra 9999.fdb gennem BC3 API'et.",
        },
      ];

export const Route = createFileRoute("/bc3/online/")({
  head: () => ({
    meta: [
      { title: "BC3 Online – klub- og medlemsadministration" },
      {
        name: "description",
        content:
          "BC3 Online: webudgave af klub-, underklub- og medlemsadministration med data fra klubbens BC3-database.",
      },
      { property: "og:title", content: "BC3 Online – klub- og medlemsadministration" },
      {
        property: "og:description",
        content: "Vælg klubdatabase og arbejd med underklubber og medlemmer i BC3 Online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Bc3OnlineForside,
});

function Bc3OnlineForside() {
  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="section-label mb-2">BridgeCentral</div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">BC3 Online</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Klub- og medlemsadministration
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Klubber, underklubber og medlemmer hentes fra klubbens BC3-database gennem BC3 API'et.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/bc3">BC3-information</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/bc3/teknisk">Teknisk dokumentation</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <h2 className="font-display text-2xl font-bold">Vælg klubdatabase</h2>
        <p className="mt-1 text-sm text-muted-foreground">Adgang kræver login i BC3 Online.</p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {fdbDatabaser.map((d) => (
            <Card key={d.fdbNo} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <p className="font-mono text-sm text-muted-foreground">FDB {d.fdbNo}</p>
                <p className="font-display text-2xl font-bold">{d.navn}</p>
                <p className="mt-3 text-sm text-muted-foreground">{d.beskrivelse}</p>
                <Button asChild variant="accent" className="mt-5">
                  <Link to="/bc3/login/$fdbNo" params={{ fdbNo: d.fdbNo }}>
                    Log ind i BC3 Online <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {isDevelopment && (
          <p className="mt-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Database className="size-3.5" /> BC3 API · {API_BASE_URL}
          </p>
        )}
      </div>
    </div>
  );
}
