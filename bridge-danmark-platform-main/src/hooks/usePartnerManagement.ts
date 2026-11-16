import { queryOptions, useQuery, type QueryClient } from "@tanstack/react-query";
import { findAvailableSubstitutes, findEligiblePartners } from "@/api/firebirdApi";

export const partnerCandidatesQueryOptions = (
  fdbNo: string,
  clubId: number,
  memberId: number,
  query: string,
  enabled: boolean,
) =>
  queryOptions({
    queryKey: ["bc3", "partnerCandidates", fdbNo, String(clubId), memberId, query.trim()],
    queryFn: () => findEligiblePartners(fdbNo, clubId, memberId, query),
    enabled,
    retry: false,
  });

export function usePartnerCandidates(
  fdbNo: string,
  clubId: number,
  memberId: number,
  query: string,
  enabled: boolean,
) {
  return useQuery(partnerCandidatesQueryOptions(fdbNo, clubId, memberId, query, enabled));
}

export const substitutesQueryOptions = (
  fdbNo: string,
  clubId: number,
  query: string,
  enabled = true,
) =>
  queryOptions({
    queryKey: ["bc3", "substitutes", fdbNo, String(clubId), query.trim()],
    queryFn: () => findAvailableSubstitutes(fdbNo, clubId, query),
    enabled,
    retry: false,
  });

export function useSubstitutes(fdbNo: string, clubId: number, query: string, enabled = true) {
  return useQuery(substitutesQueryOptions(fdbNo, clubId, query, enabled));
}

export async function refreshPartnerQueries(
  queryClient: QueryClient,
  fdbNo: string,
  clubId: number,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["bc3", "memberclubs", fdbNo] }),
    queryClient.invalidateQueries({ queryKey: ["bc3", "members", fdbNo] }),
    queryClient.invalidateQueries({ queryKey: ["bc3", "clubMembers", fdbNo, String(clubId)] }),
    queryClient.invalidateQueries({
      queryKey: ["bc3", "partnerCandidates", fdbNo, String(clubId)],
    }),
    queryClient.invalidateQueries({ queryKey: ["bc3", "substitutes", fdbNo, String(clubId)] }),
  ]);
}
