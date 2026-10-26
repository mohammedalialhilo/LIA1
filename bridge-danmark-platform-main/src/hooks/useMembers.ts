import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMembers } from "@/api/firebirdApi";

export const membersQueryOptions = (fdbNo: string) =>
  queryOptions({
    queryKey: ["bc3", "members", fdbNo],
    queryFn: () => getMembers(fdbNo),
    retry: false,
  });

export function useMembers(fdbNo: string) {
  return useQuery(membersQueryOptions(fdbNo));
}
