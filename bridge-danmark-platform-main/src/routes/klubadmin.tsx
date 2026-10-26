import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminShell } from "@/components/site/AdminShell";
import { DevInfo, PageHero, PointBadge, Section } from "@/components/site/Bits";
import { begivenheder, findKlub, resultater, type Spilletid } from "@/lib/demo-data";
import { erKlubAdmin, useSession } from "@/lib/session";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/klubadmin")({
  head: () => {
    const t = "Klubadministration – redigér klubside, turneringer og resultater – bridge.dk";
    const d =
      "Klubadministratorer kan selv redigere klubbens side, spilletider, nyheder, turneringer og resultater uden hjælp fra en udvikler.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Klubadmin,
});

const MENU = [
  "Klubsiden",
  "Design og farver",
  "Spilletider",
  "Nyheder",
  "Turneringer",
  "Resultater",
  "Kontaktpersoner",
];

type NyhedRk = { dato: string; titel: string; tekst: string };
type KontaktRk = { rolle: string; navn: string; email: string; telefon: string };
type TurneringRk = {
  id: string;
  titel: string;
  dato: string;
  tid: string;
  sted: string;
  pris: string;
  point: "Guld" | "Sølv" | "Bronze" | "Åben" | "Ingen";
  pladser: number;
  tilmeldte: number;
  synlig: boolean;
};
type ResultatRk = {
  id: string;
  turnering: string;
  dato: string;
  vinder: string;
  score: string;
  deltagere: number;
  offentliggjort: boolean;
};

function Gemt({ vist }: { vist: boolean }) {
  if (!vist) return null;
  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
      <CheckCircle2 className="size-4" /> Gemt (demo — intet gemmes rigtigt)
    </span>
  );
}

function Klubadmin() {
  const { session, aabnLogin } = useSession();
  const [aktiv, setAktiv] = useState(MENU[0]!);

  const klub = findKlub(session?.aktivKlub ?? "");

  if (!session || !erKlubAdmin(session.medlem)) {
    return (
      <>
        <PageHero
          label="Klubadministration"
          titel="Log ind som klubadministrator"
          beskrivelse="Denne del af bridge.dk er for klubbernes bestyrelse og turneringsledere."
        />
        <Section titel="Adgang">
          <Card className="max-w-2xl">
            <CardContent className="space-y-4 p-6">
              <p className="text-muted-foreground">
                Her kan klubben selv redigere sin side, spilletider, nyheder, turneringer og resultater —
                uden kode og uden hjælp udefra. Brug demobrugeren <strong>301045</strong> (Rødovre
                Bridgeklub) for at se skærmene.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" onClick={() => aabnLogin()}>
                  Log ind
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/klubber">Se alle klubber</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Section>
      </>
    );
  }

  if (!klub) {
    return (
      <Section titel="Klubadministration">
        <p className="text-muted-foreground">
          Vælg en klub i menuen øverst for at redigere klubbens indhold.
        </p>
      </Section>
    );
  }

  return (
    <AdminShell
      system="Klubadministration"
      kontekst={`${klub.nr} – ${klub.navn}`}
      menu={MENU}
      aktiv={aktiv}
      onVaelg={setAktiv}
    >
      <Indhold aktiv={aktiv} klubNr={klub.nr} />
    </AdminShell>
  );
}

function Indhold({ aktiv, klubNr }: { aktiv: string; klubNr: string }) {
  const klub = findKlub(klubNr)!;

  /* Al redigering sker i hukommelsen — demo uden database. */
  const [stamdata, setStamdata] = useState({
    navn: klub.navn,
    kortNavn: klub.kortNavn,
    logoTekst: klub.logoTekst,
    adresse: klub.adresse,
    by: klub.by,
    beskrivelse: klub.beskrivelse,
  });
  const [tema, setTema] = useState(klub.tema);
  const [spilletider, setSpilletider] = useState<Spilletid[]>(klub.spilletider);
  const [nyheder, setNyheder] = useState<NyhedRk[]>(klub.nyheder);
  const [kontakter, setKontakter] = useState<KontaktRk[]>(klub.kontakt);
  const [turneringer, setTurneringer] = useState<TurneringRk[]>(() =>
    begivenheder
      .filter((b) => b.klubNr === klubNr)
      .map((b) => ({
        id: b.id,
        titel: b.titel,
        dato: b.dato,
        tid: b.tid,
        sted: b.sted,
        pris: b.pris,
        point: b.point,
        pladser: b.pladser,
        tilmeldte: b.tilmeldte,
        synlig: true,
      })),
  );
  const [resultatliste, setResultatliste] = useState<ResultatRk[]>(() =>
    resultater
      .filter((r) => r.klubNr === klubNr)
      .map((r) => ({
        id: r.id,
        turnering: r.turnering,
        dato: r.dato,
        vinder: r.vinder,
        score: r.score,
        deltagere: r.deltagere,
        offentliggjort: true,
      })),
  );
  const [gemt, setGemt] = useState<string | null>(null);

  const gem = (n: string) => {
    setGemt(n);
    window.setTimeout(() => setGemt((g) => (g === n ? null : g)), 2500);
  };

  const forhaandsvisning = useMemo(
    () =>
      ({
        "--klub-primary": tema.primary,
        "--klub-accent": tema.accent,
      }) as React.CSSProperties,
    [tema],
  );

  if (aktiv === "Klubsiden") {
    return (
      <Blok
        titel="Klubsiden"
        beskrivelse="Teksterne herunder vises øverst på klubbens offentlige side."
        klubNr={klubNr}
        gemt={gemt === "stamdata"}
        onGem={() => gem("stamdata")}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Felt label="Klubbens navn" vaerdi={stamdata.navn} onChange={(v) => setStamdata({ ...stamdata, navn: v })} />
          <Felt
            label="Kort navn"
            vaerdi={stamdata.kortNavn}
            onChange={(v) => setStamdata({ ...stamdata, kortNavn: v })}
          />
          <Felt
            label="Logotekst"
            vaerdi={stamdata.logoTekst}
            onChange={(v) => setStamdata({ ...stamdata, logoTekst: v })}
          />
          <Felt label="Adresse" vaerdi={stamdata.adresse} onChange={(v) => setStamdata({ ...stamdata, adresse: v })} />
          <Felt label="By" vaerdi={stamdata.by} onChange={(v) => setStamdata({ ...stamdata, by: v })} />
        </div>
        <div className="mt-5">
          <Label className="mb-2 block">Om klubben</Label>
          <Textarea
            rows={5}
            value={stamdata.beskrivelse}
            onChange={(e) => setStamdata({ ...stamdata, beskrivelse: e.target.value })}
          />
        </div>
        <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5">
          <p className="section-label mb-2">Forhåndsvisning</p>
          <p className="font-display text-2xl font-bold">{stamdata.navn}</p>
          <p className="text-sm text-muted-foreground">
            {stamdata.adresse}, {stamdata.by} · Klubnummer {klub.nr}
          </p>
          <p className="mt-3 max-w-2xl text-sm">{stamdata.beskrivelse}</p>
        </div>
        <DevInfo
          felter={[
            { ui: "Klubbens navn", system: "BridgeOrg", database: "BRIDGEKLUBBER", felt: "KLUBNAVN", status: "ANTAGET" },
            { ui: "Adresse / by", system: "bridge.dk", database: "klubside", felt: "adresse, by", status: "NY" },
            { ui: "Om klubben", system: "bridge.dk", database: "klubside", felt: "beskrivelse", status: "NY" },
          ]}
        />
      </Blok>
    );
  }

  if (aktiv === "Design og farver") {
    return (
      <Blok
        titel="Design og farver"
        beskrivelse="Klubben vælger selv farver, overskrift og udtryk inden for bridge.dk’s rammer."
        klubNr={klubNr}
        gemt={gemt === "tema"}
        onGem={() => gem("tema")}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label className="mb-2 block">Primær farve</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={tema.primary}
                onChange={(e) => setTema({ ...tema, primary: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded-lg border border-border bg-card"
                aria-label="Primær farve"
              />
              <Input value={tema.primary} onChange={(e) => setTema({ ...tema, primary: e.target.value })} />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Accentfarve</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={tema.accent}
                onChange={(e) => setTema({ ...tema, accent: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded-lg border border-border bg-card"
                aria-label="Accentfarve"
              />
              <Input value={tema.accent} onChange={(e) => setTema({ ...tema, accent: e.target.value })} />
            </div>
          </div>
          <Felt
            label="Overskrift på klubsiden"
            vaerdi={tema.overskrift}
            onChange={(v) => setTema({ ...tema, overskrift: v })}
          />
          <div>
            <Label className="mb-2 block">Udtryk</Label>
            <Select
              value={tema.stil}
              onValueChange={(v) => setTema({ ...tema, stil: v as typeof tema.stil })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (bridge.dk-udtryk)</SelectItem>
                <SelectItem value="individuel">Individuelt (klubbens egne farver)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border" style={forhaandsvisning}>
          <div
            className="p-6 text-white"
            style={{ background: `linear-gradient(120deg, ${tema.primary}, ${tema.accent})` }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-80">{stamdata.logoTekst}</p>
            <p className="font-display text-2xl font-bold">{tema.overskrift}</p>
          </div>
          <div className="flex flex-wrap gap-3 bg-card p-5">
            <span
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
              style={{ background: tema.primary }}
            >
              Tilmeld dig
            </span>
            <span
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-white"
              style={{ background: tema.accent }}
            >
              Se resultater
            </span>
          </div>
        </div>
        <DevInfo
          felter={[
            { ui: "Primær farve", system: "bridge.dk", database: "klubtema", felt: "primary", status: "NY" },
            { ui: "Accentfarve", system: "bridge.dk", database: "klubtema", felt: "accent", status: "NY" },
            { ui: "Udtryk", system: "bridge.dk", database: "klubtema", felt: "stil", status: "NY" },
          ]}
        />
      </Blok>
    );
  }

  if (aktiv === "Spilletider") {
    return (
      <Blok
        titel="Spilletider"
        beskrivelse="Rækkerne vises i skemaet på klubbens side."
        klubNr={klubNr}
        gemt={gemt === "spilletider"}
        onGem={() => gem("spilletider")}
      >
        <div className="space-y-4">
          {spilletider.map((s, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[1fr_1fr_2fr_auto]">
              <Felt
                label="Dag"
                vaerdi={s.dag}
                onChange={(v) => setSpilletider(spilletider.map((r, j) => (i === j ? { ...r, dag: v } : r)))}
              />
              <Felt
                label="Tid"
                vaerdi={s.tid}
                onChange={(v) => setSpilletider(spilletider.map((r, j) => (i === j ? { ...r, tid: v } : r)))}
              />
              <Felt
                label="Beskrivelse"
                vaerdi={s.beskrivelse}
                onChange={(v) =>
                  setSpilletider(spilletider.map((r, j) => (i === j ? { ...r, beskrivelse: v } : r)))
                }
              />
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Slet spilletid"
                  onClick={() => setSpilletider(spilletider.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="subtle"
          className="mt-4"
          onClick={() => setSpilletider([...spilletider, { dag: "Ny dag", tid: "19.00", beskrivelse: "Ny spilletid" }])}
        >
          <Plus className="size-4" /> Tilføj spilletid
        </Button>
      </Blok>
    );
  }

  if (aktiv === "Nyheder") {
    return (
      <Blok
        titel="Nyheder"
        beskrivelse="Nyheder vises på klubsiden med den nyeste først."
        klubNr={klubNr}
        gemt={gemt === "nyheder"}
        onGem={() => gem("nyheder")}
      >
        <div className="space-y-4">
          {nyheder.map((n, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                <Felt
                  label="Dato"
                  vaerdi={n.dato}
                  onChange={(v) => setNyheder(nyheder.map((r, j) => (i === j ? { ...r, dato: v } : r)))}
                />
                <Felt
                  label="Overskrift"
                  vaerdi={n.titel}
                  onChange={(v) => setNyheder(nyheder.map((r, j) => (i === j ? { ...r, titel: v } : r)))}
                />
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Slet nyhed"
                    onClick={() => setNyheder(nyheder.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <Label className="mb-2 block">Tekst</Label>
                <Textarea
                  rows={3}
                  value={n.tekst}
                  onChange={(e) => setNyheder(nyheder.map((r, j) => (i === j ? { ...r, tekst: e.target.value } : r)))}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="subtle"
          className="mt-4"
          onClick={() =>
            setNyheder([{ dato: "I dag", titel: "Ny nyhed", tekst: "Skriv nyheden her." }, ...nyheder])
          }
        >
          <Plus className="size-4" /> Ny nyhed
        </Button>
      </Blok>
    );
  }

  if (aktiv === "Turneringer") {
    return (
      <Blok
        titel="Turneringer"
        beskrivelse="Opret og redigér klubbens turneringer. Synlige turneringer kan medlemmerne tilmelde sig."
        klubNr={klubNr}
        gemt={gemt === "turneringer"}
        onGem={() => gem("turneringer")}
      >
        <div className="space-y-4">
          {turneringer.map((t, i) => {
            const opdater = (aendring: Partial<TurneringRk>) =>
              setTurneringer(turneringer.map((r, j) => (i === j ? { ...r, ...aendring } : r)));
            return (
              <div key={t.id} className="rounded-xl border border-border p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <PointBadge point={t.point} />
                    <Badge variant="secondary">
                      {t.tilmeldte}/{t.pladser} tilmeldte
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      Synlig
                      <Switch checked={t.synlig} onCheckedChange={(v) => opdater({ synlig: v })} />
                    </label>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Slet turnering"
                      onClick={() => setTurneringer(turneringer.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Felt label="Titel" vaerdi={t.titel} onChange={(v) => opdater({ titel: v })} />
                  <Felt label="Dato" vaerdi={t.dato} onChange={(v) => opdater({ dato: v })} />
                  <Felt label="Tid" vaerdi={t.tid} onChange={(v) => opdater({ tid: v })} />
                  <Felt label="Sted" vaerdi={t.sted} onChange={(v) => opdater({ sted: v })} />
                  <Felt label="Pris" vaerdi={t.pris} onChange={(v) => opdater({ pris: v })} />
                  <div>
                    <Label className="mb-2 block">Point</Label>
                    <Select value={t.point} onValueChange={(v) => opdater({ point: v as TurneringRk["point"] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Guld", "Sølv", "Bronze", "Åben", "Ingen"].map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Antal pladser</Label>
                    <Input
                      type="number"
                      value={t.pladser}
                      onChange={(e) => opdater({ pladser: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Button
          variant="subtle"
          className="mt-4"
          onClick={() =>
            setTurneringer([
              ...turneringer,
              {
                id: `ny-${turneringer.length + 1}`,
                titel: "Ny klubturnering",
                dato: "1. oktober 2026",
                tid: "19.00",
                sted: klub.adresse,
                pris: "50 kr.",
                point: "Bronze",
                pladser: 40,
                tilmeldte: 0,
                synlig: false,
              },
            ])
          }
        >
          <Plus className="size-4" /> Opret turnering
        </Button>
        <DevInfo
          felter={[
            { ui: "Titel", system: "BC3", database: "MAINTOURNAMENT", felt: "NAME", status: "ANTAGET" },
            { ui: "Dato", system: "BC3", database: "MAINTOURNAMENT", felt: "STARTDATE", status: "ANTAGET" },
            { ui: "Tilmeldte", system: "BC3", database: "SECTIONPLAYER", felt: "MEMBERNO", status: "ANTAGET" },
          ]}
        />
      </Blok>
    );
  }

  if (aktiv === "Resultater") {
    return (
      <Blok
        titel="Resultater"
        beskrivelse="Ret vinder, score og deltagerantal, og bestem om resultatet er offentligt."
        klubNr={klubNr}
        gemt={gemt === "resultater"}
        onGem={() => gem("resultater")}
      >
        <div className="space-y-4">
          {resultatliste.map((r, i) => {
            const opdater = (aendring: Partial<ResultatRk>) =>
              setResultatliste(resultatliste.map((x, j) => (i === j ? { ...x, ...aendring } : x)));
            return (
              <div key={r.id} className="rounded-xl border border-border p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <Badge variant={r.offentliggjort ? "default" : "secondary"}>
                    {r.offentliggjort ? "Offentliggjort" : "Kladde"}
                  </Badge>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      Vist offentligt
                      <Switch checked={r.offentliggjort} onCheckedChange={(v) => opdater({ offentliggjort: v })} />
                    </label>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Slet resultat"
                      onClick={() => setResultatliste(resultatliste.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Felt label="Turnering" vaerdi={r.turnering} onChange={(v) => opdater({ turnering: v })} />
                  <Felt label="Dato" vaerdi={r.dato} onChange={(v) => opdater({ dato: v })} />
                  <Felt label="Vinder" vaerdi={r.vinder} onChange={(v) => opdater({ vinder: v })} />
                  <Felt label="Score" vaerdi={r.score} onChange={(v) => opdater({ score: v })} />
                  <div>
                    <Label className="mb-2 block">Deltagere</Label>
                    <Input
                      type="number"
                      value={r.deltagere}
                      onChange={(e) => opdater({ deltagere: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Button
          variant="subtle"
          className="mt-4"
          onClick={() =>
            setResultatliste([
              {
                id: `nyt-${resultatliste.length + 1}`,
                turnering: "Ny turneringsaften",
                dato: "I dag",
                vinder: "Indtast vinder",
                score: "0 %",
                deltagere: 0,
                offentliggjort: false,
              },
              ...resultatliste,
            ])
          }
        >
          <Plus className="size-4" /> Indtast resultat
        </Button>
        <DevInfo
          felter={[
            { ui: "Vinder", system: "BC3", database: "SECTIONPLAYER", felt: "PLAYERNAME", status: "ANTAGET" },
            { ui: "Score", system: "BC3", database: "RESULT", felt: "MATCHPOINTS", status: "ANTAGET" },
            { ui: "Vist offentligt", system: "bridge.dk", database: "klubside", felt: "offentliggjort", status: "NY" },
          ]}
        />
      </Blok>
    );
  }

  return (
    <Blok
      titel="Kontaktpersoner"
      beskrivelse="Kontaktoplysninger vises nederst på klubbens side."
      klubNr={klubNr}
      gemt={gemt === "kontakt"}
      onGem={() => gem("kontakt")}
    >
      <div className="space-y-4">
        {kontakter.map((k, i) => {
          const opdater = (aendring: Partial<KontaktRk>) =>
            setKontakter(kontakter.map((x, j) => (i === j ? { ...x, ...aendring } : x)));
          return (
            <div key={i} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 lg:grid-cols-4">
              <Felt label="Rolle" vaerdi={k.rolle} onChange={(v) => opdater({ rolle: v })} />
              <Felt label="Navn" vaerdi={k.navn} onChange={(v) => opdater({ navn: v })} />
              <Felt label="E-mail" vaerdi={k.email} onChange={(v) => opdater({ email: v })} />
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Felt label="Telefon" vaerdi={k.telefon} onChange={(v) => opdater({ telefon: v })} />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Slet kontakt"
                  onClick={() => setKontakter(kontakter.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        variant="subtle"
        className="mt-4"
        onClick={() =>
          setKontakter([...kontakter, { rolle: "Ny rolle", navn: "Navn", email: "navn@klub.dk", telefon: "00 00 00 00" }])
        }
      >
        <Plus className="size-4" /> Tilføj kontakt
      </Button>
    </Blok>
  );
}

function Blok({
  titel,
  beskrivelse,
  klubNr,
  gemt,
  onGem,
  children,
}: {
  titel: string;
  beskrivelse: string;
  klubNr: string;
  gemt: boolean;
  onGem: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">{titel}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{beskrivelse}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Gemt vist={gemt} />
            <Button variant="outline" asChild>
              <Link to="/$klubId" params={{ klubId: klubNr }}>
                Se klubsiden
              </Link>
            </Button>
            <Button variant="hero" onClick={onGem}>
              Gem ændringer
            </Button>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function Felt({
  label,
  vaerdi,
  onChange,
}: {
  label: string;
  vaerdi: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <Input value={vaerdi} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
