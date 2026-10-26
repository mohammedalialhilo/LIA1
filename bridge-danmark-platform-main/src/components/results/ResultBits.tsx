import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { findHold, fmtVp, type Match } from "@/lib/results-data";

export const scrollTabsList =
  "flex h-auto w-full justify-start overflow-x-auto whitespace-nowrap rounded-lg [scrollbar-width:none]";

export function Crumbs({ items }: { items: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <nav aria-label="Brødkrumme" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-primary-foreground/75">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3.5" />}
          {it.to ? (
            <Link to={it.to as never} params={it.params as never} className="hover:text-accent">
              {it.label}
            </Link>
          ) : (
            <span className="font-semibold text-primary-foreground">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PlaceholderMark({ className }: { className?: string }) {
  return (
    <span className={cn("rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-gold-foreground", className)}>
      Placeholder
    </span>
  );
}

export function TeamLink({ id, division, vinder }: { id: string; division: string; vinder?: boolean }) {
  return (
    <Link
      to="/resultater/divisionsturneringen/$division/hold/$holdId"
      params={{ division, holdId: id }}
      className={cn("break-words hover:text-accent", vinder && "font-bold text-primary")}
    >
      {findHold(id)?.navn ?? id}
    </Link>
  );
}

export function MatchCard({ kamp, division }: { kamp: Match; division: string }) {
  const hv = kamp.vp[0] > kamp.vp[1];
  const uv = kamp.vp[1] > kamp.vp[0];
  return (
    <div className={cn("rounded-xl border bg-card p-4 card-shadow", kamp.placeholder ? "border-dashed border-border opacity-70" : "border-border")}>
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2">
        <TeamLink id={kamp.hjemmeId} division={division} vinder={hv} />
        <div className="text-right font-mono text-sm">
          <span className={cn(hv && "font-bold")}>{kamp.imp[0]}</span> IMP ·{" "}
          <span className={cn("text-base", hv && "font-bold text-primary")}>{fmtVp(kamp.vp[0])}</span> VP
        </div>
        <TeamLink id={kamp.udeId} division={division} vinder={uv} />
        <div className="text-right font-mono text-sm">
          <span className={cn(uv && "font-bold")}>{kamp.imp[1]}</span> IMP ·{" "}
          <span className={cn("text-base", uv && "font-bold text-primary")}>{fmtVp(kamp.vp[1])}</span> VP
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3 text-sm">
        {kamp.placeholder ? <span className="flex items-center gap-2 text-muted-foreground"><PlaceholderMark /> Opdigtede tal – data kommer senere</span> : <span className="text-muted-foreground">Kamp {kamp.round}</span>}
        <Link
          to="/resultater/divisionsturneringen/$division/kamp/$kampId"
          params={{ division, kampId: kamp.matchId }}
          className="font-semibold text-primary hover:text-accent"
        >
          Se kampen →
        </Link>
      </div>
    </div>
  );
}
