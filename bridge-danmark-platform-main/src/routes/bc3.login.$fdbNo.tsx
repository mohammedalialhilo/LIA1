import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, LogIn, TriangleAlert } from "lucide-react";
import { bc3Auth, TEMPORARY_DEVELOPMENT_ACCESS } from "@/services/bc3Auth";
import { useClub } from "@/hooks/useClub";
import { API_BASE_URL, isDevelopment } from "@/api/firebirdApi";

export const Route = createFileRoute("/bc3/login/$fdbNo")({
  head: () => ({
    meta: [
      { title: "Log ind – BC3 Online" },
      { name: "description", content: "Log ind i BC3 Online for klubbens BC3-database." },
      { property: "og:title", content: "Log ind – BC3 Online" },
      {
        property: "og:description",
        content: "Adgang til klub-, underklub- og medlemsadministration i BC3 Online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Bc3Login,
});

function Bc3Login() {
  const { fdbNo } = Route.useParams();
  const navigate = useNavigate();
  const klub = useClub(fdbNo);
  const [brugernavn, setBrugernavn] = useState("");
  const [kodeord, setKodeord] = useState("");
  const [besked, setBesked] = useState<string | null>(null);
  const [sender, setSender] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSender(true);
    // Rigtig autentifikation sker i bc3Auth — den kræver et API-endpoint, som ikke findes endnu.
    const svar = await bc3Auth.login({ username: brugernavn, password: kodeord, fdbNo });
    setSender(false);
    if (svar.ok) {
      void navigate({ to: "/bc3/online/$clubNumber", params: { clubNumber: fdbNo } });
      return;
    }
    setBesked(svar.message);
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="section-label mb-1">BC3 Online</div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {klub.data ? `${klub.data.clubNo} · ${klub.data.name}` : `Klub ${fdbNo}`}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log ind for at åbne klub-, underklub- og medlemsadministration.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-10 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold">Log ind i BC3 Online</h2>
              <Badge variant="secondary" className="font-mono">
                Klub {fdbNo}
              </Badge>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="brugernavn">Brugernavn / medlemsnummer</Label>
                <Input
                  id="brugernavn"
                  value={brugernavn}
                  onChange={(e) => setBrugernavn(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kodeord">Adgangskode</Label>
                <Input
                  id="kodeord"
                  type="password"
                  value={kodeord}
                  onChange={(e) => setKodeord(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={sender}>
                <LogIn className="size-4" /> LOG IND
              </Button>
            </form>

            {besked && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-secondary/60 p-3 text-sm text-muted-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{besked}</span>
              </div>
            )}

            {/*
              MIDLERTIDIG UDVIKLINGSADGANG — IKKE AUTENTIFIKATION.
              Knappen springer login over, så BC3 Online kan testes mod det lokale
              Firebird-API. Skal fjernes, når POST /api/Auth/Login findes.
            */}
            {TEMPORARY_DEVELOPMENT_ACCESS && (
              <div className="mt-6 rounded-lg border border-dashed border-gold/60 bg-gold/5 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
                  <TriangleAlert className="size-3.5" /> Kun til udvikling
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Der findes endnu ikke et login-endpoint i BC3 API'et. Knappen nedenfor er
                  midlertidig udviklingsadgang og udfører ingen autentifikation.
                </p>
                <Button asChild variant="outline" className="mt-3 w-full">
                  <Link to="/bc3/online/$clubNumber" params={{ clubNumber: fdbNo }}>
                    Fortsæt til BC3 Online – udvikling
                  </Link>
                </Button>
              </div>
            )}

            <p className="mt-6 text-xs text-muted-foreground">
              <Link
                to="/$klubId"
                params={{ klubId: fdbNo }}
                className="hover:text-primary hover:underline"
              >
                Tilbage til klubbens hjemmeside
              </Link>
              {isDevelopment && <span className="ml-2 font-mono">API: {API_BASE_URL}</span>}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
