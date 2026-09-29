import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const TURSO_CONFIG_PATH = path.resolve(process.cwd(), 'data', 'turso_config.json');

export interface TursoConfig {
  organization: string;
  databaseName: string;
  url: string;
  authToken: string;
  lastSyncAt?: string;
  status?: 'connected' | 'disconnected' | 'error';
  lastError?: string;
}

// Configuration par défaut basée sur le compte Turso de l'utilisateur
const DEFAULT_CONFIG: TursoConfig = {
  organization: 'mongi95',
  databaseName: 'chery-sta',
  url: process.env.TURSO_DATABASE_URL || 'libsql://chery-sta-mongi95.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
  status: 'disconnected',
};

export function loadTursoConfig(): TursoConfig {
  try {
    if (fs.existsSync(TURSO_CONFIG_PATH)) {
      const raw = fs.readFileSync(TURSO_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        url: process.env.TURSO_DATABASE_URL || parsed.url || DEFAULT_CONFIG.url,
        authToken: process.env.TURSO_AUTH_TOKEN || parsed.authToken || DEFAULT_CONFIG.authToken,
      };
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
 * Teste la connectivité avec Turso
 */
export async function testTursoConnection(customConfig?: Partial<TursoConfig>): Promise<{
  success: boolean;
  message: string;
  database?: string;
  version?: string;
}> {
  const config = { ...loadTursoConfig(), ...customConfig };
  if (!config.url) {
    return {
      success: false,
      message: "L'URL de la base Turso (TURSO_DATABASE_URL) n'est pas renseignée.",
    };
  }

  const client = getTursoClient(config);
  if (!client) {
    return {
      success: false,
      message: 'Impossible de créer le client libSQL Turso.',
    };
  }

  try {
    const res = await client.execute('SELECT sqlite_version() as version, datetime("now") as now;');
    const version = res.rows[0]?.version as string;
    
    // Marquer statut connecté
    saveTursoConfig({
      status: 'connected',
      lastError: undefined,
    });

    return {
      success: true,
      message: `Connexion réussie à Turso (libSQL v${version}) sur ${config.url}`,
      version,
      database: config.databaseName || 'chery-sta',
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Erreur inconnue lors du test Turso';
    saveTursoConfig({
      status: 'error',
      lastError: errorMsg,
    });
    return {
      success: false,
      message: `Échec de connexion à Turso : ${errorMsg}`,
    };
  }
}

/**
 * Synchronise les données de la base de données (data/db.json) vers Turso
 */
export async function syncAllToTurso(dbData: any): Promise<{
  success: boolean;
  message: string;
  counts: {
    reservations: number;
    cars: number;
    commercials: number;
    notes: number;
  };
}> {
  const client = getTursoClient();
  if (!client) {
    throw new Error("Client Turso non configuré. Veuillez renseigner l'URL et le Token.");
  }

  // 1. Initialiser le schéma
  await initTursoSchema(client);

  const reservations = Array.isArray(dbData.reservations) ? dbData.reservations : [];
  const cars = Array.isArray(dbData.cars) ? dbData.cars : [];
  const commercials = Array.isArray(dbData.commercials) ? dbData.commercials : [];
  const notes = Array.isArray(dbData.notes) ? dbData.notes : [];

  // 2. Insérer / mettre à jour les réservations par lots
  for (const r of reservations) {
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

    await client.execute({
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
    });
  }

  // 3. Insérer les voitures
  for (const c of cars) {
    await client.execute({
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
    });
  }

  // 4. Insérer les commerciaux
  for (const comm of commercials) {
    await client.execute({
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
    });
  }

  // 5. Insérer les notes
  for (const n of notes) {
    await client.execute({
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
    });
  }

  // 6. Mettre à jour la date de dernière synchronisation
  const now = new Date().toISOString();
  await client.execute({
    sql: `INSERT INTO turso_meta (key, value, updated_at)
          VALUES ('last_sync', ?, ?)
          ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at;`,
    args: [now, now],
  });

  saveTursoConfig({
    lastSyncAt: now,
    status: 'connected',
  });

  return {
    success: true,
    message: `Synchronisation Turso réussie ! ${reservations.length} réservations, ${cars.length} véhicules, ${commercials.length} comptes et ${notes.length} notes synchronisés sur Turso.`,
    counts: {
      reservations: reservations.length,
      cars: cars.length,
      commercials: commercials.length,
      notes: notes.length,
    },
  };
}

/**
 * Récupère les données depuis Turso
 */
export async function pullAllFromTurso(): Promise<any> {
  const client = getTursoClient();
  if (!client) {
    throw new Error("Client Turso non configuré.");
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
