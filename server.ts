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
    const isNeon = Boolean(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL);
    const carList = await db.select().from(carModels);
    return res.json({
      connected: true,
      provider: isNeon ? "Neon PostgreSQL" : "PostgreSQL (Cloud SQL)",
      message: isNeon ? "Connexion Neon PostgreSQL active." : "Connexion PostgreSQL active.",
      carsCount: carList.length,
    });
  } catch (error: any) {
    const hasConfig = Boolean(
      process.env.DATABASE_URL ||
      process.env.NEON_DATABASE_URL ||
      process.env.SQL_HOST
    );
    return res.json({
      connected: false,
      configured: hasConfig,
      provider: (process.env.DATABASE_URL || process.env.NEON_DATABASE_URL) ? "Neon PostgreSQL" : "PostgreSQL",
      message: hasConfig
        ? "En attente de connexion à la base PostgreSQL."
        : "Base PostgreSQL non configurée (utilise Firestore et data/db.json).",
      details: error?.message || String(error),
    });
  }
});

// --- BASE DE DONNÉES LOCALE (data/db.json dans le dossier du projet) ---
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE_PATH = path.join(DATA_DIR, "db.json");
const DB_BAK_PATH = path.join(DATA_DIR, "db.json.bak");
const DB_TMP_PATH = path.join(DATA_DIR, "db.json.tmp");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
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

let dbWriteQueue: Promise<any> = Promise.resolve();

async function safeAtomicWriteDb(dbPayload: any): Promise<boolean> {
  const current = dbWriteQueue.then(async () => {
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
    console.log(`[Chery DB Safe] Base enregistrée (${dbPayload.reservations?.length || 0} réservations, ${dbPayload.cars?.length || 0} modèles).`);
    return true;
  });
  dbWriteQueue = current.catch((err) => {
    console.error("[Chery DB Write Queue Error]:", err);
    return false;
  });
  return current;
}

// Endpoint pour lire la base de données locale du dossier projet (avec auto-réparation intelligente)
app.get("/api/db", (req, res) => {
  try {
    ensureDataDir();

    let data: any = null;

    // 1. Tenter la lecture du fichier principal db.json
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE_PATH, "utf-8");
        data = safeParseJSON(fileContent);
      } catch (e) {
        console.warn("[Chery DB Warning] Impossible de lire db.json:", e);
      }
    }

    // 2. Si db.json est absent ou corrompu, tenter la sauvegarde db.json.bak
    if (!data && fs.existsSync(DB_BAK_PATH)) {
      console.warn("[Chery DB Warning] db.json invalide ou manquant. Restauration depuis db.json.bak...");
      try {
        const bakContent = fs.readFileSync(DB_BAK_PATH, "utf-8");
        data = safeParseJSON(bakContent);
        if (data) {
          fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
          console.log("[Chery DB Success] Fichier db.json restauré avec succès depuis le backup.");
        }
      } catch (e) {
        console.warn("[Chery DB Warning] Backup db.json.bak également illisible:", e);
      }
    }

    // 3. Si aucun fichier lisible n'existe, auto-génération sécurisée d'une base saine
    if (!data) {
      console.log("[Chery DB Recovery] Initialisation d'une nouvelle base locale saine et création du backup...");
      data = createDefaultDbPayload();
      const initialJson = JSON.stringify(data, null, 2);
      try {
        fs.writeFileSync(DB_FILE_PATH, initialJson, "utf-8");
        fs.writeFileSync(DB_BAK_PATH, initialJson, "utf-8");
        console.log("[Chery DB Success] Base locale saine générée avec succès.");
      } catch (writeErr) {
        console.error("[Chery DB Error] Impossible d'écrire la base saine:", writeErr);
      }
    }

    return res.json({ exists: true, ...data });
  } catch (error: any) {
    console.error("Erreur lecture db.json:", error);
    const fallback = createDefaultDbPayload();
    return res.json({ exists: true, ...fallback, recovered: true });
  }
});

// Endpoint pour enregistrer / synchroniser la base de données dans data/db.json (écriture atomique)
app.post("/api/db/save", (req, res) => {
  try {
    ensureDataDir();

    let existingData: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE_PATH, "utf-8");
        const parsed = safeParseJSON(fileContent);
        if (parsed && typeof parsed === "object") {
          existingData = parsed;
        }
      } catch (err) {
        // ignore
      }
    }

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
      docTemplate: docTemplate !== undefined ? docTemplate : (existingData.docTemplate || null),
      auditLogs: Array.isArray(auditLogs) ? auditLogs : (existingData.auditLogs || []),
    };

    const jsonString = JSON.stringify(dbPayload, null, 2);

    // Écrire d'abord dans un fichier temporaire
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");

    // Valider l'intégrité JSON du fichier temporaire avant de remplacer la base
    const verifyContent = fs.readFileSync(DB_TMP_PATH, "utf-8");
    if (!safeParseJSON(verifyContent)) {
      throw new Error("Erreur d'intégrité JSON détectée lors de l'écriture temporaire.");
    }

    // Sauvegarder la version actuelle dans .bak UNIQUEMENT si elle est 100% valide
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

    // Renommage atomique
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);
    try {
      fs.writeFileSync("data/db_reservations_backup_safe.json", JSON.stringify(cleanReservations, null, 2), "utf-8");
    } catch (_) {}
    console.log(`[Chery DB] Base de données enregistrée en mode atomique dans : ${DB_FILE_PATH}`);

    return res.json({
      success: true,
      savedAt: dbPayload.savedAt,
      filePath: "data/db.json",
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
      resMap.set(reservation.id, reservation);
    }

    const mergedList = Array.from(resMap.values());
    currentDb.reservations = mergedList;
    currentDb.savedAt = new Date().toISOString();

    const jsonString = JSON.stringify(currentDb, null, 2);
    fs.writeFileSync(DB_TMP_PATH, jsonString, "utf-8");
    fs.renameSync(DB_TMP_PATH, DB_FILE_PATH);

    // Mettre à jour la copie de sécurité
    try {
      fs.writeFileSync(DB_BAK_PATH, jsonString, "utf-8");
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
    let rawName = clientMatch ? cleanClientName(clientMatch[1]) : "Client Chery";
    const phone = clientMatch ? clientMatch[2].trim() : "";

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

// 4. Endpoint de restauration intelligente depuis les journaux d'audit
app.post("/api/reservations/recover", (req, res) => {
  try {
    ensureDataDir();
    let currentDb: any = {};
    if (fs.existsSync(DB_FILE_PATH)) {
      currentDb = safeParseJSON(fs.readFileSync(DB_FILE_PATH, "utf-8")) || {};
    }

    const result = recoverAllMissingReservationsFromAuditLogs(currentDb);
    return res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error("Erreur /api/reservations/recover:", error);
    return res.status(500).json({ success: false, error: "Erreur lors de la restauration." });
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
    const { url, authToken, organization, databaseName } = req.body || {};
    const updated = saveTursoConfig({
      ...(url !== undefined ? { url: url.trim() } : {}),
      ...(authToken !== undefined ? { authToken: authToken.trim() } : {}),
      ...(organization !== undefined ? { organization: organization.trim() } : {}),
      ...(databaseName !== undefined ? { databaseName: databaseName.trim() } : {}),
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
  });
}

startServer();
