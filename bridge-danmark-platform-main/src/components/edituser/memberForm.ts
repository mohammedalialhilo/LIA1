import { Bc3ApiError, type ClubMember } from "@/api/firebirdApi";
import type { QueryClient } from "@tanstack/react-query";

export type MemberForm = {
  name: string;
  memberNo: string;
  email: string;
  phone1: string;
  address1: string;
  zipCode: string;
  city: string;
  countryCode: string;
};

export const emptyForm: MemberForm = {
  name: "",
  memberNo: "",
  email: "",
  phone1: "",
  address1: "",
  zipCode: "",
  city: "",
  countryCode: "",
};

export function formFromMember(member: ClubMember): MemberForm {
  return {
    name: member.name ?? "",
    memberNo: member.memberNo?.toString() ?? "",
    email: member.email ?? "",
    phone1: member.phone1 ?? "",
    address1: member.address1 ?? "",
    zipCode: member.zipCode ?? "",
    city: member.city ?? "",
    countryCode: member.countryCode ?? "",
  };
}

export function memberSaveError(error: unknown): string {
  if (error instanceof Bc3ApiError) {
    if (error.status === 404) return "Underklubben eller medlemmet blev ikke fundet.";
    if (error.status === 409) return "Medlemsnummeret er allerede i brug.";
    if (error.status === 400) return "Kontrollér felterne og prøv igen.";
    if (error.status === 500)
      return "Serveren kunne ikke gemme medlemmet. Kontrollér Firebird-serverens log.";
  }
  return error instanceof Error ? error.message : "Medlemmet kunne ikke gemmes.";
}

export async function refreshMemberQueries(
  queryClient: QueryClient,
  fdbNo: string,
  clubId: string,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["bc3", "clubMembers", fdbNo, clubId] }),
    queryClient.invalidateQueries({ queryKey: ["bc3", "members", fdbNo] }),
    queryClient.invalidateQueries({ queryKey: ["bc3", "memberclubs", fdbNo] }),
  ]);
}
