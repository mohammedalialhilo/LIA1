import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  titel,
  vaerdi,
  note,
  ikon,
}: {
  titel: string;
  vaerdi: string | number;
  note?: string;
  ikon?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{titel}</p>
          <p className="mt-1 font-display text-3xl font-bold">{vaerdi}</p>
          {note && <p className="text-xs text-muted-foreground">{note}</p>}
        </div>
        {ikon && <span className="text-primary/70">{ikon}</span>}
      </CardContent>
    </Card>
  );
}

export function FeltRaekke({ label, vaerdi }: { label: string; vaerdi: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-3 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-56 shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold">{vaerdi}</dd>
    </div>
  );
}

export function Panel({
  titel,
  beskrivelse,
  handling,
  children,
}: {
  titel: string;
  beskrivelse?: string;
  handling?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">{titel}</h2>
            {beskrivelse && <p className="mt-1 text-sm text-muted-foreground">{beskrivelse}</p>}
          </div>
          {handling}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
