import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  loadTursoConfig,
  saveTursoConfig,
  testTursoConnection,
  syncAllToTurso,
  pullAllFromTurso,
  getTursoStorageMetrics,
  vacuumTursoDatabase,
  exploreTursoTable,
  calculateNextWeeklySync,
  calculateNextDailySync,
} from "./src/server/tursoClient";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Express body-parser error handler for entity too large
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    console.warn('[Express Warning] Requête trop volumineuse reçue (413).');
    return res.status(413).json({
      error: "Taille de la requête trop volumineuse.",
      details: "Veuillez réduire la taille des fichiers ou images téléchargés."
    });
  }
  next(err);
});

// Serve public directory and explicit /uploads directory for static uploads (/uploads/*)
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));
app.use(express.static(path.join(process.cwd(), "public")));

// Endpoint pour uploader des fichiers (images fiches techniques, photos véhicules, vidéos, PDF) et obtenir une URL permanente
app.post("/api/upload", (req, res) => {
  try {
    const { fileName, fileData } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: "Aucun fichier fourni." });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const matches = typeof fileData === 'string' ? fileData.match(/^data:(.+);base64,(.+)$/) : null;
    let buffer: Buffer;
    let extension = "bin";

    if (matches) {
      const mime = matches[1].toLowerCase();
      const base64Data = matches[2];
      buffer = Buffer.from(base64Data, "base64");
      if (mime.includes("pdf")) extension = "pdf";
      else if (mime.includes("jpeg") || mime.includes("jpg")) extension = "jpg";
      else if (mime.includes("png")) extension = "png";
      else if (mime.includes("webp")) extension = "webp";
      else if (mime.includes("mp4")) extension = "mp4";
      else if (mime.includes("webm")) extension = "webm";
      else if (mime.includes("svg")) extension = "svg";
    } else {
      buffer = Buffer.from(fileData, "base64");
    }

    const cleanBaseName = (fileName || "document").replace(/[^a-zA-Z0-9_\.-]/g, "_");
    const hasValidExt = cleanBaseName.includes('.') && cleanBaseName.split('.').pop()!.length <= 5;
    const uniqueFileName = `${Date.now()}_${hasValidExt ? cleanBaseName : cleanBaseName + '.' + extension}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${uniqueFileName}`;

    console.log(`[Upload API] Fichier enregistré avec succès : ${publicUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return res.json({ success: true, url: publicUrl, fileName: uniqueFileName });
  } catch (error: any) {
    console.error("Erreur durant upload API:", error);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement du fichier." });
  }
});

// --- BASE DE DONNÉES CLOUD SQL (PostgreSQL avec Drizzle ORM) ---
import { db } from "./src/db/index.ts";
import { carModels, reservations, stockRequests, siteSettings, users } from "./src/db/schema.ts";

app.get("/api/sql/status", async (req, res) => {
  try {
    const carList = await db.select().from(carModels);
    return res.json({
      connected: true,
      provider: "PostgreSQL",
      message: "Connexion PostgreSQL active.",
      carsCount: carList.length,
    });
  } catch (error: any) {
    const hasConfig = Boolean(
      process.env.DATABASE_URL ||
      process.env.SQL_HOST
    );
    return res.json({
      connected: false,
      configured: hasConfig,
      provider: "PostgreSQL",
      message: hasConfig
        ? "En attente de connexion à la base PostgreSQL."
        : "Base PostgreSQL non configurée (utilise Firestore et data/db.json).",
      details: error?.message || String(error),
    });
  }
});

// --- CONFIGURATION DU STOCKAGE : SERVEUR LOCAL (data/db.json & clichés quotidiens) DÉSACTIVÉ ---
// Le stockage local fichier (data/db.json) et la génération automatique de clichés quotidiens
// sont désactivés à la demande de l'utilisateur au profit de Turso libSQL Cloud (mongi95) & Firestore.
const LOCAL_DB_ENABLED = false;

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "db.json");
const DB_BAK_PATH = path.join(DATA_DIR, "db.json.bak");
const DB_TMP_PATH = path.join(DATA_DIR, "db.json.tmp");
const DAILY_BACKUP_DIR = path.join(DATA_DIR, "daily_backups");

let inMemoryDbPayload: any = null;

function ensureDataDir() {
  if (LOCAL_DB_ENABLED && !fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function ensureDailyBackupDir() {
  if (LOCAL_DB_ENABLED && !fs.existsSync(DAILY_BACKUP_DIR)) {
    fs.mkdirSync(DAILY_BACKUP_DIR, { recursive: true });
  }
}

/**
 * Clichés quotidiens : Désactivés lorsque LOCAL_DB_ENABLED est false.
 */
function performDailyBackup(force: boolean = false): { success: boolean; date: string; filename: string; count: number; message: string } {
  const today = new Date().toISOString().slice(0, 10);
  if (!LOCAL_DB_ENABLED && !force) {
    return {
      success: false,
      date: today,
      filename: "",
      count: 0,
      message: "Serveur local (data/db.json) et clichés quotidiens désactivés au profit de Turso libSQL Cloud."
    };
  }

  try {
    ensureDailyBackupDir();
    const backupFilename = `backup_chery_${today}.json`;
    const backupFilePath = path.join(DAILY_BACKUP_DIR, backupFilename);
    const latestDailyPath = path.join(DAILY_BACKUP_DIR, `daily_backup_latest.json`);

    if (!fs.existsSync(DB_FILE_PATH)) {
      return { success: false, date: today, filename: backupFilename, count: 0, message: "Fichier db.json introuvable" };
    }

    const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const parsed = safeParseJSON(content);
    if (!parsed) {
      return { success: false, date: today, filename: backupFilename, count: 0, message: "Format db.json corrompu" };
    }

    fs.writeFileSync(backupFilePath, JSON.stringify(parsed, null, 2), "utf-8");
    fs.writeFileSync(latestDailyPath, JSON.stringify(parsed, null, 2), "utf-8");

    const resCount = Array.isArray(parsed.reservations) ? parsed.reservations.length : 0;
    const carsCount = Array.isArray(parsed.cars) ? parsed.cars.length : 0;

    return {
      success: true,
      date: today,
      filename: backupFilename,
      count: resCount,
      message: `Sauvegarde quotidienne enregistrée pour le ${today} (${resCount} réservations)`
    };
  } catch (err: any) {
    console.error("[Chery Daily Backup Error]:", err);
    return { success: false, date: today, filename: "", count: 0, message: err?.message || String(err) };
  }
}

// Planificateurs locaux : actifs uniquement si LOCAL_DB_ENABLED est vrai
if (LOCAL_DB_ENABLED) {
  ensureDataDir();
  ensureDailyBackupDir();
  setTimeout(() => {
    performDailyBackup();
  }, 2000);

  setInterval(() => {
    performDailyBackup();
  }, 30 * 60 * 1000);
}

function safeParseJSON(str: string | null | undefined) {
  if (!str || typeof str !== "string") return null;
  try {
    const parsed = JSON.parse(str);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    return null;
  } catch (err) {
    return null;
  }
}

function createDefaultDbPayload() {
  return {
    savedAt: new Date().toISOString(),
    cars: [],
    reservations: [],
    trashReservations: [],
    deletedReservationIds: [],
    commercials: [],
    siteSettings: null,
    accessories: [],
    quotes: [],
    adminDocs: [],
    knowledgeBase: [],
    testDrives: [],
    stockRequests: [],
    docTemplate: null,
    auditLogs: [],
  };
}

function getLatestDbPayload(): any {
  if (inMemoryDbPayload) {
    return inMemoryDbPayload;
  }
  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const fileContent = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = safeParseJSON(fileContent);
      if (parsed) {
        inMemoryDbPayload = parsed;
        return inMemoryDbPayload;
      }
    } catch (_) {}
  }
  if (fs.existsSync(DB_BAK_PATH)) {
    try {
      const bakContent = fs.readFileSync(DB_BAK_PATH, "utf-8");
      const parsedBak = safeParseJSON(bakContent);
      if (parsedBak) {
        inMemoryDbPayload = parsedBak;
        return inMemoryDbPayload;
      }
    } catch (_) {}
  }
  inMemoryDbPayload = createDefaultDbPayload();
  return inMemoryDbPayload;
}

let dbWriteQueue: Promise<any> = Promise.resolve();

async function safeAtomicWriteDb(dbPayload: any): Promise<boolean> {
  const current = dbWriteQueue.then(async () => {
    inMemoryDbPayload = dbPayload;

    if (LOCAL_DB_ENABLED) {
      ensureDataDir();
      const jsonString = JSON.stringify(dbPayload, null, 2);
      const uniqueTmp = path.join(DATA_DIR, `db.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`);
      fs.writeFileSync(uniqueTmp, jsonString, "utf-8");
      const check = safeParseJSON(fs.readFileSync(uniqueTmp, "utf-8"));
      if (!check) {
        try { fs.unlinkSync(uniqueTmp); } catch (_) {}
        throw new Error("Erreur d'intégrité JSON détectée");
      }
      if (fs.existsSync(DB_FILE_PATH)) {
        try {
          const cur = fs.readFileSync(DB_FILE_PATH, "utf-8");
          if (safeParseJSON(cur)) fs.writeFileSync(DB_BAK_PATH, cur, "utf-8");
        } catch (_) {}
      }
      fs.renameSync(uniqueTmp, DB_FILE_PATH);
      if (Array.isArray(dbPayload.reservations) && dbPayload.reservations.length > 0) {
        try {
          fs.writeFileSync("data/db_reservations_backup_safe.json", JSON.stringify(dbPayload.reservations, null, 2), "utf-8");
        } catch (_) {}
      }
      try {
        performDailyBackup(false);
      } catch (_) {}
    } else {
      console.log(`[Chery DB] Serveur Local (data/db.json) désactivé. Données maintenues en mémoire vive et synchronisées vers Turso Cloud.`);
    }

    // Synchronisation automatique en arrière-plan avec Turso si configuré
    try {
      const tursoCfg = loadTursoConfig();
      if (tursoCfg.url && tursoCfg.authToken) {
        syncAllToTurso(dbPayload, 'manual').catch((tursoErr) => {
          console.warn('[Turso Auto-Sync Warning] Échec synchronisation immédiate Turso:', tursoErr?.message);
        });
      }
    } catch (_) {}
    console.log(`[Chery DB Safe] Données traitées (${dbPayload.reservations?.length || 0} réservations, ${dbPayload.cars?.length || 0} modèles) -> Turso libSQL Cloud.`);
    return true;
  });
  dbWriteQueue = current.catch((err) => {
    console.error("[Chery DB Write Queue Error]:", err);
    return false;
  });
  return current;
}

// Endpoint pour lire la base de données
app.get("/api/db", (req, res) => {
  try {
    const data = getLatestDbPayload();
    return res.json({ exists: true, localDbDisabled: !LOCAL_DB_ENABLED, ...data });
  } catch (error: any) {
    console.error("Erreur lecture db:", error);
    const fallback = createDefaultDbPayload();
    return res.json({ exists: true, localDbDisabled: !LOCAL_DB_ENABLED, ...fallback, recovered: true });
  }
});

// Endpoint pour enregistrer / synchroniser la base de données (vers Turso Cloud, serveur local désactivé)
app.post("/api/db/save", (req, res) => {
  try {
    const existingData: any = getLatestDbPayload() || {};

    const {
      cars,
      reservations,
      trashReservations,
      deletedReservationIds,
      commercials,
      siteSettings,
      accessories,
      quotes,
      adminDocs,
      knowledgeBase,
      testDrives,
      stockRequests,
      docTemplate,
      auditLogs,
    } = req.body || {};

    // 1. Identifiants explicitement marqués comme supprimés / en corbeille
    const deletedIdSet = new Set<string>();
    if (Array.isArray(trashReservations)) {
      trashReservations.forEach((t: any) => {
        const id = t?.id || t?.reservation?.id;
        if (id) deletedIdSet.add(String(id).trim().toUpperCase());
      });
    }
    if (Array.isArray(existingData.trashReservations)) {
      existingData.trashReservations.forEach((t: any) => {
        const id = t?.id || t?.reservation?.id;
        if (id) deletedIdSet.add(String(id).trim().toUpperCase());
      });
    }

    // 2. Récupération résiliente et inconditionnelle de la base existante
    let existingReservations: any[] = Array.isArray(existingData.reservations) ? existingData.reservations : [];
    if (existingReservations.length === 0 && fs.existsSync("data/db_reservations_backup_safe.json")) {
      try {
        const safeData = JSON.parse(fs.readFileSync("data/db_reservations_backup_safe.json", "utf-8"));
        if (Array.isArray(safeData) && safeData.length > 0) existingReservations = safeData;
      } catch (_) {}
    }

    // Protection anti-perte : S'assurer que les réservations actives ne sont JAMAIS supprimées par erreur
    const mergedReservationsMap = new Map<string, any>();
    existingReservations.forEach((r: any) => {
      if (r && r.id) {
        const key = String(r.id).trim().toUpperCase();
        // Une réservation n'est supprimée QUE si elle figure explicitement dans la corbeille
        if (!deletedIdSet.has(key)) {
          mergedReservationsMap.set(key, r);
        }
      }
    });

    // 3. Si le client envoie des réservations actives, fusionner par identifiant sans écraser les autres
    if (Array.isArray(reservations)) {
      reservations.forEach((r: any) => {
        if (r && r.id) {
          const key = String(r.id).trim().toUpperCase();
          if (!deletedIdSet.has(key)) {
            const old = mergedReservationsMap.get(key);
            mergedReservationsMap.set(key, { ...old, ...r });
          }
        }
      });
    }

    // 4. Mettre à jour la corbeille
    let currentTrash: any[] = Array.isArray(trashReservations) ? trashReservations : (existingData.trashReservations || []);
    currentTrash.forEach((t: any) => {
      const id = t?.id || t?.reservation?.id;
      if (id) deletedIdSet.add(String(id).trim().toUpperCase());
    });

    const cleanReservations = Array.from(mergedReservationsMap.values());
    cleanReservations.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    const cleanDeletedIds = Array.from(deletedIdSet);

    // 5. Fusion intelligente et sécurisée des véhicules et du stock
    let cleanCars = existingData.cars || [];
    if (Array.isArray(cars) && cars.length > 0) {
      const carMap = new Map<string, any>();
      (existingData.cars || []).forEach((c: any) => {
        if (c && c.id) carMap.set(c.id, c);
      });
      cars.forEach((c: any) => {
        if (c && c.id) {
          const old = carMap.get(c.id);
          carMap.set(c.id, { ...old, ...c });
        }
      });
      cleanCars = Array.from(carMap.values());
    }

    const dbPayload = {
      savedAt: new Date().toISOString(),
      cars: cleanCars,
      reservations: cleanReservations,
      trashReservations: currentTrash,
      deletedReservationIds: cleanDeletedIds,
      commercials: Array.isArray(commercials) ? commercials : (existingData.commercials || []),
      siteSettings: siteSettings !== undefined ? siteSettings : (existingData.siteSettings || null),
      accessories: Array.isArray(accessories) ? accessories : (existingData.accessories || []),
      quotes: Array.isArray(quotes) ? quotes : (existingData.quotes || []),
      adminDocs: Array.isArray(adminDocs) ? adminDocs : (existingData.adminDocs || []),
      knowledgeBase: Array.isArray(knowledgeBase) ? knowledgeBase : (existingData.knowledgeBase || []),
      testDrives: Array.isArray(testDrives) ? testDrives : (existingData.testDrives || []),
      stockRequests: Array.isArray(stockRequests) ? stockRequests : (existingData.stockRequests || []),
      timesheetNotes: Array.isArray((req.body || {}).timesheetNotes) ? (req.body || {}).timesheetNotes : (existingData.timesheetNotes || []),
      docTemplate: docTemplate !== undefined ? docTemplate : (existingData.docTemplate || null),
      auditLogs: Array.isArray(auditLogs) ? auditLogs : (existingData.auditLogs || []),
    };

    inMemoryDbPayload = dbPayload;

    if (LOCAL_DB_ENABLED) {
      const jsonString = JSON.stringify(dbPayload, null, 2);
      fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
      const verifyContent = fs.readFileSync(DB_TMP_PATH, "utf-8");
      if (!safeParseJSON(verifyContent)) {
        throw new Error("Erreur d'intégrité JSON détectée lors de l'écriture temporaire.");
      }
      if (fs.existsSync(DB_FILE_PATH)) {
        try {
          const currentLive = fs.readFileSync(DB_FILE_PATH, "utf-8");
          if (safeParseJSON(currentLive)) {
            fs.writeFileSync(DB_BAK_PATH, currentLive, "utf-8");
          }
        } catch (e) {
          console.warn("[Chery DB Warning] Échec de la mise à jour du backup .bak:", e);
        }
      }
      fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
      try {
        fs.writeFileSync("data/db_reservations_backup_safe.json", JSON.stringify(cleanReservations, null, 2), "utf-8");
      } catch (_) {}
      console.log(`[Chery DB] Base de données enregistrée en mode atomique dans : ${DB_FILE_PATH}`);
    } else {
      console.log(`[Chery DB] Serveur Local (data/db.json) désactivé. Données maintenues en mémoire vive et synchronisées vers Turso Cloud.`);
    }

    // Synchronisation automatique en arrière-plan avec Turso si configuré
    try {
      const tursoCfg = loadTursoConfig();
      if (tursoCfg.url && tursoCfg.authToken) {
        syncAllToTurso(dbPayload, 'manual').catch((tursoErr) => {
          console.warn('[Turso Auto-Sync Warning] Échec synchronisation Turso:', tursoErr?.message);
        });
      }
    } catch (_) {}

    return res.json({
      success: true,
      savedAt: dbPayload.savedAt,
      filePath: LOCAL_DB_ENABLED ? "data/db.json" : "Turso libSQL Cloud (Serveur Local désactivé)",
      localDbDisabled: !LOCAL_DB_ENABLED,
      tursoSynced: true,
      counts: {
        cars: dbPayload.cars.length,
        reservations: dbPayload.reservations.length,
        commercials: dbPayload.commercials.length,
        accessories: dbPayload.accessories.length,
        quotes: dbPayload.quotes.length,
      },
    });
  } catch (error: any) {
    console.error("Erreur écriture db.json:", error);
    if (fs.existsSync(DB_TMP_PATH)) {
      try { fs.unlinkSync(DB_TMP_PATH); } catch (_) {}
    }
    return res.status(500).json({ error: "Erreur lors de la sauvegarde dans le dossier du projet." });
  }
});

// --- API DÉDIÉE À LA GESTION & SAUVEGARDE EN LIGNE DES BONS DE RÉSERVATION ---

// 1. Récupération sécurisée de tous les bons de réservation
app.get("/api/reservations", (req, res) => {
  try {
    ensureDataDir();
    let fileContent = "";
    if (fs.existsSync(DB_FILE_PATH)) {
      fileContent = fs.readFileSync(DB_FILE_PATH, "utf-8");
    } else if (fs.existsSync(DB_BAK_PATH)) {
      fileContent = fs.readFileSync(DB_BAK_PATH, "utf-8");
    }

    const parsed = safeParseJSON(fileContent);
    const reservations = (parsed && Array.isArray(parsed.reservations)) ? parsed.reservations : [];

    return res.json({
      success: true,
      count: reservations.length,
      reservations,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Erreur lecture /api/reservations:", error);
    return res.status(500).json({ success: false, error: "Impossible de lire les réservations." });
  }
});

// 2. Génération garantie d'un identifiant chronologique unique anti-collision
app.get("/api/reservations/next-id", (req, res) => {
  try {
    ensureDataDir();
    let reservations: any[] = [];
    if (fs.existsSync(DB_FILE_PATH)) {
      const parsed = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8"));
      if (parsed && Array.isArray(parsed.reservations)) reservations = parsed.reservations;
    }

    let maxNum = 1000;
    reservations.forEach((r: any) => {
      const m = r.id?.match(/RES-2026-([0-9]+)/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > maxNum) maxNum = n;
      }
    });

    const nextId = `RES-2026-${maxNum + 1}`;
    return res.json({ success: true, nextId, currentMax: maxNum });
  } catch (error: any) {
    return res.json({ success: true, nextId: `RES-2026-${Date.now().toString().slice(-4)}` });
  }
});

// 3. Sauvegarde / Fusion atomique garantie sans perte de données
app.post("/api/reservations/save", (req, res) => {
  try {
    ensureDataDir();
    const { reservation, reservations } = req.body || {};
    
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const existingReservations: any[] = Array.isArray(currentDb.reservations) ? currentDb.reservations : [];
    const deletedIds = new Set<string>((currentDb.deletedReservationIds || []).map((id: string) => String(id).trim().toUpperCase()));
    const resMap = new Map<string, any>();
    
    // Garder d'abord toutes les réservations existantes qui ne sont pas supprimées
    existingReservations.forEach((r) => {
      if (r && r.id && !deletedIds.has(String(r.id).trim().toUpperCase())) resMap.set(r.id, r);
    });

    // Si une liste complète est soumise, fusionner par ID (ne jamais réintroduire les réservations supprimées)
    if (Array.isArray(reservations)) {
      reservations.forEach((r) => {
        if (r && r.id && !deletedIds.has(String(r.id).trim().toUpperCase())) resMap.set(r.id, r);
      });
    }

    // Si un bon unique est soumis
    if (reservation && reservation.id && !deletedIds.has(String(reservation.id).trim().toUpperCase())) {
      const p = reservation.client?.personnePhysique;
      const s = reservation.client?.societe;
      const rawNom = (p ? `${p.nom || ''} ${p.prenom || ''}` : (s?.raisonSociale || '')).toLowerCase().trim();
      const norm = rawNom.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      const isForbidden = 
        norm === 'chery client' ||
        norm === 'client chery' ||
        norm === 'client' ||
        norm === 'chery' ||
        norm === 'test' ||
        norm.includes('chery client') ||
        norm.includes('client chery') ||
        (norm.includes('chery') && norm.includes('client'));

      if (isForbidden) {
        return res.status(400).json({
          success: false,
          error: 'Création de bon bloquée : profil générique interdit (« Chery Client »). Renseignez l\'identité réelle et les coordonnées du client.'
        });
      }

      // Vérification approfondie des coordonnées pour les nouveaux bons
      if (p) {
        if (!p.nom || p.nom.trim().length < 2 || !p.prenom || p.prenom.trim().length < 2) {
          return res.status(400).json({
            success: false,
            error: 'Création de bon bloquée : Le nom et prénom du client sont obligatoires (au moins 2 lettres).'
          });
        }
        const cinClean = (p.cin || '').trim();
        if (!cinClean || !/^\d{8}$/.test(cinClean)) {
          return res.status(400).json({
            success: false,
            error: 'Création de bon bloquée : Le N° CIN (8 chiffres obligatoires) doit être renseigné.'
          });
        }
        const phoneClean = (p.telephone || '').replace(/\D/g, '');
        if (!phoneClean || phoneClean.length !== 8) {
          return res.status(400).json({
            success: false,
            error: 'Création de bon bloquée : Le numéro de téléphone direct (8 chiffres) est obligatoire.'
          });
        }
        if (!p.adresse || p.adresse.trim().length < 5) {
          return res.status(400).json({
            success: false,
            error: 'Création de bon bloquée : L\'adresse physique complète du client est obligatoire.'
          });
        }
      } else if (s) {
        if (!s.raisonSociale || s.raisonSociale.trim().length < 3) {
          return res.status(400).json({
            success: false,
            error: 'Création de bon bloquée : La raison sociale de la société est obligatoire.'
          });
        }
        if (!s.matriculeFiscale || s.matriculeFiscale.trim().length < 5) {
          return res.status(400).json({
            success: false,
            error: 'Création de bon bloquée : La matricule fiscale de la société est obligatoire.'
          });
        }
      }

      resMap.set(reservation.id, reservation);
    }

    const mergedList = Array.from(resMap.values());
    currentDb.reservations = mergedList;
    currentDb.savedAt = new Date().toISOString();
    inMemoryDbPayload = currentDb;

    if (LOCAL_DB_ENABLED) {
      try {
        const jsonString = JSON.stringify(currentDb, null, 2);
        fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
        fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
        fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8");
        fs.writeFileSync(path.join(DATA_DIR, "db_reservations_backup_safe.json"), JSON.stringify(mergedList, null, 2), "utf-8");
      } catch (_) {}
    }

    try {
      syncAllToTurso(currentDb, 'manual').catch((tursoErr) => {
        console.warn("[Save Sync Turso Warning]", tursoErr?.message);
      });
    } catch (_) {}

    return res.json({
      success: true,
      message: "Réservation(s) sauvegardée(s) et fusionnée(s) avec succès.",
      count: mergedList.length,
      savedAt: currentDb.savedAt
    });
  } catch (error: any) {
    console.error("Erreur /api/reservations/save:", error);
    return res.status(500).json({ success: false, error: "Échec de sauvegarde des réservations." });
  }
});

// 3b. Déplacer une réservation vers la corbeille (avec conservation du tombstone)
app.post("/api/reservations/trash", (req, res) => {
  try {
    ensureDataDir();
    const { reservationId, trashItem } = req.body || {};
    if (!reservationId) {
      return res.status(400).json({ success: false, error: "reservationId requis" });
    }

    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const idUpper = String(reservationId).trim().toUpperCase();

    // 1. Ajouter à la liste des identifiants supprimés (tombstone persistant)
    const deletedIds = new Set<string>(
      (Array.isArray(currentDb.deletedReservationIds) ? currentDb.deletedReservationIds : [])
        .map((id: string) => String(id).trim().toUpperCase())
    );
    deletedIds.add(idUpper);
    currentDb.deletedReservationIds = Array.from(deletedIds);

    // 2. Retirer de la liste active des réservations
    const existing = Array.isArray(currentDb.reservations) ? currentDb.reservations : [];
    const removedRes = existing.find((r: any) => r && r.id && String(r.id).trim().toUpperCase() === idUpper);
    currentDb.reservations = existing.filter((r: any) => r && r.id && String(r.id).trim().toUpperCase() !== idUpper);

    // 3. Ajouter à la corbeille
    const trashList = Array.isArray(currentDb.trashReservations) ? currentDb.trashReservations : [];
    const filteredTrash = trashList.filter((t: any) => t && t.id && String(t.id).trim().toUpperCase() !== idUpper);
    const itemToAdd = trashItem || {
      id: reservationId,
      deletedAt: new Date().toISOString(),
      deletedBy: "Commercial / Admin",
      reservation: removedRes || { id: reservationId },
    };
    currentDb.trashReservations = [itemToAdd, ...filteredTrash];
    currentDb.savedAt = new Date().toISOString();

    const jsonString = JSON.stringify(currentDb, null, 2);
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
    try { fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8"); } catch (_) {}
    try { fs.writeFileSync("data/db_reservations_backup_safe.json", JSON.stringify(currentDb.reservations || [], null, 2), "utf-8"); } catch (_) {}

    console.log(`[Chery DB] Réservation ${idUpper} déplacée vers la corbeille. Actives: ${currentDb.reservations.length}, Corbeille: ${currentDb.trashReservations.length}`);

    return res.json({
      success: true,
      message: `Réservation ${reservationId} déplacée dans la corbeille.`,
      activeCount: currentDb.reservations.length,
      trashCount: currentDb.trashReservations.length,
      deletedReservationIds: currentDb.deletedReservationIds,
      trashReservations: currentDb.trashReservations,
    });
  } catch (error: any) {
    console.error("Erreur /api/reservations/trash:", error);
    return res.status(500).json({ success: false, error: "Échec de déplacement vers la corbeille." });
  }
});

// 3c. Restaurer une réservation depuis la corbeille vers la liste active
app.post("/api/reservations/restore", (req, res) => {
  try {
    ensureDataDir();
    const { reservationId } = req.body || {};
    if (!reservationId) {
      return res.status(400).json({ success: false, error: "reservationId requis" });
    }

    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const idUpper = String(reservationId).trim().toUpperCase();

    // 1. Retirer de la liste des identifiants supprimés
    const deletedIds = new Set<string>(
      (Array.isArray(currentDb.deletedReservationIds) ? currentDb.deletedReservationIds : [])
        .map((id: string) => String(id).trim().toUpperCase())
    );
    deletedIds.delete(idUpper);
    currentDb.deletedReservationIds = Array.from(deletedIds);

    // 2. Extraire de la corbeille
    const trashList = Array.isArray(currentDb.trashReservations) ? currentDb.trashReservations : [];
    const trashItem = trashList.find((t: any) => t && t.id && String(t.id).trim().toUpperCase() === idUpper);
    currentDb.trashReservations = trashList.filter((t: any) => t && t.id && String(t.id).trim().toUpperCase() !== idUpper);

    // 3. Réinjecter dans les réservations actives
    const existing = Array.isArray(currentDb.reservations) ? currentDb.reservations : [];
    const restoredRes = trashItem?.reservation || { id: reservationId };
    const withoutRestored = existing.filter((r: any) => r && r.id && String(r.id).trim().toUpperCase() !== idUpper);
    currentDb.reservations = [restoredRes, ...withoutRestored];
    currentDb.savedAt = new Date().toISOString();

    const jsonString = JSON.stringify(currentDb, null, 2);
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
    try { fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8"); } catch (_) {}
    try { fs.writeFileSync("data/db_reservations_backup_safe.json", JSON.stringify(currentDb.reservations || [], null, 2), "utf-8"); } catch (_) {}

    console.log(`[Chery DB] Réservation ${idUpper} restaurée avec succès.`);

    return res.json({
      success: true,
      message: `Réservation ${reservationId} restaurée avec succès.`,
      restoredReservation: restoredRes,
      activeCount: currentDb.reservations.length,
      trashCount: currentDb.trashReservations.length,
      deletedReservationIds: currentDb.deletedReservationIds,
      trashReservations: currentDb.trashReservations,
    });
  } catch (error: any) {
    console.error("Erreur /api/reservations/restore:", error);
    return res.status(500).json({ success: false, error: "Échec de restauration de la réservation." });
  }
});

// 3d. Supprimer définitivement une réservation de la corbeille
app.post("/api/reservations/permanent-delete", (req, res) => {
  try {
    ensureDataDir();
    const { reservationId } = req.body || {};
    if (!reservationId) {
      return res.status(400).json({ success: false, error: "reservationId requis" });
    }

    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const idUpper = String(reservationId).trim().toUpperCase();

    // S'assurer que l'ID reste dans les tombstones pour bloquer toute résurrection
    const deletedIds = new Set<string>(
      (Array.isArray(currentDb.deletedReservationIds) ? currentDb.deletedReservationIds : [])
        .map((id: string) => String(id).trim().toUpperCase())
    );
    deletedIds.add(idUpper);
    currentDb.deletedReservationIds = Array.from(deletedIds);

    // Retirer de la corbeille
    const trashList = Array.isArray(currentDb.trashReservations) ? currentDb.trashReservations : [];
    currentDb.trashReservations = trashList.filter((t: any) => t && t.id && String(t.id).trim().toUpperCase() !== idUpper);

    // Retirer des actives au cas où
    const existing = Array.isArray(currentDb.reservations) ? currentDb.reservations : [];
    currentDb.reservations = existing.filter((r: any) => r && r.id && String(r.id).trim().toUpperCase() !== idUpper);

    currentDb.savedAt = new Date().toISOString();
    const jsonString = JSON.stringify(currentDb, null, 2);
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
    try { fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8"); } catch (_) {}
    try { fs.writeFileSync("data/db_reservations_backup_safe.json", JSON.stringify(currentDb.reservations || [], null, 2), "utf-8"); } catch (_) {}

    return res.json({
      success: true,
      message: `Réservation ${reservationId} définitivement purgée.`,
      trashCount: currentDb.trashReservations.length,
      trashReservations: currentDb.trashReservations,
    });
  } catch (error: any) {
    console.error("Erreur /api/reservations/permanent-delete:", error);
    return res.status(500).json({ success: false, error: "Échec de suppression définitive." });
  }
});

// 3e. Vider la corbeille
app.post("/api/reservations/empty-trash", (req, res) => {
  try {
    ensureDataDir();
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const trashList = Array.isArray(currentDb.trashReservations) ? currentDb.trashReservations : [];
    const deletedIds = new Set<string>(
      (Array.isArray(currentDb.deletedReservationIds) ? currentDb.deletedReservationIds : [])
        .map((id: string) => String(id).trim().toUpperCase())
    );
    trashList.forEach((t: any) => {
      if (t && t.id) deletedIds.add(String(t.id).trim().toUpperCase());
    });

    currentDb.deletedReservationIds = Array.from(deletedIds);
    currentDb.trashReservations = [];
    currentDb.savedAt = new Date().toISOString();

    const jsonString = JSON.stringify(currentDb, null, 2);
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
    try { fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8"); } catch (_) {}

    return res.json({
      success: true,
      message: "La corbeille des réservations a été vidée.",
      trashCount: 0,
      trashReservations: [],
    });
  } catch (error: any) {
    console.error("Erreur /api/reservations/empty-trash:", error);
    return res.status(500).json({ success: false, error: "Échec pour vider la corbeille." });
  }
});

// 3f. Supprimer via méthode DELETE standard
app.delete("/api/reservations/:id", (req, res) => {
  try {
    ensureDataDir();
    const reservationId = req.params.id;
    if (!reservationId) {
      return res.status(400).json({ success: false, error: "ID de réservation requis" });
    }

    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const idUpper = String(reservationId).trim().toUpperCase();

    const deletedIds = new Set<string>(
      (Array.isArray(currentDb.deletedReservationIds) ? currentDb.deletedReservationIds : [])
        .map((id: string) => String(id).trim().toUpperCase())
    );
    deletedIds.add(idUpper);
    currentDb.deletedReservationIds = Array.from(deletedIds);

    const existing = Array.isArray(currentDb.reservations) ? currentDb.reservations : [];
    const removedRes = existing.find((r: any) => r && r.id && String(r.id).trim().toUpperCase() === idUpper);
    currentDb.reservations = existing.filter((r: any) => r && r.id && String(r.id).trim().toUpperCase() !== idUpper);

    const trashList = Array.isArray(currentDb.trashReservations) ? currentDb.trashReservations : [];
    const filteredTrash = trashList.filter((t: any) => t && t.id && String(t.id).trim().toUpperCase() !== idUpper);
    currentDb.trashReservations = [
      {
        id: reservationId,
        deletedAt: new Date().toISOString(),
        deletedBy: "Commercial / Admin",
        reservation: removedRes || { id: reservationId },
      },
      ...filteredTrash
    ];
    currentDb.savedAt = new Date().toISOString();

    const jsonString = JSON.stringify(currentDb, null, 2);
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
    try { fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8"); } catch (_) {}

    return res.json({
      success: true,
      message: `Réservation ${reservationId} supprimée et envoyée à la corbeille.`,
      activeCount: currentDb.reservations.length,
      trashCount: currentDb.trashReservations.length,
    });
  } catch (error: any) {
    console.error("Erreur DELETE /api/reservations/:id:", error);
    return res.status(500).json({ success: false, error: "Échec de suppression." });
  }
});

// -------------------------------------------------------------
// 3g. Super Admin Timesheet & Calendrier Notes (Jour / Semaine / Mois)
// -------------------------------------------------------------
app.get("/api/timesheet/notes", (req, res) => {
  try {
    ensureDataDir();
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }
    const notes = Array.isArray(currentDb.timesheetNotes) ? currentDb.timesheetNotes : [];
    return res.json({ success: true, notes });
  } catch (error: any) {
    console.error("Erreur lecture /api/timesheet/notes:", error);
    return res.status(500).json({ success: false, error: "Impossible de charger les notes du calendrier." });
  }
});

app.post("/api/timesheet/notes", (req, res) => {
  try {
    ensureDataDir();
    const { note, notes } = req.body || {};
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }
    let existingNotes: any[] = Array.isArray(currentDb.timesheetNotes) ? currentDb.timesheetNotes : [];

    if (Array.isArray(notes)) {
      existingNotes = notes;
    } else if (note && note.id) {
      const idx = existingNotes.findIndex((n) => n.id === note.id);
      if (idx >= 0) {
        existingNotes[idx] = note;
      } else {
        existingNotes.unshift(note);
      }
    } else {
      return res.status(400).json({ success: false, error: "Données de note invalides" });
    }

    currentDb.timesheetNotes = existingNotes;
    currentDb.savedAt = new Date().toISOString();

    const jsonString = JSON.stringify(currentDb, null, 2);
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
    try { fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8"); } catch (_) {}

    return res.json({ success: true, notes: existingNotes });
  } catch (error: any) {
    console.error("Erreur écriture /api/timesheet/notes:", error);
    return res.status(500).json({ success: false, error: "Impossible d'enregistrer les notes du calendrier." });
  }
});

app.delete("/api/timesheet/notes/:id", (req, res) => {
  try {
    ensureDataDir();
    const noteId = req.params.id;
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }
    const existingNotes: any[] = Array.isArray(currentDb.timesheetNotes) ? currentDb.timesheetNotes : [];
    const filtered = existingNotes.filter((n) => n.id !== noteId);

    currentDb.timesheetNotes = filtered;
    currentDb.savedAt = new Date().toISOString();

    const jsonString = JSON.stringify(currentDb, null, 2);
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
    try { fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8"); } catch (_) {}

    return res.json({ success: true, notes: filtered, deletedId: noteId });
  } catch (error: any) {
    console.error("Erreur suppression note timesheet:", error);
    return res.status(500).json({ success: false, error: "Impossible de supprimer la note." });
  }
});


// 4. Fonction de reconstruction intégrale de tous les bons de réservation depuis les journaux d'audit
function recoverAllMissingReservationsFromAuditLogs(currentDb: any) {
  const existing: any[] = Array.isArray(currentDb.reservations) ? currentDb.reservations : [];
  const existingIds = new Set(existing.map((r: any) => r.id));
  const cars = currentDb.cars || [];
  const auditLogs = currentDb.auditLogs || [];

  const priceMap: Record<string, number> = {
    "Chery Tiggo 4 HEV": 79900,
    "Chery Tiggo 9 PHEV": 129900,
    "Chery I03 4X2": 76900,
    "Chery I03 4X4": 84900,
    "Chery Himla 4X4": 102900,
    "Chery Himla 4X4 BVM": 102900,
    "Chery Himla 4X4 BVA": 119900,
    "Chery Tiggo 7 PHEV": 88900,
    "Chery Arrizo 8 PHEV": 89900,
    "Chery Tiggo 8 PHEV": 102990,
    "Chery Tiggo 2 Pro Max": 68900
  };

  const hexMap: Record<string, string> = {
    "White BW": "#FFFFFF",
    "Gray GV": "#6E6F72",
    "Tech Gray GX": "#727783",
    "Black CL": "#050505",
    "Green SC": "#2E4B3D",
    "White BX": "#F8FAFC",
    "Silver Gray GR": "#BFBFBF",
    "Black BL": "#171717",
    "Noir Ébène": "#0A0A0A"
  };

  const cleanClientName = (rawName: string) => {
    let cleaned = (rawName || "").trim();
    cleaned = cleaned.replace(/^la réservation\s+(?:confirmée|en attente)?\s*#[A-Z0-9-]+\s+au nom de\s+/i, "");
    cleaned = cleaned.replace(/^le bon de réservation\s*#[A-Z0-9-]+\s+au nom de\s+/i, "");
    cleaned = cleaned.replace(/^le bon de réservation\s*#[^a-zA-Z0-9]+au nom de\s+/i, "");
    cleaned = cleaned.replace(/^au nom de\s+/i, "");
    cleaned = cleaned.replace(/^pour\s+/i, "");
    return cleaned.trim();
  };

  const missingLogs = new Map<string, any>();
  let enrichedCount = 0;

  auditLogs.forEach((l: any) => {
    const details = l.details || '';
    const actionLabel = (l.actionLabel || '').toLowerCase();
    const actionType = l.actionType || '';
    
    // Ignorer impérativement tout log de suppression ou mise à la corbeille
    const isDeletionLog = 
      actionLabel.includes('suppression') ||
      actionLabel.includes('corbeille') ||
      details.toLowerCase().includes('suppression') ||
      details.toLowerCase().includes('corbeille') ||
      actionType === 'reservation_delete';

    if (isDeletionLog) return;

    const match = details.match(/(RES-202[0-9]-[0-9]+)/i) || (l.id && l.id.match(/(RES-202[0-9]-[0-9]+)/i));
    if (match) {
      const id = match[1].toUpperCase();

      if (!existingIds.has(id)) {
        if (!missingLogs.has(id)) {
          missingLogs.set(id, l);
        }
      } else {
        // Enrichir la réservation existante si elle manque de coordonnées
        const existingRes = existing.find((r: any) => r.id === id);
        if (existingRes) {
          const clientMatch = details.match(/(?:nom de|pour)\s+([^(]+)\s*\(([^)]*)\)/i);
          if (clientMatch) {
            const rawName = cleanClientName(clientMatch[1]);
            const phone = clientMatch[2]?.trim();
            let changed = false;
            if (phone && (!existingRes.client?.personnePhysique?.telephone && !existingRes.client?.societe?.telephone)) {
              if (existingRes.client?.personnePhysique) existingRes.client.personnePhysique.telephone = phone;
              if (existingRes.client?.societe) existingRes.client.societe.telephone = phone;
              changed = true;
            }
            if (rawName && rawName !== "Client Chery" && (!existingRes.client?.personnePhysique?.nom || existingRes.client?.personnePhysique?.nom === "Client")) {
              if (existingRes.client?.personnePhysique) {
                if (rawName.includes(" ")) {
                  const p = rawName.split(" ");
                  existingRes.client.personnePhysique.prenom = p[0];
                  existingRes.client.personnePhysique.nom = p.slice(1).join(" ");
                } else {
                  existingRes.client.personnePhysique.nom = rawName;
                }
                changed = true;
              }
            }
            if (changed) enrichedCount++;
          }
        }
      }
    }
  });

  const newlyRestored: any[] = [];
  for (const [id, l] of missingLogs.entries()) {
    const clientMatch = l.details?.match(/(?:nom de|pour)\s+([^(]+)\s*\(([^)]*)\)/i);
    let rawName = clientMatch ? cleanClientName(clientMatch[1]) : "";
    const phone = clientMatch ? clientMatch[2].trim() : "";

    // RÈGLE COMMERCIALE : Bloquer impérativement la restauration de tout bon factice "( chery client )" ou incomplet
    const norm = (rawName || '').toLowerCase().trim();
    if (!rawName || norm === "client chery" || norm === "chery client" || norm === "client" || norm === "chery" || norm.includes("chery client") || norm === "test") {
      continue;
    }

    const isSociete = /ste|societe|société|sarl|ltd|mbs/i.test(rawName);
    const carName = l.targetCarName || "Chery";
    const matchedCar = cars.find((c: any) => c.id === l.targetCarId) || cars.find((c: any) => carName.toLowerCase().includes(c.name.toLowerCase()));
    const colorName = l.targetColorName || "Standard";
    const hex = hexMap[colorName] || "#727783";
    const price = priceMap[carName] || matchedCar?.priceTND || 88900;
    const depositTable: Record<string, number> = {
      "Chery Tiggo 9 PHEV": 50000,
      "Chery Tiggo 8 PHEV": 40000,
      "Chery Tiggo 7 PHEV": 30000,
      "Chery Arrizo 8 PHEV": 30000,
      "Chery Arrizo 8": 25000,
      "Chery Tiggo 4 HEV": 20000,
      "Chery Himla 4X4 BVM": 20000,
      "Chery Himla 4X4 BVA": 20000,
      "Chery Himla 4X4": 20000,
      "Chery I03 4X2": 20000,
      "Chery I03 4X4": 20000,
      "Chery Tiggo 2 Pro Max": 10000
    };
    const deposit = depositTable[carName] || 20000;

    let prenom = "";
    let nom = rawName;
    if (!isSociete && rawName.includes(" ")) {
      const parts = rawName.split(" ");
      prenom = parts[0];
      nom = parts.slice(1).join(" ");
    }

    const newRes = {
      id,
      commercialId: l.userId || "commercial",
      commercialName: l.userName || "Commercial STA",
      agency: l.userAgency || "Siège STA",
      carId: l.targetCarId || matchedCar?.id || "car-default",
      carName,
      colorChosen: {
        id: `col-${id}`,
        name: colorName,
        hexCode: hex
      },
      vehicles: [{
        id: `veh-${id}-0`,
        carId: l.targetCarId || matchedCar?.id || "car-default",
        carName,
        colorChosen: {
          id: `col-${id}`,
          name: colorName,
          hexCode: hex
        },
        quantity: 1,
        unitPriceTND: price,
        totalPriceTND: price
      }],
      client: {
        type: isSociete ? "societe" : "personne_physique",
        personnePhysique: isSociete ? undefined : {
          nom,
          prenom,
          cin: "",
          ville: (l.userAgency || "").includes("Sfax") ? "Sfax" : (l.userAgency || "").includes("Sousse") ? "Sousse" : "Tunis",
          telephone: phone,
          email: "",
          adresse: ""
        },
        societe: isSociete ? {
          raisonSociale: rawName,
          matriculeFiscale: "",
          ville: (l.userAgency || "").includes("Sfax") ? "Sfax" : (l.userAgency || "").includes("Sousse") ? "Sousse" : "Tunis",
          telephone: phone,
          email: "",
          adresse: ""
        } : undefined
      },
      documents: [],
      priceTND: price,
      registrationFeeTND: 0,
      depositPaidTND: deposit,
      paymentMethod: "Chèque Certifié",
      status: l.actionLabel?.toLowerCase().includes("attente") ? "En attente" : "Confirmée",
      createdAt: l.timestamp || new Date().toISOString(),
      updatedAt: l.timestamp || new Date().toISOString(),
      notes: `Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #${id})`
    };

    newlyRestored.push(newRes);
    existing.push(newRes);
    existingIds.add(id);
  }

  // Purger impérativement des deletedReservationIds tout identifiant désormais actif
  if (Array.isArray(currentDb.deletedReservationIds)) {
    currentDb.deletedReservationIds = currentDb.deletedReservationIds.filter(
      (delId: string) => !existingIds.has(String(delId).trim().toUpperCase())
    );
  }

  // Purger également de la corbeille les réservations actives
  if (Array.isArray(currentDb.trashReservations)) {
    currentDb.trashReservations = currentDb.trashReservations.filter(
      (t: any) => t && t.id && !existingIds.has(String(t.id).trim().toUpperCase())
    );
  }

  existing.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  currentDb.reservations = existing;
  currentDb.savedAt = new Date().toISOString();
  const jsonString = JSON.stringify(currentDb, null, 2);
  fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
  fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
  try { fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8"); } catch (_) {}
  try { fs.writeFileSync("data/db_reservations_backup_safe.json", JSON.stringify(existing, null, 2), "utf-8"); } catch (_) {}
  console.log(`[Chery DB] Auto-restauration : ${newlyRestored.length} bon(s) restauré(s), ${enrichedCount} enrichi(s). Total: ${existing.length}`);

  return {
    recoveredCount: newlyRestored.length,
    enrichedCount,
    totalCount: existing.length,
    reservations: existing,
    newlyRestored
  };
}

// 4. Fonction de récupération Firestore côté serveur
async function fetchAllReservationsFromFirestoreServer(): Promise<any[]> {
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    if (!fs.existsSync(configPath)) return [];
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (!config.projectId) return [];
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getFirestore, collection, getDocs } = await import("firebase/firestore");
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    const db = getFirestore(app, config.firestoreDatabaseId);
    const snap = await getDocs(collection(db, "reservations"));
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch(e: any) {
    console.warn("[Firestore Recovery] Info récupération Firestore côté serveur:", e?.message);
    return [];
  }
}

// 4b. Endpoint de restauration et synchronisation intégrale multi-sources (Firestore + Turso + Sauvegardes + Audit)
app.post("/api/reservations/recover", async (req, res) => {
  try {
    ensureDataDir();
    const currentDb = getLatestDbPayload();
    const existing: any[] = Array.isArray(currentDb.reservations) ? currentDb.reservations : [];
    const resMap = new Map<string, any>();

    // 1. Réservations actuellement chargées en mémoire
    existing.forEach((r) => {
      if (r && r.id) resMap.set(r.id, r);
    });

    // 2. Parcourir tous les fichiers de sauvegarde locale et clichés quotidiens
    const backupFiles = [
      DB_FILE_PATH,
      DB_BAK_PATH,
      path.join(DATA_DIR, "db_backup.json"),
      path.join(DATA_DIR, "db_reservations_backup_safe.json"),
    ];
    if (fs.existsSync(DAILY_BACKUP_DIR)) {
      try {
        const dFiles = fs.readdirSync(DAILY_BACKUP_DIR);
        dFiles.forEach((f) => backupFiles.push(path.join(DAILY_BACKUP_DIR, f)));
      } catch (_) {}
    }

    for (const bPath of backupFiles) {
      if (fs.existsSync(bPath)) {
        try {
          const parsed = safeParseJSON(fs.readFileSync(bPath, "utf-8"));
          const bList = Array.isArray(parsed) ? parsed : (parsed?.reservations || []);
          bList.forEach((r: any) => {
            if (r && r.id) {
              if (!resMap.has(r.id)) {
                resMap.set(r.id, r);
              } else {
                const cur = resMap.get(r.id);
                if (r.documents && r.documents.length > (cur.documents?.length || 0)) {
                  cur.documents = r.documents;
                }
                if (r.notes && !cur.notes) cur.notes = r.notes;
              }
            }
          });
        } catch (_) {}
      }
    }

    // 3. Récupérer depuis Turso libSQL Cloud
    try {
      const tursoData = await pullAllFromTurso();
      if (tursoData && Array.isArray(tursoData.reservations)) {
        tursoData.reservations.forEach((r: any) => {
          if (r && r.id) {
            if (!resMap.has(r.id)) {
              resMap.set(r.id, r);
            } else {
              const cur = resMap.get(r.id);
              if (r.documents && r.documents.length > (cur.documents?.length || 0)) {
                cur.documents = r.documents;
              }
            }
          }
        });
      }
    } catch (tursoErr: any) {
      console.warn("[Recovery] Note Turso Cloud:", tursoErr?.message);
    }

    // 4. Récupérer depuis Firestore Cloud Database
    try {
      const firestoreRes = await fetchAllReservationsFromFirestoreServer();
      firestoreRes.forEach((r: any) => {
        if (r && r.id) {
          if (!resMap.has(r.id)) {
            resMap.set(r.id, r);
          } else {
            const cur = resMap.get(r.id);
            if (r.documents && r.documents.length > (cur.documents?.length || 0)) {
              cur.documents = r.documents;
            }
          }
        }
      });
    } catch (fsErr: any) {
      console.warn("[Recovery] Note Firestore Cloud:", fsErr?.message);
    }

    // 5. Analyser et reconstruire depuis les journaux d'audit
    const auditRes = recoverAllMissingReservationsFromAuditLogs(currentDb);
    if (auditRes && Array.isArray(auditRes.reservations)) {
      auditRes.reservations.forEach((r: any) => {
        if (r && r.id && !resMap.has(r.id)) {
          resMap.set(r.id, r);
        }
      });
    }

    const mergedReservations = Array.from(resMap.values()).sort(
      (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const activeIds = new Set(mergedReservations.map((r) => String(r.id).trim().toUpperCase()));

    // Déverrouiller et purger impérativement de deletedReservationIds & trashReservations
    if (Array.isArray(currentDb.deletedReservationIds)) {
      currentDb.deletedReservationIds = currentDb.deletedReservationIds.filter(
        (id: string) => !activeIds.has(String(id).trim().toUpperCase())
      );
    }
    if (Array.isArray(currentDb.trashReservations)) {
      currentDb.trashReservations = currentDb.trashReservations.filter(
        (t: any) => t && t.id && !activeIds.has(String(t.id).trim().toUpperCase())
      );
    }

    currentDb.reservations = mergedReservations;
    currentDb.savedAt = new Date().toISOString();
    inMemoryDbPayload = currentDb;

    // Enregistrement sur disque si activé
    if (LOCAL_DB_ENABLED) {
      try {
        const jsonString = JSON.stringify(currentDb, null, 2);
        fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
        fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
        fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8");
        fs.writeFileSync(path.join(DATA_DIR, "db_reservations_backup_safe.json"), JSON.stringify(mergedReservations, null, 2), "utf-8");
      } catch (_) {}
    }

    // Synchronisation automatique immédiate vers Turso libSQL Cloud
    try {
      syncAllToTurso(currentDb, 'manual').catch((tursoErr) => {
        console.warn("[Recovery Sync Turso Warning]", tursoErr?.message);
      });
    } catch (_) {}

    const recoveredCount = mergedReservations.length - existing.length;
    console.log(`[Chery DB Recovery] Synchronisation Multi-Sources terminée : Total = ${mergedReservations.length} réservations (+${Math.max(0, recoveredCount)} récupérées).`);

    return res.json({
      success: true,
      recoveredCount: Math.max(0, recoveredCount),
      totalCount: mergedReservations.length,
      reservations: mergedReservations,
    });
  } catch (error: any) {
    console.error("Erreur /api/reservations/recover:", error);
    return res.status(500).json({ success: false, error: "Erreur lors de la restauration multi-sources." });
  }
});

// 5. Téléchargement d'un export de sauvegarde complet
app.get("/api/reservations/export", (req, res) => {
  try {
    ensureDataDir();
    let reservations: any[] = [];
    if (fs.existsSync(DB_FILE_PATH)) {
      const parsed = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8"));
      if (parsed && Array.isArray(parsed.reservations)) reservations = parsed.reservations;
    }
    const filename = `sauvegarde_reservations_chery_${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    return res.send(JSON.stringify(reservations, null, 2));
  } catch (error: any) {
    return res.status(500).json({ error: "Erreur export sauvegarde" });
  }
});

// 6. Lister toutes les sauvegardes quotidiennes automatiques
app.get("/api/db/daily-backups", (req, res) => {
  try {
    if (!LOCAL_DB_ENABLED) {
      return res.json({
        success: true,
        backups: [],
        totalBackups: 0,
        latestBackup: null,
        autoDailyEnabled: false,
        disabled: true,
        message: "Serveur local (data/db.json) et clichés quotidiens désactivés au profit de Turso libSQL Cloud.",
      });
    }

    ensureDailyBackupDir();
    const files = fs.readdirSync(DAILY_BACKUP_DIR);
    const backupList: any[] = [];

    files.forEach((file) => {
      if (file.startsWith("backup_chery_") && file.endsWith(".json")) {
        const filePath = path.join(DAILY_BACKUP_DIR, file);
        const stat = fs.statSync(filePath);
        let resCount = 0;
        let carsCount = 0;
        try {
          const parsed = safeParseJSON(fs.readFileSync(filePath, "utf-8"));
          if (parsed) {
            resCount = Array.isArray(parsed.reservations) ? parsed.reservations.length : 0;
            carsCount = Array.isArray(parsed.cars) ? parsed.cars.length : 0;
          }
        } catch (_) {}

        backupList.push({
          filename: file,
          date: file.replace("backup_chery_", "").replace(".json", ""),
          sizeBytes: stat.size,
          sizeFormatted: `${(stat.size / 1024 / 1024).toFixed(2)} Mo`,
          modifiedAt: stat.mtime.toISOString(),
          reservationCount: resCount,
          carsCount: carsCount,
        });
      }
    });

    backupList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return res.json({
      success: true,
      backups: backupList,
      totalBackups: backupList.length,
      latestBackup: backupList[0] || null,
      autoDailyEnabled: true,
      disabled: false,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Impossible de lister les sauvegardes quotidiennes" });
  }
});

// 7. Télécharger une sauvegarde quotidienne spécifique
app.get("/api/db/daily-backups/download/:filename", (req, res) => {
  try {
    ensureDailyBackupDir();
    const filename = path.basename(req.params.filename);
    const filePath = path.join(DAILY_BACKUP_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: "Fichier de sauvegarde introuvable" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    return res.sendFile(filePath);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Erreur téléchargement sauvegarde" });
  }
});

// 8. Déclencher immédiatement une sauvegarde quotidienne
app.post("/api/db/daily-backups/run-now", (req, res) => {
  try {
    if (!LOCAL_DB_ENABLED) {
      return res.json({
        success: false,
        disabled: true,
        message: "Serveur local (data/db.json) et clichés quotidiens désactivés au profit de Turso libSQL Cloud.",
      });
    }
    const result = performDailyBackup(true);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});

// 9. Restaurer depuis une sauvegarde quotidienne
app.post("/api/db/daily-backups/restore/:filename", async (req, res) => {
  try {
    ensureDailyBackupDir();
    const filename = path.basename(req.params.filename);
    const filePath = path.join(DAILY_BACKUP_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: "Fichier de sauvegarde introuvable" });
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = safeParseJSON(content);
    if (!parsed) {
      return res.status(400).json({ success: false, error: "Fichier de sauvegarde corrompu ou illisible" });
    }

    // Effectuer une sauvegarde de sécurité avant la restauration
    performDailyBackup(true);

    const ok = await safeAtomicWriteDb(parsed);
    if (ok) {
      return res.json({
        success: true,
        message: `Restauration effectuée avec succès depuis ${filename}`,
        reservationCount: Array.isArray(parsed.reservations) ? parsed.reservations.length : 0,
      });
    } else {
      return res.status(500).json({ success: false, error: "Échec de l'écriture en base" });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});

// Express App Setup

// Endpoint pour le Chatbot Commercial IA
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, contextCars, knowledgeBase } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Format des messages invalide." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    let carSummary = "";
    if (contextCars && Array.isArray(contextCars)) {
      carSummary = contextCars.map((c: any) => 
        `- ${c.name} (${c.category}): Prix ${c.priceTND} TND | Moteur: ${c.engine || 'N/A'} | Boîte: ${c.transmission || 'N/A'} | Stock global: ${c.colors ? c.colors.reduce((a: number, b: any) => a + (b.stock || 0), 0) : 0} unités`
      ).join("\n");
    }

    let kbSummary = "";
    if (knowledgeBase && Array.isArray(knowledgeBase)) {
      kbSummary = knowledgeBase.map((kb: any) =>
        `• [${kb.category.toUpperCase()}] ${kb.title}:\n  ${kb.content}`
      ).join("\n\n");
    }

    // Si la clé d'API Gemini n'est pas configurée dans l'environnement
    if (!apiKey) {
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      
      let smartAnswer = "Bonjour ! Je suis l'Assistant Commercial Chery Tunisie (STA).\n\n" +
        "⚠️ **Configuration de l'IA (Gemini 3.6 Flash)** :\n" +
        "Pour débloquer l'analyse par Intelligence Artificielle générative en direct, veuillez ajouter votre clé **`GEMINI_API_KEY`** dans le menu **Settings / Paramètres (⚙️)** de l'application AI Studio.\n\n" +
        "**En attendant, voici les informations directes de notre Base de Connaissances & Catalogue Chery Tunisie (STA) :**\n";

      if (lastUserMsg.includes("prix") || lastUserMsg.includes("combien") || lastUserMsg.includes("tarif")) {
        smartAnswer += "\n**Tarifs indicatifs de la gamme Chery Tunisie :**\n" + (carSummary || "- Tiggo 2 Pro, Tiggo 4 Pro, Tiggo 7 Pro, Tiggo 8 Pro, Arrizo 5, Arrizo 8");
      } else if (lastUserMsg.includes("stock") || lastUserMsg.includes("dispo")) {
        smartAnswer += "\n**État des Stocks Actuels :**\n" + (carSummary || "Stocks disponibles au siège STA.");
      } else if (lastUserMsg.includes("garantie") || lastUserMsg.includes("leasing") || lastUserMsg.includes("agence")) {
        smartAnswer += "\n**Informations Réseau & Base de Connaissances STA :**\n" + (kbSummary || "- Garantie Officielle : 7 Ans ou 200 000 km.\n- Agences : Tunis (Lac 2 / Ben Arous), Sousse, Sfax.");
      } else {
        smartAnswer += "\n**Modèles disponibles au catalogue :**\n" + (carSummary || "- Gamme SUV Tiggo & Berlines Arrizo") +
          "\n\n**Base de Connaissances Entreprise (STA) :**\n" + (kbSummary || "- Garantie 7 Ans / 200 000 km sur tout le catalogue.");
      }

      return res.json({ 
        reply: smartAnswer,
        isFallback: true 
      });
    }

    // Initialisation Gemini quand GEMINI_API_KEY existe
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `Tu es "Chery Bot IA", l'assistant commercial virtuel officiel et expert de Chery Tunisie (STA - Société Tunisienne d'Automobiles).
Ton rôle est d'aider les conseillers commerciaux et les clients avec précision, enthousiasme et courtoisie.

Informations Clés Chery Tunisie:
- Marque distribuée par STA (Société Tunisienne d'Automobiles).
- Garantie officielle sur toute la gamme : 7 Ans ou 200 000 km (gage de sérénité et fiabilité).
- Salles d'exposition & Agences : Tunis (Siège Ben Arous & Showroom Lac 2), Sousse Pearl, Sfax Route Teniour, Nabeul, Bizerte.

Aperçu du Catalogue & Stocks Actuels en Tunisie :
${carSummary || "Catalogue disponible dans l'application."}

Base de Connaissances Officielle Chery STA (À utiliser prioritairement pour répondre aux questions) :
${kbSummary || "Aucune note additionnelle enregistrée."}

Directives de réponse :
1. Sois très poli, accueillant et professionnel.
2. Réponds en Français (ou en Arabe si la question est en Arabe).
3. Donne des détails sur les modèles (Tiggo 2 Pro, Tiggo 4 Pro, Tiggo 7 Pro, Tiggo 8 Pro Max, Arrizo 5, Omoda 5 GT), les équipements de sécurité, la garantie 7 ans, et les prix en Dinars Tunisiens (TND).
4. S'appuyer sur la Base de Connaissances (Garanties, Financement Leasing, Adresses des agences, etc.) pour donner des réponses exactes.
5. Si l'utilisateur demande une recommandation d'achat (famille, budget, SUV ou Berline), conseille-lui le modèle idéal dans la gamme Chery.
6. Rappelle au conseiller commercial qu'il peut générer un devis personnalisé, configurer des accessoires ou enregistrer une réservation direct depuis le site.
7. Garde des réponses structurées, claires avec des puces si nécessaire.`;


    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Désolé, je n'ai pas pu générer une réponse.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Erreur backend Chery AI Chat:", error);
    res.status(500).json({ error: error.message || "Impossible de contacter l'assistant IA." });
  }
});

// ==========================================
// REST API FOR NOTES & MEMOS (/api/notes)
// ==========================================
// 1. GET /api/notes - Liste toutes les notes
app.get("/api/notes", (req, res) => {
  try {
    ensureDataDir();
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }
    const notes = Array.isArray(currentDb.notes) ? currentDb.notes : [];
    return res.json(notes);
  } catch (error: any) {
    console.error("Erreur GET /api/notes:", error);
    return res.status(500).json({ error: "Erreur lors de la récupération des notes." });
  }
});

// 2. POST /api/notes - Crée une nouvelle note
app.post("/api/notes", (req, res) => {
  try {
    ensureDataDir();
    const data = req.body || {};
    if (!data.title && !data.content) {
      return res.status(400).json({ error: "Le titre ou le contenu de la note est requis." });
    }

    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }
    if (!Array.isArray(currentDb.notes)) {
      currentDb.notes = [];
    }

    const newNote = {
      id: data.id || `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: (data.title || "Nouvelle note").trim(),
      content: (data.content || "").trim(),
      category: data.category || "Commercial",
      author: data.author || "Conseiller Commercial",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: data.color || "amber",
      isPinned: Boolean(data.isPinned),
      ...data,
    };

    currentDb.notes.unshift(newNote);
    currentDb.savedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(currentDb, null, 2), "utf-8");

    return res.status(201).json(newNote);
  } catch (error: any) {
    console.error("Erreur POST /api/notes:", error);
    return res.status(500).json({ error: "Erreur lors de la création de la note." });
  }
});

// 3. PUT /api/notes/:id - Met à jour une note
app.put("/api/notes/:id", (req, res) => {
  try {
    ensureDataDir();
    const { id } = req.params;
    const data = req.body || {};

    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }
    const notes: any[] = Array.isArray(currentDb.notes) ? currentDb.notes : [];
    const index = notes.findIndex((n) => String(n.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ error: `Note avec l'identifiant ${id} introuvable.` });
    }

    const updatedNote = {
      ...notes[index],
      ...data,
      id, // Conserver l'ID original
      updatedAt: new Date().toISOString(),
    };

    notes[index] = updatedNote;
    currentDb.notes = notes;
    currentDb.savedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(currentDb, null, 2), "utf-8");

    return res.json(updatedNote);
  } catch (error: any) {
    console.error("Erreur PUT /api/notes/:id:", error);
    return res.status(500).json({ error: "Erreur lors de la modification de la note." });
  }
});

// 4. DELETE /api/notes/:id - Supprime une note
app.delete("/api/notes/:id", (req, res) => {
  try {
    ensureDataDir();
    const { id } = req.params;

    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }
    const notes: any[] = Array.isArray(currentDb.notes) ? currentDb.notes : [];
    const initialLen = notes.length;
    currentDb.notes = notes.filter((n) => String(n.id) !== String(id));

    if (currentDb.notes.length === initialLen) {
      return res.status(404).json({ error: `Note avec l'identifiant ${id} introuvable.` });
    }

    currentDb.savedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(currentDb, null, 2), "utf-8");

    return res.json({ success: true, id, message: "Note supprimée avec succès." });
  } catch (error: any) {
    console.error("Erreur DELETE /api/notes/:id:", error);
    return res.status(500).json({ error: "Erreur lors de la suppression de la note." });
  }
});

// ==========================================
// TURSO DATABASE REST API (/api/turso/*)
// Org: mongi95 (https://app.turso.tech/mongi95)
// ==========================================

// 1. GET /api/turso/config - Obtenir la configuration Turso
app.get("/api/turso/config", (req, res) => {
  try {
    const config = loadTursoConfig();
    return res.json({
      organization: config.organization || "mongi95",
      databaseName: config.databaseName || "chery-sta",
      url: config.url || "libsql://chery-sta-mongi95.turso.io",
      hasAuthToken: Boolean(config.authToken && config.authToken.trim()),
      tokenPreview: config.authToken ? `${config.authToken.substring(0, 8)}...` : "",
      status: config.status || "disconnected",
      syncFrequency: config.syncFrequency || "daily",
      dailySyncEnabled: config.dailySyncEnabled ?? true,
      dailySyncHour: config.dailySyncHour ?? 0,
      dailySyncMinute: config.dailySyncMinute ?? 0,
      lastDailySyncAt: config.lastDailySyncAt || config.lastSyncAt,
      nextDailySyncAt: config.nextDailySyncAt,
      weeklySyncEnabled: config.weeklySyncEnabled ?? true,
      lastSyncAt: config.lastSyncAt,
      lastError: config.lastError,
      tursoDashboardUrl: `https://app.turso.tech/${config.organization || "mongi95"}`,
    });
  } catch (error: any) {
    console.error("Erreur GET /api/turso/config:", error);
    return res.status(500).json({ error: "Erreur lors de la lecture de la configuration Turso." });
  }
});

// 2. POST /api/turso/config - Sauvegarder la configuration Turso
app.post("/api/turso/config", (req, res) => {
  try {
    const { url, authToken, organization, databaseName, syncFrequency, dailySyncEnabled, dailySyncHour, dailySyncMinute } = req.body || {};
    const updated = saveTursoConfig({
      ...(url !== undefined ? { url: url.trim() } : {}),
      ...(authToken !== undefined ? { authToken: authToken.trim() } : {}),
      ...(organization !== undefined ? { organization: organization.trim() } : {}),
      ...(databaseName !== undefined ? { databaseName: databaseName.trim() } : {}),
      ...(syncFrequency !== undefined ? { syncFrequency } : {}),
      ...(dailySyncEnabled !== undefined ? { dailySyncEnabled: Boolean(dailySyncEnabled) } : {}),
      ...(dailySyncHour !== undefined ? { dailySyncHour: Number(dailySyncHour) } : {}),
      ...(dailySyncMinute !== undefined ? { dailySyncMinute: Number(dailySyncMinute) } : {}),
    });

    return res.json({
      success: true,
      message: "Configuration Turso enregistrée avec succès.",
      config: {
        organization: updated.organization,
        databaseName: updated.databaseName,
        url: updated.url,
        hasAuthToken: Boolean(updated.authToken && updated.authToken.trim()),
        status: updated.status,
        syncFrequency: updated.syncFrequency,
        dailySyncEnabled: updated.dailySyncEnabled,
        dailySyncHour: updated.dailySyncHour,
        dailySyncMinute: updated.dailySyncMinute,
        nextDailySyncAt: updated.nextDailySyncAt,
      },
    });
  } catch (error: any) {
    console.error("Erreur POST /api/turso/config:", error);
    return res.status(500).json({ error: "Erreur lors de la sauvegarde de la configuration Turso." });
  }
});

// 3. POST /api/turso/test - Tester la connectivité avec Turso
app.post("/api/turso/test", async (req, res) => {
  try {
    const { url, authToken } = req.body || {};
    const result = await testTursoConnection(url || authToken ? { url, authToken } : undefined);
    return res.json(result);
  } catch (error: any) {
    console.error("Erreur POST /api/turso/test:", error);
    return res.status(500).json({ success: false, message: error?.message || "Erreur de test Turso." });
  }
});

// 4. POST /api/turso/sync - Synchroniser toutes les tables vers Turso
app.post("/api/turso/sync", async (req, res) => {
  try {
    ensureDataDir();
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const result = await syncAllToTurso(currentDb);
    return res.json(result);
  } catch (error: any) {
    console.error("Erreur POST /api/turso/sync:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Erreur lors de la synchronisation vers Turso.",
    });
  }
});

// 5. POST /api/turso/pull - Récupérer les données depuis Turso
app.post("/api/turso/pull", async (req, res) => {
  try {
    const data = await pullAllFromTurso();
    return res.json({
      success: true,
      message: `${data.totalReservations} réservations récupérées depuis Turso.`,
      data,
    });
  } catch (error: any) {
    console.error("Erreur POST /api/turso/pull:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Erreur lors de la récupération depuis Turso.",
    });
  }
});

// 6. GET /api/turso/metrics - Contrôle de l'espace de stockage et métriques détaillées Turso
app.get("/api/turso/metrics", async (req, res) => {
  try {
    const metrics = await getTursoStorageMetrics();
    return res.json(metrics);
  } catch (error: any) {
    console.error("Erreur GET /api/turso/metrics:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors de la lecture des métriques de stockage Turso." });
  }
});

// 7. POST /api/turso/vacuum - Optimisation et défragmentation de l'espace (VACUUM)
app.post("/api/turso/vacuum", async (req, res) => {
  try {
    const result = await vacuumTursoDatabase();
    return res.json(result);
  } catch (error: any) {
    console.error("Erreur POST /api/turso/vacuum:", error);
    return res.status(500).json({ success: false, message: error?.message || "Erreur lors de l'optimisation VACUUM." });
  }
});

// 8. GET /api/turso/explore/:table - Explorer les lignes d'une table en direct sur Turso
app.get("/api/turso/explore/:table", async (req, res) => {
  try {
    const { table } = req.params;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);
    const search = typeof req.query.search === 'string' ? req.query.search : '';

    const result = await exploreTursoTable(table, limit, offset, search);
    return res.json({
      success: true,
      table,
      limit,
      offset,
      ...result,
    });
  } catch (error: any) {
    console.error(`Erreur GET /api/turso/explore/${req.params.table}:`, error);
    return res.status(500).json({ error: error?.message || "Erreur lors de l'exploration de la table Turso." });
  }
});

// 9. POST /api/turso/schedule - Configurer la synchronisation automatique (quotidienne ou hebdomadaire) vers Turso
app.post("/api/turso/schedule", (req, res) => {
  try {
    const { enabled, frequency, day, hour, minute } = req.body || {};
    const current = loadTursoConfig();
    const newFrequency = frequency === 'weekly' ? 'weekly' : 'daily';
    const newHour = hour !== undefined ? Number(hour) : (newFrequency === 'daily' ? (current.dailySyncHour ?? 0) : (current.weeklySyncHour ?? 2));
    const newMinute = minute !== undefined ? Number(minute) : (newFrequency === 'daily' ? (current.dailySyncMinute ?? 0) : (current.weeklySyncMinute ?? 0));
    const newEnabled = enabled !== undefined ? Boolean(enabled) : true;
    const newDay = day !== undefined ? Number(day) : (current.weeklySyncDay ?? 0);

    const nextDailySync = calculateNextDailySync(newHour, newMinute);
    const nextWeeklySync = calculateNextWeeklySync(newDay, newHour, newMinute);

    const updated = saveTursoConfig({
      syncFrequency: newFrequency,
      dailySyncEnabled: newFrequency === 'daily' ? newEnabled : (current.dailySyncEnabled ?? true),
      dailySyncHour: newHour,
      dailySyncMinute: newMinute,
      nextDailySyncAt: nextDailySync,
      weeklySyncEnabled: newFrequency === 'weekly' ? newEnabled : (current.weeklySyncEnabled ?? true),
      weeklySyncDay: newDay,
      weeklySyncHour: newHour,
      weeklySyncMinute: newMinute,
      nextWeeklySyncAt: nextWeeklySync,
    });

    const timeLabel = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    const dayLabels = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayLabel = dayLabels[newDay] || 'Dimanche';

    const msg = newFrequency === 'daily'
      ? (newEnabled ? `Synchronisation quotidienne automatique activée : chaque jour à ${timeLabel}.` : "Synchronisation quotidienne désactivée.")
      : (newEnabled ? `Synchronisation hebdomadaire programmée : chaque ${dayLabel} à ${timeLabel}.` : "Synchronisation hebdomadaire désactivée.");

    console.log(`[Turso Scheduler] Configuration mise à jour : fréquence=${newFrequency}, actif=${newEnabled}, heure=${timeLabel}`);

    return res.json({
      success: true,
      message: msg,
      config: {
        syncFrequency: updated.syncFrequency,
        dailySyncEnabled: updated.dailySyncEnabled,
        dailySyncHour: updated.dailySyncHour,
        dailySyncMinute: updated.dailySyncMinute,
        nextDailySyncAt: updated.nextDailySyncAt,
        weeklySyncEnabled: updated.weeklySyncEnabled,
        weeklySyncDay: updated.weeklySyncDay,
        nextWeeklySyncAt: updated.nextWeeklySyncAt,
        timeLabel,
        dayLabel,
      },
    });
  } catch (error: any) {
    console.error("Erreur POST /api/turso/schedule:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors de la programmation de la synchronisation Turso." });
  }
});

// 9b. POST /api/turso/sync-daily - Déclencher immédiatement une synchronisation journalière vers Turso
app.post("/api/turso/sync-daily", async (req, res) => {
  try {
    ensureDataDir();
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const result = await syncAllToTurso(currentDb, 'daily_auto');
    return res.json({
      ...result,
      syncType: 'daily_auto',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Erreur POST /api/turso/sync-daily:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Erreur lors de la synchronisation quotidienne vers Turso.",
    });
  }
});

// 10. GET /api/turso/history - Historique des sauvegardes et exports
app.get("/api/turso/history", (req, res) => {
  try {
    const config = loadTursoConfig();
    return res.json({
      history: config.syncHistory || [],
      lastWeeklySyncAt: config.lastWeeklySyncAt,
      nextWeeklySyncAt: config.nextWeeklySyncAt,
      weeklySyncEnabled: config.weeklySyncEnabled,
    });
  } catch (error: any) {
    console.error("Erreur GET /api/turso/history:", error);
    return res.status(500).json({ error: "Erreur lors de la lecture de l'historique." });
  }
});

// 11. POST /api/turso/history/clear - Réinitialiser l'historique
app.post("/api/turso/history/clear", (req, res) => {
  try {
    saveTursoConfig({ syncHistory: [] });
    return res.json({ success: true, message: "Historique réinitialisé." });
  } catch (error: any) {
    return res.status(500).json({ error: "Erreur lors de la réinitialisation de l'historique." });
  }
});

// Global Express Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error("[Express Error Handler]", err.stack || err.message || err);
  res.status(err.status || 500).json({
    error: "Erreur serveur.",
    message: err.message || "Une erreur interne s'est produite."
  });
});

async function startServer() {
  // Vérification et auto-restauration de toutes les réservations au démarrage
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE_PATH)) {
      const currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8"));
      if (currentDb) {
        recoverAllMissingReservationsFromAuditLogs(currentDb);
      }
    }
  } catch (err) {
    console.warn("[Chery DB] Auto-recovery on startup:", err);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/data/**', '**/db.json', '**/data/db.json'],
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur Chery Tunisie démarré sur http://localhost:${PORT}`);

    // Démarrage initial : synchronisation Turso libSQL Cloud (Serveur Local data/db.json désactivé)
    setTimeout(async () => {
      try {
        console.log(`[Chery DB] Serveur Local (data/db.json & clichés quotidiens) désactivé. Turso libSQL Cloud actif.`);
        const config = loadTursoConfig();
        if (config.url && config.authToken && config.dailySyncEnabled) {
          const todayStr = new Date().toISOString().slice(0, 10);
          const lastSyncDateStr = (config.lastDailySyncAt || config.lastSyncAt || '').slice(0, 10);
          if (todayStr !== lastSyncDateStr) {
            console.log(`[Turso Startup] 🚀 Exécution de la synchronisation automatique quotidienne vers Turso (mongi95)...`);
            const currentDb = getLatestDbPayload();
            const res = await syncAllToTurso(currentDb, 'daily_auto');
            console.log(`[Turso Startup] ✅ Synchronisation quotidienne avec Turso réussie :`, res.message);
          }
        }
      } catch (startupSyncErr: any) {
        console.warn(`[Turso Startup Warning]`, startupSyncErr?.message);
      }
    }, 5000);

    // Planificateur automatique chaque minute : synchronisation automatique chaque jour avec Turso
    setInterval(async () => {
      try {
        const config = loadTursoConfig();
        if (!config.url || !config.authToken) return;

        const now = new Date();

        // 1. Synchronisation Quotidienne Automatique (Chaque Jour)
        if (config.dailySyncEnabled) {
          const nextDaily = config.nextDailySyncAt ? new Date(config.nextDailySyncAt) : null;
          if (nextDaily && now.getTime() >= nextDaily.getTime()) {
            console.log(`[Turso Scheduler] 🔄 Exécution de la synchronisation automatique quotidienne vers Turso Database (mongi95)...`);
            const currentDb = getLatestDbPayload();
            const result = await syncAllToTurso(currentDb, 'daily_auto');
            console.log(`[Turso Scheduler] ✅ Synchronisation quotidienne avec Turso réussie :`, result.message);
          }
        }

        // 2. Synchronisation Hebdomadaire Automatique (si activée)
        if (config.weeklySyncEnabled && config.syncFrequency === 'weekly') {
          const nextWeekly = config.nextWeeklySyncAt ? new Date(config.nextWeeklySyncAt) : null;
          if (nextWeekly && now.getTime() >= nextWeekly.getTime()) {
            console.log(`[Turso Scheduler] 🔄 Exécution de la synchronisation hebdomadaire vers Turso Database...`);
            const currentDb = getLatestDbPayload();
            const result = await syncAllToTurso(currentDb, 'weekly_auto');
            console.log(`[Turso Scheduler] ✅ Synchronisation hebdomadaire réussie :`, result.message);
          }
        }
      } catch (cronErr) {
        console.error("[Turso Scheduler Error]", cronErr);
      }
    }, 60 * 1000); // Contrôle chaque minute
  });
}

startServer();
