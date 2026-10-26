/**
 * BC3-autentifikation.
 *
 * VIGTIGT: Magnus' API har IKKE et dokumenteret login-endpoint endnu.
 * Derfor findes der INGEN rigtig autentifikation i denne prototype:
 *  - der tjekkes ikke adgangskoder mod Members-endpointet
 *  - medlemsnummer, e-mail eller andre persondata bruges ikke som kodeord
 *  - et login accepteres ikke, fordi et medlem findes
 *
 * Når endpointet findes (fx POST /api/Auth/Login), implementeres det HER
 * i en ny Bc3AuthService — BC3 Online-siderne skal ikke ændres.
 * Request/response-formatet er bevidst IKKE opdigtet.
 */

export type Bc3Credentials = {
  /** Brugernavn eller medlemsnummer indtastet i login-formularen. */
  username: string;
  password: string;
  /** Firebird-databasens klubnummer, fx "9999". */
  fdbNo: string;
};

export type Bc3Session = {
  fdbNo: string;
  username: string;
  /** Token fra et fremtidigt API-endpoint. */
  token: string;
};

export type Bc3LoginResult =
  | { ok: true; session: Bc3Session }
  | { ok: false; reason: "not-implemented" | "invalid-credentials" | "network"; message: string };

export interface Bc3AuthService {
  login(credentials: Bc3Credentials): Promise<Bc3LoginResult>;
  logout(): Promise<void>;
  currentSession(): Bc3Session | null;
}

/**
 * Midlertidig implementation: rapporterer ærligt, at login ikke er muligt endnu.
 * Erstat denne klasse med en HTTP-implementation, når Magnus' endpoint findes.
 */
class NotImplementedBc3AuthService implements Bc3AuthService {
  async login(): Promise<Bc3LoginResult> {
    return {
      ok: false,
      reason: "not-implemented",
      message:
        "BC3 API'et har endnu ikke et login-endpoint. Login kan først aktiveres, når endpointet er tilgængeligt.",
    };
  }

  async logout(): Promise<void> {
    /* Ingen session at rydde endnu. */
  }

  currentSession(): Bc3Session | null {
    return null;
  }
}

export const bc3Auth: Bc3AuthService = new NotImplementedBc3AuthService();

/**
 * MIDLERTIDIG UDVIKLINGSADGANG — IKKE AUTENTIFIKATION.
 *
 * Bruges kun til at kunne teste BC3 Online mod det lokale Firebird-API,
 * indtil der findes et rigtigt login-endpoint. Skal fjernes før produktion.
 */
export const TEMPORARY_DEVELOPMENT_ACCESS = true;
