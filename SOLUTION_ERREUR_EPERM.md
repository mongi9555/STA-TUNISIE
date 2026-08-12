# 🛠️ Résolution de l'Erreur `Cannot find package.json in C:\Windows\System32`

## ❓ Cause de l'erreur
Lorsque vous exécutez un fichier `.bat` en faisant un **clic droit -> Exécuter en tant qu'administrateur**, Windows modifie le dossier de travail courant par défaut vers `C:\Windows\System32`. Par conséquent, `npm` et `electron-builder` cherchaient le fichier `package.json` dans `System32` au lieu du dossier de votre projet.

---

## ✅ Correction Appliquée
Tous les fichiers de commande (`.bat`) ont été mis à jour avec la directive **`cd /d "%~dp0"`**. 

Désormais, **quel que soit le mode d'exécution (Administrateur ou Utilisateur standard)**, le script se repositionne instantanément dans le dossier exact où se situe le projet `CHERY Tunisie STA`.

---

## 🚀 Comment générer l'application maintenant :

### Option A : Génération Directe `.exe` (Recommandée)
1. Double-cliquez sur **`CREER_APPLICATION_EXE.bat`** (ou Clic droit -> *Exécuter en tant qu'administrateur*).
2. Tapez **`1`** ou **`2`**.
3. Le script affichera le chemin valide de votre projet (ex: `C:\Users\...\chery-TN-main`) et compilera l'exécutable dans **`release\win-unpacked\Chery Tunisie STA.exe`**.

### Option B : En cas de Verrouillage OneDrive (`EBUSY`)
Double-cliquez sur **`GENERATEUR_EXE_OUTSIDE_ONEDRIVE.bat`** pour compiler temporairement dans `C:\Chery_Build_Temp`.

### Option C : Application Autonome Immédiate (Sans compilation)
Double-cliquez sur **`CREER_RACCOURCI_DESKTOP_AUTONOME.bat`** pour installer l'application autonome sur votre Bureau Windows.
