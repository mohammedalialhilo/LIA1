import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { Panel } from "@/components/bc3/Bc3Bits";
import { Bc3Empty, Bc3QueryState } from "@/components/bc3/ApiState";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useClub } from "@/hooks/useClub";
import { useMembers } from "@/hooks/useMembers";

export const Route = createFileRoute("/bc3/online/$clubNumber/medlemmer/")({
  head: () => ({
    meta: [
      { title: "Medlemmer – BC3 Online" },
      {
        name: "description",
        content: "Klubbens medlemmer fra BC3-databasen med søgning på navn og medlemsnummer.",
      },
      { property: "og:title", content: "Medlemmer – BC3 Online" },
      {
        property: "og:description",
        content: "Søg klubbens medlemmer og se mesterpoint fra BC3-databasen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Medlemmer,
});

function Medlemmer() {
  const { clubNumber: fdbNo } = Route.useParams();
  const klub = useClub(fdbNo);
  const medlemmer = useMembers(fdbNo);
  const [soeg, setSoeg] = useState("");
  const titel = klub.data ? `${klub.data.clubNo} – ${klub.data.name}` : undefined;

  const filtreret = useMemo(() => {
    const q = soeg.trim().toLowerCase();
    if (!q) return medlemmer.data ?? [];
    return (medlemmer.data ?? []).filter(
      (m) => m.name.toLowerCase().includes(q) || String(m.memberNo).includes(q),
    );
  }, [medlemmer.data, soeg]);

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
        "Medlemmer",
      ]}
    >
      <Panel
        titel="Medlemmer"
        beskrivelse="Medlemmerne hentes fra klubbens BC3-database via BC3 API'et."
        handling={
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={soeg}
              onChange={(e) => setSoeg(e.target.value)}
              placeholder="Søg navn eller medlemsnr."
              className="pl-9"
              aria-label="Søg medlemmer"
            />
          </div>
        }
      >
        <Bc3QueryState forespoergsel={medlemmer} tomTekst="API'et returnerede ingen medlemmer.">
          {() =>
            filtreret.length === 0 ? (
              <Bc3Empty tekst="Ingen medlemmer matcher søgningen." />
            ) : (
              <>
                <div className="grid gap-3 md:hidden">
                  {filtreret.map((m) => (
                    <Card key={m.memberID}>
                      <CardContent className="p-4">
                        <Link
                          to="/bc3/online/$clubNumber/members/$memberId"
                          params={{ clubNumber: fdbNo, memberId: String(m.memberID) }}
                          className="block"
                        >
                          <p className="font-display font-bold">{m.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">{m.memberNo}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{m.city}</p>
                          <p className="mt-1 text-sm">Mesterpoint {m.totalMaster}</p>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medlemsnr.</TableHead>
                        <TableHead>Navn</TableHead>
                        <TableHead>By</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Klubstart</TableHead>
                        <TableHead className="text-right">Bronze</TableHead>
                        <TableHead className="text-right">Sølv</TableHead>
                        <TableHead className="text-right">Guld</TableHead>
                        <TableHead className="text-right">Mesterpoint</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtreret.map((m) => (
                        <TableRow key={m.memberID}>
                          <TableCell className="font-mono">{m.memberNo}</TableCell>
                          <TableCell className="font-semibold">
                            <Link
                              to="/bc3/online/$clubNumber/members/$memberId"
                              params={{ clubNumber: fdbNo, memberId: String(m.memberID) }}
                              className="hover:text-primary hover:underline"
                            >
                              {m.name}
                            </Link>
                          </TableCell>
                          <TableCell>{m.city}</TableCell>
                          <TableCell>{m.phone1}</TableCell>
                          <TableCell className="max-w-56 truncate">{m.email}</TableCell>
                          <TableCell>{m.clubStart}</TableCell>
                          <TableCell className="text-right">{m.totalBronze}</TableCell>
                          <TableCell className="text-right">{m.totalSilver}</TableCell>
                          <TableCell className="text-right">{m.totalGold}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {m.totalMaster}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )
          }
        </Bc3QueryState>
      </Panel>
    </Bc3Layout>
  );
}
