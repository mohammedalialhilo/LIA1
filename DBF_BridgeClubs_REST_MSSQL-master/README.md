# DBF Bridge Clubs REST API: setup and run guide

## What this project contains

This is an ASP.NET Core 9 read-only HTTP API. The platform endpoints for club 9999 read the local Firebird `Data/9999.FDB` directly; other club numbers use Microsoft SQL Server. The solution has two projects:

| Project | Purpose |
| --- | --- |
| `DBF_BridgeClubs_REST_MSSQL` | Web API, controllers, Swagger UI, and launch profile |
| `DBF_BridgeClubs_Lib` | Data models and SQL queries using `Microsoft.Data.SqlClient` |

Controllers create repository objects directly. The club 9999 platform routes open Firebird connections; other routes use SQL Server connections. The application does not use Entity Framework or run migrations.

## Prerequisites

1. Install the **.NET 9 SDK**. Check it with `dotnet --list-sdks` (a `9.x` entry is needed).
2. For club 9999, run the local Firebird service and keep `Data/9999.FDB` available at the path in `Secret.cs`. No SQL Server is needed for this club's platform read endpoints.
3. For other club numbers, have access to an **existing SQL Server database** containing the bridge club data and a login that can `SELECT` from the relevant `club<clubNo>` schemas.

## Connection-string class

The repositories refer to `Secret.ConnectionString`. This machine currently has `DBF_BridgeClubs_Lib/Secret.cs` pointing to the local Firebird file, but the project's `.gitignore` excludes it, so another checkout may not have it. Without the file, `dotnet build` fails with `CS0103: The name 'Secret' does not exist in the current context`.

If the file is missing, create `DBF_BridgeClubs_Lib/Secret.cs` beside `DBF_BridgeClubs_Lib.csproj` with these contents:

```csharp
namespace BridgeTourneringLib;

public static class Secret
{
    public static string ConnectionString =>
        Environment.GetEnvironmentVariable("DBF_BRIDGECLUBS_CONNECTION_STRING")
        ?? throw new InvalidOperationException(
            "Set DBF_BRIDGECLUBS_CONNECTION_STRING before running the API.");
}
```

If you create the environment-variable version of `Secret.cs` above and want to use SQL Server for other clubs, set the connection string in the same PowerShell window where you run the API. The current local `Secret.cs` instead contains the Firebird connection for club 9999.

```powershell
# Example: local SQL Server with Windows authentication
$env:DBF_BRIDGECLUBS_CONNECTION_STRING = 'Server=localhost;Database=BridgeClubs;Integrated Security=True;Encrypt=True;TrustServerCertificate=True'
```

If your database uses SQL authentication, use `User Id=...;Password=...` instead of `Integrated Security=True`. `TrustServerCertificate=True` is convenient for a local development server with a self-signed certificate; use a trusted certificate in other environments. Keep real passwords out of tracked files and command transcripts.

## Build and run

Open PowerShell in the directory containing `DBF_BridgeClubs_REST_MSSQL.sln` (the **inner** `DBF_BridgeClubs_REST_MSSQL-master` directory if you are using the extracted folder in this workspace):

```powershell
dotnet restore .\DBF_BridgeClubs_REST_MSSQL.sln
dotnet build .\DBF_BridgeClubs_REST_MSSQL.sln
dotnet run --project .\DBF_BridgeClubs_REST_MSSQL\DBF_BridgeClubs_REST_MSSQL.csproj --launch-profile http
```

The current launch profile sets `ASPNETCORE_ENVIRONMENT=Development` and listens on `http://localhost:5083`. Stop the server with `Ctrl+C`. Open `http://localhost:5083/swagger` to browse the API, or `http://localhost:5083/openapi/v1.json` for the generated OpenAPI document. Swagger is registered for every environment in `Program.cs`.

To check that the API can read the local Firebird database:

```powershell
Invoke-RestMethod 'http://localhost:5083/api/Clubs/9999'
```

Opening Swagger alone checks that the web server starts; it does **not** check a database connection. The first data request opens the connection.

## Run alongside `bridge-danmark-platform-main`

The platform is in the sibling directory `A:\bridge-danmark-platform-main`. It is a Node.js/TanStack Start application. The API includes compatibility routes for the platform's Online BC3 read screens. The platform's `.env` points to `http://localhost:5083` and selects club 9999 with `VITE_BC3_API_SOURCE=firebird`.

Open two PowerShell windows:

1. **API window:** If the API is already running, stop it with `Ctrl+C` so `dotnet run` can rebuild with the Firebird repository. Run `dotnet run --project ./DBF_BridgeClubs_REST_MSSQL/DBF_BridgeClubs_REST_MSSQL.csproj --launch-profile http` from this solution directory. Check `http://localhost:5083/api/Clubs/9999`.
2. **Website window:** Run the following commands. The site uses the URL printed by Vite (the existing platform guide reports `http://127.0.0.1:8080/` on Windows):

   ```powershell
   Set-Location 'A:\bridge-danmark-platform-main'
   npm.cmd ci
   npm.cmd run dev
   ```

Restart Vite after changing `.env`, then open the website at the URL it prints. Go to `/bc3/online/9999`, or choose club 9999 on `/bc3/online`. The platform's club chooser shows club 9999 when `VITE_BC3_API_SOURCE=firebird`. The public website and prototype pages can run without the API.

The compatibility controller maps these platform requests to the Firebird repository for club 9999 and to the SQL repositories for other club numbers:

| Platform request | Repository data |
| --- | --- |
| `/api/Clubs/{fdbNo}` | Main club |
| `/api/Clubs/{fdbNo}/SubClubs` | Subclubs |
| `/api/Clubs/{fdbNo}/Members` | Members |
| `/api/Clubs/{fdbNo}/MemberClubs` | Member to club relationships |

The controller maps different field names and returns HTTP 200 with `[]` for empty collections, which the platform's JSON client can read. Fields without a source in this database, including `status`, `districtNo`, and `remoteProfileID`, remain empty or null.

The API permits cross-origin GET requests for local browser development. Online BC3 login and write actions remain prototype features; these compatibility routes only provide reads.

## Request paths

All implemented actions use `GET`. These are the routes as currently declared in the controllers; the repeated `Sections` and `Tournaments` segments are intentional in this table because they appear in the source.

| Path after `http://localhost:5083` | Data returned |
| --- | --- |
| `/{clubNo}/MainClub` | Main club |
| `/{clubNo}/SubClubs` | Subclubs |
| `/{clubNo}/Members` | Members |
| `/{clubNo}/MemberClubs` | Member to club relationships |
| `/api/Clubs/{fdbNo}` | Platform-compatible main club |
| `/api/Clubs/{fdbNo}/SubClubs` | Platform-compatible subclubs |
| `/api/Clubs/{fdbNo}/Members` | Platform-compatible members |
| `/api/Clubs/{fdbNo}/MemberClubs` | Platform-compatible member to club relationships |
| `/{clubNo}/{clubId}/Tournaments` | Main tournaments for a club ID |
| `/api/Tournaments/{clubNo}/Tournaments/{mainTournamentId}` | Groups in a main tournament |
| `/api/Tournaments/{clubNo}/Sections/{mainTournamentId}/Section` | Sections in a main tournament |
| `/api/Sections/{clubNo}/Sections/{sectionId}/Participants` | Section participants |
| `/api/Sections/{clubNo}/Sections/{sectionId}/Rounds` | Rounds and matches |
| `/api/Sections/{clubNo}/Sections/{sectionId}/Result` | Results |

There is also a declared `/{fdbNo}/Members/{memberNo}` route. It is currently faulty: the route calls the parameter `fdbNo` while the action expects `clubNo`, and the repository method creates `SqlConnection` without its connection string. Do not use this route until both defects are fixed.

## Troubleshooting and current limitations

- **`Secret` compile errors:** If this ignored file is absent, create `DBF_BridgeClubs_Lib/Secret.cs` as shown above. A standard `dotnet restore` cannot supply it.
- **Connection string error:** If you use the environment-variable example above, set `DBF_BRIDGECLUBS_CONNECTION_STRING` in the same PowerShell session that starts `dotnet run`.
- **`dotnet build` says the `.exe` is locked:** Stop the running API with `Ctrl+C`, then rerun `dotnet run` to load new code.
- **Website shows HTTP 500 for club 9999:** Stop any older API process, restart the API from this checkout, and check `http://localhost:5083/api/Clubs/9999`. The Firebird service and `Data/9999.FDB` must be available.
- **SQL login, schema, or table errors:** Check the connection details, database permissions, and whether schema `club<clubNo>` and its expected tables exist. The application does not create them.
- **Empty or misleading API responses:** Several repositories catch `SqlException`, print it to the server console, and return an empty or default result. Check the server console when a request does not return expected data.
- **Endpoint security:** The current application does not configure authentication. `UseAuthorization()` alone does not protect the routes. It also permits cross-origin `GET` requests from any origin. Review these settings before exposing it beyond a trusted development environment.

Verified on 26 October 2026: the API build succeeded; all four platform-compatible club 9999 endpoints returned HTTP 200 from the Firebird file (one main club, two subclubs, 50 members, and 49 membership rows). CORS allowed the website origin, and the platform production build succeeded. Restart any older API and Vite processes to load these changes.
