import { queryOptions, useQuery, type QueryClient } from "@tanstack/react-query";
import { searchExistingMembers } from "@/api/firebirdApi";
import { refreshMemberQueries } from "@/components/edituser/memberForm";

export const existingMembersQueryOptions = (fdbNo: string, clubId: string, query: string) =>
  queryOptions({
    queryKey: ["bc3", "existingMemberCandidates", fdbNo, clubId, query.trim()],
    queryFn: () => searchExistingMembers(fdbNo, clubId, query),
    enabled: Boolean(clubId && query.trim()),
    retry: false,
  });

export function useExistingMembers(fdbNo: string, clubId: string, query: string) {
  return useQuery(existingMembersQueryOptions(fdbNo, clubId, query));
}

export async function refreshAssignedMemberQueries(
  queryClient: QueryClient,
  fdbNo: string,
  clubId: string,
) {
  await Promise.all([
    refreshMemberQueries(queryClient, fdbNo, clubId),
    queryClient.invalidateQueries({
      queryKey: ["bc3", "existingMemberCandidates", fdbNo, clubId],
    }),
  ]);
}
