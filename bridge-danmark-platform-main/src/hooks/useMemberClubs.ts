import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMemberClubs } from "@/api/firebirdApi";

export const memberClubsQueryOptions = (fdbNo: string) =>
  queryOptions({
    queryKey: ["bc3", "memberclubs", fdbNo],
    queryFn: () => getMemberClubs(fdbNo),
    retry: false,
  });

export function useMemberClubs(fdbNo: string) {
  return useQuery(memberClubsQueryOptions(fdbNo));
}
