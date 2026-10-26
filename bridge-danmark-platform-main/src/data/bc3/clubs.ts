import type { Club } from "@/types/bc3";

/** Demo-klubber i BC3 Online. Kun lokale data — ingen database. */
export const bc3Clubs: Club[] = [
  {
    clubNumber: 2275,
    name: "Rødovre Bridgeklub",
    status: "aktiv",
    description:
      "Almindeligt klubmiljø med spilleaftener på hverdage, klubturneringer og handicapregistrering.",
    address: "Rødovre Parkvej 401 (demo)",
    postalCode: "2610",
    city: "Rødovre",
    phone: "36 70 00 00 (demo)",
    email: "kontakt@demo-2275.bridge.dk",
    website: "https://bridge.dk/2275",
    district: "Distrikt København",
    contactPerson: "Demo Formand",
  },
  {
    clubNumber: 9999,
    name: "Kursusklubben",
    status: "demo",
    description:
      "DBF's kursus- og demomiljø. Bruges til undervisning i BC3 og til at prøve funktioner uden at røre klubbernes egne data.",
    address: "Bridgehuset 1 (demo)",
    postalCode: "8000",
    city: "Aarhus C",
    phone: "48 47 52 13 (demo)",
    email: "kursus@demo-9999.bridge.dk",
    website: "https://bridge.dk/9999",
    district: "Kursusmiljø",
    contactPerson: "Demo Kursusleder",
  },
];
