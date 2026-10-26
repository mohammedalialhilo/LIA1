import type { ReactNode } from "react";
import { AlertTriangle, Loader2, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE_URL, Bc3ApiError, isDevelopment } from "@/api/firebirdApi";

export function Bc3Loading({ tekst = "Henter data fra BC3 API …" }: { tekst?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> {tekst}
    </div>
  );
}

export function Bc3Empty({ tekst }: { tekst: string }) {
  return (
    <p className="flex items-center gap-2 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      <Inbox className="size-4" /> {tekst}
    </p>
  );
}

export function Bc3Error({ fejl }: { fejl: unknown }) {
  const besked = fejl instanceof Error ? fejl.message : "Ukendt fejl fra BC3 API.";
  const erIkkeFundet = fejl instanceof Bc3ApiError && fejl.status === 404;
  const erForbindelsesfejl = fejl instanceof Bc3ApiError && fejl.status === undefined;
  return (
    <Card className="border-destructive/40">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 text-destructive" />
          <div className="space-y-1.5 text-sm">
            <p className="font-display text-base font-bold">
              {erIkkeFundet
                ? "Klubdata findes ikke i BC3 API."
                : erForbindelsesfejl
                  ? "Kan ikke oprette forbindelse til BC3 API."
                  : "BC3 API returnerede en fejl."}
            </p>
            <p className="text-muted-foreground">
              {erIkkeFundet
                ? "Kontroller at klubnummeret findes i den tilsluttede database."
                : erForbindelsesfejl
                  ? "Kontroller at det lokale API kører."
                  : "Kontroller API-loggen for flere oplysninger."}
            </p>
            <p className="text-muted-foreground">{besked}</p>
            {isDevelopment && (
              <p className="font-mono text-xs text-muted-foreground">API-URL: {API_BASE_URL}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Ensartet håndtering af loading / error / empty / success. */
export function Bc3QueryState<T>({
  forespoergsel,
  tomTekst,
  children,
}: {
  forespoergsel: { isPending: boolean; isError: boolean; error: unknown; data: T | undefined };
  tomTekst?: string;
  children: (data: T) => ReactNode;
}) {
  if (forespoergsel.isPending) return <Bc3Loading />;
  if (forespoergsel.isError) return <Bc3Error fejl={forespoergsel.error} />;
  const data = forespoergsel.data;
  if (data === undefined) return <Bc3Empty tekst={tomTekst ?? "Ingen data."} />;
  if (Array.isArray(data) && data.length === 0)
    return <Bc3Empty tekst={tomTekst ?? "API'et returnerede ingen rækker."} />;
  return <>{children(data)}</>;
}
