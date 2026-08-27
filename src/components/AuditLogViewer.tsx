import React, { useState, useMemo } from 'react';
import {
  History,
  ShieldCheck,
  Package,
  DollarSign,
  User,
  Clock,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Tag,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Info,
  Car,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Check,
} from 'lucide-react';
import { AuditLogEntry, AuditActionType, CommercialUser, CarModel } from '../types';

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
  currentUser: CommercialUser;
  cars?: CarModel[];
  onClearLogs?: () => void;
  onDeleteLog?: (logId: string) => void;
  onDeleteMultipleLogs?: (logIds: string[]) => void;
  onResetDefaultLogs?: () => void;
  onAddManualLog?: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs,
  currentUser,
  cars = [],
  onClearLogs,
  onDeleteLog,
  onDeleteMultipleLogs,
  onResetDefaultLogs,
  onAddManualLog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'prices' | 'stocks' | 'reservations'>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [limitCount, setLimitCount] = useState<number>(0); // 0 = all by default
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  const [logToDelete, setLogToDelete] = useState<AuditLogEntry | null>(null);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);

  const isSuperAdminOrAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin';

  // Filter and sort logs (most recent first)
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        // Search filter
        const matchSearch =
          !searchTerm ||
          (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.targetCarName && log.targetCarName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.targetColorName && log.targetColorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (log.actionLabel && log.actionLabel.toLowerCase().includes(searchTerm.toLowerCase()));

        // Category filter
        let matchCat = true;
        if (categoryFilter === 'prices') {
          matchCat = log.actionType === 'price_update';
        } else if (categoryFilter === 'stocks') {
          matchCat = [
            'stock_update',
            'stock_reset',
            'stock_request_approved',
            'color_added',
            'color_edited',
            'color_deleted',
            'model_added',
            'model_deleted',
          ].includes(log.actionType);
        } else if (categoryFilter === 'reservations') {
          matchCat = ['reservation_stock_deduct', 'stock_request_approved'].includes(log.actionType);
        }

        // User filter
        const matchUser = userFilter === 'all' || log.userId === userFilter || log.userName === userFilter;

        return matchSearch && matchCat && matchUser;
      })
      .slice(0, limitCount === 0 ? undefined : limitCount);
  }, [logs, searchTerm, categoryFilter, userFilter, limitCount]);

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const priceUpdates = logs.filter((l) => l.actionType === 'price_update').length;
    const stockUpdates = logs.filter((l) =>
      ['stock_update', 'color_added', 'color_edited', 'stock_request_approved', 'stock_reset'].includes(l.actionType)
    ).length;
    const reservationDeductions = logs.filter((l) => l.actionType === 'reservation_stock_deduct').length;
    return { total, priceUpdates, stockUpdates, reservationDeductions };
  }, [logs]);

  // Selection handlers
  const handleToggleSelectLog = (id: string) => {
    setSelectedLogIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredLogs.map((l) => l.id);
    const allSelected = visibleIds.every((id) => selectedLogIds.includes(id));
    if (allSelected) {
      setSelectedLogIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedLogIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedLogIds([]);
  };

  const handleConfirmBatchDelete = () => {
    if (onDeleteMultipleLogs && selectedLogIds.length > 0) {
      onDeleteMultipleLogs(selectedLogIds);
      setSelectedLogIds([]);
      setShowBatchDeleteConfirm(false);
    }
  };

  const handleConfirmSingleDelete = () => {
    if (logToDelete && onDeleteLog) {
      onDeleteLog(logToDelete.id);
      setSelectedLogIds((prev) => prev.filter((id) => id !== logToDelete.id));
      setLogToDelete(null);
    }
  };

  const getActionBadge = (actionType: AuditActionType, label: string) => {
    switch (actionType) {
      case 'price_update':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <DollarSign className="w-3 h-3" />
            {label || 'Modification Prix'}
          </span>
        );
      case 'stock_update':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Package className="w-3 h-3" />
            {label || 'Ajustement Stock'}
          </span>
        );
      case 'stock_request_approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-3 h-3" />
            {label || 'Quota Validé'}
          </span>
        );
      case 'reservation_stock_deduct':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Tag className="w-3 h-3" />
            {label || 'Déduction Réservation'}
          </span>
        );
      case 'color_added':
      case 'model_added':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3 h-3" />
            {label || 'Nouveau Modèle/Teinte'}
          </span>
        );
      case 'stock_reset':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <RotateCcw className="w-3 h-3" />
            {label || 'Réinitialisation'}
          </span>
        );
      case 'color_deleted':
      case 'model_deleted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Trash2 className="w-3 h-3" />
            {label || 'Suppression'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Info className="w-3 h-3" />
            {label || 'Action Système'}
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      let relative = '';
      if (diffMinutes < 1) relative = "À l'instant";
      else if (diffMinutes < 60) relative = `Il y a ${diffMinutes} min`;
      else if (diffHours < 24) relative = `Il y a ${diffHours}h`;

      const formatted = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return { formatted, relative };
    } catch {
      return { formatted: isoString, relative: '' };
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Heure', 'Utilisateur', 'Rôle', 'Action', 'Véhicule', 'Couleur', 'Détails', 'Ancienne Valeur', 'Nouvelle Valeur'];
    const rows = logs.map((l) => {
      const d = new Date(l.timestamp);
      return [
        `"${d.toLocaleDateString('fr-FR')}"`,
        `"${d.toLocaleTimeString('fr-FR')}"`,
        `"${l.userName || ''}"`,
        `"${l.userRole || ''}"`,
        `"${l.actionLabel || l.actionType}"`,
        `"${l.targetCarName || ''}"`,
        `"${l.targetColorName || ''}"`,
        `"${(l.details || '').replace(/"/g, '""')}"`,
        `"${l.previousValue ?? ''}"`,
        `"${l.newValue ?? ''}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `journal_audit_stocks_tarifs_chery_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const isAllVisibleSelected =
    filteredLogs.length > 0 && filteredLogs.every((l) => selectedLogIds.includes(l.id));

  return (
    <div className="space-y-6" id="audit-log-section">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <History className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Journal d'Audit & Traçabilité Réelle
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Temps Réel
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Historique authentique des modifications sur les stocks, prix, quotas et réservations des véhicules CHERY
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              id="export-audit-csv-btn"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Exporter l'historique au format CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exporter CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              id="print-audit-btn"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Imprimer le relevé d'audit"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Imprimer</span>
            </button>

            {onClearLogs && isSuperAdminOrAdmin && logs.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                id="clear-audit-logs-btn"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                title="Purger tout l'historique d'audit"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Purger Tout ({logs.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Actions Réelles</p>
              <p className="text-lg font-bold text-white">{stats.total}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Modifs Prix</p>
              <p className="text-lg font-bold text-amber-300">{stats.priceUpdates}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Modifs Stocks</p>
              <p className="text-lg font-bold text-emerald-300">{stats.stockUpdates}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Réservations</p>
              <p className="text-lg font-bold text-purple-300">{stats.reservationDeductions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par véhicule, utilisateur, couleur ou action..."
            id="audit-search-input"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Toutes les actions
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('prices')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'prices'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>Prix</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('stocks')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'stocks'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stocks</span>
          </button>
        </div>

        {/* Display Count Limit */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-medium">Affichage :</span>
          <select
            value={limitCount}
            onChange={(e) => setLimitCount(Number(e.target.value))}
            id="audit-limit-select"
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-amber-400 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value={0}>Tout l'historique ({logs.length})</option>
            <option value={10}>10 dernières actions</option>
            <option value={25}>25 dernières actions</option>
            <option value={50}>50 dernières actions</option>
          </select>
        </div>
      </div>

      {/* Floating / Prominent Multi-Selection Action Bar */}
      {selectedLogIds.length > 0 && isSuperAdminOrAdmin && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 text-xs text-amber-300">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              {selectedLogIds.length}
            </span>
            <span className="font-semibold">
              {selectedLogIds.length === 1
                ? '1 action d\'audit sélectionnée'
                : `${selectedLogIds.length} actions d'audit sélectionnées`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearSelection}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              Désélectionner tout
            </button>
            <button
              type="button"
              onClick={() => setShowBatchDeleteConfirm(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer la sélection ({selectedLogIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Audit Log Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {isSuperAdminOrAdmin && filteredLogs.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllVisible}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700 transition-colors"
                title={isAllVisibleSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
              >
                {isAllVisibleSelected ? (
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>{isAllVisibleSelected ? 'Tout décocher' : 'Tout sélectionner'}</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {`Historique des Actions Réelles (${filteredLogs.length})`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Traçabilité Directe &amp; Firestore Synchronisé</span>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <History className="w-8 h-8 text-amber-400/70" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-bold text-white">Journal d'Audit Réel Prêt</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Aucune modification n'est enregistrée pour le moment. Dès qu'un utilisateur modifie un stock de véhicule, ajuste un tarif catalogue, approuve un quota ou crée une réservation, l'action sera automatiquement consignée ici en temps réel avec horodatage certifié.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredLogs.map((log, index) => {
              const { formatted, relative } = formatDate(log.timestamp);
              const isPriceAction = log.actionType === 'price_update';
              const isStockAction = [
                'stock_update',
                'color_added',
                'color_edited',
                'stock_request_approved',
                'stock_reset',
              ].includes(log.actionType);
              const isSelected = selectedLogIds.includes(log.id);

              return (
                <div
                  key={log.id || `audit-${index}`}
                  id={`audit-log-item-${index + 1}`}
                  className={`p-4 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group ${
                    isSelected ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Left Column: Checkbox + Index Badge + User Info + Time */}
                  <div className="flex items-start gap-3 min-w-[280px]">
                    {isSuperAdminOrAdmin && (
                      <button
                        type="button"
                        onClick={() => handleToggleSelectLog(log.id)}
                        className="mt-0.5 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={isSelected ? 'Désélectionner' : 'Sélectionner pour suppression'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    )}

                    <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-amber-400 group-hover:border-amber-500/40 transition-colors">
                      #{index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-tight">
                          {log.userName || 'Utilisateur Système'}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                            log.userRole === 'super_admin'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : log.userRole === 'admin'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {log.userRole === 'super_admin' ? 'Super Admin (DSI)' : log.userRole === 'admin' ? 'Direction STA' : 'Commercial'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-mono">{formatted}</span>
                        {relative && (
                          <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                            {relative}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Action Badge + Target Vehicle & Change details */}
                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      {getActionBadge(log.actionType, log.actionLabel)}

                      {log.targetCarName && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700">
                          <Car className="w-3 h-3 text-amber-400" />
                          <strong className="text-white">{log.targetCarName}</strong>
                        </span>
                      )}

                      {log.targetColorName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-slate-950 text-slate-300 border border-slate-800">
                          Teinte : <span className="text-slate-100 font-medium">{log.targetColorName}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {log.details}
                    </p>

                    {/* Evolutionary comparison tag (Before -> After) */}
                    {(log.previousValue !== undefined || log.newValue !== undefined) && (
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono">
                        {log.previousValue !== undefined && (
                          <span className="text-slate-400 line-through">
                            {typeof log.previousValue === 'number' && isPriceAction
                              ? `${log.previousValue.toLocaleString()} TND`
                              : typeof log.previousValue === 'number' && isStockAction
                              ? `${log.previousValue} unités`
                              : String(log.previousValue)}
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        {log.newValue !== undefined && (
                          <span className="text-emerald-400 font-bold">
                            {typeof log.newValue === 'number' && isPriceAction
                              ? `${log.newValue.toLocaleString()} TND`
                              : typeof log.newValue === 'number' && isStockAction
                              ? `${log.newValue} unités`
                              : String(log.newValue)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Status, Agency & Individual Delete Button */}
                  <div className="shrink-0 flex lg:flex-col items-end justify-between lg:justify-center gap-2 w-full lg:w-auto text-right border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Appliqué
                      </span>

                      {/* Individual Delete Button */}
                      {isSuperAdminOrAdmin && onDeleteLog && (
                        <button
                          type="button"
                          onClick={() => setLogToDelete(log)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-800/40 transition-colors cursor-pointer"
                          title="Supprimer cette ligne d'audit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {log.userAgency && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                        {log.userAgency}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Single Log Deletion */}
      {logToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Supprimer cette action d'audit ?</h3>
                <p className="text-xs text-slate-400">{logToDelete.actionLabel}</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <p className="font-semibold text-white">{logToDelete.details}</p>
              <p className="text-[11px] text-slate-400">
                Par <span className="text-amber-400 font-medium">{logToDelete.userName}</span> le {formatDate(logToDelete.timestamp).formatted}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLogToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Batch Selection Deletion */}
      {showBatchDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Supprimer la sélection ?</h3>
                <p className="text-xs text-slate-400">{selectedLogIds.length} enregistrement(s) à supprimer définitivement</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
              Êtes-vous certain de vouloir supprimer les {selectedLogIds.length} entrées d'audit sélectionnées ? Cette opération est irréversible.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
              >
                Supprimer ({selectedLogIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Purging ALL Logs */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-800/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Purger tout le Journal d'Audit ?</h3>
                <p className="text-xs text-slate-400">Cette action supprimera la totalité des {logs.length} enregistrements.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
              Êtes-vous certain de vouloir vider l'ensemble du journal d'audit ? Les futures modifications de stocks et prix continueront à être tracées en temps réel dès la prochaine action.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onClearLogs) onClearLogs();
                  setSelectedLogIds([]);
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
              >
                Confirmer la purge complète
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
