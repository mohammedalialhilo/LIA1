import { Link } from "@tanstack/react-router";

const kolonner = [
  {
    titel: "Spil bridge",
    links: [
      { til: "/klub-og-medlem", label: "Klub og medlem" },
      { til: "/klubber", label: "Find en klub" },
      { til: "/turneringer", label: "Turneringer & tilmelding" },
      { til: "/resultater", label: "Resultater" },
      { til: "/om-dbf", label: "Lær at spille bridge" },
    ],
  },
  {
    titel: "For klubber",
    links: [
      { til: "/bc3", label: "BridgeCentral / BC3" },
      { til: "/bc3/teknisk", label: "Teknisk dokumentation" },
      { til: "/distrikter-og-kredse", label: "Distrikter og kredse" },
      { til: "/butik", label: "Bridgebutikken" },
    ],
  },
  {
    titel: "Forbundet",
    links: [
      { til: "/om-dbf", label: "Om DBF" },
      { til: "/om-dbf", label: "Dansk Bridge" },
      { til: "/om-dbf", label: "Kontakt sekretariatet" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="accent-gradient flex size-9 items-center justify-center rounded-lg font-display text-lg font-bold text-accent-foreground">
              ♠
            </span>
            <span className="font-display text-lg font-bold">bridge.dk</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            Danmarks Bridgeforbund · Asylgade 13, 5000 Odense C · 48 47 52 13
          </p>
          <p className="mt-4 text-xs text-primary-foreground/50">
            Prototype med demodata. Ingen rigtige medlems- eller turneringsoplysninger.
          </p>
        </div>
        {kolonner.map((k) => (
          <div key={k.titel}>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-accent">
              {k.titel}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {k.links.map((l) => (
                <li key={l.til + l.label}>
                  <Link to={l.til} className="text-primary-foreground/80 hover:text-primary-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/60">
        © 2026 Danmarks Bridgeforbund · Demonstrationsprototype
      </div>
    </footer>
  );
}
