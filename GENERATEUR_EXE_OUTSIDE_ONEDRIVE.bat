@echo off
:: Force le répertoire courant vers le dossier du fichier .bat (Fix Admin C:\Windows\System32)
cd /d "%~dp0"
title CHERY Tunisie STA - Generateur EXE Hors OneDrive (Fix EBUSY & Kaspersky)
color 0A
cls

echo ======================================================================
echo   CHERY TUNISIE STA - GENERATION EXE HORS ONEDRIVE
echo ======================================================================
echo   Dossier source du projet : %CD%
echo ======================================================================
echo.

set TEMP_BUILD_DIR=C:\Chery_Build_Temp
set CURRENT_DIR=%CD%

echo [1/5] Fermeture des instances en cours...
taskkill /F /IM "Chery Tunisie STA.exe" /T 2>nul
taskkill /F /IM "electron.exe" /T 2>nul
timeout /t 1 /nobreak > nul

echo.
echo [2/5] Preparation du dossier de compilation hors OneDrive (%TEMP_BUILD_DIR%)...
if exist "%TEMP_BUILD_DIR%" rmdir /S /Q "%TEMP_BUILD_DIR%" 2>nul
mkdir "%TEMP_BUILD_DIR%"

echo Copie des fichiers sources vers C:\Chery_Build_Temp...
xcopy "%CURRENT_DIR%" "%TEMP_BUILD_DIR%" /E /I /H /Y 2>nul

echo.
echo [3/5] Placement dans %TEMP_BUILD_DIR% et compilation...
cd /d "%TEMP_BUILD_DIR%"

call npm run build
echo.
echo [4/5] Creation de l'exécutable Electron...
call npx electron-builder --win dir

echo.
echo [5/5] Copie du resultat dans votre dossier actuel...
cd /d "%CURRENT_DIR%"
if not exist "release" mkdir "release"

if exist "%TEMP_BUILD_DIR%\release\win-unpacked" (
    xcopy "%TEMP_BUILD_DIR%\release\win-unpacked" "release\win-unpacked" /E /I /H /Y
    echo.
    echo ======================================================================
    echo   [SUCCES TOTAL DEFINITIF !]
    echo.
    echo   L'application .exe est generee avec succes dans :
    echo   %CURRENT_DIR%\release\win-unpacked\Chery Tunisie STA.exe
    echo ======================================================================
) else (
    echo [INFO] Si Kaspersky a bloque le processus de compilation local,
    echo veuillez utiliser la Solution Raccourci Desktop Native (CREER_RACCOURCI_DESKTOP_AUTONOME.bat).
)

echo.
pause
