# Bridge Danmark platform: local setup and project map

This repository is a prototype of a Danish Bridge Federation website. It includes public pages, club pages, tournaments, results, and an Online BC3 area. You can run the website on its own. The Online BC3 screens that read club and member records need a separate API. The sibling `A:\DBF_BridgeClubs_MagnusS` checkout supplies compatible read endpoints for local development, including direct access to the `9999.FDB` Firebird demo database.

## Quick start

Install a recent Node.js version and npm, then open a terminal in the repository root (the directory containing `package.json`). The existing README uses npm:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. In the verified Windows run it was `http://127.0.0.1:8080/`. Stop the server with `Ctrl+C`.

On Windows PowerShell, if `npm` is blocked by the script execution policy, use the Windows command shim:

```powershell
npm.cmd ci
npm.cmd run dev
```

The repository also contains `bun.lock` and `bunfig.toml`. If you already use Bun, `bun install --frozen-lockfile` followed by `bun run dev` uses the committed lockfile. Use one package manager consistently for an installation. This checkout has a `package-lock.json` for npm.

## Configuration and the optional BC3 API

The `.env` file sets the API base URL and selects which club examples the Online BC3 chooser shows. For the local `9999.FDB` file, use these values. The `.env.local` file can override them for your machine:

```dotenv
VITE_FIREBIRD_API_URL=http://localhost:5083
VITE_BC3_API_SOURCE=firebird
```

Restart the dev server after changing `.env` or `.env.local`. The browser calls this API directly, so the API must be reachable from your browser and permit requests from the local website origin. The frontend expects these read endpoints:

| Endpoint | Used for |
| --- | --- |
| `GET /api/Clubs/{fdbNo}` | Club information |
| `GET /api/Clubs/{fdbNo}/SubClubs` | Subclubs |
| `GET /api/Clubs/{fdbNo}/Members` | Members |
| `GET /api/Clubs/{fdbNo}/MemberClubs` | Member-to-subclub relationships |

The sibling API implements those paths and reads club 9999 directly from `Data/9999.FDB`. Start it from `A:\DBF_BridgeClubs_MagnusS\DBF_BridgeClubs_REST_MSSQL-master\DBF_BridgeClubs_REST_MSSQL-master` with `dotnet run --project ./DBF_BridgeClubs_REST_MSSQL/DBF_BridgeClubs_REST_MSSQL.csproj --launch-profile http`. Stop an older API process first so the new code is compiled. Check `http://localhost:5083/api/Clubs/9999`, then open `/bc3/online/9999` on the website. The API setup details are in its `README.md`.

You do not need the API to view the home page, club prototype pages, tournaments, or results. If the API is unavailable, Online BC3 shows a connection error; it does not substitute demo records for an API response. Other club numbers still use the API's SQL Server repositories and require a SQL Server connection string.

## Project layout

| Path | Purpose |
| --- | --- |
| `package.json` | Dependencies and development, build, lint, and test scripts |
| `vite.config.ts` | Lovable's TanStack Start/Vite configuration and the server entry |
| `src/routes/` | File-based pages; `__root.tsx` provides the shared page shell |
| `src/router.tsx`, `src/routeTree.gen.ts` | Router setup and generated route tree; do not edit the generated file |
| `src/components/`, `src/styles.css` | React components and Tailwind styling |
| `src/lib/demo-data.ts` | Local prototype club, member, and tournament content |
| `src/data/results/`, `src/lib/results-schema.ts`, `src/lib/results-data.ts` | Versioned match JSON, its types, and UI adapter |
| `src/api/firebirdApi.ts`, `src/hooks/` | BC3 API requests and TanStack Query hooks |
| `src/lib/session.tsx`, `src/services/bc3Auth.ts` | Demo session state and BC3 authentication stub |
| `src/start.ts`, `src/server.ts` | TanStack Start middleware and server entry/error handling |
| `public/` | Static assets |
| `docs/systemgennemgang.md` | Detailed system review, known gaps, and proposed MVP |

The stack is React 19, TypeScript, TanStack Start/Router/Query, Vite, Tailwind CSS, and Radix-based UI components. TanStack Start serves the rendered app; there is no database bundled with this frontend repository. Route conventions are documented in `src/routes/README.md`.

## Useful commands

Run these from the repository root:

```sh
npm run dev       # Local development server
npm run build     # Production build
npm run preview   # Preview a completed build locally
npm run lint      # ESLint
npm run test      # Vitest test suite
```

Use `npm.cmd` in place of `npm` on Windows PowerShell if the execution-policy error occurs. `preview` checks a local production build; it is not a deployment command.

In this checkout, `npm run build` succeeds and `npm run test` passes all 22 tests. `npm run lint` currently fails on many existing Prettier formatting errors and warnings across source files; that does not prevent the development server from starting.

## What is working, and what is still a prototype

- Public, club, tournament, and results pages can render from local content. Some content is demonstration data. In results, verified match data is kept in `schemaVersion: "0.1"` JSON documents; placeholder results must be marked, and unknown values must remain unknown.
- The ordinary member login is a demo session held in browser memory. It is not real authentication, and changes made in prototype admin forms are not a persistent backend update.
- BC3 login has no working authentication endpoint. `TEMPORARY_DEVELOPMENT_ACCESS` in `src/services/bc3Auth.ts` allows development navigation and must not be treated as access control. The BC3 member form does not write to the API.
- Online BC3 read screens use the separate API described above. The deployed site cannot use a developer's `localhost` API; a deployed API URL and appropriate access controls would be needed.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `npm` is blocked in PowerShell | Run `npm.cmd` instead. |
| The page does not open at the expected port | Use the URL printed by `npm run dev`; this checkout served on port 8080 in the verified run. |
| Online BC3 says it cannot connect | Start the separate API, check `VITE_FIREBIRD_API_URL`, restart Vite, and check browser network/CORS errors. |
| Online BC3 shows HTTP 500 for club 9999 | Restart the API so it loads the Firebird repository; check `http://localhost:5083/api/Clubs/9999` and the API terminal for errors. |
| BC3 login cannot complete | There is no implemented BC3 authentication endpoint yet; use only the explicitly marked development path for local exploration. |

For the broader architecture and implementation roadmap, see [systemgennemgang.md](systemgennemgang.md).
