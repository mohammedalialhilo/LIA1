import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bc3ApiError,
  setFeeCategory,
  type FeeCategory,
  type MemberAdministration,
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

export function FeeCategoryEditor({
  fdbNo,
  memberId,
  memberName,
  administration,
  categories,
}: {
  fdbNo: string;
  memberId: number;
  memberName: string;
  administration: MemberAdministration;
  categories: FeeCategory[];
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(administration.feeCategoryCode ?? 0);
  const [expected, setExpected] = useState(administration.feeCategoryCode ?? 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const editable = categories.some((category) => category.code === administration.feeCategoryCode);

  function begin() {
    setExpected(administration.feeCategoryCode ?? 0);
    setSelected(administration.feeCategoryCode ?? 0);
    setError("");
    setOpen(true);
  }

  async function save() {
    if (
      pending.current ||
      !editable ||
      selected === expected ||
      !categories.some((item) => item.code === selected)
    )
      return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await setFeeCategory(fdbNo, memberId, selected, expected);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bc3", "administration", fdbNo, memberId] }),
        queryClient.invalidateQueries({ queryKey: ["bc3", "memberHistory", fdbNo, memberId] }),
        queryClient.invalidateQueries({ queryKey: ["bc3", "memberSearch", fdbNo] }),
      ]);
      toast.success("Kontingentkategorien er gemt.");
      setOpen(false);
    } catch (cause) {
      setError(
        cause instanceof Bc3ApiError && cause.code === "concurrent_change"
          ? "Kategorien blev ændret undervejs. Opdatér siden og prøv igen."
          : cause instanceof Bc3ApiError && cause.code === "unsupported_category"
            ? "Den nuværende kategori skal kontrolleres i BC3 først."
            : "Kontingentkategorien kunne ikke gemmes.",
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <>
      {editable ? (
        <Button type="button" size="sm" variant="outline" onClick={begin}>
          Skift kontingentkategori
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Kategorien kan ikke ændres her, før den er fastsat i BC3.
        </p>
      )}
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!next && !busy) setOpen(false);
        }}
      >
        <AlertDialogContent className="w-[calc(100vw-2rem)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Skift kontingentkategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Du ændrer kontingentkategorien for {memberName}. Den gælder personen på tværs af
              underklubber. Vælg kun en kategori, når den er bekræftet for medlemmet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 text-sm">
            <p>
              Nuværende kategori: <strong>{administration.feeCategoryName}</strong>
            </p>
            <label htmlFor={`fee-category-${memberId}`} className="block font-medium">
              Ny kategori
            </label>
            <select
              id={`fee-category-${memberId}`}
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
              disabled={busy}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category.code} value={category.code}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Annuller</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy || selected === expected}
              onClick={(event) => {
                event.preventDefault();
                void save();
              }}
            >
              {busy ? "Gemmer…" : "Bekræft ændring"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
