@echo off
:: Force le répertoire courant vers le dossier du fichier .bat (Résout le problème C:\Windows\System32 en mode Admin)
cd /d "%~dp0"
title CHERY Tunisie STA - Generateur App Windows (Fix Admin C:\Windows\System32)
color 0A
cls

echo ======================================================================
echo   CHERY TUNISIE STA - GENERATEUR D'APPLICATION DESKTOP WINDOWS
echo ======================================================================
echo   Dossier du projet detecte : %CD%
echo ======================================================================
echo.

echo [1/4] FERMETURE DE TOUTE INSTANCE EN COURS D'EXECUTION...
taskkill /F /IM "Chery Tunisie STA.exe" /T 2>nul
taskkill /F /IM "electron.exe" /T 2>nul
timeout /t 1 /nobreak > nul

echo.
echo [2/4] NETTOYAGE DES FICHIERS VERROUILLES (DOSSIER RELEASE)...
if exist "release" (
    rmdir /S /Q "release" 2>nul
    if exist "release" (
        echo [ATTENTION] Le dossier release est verrouille par OneDrive ou Windows.
        echo Tentative de re-nettoyage dans 2 secondes...
        timeout /t 2 /nobreak > nul
        rmdir /S /Q "release" 2>nul
    )
)

echo.
echo  Choisissez l'option d'exportation :
echo.
echo  [1] Generer Dossier Executable Direct (Recommande Kaspersky - Option Rapide)
echo  [2] Generer Fichier Setup .exe complet (NSIS / Portable)
echo  [3] Quitter
echo.
echo ======================================================================
set /p CHOIX="Veuillez choisir une option (1, 2 ou 3) et appuyez sur Entree : "

if "%CHOIX%"=="1" goto BUILD_DIR
if "%CHOIX%"=="2" goto BUILD_EXE
if "%CHOIX%"=="3" goto FIN
goto END

:BUILD_DIR
echo.
echo [3/4] Compilation du projet React (Vite)...
call npm run build
echo.
echo [4/4] Creation du Dossier Executable Direct (Sans blocage)...
call npx electron-builder --win dir
echo.
echo ======================================================================
if %ERRORLEVEL% EQU 0 (
    echo   [SUCCES TOTAL] L'application Windows a ete generee sans aucun verrouillage !
    echo.
    echo   Emplacement: %CD%\release\win-unpacked\
    echo   Fichier a lancer: Chery Tunisie STA.exe
) else (
    echo   [ATTENTION] Si OneDrive verrouille le dossier, deplacez le projet
    echo   hors de OneDrive (ex: C:\Projet_Chery) puis relancez ce script.
)
echo ======================================================================
goto FIN

:BUILD_EXE
echo.
echo [3/4] Compilation du projet React (Vite)...
call npm run build
echo.
echo [4/4] Generation du fichier Setup .exe (NSIS/Portable)...
call npx electron-builder --win nsis portable
echo.
echo ======================================================================
if %ERRORLEVEL% EQU 0 (
    echo   [SUCCES] Le fichier .exe a ete genere dans le dossier "release" !
    echo   Emplacement: %CD%\release\
) else (
    echo   [ERREUR DETECTEE] Si le fichier est bloque par OneDrive ou Kaspersky:
    echo   1. Fermez l'application si elle tourne en arriere-plan.
    echo   2. Si votre projet est sur OneDrive, deplacez le dossier vers C:\Projet_Chery
)
echo ======================================================================
goto FIN

:FIN
echo.
pause
:END
