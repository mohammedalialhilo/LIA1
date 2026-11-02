import { queryOptions, useQuery } from "@tanstack/react-query";
import { getClubMembers } from "@/api/firebirdApi";

export const clubMembersQueryOptions = (fdbNo: string, clubId: string) =>
  queryOptions({
    queryKey: ["bc3", "clubMembers", fdbNo, clubId],
    queryFn: () => getClubMembers(fdbNo, clubId),
    retry: false,
  });

export function useClubMembers(fdbNo: string, clubId: string) {
  return useQuery(clubMembersQueryOptions(fdbNo, clubId));
}
