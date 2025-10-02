@echo off

:: Jamcha Project Startup Script for Windows

echo.
echo ==================================================
echo      Starting the entire Jamcha application stack
echo ==================================================
echo.


:: --- Configuration ---
set "DEVOPS_DIR=%~dp0jamcha-devops"
set "BACKEND_DIR=%~dp0jamcha-back"
set "CLIENT_DIR=%~dp0jamcha-client"
set "ADMIN_DIR=%~dp0jamcha-admin"


:: --- Main Execution ---

:: 1. Start Docker Services
echo [INFO] Starting Backend Infrastructure (Docker)...

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker and try again.
    goto :eof
)

where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] docker-compose is not installed. Please install it and try again.
    goto :eof
)

echo [INFO] Bringing down any existing containers to ensure a clean start...
cd /d "%DEVOPS_DIR%"
docker-compose down

echo [INFO] Building and starting all services in detached mode...
cd /d "%DEVOPS_DIR%"
docker-compose up --build -d

echo [SUCCESS] Docker services (Postgres, Keycloak, MinIO, Backend) are starting.
echo [INFO] Waiting for backend services to initialize. This may take a couple of minutes...
timeout /t 120 /nobreak


:: 2. Start Frontend Applications
echo.
echo ==================================================
echo           Starting Frontend Applications
echo ==================================================
echo.

where yarn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] yarn is not installed. Please install yarn and try again.
    goto :eof
)

:: Start Admin App
echo [INFO] Freeing port 3030 for Jamcha Admin...
call :free_port 3030
echo [INFO] Starting Jamcha Admin (Port 3030)...
start "Jamcha Admin" cmd /c "cd /d "%ADMIN_DIR%" && yarn install && yarn dev"
timeout /t 5 >nul

:: Start Client App
echo [INFO] Freeing port 3031 for Jamcha Client...
call :free_port 3031
echo [INFO] Starting Jamcha Client (Port 3031)...
start "Jamcha Client" cmd /c "cd /d "%CLIENT_DIR%" && yarn install && yarn dev"


:: 3. Finalization
echo.
echo ==================================================
echo           Application Status
echo ==================================================
echo.
echo [SUCCESS] All services have been started!
echo.
echo Your applications should be available at the following URLs shortly:
echo --------------------------------------------------
echo   - Jamcha Client: http://localhost:3031
echo   - Jamcha Admin:  http://localhost:3030
echo   - Backend API:   http://localhost:8080
echo   - Keycloak:      http://localhost:8085
echo   - MinIO Console: http://localhost:9001
echo   - pgAdmin:       http://localhost:5050
echo --------------------------------------------------
echo.
echo ==================================================
echo           Default Login Credentials
echo ==================================================
echo.
echo   Jamcha Admin Dashboard (http://localhost:3030)
echo     - Role:     ADMIN
echo     - Username: jamcha_admin
echo     - Password: Jamcha123
echo.
echo   Jamcha Client (as an Author)
echo     - Role:     AUTHOR
echo     - Username: content
echo     - Password: Content123
echo --------------------------------------------------
echo.
echo Note: It may take a minute for all services to be fully available.
echo.
echo To stop all services, run "docker-compose down" in the "%%DEVOPS_DIR%%" directory and manually close the frontend command prompt windows.
echo.


:: Open the main client application in the default browser
start http://localhost:3031


echo [SUCCESS] Setup complete. Enjoy Jamcha!
echo.

:: Go to end of file to skip functions
goto :eof


:: --- Functions ---

:: --- Functions ---

:free_port
setlocal enabledelayedexpansion
set "port=%~1"
echo [INFO] Checking if port %port% is in use...

:: Get all PIDs using the port
set "found_processes="
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%port%" ^| findstr "LISTENING" 2^>nul') do (
    set "found_processes=!found_processes! %%a"
)

:: Check if any processes were found
if "%found_processes%"=="" (
    echo [INFO] Port %port% is already free.
    goto :eof
)

:: Kill each process
echo [WARN] Port %port% is in use by the following PIDs:%found_processes%
echo [INFO] Terminating processes...

for %%p in (%found_processes%) do (
    if "%%p" neq "" (
        echo [INFO] Killing process %%p...
        taskkill /PID %%p /F >nul 2>nul
        if !errorlevel! equ 0 (
            echo [SUCCESS] Process %%p terminated successfully.
        ) else (
            echo [WARN] Process %%p may have already exited or could not be terminated.
        )
    )
)

:: Wait a moment for processes to fully terminate
timeout /t 2 /nobreak >nul

echo [SUCCESS] Port %port% has been freed.
goto :eof