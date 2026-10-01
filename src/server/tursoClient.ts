import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const TURSO_CONFIG_PATH = path.resolve(process.cwd(), 'data', 'turso_config.json');

export interface TursoSyncHistoryItem {
  id: string;
  timestamp: string;
  type: 'manual' | 'weekly_auto';
  success: boolean;
  message: string;
  counts: {
    reservations: number;
    cars: number;
    commercials: number;
    notes: number;
  };
  durationMs: number;
  sizeBytes?: number;
}

export interface TursoConfig {
  organization: string;
  databaseName: string;
  url: string;
  authToken: string;
  status?: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
  lastError?: string;
  weeklySyncEnabled: boolean;
  weeklySyncDay: number; // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  weeklySyncHour: number; // 0-23
  weeklySyncMinute: number; // 0-59
  lastWeeklySyncAt?: string;
  nextWeeklySyncAt?: string;
  syncHistory: TursoSyncHistoryItem[];
}

export interface TursoTableStats {
  name: string;
  displayName: string;
  rowCount: number;
  estimatedSizeBytes: number;
  lastUpdated?: string;
}

export interface TursoStorageMetrics {
  connected: boolean;
  pageCount: number;
  pageSize: number;
  freelistCount: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  freeSpaceBytes: number;
  quotaBytes: number; // 9 GB default on Turso Starter
  quotaFormatted: string;
  quotaPercentUsed: number;
  latencyMs: number;
  sqliteVersion?: string;
  tables: TursoTableStats[];
  totalRows: number;
  weeklySync: {
    enabled: boolean;
    dayLabel: string;
    timeLabel: string;
    nextSync: string;
    lastSync?: string;
  };
}

// Calcul de la prochaine date de synchronisation hebdomadaire
export function calculateNextWeeklySync(dayOfWeek: number, hour: number, minute: number): string {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);

  const currentDay = now.getDay();
  let daysUntil = (dayOfWeek - currentDay + 7) % 7;

  // Si c'est aujourd'hui mais l'heure est déjà passée, reporter à la semaine prochaine
  if (daysUntil === 0 && now.getTime() >= next.getTime()) {
    daysUntil = 7;
  }

  next.setDate(now.getDate() + daysUntil);
  return next.toISOString();
}

const DEFAULT_CONFIG: TursoConfig = {
  organization: 'mongi95',
  databaseName: 'chery-sta',
  url: process.env.TURSO_DATABASE_URL || 'libsql://chery-sta-mongi95.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
  status: 'disconnected',
  weeklySyncEnabled: true,
  weeklySyncDay: 0, // Dimanche par défaut
  weeklySyncHour: 2, // 02h00 du matin
  weeklySyncMinute: 0,
  nextWeeklySyncAt: calculateNextWeeklySync(0, 2, 0),
  syncHistory: [],
};

export function loadTursoConfig(): TursoConfig {
  try {
    if (fs.existsSync(TURSO_CONFIG_PATH)) {
      const raw = fs.readFileSync(TURSO_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      const config: TursoConfig = {
        ...DEFAULT_CONFIG,
        ...parsed,
        url: process.env.TURSO_DATABASE_URL || parsed.url || DEFAULT_CONFIG.url,
        authToken: process.env.TURSO_AUTH_TOKEN || parsed.authToken || DEFAULT_CONFIG.authToken,
        syncHistory: Array.isArray(parsed.syncHistory) ? parsed.syncHistory : [],
      };
      // Recalculer nextWeeklySyncAt si manquant
      if (!config.nextWeeklySyncAt) {
        config.nextWeeklySyncAt = calculateNextWeeklySync(
          config.weeklySyncDay ?? 0,
          config.weeklySyncHour ?? 2,
          config.weeklySyncMinute ?? 0
        );
      }
      return config;
    }
  } catch (err) {
    console.error('[Turso] Erreur lecture config:', err);
  }
  return { ...DEFAULT_CONFIG };
}

export function saveTursoConfig(newConfig: Partial<TursoConfig>): TursoConfig {
  const current = loadTursoConfig();
  const updated: TursoConfig = {
    ...current,
    ...newConfig,
  };

  // Recalculer la prochaine date si les paramètres horaires ont changé
  if (
    newConfig.weeklySyncDay !== undefined ||
    newConfig.weeklySyncHour !== undefined ||
    newConfig.weeklySyncMinute !== undefined
  ) {
    updated.nextWeeklySyncAt = calculateNextWeeklySync(
      updated.weeklySyncDay,
      updated.weeklySyncHour,
      updated.weeklySyncMinute
    );
  }

  // Limiter l'historique aux 30 dernières entrées
  if (Array.isArray(updated.syncHistory) && updated.syncHistory.length > 30) {
    updated.syncHistory = updated.syncHistory.slice(0, 30);
  }

  try {
    const dir = path.dirname(TURSO_CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(TURSO_CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Turso] Erreur sauvegarde config:', err);
  }
  return updated;
}

export function getTursoClient(customConfig?: Partial<TursoConfig>): Client | null {
  const config = { ...loadTursoConfig(), ...customConfig };
  if (!config.url || !config.url.trim()) {
    return null;
  }
  try {
    return createClient({
      url: config.url.trim(),
      authToken: config.authToken ? config.authToken.trim() : undefined,
    });
  } catch (err) {
    console.error('[Turso] Erreur instanciation client libSQL:', err);
    return null;
  }
}

/**
 * Initialise le schéma SQL des tables dans la base Turso
 */
export async function initTursoSchema(client: Client): Promise<void> {
  await client.batch([
    `CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      commercial_id TEXT,
      commercial_name TEXT,
      agency TEXT,
      car_name TEXT,
      color_chosen TEXT,
      client_type TEXT,
      client_name TEXT,
      client_cin TEXT,
      client_phone TEXT,
      price_tnd REAL,
      deposit_paid_tnd REAL,
      payment_method TEXT,
      status TEXT,
      created_at TEXT,
      updated_at TEXT,
      raw_json TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      name TEXT,
      category TEXT,
      price_tnd REAL,
      raw_json TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS commercials (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      role TEXT,
      agency TEXT,
      raw_json TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      category TEXT,
      author TEXT,
      created_at TEXT,
      updated_at TEXT,
      raw_json TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS turso_meta (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT
    );`
  ], 'write');
}

/**
 * Formate un nombre d'octets en chaîne lisible (Ko, Mo, Go)
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 Octets';
  const units = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Teste la connectivité et mesure la latence avec Turso
 */
export async function testTursoConnection(customConfig?: Partial<TursoConfig>): Promise<{
  success: boolean;
  message: string;
  database?: string;
  version?: string;
  latencyMs?: number;
}> {
  const config = { ...loadTursoConfig(), ...customConfig };
  if (!config.url) {
    return {
      success: false,
      message: "L'URL de la base Turso (TURSO_DATABASE_URL) n'est pas configurée.",
    };
  }

  const client = getTursoClient(config);
  if (!client) {
    return {
      success: false,
      message: 'Impossible de créer le client libSQL Turso.',
    };
  }

  const start = Date.now();
  try {
    const res = await withTimeout(
      client.execute('SELECT sqlite_version() as version, datetime("now") as now;'),
      7000,
      "Délai d'attente dépassé (timeout 7s). Vérifiez votre URL et votre Token sur app.turso.tech/mongi95."
    );
    const latencyMs = Date.now() - start;
    const version = res.rows[0]?.version as string;

    saveTursoConfig({
      status: 'connected',
      lastError: undefined,
    });

    return {
      success: true,
      message: `Connexion active à Turso libSQL v${version} (${latencyMs}ms)`,
      version,
      database: config.databaseName || 'chery-sta',
      latencyMs,
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Erreur inconnue lors du test Turso';
    saveTursoConfig({
      status: 'error',
      lastError: errorMsg,
    });
    return {
      success: false,
      message: `Échec de connexion : ${errorMsg}`,
    };
  }
}

/**
 * Contrôle de l'espace et métriques détaillées de la base de données Turso
 */
export async function getTursoStorageMetrics(): Promise<TursoStorageMetrics> {
  const config = loadTursoConfig();
  const dayLabels = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const dayLabel = dayLabels[config.weeklySyncDay ?? 0] || 'Dimanche';
  const timeLabel = `${String(config.weeklySyncHour ?? 2).padStart(2, '0')}:${String(config.weeklySyncMinute ?? 0).padStart(2, '0')}`;

  const client = getTursoClient();
  const defaultQuotaBytes = 9 * 1024 * 1024 * 1024; // 9 Go (Quota Turso Starter)

  if (!client) {
    return {
      connected: false,
      pageCount: 0,
      pageSize: 4096,
      freelistCount: 0,
      totalSizeBytes: 0,
      totalSizeFormatted: '0 Ko',
      freeSpaceBytes: 0,
      quotaBytes: defaultQuotaBytes,
      quotaFormatted: '9.00 Go',
      quotaPercentUsed: 0,
      latencyMs: 0,
      tables: [],
      totalRows: 0,
      weeklySync: {
        enabled: config.weeklySyncEnabled,
        dayLabel,
        timeLabel,
        nextSync: config.nextWeeklySyncAt || calculateNextWeeklySync(0, 2, 0),
        lastSync: config.lastWeeklySyncAt,
      },
    };
  }

  const start = Date.now();
  try {
    await initTursoSchema(client);

    // Requêtes de métriques SQLite libSQL
    const [pageCountRes, pageSizeRes, freelistRes, resCount, carsCount, commCount, notesCount, versionRes] =
      await Promise.all([
        client.execute('PRAGMA page_count;').catch(() => ({ rows: [{ page_count: 0 }] })),
        client.execute('PRAGMA page_size;').catch(() => ({ rows: [{ page_size: 4096 }] })),
        client.execute('PRAGMA freelist_count;').catch(() => ({ rows: [{ freelist_count: 0 }] })),
        client.execute('SELECT COUNT(*) as c, SUM(LENGTH(raw_json)) as bytes FROM reservations;').catch(() => ({ rows: [{ c: 0, bytes: 0 }] })),
        client.execute('SELECT COUNT(*) as c, SUM(LENGTH(raw_json)) as bytes FROM cars;').catch(() => ({ rows: [{ c: 0, bytes: 0 }] })),
        client.execute('SELECT COUNT(*) as c, SUM(LENGTH(raw_json)) as bytes FROM commercials;').catch(() => ({ rows: [{ c: 0, bytes: 0 }] })),
        client.execute('SELECT COUNT(*) as c, SUM(LENGTH(raw_json)) as bytes FROM notes;').catch(() => ({ rows: [{ c: 0, bytes: 0 }] })),
        client.execute('SELECT sqlite_version() as v;').catch(() => ({ rows: [{ v: '3.45.0' }] })),
      ]);

    const latencyMs = Date.now() - start;

    const pageCount = Number(pageCountRes.rows[0]?.page_count || (pageCountRes.rows[0] as any)?.[0] || 0);
    const pageSize = Number(pageSizeRes.rows[0]?.page_size || (pageSizeRes.rows[0] as any)?.[0] || 4096);
    const freelistCount = Number(freelistRes.rows[0]?.freelist_count || (freelistRes.rows[0] as any)?.[0] || 0);
    const sqliteVersion = String(versionRes.rows[0]?.v || '3.45.0');

    // Taille totale physique de la base SQLite
    let totalSizeBytes = pageCount * pageSize;

    // Décompte précis par table
    const rCount = Number(resCount.rows[0]?.c || 0);
    const rBytes = Number(resCount.rows[0]?.bytes || (rCount * 2500));

    const cCount = Number(carsCount.rows[0]?.c || 0);
    const cBytes = Number(carsCount.rows[0]?.bytes || (cCount * 1200));

    const uCount = Number(commCount.rows[0]?.c || 0);
    const uBytes = Number(commCount.rows[0]?.bytes || (uCount * 800));

    const nCount = Number(notesCount.rows[0]?.c || 0);
    const nBytes = Number(notesCount.rows[0]?.bytes || (nCount * 600));

    if (totalSizeBytes <= 0) {
      totalSizeBytes = rBytes + cBytes + uBytes + nBytes + (pageSize * 4);
    }

    const freeSpaceBytes = freelistCount * pageSize;
    const quotaPercentUsed = Number(((totalSizeBytes / defaultQuotaBytes) * 100).toFixed(4));
    const totalRows = rCount + cCount + uCount + nCount;

    const tables: TursoTableStats[] = [
      {
        name: 'reservations',
        displayName: 'Bons de Réservation',
        rowCount: rCount,
        estimatedSizeBytes: rBytes,
        lastUpdated: config.lastSyncAt,
      },
      {
        name: 'cars',
        displayName: 'Catalogue & Véhicules',
        rowCount: cCount,
        estimatedSizeBytes: cBytes,
        lastUpdated: config.lastSyncAt,
      },
      {
        name: 'commercials',
        displayName: 'Utilisateurs & Agences',
        rowCount: uCount,
        estimatedSizeBytes: uBytes,
        lastUpdated: config.lastSyncAt,
      },
      {
        name: 'notes',
        displayName: 'Notes & Mémos',
        rowCount: nCount,
        estimatedSizeBytes: nBytes,
        lastUpdated: config.lastSyncAt,
      },
    ];

    return {
      connected: true,
      pageCount,
      pageSize,
      freelistCount,
      totalSizeBytes,
      totalSizeFormatted: formatBytes(totalSizeBytes),
      freeSpaceBytes,
      quotaBytes: defaultQuotaBytes,
      quotaFormatted: '9.00 Go',
      quotaPercentUsed,
      latencyMs,
      sqliteVersion,
      tables,
      totalRows,
      weeklySync: {
        enabled: config.weeklySyncEnabled,
        dayLabel,
        timeLabel,
        nextSync: config.nextWeeklySyncAt || calculateNextWeeklySync(0, 2, 0),
        lastSync: config.lastWeeklySyncAt,
      },
    };
  } catch (err: any) {
    console.error('[Turso] Erreur métriques stockage:', err);
    return {
      connected: false,
      pageCount: 0,
      pageSize: 4096,
      freelistCount: 0,
      totalSizeBytes: 0,
      totalSizeFormatted: '0 Ko',
      freeSpaceBytes: 0,
      quotaBytes: defaultQuotaBytes,
      quotaFormatted: '9.00 Go',
      quotaPercentUsed: 0,
      latencyMs: Date.now() - start,
      tables: [],
      totalRows: 0,
      weeklySync: {
        enabled: config.weeklySyncEnabled,
        dayLabel,
        timeLabel,
        nextSync: config.nextWeeklySyncAt || calculateNextWeeklySync(0, 2, 0),
        lastSync: config.lastWeeklySyncAt,
      },
    };
  }
}

/**
 * Optimise la base Turso en exécutant un VACUUM
 */
export async function vacuumTursoDatabase(): Promise<{ success: boolean; message: string }> {
  const client = getTursoClient();
  if (!client) {
    throw new Error('Client Turso non configuré.');
  }

  const start = Date.now();
  await client.execute('VACUUM;');
  const durationMs = Date.now() - start;

  return {
    success: true,
    message: `Base Turso défragmentée et optimisée avec succès (durée : ${durationMs}ms). L'espace inutilisé a été libéré.`,
  };
}

/**
 * Explore le contenu d'une table Turso pour prévisualisation dans le dashboard
 */
export async function exploreTursoTable(
  tableName: string,
  limit: number = 20,
  offset: number = 0,
  search: string = ''
): Promise<{
  rows: any[];
  total: number;
  columns: string[];
}> {
  const allowed = ['reservations', 'cars', 'commercials', 'notes', 'turso_meta'];
  if (!allowed.includes(tableName)) {
    throw new Error(`Table ${tableName} non autorisée.`);
  }

  const client = getTursoClient();
  if (!client) {
    throw new Error('Client Turso non connecté.');
  }

  await initTursoSchema(client);

  let query = `SELECT * FROM ${tableName}`;
  let countQuery = `SELECT count(*) as total FROM ${tableName}`;
  const args: any[] = [];

  if (search && search.trim()) {
    const s = `%${search.trim().toLowerCase()}%`;
    if (tableName === 'reservations') {
      query += ` WHERE LOWER(id) LIKE ? OR LOWER(client_name) LIKE ? OR LOWER(car_name) LIKE ? OR LOWER(commercial_name) LIKE ?`;
      countQuery += ` WHERE LOWER(id) LIKE ? OR LOWER(client_name) LIKE ? OR LOWER(car_name) LIKE ? OR LOWER(commercial_name) LIKE ?`;
      args.push(s, s, s, s);
    } else if (tableName === 'cars') {
      query += ` WHERE LOWER(name) LIKE ? OR LOWER(category) LIKE ?`;
      countQuery += ` WHERE LOWER(name) LIKE ? OR LOWER(category) LIKE ?`;
      args.push(s, s);
    } else if (tableName === 'commercials') {
      query += ` WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(agency) LIKE ?`;
      countQuery += ` WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(agency) LIKE ?`;
      args.push(s, s, s);
    } else if (tableName === 'notes') {
      query += ` WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(category) LIKE ?`;
      countQuery += ` WHERE LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(category) LIKE ?`;
      args.push(s, s, s);
    }
  }

  query += ` LIMIT ${Math.min(limit, 100)} OFFSET ${Math.max(offset, 0)};`;

  const [rowsRes, countRes] = await Promise.all([
    client.execute({ sql: query, args }),
    client.execute({ sql: countQuery, args }),
  ]);

  const total = Number(countRes.rows[0]?.total || 0);
  const rows = rowsRes.rows;
  const columns = rowsRes.columns;

  return {
    rows,
    total,
    columns,
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 15000, errorMsg = "Délai d'attente dépassé avec le serveur Turso"): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Synchronise les données de la base de données (data/db.json) vers Turso
 */
export async function syncAllToTurso(
  dbData: any,
  syncType: 'manual' | 'weekly_auto' = 'manual'
): Promise<{
  success: boolean;
  message: string;
  counts: {
    reservations: number;
    cars: number;
    commercials: number;
    notes: number;
  };
  durationMs: number;
}> {
  const config = loadTursoConfig();
  if (!config.url || !config.url.trim()) {
    throw new Error("L'URL de la base Turso n'est pas configurée.");
  }
  if (!config.authToken || !config.authToken.trim()) {
    throw new Error("Veuillez renseigner votre Token d'authentification Turso (TURSO_AUTH_TOKEN) généré sur https://app.turso.tech/mongi95 pour autoriser l'exportation.");
  }

  const client = getTursoClient(config);
  if (!client) {
    throw new Error("Impossible d'initialiser le client libSQL Turso.");
  }

  const startTime = Date.now();

  // 1. Initialiser le schéma avec timeout
  await withTimeout(initTursoSchema(client), 15000, "Délai d'attente dépassé lors de l'initialisation du schéma Turso.");

  const reservations = Array.isArray(dbData.reservations) ? dbData.reservations : [];
  const cars = Array.isArray(dbData.cars) ? dbData.cars : [];
  const commercials = Array.isArray(dbData.commercials) ? dbData.commercials : [];
  const notes = Array.isArray(dbData.notes) ? dbData.notes : [];

  // 2. Insérer / mettre à jour les réservations par lots (batching ultra-rapide)
  const resStatements = reservations.map((r: any) => {
    const clientName =
      r.client?.type === 'societe'
        ? r.client?.societe?.raisonSociale || ''
        : `${r.client?.personnePhysique?.nom || ''} ${r.client?.personnePhysique?.prenom || ''}`.trim();
    const clientCin =
      r.client?.type === 'societe'
        ? r.client?.societe?.matriculeFiscale || ''
        : r.client?.personnePhysique?.cin || '';
    const clientPhone =
      r.client?.type === 'societe'
        ? r.client?.societe?.telephone || ''
        : r.client?.personnePhysique?.telephone || '';

    return {
      sql: `INSERT INTO reservations (
        id, commercial_id, commercial_name, agency, car_name, color_chosen,
        client_type, client_name, client_cin, client_phone, price_tnd,
        deposit_paid_tnd, payment_method, status, created_at, updated_at, raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        commercial_id=excluded.commercial_id,
        commercial_name=excluded.commercial_name,
        agency=excluded.agency,
        car_name=excluded.car_name,
        color_chosen=excluded.color_chosen,
        client_type=excluded.client_type,
        client_name=excluded.client_name,
        client_cin=excluded.client_cin,
        client_phone=excluded.client_phone,
        price_tnd=excluded.price_tnd,
        deposit_paid_tnd=excluded.deposit_paid_tnd,
        payment_method=excluded.payment_method,
        status=excluded.status,
        created_at=excluded.created_at,
        updated_at=excluded.updated_at,
        raw_json=excluded.raw_json;`,
      args: [
        r.id,
        r.commercialId || '',
        r.commercialName || '',
        r.agency || '',
        r.carName || '',
        r.colorChosen?.name || '',
        r.client?.type || 'personne_physique',
        clientName,
        clientCin,
        clientPhone,
        Number(r.priceTND || 0),
        Number(r.depositPaidTND || 0),
        r.paymentMethod || 'Espèces',
        r.status || 'En attente',
        r.createdAt || new Date().toISOString(),
        r.updatedAt || r.createdAt || new Date().toISOString(),
        JSON.stringify(r),
      ],
    };
  });

  const BATCH_SIZE = 40;
  for (let i = 0; i < resStatements.length; i += BATCH_SIZE) {
    const chunk = resStatements.slice(i, i + BATCH_SIZE);
    await client.batch(chunk, 'write');
  }

  // 3. Insérer les voitures par lot
  if (cars.length > 0) {
    const carStatements = cars.map((c: any) => ({
      sql: `INSERT INTO cars (id, name, category, price_tnd, raw_json)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name=excluded.name,
              category=excluded.category,
              price_tnd=excluded.price_tnd,
              raw_json=excluded.raw_json;`,
      args: [
        c.id,
        c.name || '',
        c.category || '',
        Number(c.priceTND || 0),
        JSON.stringify(c),
      ],
    }));
    await client.batch(carStatements, 'write');
  }

  // 4. Insérer les commerciaux par lot
  if (commercials.length > 0) {
    const commStatements = commercials.map((comm: any) => ({
      sql: `INSERT INTO commercials (id, name, email, role, agency, raw_json)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name=excluded.name,
              email=excluded.email,
              role=excluded.role,
              agency=excluded.agency,
              raw_json=excluded.raw_json;`,
      args: [
        comm.id,
        comm.name || '',
        comm.email || '',
        comm.role || 'commercial',
        comm.agency || '',
        JSON.stringify(comm),
      ],
    }));
    await client.batch(commStatements, 'write');
  }

  // 5. Insérer les notes par lot
  if (notes.length > 0) {
    const noteStatements = notes.map((n: any) => ({
      sql: `INSERT INTO notes (id, title, content, category, author, created_at, updated_at, raw_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              title=excluded.title,
              content=excluded.content,
              category=excluded.category,
              author=excluded.author,
              created_at=excluded.created_at,
              updated_at=excluded.updated_at,
              raw_json=excluded.raw_json;`,
      args: [
        n.id,
        n.title || '',
        n.content || '',
        n.category || 'Général',
        n.author || 'Commercial',
        n.createdAt || new Date().toISOString(),
        n.updatedAt || new Date().toISOString(),
        JSON.stringify(n),
      ],
    }));
    await client.batch(noteStatements, 'write');
  }

  // 6. Mettre à jour la date de dernière synchronisation dans turso_meta
  const now = new Date().toISOString();
  await client.execute({
    sql: `INSERT INTO turso_meta (key, value, updated_at)
          VALUES ('last_sync', ?, ?)
          ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at;`,
    args: [now, now],
  });

  const durationMs = Date.now() - startTime;
  const currentConfig = loadTursoConfig();

  // Enregistrer dans l'historique
  const historyItem: TursoSyncHistoryItem = {
    id: `sync-${Date.now()}`,
    timestamp: now,
    type: syncType,
    success: true,
    message: `${reservations.length} réservations exportées avec succès (${durationMs}ms)`,
    counts: {
      reservations: reservations.length,
      cars: cars.length,
      commercials: commercials.length,
      notes: notes.length,
    },
    durationMs,
  };

  const updatedHistory = [historyItem, ...(currentConfig.syncHistory || [])].slice(0, 30);

  saveTursoConfig({
    lastSyncAt: now,
    status: 'connected',
    ...(syncType === 'weekly_auto'
      ? {
          lastWeeklySyncAt: now,
          nextWeeklySyncAt: calculateNextWeeklySync(
            currentConfig.weeklySyncDay ?? 0,
            currentConfig.weeklySyncHour ?? 2,
            currentConfig.weeklySyncMinute ?? 0
          ),
        }
      : {}),
    syncHistory: updatedHistory,
  });

  return {
    success: true,
    message: `Exportation vers Turso réussie ! ${reservations.length} réservations, ${cars.length} véhicules, ${commercials.length} comptes et ${notes.length} notes synchronisés en ${durationMs}ms.`,
    counts: {
      reservations: reservations.length,
      cars: cars.length,
      commercials: commercials.length,
      notes: notes.length,
    },
    durationMs,
  };
}

/**
 * Récupère les données depuis Turso
 */
export async function pullAllFromTurso(): Promise<any> {
  const client = getTursoClient();
  if (!client) {
    throw new Error('Client Turso non configuré.');
  }

  await initTursoSchema(client);

  const [resRes, carsRes, commsRes, notesRes] = await Promise.all([
    client.execute('SELECT raw_json FROM reservations ORDER BY created_at DESC;'),
    client.execute('SELECT raw_json FROM cars;'),
    client.execute('SELECT raw_json FROM commercials;'),
    client.execute('SELECT raw_json FROM notes ORDER BY created_at DESC;'),
  ]);

  const reservations = resRes.rows.map((row) => JSON.parse(row.raw_json as string)).filter(Boolean);
  const cars = carsRes.rows.map((row) => JSON.parse(row.raw_json as string)).filter(Boolean);
  const commercials = commsRes.rows.map((row) => JSON.parse(row.raw_json as string)).filter(Boolean);
  const notes = notesRes.rows.map((row) => JSON.parse(row.raw_json as string)).filter(Boolean);

  return {
    reservations,
    cars,
    commercials,
    notes,
    totalReservations: reservations.length,
  };
}
