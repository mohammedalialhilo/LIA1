import type { Member, MemberStatus } from "@/types/bc3";

/**
 * Hjælpefunktion til at bygge anonymiserede demo-medlemmer.
 * Alle kontaktoplysninger er opdigtede.
 */
export type DemoMemberInput = {
  memberId: number;
  orgMemberId: number;
  memberNumber: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  status: MemberStatus;
  handicap: number;
  subclubIds: number[];
  isPrimaryClub?: boolean;
  city: string;
  postalCode: string;
  realBridgeId?: string;
  bboId?: string;
  intoBridgeId?: string;
};

export function byggMedlem(sourceClubNumber: number, i: DemoMemberInput): Member {
  const displayName = [i.firstName, i.middleName, i.lastName].filter(Boolean).join(" ");
  const nr = String(i.memberNumber);
  return {
    sourceClubNumber,
    memberId: i.memberId,
    orgMemberId: i.orgMemberId,
    memberNumber: i.memberNumber,
    status: i.status,
    firstName: i.firstName,
    middleName: i.middleName,
    lastName: i.lastName,
    displayName,
    address: `Demovej ${(i.memberId % 60) + 1}, ${(i.memberId % 3) + 1}. sal`,
    postalCode: i.postalCode,
    city: i.city,
    phone: `36 ${nr.slice(0, 2)} ${nr.slice(2, 4)} ${nr.slice(3, 5)}`,
    mobile: `2${nr.slice(0, 3)} ${nr.slice(1, 4)} ${nr.slice(0, 2)}`,
    email: `medlem${i.memberNumber}@demo-${sourceClubNumber}.bridge.dk`,
    isPrimaryClub: i.isPrimaryClub ?? true,
    handicap: i.handicap,
    subclubIds: i.subclubIds,
    realBridgeId: i.realBridgeId,
    bboId: i.bboId,
    intoBridgeId: i.intoBridgeId,
  };
}
