import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Wifi, WifiOff } from "lucide-react";
import { API_BASE_URL, Bc3ApiError, isDevelopment } from "@/api/firebirdApi";
import { useClub } from "@/hooks/useClub";
import { findKlub } from "@/lib/demo-data";
import { Bc3Breadcrumbs } from "./Bc3Breadcrumbs";

const faner = [
  { label: "Oversigt", til: "/bc3/online/$clubNumber", exact: true },
  { label: "Klubdashboard", til: "/bc3/online/$clubNumber/dashboard", exact: false },
  { label: "Stamoplysninger", til: "/bc3/online/$clubNumber/stamoplysninger", exact: false },
  { label: "Underklubber", til: "/bc3/online/$clubNumber/underklubber", exact: false },
  { label: "Medlemmer", til: "/bc3/online/$clubNumber/medlemmer", exact: false },
] as const;

/** Lille udviklingsstatus, så det er nemt at teste mod det lokale API. */
function ApiStatus({ fdbNo }: { fdbNo: string }) {
  const klub = useClub(fdbNo);
  const online = klub.isSuccess;
  const manglerKlub = klub.error instanceof Bc3ApiError && klub.error.status === 404;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Badge variant={online ? "default" : "secondary"} className="gap-1.5 font-mono">
        {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
        API: {klub.isPending ? "…" : online ? "Connected" : manglerKlub ? "Klub ikke fundet" : "Offline"}
      </Badge>
      <span className="font-mono">FDB: {fdbNo}</span>
    </div>
  );
}

export function Bc3Layout({
  fdbNo,
  titel,
  trin,
  children,
}: {
  fdbNo: string;
  /** Vises i sidehovedet — kommer fra Club-endpointet, når det er hentet. */
  titel?: string | undefined;
  trin?: ReactNode[] | undefined;
  children: ReactNode;
}) {
  const params = { clubNumber: fdbNo };
  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-8">
          <Bc3Breadcrumbs
            trin={
              trin ?? [
                <Link key="bc3" to="/bc3/online">
                  BC3 Online
                </Link>,
                titel ?? `Klub ${fdbNo}`,
              ]
            }
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="min-w-0">
              <div className="section-label mb-1">BC3 Online</div>
              <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">
                {titel ?? `Klub ${fdbNo}`}
              </h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ApiStatus fdbNo={fdbNo} />
              {findKlub(fdbNo) && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/$klubId" params={{ klubId: fdbNo }}>Klubhjemmeside</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link to="/bc3">BC3-information</Link>
              </Button>
            </div>
          </div>

          <nav className="mt-5 flex gap-1 overflow-x-auto">
            {faner.map((f) => (
              <Link
                key={f.label}
                to={f.til}
                params={params}
                activeOptions={{ exact: f.exact }}
                className="whitespace-nowrap rounded-t-lg border-b-2 border-transparent px-3.5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:border-primary data-[status=active]:text-primary"
              >
                {f.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</div>

      <div className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
        <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <Database className="size-3.5" /> BC3 API · FDB {fdbNo}
          {isDevelopment && <span>· {API_BASE_URL}</span>}
        </p>
      </div>
    </div>
  );
}
