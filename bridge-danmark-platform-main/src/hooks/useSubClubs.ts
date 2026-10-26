import { queryOptions, useQuery } from "@tanstack/react-query";
import { getSubClubs } from "@/api/firebirdApi";

export const subClubsQueryOptions = (fdbNo: string) =>
  queryOptions({
    queryKey: ["bc3", "subclubs", fdbNo],
    queryFn: () => getSubClubs(fdbNo),
    retry: false,
  });

export function useSubClubs(fdbNo: string) {
  return useQuery(subClubsQueryOptions(fdbNo));
}
