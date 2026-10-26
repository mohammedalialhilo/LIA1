import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/**
 * Brødkrummer i BC3 Online: BC3 Online > klub > underklub/medlem.
 * Kaldere sender selv <Link>-elementer, så routernes typer bevares.
 */
export function Bc3Breadcrumbs({ trin }: { trin: ReactNode[] }) {
  return (
    <nav aria-label="Brødkrumme" className="flex flex-wrap items-center gap-1 text-sm">
      {trin.map((t, i) => (
        <span key={i} className="flex items-center gap-1 text-muted-foreground">
          {i > 0 && <ChevronRight className="size-3.5" />}
          <span className={i === trin.length - 1 ? "font-semibold text-foreground" : ""}>{t}</span>
        </span>
      ))}
    </nav>
  );
}
