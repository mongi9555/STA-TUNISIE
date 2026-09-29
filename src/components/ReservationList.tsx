import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Reservation, CommercialUser, UploadedDocument, Car as CarModel, DeletedReservationItem } from '../types';
import { evaluateLeasingStatus } from '../utils/leasingUtils';
import { compressImageDataUrl } from '../utils/imageCompressor';
import { calculateDeliveryDate, formatVoucherDate } from '../data/cheryData';
import { EditReservationModal } from './EditReservationModal';
import { recoverMissingReservationsFromAudit } from '../services/reservationRecovery';
import { importReservationsFromCsv, CsvImportResult } from '../services/csvReservationImporter';
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
  ArrowLeft,
} from 'lucide-react';

interface ReservationListProps {
  reservations: Reservation[];
  cars?: CarModel[];
  commercials?: CommercialUser[];
  currentCommercial: CommercialUser;
  trashReservations?: DeletedReservationItem[];
  onRestoreReservation?: (reservationId: string) => void;
  onPermanentDeleteReservation?: (reservationId: string) => void;
  onEmptyTrash?: () => void;
  onUpdateStatus: (reservationId: string, newStatus: Reservation['status']) => void;
  onEditReservation?: (updatedReservation: Reservation) => void;
  onDeleteReservation?: (reservationId: string) => void;
  onDeleteAllReservations?: () => void;
  onAddDocument?: (reservationId: string, doc: UploadedDocument) => void;
  onViewVoucher: (reservation: Reservation) => void;
  onViewDocument: (doc: UploadedDocument) => void;
  onSyncReservations?: () => Promise<{ success: boolean; message: string; count: number }>;
  onImportReservations?: (imported: Reservation[]) => Promise<{ success: boolean; message: string; count: number }> | void;
}

export const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  cars = [],
  commercials = [],
  currentCommercial,
  trashReservations = [],
  onRestoreReservation,
  onPermanentDeleteReservation,
  onEmptyTrash,
  onUpdateStatus,
  onEditReservation,
  onDeleteReservation,
  onDeleteAllReservations,
  onAddDocument,
  onViewVoucher,
  onViewDocument,
  onSyncReservations,
  onImportReservations,
}) => {
  // Détection du niveau de privilèges : seuls les administrateurs et super-administrateurs peuvent voir toutes les réservations
  const isAdminOrSuperAdmin =
    currentCommercial.role === 'admin' || currentCommercial.role === 'super_admin';

  // Mode d'affichage : Réservations Actives ou Corbeille
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');
  const [trashSearchTerm, setTrashSearchTerm] = useState('');

  // Helper: Détection intelligente de correspondance d'agence
  const isSameAgency = (agency1?: string, agency2?: string): boolean => {
    if (!agency1 || !agency2) return false;
    const a1 = agency1.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const a2 = agency2.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (a1 === a2) return true;
    if (a1.includes('siege') && a2.includes('siege')) return true;
    if (a1.includes('sfax') && a2.includes('sfax')) return true;
    if (a1.includes('nabeul') && a2.includes('nabeul')) return true;
    if (a1.includes('sousse') && a2.includes('sousse')) return true;
    if (a1.includes('djerba') && a2.includes('djerba')) return true;
    if (a1.includes('charguia') && a2.includes('charguia')) return true;
    if (a1.includes('zaghouen') && a2.includes('zaghouen')) return true;
    if (a1.includes('gabes') && a2.includes('gabes')) return true;
    return a1.includes(a2) || a2.includes(a1);
  };

  // Helper: Détection intelligente de correspondance de commercial
  const isSameCommercial = (resCommercialId?: string, resCommercialName?: string, commercial?: CommercialUser): boolean => {
    if (!commercial) return false;
    if (resCommercialId && commercial.id && resCommercialId === commercial.id) return true;
    if (resCommercialName && commercial.name) {
      const n1 = resCommercialName.trim().toLowerCase();
      const n2 = commercial.name.trim().toLowerCase();
      if (n1 === n2 || n1.includes(n2) || n2.includes(n1)) return true;
    }
    return false;
  };

  // Base complète des réservations pour permettre le filtrage dynamique par onglet
  const accessibleReservations = reservations;

  const myReservationsCount = reservations.filter((r) =>
    isSameCommercial(r.commercialId, r.commercialName, currentCommercial)
  ).length;

  const myAgencyReservationsCount = reservations.filter((r) =>
    isSameAgency(r.agency, currentCommercial.agency)
  ).length;

  const allReservationsCount = reservations.length;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'agency' | 'mine'>('all');
  const [commercialFilter, setCommercialFilter] = useState<string>('all');
  const [carModelFilter, setCarModelFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [quickDateFilter, setQuickDateFilter] = useState<string>('all');

  // Distribution dynamique et exhaustive de toutes les dates réelles présentes dans la base de données
  const dateDistribution = useMemo(() => {
    const dayMap = new Map<string, number>();
    const monthMap = new Map<string, number>();

    accessibleReservations.forEach((r) => {
      const d = (r.createdAt || '').slice(0, 10);
      if (d) {
        dayMap.set(d, (dayMap.get(d) || 0) + 1);
        const m = d.slice(0, 7); // YYYY-MM
        monthMap.set(m, (monthMap.get(m) || 0) + 1);
      }
    });

    const sortedDays = Array.from(dayMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, count]) => {
        const dObj = new Date(date + 'T12:00:00Z');
        const formatted = dObj.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
        });
        return { date, count, label: formatted };
      });

    const sortedMonths = Array.from(monthMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, count]) => {
        const [year, m] = month.split('-');
        const mDate = new Date(parseInt(year, 10), parseInt(m, 10) - 1, 1);
        const label = mDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        return { month, count, label: label.charAt(0).toUpperCase() + label.slice(1) };
      });

    return { dayMap, monthMap, sortedDays, sortedMonths };
  }, [accessibleReservations]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [reservationToConfirm, setReservationToConfirm] = useState<Reservation | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  // States pour l'importation de fichiers CSV
  const [csvImportResult, setCsvImportResult] = useState<CsvImportResult | null>(null);
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [isImportingCsv, setIsImportingCsv] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Permission: modifier une réservation après validation
  const canEditValidated =
    currentCommercial.role === 'super_admin' ||
    Boolean(currentCommercial.permissions?.canEditValidatedReservations);

  // Dynamic dropdown lists basées sur les réservations accessibles
  const uniqueCarModels = Array.from(new Set(accessibleReservations.map((r) => r.carName))).sort();
  const uniqueAgencies = Array.from(new Set(reservations.map((r) => r.agency))).filter(Boolean).sort();
  const paymentMethods = ['Espèces', 'Chèque Certifié', 'Virement Bancaire', 'Dossier Bancaire', 'Leasing'];

  // Dynamic list of unique commercials with their active reservation count
  const uniqueCommercials = useMemo(() => {
    const map = new Map<string, { id?: string; name: string; agency?: string; count: number }>();

    // 1. From reservations
    reservations.forEach((r) => {
      const name = (r.commercialName || '').trim();
      if (!name) return;
      const key = name.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.agency && r.agency) existing.agency = r.agency;
        if (!existing.id && r.commercialId) existing.id = r.commercialId;
      } else {
        map.set(key, {
          id: r.commercialId,
          name: name,
          agency: r.agency || '',
          count: 1,
        });
      }
    });

    // 2. From commercials prop
    if (commercials && commercials.length > 0) {
      commercials.forEach((c) => {
        if (!c.name || !c.name.trim()) return;
        const key = c.name.trim().toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            id: c.id,
            name: c.name.trim(),
            agency: c.agency || '',
            count: 0,
          });
        }
      });
    }

    return Array.from(map.values()).sort((a, b) => {
      // Show commercials with reservations first (descending count), then alphabetical
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
    });
  }, [reservations, commercials]);

  // Handler for commercial filter change (ensures scope is all so results aren't accidentally hidden by mine/agency)
  const handleCommercialFilterChange = (val: string) => {
    setCommercialFilter(val);
    if (val !== 'all' && scopeFilter !== 'all') {
      setScopeFilter('all');
    }
  };

  // Handler: synchroniser et restaurer depuis la traçabilité et la base en ligne
  const handleRunRecovery = async () => {
    setIsRecovering(true);
    setRecoveryMessage(null);
    try {
      if (onSyncReservations) {
        const res = await onSyncReservations();
        setRecoveryMessage(res.message);
      } else {
        const resp = await fetch('/api/reservations/recover', { method: 'POST' });
        const data = await resp.json();
        if (data && data.success) {
          if (data.recoveredCount > 0) {
            setRecoveryMessage(`✅ ${data.recoveredCount} bon(s) de réservation manquant(s) restauré(s) avec succès ! Total : ${data.totalCount} réservations.`);
          } else {
            setRecoveryMessage(`ℹ️ Base en ligne 100% synchronisée : Les ${data.totalCount} réservations sont toutes enregistrées et sécurisées.`);
          }
        } else {
          // Fallback audit local
          const localRes = await recoverMissingReservationsFromAudit();
          if (localRes.recoveredCount > 0) {
            setRecoveryMessage(`✅ ${localRes.recoveredCount} réservation(s) restaurée(s) depuis la traçabilité.`);
          } else {
            setRecoveryMessage(`ℹ️ Traçabilité vérifiée : Les réservations sont à jour.`);
          }
        }
      }
      setTimeout(() => setRecoveryMessage(null), 8000);
    } catch (err: any) {
      setRecoveryMessage(`⚠️ Erreur de synchronisation : ${err?.message || 'Erreur inconnue'}`);
    } finally {
      setIsRecovering(false);
    }
  };

  // Handler: Sélection d'un fichier CSV pour importation
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || !text.trim()) {
          alert('Le fichier sélectionné est vide.');
          return;
        }

        const result = importReservationsFromCsv(text, cars, currentCommercial, reservations);
        if (result.reservations.length === 0) {
          alert(
            `Aucune réservation valide n'a pu être extraite du fichier CSV.\n\n` +
              (result.errors.length > 0 ? result.errors.slice(0, 3).join('\n') : 'Veuillez vérifier le contenu du fichier.')
          );
          return;
        }

        setCsvImportResult(result);
      } catch (err: any) {
        alert(`Erreur de lecture du fichier CSV : ${err.message || 'Format non reconnu'}`);
      } finally {
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Handler: Validation finale et fusion des réservations importées
  const handleConfirmCsvImport = async () => {
    if (!csvImportResult || csvImportResult.reservations.length === 0) return;
    setIsImportingCsv(true);
    try {
      if (onImportReservations) {
        const res = await onImportReservations(csvImportResult.reservations);
        if (res && res.message) {
          setRecoveryMessage(res.message);
          setTimeout(() => setRecoveryMessage(null), 8000);
        }
      } else {
        await fetch('/api/reservations/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservations: csvImportResult.reservations }),
        });
        setRecoveryMessage(`✅ ${csvImportResult.reservations.length} réservation(s) importée(s) avec succès.`);
        setTimeout(() => setRecoveryMessage(null), 8000);
      }
      setCsvImportResult(null);
    } catch (err: any) {
      alert(`Erreur lors de l'enregistrement de l'import CSV : ${err.message || 'Erreur réseau'}`);
    } finally {
      setIsImportingCsv(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setScopeFilter('all');
    setCommercialFilter('all');
    setCarModelFilter('all');
    setPaymentMethodFilter('all');
    setAgencyFilter('all');
    setDateStart('');
    setDateEnd('');
    setQuickDateFilter('all');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    scopeFilter !== 'all' ||
    commercialFilter !== 'all' ||
    carModelFilter !== 'all' ||
    paymentMethodFilter !== 'all' ||
    agencyFilter !== 'all' ||
    dateStart !== '' ||
    dateEnd !== '' ||
    quickDateFilter !== 'all';

  // Filter and sort reservations: la dernière réservation modifiée ou créée en premier
  const filteredReservations = accessibleReservations
    .filter((res) => {
      let isOwner = true;
      if (scopeFilter === 'agency') {
        isOwner = isSameAgency(res.agency, currentCommercial.agency);
      } else if (scopeFilter === 'mine') {
        isOwner = isSameCommercial(res.commercialId, res.commercialName, currentCommercial);
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

      const clientEmail =
        res.client.type === 'personne_physique'
          ? res.client.personnePhysique?.email || ''
          : res.client.societe?.email || '';

      const clientCity =
        res.client.type === 'personne_physique'
          ? res.client.personnePhysique?.ville || ''
          : res.client.societe?.ville || '';

      // Analyse et représentations de la date pour recherche textuelle (ex: "18 septembre", "25/09", "septembre")
      const createdDateObj = new Date(res.createdAt);
      const isoDate = (res.createdAt || '').slice(0, 10);
      const frDate = createdDateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).toLowerCase();
      const frShortDate = createdDateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toLowerCase();
      const slashDate = createdDateObj.toLocaleDateString('fr-FR');
      const dayNum = String(createdDateObj.getDate());
      const dayNumPadded = String(createdDateObj.getDate()).padStart(2, '0');

      const searchWords = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);

      const searchableText = [
        res.id,
        res.carName,
        res.colorChosen?.name || '',
        clientName,
        clientPhone,
        cinOrMf,
        clientEmail,
        clientCity,
        res.commercialName,
        res.agency || '',
        res.status || '',
        res.paymentMethod || '',
        res.notes || '',
        isoDate,
        frDate,
        frShortDate,
        slashDate,
        `${dayNum} sept`,
        `${dayNum} septembre`,
        `${dayNumPadded}/09`,
        `${dayNumPadded}-09`,
        `${dayNumPadded} septembre`,
      ].join(' ').toLowerCase();

      const matchesSearch =
        searchWords.length === 0 ||
        searchWords.every((word) => searchableText.includes(word));

      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
      const matchesModel =
        carModelFilter === 'all' ||
        res.carName === carModelFilter ||
        res.carName.toLowerCase().includes(carModelFilter.toLowerCase());
      const matchesPayment = paymentMethodFilter === 'all' || res.paymentMethod === paymentMethodFilter;
      const matchesAgency = !isAdminOrSuperAdmin || agencyFilter === 'all' || res.agency === agencyFilter;
      const matchesCommercial =
        commercialFilter === 'all' ||
        (res.commercialId && res.commercialId === commercialFilter) ||
        (res.commercialName && res.commercialName.trim().toLowerCase() === commercialFilter.toLowerCase()) ||
        (res.commercialName && commercialFilter !== 'all' && res.commercialName.trim().toLowerCase().includes(commercialFilter.toLowerCase()));

      // Quick date filter matching
      let matchesQuickDate = true;
      if (quickDateFilter === 'all') {
        matchesQuickDate = true;
      } else if (quickDateFilter === 'sept-week') {
        matchesQuickDate = isoDate >= '2026-09-18' && isoDate <= '2026-09-25';
      } else if (quickDateFilter === 'sept-all') {
        matchesQuickDate = isoDate.startsWith('2026-09');
      } else if (quickDateFilter.startsWith('month:')) {
        const monthPrefix = quickDateFilter.replace('month:', '');
        matchesQuickDate = isoDate.startsWith(monthPrefix);
      } else if (quickDateFilter === 'today') {
        const todayIso = new Date().toISOString().slice(0, 10);
        matchesQuickDate = isoDate === todayIso;
      } else if (quickDateFilter !== 'all') {
        matchesQuickDate = isoDate === quickDateFilter;
      }

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

      return isOwner && matchesSearch && matchesStatus && matchesModel && matchesPayment && matchesAgency && matchesCommercial && matchesDate && matchesQuickDate;
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

  // Filtrage des éléments de la corbeille selon les privilèges
  const accessibleTrash = isAdminOrSuperAdmin
    ? trashReservations
    : trashReservations.filter((t) => {
        const r = t.reservation;
        if (!r) return true;
        const matchId = Boolean(r.commercialId && currentCommercial.id && r.commercialId === currentCommercial.id);
        const matchName = Boolean(
          r.commercialName &&
          currentCommercial.name &&
          r.commercialName.trim().toLowerCase() === currentCommercial.name.trim().toLowerCase()
        );
        return matchId || matchName;
      });

  const filteredTrash = accessibleTrash.filter((t) => {
    if (!trashSearchTerm.trim()) return true;
    const term = trashSearchTerm.toLowerCase();
    const r = t.reservation || ({} as any);
    const clientName = r.client?.type === 'societe' ? (r.client.societe?.raisonSociale || '') : `${r.client?.personnePhysique?.nom || ''} ${r.client?.personnePhysique?.prenom || ''}`;
    const cinOrMf = r.client?.type === 'societe' ? (r.client.societe?.matriculeFiscale || '') : (r.client?.personnePhysique?.cin || '');
    const phone = r.client?.type === 'societe' ? (r.client.societe?.telephone || '') : (r.client?.personnePhysique?.telephone || '');
    return (
      (t.id && t.id.toLowerCase().includes(term)) ||
      (t.deletedBy && t.deletedBy.toLowerCase().includes(term)) ||
      (r.carName && r.carName.toLowerCase().includes(term)) ||
      clientName.toLowerCase().includes(term) ||
      cinOrMf.toLowerCase().includes(term) ||
      phone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Navigation Onglets : Réservations Actives vs Corbeille */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewTab('active')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewTab === 'active'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bons de Réservation Actifs</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${viewTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
              {accessibleReservations.length}
            </span>
          </button>

          <button
            onClick={() => setViewTab('trash')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewTab === 'trash'
                ? 'bg-red-950 text-red-200 border border-red-700 shadow-lg shadow-red-950/50'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Corbeille & Suppressions</span>
            {accessibleTrash.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-600/30 text-red-300 border border-red-500/30 font-bold">
                {accessibleTrash.length}
              </span>
            )}
          </button>
        </div>

        {viewTab === 'trash' && onEmptyTrash && accessibleTrash.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('⚠️ Êtes-vous certain de vouloir vider la corbeille ? Tous les éléments seront définitivement purgés et verrouillés contre toute réapparition.')) {
                onEmptyTrash();
              }
            }}
            className="px-3.5 py-2 bg-red-950/80 hover:bg-red-800 text-red-300 hover:text-white border border-red-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Vider la corbeille ({accessibleTrash.length})</span>
          </button>
        )}
      </div>

      {/* VUE CORBEILLE */}
      {viewTab === 'trash' ? (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                Corbeille des Bons de Réservation
              </h3>
              <p className="text-xs text-slate-400">
                Les réservations supprimées sont isolées ici en toute sécurité. Elles ne bloquent aucun stock et sont protégées contre toute restauration automatique accidentelle.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher dans la corbeille..."
                value={trashSearchTerm}
                onChange={(e) => setTrashSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {filteredTrash.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
              <Trash2 className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-40" />
              <p className="text-slate-300 font-bold text-sm">La corbeille est vide</p>
              <p className="text-slate-500 text-xs mt-1">Aucune réservation supprimée ou en attente de purge.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrash.map((item) => {
                const res = item.reservation || ({} as Reservation);
                const isSociete = res.client?.type === 'societe';
                const clientName = isSociete
                  ? (res.client?.societe?.raisonSociale || 'Société')
                  : `${res.client?.personnePhysique?.nom || ''} ${res.client?.personnePhysique?.prenom || ''}`.trim() || 'Client particulier';
                const clientPhone = isSociete
                  ? (res.client?.societe?.telephone || '')
                  : (res.client?.personnePhysique?.telephone || '');
                const clientCity = isSociete
                  ? (res.client?.societe?.ville || '')
                  : (res.client?.personnePhysique?.ville || '');

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl shadow space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                          {item.id}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Statut : {res.status || 'Supprimé'}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-white truncate">{clientName}</h4>
                        <p className="text-xs text-slate-400">{clientPhone ? `Tél: ${clientPhone}` : ''} {clientCity ? `• ${clientCity}` : ''}</p>
                      </div>

                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
                        <div className="text-slate-300 font-medium truncate">
                          {res.carName || 'Véhicule Chery'} {res.colorChosen?.name ? `(${res.colorChosen.name})` : ''}
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Prix TTC : <strong className="text-white font-mono">{res.priceTND ? res.priceTND.toLocaleString('fr-FR') : '0'} DT</strong></span>
                          <span>{res.paymentMethod || 'Paiement N/A'}</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 space-y-0.5 border-t border-slate-800/60 pt-2">
                        <div>Supprimé le : <span className="text-slate-400">{new Date(item.deletedAt).toLocaleString('fr-FR')}</span></div>
                        <div>Par : <span className="text-slate-400">{item.deletedBy} ({item.deletedByRole})</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      {onRestoreReservation && (
                        <button
                          onClick={() => onRestoreReservation(item.id)}
                          className="flex-1 py-2 px-3 bg-emerald-950 hover:bg-emerald-850 text-emerald-300 hover:text-white border border-emerald-800/80 hover:border-emerald-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          title="Restaurer cette réservation dans la liste active"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Restaurer</span>
                        </button>
                      )}

                      {onPermanentDeleteReservation && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer définitivement la réservation ${item.id} ? Elle ne sera plus récupérable.`)) {
                              onPermanentDeleteReservation(item.id);
                            }
                          }}
                          className="py-2 px-3 bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-600/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title="Purger définitivement de la corbeille"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
      {/* Header with Title & Excel Export Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Liste des Bons de Réservation & Commandes (Toutes les dates)
              </h2>
              <p className="text-xs text-slate-400">
                {filteredReservations.length} sur {reservations.length} réservation(s) affichée(s) • Base centrale STA • Toutes les dates incluses
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Reconstruire tous les bons manquants Button */}
          <button
            onClick={handleRunRecovery}
            disabled={isRecovering}
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-blue-950/80 hover:bg-blue-800 text-blue-200 hover:text-white font-bold text-xs rounded-xl shadow border border-blue-700/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Analyser les journaux d'audit et reconstruire automatiquement tous les bons de réservation manquants"
          >
            <RefreshCw className={`w-4 h-4 ${isRecovering ? 'animate-spin text-blue-300' : 'text-blue-400'}`} />
            <span>{isRecovering ? 'Reconstruction...' : 'Reconstruire les bons manquants'}</span>
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

          {/* Téléchargement Sauvegarde Base JSON */}
          <a
            href="/api/reservations/export"
            download={`sauvegarde_reservations_chery_${new Date().toISOString().split('T')[0]}.json`}
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl shadow border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="Télécharger une copie de sauvegarde JSON en ligne de toutes les réservations"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Sauvegarde Base</span>
          </a>

          {/* Importer en CSV Button */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,text/csv,application/vnd.ms-excel"
            onChange={handleCsvFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-900/40 border border-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Importer des bons de réservation depuis un fichier CSV ou Excel"
          >
            <Upload className="w-4 h-4" />
            <span>Importer en CSV</span>
          </button>

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

      {/* Notice de visibilité et d'accès */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Base nationale intégrale :</strong> Les <strong>{reservations.length} réservations</strong> pour toutes les dates sont consultables et synchronisées en direct.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400">
            {dateDistribution.sortedDays.length} dates distinctes enregistrées
          </span>
        </div>
      </div>

      {/* Alerte si des filtres réduisent le nombre de bons affichés */}
      {filteredReservations.length < reservations.length && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Filtre actif :</strong> Seuls <strong>{filteredReservations.length}</strong> sur <strong>{reservations.length}</strong> bons sont visibles (
              {reservations.length - filteredReservations.length} bon(s) masqué(s) par votre sélection de date, statut ou commercial).
            </span>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Afficher la totalité ({reservations.length} réservations)</span>
          </button>
        </div>
      )}

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
            {/* Scope Selector: Accessible à tous (Commerciaux & Administrateurs) */}
            <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-medium shrink-0">
              <button
                onClick={() => setScopeFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  scopeFilter === 'all' ? 'bg-red-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Afficher toutes les réservations du réseau Chery Tunisie"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Toutes ({allReservationsCount})</span>
              </button>
              <button
                onClick={() => setScopeFilter('agency')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  scopeFilter === 'agency' ? 'bg-slate-700 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title={`Afficher les réservations de mon agence (${currentCommercial.agency || 'Agence'})`}
              >
                <Building className="w-3.5 h-3.5 text-slate-300" />
                <span>Mon agence ({myAgencyReservationsCount})</span>
              </button>
              <button
                onClick={() => setScopeFilter('mine')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  scopeFilter === 'mine' ? 'bg-slate-700 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title={`Afficher uniquement mes réservations (${currentCommercial.name})`}
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-300" />
                <span>Mes réservations ({myReservationsCount})</span>
              </button>
            </div>

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

            {/* Sélecteur Rapide : Agent Commercial */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs shrink-0 transition-all ${
                commercialFilter !== 'all'
                  ? 'bg-red-950/70 border-red-500 text-red-200 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${commercialFilter !== 'all' ? 'text-red-400' : 'text-slate-400'}`} />
              <select
                value={commercialFilter}
                onChange={(e) => handleCommercialFilterChange(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer max-w-[170px] sm:max-w-[210px] font-medium"
                title="Filtrer immédiatement par agent commercial"
              >
                <option value="all" className="bg-slate-900 text-white">
                  Tous les commerciaux ({accessibleReservations.length})
                </option>
                {uniqueCommercials.map((comm) => (
                  <option key={comm.name} value={comm.name} className="bg-slate-900 text-white">
                    {comm.name} ({comm.count})
                  </option>
                ))}
              </select>
              {commercialFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setCommercialFilter('all')}
                  className="text-red-400 hover:text-white ml-0.5 font-bold cursor-pointer"
                  title="Effacer le filtre commercial"
                >
                  ✕
                </button>
              )}
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

        {/* Row: Raccourcis d'accès direct et dynamique à toutes les dates */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-red-400" />
            Dates :
          </span>

          {/* Bouton Toutes les dates */}
          <button
            onClick={() => {
              setQuickDateFilter('all');
              setDateStart('');
              setDateEnd('');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
              quickDateFilter === 'all' && !dateStart && !dateEnd
                ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>Toutes les dates</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              quickDateFilter === 'all' && !dateStart && !dateEnd ? 'bg-white/20 text-white' : 'bg-slate-800 text-red-300'
            }`}>
              {accessibleReservations.length}
            </span>
          </button>

          {/* Mois dynamiques (ex: Septembre 2026, Août 2026) */}
          {dateDistribution.sortedMonths.map((m) => {
            const isSelected = quickDateFilter === `month:${m.month}`;
            return (
              <button
                key={m.month}
                onClick={() => {
                  setQuickDateFilter(isSelected ? 'all' : `month:${m.month}`);
                  setDateStart('');
                  setDateEnd('');
                }}
                className={`px-2.5 py-1.5 rounded-xl transition-all font-medium text-xs flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white font-bold shadow'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{m.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {m.count}
                </span>
              </button>
            );
          })}

          {/* Liste déroulante pour toutes les dates précises */}
          <div className="flex items-center gap-1.5 ml-auto">
            <select
              value={quickDateFilter.startsWith('2026-') ? quickDateFilter : ''}
              onChange={(e) => {
                const val = e.target.value;
                setQuickDateFilter(val ? val : 'all');
                setDateStart('');
                setDateEnd('');
              }}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
            >
              <option value="">Sélectionner un jour précis ({dateDistribution.sortedDays.length} dates)...</option>
              {dateDistribution.sortedDays.map((d) => (
                <option key={d.date} value={d.date}>
                  {d.date} ({d.count} bon{d.count > 1 ? 's' : ''})
                </option>
              ))}
            </select>

            {quickDateFilter !== 'all' && (
              <button
                onClick={() => setQuickDateFilter('all')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs"
                title="Réinitialiser et afficher toutes les dates"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Advanced Dropdown Filters */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 text-xs">
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

            {/* Filter Agent Commercial */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-red-400" />
                <span>Agent Commercial :</span>
              </label>
              <select
                value={commercialFilter}
                onChange={(e) => handleCommercialFilterChange(e.target.value)}
                className={`w-full bg-slate-950 border rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-red-500 ${
                  commercialFilter !== 'all' ? 'border-red-500 font-bold text-red-200' : 'border-slate-800'
                }`}
              >
                <option value="all">Tous les agents commerciaux ({accessibleReservations.length})</option>
                {uniqueCommercials.map((comm) => (
                  <option key={comm.name} value={comm.name}>
                    {comm.name} {comm.agency ? `(${comm.agency})` : ''} — {comm.count} bon{comm.count > 1 ? 's' : ''}
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
          <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Tri automatique : <strong className="text-slate-200 font-semibold">Dernières réservations modifiées en premier</strong></span>
            </div>

            {/* Active filter badge for commercial agent */}
            {commercialFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950 border border-red-700 text-red-200 shadow-sm">
                <UserCheck className="w-3 h-3 text-red-400" />
                <span>Agent : {commercialFilter}</span>
                <button
                  type="button"
                  onClick={() => setCommercialFilter('all')}
                  className="text-red-400 hover:text-white ml-0.5 font-bold cursor-pointer"
                  title="Supprimer ce filtre"
                >
                  ✕
                </button>
              </span>
            )}
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
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {scopeFilter !== 'all' && allReservationsCount > 0 && (
                <button
                  onClick={() => setScopeFilter('all')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer shadow"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Afficher toutes les agences ({allReservationsCount} réservations)</span>
                </button>
              )}
              {commercialFilter !== 'all' && (
                <button
                  onClick={() => setCommercialFilter('all')}
                  className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-200 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-red-400" />
                  <span>Afficher tous les agents commerciaux</span>
                </button>
              )}
              {hasActiveFilters && accessibleReservations.length > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-red-400" />
                  <span>Réinitialiser les filtres</span>
                </button>
              )}
            </div>
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

                      <p className="text-slate-400 pt-1 flex items-center flex-wrap gap-1">
                        <span>Commercial :</span>
                        <button
                          type="button"
                          onClick={() => handleCommercialFilterChange(res.commercialName)}
                          className={`font-bold transition-colors cursor-pointer inline-flex items-center gap-1 hover:underline ${
                            commercialFilter === res.commercialName
                              ? 'text-red-400 underline decoration-red-500'
                              : 'text-slate-200 hover:text-red-400'
                          }`}
                          title={`Filtrer tous les bons de l'agent commercial ${res.commercialName}`}
                        >
                          <UserCheck className="w-3 h-3 text-red-400" />
                          <span>{res.commercialName}</span>
                        </button>
                        <span className="text-slate-500">({res.agency})</span>
                      </p>
                    </div>
                  </div>

                  {/* Column 3: Financials & Documents Attached */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-300 font-bold uppercase text-[11px] border-b border-slate-800 pb-1">
                        <span>Finances & Acompte</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {res.paymentMethod === 'Leasing'
                            ? 'Accord Leasing'
                            : `${(res.depositPaidTND || 0).toLocaleString()} TND versé`}
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-300 pt-1">
                        <p className="flex justify-between">
                          <span className="text-slate-400">Prix Véhicule TTC :</span>
                          <span className="font-mono font-bold">{res.priceTND.toLocaleString()} TND</span>
                        </p>
                        {Boolean(res.registrationFeeTND && res.registrationFeeTND > 0) && (
                          <p className="flex justify-between text-slate-400 text-[11px]">
                            <span>Frais Immat. & Carte Grise :</span>
                            <span className="font-mono">{res.registrationFeeTND.toLocaleString()} TND</span>
                          </p>
                        )}
                        <p className="flex justify-between text-slate-400">
                          <span>Règlement Acompte :</span>
                          <span className="font-semibold text-slate-200">{res.paymentMethod}</span>
                        </p>
                        {res.paymentMethod === 'Leasing' ? (
                          <div className="pt-1 border-t border-slate-800 space-y-0.5">
                            <p className="flex justify-between text-indigo-400 font-semibold text-[11px]">
                              <span>Financement :</span>
                              <span className="font-mono font-bold">100% Société de Leasing</span>
                            </p>
                            <p className="flex justify-between text-emerald-400 font-bold">
                              <span>Solde direct client :</span>
                              <span className="font-mono">0 TND (Accord Leasing)</span>
                            </p>
                          </div>
                        ) : (
                          <p className="flex justify-between text-red-400 font-bold pt-1 border-t border-slate-800">
                            <span>Reste à payer :</span>
                            <span className="font-mono">
                              {(res.priceTND + (res.registrationFeeTND || 0) - (res.depositPaidTND || 0)).toLocaleString()} TND
                            </span>
                          </p>
                        )}
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
                          if (window.confirm(`Voulez-vous supprimer et déplacer le bon de réservation N° ${res.id} (${res.carName}) vers la corbeille ?`)) {
                            onDeleteReservation(res.id);
                          }
                        }}
                        className="px-3 py-2 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Supprimer la réservation et la déplacer vers la corbeille"
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
      </>
      )}

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

      {/* Modal de Prévisualisation et Confirmation d'Importation CSV */}
      {csvImportResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Importation de Réservations (CSV)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fichier : <span className="text-blue-300 font-mono font-medium">{csvFileName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCsvImportResult(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Fermer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Summary badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Lignes Détectées</span>
                <span className="text-lg font-bold text-white font-mono">{csvImportResult.totalRows}</span>
              </div>
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Nouveaux Bons à Créer</span>
                <span className="text-lg font-bold text-emerald-300 font-mono">+{csvImportResult.newCount}</span>
              </div>
              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl">
                <span className="text-[10px] text-blue-400 font-bold uppercase block">Bons à Mettre à Jour</span>
                <span className="text-lg font-bold text-blue-300 font-mono">{csvImportResult.updatedCount}</span>
              </div>
            </div>

            {/* Warning if any */}
            {csvImportResult.errors.length > 0 && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Remarques sur le fichier :</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-amber-300/80 space-y-0.5">
                  {csvImportResult.errors.slice(0, 3).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {csvImportResult.errors.length > 3 && (
                    <li>...et {csvImportResult.errors.length - 3} autre(s) avertissement(s)</li>
                  )}
                </ul>
              </div>
            )}

            {/* Preview table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Aperçu des 5 premières réservations extraites :</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Total à intégrer : {csvImportResult.reservations.length} bon(s)
                </span>
              </span>
              <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="px-3 py-2">N° Bon</th>
                      <th className="px-3 py-2">Client</th>
                      <th className="px-3 py-2">Modèle</th>
                      <th className="px-3 py-2">Prix TTC</th>
                      <th className="px-3 py-2">Acompte</th>
                      <th className="px-3 py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 font-sans">
                    {csvImportResult.reservations.slice(0, 5).map((r) => {
                      const clientName =
                        r.client.type === 'societe'
                          ? r.client.societe?.raisonSociale || 'Société'
                          : `${r.client.personnePhysique?.nom || ''} ${r.client.personnePhysique?.prenom || ''}`.trim() || 'Client';
                      return (
                        <tr key={r.id} className="hover:bg-slate-800/40">
                          <td className="px-3 py-2 font-mono font-bold text-red-400 whitespace-nowrap">{r.id}</td>
                          <td className="px-3 py-2 whitespace-nowrap font-medium text-white">{clientName}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-slate-300">{r.carName}</td>
                          <td className="px-3 py-2 whitespace-nowrap font-mono font-bold text-emerald-400">
                            {r.priceTND.toLocaleString('fr-FR')} DT
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap font-mono text-slate-300">
                            {r.depositPaidTND.toLocaleString('fr-FR')} DT
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCsvImportResult(null)}
                disabled={isImportingCsv}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmCsvImport}
                disabled={isImportingCsv}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-blue-900/40 border border-blue-500/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isImportingCsv ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Enregistrement en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmer l'importation ({csvImportResult.reservations.length} bons)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
