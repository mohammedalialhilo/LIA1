import { BookOpen, ExternalLink, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  kilder,
  regler,
  reglerForEmne,
  reglerGyldighed,
  reglerIndgang,
  type Regel,
} from "@/lib/regler";

function RegelKort({ regel }: { regel: Regel }) {
  const kilde = kilder[regel.kilde];
  return (
    <article className="rounded-xl border border-border bg-card p-5 card-shadow">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="font-mono">
          {regel.paragraf}
        </Badge>
        <h3 className="font-display text-base font-bold">{regel.titel}</h3>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {regel.punkter.map((p, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <a
        href={kilde.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent"
      >
        <BookOpen className="size-3.5" /> {kilde.titel} <ExternalLink className="size-3" />
      </a>
    </article>
  );
}

/** Fuld regelsamling — bruges på turneringsoversigten. */
export function RegelSamling() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gold/50 bg-gold/10 p-5 text-sm">
        <p className="flex items-center gap-2 font-display font-bold text-gold-foreground">
          <Scale className="size-4" /> Uddrag af DBf's bestemmelser · {reglerGyldighed}
        </p>
        <p className="mt-2 text-muted-foreground">
          Teksten nedenfor er citeret fra Danmarks Bridgeforbunds officielle håndbøger. Ved tvivl
          gælder altid den fulde tekst på bridge.dk.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
          {Object.values(kilder).map((k) => (
            <a
              key={k.url}
              href={k.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:text-accent"
            >
              {k.titel} <ExternalLink className="size-3" />
            </a>
          ))}
          <a
            href={reglerIndgang}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-primary hover:text-accent"
          >
            Alle regler og bestemmelser <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {regler.map((r) => (
          <RegelKort key={r.id} regel={r} />
        ))}
      </div>
    </div>
  );
}

/** De regler, der er relevante for ét trin i tilmeldingen. */
export function RegelBoks({ emne, titel }: { emne: string; titel?: string }) {
  const liste = reglerForEmne(emne);
  if (liste.length === 0) return null;
  return (
    <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
      <p className="flex items-center gap-2 font-display text-sm font-bold">
        <Scale className="size-4 text-primary" /> {titel ?? "Det siger DBf's bestemmelser"}
      </p>
      <div className="mt-4 space-y-4">
        {liste.map((r) => (
          <div key={r.id} className="text-sm">
            <p className="font-semibold">
              <span className="font-mono text-xs text-muted-foreground">{r.paragraf}</span>{" "}
              {r.titel}
            </p>
            <ul className="mt-1.5 space-y-1.5 text-muted-foreground">
              {r.punkter.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <a
              href={kilder[r.kilde].url}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent"
            >
              {kilder[r.kilde].titel} <ExternalLink className="size-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
