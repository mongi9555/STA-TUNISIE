import React, { useState, useEffect } from 'react';
import {
  Database,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Key,
  Server,
  UploadCloud,
  Download,
  ShieldCheck,
  Check,
  Copy,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  HardDrive,
  Activity,
  Zap,
  Trash2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sliders,
  History,
  FileText,
  Car,
  Users,
  CheckCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export interface TursoStorageMetrics {
  connected: boolean;
  pageCount: number;
  pageSize: number;
  freelistCount: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  freeSpaceBytes: number;
  quotaBytes: number;
  quotaFormatted: string;
  quotaPercentUsed: number;
  latencyMs: number;
  sqliteVersion?: string;
  tables: {
    name: string;
    displayName: string;
    rowCount: number;
    estimatedSizeBytes: number;
    lastUpdated?: string;
  }[];
  totalRows: number;
  weeklySync: {
    enabled: boolean;
    dayLabel: string;
    timeLabel: string;
    nextSync: string;
    lastSync?: string;
  };
}

export interface TursoConfigData {
  organization: string;
  databaseName: string;
  url: string;
  hasAuthToken: boolean;
  tokenPreview?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
  lastError?: string;
  tursoDashboardUrl: string;
}

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

export const TursoDashboard: React.FC = () => {
  // Navigation interne du dashboard Turso
  const [subTab, setSubTab] = useState<'storage' | 'weekly_export' | 'explorer' | 'history' | 'settings'>('storage');

  // Données de configuration et métriques
  const [config, setConfig] = useState<TursoConfigData | null>(null);
  const [metrics, setMetrics] = useState<TursoStorageMetrics | null>(null);
  const [history, setHistory] = useState<TursoSyncHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshingMetrics, setRefreshingMetrics] = useState<boolean>(false);

  // Formulaire configuration
  const [urlInput, setUrlInput] = useState<string>('libsql://chery-sta-mongi95.turso.io');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Tests & Opérations
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number; version?: string } | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; counts?: any; durationMs?: number } | null>(null);

  const [isVacuuming, setIsVacuuming] = useState<boolean>(false);
  const [vacuumResult, setVacuumResult] = useState<{ success: boolean; message: string } | null>(null);

  // Planification hebdomadaire (Weekly schedule)
  const [weeklyEnabled, setWeeklyEnabled] = useState<boolean>(true);
  const [weeklyDay, setWeeklyDay] = useState<number>(0); // 0 = Dimanche
  const [weeklyHour, setWeeklyHour] = useState<number>(2); // 02h00
  const [weeklyMinute, setWeeklyMinute] = useState<number>(0);
  const [isSavingSchedule, setIsSavingSchedule] = useState<boolean>(false);
  const [scheduleFeedback, setScheduleFeedback] = useState<string | null>(null);

  // Explorateur de tables en direct
  const [selectedTable, setSelectedTable] = useState<string>('reservations');
  const [tableData, setTableData] = useState<{ rows: any[]; total: number; columns: string[] } | null>(null);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tablePage, setTablePage] = useState<number>(0);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const pageSize = 15;

  const dayOptions = [
    { value: 0, label: 'Dimanche' },
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
  ];

  // 1. Charger la configuration, les métriques et l'historique
  const fetchAllData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setRefreshingMetrics(true);

    try {
      const [configRes, metricsRes, historyRes] = await Promise.all([
        fetch('/api/turso/config').then((r) => r.json()).catch(() => null),
        fetch('/api/turso/metrics').then((r) => r.json()).catch(() => null),
        fetch('/api/turso/history').then((r) => r.json()).catch(() => null),
      ]);

      if (configRes) {
        setConfig(configRes);
        if (configRes.url) setUrlInput(configRes.url);
      }

      if (metricsRes) {
        setMetrics(metricsRes);
        if (metricsRes.weeklySync) {
          setWeeklyEnabled(metricsRes.weeklySync.enabled ?? true);
        }
      }

      if (historyRes && Array.isArray(historyRes.history)) {
        setHistory(historyRes.history);
      }
    } catch (err) {
      console.error('[TursoDashboard] Erreur chargement:', err);
    } finally {
      setLoading(false);
      setRefreshingMetrics(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 2. Charger les données d'une table pour l'explorateur
  const fetchTableData = async () => {
    setIsLoadingTable(true);
    try {
      const offset = tablePage * pageSize;
      const q = new URLSearchParams({
        limit: String(pageSize),
        offset: String(offset),
        search: tableSearch.trim(),
      });
      const res = await fetch(`/api/turso/explore/${selectedTable}?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTableData(data);
      }
    } catch (err) {
      console.error('[TursoExplorer] Erreur exploration table:', err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    if (subTab === 'explorer') {
      fetchTableData();
    }
  }, [subTab, selectedTable, tablePage, tableSearch]);

  // 3. Sauvegarder la configuration
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/turso/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          ...(tokenInput.trim() ? { authToken: tokenInput.trim() } : {}),
          organization: 'mongi95',
          databaseName: 'chery-sta',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTokenInput('');
        setTestResult({
          success: true,
          message: 'Paramètres Turso enregistrés avec succès !',
        });
        await fetchAllData(true);
      } else {
        setTestResult({
          success: false,
          message: data.message || "Erreur lors de l'enregistrement.",
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Erreur réseau.',
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // 4. Tester la connexion
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/turso/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          ...(tokenInput.trim() ? { authToken: tokenInput.trim() } : {}),
        }),
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        fetchAllData(true);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Échec du test de connexion Turso.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  // 5. Exécuter un export / synchronisation manuelle
  const handleManualSync = async () => {
    if (
      !window.confirm(
        "Voulez-vous synchroniser immédiatement l'ensemble de la base de données (280 réservations, véhicules, commerciaux et notes) vers votre base Turso sur mongi95 ?"
      )
    ) {
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/turso/sync', { method: 'POST' });
      const data = await res.json();
      setSyncResult(data);
      if (data.success) {
        await fetchAllData(true);
        if (subTab === 'explorer') fetchTableData();
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err?.message || 'Erreur lors de la synchronisation vers Turso.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 6. Optimisation VACUUM
  const handleVacuum = async () => {
    if (
      !window.confirm(
        "Voulez-vous défragmenter et compacter la base Turso (VACUUM) ? Cette opération libère l'espace inutilisé et réorganise les pages SQLite."
      )
    ) {
      return;
    }

    setIsVacuuming(true);
    setVacuumResult(null);

    try {
      const res = await fetch('/api/turso/vacuum', { method: 'POST' });
      const data = await res.json();
      setVacuumResult(data);
      if (data.success) {
        await fetchAllData(true);
      }
    } catch (err: any) {
      setVacuumResult({
        success: false,
        message: err?.message || "Erreur lors de l'opération VACUUM.",
      });
    } finally {
      setIsVacuuming(false);
    }
  };

  // 7. Enregistrer la planification hebdomadaire
  const handleSaveSchedule = async () => {
    setIsSavingSchedule(true);
    setScheduleFeedback(null);

    try {
      const res = await fetch('/api/turso/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: weeklyEnabled,
          day: Number(weeklyDay),
          hour: Number(weeklyHour),
          minute: Number(weeklyMinute),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScheduleFeedback(data.message);
        await fetchAllData(true);
        setTimeout(() => setScheduleFeedback(null), 5000);
      } else {
        setScheduleFeedback(data.message || 'Erreur lors de la programmation.');
      }
    } catch (err: any) {
      setScheduleFeedback(err?.message || 'Erreur réseau.');
    } finally {
      setIsSavingSchedule(false);
    }
  };

  // 8. Effacer l'historique
  const handleClearHistory = async () => {
    if (!window.confirm("Voulez-vous réinitialiser l'historique des synchronisations ?")) return;
    try {
      const res = await fetch('/api/turso/history/clear', { method: 'POST' });
      if (res.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error('Erreur effacement historique:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes <= 0) return '0 Octets';
    const units = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  return (
    <div className="bg-slate-900 border border-indigo-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header avec lien vers l'organisation Turso */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Base Edge libSQL Distribuée
            </span>
            <span className="px-3 py-1 bg-slate-950 text-slate-300 text-xs font-mono rounded-full border border-slate-800">
              Org : <strong className="text-white">mongi95</strong>
            </span>
            <span className="px-3 py-1 bg-slate-950 text-slate-300 text-xs font-mono rounded-full border border-slate-800">
              Base : <strong className="text-indigo-400">chery-sta</strong>
            </span>
            {metrics?.connected ? (
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Connecté ({metrics.latencyMs}ms)
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-950 text-amber-400 text-xs font-semibold rounded-full border border-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                En attente de connexion
              </span>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Database className="w-7 h-7 text-indigo-400" />
            <span>Contrôle de l'Espace & Export Hebdo Turso Database</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Supervisez en temps réel le volume de données, la consommation du quota Turso, l'état physique des pages SQLite, et programmez la synchronisation hebdomadaire automatique vers votre cluster libSQL <strong>https://app.turso.tech/mongi95</strong>.
          </p>
        </div>

        {/* Action Links & Refresh */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <button
            onClick={() => fetchAllData()}
            disabled={refreshingMetrics}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Rafraîchir les métriques d'espace et de santé"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${refreshingMetrics ? 'animate-spin' : ''}`} />
            <span>{refreshingMetrics ? 'Actualisation...' : 'Actualiser'}</span>
          </button>

          <a
            href="https://app.turso.tech/mongi95"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-950/60 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Ouvrir Turso (mongi95)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Navigation Onglets Dashboard Turso */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setSubTab('storage')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            subTab === 'storage'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Contrôle de l'Espace & Quota</span>
        </button>

        <button
          onClick={() => setSubTab('weekly_export')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            subTab === 'weekly_export'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Export Hebdomadaire & Sync</span>
          {metrics?.weeklySync.enabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setSubTab('explorer')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            subTab === 'explorer'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Explorateur des Données Turso</span>
        </button>

        <button
          onClick={() => setSubTab('history')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            subTab === 'history'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historique des Exports ({history.length})</span>
        </button>

        <button
          onClick={() => setSubTab('settings')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            subTab === 'settings'
              ? 'bg-slate-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Paramètres & Connexion</span>
        </button>
      </div>

      {/* FEEDBACK BANNERS */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between animate-fadeIn ${
            testResult.success
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
          <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {syncResult && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between animate-fadeIn ${
            syncResult.success
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{syncResult.message}</span>
          </div>
          <button onClick={() => setSyncResult(null)} className="text-slate-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {vacuumResult && (
        <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>{vacuumResult.message}</span>
          </div>
          <button onClick={() => setVacuumResult(null)} className="text-slate-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 1: CONTRÔLE DE L'ESPACE & STOCKAGE                */}
      {/* ========================================================= */}
      {subTab === 'storage' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Cartes Métriques Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Espace Utilisé */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Espace Consommé</span>
                <HardDrive className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {metrics ? metrics.totalSizeFormatted : '...'}
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Total physique de la base SQLite</span>
              </p>
            </div>

            {/* Quota Alloué Turso */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Quota Turso Starter</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {metrics ? metrics.quotaFormatted : '9.00 Go'}
              </div>
              <p className="text-[11px] text-slate-400">
                Alloué sans surcoût sur votre cluster
              </p>
            </div>

            {/* Pourcentage Utilisé */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Taux d'Utilisation</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-blue-400">
                {metrics ? `${metrics.quotaPercentUsed}%` : '0.001%'}
              </div>
              <p className="text-[11px] text-slate-400">
                Marge disponible : <strong className="text-emerald-400">&gt; 99.99%</strong>
              </p>
            </div>

            {/* Latence & Version */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Latence & Moteur</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 flex items-baseline gap-2">
                <span>{metrics?.connected ? `${metrics.latencyMs} ms` : 'N/A'}</span>
                <span className="text-xs font-mono text-slate-400">
                  {metrics?.sqliteVersion ? `v${metrics.sqliteVersion}` : 'SQLite'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Temps d'accès répliqué au plus proche
              </p>
            </div>
          </div>

          {/* Jauge Visuelle de Stockage et Outil VACUUM */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span>Jauge de Consommation du Stockage libSQL</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualisez le volume occupé par vos 280 réservations, le catalogue et les comptes utilisateurs.
                </p>
              </div>

              {/* Bouton VACUUM */}
              <button
                type="button"
                onClick={handleVacuum}
                disabled={isVacuuming || !metrics?.connected}
                className="px-4 py-2 bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow border border-indigo-500/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                title="Libère les pages mortes et compacter la base SQLite sur Turso"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isVacuuming ? 'animate-spin' : ''}`} />
                <span>{isVacuuming ? 'Défragmentation en cours...' : 'Optimiser & Défragmenter (VACUUM)'}</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(metrics?.quotaPercentUsed || 0.5, 0.5)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Occupé : <strong className="text-slate-200">{metrics?.totalSizeFormatted || '0 Ko'}</strong>
                </span>
                <span>
                  Quota Turso Starter : <strong className="text-slate-200">9.00 Go</strong> (Disponible :{' '}
                  <strong className="text-emerald-400">~8.99 Go</strong>)
                </span>
              </div>
            </div>

            {/* Détails techniques SQLite */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-900 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Taille d'une page :</span>
                <strong className="text-slate-300 font-mono">{metrics?.pageSize || 4096} octets</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Nombre de pages :</span>
                <strong className="text-slate-300 font-mono">{metrics?.pageCount || 0} pages</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Pages libres (freelist) :</span>
                <strong className="text-emerald-400 font-mono">{metrics?.freelistCount || 0}</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Total Enregistrements :</span>
                <strong className="text-indigo-400 font-mono">{metrics?.totalRows || 0} lignes</strong>
              </div>
            </div>
          </div>

          {/* Répartition de l'Espace par Table */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Répartition de l'Espace par Table dans Turso</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Volume exact occupé par chaque entité métier dans la base libSQL.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSubTab('explorer')}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Explorer les tables</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics?.tables && metrics.tables.length > 0 ? (
                metrics.tables.map((t) => {
                  const percentOfDb = metrics.totalSizeBytes > 0
                    ? ((t.estimatedSizeBytes / metrics.totalSizeBytes) * 100).toFixed(1)
                    : '0';

                  return (
                    <div
                      key={t.name}
                      className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 hover:border-indigo-900/60 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{t.displayName}</span>
                        <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 text-[10px] font-mono rounded border border-indigo-900/60">
                          {t.name}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-extrabold text-slate-100">{t.rowCount}</span>
                        <span className="text-xs text-slate-400 font-mono">{formatBytes(t.estimatedSizeBytes)}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min(Math.max(Number(percentOfDb), 5), 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Part dans la base</span>
                          <span>{percentOfDb}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-4 text-center py-8 text-slate-500 text-xs">
                  Aucune statistique de table disponible pour le moment. Cliquez sur "Actualiser" ci-dessus.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: EXPORT HEBDOMADAIRE & SYNCHRONISATION          */}
      {/* ========================================================= */}
      {subTab === 'weekly_export' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card Planification Hebdomadaire Automatique */}
          <div className="bg-slate-950 p-6 sm:p-7 rounded-2xl border border-emerald-900/60 space-y-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Automatisme d'Entreprise
                  </span>
                  <span className="text-xs text-slate-400">Planificateur Hebdo (Node.js Cron)</span>
                </div>
                <h3 className="text-lg font-extrabold text-white mt-1">
                  Exportation Hebdomadaire Automatique vers Turso Database
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                  Activez cette option pour sauvegarder et répliquer automatiquement chaque semaine l'intégralité de la base de données (réservations, véhicules, utilisateurs et notes) sur votre compte Turso <strong>mongi95</strong>.
                </p>
              </div>

              {/* Toggle Enable/Disable */}
              <label className="flex items-center gap-3 cursor-pointer shrink-0 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-emerald-600 transition-all">
                <span className="text-xs font-bold text-slate-300">
                  {weeklyEnabled ? 'Planificateur Actif' : 'Planificateur Désactivé'}
                </span>
                <input
                  type="checkbox"
                  checked={weeklyEnabled}
                  onChange={(e) => setWeeklyEnabled(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer rounded"
                />
              </label>
            </div>

            {/* Paramètres horaires du Cron Hebdo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Jour de la semaine */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Jour de la semaine :</span>
                </label>
                <select
                  value={weeklyDay}
                  onChange={(e) => setWeeklyDay(Number(e.target.value))}
                  disabled={!weeklyEnabled}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {dayOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Chaque {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Par défaut : Dimanche (hors heures d'ouverture).
                </p>
              </div>

              {/* Heure d'exécution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Heure d'exécution :</span>
                </label>
                <select
                  value={weeklyHour}
                  onChange={(e) => setWeeklyHour(Number(e.target.value))}
                  disabled={!weeklyEnabled}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Privilégiez les heures creuses (ex: 02h00 du matin).
                </p>
              </div>

              {/* Minute d'exécution */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Minute :</span>
                </label>
                <select
                  value={weeklyMinute}
                  onChange={(e) => setWeeklyMinute(Number(e.target.value))}
                  disabled={!weeklyEnabled}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                >
                  <option value={0}>00 min</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Précision de l'ordonnanceur hebdomadaire.
                </p>
              </div>
            </div>

            {/* Statuts Prochaine & Dernière Exécution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Prochaine exécution hebdomadaire planifiée :</span>
                </span>
                <strong className="text-white text-sm block font-mono">
                  {metrics?.weeklySync.nextSync
                    ? new Date(metrics.weeklySync.nextSync).toLocaleString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Non configurée'}
                </strong>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dernier export hebdomadaire exécuté :</span>
                </span>
                <strong className="text-slate-300 text-sm block font-mono">
                  {metrics?.weeklySync.lastSync
                    ? new Date(metrics.weeklySync.lastSync).toLocaleString('fr-FR')
                    : 'Aucun pour le moment'}
                </strong>
              </div>
            </div>

            {/* Feedback message */}
            {scheduleFeedback && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{scheduleFeedback}</span>
              </div>
            )}

            {/* Bouton Enregistrer Planification */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Les modifications prennent effet immédiatement sur le serveur.
              </span>
              <button
                type="button"
                onClick={handleSaveSchedule}
                disabled={isSavingSchedule}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-emerald-500/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                <span>{isSavingSchedule ? 'Enregistrement...' : 'Enregistrer la programmation hebdomadaire'}</span>
              </button>
            </div>
          </div>

          {/* Déclenchement Manuel Instantané */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-indigo-400" />
                  <span>Déclencheur Manuel : Exporter Tout Immédiatement vers Turso</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronise sans attendre les 280 réservations, les fiches véhicules, les utilisateurs et les notes sur votre compte <strong>mongi95</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing || !config?.hasAuthToken}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-indigo-500/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>{isSyncing ? 'Export en cours...' : '⚡ Exporter maintenant vers Turso Database'}</span>
              </button>
            </div>

            {!config?.hasAuthToken && (
              <div className="p-3 bg-amber-950/60 border border-amber-800 text-amber-300 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Veuillez d'abord renseigner votre token d'authentification Turso dans l'onglet <strong>Paramètres & Connexion</strong> pour activer les exports.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: EXPLORATEUR DE DONNÉES TURSO EN DIRECT         */}
      {/* ========================================================= */}
      {subTab === 'explorer' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Controls Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Table Selector */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'reservations', label: 'Bons de Réservation', icon: FileText },
                { id: 'cars', label: 'Véhicules & Stock', icon: Car },
                { id: 'commercials', label: 'Commerciaux & Agences', icon: Users },
                { id: 'notes', label: 'Notes & Mémos', icon: Sparkles },
                { id: 'turso_meta', label: 'Métadonnées Turso', icon: Database },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTable(t.id);
                      setTablePage(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                      selectedTable === t.id
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setTablePage(0);
                }}
                placeholder="Rechercher dans la table..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table Data View */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Données réelles hébergées sur le cluster <strong>mongi95</strong> • Table :{' '}
                <strong className="text-white font-mono">{selectedTable}</strong>
              </span>
              <span>
                Total : <strong className="text-blue-400">{tableData?.total || 0}</strong> enregistrement(s)
              </span>
            </div>

            {isLoadingTable ? (
              <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                <span>Interrogation de la base Turso en cours...</span>
              </div>
            ) : tableData && tableData.rows && tableData.rows.length > 0 ? (
              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0 border-b border-slate-800">
                    <tr>
                      {tableData.columns
                        .filter((col) => col !== 'raw_json')
                        .map((col) => (
                          <th key={col} className="px-4 py-2.5 font-bold">
                            {col}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {tableData.rows.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        {tableData.columns
                          .filter((col) => col !== 'raw_json')
                          .map((col) => {
                            const val = row[col];
                            return (
                              <td key={col} className="px-4 py-2.5 font-mono text-[11px] truncate max-w-[240px]">
                                {val === null || val === undefined ? (
                                  <span className="text-slate-600 italic">null</span>
                                ) : typeof val === 'object' ? (
                                  JSON.stringify(val)
                                ) : String(val).startsWith('RES-') ? (
                                  <span className="font-bold text-emerald-400">{String(val)}</span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                Aucun enregistrement trouvé dans la table <strong>{selectedTable}</strong> sur Turso.
                <br />
                <button
                  type="button"
                  onClick={handleManualSync}
                  className="mt-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Synchroniser maintenant</span>
                </button>
              </div>
            )}

            {/* Pagination */}
            {tableData && tableData.total > pageSize && (
              <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Affichage de {tablePage * pageSize + 1} à{' '}
                  {Math.min((tablePage + 1) * pageSize, tableData.total)} sur {tableData.total}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTablePage((p) => Math.max(p - 1, 0))}
                    disabled={tablePage === 0}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-white">
                    Page {tablePage + 1} / {Math.ceil(tableData.total / pageSize)}
                  </span>
                  <button
                    onClick={() => setTablePage((p) => Math.min(p + 1, Math.ceil(tableData.total / pageSize) - 1))}
                    disabled={(tablePage + 1) * pageSize >= tableData.total}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: HISTORIQUE DES SYNCHRONISATIONS & AUDIT        */}
      {/* ========================================================= */}
      {subTab === 'history' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <span>Journal des 30 Dernières Synchronisations vers Turso</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Traçabilité complète des exports manuels et des exécutions hebdomadaires automatiques.
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-xl border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vider l'historique</span>
              </button>
            )}
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Aucun historique de synchronisation pour le moment.
              </div>
            ) : (
              <div className="divide-y divide-slate-900 text-xs">
                {history.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-900/40 transition-colors space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {item.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-bold text-white">{item.message}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.type === 'weekly_auto'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          }`}
                        >
                          {item.type === 'weekly_auto' ? '⏱️ Hebdo Auto' : '⚡ Manuel'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(item.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                      <span>Durée : <strong className="text-slate-300">{item.durationMs}ms</strong></span>
                      {item.counts && (
                        <span>
                          Réservations : <strong className="text-emerald-400">{item.counts.reservations}</strong> |
                          Véhicules : <strong className="text-indigo-400">{item.counts.cars}</strong> |
                          Notes : <strong className="text-amber-400">{item.counts.notes}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 5: PARAMÈTRES DE CONNEXION TURSO                  */}
      {/* ========================================================= */}
      {subTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 animate-fadeIn">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Paramètres de Connexion au Cluster Turso (app.turso.tech/mongi95)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ces identifiants permettent à l'application de s'authentifier directement auprès de votre organisation <strong>mongi95</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Database URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">URL libSQL (TURSO_DATABASE_URL) :</label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(urlInput)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="libsql://chery-sta-mongi95.turso.io"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              <p className="text-[11px] text-slate-500">
                Format type : <code className="text-indigo-300 font-mono">libsql://&lt;nom-base&gt;-mongi95.turso.io</code>
              </p>
            </div>

            {/* Auth Token */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">Token d'authentification (TURSO_AUTH_TOKEN) :</label>
                {config?.hasAuthToken && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Token configuré ({config.tokenPreview})
                  </span>
                )}
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showToken ? 'text' : 'password'}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={config?.hasAuthToken ? "•••••••••••••••• (Laisser vide pour conserver l'actuel)" : "Collez votre token Turso..."}
                  className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Généré depuis l'onglet <strong className="text-slate-400">Settings &gt; Tokens</strong> sur app.turso.tech.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-900">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSavingConfig}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow border border-indigo-500/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isSavingConfig ? 'Enregistrement...' : 'Enregistrer la configuration'}</span>
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white font-bold text-xs rounded-xl border border-indigo-900/60 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-indigo-400' : ''}`} />
                <span>{isTesting ? 'Test en cours...' : 'Tester la connexion & latence'}</span>
              </button>
            </div>

            <a
              href="https://app.turso.tech/mongi95"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <span>Accéder à votre console Turso</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </form>
      )}
    </div>
  );
};
