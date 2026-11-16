import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  getFeeCategories,
  getMemberAdministration,
  getMemberHistory,
  searchMembers,
  type MemberSearchFilters,
} from "@/api/firebirdApi";

export function useMemberAdministration(fdbNo: string, memberId: number) {
  return useQuery(
    queryOptions({
      queryKey: ["bc3", "administration", fdbNo, memberId],
      queryFn: () => getMemberAdministration(fdbNo, memberId),
      enabled: fdbNo === "9999" && memberId > 0,
      retry: false,
    }),
  );
}

export function useFeeCategories(fdbNo: string) {
  return useQuery(
    queryOptions({
      queryKey: ["bc3", "feeCategories", fdbNo],
      queryFn: () => getFeeCategories(fdbNo),
      enabled: fdbNo === "9999",
      staleTime: 60_000,
    }),
  );
}

export function useMemberHistory(fdbNo: string, memberId: number) {
  return useQuery(
    queryOptions({
      queryKey: ["bc3", "memberHistory", fdbNo, memberId],
      queryFn: () => getMemberHistory(fdbNo, memberId),
      enabled: fdbNo === "9999" && memberId > 0,
      retry: false,
    }),
  );
}

export function useSearchMembers(fdbNo: string, filters: MemberSearchFilters) {
  return useQuery(
    queryOptions({
      queryKey: ["bc3", "memberSearch", fdbNo, filters],
      queryFn: () => searchMembers(fdbNo, filters),
      enabled: fdbNo === "9999",
      retry: false,
    }),
  );
}
