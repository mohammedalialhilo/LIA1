import { queryOptions, useQuery } from "@tanstack/react-query";
import { getClub } from "@/api/firebirdApi";

export const clubQueryOptions = (fdbNo: string) =>
  queryOptions({
    queryKey: ["bc3", "club", fdbNo],
    queryFn: () => getClub(fdbNo),
    retry: false,
  });

export function useClub(fdbNo: string) {
  return useQuery(clubQueryOptions(fdbNo));
}
