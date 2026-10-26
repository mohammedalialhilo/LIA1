import { bc3Auth, type Bc3Session } from "@/services/bc3Auth";

/**
 * Roller i platformen. Frontendkontrol er IKKE sikkerhed — backend skal
 * kontrollere rettigheder til hver klub og hver beskyttet handling.
 */
export type Rolle = "besoegende" | "medlem" | "klubadministrator" | "dbf-medarbejder";

export type Rettigheder = {
  roller: Rolle[];
  /** Klubnumre brugeren dokumenteret må administrere. */
  adminKlubber: string[];
  /** false = backend har ikke kunnet bekræfte rettighederne. */
  verificeret: boolean;
  mangler?: string;
};

/**
 * Magnus' API har hverken login- eller rolle-endpoint endnu, så der kan aldrig
 * udledes administratorrettigheder. Alle behandles som besøgende.
 */
export function hentRettigheder(session: Bc3Session | null = bc3Auth.currentSession()): Rettigheder {
  return {
    roller: session ? ["besoegende", "medlem"] : ["besoegende"],
    adminKlubber: [],
    verificeret: false,
    mangler: "Backend-funktion mangler: API'et oplyser ikke brugerens roller eller klubrettigheder.",
  };
}

export function kanAdministrere(r: Rettigheder, klubNr: string) {
  if (!r.verificeret) return false;
  return r.roller.includes("dbf-medarbejder") || (r.roller.includes("klubadministrator") && r.adminKlubber.includes(klubNr));
}
