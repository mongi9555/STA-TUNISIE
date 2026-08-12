@echo off
chcp 65001 > NUL
cd /d "%~dp0"
title Chery Tunisie - Lancement de l'application & Base de donnees
color 0A

echo ========================================================
echo         CHERY TUNISIE - ESPACE COMMERCIAL & DIRECTION
echo ========================================================
echo.
echo [INFO] Sauvegarde automatique activee dans le dossier du projet :
echo        --^> .\data\db.json (Réservations, Stocks, Utilisateurs)
echo.

:: 1. Verification de Node.js et npm
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERREUR] Node.js n'est pas installe sur votre ordinateur.
    echo Veuillez telecharger et installer Node.js depuis https://nodejs.org
    echo.
    pause
    exit /b
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERREUR] npm n'a pas ete trouve dans le PATH systeme.
    echo.
    pause
    exit /b
)

:: 2. Installation des dependances si absent
if not exist node_modules (
    echo [1/2] Premier lancement : installation des dependances en cours...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERREUR] Impossible d'installer les dependances npm.
        pause
        exit /b
    )
    echo.
)

:: 3. Ouverture automatique du navigateur
echo [2/2] Ouverture du site web (http://localhost:3000)...
start "" "http://localhost:3000"

:: 4. Lancement du serveur d'application
call npm run dev

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERREUR] Le serveur s'est arrete de maniere inattendue.
    pause
)
