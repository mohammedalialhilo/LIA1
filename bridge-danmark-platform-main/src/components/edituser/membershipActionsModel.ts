import type { QueryClient } from "@tanstack/react-query";
import { Bc3ApiError } from "@/api/firebirdApi";

export function membershipChangeError(error: unknown): string {
  if (error instanceof Bc3ApiError) {
    if (error.code === "partner_attached")
      return "Medlemmet har en fast makker i underklubben. Fjern makkerforholdet i BC3 først.";
    if (error.code === "group_assigned")
      return "Medlemmet er tilknyttet en gruppe. Fjern gruppetilknytningen i BC3 først.";
    if (error.code === "destination_already_linked")
      return "Medlemmet er allerede tilknyttet målunderklubben.";
    if (error.code === "membership_changed")
      return "Medlemskabet blev ændret undervejs. Opdatér siden og prøv igen.";
    if (error.status === 404)
      return "Medlemmet eller underklubben blev ikke fundet. Opdatér siden og prøv igen.";
    if (error.status === 400) return "Kontrollér underklubben og prøv igen.";
    if (error.status === 500) return "Serveren kunne ikke ændre medlemskabet. Prøv igen senere.";
  }
  return error instanceof Error ? error.message : "Medlemskabet kunne ikke ændres.";
}

export async function refreshMembershipQueries(
  queryClient: QueryClient,
  fdbNo: string,
  sourceClubId: number,
  destinationClubId?: number,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["bc3", "memberclubs", fdbNo] }),
    queryClient.invalidateQueries({ queryKey: ["bc3", "members", fdbNo] }),
    queryClient.invalidateQueries({
      queryKey: ["bc3", "clubMembers", fdbNo, String(sourceClubId)],
    }),
    ...(destinationClubId === undefined
      ? []
      : [
          queryClient.invalidateQueries({
            queryKey: ["bc3", "clubMembers", fdbNo, String(destinationClubId)],
          }),
        ]),
    queryClient.invalidateQueries({ queryKey: ["bc3", "existingMemberCandidates", fdbNo] }),
  ]);
}
