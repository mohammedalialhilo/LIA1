import { Bc3ApiError, type ClubMember } from "@/api/firebirdApi";
import type { QueryClient } from "@tanstack/react-query";

export type MemberForm = {
  name: string;
  memberNo: string;
  email: string;
  phone1: string;
  phone2: string;
  phone3: string;
  address1: string;
  address2: string;
  zipCode: string;
  city: string;
  countryCode: string;
  clubStart: string;
};

export const emptyForm: MemberForm = {
  name: "",
  memberNo: "",
  email: "",
  phone1: "",
  phone2: "",
  phone3: "",
  address1: "",
  address2: "",
  zipCode: "",
  city: "",
  countryCode: "",
  clubStart: "",
};

export function formFromMember(member: ClubMember): MemberForm {
  return {
    name: member.name ?? "",
    memberNo: member.memberNo?.toString() ?? "",
    email: member.email ?? "",
    phone1: member.phone1 ?? "",
    phone2: member.phone2 ?? "",
    phone3: member.phone3 ?? "",
    address1: member.address1 ?? "",
    address2: member.address2 ?? "",
    zipCode: member.zipCode ?? "",
    city: member.city ?? "",
    countryCode: member.countryCode ?? "",
    clubStart: member.clubStart ?? "",
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
    queryClient.invalidateQueries({ queryKey: ["bc3", "memberSearch", fdbNo] }),
    queryClient.invalidateQueries({ queryKey: ["bc3", "administration", fdbNo] }),
    queryClient.invalidateQueries({ queryKey: ["bc3", "memberHistory", fdbNo] }),
  ]);
}
