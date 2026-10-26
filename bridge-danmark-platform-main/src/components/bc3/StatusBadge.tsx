import { Badge } from "@/components/ui/badge";
import { memberStatusLabel, type MemberStatus } from "@/types/bc3";

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  return (
    <Badge variant={status === 1 ? "default" : "secondary"}>{memberStatusLabel[status]}</Badge>
  );
}

export function StatusBadge({ tekst, aktiv = true }: { tekst: string; aktiv?: boolean }) {
  return <Badge variant={aktiv ? "default" : "secondary"}>{tekst}</Badge>;
}

export function DemoBadge() {
  return (
    <Badge variant="outline" className="border-gold text-gold-foreground">
      DEMO
    </Badge>
  );
}
