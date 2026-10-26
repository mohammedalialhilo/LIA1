import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Globe, Settings, Trophy, Users, BarChart3 } from "lucide-react";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { FeltRaekke, Panel } from "@/components/bc3/Bc3Bits";
import { Bc3QueryState } from "@/components/bc3/ApiState";
import { useClub } from "@/hooks/useClub";
import { Lock } from "lucide-react";
import { hentRettigheder, kanAdministrere } from "@/lib/bc3-roles";
import { findKlub } from "@/lib/demo-data";

export const Route = createFileRoute("/bc3/online/$clubNumber/dashboard")({
  head: () => ({
    meta: [
      { title: "Klubdashboard – BC3 Online" },
      { name: "description", content: "Klubbens samlede arbejdsområde: oplysninger, medlemmer, turneringer, resultater og hjemmeside." },
      { property: "og:title", content: "Klubdashboard – BC3 Online" },
      { property: "og:description", content: "Fælles klubdashboard, der forbinder BC3 Online og klubhjemmesiden." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Status = "virker" | "delvis" | "prototype";
const statusTekst: Record<Status, string> = {
  virker: "Virker med API",
  delvis: "Delvist – eksisterende sider",
  prototype: "Prototype – kommer senere",
};

function Omraade({ titel, ikon, status, children, handling }: {
  titel: string; ikon: ReactNode; status: Status; children: ReactNode; handling?: ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border bg-card p-5 ${status === "prototype" ? "border-dashed" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-primary [&_svg]:size-5">{ikon}</span>
        <Badge variant={status === "virker" ? "default" : "secondary"}>{statusTekst[status]}</Badge>
      </div>
      <h2 className="mt-3 font-display text-lg font-bold">{titel}</h2>
      <div className="mt-1 flex-1 text-sm text-muted-foreground">{children}</div>
      {handling && <div className="mt-4 flex flex-wrap gap-2">{handling}</div>}
    </div>
  );
}

function Dashboard() {
  const { clubNumber: fdbNo } = Route.useParams();
  const klub = useClub(fdbNo);
  const ret = hentRettigheder();
  const admin = kanAdministrere(ret, fdbNo);
  const offentlig = findKlub(fdbNo);
  const titel = klub.data ? `${klub.data.clubNo} – ${klub.data.name}` : undefined;
  const p = { clubNumber: fdbNo };

  return (
    <Bc3Layout fdbNo={fdbNo} titel={titel}>
      {!admin && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-dashed bg-card p-4 text-sm">
          <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">Klubadministration kræver administratorrettigheder til denne klub. Kontakt klubben eller DBF, hvis du mangler adgang.</p>
            <p className="mt-1 text-muted-foreground">{ret.mangler} Dashboardet viser derfor kun offentlige kluboplysninger.</p>
          </div>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Panel titel="Kluboplysninger" beskrivelse="Hentes fra BC3 API'et. Klubnummer er central identifikation.">
            <Bc3QueryState forespoergsel={klub}>
              {(k) => (
                <dl>
                  <FeltRaekke label="Klubnummer" vaerdi={<span className="font-mono">{k.clubNo}</span>} />
                  <FeltRaekke label="Navn" vaerdi={k.name} />
                  <FeltRaekke label="Adresse" vaerdi={[k.address, k.postalCode, k.city].filter(Boolean).join(", ") || "—"} />
                  <FeltRaekke label="Telefon" vaerdi={k.phone || "—"} />
                  <FeltRaekke label="E-mail" vaerdi={k.email || "—"} />
                </dl>
              )}
            </Bc3QueryState>
          </Panel>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <Omraade titel="Medlemmer" ikon={<Users />} status="virker"
            handling={<Button asChild size="sm"><Link to="/bc3/online/$clubNumber/medlemmer" params={p}>Medlemsoversigt</Link></Button>}>
            Medlemsoplysninger vises kun med den eksisterende godkendte adgang.
          </Omraade>

          <Omraade titel="Turneringer" ikon={<Trophy />} status="delvis"
            handling={<>
              <Button asChild size="sm" variant="outline"><Link to="/bc3/online/$clubNumber/underklubber" params={p}>Spillehold</Link></Button>
              <Button asChild size="sm" variant="outline"><Link to="/turneringer">Turneringskalender</Link></Button>
            </>}>
            Spillehold og spilletider fra BC3. Klubbens egne turneringer i BC3 er endnu ikke koblet til API'et.
          </Omraade>

          <Omraade titel="Resultater" ikon={<BarChart3 />} status="delvis"
            handling={<Button asChild size="sm" variant="outline"><Link to="/resultater">Resultatportalen</Link></Button>}>
            Klubresultater vises i dag via DBF's eksterne resultatsider på klubhjemmesiden. Import fra BC3 kommer senere.
          </Omraade>

          <Omraade titel="Klubhjemmeside" ikon={<Globe />} status={offentlig ? "delvis" : "prototype"}
            handling={offentlig ? <Button asChild size="sm"><Link to="/$klubId" params={{ klubId: fdbNo }}>Åbn offentlig hjemmeside</Link></Button> : undefined}>
            {offentlig ? "Den offentlige side, som besøgende ser. Viser kun offentlige kluboplysninger – aldrig medlemsdata." : "Klubben har endnu ingen hjemmeside på platformen."}
          </Omraade>

          <Omraade titel="Administration" ikon={admin ? <Settings /> : <Lock />} status="prototype">
            Fremtidig redigering af:
            <ul className="mt-2 list-disc space-y-0.5 pl-5">
              <li>Klubbens præsentation</li>
              <li>Kontaktoplysninger</li>
              <li>Spilletider og spillehold</li>
              <li>Nyheder</li>
              <li>Hjemmesidens indhold</li>
            </ul>
            <p className="mt-2">{admin ? "Redigering er endnu ikke implementeret." : "Låst – dine administratorrettigheder kan ikke verificeres."}</p>
          </Omraade>

          <Omraade titel="Stamoplysninger" ikon={<Building2 />} status="virker"
            handling={<Button asChild size="sm" variant="outline"><Link to="/bc3/online/$clubNumber/stamoplysninger" params={p}>Se alle felter</Link></Button>}>
            Fuld visning af klubbens stamdata fra BC3 (kun læsning).
          </Omraade>
        </div>
      </div>
    </Bc3Layout>
  );
}
