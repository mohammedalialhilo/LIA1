import type { Member } from "@/types/bc3";
import { byggMedlem, type DemoMemberInput } from "./demoMemberFactory";

/** Medlemmer i klub 2275 – anonymiserede demo-data. */
const raa: DemoMemberInput[] = [
  { memberId: 1, orgMemberId: 2000101, memberNumber: 22751, firstName: "Anne", lastName: "Demogaard", status: 1, handicap: 12, subclubIds: [1, 5], postalCode: "2610", city: "Rødovre" },
  { memberId: 2, orgMemberId: 2000102, memberNumber: 22752, firstName: "Bent", lastName: "Demolund", status: 1, handicap: 18, subclubIds: [1], postalCode: "2610", city: "Rødovre" },
  { memberId: 3, orgMemberId: 2000103, memberNumber: 22753, firstName: "Carla", middleName: "Bech", lastName: "Demoskov", status: 1, handicap: 24, subclubIds: [2], postalCode: "2720", city: "Vanløse" },
  { memberId: 4, orgMemberId: 2000104, memberNumber: 22754, firstName: "Dorte", lastName: "Demovad", status: 1, handicap: 31, subclubIds: [2, 5], postalCode: "2610", city: "Rødovre" },
  { memberId: 5, orgMemberId: 2000105, memberNumber: 22755, firstName: "Erik", lastName: "Demoholt", status: 4, handicap: 44, subclubIds: [9], postalCode: "2610", city: "Rødovre" },
  { memberId: 6, orgMemberId: 2000106, memberNumber: 22756, firstName: "Finn", lastName: "Demokrog", status: 1, handicap: 9, subclubIds: [1, 2], postalCode: "2730", city: "Herlev" },
  { memberId: 7, orgMemberId: 2000107, memberNumber: 22757, firstName: "Gitte", lastName: "Demosand", status: 1, handicap: 27, subclubIds: [5], postalCode: "2610", city: "Rødovre" },
  { memberId: 8, orgMemberId: 2000108, memberNumber: 22758, firstName: "Henrik", lastName: "Demomunk", status: 1, handicap: 15, subclubIds: [1], postalCode: "2610", city: "Rødovre" },
  { memberId: 9, orgMemberId: 2000109, memberNumber: 22759, firstName: "Inge", lastName: "Demoriis", status: 4, handicap: 52, subclubIds: [], postalCode: "2610", city: "Rødovre" },
  { memberId: 10, orgMemberId: 2000110, memberNumber: 22760, firstName: "Jens", lastName: "Demodahl", status: 1, handicap: 21, subclubIds: [2, 5], postalCode: "2700", city: "Brønshøj" },
  { memberId: 11, orgMemberId: 2000111, memberNumber: 22761, firstName: "Kirsten", lastName: "Demoholm", status: 1, handicap: 36, subclubIds: [2], postalCode: "2610", city: "Rødovre" },
  { memberId: 12, orgMemberId: 2000112, memberNumber: 22762, firstName: "Lars", lastName: "Demoprip", status: 1, handicap: 6, subclubIds: [1, 5], postalCode: "2610", city: "Rødovre" },
  { memberId: 13, orgMemberId: 2000113, memberNumber: 22763, firstName: "Mette", lastName: "Demobjerg", status: 1, handicap: 29, subclubIds: [1], postalCode: "2610", city: "Rødovre" },
  { memberId: 14, orgMemberId: 2000114, memberNumber: 22764, firstName: "Niels", lastName: "Demolange", status: 4, handicap: 47, subclubIds: [9], postalCode: "2610", city: "Rødovre" },
  { memberId: 15, orgMemberId: 2000115, memberNumber: 22765, firstName: "Ove", lastName: "Demokjær", status: 1, handicap: 33, subclubIds: [2], postalCode: "2730", city: "Herlev" },
  { memberId: 16, orgMemberId: 2000116, memberNumber: 22766, firstName: "Pia", lastName: "Demovinter", status: 1, handicap: 11, subclubIds: [1, 2], postalCode: "2610", city: "Rødovre" },
  { memberId: 17, orgMemberId: 2000117, memberNumber: 22767, firstName: "Rikke", lastName: "Demonord", status: 1, handicap: 40, subclubIds: [5], isPrimaryClub: false, postalCode: "2610", city: "Rødovre" },
  { memberId: 18, orgMemberId: 2000118, memberNumber: 22768, firstName: "Søren", lastName: "Demogaard", status: 1, handicap: 23, subclubIds: [1], postalCode: "2610", city: "Rødovre" },
  { memberId: 19, orgMemberId: 2000119, memberNumber: 22769, firstName: "Tove", lastName: "Demolyng", status: 1, handicap: 19, subclubIds: [2, 5], postalCode: "2610", city: "Rødovre" },
  { memberId: 20, orgMemberId: 2000120, memberNumber: 22770, firstName: "Ulla", lastName: "Demostrand", status: 4, handicap: 55, subclubIds: [], postalCode: "2610", city: "Rødovre" },
  { memberId: 21, orgMemberId: 2000121, memberNumber: 22771, firstName: "Verner", lastName: "Demohøj", status: 1, handicap: 14, subclubIds: [1, 5], postalCode: "2610", city: "Rødovre" },
  { memberId: 22, orgMemberId: 2000122, memberNumber: 22772, firstName: "Yrsa", lastName: "Demomose", status: 1, handicap: 26, subclubIds: [2], postalCode: "2610", city: "Rødovre" },
  { memberId: 23, orgMemberId: 2000123, memberNumber: 22773, firstName: "Åse", lastName: "Demokilde", status: 1, handicap: 38, subclubIds: [9], postalCode: "2610", city: "Rødovre" },
  { memberId: 24, orgMemberId: 2000124, memberNumber: 22774, firstName: "Bo", lastName: "Demoager", status: 1, handicap: 17, subclubIds: [1, 2, 5], postalCode: "2610", city: "Rødovre" },
];

export const members2275: Member[] = raa.map((m) => byggMedlem(2275, m));
