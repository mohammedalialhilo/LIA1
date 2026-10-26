import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Layers, Users } from "lucide-react";
import { Bc3Layout } from "@/components/bc3/Bc3Layout";
import { Panel, StatCard } from "@/components/bc3/Bc3Bits";
import { Bc3Error, Bc3Loading } from "@/components/bc3/ApiState";
import { useClub } from "@/hooks/useClub";
import { useMembers } from "@/hooks/useMembers";
import { useSubClubs } from "@/hooks/useSubClubs";

export const Route = createFileRoute("/bc3/online/$clubNumber/")({
  head: () => ({
    meta: [
      { title: "Kluboversigt – BC3 Online" },
      {
        name: "description",
        content: "Oversigt over klubbens medlemmer og underklubber fra BC3-databasen.",
      },
      { property: "og:title", content: "Kluboversigt – BC3 Online" },
      {
        property: "og:description",
        content: "Medlemmer og underklubber hentet fra klubbens BC3-database.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KlubOversigt,
});

function KlubOversigt() {
  const { clubNumber: fdbNo } = Route.useParams();
  const klub = useClub(fdbNo);
  const medlemmer = useMembers(fdbNo);
  const underklubber = useSubClubs(fdbNo);

  const titel = klub.data ? `${klub.data.clubNo} – ${klub.data.name}` : undefined;

  return (
    <Bc3Layout fdbNo={fdbNo} titel={titel}>
      <div className="grid gap-5 sm:grid-cols-2">
        <StatCard
          titel="Medlemmer"
          vaerdi={medlemmer.isSuccess ? medlemmer.data.length : "—"}
          note={medlemmer.isPending ? "henter …" : "fra BC3 API"}
          ikon={<Users />}
        />
        <StatCard
          titel="Underklubber"
          vaerdi={underklubber.isSuccess ? underklubber.data.length : "—"}
          note={underklubber.isPending ? "henter …" : "fra BC3 API"}
          ikon={<Layers />}
        />
      </div>

      {(klub.isError || medlemmer.isError || underklubber.isError) && (
        <div className="mt-6">
          <Bc3Error fejl={klub.error ?? medlemmer.error ?? underklubber.error} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          titel="Underklubber"
          beskrivelse="Klik videre for at se spilledag, spilletid og medlemmer."
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/bc3/online/$clubNumber/underklubber" params={{ clubNumber: fdbNo }}>
                Se alle
              </Link>
            </Button>
          }
        >
          {underklubber.isPending ? (
            <Bc3Loading />
          ) : (
            <ul className="space-y-2 text-sm">
              {(underklubber.data ?? []).slice(0, 8).map((u) => (
                <li key={u.clubID} className="flex items-center justify-between gap-3">
                  <Link
                    to="/bc3/online/$clubNumber/subclubs/$clubId"
                    params={{ clubNumber: fdbNo, clubId: String(u.clubID) }}
                    className="font-semibold hover:text-primary hover:underline"
                  >
                    {u.clubName}
                  </Link>
                  <span className="font-mono text-xs text-muted-foreground">{u.gameTime}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          titel="Medlemmer"
          beskrivelse="Medlemmer hentes direkte fra klubbens BC3-database."
          handling={
            <Button asChild variant="outline" size="sm">
              <Link to="/bc3/online/$clubNumber/medlemmer" params={{ clubNumber: fdbNo }}>
                Medlemmer
              </Link>
            </Button>
          }
        >
          {medlemmer.isPending ? (
            <Bc3Loading />
          ) : (
            <ul className="space-y-2 text-sm">
              {(medlemmer.data ?? []).slice(0, 8).map((m) => (
                <li key={m.memberID} className="flex items-center justify-between gap-3">
                  <Link
                    to="/bc3/online/$clubNumber/members/$memberId"
                    params={{ clubNumber: fdbNo, memberId: String(m.memberID) }}
                    className="font-semibold hover:text-primary hover:underline"
                  >
                    {m.name}
                  </Link>
                  <span className="font-mono text-xs text-muted-foreground">{m.memberNo}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </Bc3Layout>
  );
}
