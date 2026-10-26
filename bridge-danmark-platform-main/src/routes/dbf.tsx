import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AdminShell } from "@/components/site/AdminShell";
import { DevInfo } from "@/components/site/Bits";
import { erDbf, useSession } from "@/lib/session";
import { distrikter, klubKatalog } from "@/lib/demo-data";
import { LogIn } from "lucide-react";

const menu = [
  "Klubber",
  "Medlemmer",
  "Turneringer",
  "Tilmeldinger",
  "Resultater",
  "Handicap",
  "Mesterpoint",
  "Distrikter",
  "Systemadministration",
];

export const Route = createFileRoute("/dbf")({
  head: () => ({
    meta: [
      { title: "DBF-administration (5000) – bridge.dk" },
      {
        name: "description",
        content: "Central administration for Danmarks Bridgeforbund: klubber, medlemmer, turneringer og systemer.",
      },
      { property: "og:title", content: "DBF-administration – bridge.dk" },
      { property: "og:description", content: "Forbundets centrale administrationsmiljø." },
    ],
  }),
  component: DbfAdmin,
});

function DbfAdmin() {
  const { session, aabnLogin } = useSession();
  const [aktiv, setAktiv] = useState("Klubber");

  if (!session || !erDbf(session.medlem)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center lg:px-8">
        <h1 className="text-3xl font-bold">Kun for DBF-medarbejdere</h1>
        <p className="mt-3 text-muted-foreground">
          Log ind med demobrugeren 500012 for at se forbundets centrale administrationsmiljø (klub 5000).
        </p>
        <Button variant="accent" size="lg" className="mt-6" onClick={() => aabnLogin()}>
          <LogIn /> Log ind
        </Button>
      </div>
    );
  }

  return (
    <AdminShell
      system="Online BC3 · Forbund"
      kontekst="5000 – Danmarks Bridgeforbund"
      menu={menu}
      aktiv={aktiv}
      onVaelg={setAktiv}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label mb-1">DBF-administration</p>
          <h1 className="text-3xl font-bold">{aktiv}</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/bc3/online">Skift til klubkontekst</Link>
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Klubber", "257"],
          ["Medlemmer", "19.104"],
          ["Aktive turneringer", "412"],
          ["Distrikter", String(distrikter.length)],
        ].map(([t, v]) => (
          <Card key={t}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{t}</p>
              <p className="mt-1 font-display text-3xl font-bold">{v}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {aktiv === "Klubber" && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold">Klubber (udsnit)</h2>
            <table className="mt-4 w-full text-sm">
              <thead className="text-left font-display text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2">Nr.</th>
                  <th className="pb-2">Klub</th>
                  <th className="pb-2">Distrikt</th>
                  <th className="pb-2 text-right">Medlemmer</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {klubKatalog.slice(0, 10).map((k) => (
                  <tr key={k.nr} className="border-t border-border/70">
                    <td className="py-2.5 font-mono">{k.nr}</td>
                    <td className="py-2.5 font-semibold">{k.navn}</td>
                    <td className="py-2.5 text-muted-foreground">{k.distrikt}</td>
                    <td className="py-2.5 text-right">{k.medlemmer}</td>
                    <td className="py-2.5 text-right">
                      {k.harSide && (
                        <Button asChild size="sm" variant="outline">
                          <Link to="/$klubId" params={{ klubId: k.nr }}>
                            Side
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <DevInfo
              titel="Klubber"
              felter={[
                { ui: "Klub", system: "BridgeOrg", tabel: "BRIDGEKLUBBER" },
                { ui: "Medlemskaber", system: "BridgeOrg", tabel: "MEDLEMSKABER" },
                { ui: "Bordafgift", system: "BridgeOrg", tabel: "BORDAFGIFTER" },
              ]}
            />
          </CardContent>
        </Card>
      )}

      {aktiv === "Distrikter" && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold">Distrikter</h2>
            <table className="mt-4 w-full text-sm">
              <thead className="text-left font-display text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2">Distrikt</th>
                  <th className="pb-2">Kreds</th>
                  <th className="pb-2 text-right">Klubber</th>
                  <th className="pb-2 text-right">Medlemmer</th>
                </tr>
              </thead>
              <tbody>
                {distrikter.map((d) => (
                  <tr key={d.id} className="border-t border-border/70">
                    <td className="py-2.5 font-semibold">{d.navn}</td>
                    <td className="py-2.5">{d.kreds}</td>
                    <td className="py-2.5 text-right">{d.klubber}</td>
                    <td className="py-2.5 text-right">{d.medlemmer.toLocaleString("da-DK")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {!["Klubber", "Distrikter"].includes(aktiv) && (
        <Card className="mt-6">
          <CardContent className="p-8">
            <h2 className="font-display text-xl font-bold">{aktiv}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Skærmen opbygges, når arbejdsgangene i sekretariatet er kortlagt. Data hentes fra
              BridgeOrg og klubbernes BC3-databaser.
            </p>
            <Badge variant="secondary" className="mt-4">
              Klar til opbygning
            </Badge>
            <DevInfo
              titel={aktiv}
              felter={[{ ui: aktiv, system: "BridgeOrg", tabel: "Ikke dokumenteret endnu" }]}
            />
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
