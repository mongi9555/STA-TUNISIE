import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

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
    
    const dbPayload = {
      savedAt: new Date().toISOString(),
      cars: Array.isArray(cars) ? cars : (existingData.cars || []),
      reservations: Array.isArray(reservations) ? reservations : (existingData.reservations || []),
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
