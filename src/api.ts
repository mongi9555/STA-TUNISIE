// Couche d'accès aux données distantes via API REST
const API_URL = 'https://monapp-api.XXX.workers.dev';

// Permet de surcharger dynamiquement l'URL pour les tests ou la bascule vers le serveur local
let currentApiUrl = typeof window !== 'undefined' && (window as any).__CUSTOM_API_URL ? (window as any).__CUSTOM_API_URL : API_URL;

export function getApiUrl(): string {
  return currentApiUrl;
}

export function setApiUrl(url: string): void {
  currentApiUrl = url;
  if (typeof window !== 'undefined') {
    (window as any).__CUSTOM_API_URL = url;
  }
}

/**
 * Récupère la liste de toutes les notes
 * GET {API_URL}/api/notes
 */
export async function listNotes(): Promise<any[]> {
  const url = `${currentApiUrl}/api/notes`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && (errorData.message || errorData.error)) {
        errorMessage = errorData.message || errorData.error;
      }
    } catch (_) {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch (_) {}
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Crée une nouvelle note
 * POST {API_URL}/api/notes (body JSON)
 */
export async function createNote(data: any): Promise<any> {
  const url = `${currentApiUrl}/api/notes`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && (errorData.message || errorData.error)) {
        errorMessage = errorData.message || errorData.error;
      }
    } catch (_) {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch (_) {}
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Met à jour une note existante
 * PUT {API_URL}/api/notes/{id} (body JSON)
 */
export async function updateNote(id: string, data: any): Promise<any> {
  const url = `${currentApiUrl}/api/notes/${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && (errorData.message || errorData.error)) {
        errorMessage = errorData.message || errorData.error;
      }
    } catch (_) {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch (_) {}
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Supprime une note par son identifiant
 * DELETE {API_URL}/api/notes/{id}
 */
export async function deleteNote(id: string): Promise<any> {
  const url = `${currentApiUrl}/api/notes/${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && (errorData.message || errorData.error)) {
        errorMessage = errorData.message || errorData.error;
      }
    } catch (_) {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch (_) {}
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

export default {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
  getApiUrl,
  setApiUrl,
};
