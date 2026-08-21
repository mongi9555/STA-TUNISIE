import React, { useState } from 'react';
import { Reservation, CommercialUser, UploadedDocument, Car as CarModel } from '../types';
import { evaluateLeasingStatus } from '../utils/leasingUtils';
import { compressImageDataUrl } from '../utils/imageCompressor';
import { EditReservationModal } from './EditReservationModal';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [carModelFilter, setCarModelFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  // Permission: modifier une réservation après validation
  const canEditValidated =
    currentCommercial.role === 'super_admin' ||
    Boolean(currentCommercial.permissions?.canEditValidatedReservations);

  // Dynamic dropdown lists
  const uniqueCarModels = Array.from(new Set(reservations.map((r) => r.carName))).sort();
  const uniqueAgencies = Array.from(new Set(reservations.map((r) => r.agency))).filter(Boolean).sort();
  const paymentMethods = ['Espèces', 'Chèque Certifié', 'Virement Bancaire', 'Leasing'];

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCarModelFilter('all');
    setPaymentMethodFilter('all');
    setAgencyFilter('all');
    setDateStart('');
    setDateEnd('');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'all' ||
    carModelFilter !== 'all' ||
    paymentMethodFilter !== 'all' ||
    agencyFilter !== 'all' ||
    dateStart !== '' ||
    dateEnd !== '';

  // Filter reservations
  const filteredReservations = reservations.filter((res) => {
    const isOwner = res.commercialId === currentCommercial.id || currentCommercial.role === 'admin' || currentCommercial.role === 'super_admin';

    const clientName =
      res.client.type === 'personne_physique'
        ? `${res.client.personnePhysique?.nom || ''} ${res.client.personnePhysique?.prenom || ''}`
        : res.client.societe?.raisonSociale || '';

    const cinOrMf =
      res.client.type === 'personne_physique'
        ? res.client.personnePhysique?.cin || ''
        : res.client.societe?.matriculeFiscale || '';

    const matchesSearch =
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinOrMf.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.agency && res.agency.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    const matchesModel = carModelFilter === 'all' || res.carName === carModelFilter;
    const matchesPayment = paymentMethodFilter === 'all' || res.paymentMethod === paymentMethodFilter;
    const matchesAgency = agencyFilter === 'all' || res.agency === agencyFilter;

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

  // Compute Leasing statistics
  const leasingEvals = reservations.map((r) => ({ reservation: r, eval: evaluateLeasingStatus(r) }));
  const validatedLeasingCount = leasingEvals.filter((x) => x.eval.state === 'VALIDATED').length;
  const provisionalLeasingCount = leasingEvals.filter((x) => x.eval.state === 'PROVISIONAL_ACTIVE').length;
  const gracePeriodLeasingCount = leasingEvals.filter((x) => x.eval.state === 'GRACE_PERIOD_ACTIVE').length;
  const expiredLeasingCount = leasingEvals.filter((x) => x.eval.state === 'EXPIRED_CANCELLED').length;

  return (
    <div className="space-y-6">
      {/* Header with Title & Excel Export Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            Liste des Réservations & Bons de Commande
          </h2>
          <p className="text-xs text-slate-400">
            {filteredReservations.length} sur {reservations.length} réservation(s) affichée(s)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onDeleteAllReservations && reservations.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les réservations de la base de données ? Cette action effacera définitivement l\'historique des réservations de test.')) {
                  onDeleteAllReservations();
                }
              }}
              className="px-3 py-2.5 bg-red-950/80 hover:bg-red-700 text-red-300 hover:text-white font-bold text-xs rounded-xl shadow border border-red-800/80 hover:border-red-500 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Supprimer toutes les réservations de la base de données"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Supprimer toutes les réservations</span>
            </button>
          )}

          {/* Export Excel Button */}
          <button
            onClick={exportToExcel}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-900/40 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Exporter toutes les données filtrées dans un fichier Excel (.CSV)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exporter en Excel (.CSV)</span>
          </button>
        </div>
      </div>

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
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par N° Bon, Client, CIN / M.F, Commercial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-between md:justify-end">
            <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-medium shrink-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'all' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tous ({reservations.length})
              </button>
              <button
                onClick={() => setStatusFilter('En attente')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'En attente' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                En attente ({reservations.filter((r) => r.status === 'En attente').length})
              </button>
              <button
                onClick={() => setStatusFilter('Confirmée')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'Confirmée' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Confirmées ({reservations.filter((r) => r.status === 'Confirmée').length})
              </button>
              <button
                onClick={() => setStatusFilter('Livrée')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'Livrée' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Livrées ({reservations.filter((r) => r.status === 'Livrée').length})
              </button>
              <button
                onClick={() => setStatusFilter('Annulée')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'Annulée' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annulées ({reservations.filter((r) => r.status === 'Annulée').length})
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

            {/* Filter Agence */}
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

        {/* Active Filters Bar & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
            <span className="text-slate-400 italic">
              Filtres actifs ({filteredReservations.length} résultat(s) correspondant(s))
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

      {/* Reservation Cards List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {reservations.length === 0 ? 'Aucune réservation enregistrée' : 'Aucune réservation trouvée'}
            </h3>
            <p className="text-xs max-w-md mx-auto text-slate-400">
              {reservations.length === 0
                ? 'Toutes les réservations ont été supprimées de la base de données. Vous pouvez effectuer une nouvelle réservation de véhicule Chery à tout moment depuis le Catalogue.'
                : 'Ajustez vos filtres de recherche ou réinitialisez les paramètres.'}
            </p>
            {hasActiveFilters && reservations.length > 0 && (
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
                  <div className="flex items-center gap-3">
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
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                    {getStatusBadge(res.status)}

                    {/* Status Changer */}
                    <div className="relative">
                      <select
                        value={res.status}
                        disabled={isEditRestricted}
                        onChange={(e) => onUpdateStatus(res.id, e.target.value as any)}
                        title={
                          isEditRestricted
                            ? 'Statut verrouillé : Droit "Modifier la réservation après validation" requis pour ce profil'
                            : 'Modifier le statut de la réservation'
                        }
                        className={`bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-red-500 ${
                          isEditRestricted ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmée">Confirmée</option>
                        <option value="Livrée">Livrée</option>
                        <option value="Annulée">Annulée</option>
                      </select>
                      {isEditRestricted && (
                        <span
                          className="absolute -top-1.5 -right-1.5 p-0.5 bg-amber-900/90 text-amber-300 rounded-full border border-amber-500/40"
                          title="Modification statut verrouillée après validation"
                        >
                          <Lock className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
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
                        <p className="text-slate-400">
                          Gérant : {societe.gerantNomPrenom} (CIN: {societe.gerantCin})
                        </p>
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

                      <p className="text-slate-400">
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

                    <button
                      onClick={() => onViewVoucher(res)}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimer Bon de Réservation</span>
                    </button>
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
        />
      )}
    </div>
  );
};
