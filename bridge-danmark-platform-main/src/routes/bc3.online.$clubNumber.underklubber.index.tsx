import { createFileRoute, Link } from "@tanstack/react-router";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { Panel } from "@/components/bc3/Bc3Bits";
import { Bc3QueryState } from "@/components/bc3/ApiState";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { flagErJa, type SubClub } from "@/api/firebirdApi";
import { useClub } from "@/hooks/useClub";
import { useSubClubs } from "@/hooks/useSubClubs";
import { useMemberClubs } from "@/hooks/useMemberClubs";

export const Route = createFileRoute("/bc3/online/$clubNumber/underklubber/")({
  head: () => ({
    meta: [
      { title: "Underklubber – BC3 Online" },
      {
        name: "description",
        content: "Klubbens underklubber med spilledag, spilletid og antal medlemmer.",
      },
      { property: "og:title", content: "Underklubber – BC3 Online" },
      {
        property: "og:description",
        content: "Spilledag, spilletid og medlemsantal pr. underklub fra BC3-databasen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Underklubber,
});

function Underklubber() {
  const { clubNumber: fdbNo } = Route.useParams();
  const klub = useClub(fdbNo);
  const underklubber = useSubClubs(fdbNo);
  const medlemsklubber = useMemberClubs(fdbNo);
  const titel = klub.data ? `${klub.data.clubNo} – ${klub.data.name}` : undefined;

  /** Antal medlemmer pr. underklub — kobles KUN på clubID/memberID, aldrig navne. */
  function antalMedlemmer(clubID: number) {
    if (!medlemsklubber.data) return "—";
    const ids = new Set(
      medlemsklubber.data.filter((r) => r.clubID === clubID).map((r) => r.memberID),
    );
    return ids.size;
  }

  return (
    <Bc3Layout
      fdbNo={fdbNo}
      titel={titel}
      trin={[
        <Link key="bc3" to="/bc3/online">
          BC3 Online
        </Link>,
        <Link key="klub" to="/bc3/online/$clubNumber" params={{ clubNumber: fdbNo }}>
          {titel ?? `Klub ${fdbNo}`}
        </Link>,
        "Underklubber",
      ]}
    >
      <Panel
        titel="Underklubber"
        beskrivelse="Underklub-id'er er lokale i klubbens egen BC3-database."
      >
        <Bc3QueryState
          forespoergsel={underklubber}
          tomTekst="API'et returnerede ingen underklubber."
        >
          {(liste) => (
            <>
              <div className="grid gap-3 md:hidden">
                {liste.map((u) => (
                  <Card key={u.clubID}>
                    <CardContent className="p-4">
                      <Link
                        to="/bc3/online/$clubNumber/subclubs/$clubId"
                        params={{ clubNumber: fdbNo, clubId: String(u.clubID) }}
                        className="block"
                      >
                        <p className="font-display font-bold">{u.clubName}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Spilledag {u.gameDay} · {u.gameTime}
                        </p>
                        <p className="mt-1 text-sm">{antalMedlemmer(u.clubID)} medlemmer</p>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Klubnavn</TableHead>
                      <TableHead>Spilledag</TableHead>
                      <TableHead>Spilletid</TableHead>
                      <TableHead className="text-right">Antal medlemmer</TableHead>
                      <TableHead>Synlig</TableHead>
                      <TableHead>Rygfri</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liste.map((u: SubClub) => (
                      <TableRow key={u.clubID}>
                        <TableCell className="font-semibold">
                          <Link
                            to="/bc3/online/$clubNumber/subclubs/$clubId"
                            params={{ clubNumber: fdbNo, clubId: String(u.clubID) }}
                            className="hover:text-primary hover:underline"
                          >
                            {u.clubName}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono">{u.gameDay}</TableCell>
                        <TableCell>{u.gameTime}</TableCell>
                        <TableCell className="text-right">{antalMedlemmer(u.clubID)}</TableCell>
                        <TableCell>
                          <Badge variant={flagErJa(u.isVisible) ? "default" : "secondary"}>
                            {flagErJa(u.isVisible) ? "Ja" : "Nej"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={flagErJa(u.noSmoking) ? "default" : "secondary"}>
                            {flagErJa(u.noSmoking) ? "Ja" : "Nej"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <ChevronRight className="ml-auto size-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </Bc3QueryState>
      </Panel>
    </Bc3Layout>
  );
}
