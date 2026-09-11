import React, { useState, useEffect } from 'react';
import { Reservation, CommercialUser, UploadedDocument, Car as CarModel } from '../types';
import { evaluateLeasingStatus } from '../utils/leasingUtils';
import { compressImageDataUrl } from '../utils/imageCompressor';
import { calculateDeliveryDate, formatVoucherDate } from '../data/cheryData';
import { EditReservationModal } from './EditReservationModal';
import { recoverMissingReservationsFromAudit } from '../services/reservationRecovery';
import {
  Search,
  Filter,
  FileText,
  Printer,
  Building,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Car,
  Phone,
  Eye,
  FileCheck,
  Calendar,
  AlertCircle,
  Trash2,
  Download,
  FileSpreadsheet,
  RotateCcw,
  SlidersHorizontal,
  Upload,
  Sparkles,
  AlertTriangle,
  Edit3,
  Lock,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface ReservationListProps {
  reservations: Reservation[];
  cars?: CarModel[];
  currentCommercial: CommercialUser;
  onUpdateStatus: (reservationId: string, newStatus: Reservation['status']) => void;
  onEditReservation?: (updatedReservation: Reservation) => void;
  onDeleteReservation?: (reservationId: string) => void;
  onDeleteAllReservations?: () => void;
  onAddDocument?: (reservationId: string, doc: UploadedDocument) => void;
  onViewVoucher: (reservation: Reservation) => void;
  onViewDocument: (doc: UploadedDocument) => void;
}

export const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  cars = [],
  currentCommercial,
  onUpdateStatus,
  onEditReservation,
  onDeleteReservation,
  onDeleteAllReservations,
  onAddDocument,
  onViewVoucher,
  onViewDocument,
}) => {
  // Détection du niveau de privilèges : seuls les administrateurs et super-administrateurs peuvent voir toutes les réservations
  const isAdminOrSuperAdmin =
    currentCommercial.role === 'admin' || currentCommercial.role === 'super_admin';

  // Chaque commercial voit EXCLUSIVEMENT sa propre liste de bons de réservation
  // Seuls les administrateurs et super-administrateurs ont accès à l'ensemble du réseau
  const accessibleReservations = isAdminOrSuperAdmin
    ? reservations
    : reservations.filter((r) => {
        const matchId = Boolean(r.commercialId && currentCommercial.id && r.commercialId === currentCommercial.id);
        const matchName = Boolean(
          r.commercialName &&
          currentCommercial.name &&
          r.commercialName.trim().toLowerCase() === currentCommercial.name.trim().toLowerCase()
        );
        return matchId || matchName;
      });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'agency' | 'mine'>(isAdminOrSuperAdmin ? 'all' : 'mine');
  const [carModelFilter, setCarModelFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [reservationToConfirm, setReservationToConfirm] = useState<Reservation | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  // Sécurité renforcée : forcer le scope à "mine" pour les commerciaux non-administrateurs
  useEffect(() => {
    if (!isAdminOrSuperAdmin && scopeFilter !== 'mine') {
      setScopeFilter('mine');
    }
  }, [isAdminOrSuperAdmin, scopeFilter]);

  // Permission: modifier une réservation après validation
  const canEditValidated =
    currentCommercial.role === 'super_admin' ||
    Boolean(currentCommercial.permissions?.canEditValidatedReservations);

  // Dynamic dropdown lists basées sur les réservations accessibles
  const uniqueCarModels = Array.from(new Set(accessibleReservations.map((r) => r.carName))).sort();
  const uniqueAgencies = isAdminOrSuperAdmin
    ? Array.from(new Set(reservations.map((r) => r.agency))).filter(Boolean).sort()
    : [currentCommercial.agency].filter(Boolean);
  const paymentMethods = ['Espèces', 'Chèque Certifié', 'Virement Bancaire', 'Leasing'];

  // Handler: synchroniser et restaurer depuis la traçabilité
  const handleRunRecovery = async () => {
    setIsRecovering(true);
    setRecoveryMessage(null);
    try {
      const res = await recoverMissingReservationsFromAudit();
      const hasQuotaError = res.errors.some((e) => e.includes('Quota') || e.includes('quota'));
      if (res.recoveredCount > 0) {
        setRecoveryMessage(`✅ ${res.recoveredCount} réservation(s) manquante(s) restaurée(s) avec succès depuis la traçabilité.`);
      } else if (hasQuotaError) {
        setRecoveryMessage(`⚠️ Le quota de requêtes journalières Firestore est atteint. Vos réservations restent consultables et sécurisées dans la base locale.`);
      } else {
        setRecoveryMessage(`ℹ️ Traçabilité vérifiée : Toutes les réservations (${res.totalAuditEntriesScanned} actions auditées) sont déjà présentes.`);
      }
      setTimeout(() => setRecoveryMessage(null), 8000);
    } catch (err: any) {
      const isQuota =
        err?.code === 'resource-exhausted' ||
        err?.message?.includes('Quota') ||
        err?.message?.includes('quota');
      if (isQuota) {
        setRecoveryMessage(`⚠️ Quota de requêtes journalier Firestore atteint. Les réservations restent enregistrées et consultables localement.`);
      } else {
        setRecoveryMessage(`❌ Erreur de synchronisation: ${err?.message || 'Erreur inconnue'}`);
      }
    } finally {
      setIsRecovering(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setScopeFilter(isAdminOrSuperAdmin ? 'all' : 'mine');
    setCarModelFilter('all');
    setPaymentMethodFilter('all');
    setAgencyFilter('all');
    setDateStart('');
    setDateEnd('');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    (isAdminOrSuperAdmin && scopeFilter !== 'all') ||
    carModelFilter !== 'all' ||
    paymentMethodFilter !== 'all' ||
    (isAdminOrSuperAdmin && agencyFilter !== 'all') ||
    dateStart !== '' ||
    dateEnd !== '';

  // Filter and sort reservations: la dernière réservation modifiée ou créée en premier
  const filteredReservations = accessibleReservations
    .filter((res) => {
      let isOwner = true;
      if (isAdminOrSuperAdmin) {
        if (scopeFilter === 'agency') {
          isOwner = res.agency === currentCommercial.agency;
        } else if (scopeFilter === 'mine') {
          isOwner =
            res.commercialId === currentCommercial.id ||
            (res.commercialName && currentCommercial.name && res.commercialName.trim().toLowerCase() === currentCommercial.name.trim().toLowerCase());
        }
      }

      const clientName =
        res.client.type === 'personne_physique'
          ? `${res.client.personnePhysique?.nom || ''} ${res.client.personnePhysique?.prenom || ''}`
          : res.client.societe?.raisonSociale || '';

      const clientPhone =
        res.client.type === 'personne_physique'
          ? res.client.personnePhysique?.telephone || ''
          : res.client.societe?.telephone || '';

      const cinOrMf =
        res.client.type === 'personne_physique'
          ? res.client.personnePhysique?.cin || ''
          : res.client.societe?.matriculeFiscale || '';

      const matchesSearch =
        res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cinOrMf.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (res.agency && res.agency.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (res.notes && res.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
      const matchesModel =
        carModelFilter === 'all' ||
        res.carName === carModelFilter ||
        res.carName.toLowerCase().includes(carModelFilter.toLowerCase());
      const matchesPayment = paymentMethodFilter === 'all' || res.paymentMethod === paymentMethodFilter;
      const matchesAgency = !isAdminOrSuperAdmin || agencyFilter === 'all' || res.agency === agencyFilter;

      // Date range filter
      let matchesDate = true;
      if (dateStart || dateEnd) {
        const resDate = new Date(res.createdAt).getTime();
        if (dateStart) {
          const start = new Date(dateStart).getTime();
          if (resDate < start) matchesDate = false;
        }
        if (dateEnd) {
          const end = new Date(dateEnd).setHours(23, 59, 59, 999);
          if (resDate > end) matchesDate = false;
        }
      }

      return isOwner && matchesSearch && matchesStatus && matchesModel && matchesPayment && matchesAgency && matchesDate;
    })
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      if (timeB !== timeA) {
        return timeB - timeA; // Dernière modifiée/créée en premier
      }
      return b.id.localeCompare(a.id);
    });

  // Export to Excel / CSV file compatible with Microsoft Excel
  const exportToExcel = () => {
    if (filteredReservations.length === 0) {
      alert('Aucune réservation à exporter pour les filtres sélectionnés.');
      return;
    }

    const headers = [
      'N° Bon de Commande',
      'Date Réservation',
      'Type Client',
      'Nom Client / Raison Sociale',
      'CIN / Matricule Fiscale',
      'Téléphone Client',
      'Email Client',
      'Ville / Gouvernorat',
      'Modèle Chery',
      'Couleur Extérieure',
      'Couleur Intérieure / Habillage',
      'Prix Véhicule TTC (TND)',
      'Frais Immatriculation (TND)',
      'Montant Total TTC (TND)',
      'Acompte Versé (TND)',
      'Solde Reste à Payer (TND)',
      'Mode de Règlement',
      'Commercial Saisi',
      'Showroom / Agence',
      'Statut Réservation',
      'Nombre de Justificatifs',
      'Date Livraison Prévue',
      'Remarques / Notes',
    ];

    const rows = filteredReservations.map((res) => {
      const isSociete = res.client.type === 'societe';
      const clientName = isSociete
        ? res.client.societe?.raisonSociale || ''
        : `${res.client.personnePhysique?.nom || ''} ${res.client.personnePhysique?.prenom || ''}`.trim();

      const cinOrMf = isSociete
        ? res.client.societe?.matriculeFiscale || ''
        : res.client.personnePhysique?.cin || '';

      const phone = isSociete
        ? res.client.societe?.telephone || ''
        : res.client.personnePhysique?.telephone || '';

      const email = isSociete
        ? res.client.societe?.email || ''
        : res.client.personnePhysique?.email || '';

      const ville = isSociete
        ? res.client.societe?.ville || ''
        : res.client.personnePhysique?.ville || '';

      const totalTND = res.priceTND + (res.registrationFeeTND || 0);
      const resteTND = totalTND - res.depositPaidTND;

      return [
        `"${res.id}"`,
        `"${new Date(res.createdAt).toLocaleDateString('fr-FR')}"`,
        `"${isSociete ? 'Société' : 'Personne Physique'}"`,
        `"${clientName.replace(/"/g, '""')}"`,
        `"${cinOrMf.replace(/"/g, '""')}"`,
        `"${phone}"`,
        `"${email}"`,
        `"${ville}"`,
        `"${res.carName.replace(/"/g, '""')}"`,
        `"${res.colorChosen?.name || ''}"`,
        `"${res.interiorColorChosen?.name || 'Habillage de série'}"`,
        res.priceTND,
        res.registrationFeeTND || 0,
        totalTND,
        res.depositPaidTND,
        resteTND,
        `"${res.paymentMethod}"`,
        `"${res.commercialName.replace(/"/g, '""')}"`,
        `"${res.agency.replace(/"/g, '""')}"`,
        `"${res.status}"`,
        res.documents ? res.documents.length : 0,
        `"${res.expectedDeliveryDate || ''}"`,
        `"${(res.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    // UTF-8 BOM for Microsoft Excel compatibility + Semicolon delimiter
    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Reservations_Chery_Tunisie_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'Confirmée':
        return (
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmée
          </span>
        );
      case 'En attente':
        return (
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> En attente
          </span>
        );
      case 'Livrée':
        return (
          <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold flex items-center gap-1">
            <Car className="w-3.5 h-3.5" /> Livrée
          </span>
        );
      case 'Annulée':
        return (
          <span className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg text-xs font-bold flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Annulée
          </span>
        );
      default:
        return null;
    }
  };

  const handleQuickUploadBonCommande = (resId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onAddDocument) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const rawDataUrl = reader.result as string;
      const compressedDataUrl = file.type.startsWith('image/')
        ? await compressImageDataUrl(rawDataUrl, 1200, 1200, 0.8)
        : rawDataUrl;

      let finalUrl = compressedDataUrl;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileData: compressedDataUrl })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (_) {}

      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      const newDoc: UploadedDocument = {
        id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        name: file.name,
        category: 'bon_commande',
        fileType: file.type,
        dataUrl: finalUrl,
        sizeFormatted: sizeFormatted,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      onAddDocument(resId, newDoc);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Compute Leasing statistics sur les réservations accessibles
  const leasingEvals = accessibleReservations.map((r) => ({ reservation: r, eval: evaluateLeasingStatus(r) }));
  const validatedLeasingCount = leasingEvals.filter((x) => x.eval.state === 'VALIDATED').length;
  const provisionalLeasingCount = leasingEvals.filter((x) => x.eval.state === 'PROVISIONAL_ACTIVE').length;
  const gracePeriodLeasingCount = leasingEvals.filter((x) => x.eval.state === 'GRACE_PERIOD_ACTIVE').length;
  const expiredLeasingCount = leasingEvals.filter((x) => x.eval.state === 'EXPIRED_CANCELLED').length;

  return (
    <div className="space-y-6">
      {/* Header with Title & Excel Export Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {isAdminOrSuperAdmin
                  ? 'Liste des Bons de Réservation & Commandes (Réseau National)'
                  : 'Mes Bons de Réservation Personnels'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAdminOrSuperAdmin
                  ? `${filteredReservations.length} sur ${reservations.length} réservation(s) affichée(s) • Administration STA`
                  : `${filteredReservations.length} sur ${accessibleReservations.length} réservation(s) affichée(s) • Conseiller : ${currentCommercial.name} (${currentCommercial.agency})`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Synchroniser Traçabilité Button */}
          <button
            onClick={handleRunRecovery}
            disabled={isRecovering}
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-blue-950/80 hover:bg-blue-800 text-blue-200 hover:text-white font-bold text-xs rounded-xl shadow border border-blue-700/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Vérifier la traçabilité et restaurer automatiquement les réservations manquantes"
          >
            <RefreshCw className={`w-4 h-4 ${isRecovering ? 'animate-spin text-blue-300' : 'text-blue-400'}`} />
            <span>{isRecovering ? 'Synchronisation...' : 'Synchroniser Traçabilité'}</span>
          </button>

          {/* Bouton de suppression totale : STRICTEMENT réservé aux Administrateurs et Super-Administrateurs */}
          {isAdminOrSuperAdmin && onDeleteAllReservations && reservations.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les réservations de la base de données ? Cette action effacera définitivement l\'historique des réservations de test.')) {
                  onDeleteAllReservations();
                }
              }}
              className="px-3 py-2.5 bg-red-950/80 hover:bg-red-700 text-red-300 hover:text-white font-bold text-xs rounded-xl shadow border border-red-800/80 hover:border-red-500 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Supprimer toutes les réservations du réseau (Admin uniquement)"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Supprimer tout</span>
            </button>
          )}

          {/* Export Excel Button */}
          <button
            onClick={exportToExcel}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-900/40 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            title={isAdminOrSuperAdmin ? "Exporter toutes les données affichées dans un fichier Excel (.CSV)" : "Exporter mes réservations dans un fichier Excel (.CSV)"}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exporter en Excel (.CSV)</span>
          </button>
        </div>
      </div>

      {/* Recovery notification message */}
      {recoveryMessage && (
        <div className="p-3.5 bg-blue-950 border border-blue-700 rounded-xl text-xs text-blue-200 flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            {recoveryMessage}
          </span>
          <button onClick={() => setRecoveryMessage(null)} className="text-blue-400 hover:text-white ml-3 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* AUTOMATED LEASING RULES SUMMARY BANNER */}
      <div className="bg-slate-900 border border-indigo-900/50 p-4 rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Suivi Automatisé des Dossiers Leasing (Règles Chery STA)
            </h3>
          </div>
          <span className="text-[10px] text-indigo-300 font-mono bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
            Automatisations Actives
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex flex-col">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">
              Cas n°1 : Validés (Bon Commande)
            </span>
            <span className="text-lg font-extrabold text-emerald-300 font-mono">
              {validatedLeasingCount}
            </span>
            <span className="text-[10px] text-slate-400">Réservation confirmée</span>
          </div>

          <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xl flex flex-col">
            <span className="text-[10px] text-amber-400 font-bold uppercase">
              Cas n°2 : Provisoires (5j)
            </span>
            <span className="text-lg font-extrabold text-amber-300 font-mono">
              {provisionalLeasingCount}
            </span>
            <span className="text-[10px] text-slate-400">Accord leasing uniquement</span>
          </div>

          <div className="p-2.5 bg-red-950/50 border border-red-700/80 rounded-xl flex flex-col">
            <span className="text-[10px] text-red-300 font-bold uppercase flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400" /> Délai Grâce (+2j)
            </span>
            <span className="text-lg font-extrabold text-red-200 font-mono">
              {gracePeriodLeasingCount}
            </span>
            <span className="text-[10px] text-red-300">Action commerciale requise</span>
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Expirés / Annulés (5+2j)
            </span>
            <span className="text-lg font-extrabold text-slate-300 font-mono">
              {expiredLeasingCount}
            </span>
            <span className="text-[10px] text-slate-500">Auto-annulés</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Row 1: Search + Main Status Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par N° Bon, Client, Téléphone, CIN / M.F, Commercial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Scope and Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Scope Selector: Administrateurs et Super-Administrateurs uniquement */}
            {isAdminOrSuperAdmin ? (
              <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-medium shrink-0">
                <button
                  onClick={() => setScopeFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                    scopeFilter === 'all' ? 'bg-red-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Afficher toutes les réservations nationales (Vue Administrateur)"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Toutes ({reservations.length})</span>
                </button>
                <button
                  onClick={() => setScopeFilter('agency')}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                    scopeFilter === 'agency' ? 'bg-slate-700 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Afficher uniquement mon agence"
                >
                  <Building className="w-3.5 h-3.5 text-slate-300" />
                  <span>Mon agence ({reservations.filter((r) => r.agency === currentCommercial.agency).length})</span>
                </button>
                <button
                  onClick={() => setScopeFilter('mine')}
                  className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                    scopeFilter === 'mine' ? 'bg-slate-700 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Afficher uniquement mes réservations personnelles"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-300" />
                  <span>Mes réservations ({reservations.filter((r) => r.commercialId === currentCommercial.id || (r.commercialName && currentCommercial.name && r.commercialName.trim().toLowerCase() === currentCommercial.name.trim().toLowerCase())).length})</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 border border-emerald-800/40 rounded-xl text-xs font-semibold text-emerald-300 shrink-0">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mes réservations ({accessibleReservations.length})</span>
                <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-normal hidden sm:inline">
                  {currentCommercial.name}
                </span>
              </div>
            )}

            {/* Status Filter */}
            <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-medium shrink-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'all' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tous ({accessibleReservations.length})
              </button>
              <button
                onClick={() => setStatusFilter('En attente')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'En attente' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                En attente ({accessibleReservations.filter((r) => r.status === 'En attente').length})
              </button>
              <button
                onClick={() => setStatusFilter('Confirmée')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'Confirmée' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Confirmées ({accessibleReservations.filter((r) => r.status === 'Confirmée').length})
              </button>
              <button
                onClick={() => setStatusFilter('Livrée')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'Livrée' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Livrées ({accessibleReservations.filter((r) => r.status === 'Livrée').length})
              </button>
              <button
                onClick={() => setStatusFilter('Annulée')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'Annulée' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annulées ({accessibleReservations.filter((r) => r.status === 'Annulée').length})
              </button>
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                showAdvancedFilters || hasActiveFilters
                  ? 'bg-red-950/50 border-red-500/50 text-red-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* Row 2: Advanced Dropdown Filters */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Filter Modèle */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Modèle Chery :</label>
              <select
                value={carModelFilter}
                onChange={(e) => setCarModelFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">Tous les modèles Chery</option>
                {uniqueCarModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Mode de Paiement */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mode de Paiement :</label>
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="all">Tous les modes de règlement</option>
                {paymentMethods.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Agence (uniquement pour les administrateurs) */}
            {isAdminOrSuperAdmin && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Agence / Showroom :</label>
                <select
                  value={agencyFilter}
                  onChange={(e) => setAgencyFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="all">Toutes les agences</option>
                  {uniqueAgencies.map((ag) => (
                    <option key={ag} value={ag}>
                      {ag}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Période du / au :</label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-1.5 py-1 text-[11px] text-white focus:outline-none"
                />
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-1.5 py-1 text-[11px] text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Bar & Sorting Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Tri automatique : <strong className="text-slate-200 font-semibold">Dernières réservations modifiées en premier</strong></span>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <span className="text-slate-400 italic text-[11px]">
                {filteredReservations.length} résultat(s) correspondant(s)
              </span>
              <button
                onClick={handleResetFilters}
                className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser les filtres</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reservation Cards List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {accessibleReservations.length === 0
                ? isAdminOrSuperAdmin
                  ? 'Aucune réservation enregistrée dans le réseau'
                  : 'Aucun bon de réservation à votre nom'
                : 'Aucune réservation trouvée'}
            </h3>
            <p className="text-xs max-w-md mx-auto text-slate-400">
              {accessibleReservations.length === 0
                ? isAdminOrSuperAdmin
                  ? 'Toutes les réservations ont été supprimées ou aucune réservation n\'a encore été créée sur le réseau.'
                  : `Vous n'avez pas encore créé de bon de réservation pour votre agence (${currentCommercial.agency}). Vos réservations apparaîtront ici dès leur enregistrement.`
                : 'Ajustez vos filtres de recherche ou réinitialisez les paramètres.'}
            </p>
            {hasActiveFilters && accessibleReservations.length > 0 && (
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-red-400" />
                <span>Réinitialiser les filtres</span>
              </button>
            )}
          </div>
        ) : (
          filteredReservations.map((res) => {
            const isSociete = res.client.type === 'societe';
            const physique = res.client.personnePhysique;
            const societe = res.client.societe;
            const leasingEval = evaluateLeasingStatus(res);
            const isValidated = res.status === 'Confirmée' || res.status === 'Livrée';
            const isEditRestricted = isValidated && !canEditValidated;

            return (
              <div
                key={res.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md hover:border-slate-700 transition-all space-y-4"
              >
                {/* Top Row: Res ID, Date, Status, Commercial */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-red-400 font-mono text-xs font-extrabold rounded-lg">
                      {res.id}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(res.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {res.updatedAt && res.updatedAt !== res.createdAt && (
                      <span
                        className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium shadow-sm"
                        title={`Dernière modification : ${new Date(res.updatedAt).toLocaleString('fr-FR')}`}
                      >
                        <Clock className="w-3 h-3 text-amber-400" />
                        Modifiée le {new Date(res.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} à {new Date(res.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                    {getStatusBadge(res.status)}

                    {/* Si la réservation est en attente : Bouton de Confirmation à la place de la liste déroulante */}
                    {res.status === 'En attente' ? (
                      <button
                        type="button"
                        onClick={() => setReservationToConfirm(res)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-emerald-900/40 border border-emerald-500/40 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                        title="Confirmer cette réservation"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmer</span>
                      </button>
                    ) : isAdminOrSuperAdmin ? (
                      /* Administrateurs uniquement : possibilité de marquer comme Livrée ou Annulée une fois confirmée */
                      <div className="relative">
                        <select
                          value={res.status}
                          onChange={(e) => onUpdateStatus(res.id, e.target.value as any)}
                          title="Gestion statut (Administration STA)"
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                        >
                          <option value="Confirmée">Confirmée</option>
                          <option value="Livrée">Livrée</option>
                          <option value="Annulée">Annulée</option>
                        </select>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* AUTOMATED LEASING STATUS BADGER BANNER */}
                {leasingEval.isLeasing && (
                  <div className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm ${leasingEval.badgeColorClass}`}>
                    <div className="space-y-0.5">
                      <div className="font-extrabold flex items-center gap-1.5 text-sm">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>{leasingEval.badgeTitle}</span>
                      </div>
                      <p className="text-[11px] opacity-90">{leasingEval.badgeSubtext}</p>
                      {leasingEval.notificationMessage && (
                        <p className="text-[11px] font-bold mt-1 bg-black/20 p-1.5 rounded border border-current/20">
                          {leasingEval.notificationMessage}
                        </p>
                      )}
                    </div>

                    {(leasingEval.state === 'PROVISIONAL_ACTIVE' || leasingEval.state === 'GRACE_PERIOD_ACTIVE') && (
                      <label className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md border border-emerald-400/40 flex items-center gap-1.5 cursor-pointer transition-all shrink-0">
                        <Upload className="w-4 h-4" />
                        <span>➕ Imprimer / Joindre Bon de Commande</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => handleQuickUploadBonCommande(res.id, e)}
                        />
                      </label>
                    )}
                  </div>
                )}

                {/* Grid 3 Columns: Client Details, Car Specs, Financials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Column 1: Client Info */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-300 font-bold uppercase text-[11px] border-b border-slate-800 pb-1">
                      {isSociete ? (
                        <Building className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span>
                        Client : {isSociete ? 'Société / Personne Morale' : 'Personne Physique'}
                      </span>
                    </div>

                    {!isSociete && physique ? (
                      <div className="space-y-1 text-slate-300">
                        <p className="font-bold text-white text-sm">
                          {physique.nom} {physique.prenom}
                        </p>
                        <p>
                          CIN : <strong className="font-mono text-red-300">{physique.cin}</strong>
                        </p>
                        <p className="flex items-center gap-1 text-slate-400">
                          <Phone className="w-3 h-3" /> {physique.telephone}
                        </p>
                        <p className="text-slate-400">Ville : {physique.ville}</p>
                      </div>
                    ) : isSociete && societe ? (
                      <div className="space-y-1 text-slate-300">
                        <p className="font-bold text-white text-sm">{societe.raisonSociale}</p>
                        <p>
                          M.F. : <strong className="font-mono text-amber-300">{societe.matriculeFiscale}</strong>
                        </p>
                        {societe.gerantNomPrenom && (
                          <p className="text-slate-400">
                            Gérant : {societe.gerantNomPrenom} {societe.gerantCin ? `(CIN: ${societe.gerantCin})` : ''}
                          </p>
                        )}
                        <p className="flex items-center gap-1 text-slate-400">
                          <Phone className="w-3 h-3" /> {societe.telephone}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {/* Column 2: Car & Color Chosen */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-300 font-bold uppercase text-[11px] border-b border-slate-800 pb-1">
                      <Car className="w-3.5 h-3.5 text-red-400" />
                      <span>Véhicule Réservé</span>
                    </div>

                    <div className="space-y-1 text-slate-300">
                      <p className="font-bold text-white text-sm">{res.carName}</p>

                      {/* Color swatches */}
                      <div className="space-y-1.5 py-1">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px] w-20 shrink-0">Extérieur :</span>
                          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block shadow-inner"
                              style={{ backgroundColor: res.colorChosen.hexCode }}
                            />
                            <strong className="text-white text-[11px]">{res.colorChosen.name}</strong>
                          </div>
                        </div>

                        {res.interiorColorChosen && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-[11px] w-20 shrink-0">Intérieur :</span>
                            <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-300">
                              <span
                                className="w-3.5 h-3.5 rounded-md border border-slate-600 inline-block shadow-inner"
                                style={{ backgroundColor: res.interiorColorChosen.hexCode }}
                              />
                              <strong className="text-amber-200 text-[11px]">{res.interiorColorChosen.name}</strong>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ETA & Estimated Delivery Date */}
                      <div className="pt-1.5 border-t border-slate-800/80 text-[11px] space-y-0.5">
                        {res.etaDate && (
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>Arrivage (ETA) :</span>
                            </span>
                            <span className="font-mono text-slate-300">{formatVoucherDate(res.etaDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-emerald-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-emerald-400" />
                            <span>Livraison estimée :</span>
                          </span>
                          <span className="font-mono bg-emerald-950/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            {formatVoucherDate(
                              res.expectedDeliveryDate ||
                                calculateDeliveryDate(res.etaDate || res.createdAt?.slice(0, 10), 30)
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-400 pt-1">
                        Commercial : <strong className="text-slate-200">{res.commercialName}</strong> ({res.agency})
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Financials & Documents Attached */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-300 font-bold uppercase text-[11px] border-b border-slate-800 pb-1">
                        <span>Finances & Acompte</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {res.depositPaidTND.toLocaleString()} TND versé
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-300 pt-1">
                        <p className="flex justify-between">
                          <span className="text-slate-400">Prix Véhicule TTC :</span>
                          <span className="font-mono font-bold">{res.priceTND.toLocaleString()} TND</span>
                        </p>
                        <p className="flex justify-between text-slate-400">
                          <span>Règlement Acompte :</span>
                          <span>{res.paymentMethod}</span>
                        </p>
                        <p className="flex justify-between text-red-400 font-bold pt-1 border-t border-slate-800">
                          <span>Reste à payer :</span>
                          <span className="font-mono">
                            {(res.priceTND + res.registrationFeeTND - res.depositPaidTND).toLocaleString()} TND
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Attached docs count badge */}
                    {res.documents && res.documents.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                          Pièces ({res.documents.length}) :
                        </span>
                        {res.documents.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onViewDocument(doc)}
                            className="p-1 bg-slate-900 border border-slate-800 hover:border-red-500 rounded-md text-[10px] text-slate-300 truncate max-w-[120px] transition-colors cursor-pointer flex items-center gap-1"
                            title={`Voir ${doc.name}`}
                          >
                            <FileCheck className="w-3 h-3 text-red-400 shrink-0" />
                            <span className="truncate">{doc.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-500 italic truncate max-w-[50%]">
                    {res.notes ? `Note : ${res.notes}` : 'Aucune remarque spécifique'}
                  </span>

                  <div className="flex items-center gap-2">
                    {onDeleteReservation && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Voulez-vous vraiment supprimer la réservation N° ${res.id} (${res.carName}) ?`)) {
                            onDeleteReservation(res.id);
                          }
                        }}
                        className="px-3 py-2 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Supprimer la réservation de la base de données"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Supprimer</span>
                      </button>
                    )}

                    {onEditReservation && (
                      <button
                        onClick={() => setEditingReservation(res)}
                        className={`px-3.5 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                          isEditRestricted
                            ? 'bg-slate-950 text-slate-400 border-slate-800 hover:border-amber-500/40 hover:text-amber-300'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-800 hover:border-slate-700'
                        }`}
                        title={
                          isEditRestricted
                            ? 'Réservation validée : modification verrouillée selon les droits de votre profil'
                            : 'Modifier les informations du dossier / bon de commande'
                        }
                      >
                        {isEditRestricted ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>Modifier</span>
                      </button>
                    )}

                    {res.status === 'Confirmée' || res.status === 'Livrée' ? (
                      <button
                        onClick={() => onViewVoucher(res)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow"
                        title="Imprimer le bon officiel de réservation"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Imprimer Bon de Réservation</span>
                      </button>
                    ) : (
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => {
                            alert("Impression impossible : Le bon de réservation officiel ne peut être imprimé que lorsque la réservation est confirmée.");
                          }}
                          className="px-3.5 py-2 bg-slate-950/70 text-slate-500 hover:text-amber-300 hover:border-amber-500/40 border border-slate-800 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
                          title="Impression bloquée : la réservation doit être confirmée au préalable"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-500/80" />
                          <Printer className="w-4 h-4 text-slate-500" />
                          <span>Impression bloquée ({res.status})</span>
                        </button>
                        <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-72 p-2.5 bg-slate-950/95 border border-amber-500/50 text-amber-200 text-[11px] rounded-xl shadow-2xl z-30 pointer-events-none backdrop-blur-sm">
                          <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Règle d'impression :</span>
                          </div>
                          L'impression du bon de réservation est <strong>strictement réservée aux réservations confirmées</strong>. Passez le statut à « Confirmée » pour débloquer l'impression.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Reservation Modal */}
      {editingReservation && (
        <EditReservationModal
          isOpen={true}
          reservation={editingReservation}
          cars={cars}
          onClose={() => setEditingReservation(null)}
          onSave={(updated) => {
            if (onEditReservation) {
              onEditReservation(updated);
            }
            setEditingReservation(null);
          }}
          canEditValidated={canEditValidated}
          currentCommercial={currentCommercial}
        />
      )}
      {/* Modal de Confirmation de Réservation */}
      {reservationToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Confirmation de la réservation
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Bon N° <span className="text-red-400 font-bold">{reservationToConfirm.id}</span>
                {' • '}
                <span className="text-slate-200 font-medium">{reservationToConfirm.carName}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-center space-y-2">
              <p className="text-slate-200 text-sm leading-relaxed font-medium">
                Êtes-vous sûr de vouloir confirmer cette réservation ? Si vous confirmez, vous ne pourrez plus modifier ce bon de réservation.
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Client :</span>
                <strong className="text-slate-200">
                  {reservationToConfirm.client.type === 'societe'
                    ? reservationToConfirm.client.societe?.raisonSociale
                    : `${reservationToConfirm.client.personnePhysique?.nom || ''} ${reservationToConfirm.client.personnePhysique?.prenom || ''}`}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setReservationToConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Non
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(reservationToConfirm.id, 'Confirmée');
                  setReservationToConfirm(null);
                }}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-900/40 border border-emerald-500/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Oui</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
