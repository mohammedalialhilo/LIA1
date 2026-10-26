import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/session";
import { Database, TriangleAlert } from "lucide-react";

export function Section({
  label,
  titel,
  beskrivelse,
  handling,
  children,
  className,
}: {
  label?: string;
  titel: string;
  beskrivelse?: string;
  handling?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-14 lg:px-8", className)}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          {label && <p className="section-label mb-2">{label}</p>}
          <h2 className="text-3xl font-bold sm:text-4xl">{titel}</h2>
          {beskrivelse && <p className="mt-3 text-muted-foreground">{beskrivelse}</p>}
        </div>
        {handling}
      </div>
      {children}
    </section>
  );
}

export function PageHero({
  label,
  titel,
  beskrivelse,
  children,
}: {
  label?: string;
  titel: string;
  beskrivelse?: string | undefined;
  children?: ReactNode;
}) {
  return (
    <div className="hero-gradient text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {label && (
          <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-accent">
            {label}
          </p>
        )}
        <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">{titel}</h1>
        {beskrivelse && (
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">{beskrivelse}</p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </div>
  );
}

export function PointBadge({ point }: { point: string }) {
  const variant =
    point === "Guld"
      ? "bg-gold text-gold-foreground"
      : point === "Sølv"
        ? "bg-silver text-ink"
        : point === "Bronze"
          ? "bg-accent/15 text-accent"
          : "bg-muted text-muted-foreground";
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", variant)}>
      {point === "Ingen" ? "Uden point" : `${point}point`}
    </span>
  );
}

export function Preliminary({ tekst }: { tekst: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gold/50 bg-gold/10 p-4 text-sm">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-gold-foreground" />
      <p className="font-semibold text-gold-foreground">{tekst}</p>
    </div>
  );
}

export type DevFelt = {
  ui: string;
  system?: string;
  database?: string;
  tabel?: string;
  felt?: string;
  status?: string;
};

/** Vises kun for teknisk autoriserede brugere med udviklertilstand slået til. */
export function DevInfo({ felter, titel = "Teknisk mapping" }: { felter: DevFelt[]; titel?: string }) {
  const { devMode } = useSession();
  if (!devMode) return null;
  return (
    <div className="my-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
      <p className="mb-3 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-primary">
        <Database className="size-3.5" /> Udviklertilstand · {titel}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {felter.map((f) => (
          <dl key={f.ui} className="rounded-lg bg-card p-3 text-xs card-shadow">
            <dt className="text-muted-foreground">UI</dt>
            <dd className="mb-1.5 font-semibold">{f.ui}</dd>
            {f.system && (
              <>
                <dt className="text-muted-foreground">System</dt>
                <dd className="mb-1.5 font-mono">{f.system}</dd>
              </>
            )}
            {f.database && (
              <>
                <dt className="text-muted-foreground">Database</dt>
                <dd className="mb-1.5 font-mono">{f.database}</dd>
              </>
            )}
            {f.tabel && (
              <>
                <dt className="text-muted-foreground">Tabel</dt>
                <dd className="mb-1.5 font-mono">{f.tabel}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Felt</dt>
            <dd className="mb-1.5 font-mono">{f.felt ?? "Ikke dokumenteret endnu"}</dd>
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <Badge variant="outline" className="border-gold text-gold-foreground">
                {f.status ?? "SKAL VERIFICERES"}
              </Badge>
            </dd>
          </dl>
        ))}
      </div>
    </div>
  );
}
