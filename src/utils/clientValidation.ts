/**
 * Validation stricte des coordonnées clients pour les bons de réservation Chery STA
 * RÈGLE FONDAMENTALE : Aucun bon de réservation ne peut être créé avec des mentions
 * génériques telles que "( chery client )", "Chery Client", "Client", "Test", etc.
 * Toutes les coordonnées requises (Nom, Prénom, CIN 8 chiffres, Téléphone 8 chiffres, Adresse)
 * doivent être impérativement complètes et vérifiées.
 */

import { ClientInfo, Reservation } from '../types';

// Liste des termes et pseudonymes strictement interdits pour le nom du client
export const FORBIDDEN_CLIENT_PATTERNS = [
  'chery client',
  'client chery',
  '( chery client )',
  '(chery client)',
  'chery',
  'client',
  'client test',
  'test client',
  'test',
  'test test',
  'azerty',
  'aaaaaaa',
  'cccccc',
  'fake',
  'anonyme',
  'inconnu',
  'sans nom',
  'passager',
  'visiteur',
  'n/a',
  'none',
  'null',
  'undefined',
  'commercial',
  'sta',
  'sta chery',
  'chery sta',
];

/**
 * Normalise une chaîne de caractères pour comparaison (minuscules, sans accents, sans caractères spéciaux)
 */
export function normalizeClientString(str: string): string {
  return (str || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Vérifie si un nom de client ou raison sociale est interdit (nom générique, test ou faux profil)
 */
export function isForbiddenClientName(name: string): boolean {
  if (!name || name.trim().length < 2) return true;

  const normalized = normalizeClientString(name);
  if (!normalized || normalized.length < 2) return true;

  // 1. Vérification exacte ou partielle contre les motifs interdits
  for (const pattern of FORBIDDEN_CLIENT_PATTERNS) {
    const normPattern = normalizeClientString(pattern);
    if (normalized === normPattern) return true;
    if (normPattern.includes('chery') && normalized.includes(normPattern)) return true;
    if (normPattern.includes('client') && normalized.includes(normPattern)) return true;
  }

  // 2. Vérification des répétitions de caractères (ex: "aaaa", "zzzz", "1111")
  if (/^(.)\1{3,}$/.test(normalized.replace(/\s/g, ''))) return true;

  // 3. Vérification des suites de test simples (ex: "12345", "asdf")
  if (['12345', '123456', 'asdf', 'qwerty', 'azerty'].includes(normalized)) return true;

  return false;
}

/**
 * Vérifie si le numéro CIN tunisien est valide (exactement 8 chiffres numériques, non factices)
 */
export function validateCinNumber(cin: string): { valid: boolean; error?: string } {
  const clean = (cin || '').trim();
  if (!clean) {
    return { valid: false, error: "Le numéro de Carte d'Identité Nationale (CIN) est obligatoire" };
  }

  // Exactement 8 chiffres
  if (!/^\d{8}$/.test(clean)) {
    return { valid: false, error: 'Le N° CIN doit comporter exactement 8 chiffres numériques' };
  }

  // Numéros factices interdits
  const dummyCins = [
    '00000000',
    '11111111',
    '22222222',
    '33333333',
    '44444444',
    '55555555',
    '66666666',
    '77777777',
    '88888888',
    '99999999',
    '12345678',
    '87654321',
    '01234567',
  ];
  if (dummyCins.includes(clean)) {
    return { valid: false, error: 'Numéro de CIN factice interdit. Veuillez saisir le vrai N° CIN du client' };
  }

  return { valid: true };
}

/**
 * Vérifie si le numéro de téléphone tunisien est valide (exactement 8 chiffres numériques)
 */
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  const clean = (phone || '').replace(/\D/g, '');
  if (!clean) {
    return { valid: false, error: 'Le numéro de téléphone est obligatoire' };
  }

  if (clean.length !== 8) {
    return { valid: false, error: 'Le numéro de téléphone doit comporter exactement 8 chiffres' };
  }

  // Les numéros tunisiens commencent généralement par 2, 3, 4, 5, 7 ou 9
  if (!/^[234579]/.test(clean)) {
    return {
      valid: false,
      error: 'Numéro de téléphone tunisien invalide (doit commencer par 2, 3, 4, 5, 7 ou 9)',
    };
  }

  // Numéros factices interdits
  const dummyPhones = [
    '00000000',
    '11111111',
    '22222222',
    '33333333',
    '44444444',
    '55555555',
    '66666666',
    '77777777',
    '88888888',
    '99999999',
    '12345678',
    '87654321',
    '20202020',
    '21212121',
    '22100200',
    '98000000',
  ];
  if (dummyPhones.includes(clean)) {
    return { valid: false, error: 'Numéro de téléphone factice interdit. Saisissez le numéro direct du client' };
  }

  return { valid: true };
}

/**
 * Vérifie la validité de l'adresse physique complète
 */
export function validatePhysicalAddress(address: string): { valid: boolean; error?: string } {
  const clean = (address || '').trim();
  if (!clean) {
    return { valid: false, error: "L'adresse physique complète est obligatoire" };
  }

  if (clean.length < 5) {
    return { valid: false, error: "L'adresse est trop courte (minimum 5 caractères requis : rue, quartier...)" };
  }

  const normalized = normalizeClientString(clean);
  if (['tunis', 'sfax', 'sousse', 'djerba', 'nabeul', 'bizerte', 'test', 'adresse', 'rue', 'chery'].includes(normalized)) {
    return { valid: false, error: "Veuillez renseigner une adresse physique précise (rue, résidence, numéro...)" };
  }

  return { valid: true };
}

/**
 * Vérifie la Matricule Fiscale d'une société
 */
export function validateMatriculeFiscale(mf: string): { valid: boolean; error?: string } {
  const clean = (mf || '').trim();
  if (!clean) {
    return { valid: false, error: 'La matricule fiscale de la société est obligatoire' };
  }

  if (clean.length < 6) {
    return { valid: false, error: 'Format de matricule fiscale trop court (ex: 1234567/A/M/000)' };
  }

  if (clean.toLowerCase().includes('test') || clean === '0000000' || clean === '1234567') {
    return { valid: false, error: 'Matricule fiscale factice interdite' };
  }

  return { valid: true };
}

/**
 * Valide l'ensemble des coordonnées obligatoires du client
 */
export function validateFullClientInfo(client: Partial<ClientInfo>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!client || !client.type) {
    errors.clientType = 'Veuillez sélectionner le type de client (Particulier ou Entreprise)';
    return { isValid: false, errors };
  }

  if (client.type === 'personne_physique') {
    const p = client.personnePhysique;
    if (!p) {
      errors.physique = 'Les informations du client sont requises';
      return { isValid: false, errors };
    }

    // 1. Nom
    if (!p.nom || !p.nom.trim()) {
      errors.physiqueNom = 'Le nom de famille est obligatoire';
    } else if (p.nom.trim().length < 2) {
      errors.physiqueNom = 'Le nom doit comporter au moins 2 lettres';
    } else if (isForbiddenClientName(p.nom)) {
      errors.physiqueNom = 'Nom générique interdit (« Chery », « Client », « Test » ne sont pas autorisés)';
    }

    // 2. Prénom
    if (!p.prenom || !p.prenom.trim()) {
      errors.physiquePrenom = 'Le prénom est obligatoire';
    } else if (p.prenom.trim().length < 2) {
      errors.physiquePrenom = 'Le prénom doit comporter au moins 2 lettres';
    } else if (isForbiddenClientName(p.prenom)) {
      errors.physiquePrenom = 'Prénom générique interdit (« Chery », « Client », « Test » ne sont pas autorisés)';
    }

    // Vérification combinée Nom + Prénom
    const fullName = `${p.nom || ''} ${p.prenom || ''}`.trim();
    if (isForbiddenClientName(fullName)) {
      errors.physiqueNom = 'Combinaison interdite : impossible d\'utiliser un profil générique tel que « Chery Client »';
    }

    // 3. CIN
    const cinCheck = validateCinNumber(p.cin || '');
    if (!cinCheck.valid) {
      errors.physiqueCin = cinCheck.error || 'N° CIN invalide';
    }

    // 4. Téléphone
    const phoneCheck = validatePhoneNumber(p.telephone || '');
    if (!phoneCheck.valid) {
      errors.physiqueTel = phoneCheck.error || 'Téléphone invalide';
    }

    // 5. Ville / Gouvernorat
    if (!p.ville || !p.ville.trim()) {
      errors.physiqueVille = 'Veuillez sélectionner le gouvernorat';
    }

    // 6. Adresse physique
    const addressCheck = validatePhysicalAddress(p.adresse || '');
    if (!addressCheck.valid) {
      errors.physiqueAdresse = addressCheck.error || 'Adresse obligatoire';
    }
  } else if (client.type === 'societe') {
    const s = client.societe;
    if (!s) {
      errors.societe = 'Les informations de la société sont requises';
      return { isValid: false, errors };
    }

    // 1. Raison Sociale
    if (!s.raisonSociale || !s.raisonSociale.trim()) {
      errors.societeRaison = 'La raison sociale de la société est obligatoire';
    } else if (s.raisonSociale.trim().length < 3) {
      errors.societeRaison = 'La raison sociale doit comporter au moins 3 caractères';
    } else if (isForbiddenClientName(s.raisonSociale)) {
      errors.societeRaison = 'Raison sociale générique interdite (« Chery », « Client », « Test » ne sont pas autorisés)';
    }

    // 2. Matricule Fiscale
    const mfCheck = validateMatriculeFiscale(s.matriculeFiscale || '');
    if (!mfCheck.valid) {
      errors.societeMatriculeFiscale = mfCheck.error || 'Matricule fiscale invalide';
    }

    // 3. Téléphone
    const phoneCheck = validatePhoneNumber(s.telephone || '');
    if (!phoneCheck.valid) {
      errors.societeTel = phoneCheck.error || 'Téléphone entreprise invalide';
    }

    // 4. Ville / Gouvernorat
    if (!s.ville || !s.ville.trim()) {
      errors.societeVille = 'Veuillez sélectionner le gouvernorat';
    }

    // 5. Adresse siège social
    const addressCheck = validatePhysicalAddress(s.adresse || '');
    if (!addressCheck.valid) {
      errors.societeAdresse = addressCheck.error || 'Adresse du siège social obligatoire';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Détecte si un bon de réservation existant est incomplet ou porte la mention factice "Chery Client"
 */
export function isReservationIncompleteOrDummy(res: Reservation): {
  isIncomplete: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  const client = res.client;

  if (!client) {
    return { isIncomplete: true, reasons: ['Données client manquantes'] };
  }

  if (client.type === 'personne_physique') {
    const p = client.personnePhysique;
    if (!p) {
      return { isIncomplete: true, reasons: ['Fiche client particulier absente'] };
    }

    const fullName = `${p.nom || ''} ${p.prenom || ''}`.trim();
    if (isForbiddenClientName(fullName) || isForbiddenClientName(p.nom || '') || isForbiddenClientName(p.prenom || '')) {
      reasons.push('Mention générique ou factice « Chery Client »');
    }

    if (!p.cin || p.cin.trim().length !== 8 || validateCinNumber(p.cin).valid === false) {
      reasons.push('N° CIN manquant ou incomplet (8 chiffres requis)');
    }

    if (!p.telephone || validatePhoneNumber(p.telephone).valid === false) {
      reasons.push('Téléphone manquant ou invalide');
    }

    if (!p.adresse || p.adresse.trim().length < 5) {
      reasons.push('Adresse physique manquante');
    }
  } else if (client.type === 'societe') {
    const s = client.societe;
    if (!s) {
      return { isIncomplete: true, reasons: ['Fiche société absente'] };
    }

    if (isForbiddenClientName(s.raisonSociale || '')) {
      reasons.push('Raison sociale générique ou factice');
    }

    if (!s.matriculeFiscale || s.matriculeFiscale.trim().length < 5) {
      reasons.push('Matricule fiscale manquante');
    }

    if (!s.telephone || validatePhoneNumber(s.telephone).valid === false) {
      reasons.push('Téléphone manquant ou invalide');
    }

    if (!s.adresse || s.adresse.trim().length < 5) {
      reasons.push('Adresse du siège social manquante');
    }
  }

  return {
    isIncomplete: reasons.length > 0,
    reasons,
  };
}
