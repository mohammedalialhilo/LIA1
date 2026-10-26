import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

/** Fælles, letklikbart kort til klub- og spilleholdsfunktioner. */
export function ClubFeatureCard({
  ikon,
  titel,
  tekst,
  handling,
}: {
  ikon: ReactNode;
  titel: string;
  tekst: string;
  handling: ReactNode;
}) {
  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardContent className="flex h-full flex-col p-6">
        <span className="mb-4 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
          {ikon}
        </span>
        <h3 className="font-display text-xl font-bold">{titel}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tekst}</p>
        <div className="mt-5">{handling}</div>
      </CardContent>
    </Card>
  );
}