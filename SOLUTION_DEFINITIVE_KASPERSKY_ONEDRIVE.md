# 🛡️ Solutions Définitives Erreur .EXE (Kaspersky & OneDrive EBUSY/EPERM)

En environnement d'entreprise (avec **Kaspersky Endpoint Security** et **OneDrive** activement synchronisé), deux obstacles empêchent la création classique de fichiers `.exe` :
1. **OneDrive (`EBUSY: resource busy or locked`)** : OneDrive verrouille les fichiers en cours d'écriture dans `release\win-unpacked\`.
2. **Kaspersky (`spawn EPERM: operation not permitted`)** : Kaspersky bloque la création d'exécutables non signés générés par `electron-builder`.

---

## 🟢 SOLUTION 1 : Générer l'application .exe HORS OneDrive (100% Automatisé)

Un script dédié à été créé pour contourner l'erreur `EBUSY` de OneDrive :

1. Double-cliquez sur le fichier **`GENERATEUR_EXE_OUTSIDE_ONEDRIVE.bat`**.
2. Le script copie automatiquement votre projet dans `C:\Chery_Build_Temp` (hors de portée des verrous OneDrive).
3. Il compile le projet et déplace le dossier final dans :
   👉 **`release\win-unpacked\Chery Tunisie STA.exe`**

---

## ⚡ SOLUTION 2 : Créer le Raccourci Desktop App Officiel (Zéro Antivirus / Zéro Blocage)

Si Kaspersky empêche complètement la compilation d'un nouveau binaire Electron :

1. Double-cliquez sur **`CREER_RACCOURCI_DESKTOP_AUTONOME.bat`**.
2. Un raccourci officiel **`Chery Tunisie STA`** sera créé directement sur votre **Bureau Windows**.
3. En double-cliquant sur ce raccourci, l'application s'ouvre sous forme de **véritable application Windows autonome** (fenêtre sans barre d'adresse ni onglet, icône dédiée dans la barre des tâches).

---

## 🌐 SOLUTION 3 : Installation PWA 1-Clic via le Navigateur

1. Lancez l'application (`npm run dev` ou via le serveur).
2. Ouvrez l'application dans Microsoft Edge ou Google Chrome.
3. Dans la barre d'adresse en haut à droite, cliquez sur l'icône **"Installer CHERY Tunisie STA"** (ou dans le menu `...` -> `Applications` -> `Installer ce site en tant qu'application`).
4. Windows installera automatiquement un fichier `.exe` officiel dans votre menu Démarrer et sur votre bureau, sans aucun avertissement Kaspersky !
