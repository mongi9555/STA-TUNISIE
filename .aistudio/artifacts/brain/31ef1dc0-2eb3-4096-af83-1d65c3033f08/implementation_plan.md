# Plan d'Affichage du Plan Firebase Firestore & Synchronisation Administration

Affichage explicite du plan **Firebase Firestore Enterprise Edition (Spark Free Tier)** sous forme de bannière fixe d'information en haut du site et intégration d'un tableau de bord de synchronisation interactif dans l'Espace Administrateur.

## User Review & Critical Decisions

> [!IMPORTANT]
> Les réponses aux questions de clarification ont confirmé la direction UX suivante :
> 1. **Affichage du Plan sur le Site** : Une bannière fixe d'information en haut du site (intégrée sous l'en-tête principal) indiquant le moteur **Firebase Firestore Enterprise Edition (Spark Tier)** avec le statut de synchronisation en direct.
> 2. **Espace Administrateur** : Un tableau de bord dédié **"Plan & Synchronisation Firestore"** fournissant des métriques en temps réel (297 réservations, 11 modèles, 19 commerciaux, paramètres du site), l'état des quotas journaliers et des boutons d'action rapide pour la synchronisation immédiate et la reconstruction multi-sources.

- **Décision Confirmée 1** : Bannière d'information fixe sous le Header avec statut Live Firestore.
- **Décision Confirmée 2** : Onglet d'administration "Plan & Synchro Cloud" avec métriques réelles et déclencheurs de synchronisation immédiate.

---

## 1. Vue d'Ensemble & Concept Clé

- **Objectif** : Rendre totalement transparent le plan de base de données utilisé (**Firebase Firestore Enterprise Edition - Spark Free Tier**) pour la direction et les utilisateurs, et offrir un centre de contrôle de synchronisation complet dans l'Espace Administrateur pour garantir que l'ensemble des 297 bons de réservation et des données reste synchronisé en temps réel sans perte.
- **Utilisateurs Cibles** : Direction CHERY Tunisie, DSI (Super Admin), Administrateurs d'agence et Commercials.
- **Valeur Ajoutée** : Visibilité instantanée sur la santé de la base Firestore, suivi des quotas (50 000 lectures / 20 000 écritures par jour), et capacité d'exécuter à tout moment des resynchronisations forcées et des vérifications d'intégrité multi-sources.

---

## 2. Expérience Utilisateur & Design Visuel

- **Bannière Fixe de Plan (Haut du Site - Header)** :
  - **Emplacement** : Sous la barre d'en-tête principale CHERY Tunisie.
  - **Design** : Bandeau sombre premium aux accents Flame Red / Emerald Green (`bg-slate-950/95 border-b border-red-900/40`).
  - **Contenu** :
    - Badge Moteur : `🔥 Firebase Firestore Enterprise Edition (Spark Tier)`
    - Statut Live : `🟢 Synchro Temps Réel Active (297 Bons)`
    - Métriques Quotas : `50k Lectures / 20k Écritures Max/Jour`
    - Action rapide : Bouton d'accès direct au panneau d'administration.

- **Espace Administrateur - Tableau de Bord "Plan & Synchro Firestore"** :
  - **Emplacement** : Nouvel onglet / section prioritaire dans `AdminPanel.tsx`.
  - **Cards d'Information & Quotas** :
    1. **Carte Firebase Firestore Enterprise (Spark Plan)** :
       - Projet ID: `solid-compiler-n9v0l`
       - Firestore Database ID: `ai-studio-cherytunisierser-31ef1dc0-2eb3-4096-af83-1d65c3033f08`
       - Statut: `🟢 En Ligne - Listener Temps Réel Actif`
       - Documents Synchronisés: `297 / 297 Réservations`
       - Quota quotidien: ~0.6% consommé sur 50 000 lectures.
    2. **Carte Turso libSQL Cloud DB (Moteur Secondaire de Secours)** :
       - Hôte: `sta-tunisie-mongi95.aws-eu-west-1.turso.io`
       - Statut: `🟢 Connecté - Auto-Sync Multi-Région`
  - **Actions de Synchronisation en Direct** :
    - `⚡ Synchroniser Firestore En Temps Réel` : Force l'écriture par lot de l'ensemble des 297 réservations vers Firestore.
    - `🔄 Reconstruire & Synchro Multi-Sources` : Exécute l'agrégation multi-sources (`/api/reservations/recover`) entre mémoire, Turso, Firestore et sauvegarde locale.
    - `📥 Exporter la Sauvegarde JSON / Audit` : Téléchargement instantané d'un instantané complet de la base de données.

---

## 3. Décisions Produits & Arbitrages

- **Approche Choisie** :
  - Affichage clair et proéminent de **Firebase Firestore Enterprise** comme base de données principale de l'application, complété par la visibilité sur les performances et les quotas Spark.
  - Double assurance : Maintien du pont de synchronisation Firestore + Turso Edge en arrière-plan sans bloquer l'expérience utilisateur.

---

## 4. Architecture Technique & Flux de Données

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CHERY TUNISIE APPLICATION                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
       ┌───────────────────────────────┴───────────────────────────────┐
       ▼                                                               ▼
┌──────────────────────────────┐                            ┌──────────────────────────┐
│ Top Banner (Fixed Header)    │                            │ Espace Administrateur    │
│ 🔥 Firebase Firestore        │                            │ ⚙️ Plan & Synchro Cloud   │
│ Spark Plan (50k Read/Day)    │                            │ 🟢 297 Bons Synchro      │
│ 🟢 Live Sync Active          │                            │ ⚡ Boutons de Resynchro  │
└──────────────────────────────┘                            └──────────────────────────┘
       │                                                               │
       └───────────────────────────────┬───────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FIRESTORE BATCH SYNC ENGINE                        │
│   • syncAllReservationsToFirestore()                                        │
│   • fetchAllReservationsFromFirestore()                                     │
│   • POST /api/reservations/recover (Multi-Source Recovery)                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
       ┌───────────────────────────────┴───────────────────────────────┐
       ▼                                                               ▼
┌─────────────────────────────────────────┐   ┌────────────────────────────────┐
│ Firebase Firestore Enterprise           │   │ Turso libSQL Edge DB (AWS)     │
│ (solid-compiler-n9v0l)                  │   │ (sta-tunisie-mongi95)          │
└─────────────────────────────────────────┘   └────────────────────────────────┘
```

- **Composants clés à modifier** :
  1. `src/components/Header.tsx` : Ajout de la bannière fixe du plan Firebase Firestore Enterprise en haut du site.
  2. `src/components/AdminPanel.tsx` : Ajout de l'onglet et du composant de gestion du Plan & de la Synchronisation Firestore avec les métriques en direct et les déclencheurs de resynchronisation.
  3. `src/App.tsx` : Transmission des fonctions de synchronisation `onSyncFirestore` et `onRecoverMultiSource` au panneau d'administration.
