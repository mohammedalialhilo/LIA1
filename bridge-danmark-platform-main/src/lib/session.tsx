import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { findKlub, findMedlem, type Medlem } from "./demo-data";

/**
 * Demo-session. Der er INGEN rigtig autentifikation — login accepterer enhver
 * adgangskode for de tre demomedlemmer og gemmer kun state i hukommelsen.
 */

type Session = {
  medlem: Medlem;
  aktivKlub: string;
};

type SessionContextValue = {
  session: Session | null;
  devMode: boolean;
  setDevMode: (v: boolean) => void;
  login: (medlem: Medlem, klubNr: string) => void;
  logout: () => void;
  skiftKlub: (klubNr: string) => void;
  loginDialogAaben: boolean;
  aabnLogin: (klubKontekst?: string) => void;
  lukLogin: () => void;
  klubKontekst: string | null;
};

const Ctx = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [devMode, setDevMode] = useState(false);
  const [loginDialogAaben, setLoginDialogAaben] = useState(false);
  const [klubKontekst, setKlubKontekst] = useState<string | null>(null);

  const login = useCallback((medlem: Medlem, klubNr: string) => {
    setSession({ medlem, aktivKlub: klubNr });
    setLoginDialogAaben(false);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setDevMode(false);
  }, []);

  const skiftKlub = useCallback((klubNr: string) => {
    setSession((s) => (s ? { ...s, aktivKlub: klubNr } : s));
  }, []);

  const aabnLogin = useCallback((kontekst?: string) => {
    setKlubKontekst(kontekst ?? null);
    setLoginDialogAaben(true);
  }, []);

  const value = useMemo(
    () => ({
      session,
      devMode: devMode && !!session?.medlem.udviklerAdgang,
      setDevMode,
      login,
      logout,
      skiftKlub,
      loginDialogAaben,
      aabnLogin,
      lukLogin: () => setLoginDialogAaben(false),
      klubKontekst,
    }),
    [session, devMode, login, logout, skiftKlub, loginDialogAaben, aabnLogin, klubKontekst],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession skal bruges inde i SessionProvider");
  return v;
}

/** Regler for hvilken klub et medlem havner i ved login. */
export function bestemKlub(medlem: Medlem, klubKontekst: string | null) {
  if (klubKontekst && medlem.klubber.includes(klubKontekst)) return klubKontekst;
  return medlem.primaerKlub;
}

export function autoriseredeKlubber(medlem: Medlem) {
  return medlem.klubber
    .map((nr) => findKlub(nr))
    .filter((k): k is NonNullable<ReturnType<typeof findKlub>> => !!k);
}

export function erKlubAdmin(medlem: Medlem | undefined) {
  return !!medlem?.roller.includes("klubadmin") || !!medlem?.roller.includes("dbf");
}

export function erDbf(medlem: Medlem | undefined) {
  return !!medlem?.roller.includes("dbf");
}

export { findMedlem };
