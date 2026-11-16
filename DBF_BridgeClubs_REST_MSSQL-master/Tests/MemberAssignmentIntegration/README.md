# Existing member assignment integration test

This test copies an **offline test copy** of `9999.FDB` into a new temporary directory. All HTTP writes go to that temporary database. It checks search, assignment, duplicate and missing ID responses, concurrent requests, unchanged person and partner data, both read APIs, and the existing create/edit flows.

From the repository root in PowerShell:

```powershell
$apiOutput = Join-Path $env:TEMP 'bc3-member-assignment-api'
dotnet build 'DBF_BridgeClubs_REST_MSSQL-master/DBF_BridgeClubs_REST_MSSQL/DBF_BridgeClubs_REST_MSSQL.csproj' -p:OutDir="$apiOutput\"
$env:BC3_TEST_API_DLL = Join-Path $apiOutput 'DBF_BridgeClubs_REST_MSSQL.dll'
$env:BC3_TEST_DATABASE = 'C:\path\to\offline-test-copy\9999.FDB'
dotnet run --project 'DBF_BridgeClubs_REST_MSSQL-master/Tests/MemberAssignmentIntegration/MemberAssignmentIntegration.csproj'
```

Use a database copy with at least two unassigned member/subclub pairs and a member name containing a Danish character. The test prints the location of its disposable database so it can be inspected after the run.
