import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  removeMemberFromSubclub,
  transferMemberToSubclub,
  type MemberClub,
  type SubClub,
} from "@/api/firebirdApi";
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
import { membershipChangeError, refreshMembershipQueries } from "./membershipActionsModel";

type Props = {
  fdbNo: string;
  memberId: number;
  memberName: string;
  memberNo: number | null;
  sourceClubId: number;
  sourceClubName: string;
  partnerName?: string | undefined;
  memberClubs: MemberClub[];
  subClubs: SubClub[];
};

export function MembershipActions(props: Props) {
  const {
    fdbNo,
    memberId,
    memberName,
    memberNo,
    sourceClubId,
    sourceClubName,
    partnerName,
    memberClubs,
    subClubs,
  } = props;
  const queryClient = useQueryClient();
  const [action, setAction] = useState<"remove" | "transfer" | null>(null);
  const [destinationId, setDestinationId] = useState<number | "">("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const source = memberClubs.find(
    (link) => link.memberID === memberId && link.clubID === sourceClubId,
  );
  if (!source) return null;

  const destinations = subClubs.filter((club) => club.clubID !== sourceClubId);
  const currentClubIds = new Set(
    memberClubs.filter((link) => link.memberID === memberId).map((link) => link.clubID),
  );
  const selected = destinations.find((club) => club.clubID === destinationId);
  const partner =
    source.partnerID > 0 ||
    memberClubs.some((link) => link.clubID === sourceClubId && link.partnerID === memberId);
  const blocked = partner
    ? "Medlemmet har en fast makker i underklubben. Fjern makkerforholdet i BC3 først."
    : source.groupIndex !== 0
      ? "Medlemmet er tilknyttet en gruppe. Fjern gruppetilknytningen i BC3 først."
      : "";
  const duplicate = selected && currentClubIds.has(selected.clubID);

  function open(next: "remove" | "transfer") {
    setDestinationId("");
    setError("");
    setAction(next);
  }

  async function submit() {
    if (pending.current || blocked || (action === "transfer" && (!selected || duplicate))) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      if (action === "remove") {
        await removeMemberFromSubclub(fdbNo, sourceClubId, memberId);
      } else if (action === "transfer" && selected) {
        await transferMemberToSubclub(fdbNo, sourceClubId, memberId, selected.clubID);
      } else return;
      await refreshMembershipQueries(
        queryClient,
        fdbNo,
        sourceClubId,
        action === "transfer" ? selected?.clubID : undefined,
      );
      toast.success(
        action === "remove"
          ? "Medlemmet er fjernet fra underklubben."
          : "Medlemmet er flyttet til den valgte underklub.",
      );
      setAction(null);
    } catch (cause) {
      setError(membershipChangeError(cause));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => open("remove")}>
          Fjern fra underklub
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => open("transfer")}>
          Flyt til anden underklub
        </Button>
      </div>
      <AlertDialog
        open={action !== null}
        onOpenChange={(open) => {
          if (!open && !busy) setAction(null);
        }}
      >
        <AlertDialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "remove" ? "Fjern medlem fra underklub?" : "Bekræft flytning"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === "remove"
                ? "Dette fjerner medlemmets tilknytning til den valgte underklub. Andre medlemskaber og historiske resultater bevares."
                : "Flytningen ændrer kun dette medlemskab. Andre medlemskaber og historiske resultater bevares."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Medlem</dt>
            <dd className="font-semibold">{memberName}</dd>
            <dt className="text-muted-foreground">Medlemsnummer</dt>
            <dd>{memberNo ?? "—"}</dd>
            <dt className="text-muted-foreground">Fra underklub</dt>
            <dd>{sourceClubName}</dd>
            {partner && (
              <>
                <dt className="text-muted-foreground">Fast makker</dt>
                <dd>{partnerName ?? "Registreret i BC3"}</dd>
              </>
            )}
          </dl>
          {action === "transfer" && (
            <div className="space-y-2 text-sm">
              <label htmlFor={`destination-${source.memberClubID}`} className="font-medium">
                Til underklub
              </label>
              <select
                id={`destination-${source.memberClubID}`}
                value={destinationId}
                onChange={(event) =>
                  setDestinationId(event.target.value ? Number(event.target.value) : "")
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                disabled={busy}
              >
                <option value="">Vælg underklub</option>
                {destinations.map((club) => (
                  <option key={club.clubID} value={club.clubID}>
                    {club.clubName}
                    {currentClubIds.has(club.clubID) ? " (allerede medlem)" : ""}
                  </option>
                ))}
              </select>
              <p className="text-muted-foreground">
                Nuværende medlemskaber:{" "}
                {subClubs
                  .filter((club) => currentClubIds.has(club.clubID))
                  .map((club) => club.clubName)
                  .join(", ") || "Ingen"}
                .
              </p>
              {selected && (
                <p>
                  Du er ved at flytte {memberName} fra {sourceClubName} til {selected.clubName}.
                </p>
              )}
              {duplicate && (
                <p className="text-destructive">
                  Medlemmet er allerede tilknyttet denne underklub.
                </p>
              )}
              {destinations.length === 0 && <p>Der er ingen anden underklub at flytte til.</p>}
            </div>
          )}
          {blocked && (
            <p className="text-sm text-destructive" role="alert">
              {blocked}
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Annuller</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy || !!blocked || (action === "transfer" && (!selected || !!duplicate))}
              onClick={(event) => {
                event.preventDefault();
                void submit();
              }}
            >
              {busy ? "Gemmer…" : action === "remove" ? "Fjern fra underklub" : "Flyt medlem"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
