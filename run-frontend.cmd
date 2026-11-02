@echo off
setlocal
cd /d "%~dp0\bridge-danmark-platform-main"

curl.exe --silent --show-error --fail --max-time 3 --output NUL "http://localhost:8080/" 2>NUL
if not errorlevel 1 (
    echo The frontend is already running at http://localhost:8080/
    exit /b 0
)

echo Starting the frontend at http://localhost:8080/
echo Keep this window open while using the site. Press Ctrl+C to stop it.
call npm.cmd run dev
