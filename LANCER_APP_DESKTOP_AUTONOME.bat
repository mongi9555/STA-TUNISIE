@echo off
:: Force le répertoire courant vers le dossier du fichier .bat (Fix Admin C:\Windows\System32)
cd /d "%~dp0"
title CHERY Tunisie STA - Application Desktop (Mode Fenêtre Autonome Edge)
color 0B
cls

echo ======================================================================
echo   CHERY TUNISIE STA — MODE APPLICATION DESKTOP AUTONOME
echo ======================================================================
echo   Dossier du projet : %CD%
echo ======================================================================
echo.

:: Vérification si dist existe
if not exist "dist\index.html" (
    echo Compilation initiale du projet...
    call npm run build
)

:: Démarrage du serveur web local en arrière-plan
echo Démarrage du moteur de l'application...
start /B node dist/server.cjs > nul 2>&1

:: Attente de 2 secondes pour le démarrage du serveur
timeout /t 2 /nobreak > nul

:: Recherche et lancement de Microsoft Edge en mode App
set EDGE_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not exist %EDGE_PATH% (
    set EDGE_PATH="C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)

if exist %EDGE_PATH% (
    echo Ouverture de CHERY Tunisie STA en mode Fenetre Desktop Native...
    %EDGE_PATH% --app=http://localhost:3000 --name="CHERY Tunisie STA" --user-data-dir="%LOCALAPPDATA%\CheryTunisieApp"
) else (
    echo Microsoft Edge non trouve, ouverture dans le navigateur par defaut...
    start http://localhost:3000
)

echo.
echo Application lancee avec succes !
