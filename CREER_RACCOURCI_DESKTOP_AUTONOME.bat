@echo off
:: Force le répertoire courant vers le dossier du fichier .bat (Fix Admin C:\Windows\System32)
cd /d "%~dp0"
title CHERY Tunisie STA - Creation Raccourci Application Desktop
color 0A
cls

echo ======================================================================
echo   CHERY TUNISIE STA - APPLICATION DESKTOP WINDOWS (SOLUTION DEFINITIVE)
echo ======================================================================
echo   Dossier du projet : %CD%
echo ======================================================================
echo.

set SCRIPT_DIR=%CD%
set TARGET_URL=http://localhost:3000
set SHORTCUT_PATH=%USERPROFILE%\Desktop\Chery Tunisie STA.lnk

echo [1/3] Creation du script PowerShell pour installer le raccourci Bureau...

powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_PATH%'); $EdgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'; if (-not (Test-Path $EdgePath)) { $EdgePath = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe' }; $Shortcut.TargetPath = $EdgePath; $Shortcut.Arguments = '--app=%TARGET_URL% --name=\"CHERY Tunisie STA\"'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.WindowStyle = 1; $Shortcut.Description = 'Application Commerciale CHERY Tunisie STA'; $Shortcut.Save()"

echo [2/3] Verification de la creation du raccourci...
if exist "%SHORTCUT_PATH%" (
    echo.
    echo   ======================================================================
    echo   [SUCCES TOTAL] Le raccourci "Chery Tunisie STA" a ete cree sur votre Bureau !
    echo   ======================================================================
    echo.
) else (
    echo   [INFO] Le raccourci n'a pas pu etre place sur le bureau.
)

echo [3/3] Lancement de l'application CHERY Tunisie STA...
echo.
echo Démarrage du moteur de l'application...
start /B node dist/server.cjs > nul 2>&1
timeout /t 2 /nobreak > nul

start "" "%SHORTCUT_PATH%"

echo.
echo Application lancée avec succès !
pause
