# Import `9999.FDB` into SQL Server

This separate .NET tool reads the Firebird database named in `DBF_BridgeClubs_Lib/Secret.cs` and copies its user tables into a SQL Server schema named `club9999`. The API's older SQL Server routes expect that schema name. It creates SQL tables and copies rows; it does not copy Firebird indexes, constraints, triggers, procedures, or users. The API currently uses read-only queries, so those database objects are not needed for its existing endpoints.

The website's club 9999 read screens now connect directly to the Firebird database through the API. You do **not** need this import tool to make `/bc3/online/9999` work. Use it only if you specifically want a SQL Server copy of the `.FDB` data.

## Requirements

- .NET 9 SDK.
- Firebird server running and able to open `Data/9999.FDB`. The tool uses the existing Firebird connection in `Secret.cs`; alternatively set `FIREBIRD_CONNECTION_STRING` in the same shell to override it.
- A SQL Server database you control. The login needs permission to create the `club9999` schema and tables and insert rows. SQL Server does not need to be on the same machine as Firebird.

From the solution directory, check that the source can be read:

```powershell
dotnet run --project .\Tools\FdbToSql\FdbToSql.csproj -- --inspect
```

In Git Bash, use forward slashes instead:

```bash
dotnet run --project ./Tools/FdbToSql/FdbToSql.csproj -- --inspect
```

Set the destination SQL Server connection string in the same PowerShell window. For a local SQL Server using Windows authentication, for example:

```powershell
$env:MSSQL_CONNECTION_STRING = 'Server=localhost;Database=BridgeClubs;Integrated Security=True;Encrypt=True;TrustServerCertificate=True'
dotnet run --project .\Tools\FdbToSql\FdbToSql.csproj
```

The equivalent in Git Bash is:

```bash
export MSSQL_CONNECTION_STRING='Server=localhost;Database=BridgeClubs;Integrated Security=True;Encrypt=True;TrustServerCertificate=True'
dotnet run --project ./Tools/FdbToSql/FdbToSql.csproj
```

If your SQL Server uses a login and password, use `User Id=...;Password=...` instead of `Integrated Security=True`. Do not commit credentials or the imported member data to source control.

The import uses a SQL transaction, so failed runs roll back newly created tables and data. It refuses to overwrite any table already present in `club9999`. Use an empty destination schema/database for the first import. To reimport, remove or rename the previous `club9999` tables yourself after checking that you have the right database and a backup.

If you want to use the older SQL Server routes against the imported copy, change `DBF_BridgeClubs_Lib/Secret.cs` to use the SQL Server connection string. Its current Firebird string cannot be passed to `SqlConnection`. In that case, set `FIREBIRD_CONNECTION_STRING` to the Firebird connection string when running the API so the platform's direct `/api/Clubs/9999` routes keep working. The website uses those direct Firebird routes for club 9999.
