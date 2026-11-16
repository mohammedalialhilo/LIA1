import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bc3ApiError,
  removeRegularPartner,
  setRegularPartner,
  setSubstituteStatus,
  type Member,
  type MemberClub,
} from "@/api/firebirdApi";
import { usePartnerCandidates, refreshPartnerQueries } from "@/hooks/usePartnerManagement";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  fdbNo: string;
  clubId: number;
  clubName: string;
  member: Member;
  link: MemberClub;
  allLinks: MemberClub[];
  members: Member[];
  compact?: boolean;
};

type Action = "set" | "remove" | "substitute";

function changeError(cause: unknown): string {
  if (cause instanceof Bc3ApiError) {
    if (cause.code === "concurrent_change")
      return "Oplysningerne blev ændret imens. Opdatér siden og prøv igen.";
    if (cause.code === "partner_busy")
      return "Den valgte makker har allerede en fast makker. Vælg en anden.";
    if (cause.code === "inconsistent_partnership")
      return "Makkerrelationen er ufuldstændig. Kontrollér den i BC3 først.";
    if (cause.code === "group_assigned") return "Fjern gruppetilknytningen i BC3 først.";
    if (cause.status === 404)
      return "Medlemmet eller underklubben blev ikke fundet. Opdatér siden.";
    if (cause.status === 400) return "Kontrollér valget og prøv igen.";
    if (cause.status === 500) return "Serveren kunne ikke gemme ændringen. Prøv igen senere.";
  }
  return cause instanceof Error ? cause.message : "Ændringen kunne ikke gemmes.";
}

export function PartnerActions({
  fdbNo,
  clubId,
  clubName,
  member,
  link,
  allLinks,
  members,
  compact = false,
}: Props) {
  const queryClient = useQueryClient();
  const [action, setAction] = useState<Action | null>(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expectedPartnerId, setExpectedPartnerId] = useState(0);
  const [expectedSubstitute, setExpectedSubstitute] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const candidates = usePartnerCandidates(fdbNo, clubId, member.memberID, search, action === "set");

  const partnerId = link.partnerID > 0 ? link.partnerID : 0;
  const partnerLink = allLinks.find((row) => row.clubID === clubId && row.memberID === partnerId);
  const partnerName =
    members.find((row) => row.memberID === partnerId)?.name ?? `Medlem ${partnerId}`;
  const reverse = allLinks.filter(
    (row) => row.clubID === clubId && row.partnerID === member.memberID,
  );
  const inconsistent =
    partnerId > 0
      ? !partnerLink ||
        partnerLink.partnerID !== member.memberID ||
        reverse.length !== 1 ||
        partnerLink.partnerFirst === link.partnerFirst
      : reverse.length > 0 || link.partnerFirst !== "F";
  const grouped = link.groupIndex !== 0 || (partnerLink?.groupIndex ?? 0) !== 0;
  const substituteKnown = link.isSubstitute === "T" || link.isSubstitute === "F";
  const substitute = link.isSubstitute === "T";
  const selected = candidates.data?.find((row) => row.memberId === selectedId);

  function open(next: Action) {
    setExpectedPartnerId(partnerId);
    setExpectedSubstitute(substitute);
    setSelectedId(null);
    setSearch("");
    setError("");
    setAction(next);
  }

  async function submit() {
    if (pending.current || inconsistent || (action !== "substitute" && grouped)) return;
    if (action === "set" && !selected) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      if (action === "set" && selected) {
        await setRegularPartner(
          fdbNo,
          clubId,
          member.memberID,
          selected.memberId,
          expectedPartnerId,
        );
      } else if (action === "remove") {
        await removeRegularPartner(fdbNo, clubId, member.memberID, expectedPartnerId);
      } else if (action === "substitute") {
        await setSubstituteStatus(
          fdbNo,
          clubId,
          member.memberID,
          !expectedSubstitute,
          expectedSubstitute,
        );
      } else return;
      await refreshPartnerQueries(queryClient, fdbNo, clubId);
      toast.success(
        action === "set"
          ? "Den faste makker er gemt."
          : action === "remove"
            ? "Den faste makkerrelation er fjernet."
            : expectedSubstitute
              ? "Substitutstatus er fjernet."
              : "Medlemmet er registreret som substitut.",
      );
      setAction(null);
    } catch (cause) {
      setError(changeError(cause));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <p className="text-sm">
        <span className="text-muted-foreground">Fast makker: </span>
        {partnerId > 0 ? partnerName : "Ingen"}
        <span className="ml-3 text-muted-foreground">Status: </span>
        {substituteKnown ? (substitute ? "Substitut" : "Fast spiller") : "Ukendt status"}
      </p>
      {inconsistent && (
        <p className="text-sm text-destructive" role="alert">
          Makkerrelationen er ufuldstændig. Kontrollér den i BC3 før ændring.
        </p>
      )}
      {grouped && (
        <p className="text-sm text-muted-foreground">
          Makkerændringer kræver, at gruppetilknytningen fjernes i BC3.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={inconsistent || grouped}
          onClick={() => open("set")}
        >
          {partnerId > 0 ? "Skift makker" : "Tildel makker"}
        </Button>
        {partnerId > 0 && (
          <Button
            size="sm"
            variant="outline"
            disabled={inconsistent || grouped}
            onClick={() => open("remove")}
          >
            Fjern makker
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          disabled={!substituteKnown || inconsistent}
          onClick={() => open("substitute")}
        >
          {substitute ? "Fjern substitutstatus" : "Registrer som substitut"}
        </Button>
      </div>
      <AlertDialog
        open={action !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen && !busy) setAction(null);
        }}
      >
        <AlertDialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "set"
                ? partnerId > 0
                  ? "Skift fast makker"
                  : "Tildel fast makker"
                : action === "remove"
                  ? "Fjern fast makker?"
                  : substitute
                    ? "Fjern substitutstatus?"
                    : "Registrer som substitut?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === "substitute"
                ? "Substitutstatus gælder kun dette medlemskab i underklubben. En fast makker ændres ikke."
                : "Ændringen gælder kun den faste makkerrelation i denne underklub. Historiske resultater bevares."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Medlem</dt>
            <dd className="font-semibold">
              {member.name} · {member.memberNo ?? "—"}
            </dd>
            <dt className="text-muted-foreground">Underklub</dt>
            <dd>{clubName}</dd>
            {partnerId > 0 && (
              <>
                <dt className="text-muted-foreground">Nuværende makker</dt>
                <dd>{partnerName}</dd>
              </>
            )}
          </dl>
          {action === "set" && (
            <div className="space-y-3 text-sm">
              <label htmlFor={`partner-search-${link.memberClubID}`} className="font-medium">
                Søg efter ledig makker
              </label>
              <input
                id={`partner-search-${link.memberClubID}`}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedId(null);
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Navn eller medlemsnummer"
                autoComplete="off"
                disabled={busy}
              />
              {candidates.isPending && <p>Søger efter makkere…</p>}
              {candidates.isError && (
                <p role="alert" className="text-destructive">
                  Kunne ikke hente ledige makkere.
                </p>
              )}
              {candidates.isSuccess && candidates.data.length === 0 && (
                <p>Ingen ledige makkere fundet.</p>
              )}
              {candidates.isSuccess && candidates.data.length > 0 && (
                <div
                  className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border p-2"
                  role="radiogroup"
                  aria-label="Ledige makkere"
                >
                  {candidates.data.map((candidate) => (
                    <label
                      key={candidate.memberId}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted"
                    >
                      <input
                        type="radio"
                        name={`partner-${link.memberClubID}`}
                        checked={selectedId === candidate.memberId}
                        onChange={() => setSelectedId(candidate.memberId)}
                        disabled={busy}
                      />
                      <span>
                        {candidate.name} · {candidate.memberNo ?? "—"}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {selected && (
                <p>
                  Ny makker: <strong>{selected.name}</strong>
                </p>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Annuller</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy || (action === "set" && !selected)}
              onClick={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              {busy
                ? "Gemmer…"
                : action === "set"
                  ? "Bekræft ændring"
                  : action === "remove"
                    ? "Fjern makker"
                    : substitute
                      ? "Fjern substitutstatus"
                      : "Registrer som substitut"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
