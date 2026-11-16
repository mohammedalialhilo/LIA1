# Membership change integration test

The test copies an offline club 9999 Firebird database to a unique temporary directory, starts the API on `127.0.0.1`, and performs all fixture writes against that disposable copy. Never point `BC3_TEST_DATABASE` at a running database; copying a live Firebird file is not a reliable backup.

```powershell
$env:BC3_TEST_DATABASE = 'C:\path\to\offline\9999.FDB'
$env:BC3_TEST_API_DLL = 'C:\path\to\built\DBF_BridgeClubs_REST_MSSQL.dll'
dotnet run --project DBF_BridgeClubs_REST_MSSQL-master/Tests/MemberChangeIntegration/MemberChangeIntegration.csproj
```

The source database must contain at least two subclubs and one partnered membership. The test verifies successful removal and transfer, partner and group conflicts, duplicate and missing links, concurrent requests, preservation of person and unrelated membership rows, unchanged historical table contents, BC3 audit entries, and API read views. It prints the path of the disposable database for inspection. The test does not alter database schema or disable BC3 triggers.
