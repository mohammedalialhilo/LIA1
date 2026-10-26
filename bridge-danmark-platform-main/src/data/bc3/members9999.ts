import type { Member } from "@/types/bc3";
import { byggMedlem, type DemoMemberInput } from "./demoMemberFactory";

/**
 * Medlemmer i klub 9999 (Kursusklubben) – anonymiserede demo-data.
 * Bemærk at memberId 23 findes både her og i 2275 uden konflikt.
 */
const raa: DemoMemberInput[] = [
  { memberId: 1, orgMemberId: 1000001, memberNumber: 32701, firstName: "Kursist", lastName: "Én", status: 1, handicap: 22, subclubIds: [1], postalCode: "8000", city: "Aarhus C" },
  { memberId: 2, orgMemberId: 1000002, memberNumber: 32702, firstName: "Kursist", lastName: "To", status: 1, handicap: 30, subclubIds: [1, 2], postalCode: "8000", city: "Aarhus C" },
  { memberId: 3, orgMemberId: 1000003, memberNumber: 32703, firstName: "Kursist", lastName: "Tre", status: 1, handicap: 41, subclubIds: [2], postalCode: "8200", city: "Aarhus N" },
  { memberId: 5, orgMemberId: 1000005, memberNumber: 32705, firstName: "Kursist", lastName: "Fem", status: 1, handicap: 16, subclubIds: [1, 16], postalCode: "8000", city: "Aarhus C" },
  { memberId: 7, orgMemberId: 1000007, memberNumber: 32707, firstName: "Kursist", lastName: "Syv", status: 4, handicap: 58, subclubIds: [16], postalCode: "8000", city: "Aarhus C" },
  { memberId: 9, orgMemberId: 1000009, memberNumber: 32709, firstName: "Instruktør", lastName: "Ni", status: 1, handicap: 8, subclubIds: [1, 2, 16], postalCode: "8000", city: "Aarhus C" },
  { memberId: 11, orgMemberId: 1000011, memberNumber: 32711, firstName: "Kursist", lastName: "Elleve", status: 1, handicap: 35, subclubIds: [2], postalCode: "8210", city: "Aarhus V" },
  { memberId: 13, orgMemberId: 1000013, memberNumber: 32713, firstName: "Kursist", lastName: "Tretten", status: 1, handicap: 27, subclubIds: [16], postalCode: "8000", city: "Aarhus C" },
  { memberId: 15, orgMemberId: 1000015, memberNumber: 32715, firstName: "Kursist", lastName: "Femten", status: 4, handicap: 49, subclubIds: [], postalCode: "8000", city: "Aarhus C" },
  { memberId: 17, orgMemberId: 1000017, memberNumber: 32717, firstName: "Kursist", lastName: "Sytten", status: 1, handicap: 20, subclubIds: [1], postalCode: "8000", city: "Aarhus C" },
  { memberId: 19, orgMemberId: 1000019, memberNumber: 32719, firstName: "Kursist", lastName: "Nitten", status: 1, handicap: 44, subclubIds: [2, 16], postalCode: "8000", city: "Aarhus C" },
  { memberId: 21, orgMemberId: 1000021, memberNumber: 32721, firstName: "Kursist", lastName: "Enogtyve", status: 1, handicap: 12, subclubIds: [1], postalCode: "8000", city: "Aarhus C" },
  { memberId: 23, orgMemberId: 1000022, memberNumber: 32750, firstName: "Demo", lastName: "Medlem", status: 4, handicap: 52, subclubIds: [1, 16], isPrimaryClub: false, postalCode: "8000", city: "Aarhus C", realBridgeId: "RB-32750", bboId: "demo32750", intoBridgeId: "IB-32750" },
  { memberId: 25, orgMemberId: 1000025, memberNumber: 32725, firstName: "Kursist", lastName: "Femogtyve", status: 1, handicap: 24, subclubIds: [16], postalCode: "8000", city: "Aarhus C" },
  { memberId: 27, orgMemberId: 1000027, memberNumber: 32727, firstName: "Kursist", lastName: "Syvogtyve", status: 1, handicap: 33, subclubIds: [1, 2], postalCode: "8000", city: "Aarhus C" },
  { memberId: 29, orgMemberId: 1000029, memberNumber: 32729, firstName: "Kursist", lastName: "Niogtyve", status: 1, handicap: 39, subclubIds: [2], postalCode: "8000", city: "Aarhus C" },
];

export const members9999: Member[] = raa.map((m) => byggMedlem(9999, m));
