import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Menu, LogIn, UserRound, ChevronDown, LayoutDashboard } from "lucide-react";
import { erDbf, erKlubAdmin, useSession } from "@/lib/session";
import { findKlub } from "@/lib/demo-data";

const nav = [
  { til: "/", label: "Forside" },
  { til: "/klub-og-medlem", label: "Klub og medlem" },
  { til: "/turneringer", label: "Turneringer & tilmelding" },
  { til: "/bc3", label: "BC3" },
  { til: "/resultater", label: "Resultater" },
  { til: "/butik", label: "Bridgebutikken" },
  { til: "/om-dbf", label: "Om DBF" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="accent-gradient flex size-9 items-center justify-center rounded-lg font-display text-lg font-bold text-accent-foreground">
        ♠
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-tight">bridge.dk</span>
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Danmarks Bridgeforbund
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { session, aabnLogin, logout, devMode, setDevMode, skiftKlub } = useSession();
  const [aaben, setAaben] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const klubKontekst = /^\/(\d{4})/.exec(pathname)?.[1] ?? null;
  const aktivKlub = session ? findKlub(session.aktivKlub) : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 lg:px-8">
        <Logo />

        <nav className="hidden flex-1 items-center gap-1 xl:flex">
          {nav.map((n) => (
            <Link
              key={n.til}
              to={n.til}
              activeOptions={{ exact: n.til === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="subtle" className="gap-2">
                  <UserRound className="size-4" />
                  <span className="hidden max-w-[13rem] truncate sm:inline">
                    {session.medlem.navn.replace(" (demo)", "")}
                  </span>
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Klubkontekst
                  <div className="mt-0.5 text-sm font-semibold text-foreground">
                    {aktivKlub ? `${aktivKlub.nr} – ${aktivKlub.navn}` : "—"}
                  </div>
                </DropdownMenuLabel>
                {session.medlem.klubber.length > 1 && (
                  <>
                    {session.medlem.klubber
                      .filter((nr) => nr !== session.aktivKlub)
                      .map((nr) => (
                        <DropdownMenuItem key={nr} onClick={() => skiftKlub(nr)}>
                          Skift til {nr} – {findKlub(nr)?.navn}
                        </DropdownMenuItem>
                      ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/medlem">Min side</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/turneringer">Turneringer & tilmelding</Link>
                </DropdownMenuItem>
                {erKlubAdmin(session.medlem) && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/klubadmin" className="font-semibold text-primary">
                        Redigér klubbens side
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bc3/online" className="font-semibold text-primary">
                        <LayoutDashboard className="mr-2 size-4" /> Åbn Online BC3
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {erDbf(session.medlem) && (
                  <DropdownMenuItem asChild>
                    <Link to="/dbf">DBF-administration (5000)</Link>
                  </DropdownMenuItem>
                )}
                {session.medlem.udviklerAdgang && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="flex items-center justify-between px-2 py-2 text-sm">
                      <span className="font-medium">Udviklertilstand</span>
                      <Switch checked={devMode} onCheckedChange={setDevMode} />
                    </div>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log ud</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="accent" className="font-display font-bold tracking-wide" onClick={() => aabnLogin(klubKontekst ?? undefined)}>
              <LogIn className="size-4" /> LOG IND
            </Button>
          )}

          <Sheet open={aaben} onOpenChange={setAaben}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Åbn menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[19rem]">
              <div className="mt-8 flex flex-col gap-1">
                {nav.map((n) => (
                  <Link
                    key={n.til}
                    to={n.til}
                    onClick={() => setAaben(false)}
                    className="rounded-md px-3 py-3 font-display text-lg font-semibold hover:bg-secondary"
                  >
                    {n.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
