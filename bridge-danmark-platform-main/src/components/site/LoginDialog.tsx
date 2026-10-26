import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { autoriseredeKlubber, bestemKlub, findMedlem, useSession } from "@/lib/session";
import { findKlub } from "@/lib/demo-data";
import { Info } from "lucide-react";

export function LoginDialog() {
  const { loginDialogAaben, lukLogin, login, klubKontekst } = useSession();
  const [ident, setIdent] = useState("");
  const [kode, setKode] = useState("");
  const [valgtKlub, setValgtKlub] = useState<string>("");
  const [fejl, setFejl] = useState<string | null>(null);
  const navigate = useNavigate();

  const medlem = useMemo(() => (ident ? findMedlem(ident) : undefined), [ident]);
  const klubber = medlem ? autoriseredeKlubber(medlem) : [];
  const kontekstKlub = klubKontekst ? findKlub(klubKontekst) : undefined;

  useEffect(() => {
    if (medlem) setValgtKlub(bestemKlub(medlem, klubKontekst));
    else setValgtKlub("");
  }, [medlem, klubKontekst]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!medlem) {
      setFejl("Medlemsnummer eller e-mail findes ikke i demodata.");
      return;
    }
    if (!kode) {
      setFejl("Indtast en adgangskode (demo: alt accepteres).");
      return;
    }
    setFejl(null);
    const klub = valgtKlub || bestemKlub(medlem, klubKontekst);
    login(medlem, klub);
    setIdent("");
    setKode("");
    navigate({ to: klub === "5000" ? "/dbf" : "/medlem" });
  }

  return (
    <Dialog open={loginDialogAaben} onOpenChange={(o) => (!o ? lukLogin() : null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Log ind på bridge.dk</DialogTitle>
          <DialogDescription>
            {kontekstKlub
              ? `Du logger ind fra ${kontekstKlub.nr} – ${kontekstKlub.navn}.`
              : "Log ind med dit medlemsnummer eller din e-mail."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ident">Medlemsnummer / e-mail</Label>
            <Input
              id="ident"
              value={ident}
              onChange={(e) => setIdent(e.target.value)}
              placeholder="fx 301045"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kode">Adgangskode</Label>
            <Input
              id="kode"
              type="password"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Demo — indtast hvad som helst"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="klub">Vælg klub</Label>
            <Select value={valgtKlub} onValueChange={setValgtKlub} disabled={!medlem}>
              <SelectTrigger id="klub">
                <SelectValue placeholder={medlem ? "Vælg klub" : "Indtast medlemsnummer først"} />
              </SelectTrigger>
              <SelectContent>
                {klubber.map((k) => (
                  <SelectItem key={k.nr} value={k.nr}>
                    {k.nr} – {k.navn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {medlem && (
              <p className="text-xs text-muted-foreground">
                {klubber.length > 1
                  ? "Du har adgang til flere klubber. Vælg den klub du vil arbejde i."
                  : "Du logges ind i din primære klub."}
              </p>
            )}
          </div>

          {fejl && <p className="text-sm text-destructive">{fejl}</p>}

          <Button type="submit" variant="accent" size="lg" className="w-full">
            Log ind
          </Button>
        </form>

        <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
            <Info className="size-3.5" /> Demobrugere (ingen rigtig login)
          </p>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                className="font-mono text-foreground underline"
                onClick={() => setIdent("301045")}
              >
                301045
              </button>{" "}
              — medlem og klubadmin i 2275 Rødovre, udvikleradgang
            </li>
            <li>
              <button
                type="button"
                className="font-mono text-foreground underline"
                onClick={() => setIdent("447118")}
              >
                447118
              </button>{" "}
              — medlem i 4470 Kolding Bridge Center
            </li>
            <li>
              <button
                type="button"
                className="font-mono text-foreground underline"
                onClick={() => setIdent("500012")}
              >
                500012
              </button>{" "}
              — DBF-medarbejder, klub 5000
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
