import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/lib/session";

export function AdminShell({
  system,
  kontekst,
  menu,
  aktiv,
  onVaelg,
  children,
}: {
  system: string;
  kontekst: string;
  menu: string[];
  aktiv: string;
  onVaelg: (m: string) => void;
  children: ReactNode;
}) {
  const { session, devMode, setDevMode } = useSession();

  return (
    <div className="mx-auto flex max-w-[95rem] flex-col gap-8 px-4 py-10 lg:flex-row lg:px-8">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="rounded-2xl bg-sidebar p-5 text-sidebar-foreground">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-sidebar-primary">
            {system}
          </p>
          <p className="mt-1 font-display text-lg font-bold">{kontekst}</p>
          <nav className="mt-5 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {menu.map((m) => (
              <button
                key={m}
                onClick={() => onVaelg(m)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  aktiv === m
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                }`}
              >
                {m}
              </button>
            ))}
          </nav>
          {session?.medlem.udviklerAdgang && (
            <div className="mt-5 flex items-center justify-between border-t border-sidebar-border pt-4 text-sm">
              <span>Udviklertilstand</span>
              <Switch checked={devMode} onCheckedChange={setDevMode} />
            </div>
          )}
        </div>
        <Badge variant="secondary" className="mt-4">
          Demoskærme — funktionalitet følger senere
        </Badge>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
