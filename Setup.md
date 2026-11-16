**1) fist run this command in terminal:**
$env:MSSQL_CONNECTION_STRING = 'Server=localhost;Database=BridgeClubs;Integrated Security=True;Encrypt=True;TrustServerCertificate=True'
dotnet run --project .\Tools\FdbToSql\FdbToSql.csproj

----- the first step is just for the first time setting it up--------------------------------------------------

**2) second from inside 'LIA1\bridge-danmark-platform-main' in terminal run:**
npm run dev

** 3) from inside 'LIA1\DBF_BridgeClubs_REST_MSSQL-master\DBF_BridgeClubs_REST_MSSQL ' in terminal tun: **
dotnet run
