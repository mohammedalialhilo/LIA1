import type { Subclub } from "@/types/bc3";

/**
 * Underklubber pr. klub. Id'erne er lokale i klubbens egen base, så både
 * 2275/1 og 9999/1 kan findes samtidig.
 *
 * 9999-underklubberne følger de kendte navne fra kursusmiljøet.
 */
export const bc3Subclubs: Subclub[] = [
  // 2275 – Rødovre Bridgeklub
  {
    id: 1,
    sourceClubNumber: 2275,
    name: "Tirsdagsklubben",
    weekday: "Tirsdag",
    time: "19:00",
    leader: "Demo Turneringsleder A",
    status: "Aktiv",
    memberIds: [],
  },
  {
    id: 2,
    sourceClubNumber: 2275,
    name: "Onsdagsklubben",
    weekday: "Onsdag",
    time: "13:00",
    leader: "Demo Turneringsleder B",
    status: "Aktiv",
    memberIds: [],
  },
  {
    id: 5,
    sourceClubNumber: 2275,
    name: "Fredagsparturnering",
    weekday: "Fredag",
    time: "18:30",
    leader: "Demo Turneringsleder C",
    status: "Aktiv",
    memberIds: [],
  },
  {
    id: 9,
    sourceClubNumber: 2275,
    name: "Begynderholdet",
    weekday: "Mandag",
    time: "17:00",
    leader: "Demo Underviser",
    status: "Passiv",
    memberIds: [],
  },
  // 9999 – Kursusklubben (kendte underklubber fra kursusmiljøet)
  {
    id: 1,
    sourceClubNumber: 9999,
    name: "Mandagsklubben",
    weekday: "Mandag",
    time: "19:00",
    leader: "Demo Kursusleder",
    status: "Aktiv",
    memberIds: [],
  },
  {
    id: 2,
    sourceClubNumber: 9999,
    name: "BC3 18022014",
    weekday: "Mandag",
    time: "09:00",
    leader: "Demo Instruktør",
    status: "Aktiv",
    memberIds: [],
  },
  {
    id: 16,
    sourceClubNumber: 9999,
    name: "Torsdagklubben",
    weekday: "Torsdag",
    time: "13:00",
    leader: "Demo Instruktør 2",
    status: "Aktiv",
    memberIds: [],
  },
];
