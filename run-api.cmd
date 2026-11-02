@echo off
setlocal
cd /d "%~dp0"

curl.exe --silent --show-error --fail --max-time 3 --output NUL "http://127.0.0.1:5083/api/Clubs/9999/SubClubs/1/Members/1" 2>NUL
if not errorlevel 1 (
    echo The API is already running at http://localhost:5083/swagger
    exit /b 0
)

echo Starting the Firebird API at http://localhost:5083/swagger
echo Keep this window open while using the site. Press Ctrl+C to stop it.
dotnet run -c Release --project "DBF_BridgeClubs_REST_MSSQL-master\DBF_BridgeClubs_REST_MSSQL\DBF_BridgeClubs_REST_MSSQL.csproj" --no-launch-profile --urls http://127.0.0.1:5083
