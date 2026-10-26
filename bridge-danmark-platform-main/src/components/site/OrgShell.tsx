import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/site/Bits";
import type {
  OrgBoardMember,
  OrgContact,
  OrgDocument,
  OrgLink,
  OrgNewsItem,
  OrgTournamentItem,
} from "@/lib/organization-content";

export type Brødkrumme = {
  label: string;
  /** Udfyldes ikke for det aktive niveau. */
  href?: ReactNode;
};

/** Brødkrummesti som viser DBF → Kreds → Distrikt → Klub. */
export function OrgBreadcrumbs({ trin }: { trin: ReactNode[] }) {
  return (
    <nav aria-label="Brødkrumme" className="border-b border-border bg-secondary/40">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-sm lg:px-8">
        {trin.map((trinnet, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground" />}
            <span className={i === trin.length - 1 ? "font-semibold" : "text-muted-foreground"}>
              {trinnet}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Lokal navigation inde i et distrikts- eller kredssite. */
export function OrgLocalNav({ punkter }: { punkter: ReactNode[] }) {
  return (
    <div className="border-b border-border bg-card">
      <nav className="mx-auto flex max-w-7xl flex-wrap gap-1 px-4 lg:px-8">
        {punkter.map((punkt, i) => (
          <span key={i} className="py-2">
            {punkt}
          </span>
        ))}
      </nav>
    </div>
  );
}

/** Fælles hero til distrikts- og kredssites. */
export function OrgHero({
  titel,
  beskrivelse,
  handling,
}: {
  titel: string;
  beskrivelse?: string | undefined;
  handling?: ReactNode;
}) {
  return (
    <PageHero label="Danmarks Bridgeforbund" titel={titel} beskrivelse={beskrivelse}>
      {handling}
    </PageHero>
  );
}

export function TomtFelt({ tekst }: { tekst: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
      {tekst}
    </p>
  );
}

export function InfoKort({
  ikon,
  titel,
  children,
  handling,
}: {
  ikon?: ReactNode;
  titel: string;
  children: ReactNode;
  handling?: ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-6">
        {ikon && (
          <span className="mb-4 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
            {ikon}
          </span>
        )}
        <h3 className="font-display text-xl font-bold">{titel}</h3>
        <div className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
        {handling && <div className="mt-5">{handling}</div>}
      </CardContent>
    </Card>
  );
}

export function NyhedsListe({ nyheder }: { nyheder: OrgNewsItem[] }) {
  if (!nyheder.length) return <TomtFelt tekst="Der er endnu ikke lagt nyheder ind." />;
  return (
    <ul className="space-y-3">
      {nyheder.map((n) => (
        <li key={n.id} className="rounded-lg border border-border p-4 text-sm">
          <p className="font-semibold text-foreground">{n.title}</p>
          <p className="text-muted-foreground">{n.date}</p>
          <p className="mt-1 text-muted-foreground">{n.summary}</p>
          {n.url && (
            <Button asChild variant="link" className="mt-1 px-0">
              <a href={n.url} target="_blank" rel="noreferrer">
                Læs mere <ExternalLink />
              </a>
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}

export function TurneringsListe({ turneringer }: { turneringer: OrgTournamentItem[] }) {
  if (!turneringer.length) return <TomtFelt tekst="Turneringer bliver tilføjet senere." />;
  return (
    <ul className="space-y-3">
      {turneringer.map((t) => (
        <li key={t.id} className="rounded-lg border border-border p-4 text-sm">
          <p className="font-semibold text-foreground">{t.title}</p>
          <p className="text-muted-foreground">
            {t.date}
            {t.place ? ` · ${t.place}` : ""}
          </p>
          {t.url && (
            <Button asChild variant="link" className="mt-1 px-0">
              <a href={t.url} target="_blank" rel="noreferrer">
                Se turneringen <ExternalLink />
              </a>
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}

export function DokumentListe({ dokumenter }: { dokumenter: OrgDocument[] }) {
  if (!dokumenter.length) return <TomtFelt tekst="Der er endnu ikke lagt dokumenter ind." />;
  return (
    <ul className="space-y-3">
      {dokumenter.map((d) => (
        <li key={d.id} className="rounded-lg border border-border p-4 text-sm">
          <p className="font-semibold text-foreground">{d.title}</p>
          {d.note && <p className="text-muted-foreground">{d.note}</p>}
          {d.url && (
            <Button asChild variant="link" className="mt-1 px-0">
              <a href={d.url} target="_blank" rel="noreferrer">
                Åbn dokument <ExternalLink />
              </a>
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}

export function LinkListe({ links }: { links: OrgLink[] }) {
  if (!links.length) return <TomtFelt tekst="Der er endnu ikke lagt links ind." />;
  return (
    <ul className="space-y-3">
      {links.map((l) => (
        <li key={l.id} className="rounded-lg border border-border p-4 text-sm">
          <p className="font-semibold text-foreground">{l.title}</p>
          {l.note && <p className="text-muted-foreground">{l.note}</p>}
          <Button asChild variant="link" className="mt-1 px-0">
            <a href={l.url} target="_blank" rel="noreferrer">
              Åbn link <ExternalLink />
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function BestyrelseOgKontakt({
  bestyrelse,
  kontakt,
}: {
  bestyrelse: OrgBoardMember[];
  kontakt?: OrgContact | undefined;
}) {
  const harKontakt = Boolean(kontakt?.email || kontakt?.phone || kontakt?.address || kontakt?.note);
  return (
    <div className="space-y-4">
      {bestyrelse.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {bestyrelse.map((m) => (
            <li key={m.id} className="rounded-lg border border-border p-4 text-sm">
              <p className="font-semibold text-foreground">{m.role}</p>
              <p className="text-muted-foreground">{m.name ?? "Navn tilføjes senere."}</p>
              {m.email && <p className="text-muted-foreground">{m.email}</p>}
              {m.phone && <p className="text-muted-foreground">{m.phone}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <TomtFelt tekst="Bestyrelsens oplysninger bliver tilføjet senere." />
      )}
      {harKontakt ? (
        <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          {kontakt?.email && <p>E-mail: {kontakt.email}</p>}
          {kontakt?.phone && <p>Telefon: {kontakt.phone}</p>}
          {kontakt?.address && <p>{kontakt.address}</p>}
          {kontakt?.note && <p>{kontakt.note}</p>}
        </div>
      ) : (
        <TomtFelt tekst="Kontaktoplysninger bliver tilføjet senere." />
      )}
    </div>
  );
}

/** Klubtabel der genbruger det fælles klubkatalog — ingen dublering af klubdata. */
export function KlubTabel({
  klubber,
}: {
  klubber: {
    clubNo: number;
    name: string;
    city: string;
    internalPath?: string | undefined;
    websiteUrl?: string | undefined;
  }[];
}) {
  if (!klubber.length) return <TomtFelt tekst="Der er endnu ingen klubber i kataloget for dette område." />;
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card card-shadow">
      <table className="w-full text-sm">
        <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3">Klubnr.</th>
            <th className="px-4 py-3">Klub</th>
            <th className="px-4 py-3">By</th>
            <th className="px-4 py-3 text-right">Hjemmeside</th>
          </tr>
        </thead>
        <tbody>
          {klubber.map((k) => (
            <tr key={k.clubNo} className="border-t border-border/70">
              <td className="px-4 py-3 font-mono">{k.clubNo}</td>
              <td className="px-4 py-3 font-semibold">{k.name}</td>
              <td className="px-4 py-3">{k.city}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  {k.internalPath && (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/$klubId" params={{ klubId: String(k.clubNo) }}>
                        Klubside
                      </Link>
                    </Button>
                  )}
                  {k.websiteUrl && (
                    <Button asChild size="sm" variant="ghost">
                      <a href={k.websiteUrl} target="_blank" rel="noreferrer">
                        Ekstern <ExternalLink />
                      </a>
                    </Button>
                  )}
                  {!k.internalPath && !k.websiteUrl && (
                    <span className="text-muted-foreground">Ikke registreret</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Klubber nævnt på distriktets nuværende hjemmeside, men endnu ikke i klubkataloget. */
export function KlubReferencer({
  klubber,
  kildeUrl,
}: {
  klubber: { clubNo: number; name: string; note?: string | undefined }[];
  kildeUrl?: string | undefined;
}) {
  if (!klubber.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-5 card-shadow">
      <p className="text-sm text-muted-foreground">
        Disse klubber er nævnt på distriktets nuværende hjemmeside og mangler endnu i platformens klubkatalog.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {klubber.map((k) => (
          <li key={k.clubNo} className="rounded-lg border border-border/70 px-3 py-2 text-sm">
            <span className="font-mono">{k.clubNo}</span> · <span className="font-semibold">{k.name}</span>
            {k.note && <p className="text-xs text-muted-foreground">{k.note}</p>}
          </li>
        ))}
      </ul>
      {kildeUrl && (
        <Button asChild variant="link" className="mt-2 px-0">
          <a href={kildeUrl} target="_blank" rel="noreferrer">
            Kilde: nuværende hjemmeside <ExternalLink />
          </a>
        </Button>
      )}
    </div>
  );
}
