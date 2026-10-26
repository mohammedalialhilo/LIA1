import { Badge } from "@/components/ui/badge";
import type { Bc3Skaerm } from "@/lib/bc3-docs";

/**
 * Rekonstruktion af et BC3-vindue tegnet i browseren.
 * Det er IKKE et rigtigt skærmbillede — feltnavne og databasefelter er
 * arbejdsforslag, indtil de er verificeret mod en installation.
 */
export function Bc3Screen({ skaerm }: { skaerm: Bc3Skaerm }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-400/70 bg-slate-100 font-mono text-[13px] text-slate-900 card-shadow dark:border-slate-600">
      <div className="flex items-center justify-between gap-3 bg-slate-700 px-3 py-1.5 text-xs text-slate-50">
        <span className="truncate">{skaerm.vindue}</span>
        <span className="flex gap-1">
          <span className="grid size-4 place-items-center border border-slate-300/70">–</span>
          <span className="grid size-4 place-items-center border border-slate-300/70">□</span>
          <span className="grid size-4 place-items-center border border-slate-300/70">×</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-4 border-b border-slate-300 bg-slate-200 px-3 py-1 text-xs">
        {["Filer", "Medlemmer", "Turnering", "Klub", "Rapporter", "Hjælp"].map((m) => (
          <span key={m} className={skaerm.menusti.startsWith(m) ? "font-bold underline" : ""}>
            {m}
          </span>
        ))}
      </div>
      <div className="space-y-3 p-3">
        <p className="text-[11px] text-slate-600">{skaerm.menusti}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {skaerm.felter.map((f) => (
            <label key={f.etiket} className="flex items-center gap-2">
              <span className="w-36 shrink-0 truncate text-[12px] text-slate-700">{f.etiket}</span>
              {f.type === "afkryds" ? (
                <span className="flex items-center gap-1.5 text-[12px]">
                  <span className="grid size-3.5 place-items-center border border-slate-500 bg-white text-[10px] leading-none">
                    ✓
                  </span>
                  {f.vaerdi}
                </span>
              ) : (
                <span className="flex min-w-0 flex-1 items-center justify-between border border-slate-400 bg-white px-2 py-1 text-[12px]">
                  <span className="truncate">{f.vaerdi}</span>
                  {f.type === "dropdown" && <span className="ml-2 text-slate-500">▾</span>}
                </span>
              )}
            </label>
          ))}
        </div>

        {skaerm.tabel && (
          <div className="overflow-x-auto border border-slate-400 bg-white">
            <table className="w-full min-w-[420px] text-[12px]">
              <thead className="bg-slate-200 text-left">
                <tr>
                  {skaerm.tabel.kolonner.map((k) => (
                    <th key={k} className="border-r border-slate-300 px-2 py-1 font-semibold last:border-r-0">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skaerm.tabel.raekker.map((r, i) => (
                  <tr key={i} className={i === 1 ? "bg-blue-200/70" : ""}>
                    {r.map((c, j) => (
                      <td key={j} className="border-t border-slate-200 px-2 py-1">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t border-slate-300 pt-3">
          {skaerm.knapper.map((b) => (
            <span
              key={b.navn}
              className="border border-slate-500 bg-slate-200 px-3 py-1 text-[12px] shadow-[1px_1px_0_0_rgba(0,0,0,0.25)]"
            >
              {b.navn}
            </span>
          ))}
        </div>
      </div>
      <p className="border-t border-slate-300 bg-slate-200 px-3 py-1 text-[10px] text-slate-600">
        Rekonstruktion — ikke et rigtigt skærmbillede fra BC3
      </p>
    </div>
  );
}

export function Bc3SkaermMapping({ skaerm }: { skaerm: Bc3Skaerm }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-secondary/70 text-left font-display text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-2.5">Felt i BC3</th>
            <th className="px-4 py-2.5">Type</th>
            <th className="px-4 py-2.5">Databasefelt</th>
            <th className="px-4 py-2.5">Status</th>
          </tr>
        </thead>
        <tbody>
          {skaerm.felter.map((f) => (
            <tr key={f.etiket} className="border-t border-border/70">
              <td className="px-4 py-2 font-semibold">{f.etiket}</td>
              <td className="px-4 py-2 text-xs text-muted-foreground">{f.type}</td>
              <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{f.kilde}</td>
              <td className="px-4 py-2">
                <Badge variant="outline" className="text-xs">
                  {f.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
