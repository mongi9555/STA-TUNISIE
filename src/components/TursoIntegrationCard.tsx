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
  Layers
} from 'lucide-react';

interface TursoConfigData {
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

export const TursoIntegrationCard: React.FC = () => {
  const [config, setConfig] = useState<TursoConfigData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [urlInput, setUrlInput] = useState<string>('libsql://chery-sta-mongi95.turso.io');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; version?: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; counts?: any } | null>(null);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullResult, setPullResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Charger la configuration Turso
  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/turso/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        if (data.url) setUrlInput(data.url);
      }
    } catch (err) {
      console.error('[Turso] Erreur chargement config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Sauvegarder les paramètres Turso
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/turso/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          ...(tokenInput.trim() ? { authToken: tokenInput.trim() } : {}),
          organization: 'mongi95',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTokenInput('');
        await loadConfig();
        setTestResult({
          success: true,
          message: 'Paramètres Turso enregistrés avec succès !',
        });
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
      setIsSaving(false);
    }
  };

  // Tester la connexion
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
        loadConfig();
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Erreur de connexion avec Turso.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Synchroniser vers Turso
  const handleSyncToTurso = async () => {
    if (!window.confirm("Voulez-vous synchroniser l'ensemble de la base STA (véhicules, 280 réservations, comptes et notes) vers votre base Turso sur mongi95 ?")) {
      return;
    }
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/turso/sync', { method: 'POST' });
      const data = await res.json();
      setSyncResult(data);
      if (data.success) {
        loadConfig();
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err?.message || 'Erreur lors de la synchronisation.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Récupérer depuis Turso
  const handlePullFromTurso = async () => {
    if (!window.confirm("Voulez-vous interroger la base Turso mongi95 pour vérifier les données présentes ?")) {
      return;
    }
    setIsPulling(true);
    setPullResult(null);
    try {
      const res = await fetch('/api/turso/pull', { method: 'POST' });
      const data = await res.json();
      setPullResult(data);
    } catch (err: any) {
      setPullResult({
        success: false,
        message: err?.message || 'Erreur lors de la récupération.',
      });
    } finally {
      setIsPulling(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Base Edge libSQL Distribuée
            </span>
            <span className="px-2.5 py-0.5 bg-slate-950 text-slate-300 text-xs font-mono rounded-full border border-slate-800">
              Org : <strong className="text-white">mongi95</strong>
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-400" />
            <span>Intégration Turso Database (app.turso.tech/mongi95)</span>
          </h3>

          <p className="text-xs text-slate-300 max-w-2xl">
            Connectez directement cette application à votre cluster de base de données <strong>Turso</strong> (libSQL/SQLite) hébergé sur votre compte <strong>mongi95</strong>. Les 280 réservations, véhicules, comptes et notes peuvent y être persistés et répliqués à l'échelle mondiale.
          </p>
        </div>

        {/* Dashboard Link */}
        <a
          href="https://app.turso.tech/mongi95"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Ouvrir Turso (mongi95)</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Guide Rapide 3 Étapes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Accéder à votre Dashboard</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Rendez-vous sur <strong className="text-slate-200">app.turso.tech/mongi95</strong> et connectez-vous avec votre compte.
          </p>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Créer la base de données</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Cliquez sur <strong className="text-slate-200">"Create Database"</strong> (ex: nommez-la <code className="text-indigo-300">chery-sta</code>).
          </p>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Générer le Token & Lier</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Générez un Token d'accès (<strong className="text-slate-200">Create Token</strong>), collez-le ci-dessous et cliquez sur synchroniser.
          </p>
        </div>
      </div>

      {/* Formulaire de configuration */}
      <form onSubmit={handleSaveConfig} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-400" />
          <span>Paramètres de connexion Turso</span>
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Database URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">URL de la base libSQL :</label>
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
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <p className="text-[11px] text-slate-500">
              Format type : <code className="text-indigo-300 font-mono">libsql://&lt;nom-base&gt;-mongi95.turso.io</code>
            </p>
          </div>

          {/* Auth Token */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Token d'authentification Turso (TURSO_AUTH_TOKEN) :</label>
              {config?.hasAuthToken && (
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Token actif ({config.tokenPreview})
                </span>
              )}
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder={config?.hasAuthToken ? "•••••••••••••••• (Laisser vide pour conserver l'actuel)" : "Collez votre token Turso ici..."}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Généré depuis l'onglet <strong className="text-slate-400">Settings &gt; Tokens</strong> de votre dashboard Turso.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow border border-indigo-500/40 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isSaving ? 'Enregistrement...' : 'Enregistrer la configuration'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white font-bold text-xs rounded-xl border border-indigo-900/60 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isTesting ? 'Test en cours...' : 'Tester la connexion'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncToTurso}
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg border border-emerald-500/40 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Créer les tables et exporter toutes les réservations vers Turso"
            >
              <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Synchronisation Turso...' : 'Pousser vers Turso (280 réservations)'}</span>
            </button>

            <button
              type="button"
              onClick={handlePullFromTurso}
              disabled={isPulling}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Vérifier le contenu présent sur Turso"
            >
              <Download className={`w-3.5 h-3.5 ${isPulling ? 'animate-spin' : ''}`} />
              <span>Vérifier Turso</span>
            </button>
          </div>
        </div>
      </form>

      {/* Messages de retour */}
      {testResult && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-fadeIn ${
            testResult.success
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
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
          className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-fadeIn ${
            syncResult.success
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/80 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncResult.message}</span>
          </div>
          <button onClick={() => setSyncResult(null)} className="text-slate-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {pullResult && (
        <div className="p-4 bg-indigo-950/80 border border-indigo-800 rounded-xl text-xs text-indigo-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{pullResult.message}</span>
          </div>
          <button onClick={() => setPullResult(null)} className="text-indigo-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Statut de synchronisation actuelle */}
      {config?.lastSyncAt && (
        <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-3">
          <span>
            Dernière synchronisation avec Turso :{' '}
            <strong className="text-slate-300">
              {new Date(config.lastSyncAt).toLocaleString('fr-FR')}
            </strong>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Données protégées sur libSQL Edge</span>
          </span>
        </div>
      )}
    </div>
  );
};
