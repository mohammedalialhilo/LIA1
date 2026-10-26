<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Result match data uses schemaVersion 0.1 JSON documents in src/data/results/, typed by src/lib/results-schema.ts and adapted in src/lib/results-data.ts; UI never reads sourceRefs — so a .NET API can later serve the same JSON without UI rewrites.
- Verified result data must never be mixed with placeholder values without an explicit placeholder marker — keeps prototype numbers from passing as real results.
- Unknown values must remain null, empty or explicitly marked as awaiting source data — the UI must never invent results.
