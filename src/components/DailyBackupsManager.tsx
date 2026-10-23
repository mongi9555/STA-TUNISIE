import React, { useState, useEffect } from 'react';
import { Calendar, Download, RefreshCw, Database, CheckCircle2, Shield, HardDrive, FileJson, AlertCircle } from 'lucide-react';

interface DailyBackupItem {
  filename: string;
  date: string;
  sizeBytes: number;
  sizeFormatted: string;
  modifiedAt: string;
  reservationCount: number;
  carsCount: number;
}

interface DailyBackupsResponse {
  success: boolean;
  backups: DailyBackupItem[];
  totalBackups: number;
  latestBackup: DailyBackupItem | null;
  autoDailyEnabled: boolean;
}

interface DailyBackupsManagerProps {
  onDatabaseRestored?: () => void;
}

export const DailyBackupsManager: React.FC<DailyBackupsManagerProps> = ({ onDatabaseRestored }) => {
  const [backups, setBackups] = useState<DailyBackupItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [restoringFile, setRestoringFile] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const fetchDailyBackups = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/db/daily-backups');
      if (res.ok) {
        const data: DailyBackupsResponse & { disabled?: boolean } = await res.json();
        if (data && Array.isArray(data.backups)) {
          setBackups(data.backups);
        }
        if (data && (data.disabled === true || data.autoDailyEnabled === false)) {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
      }
    } catch (err) {
      console.warn('Erreur chargement des sauvegardes quotidiennes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyBackups();
    const interval = setInterval(fetchDailyBackups, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerDailyBackup = async () => {
    setIsTriggering(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/db/daily-backups/run-now', { method: 'POST' });
      const data = await res.json();
      if (data && data.success) {
        setStatusMessage({
          type: 'success',
          text: `Sauvegarde quotidienne créée avec succès pour la date du ${data.date} (${data.count} réservations enregistrées).`,
        });
        await fetchDailyBackups();
      } else {
        setStatusMessage({
          type: 'error',
          text: data?.message || 'Erreur lors de la création de la sauvegarde.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Erreur de connexion au serveur.',
      });
    } finally {
      setIsTriggering(false);
    }
  };

  const handleRestoreBackup = async (filename: string, date: string) => {
    const confirmRestore = window.confirm(
      `⚠️ ATTENTION : Confirmez-vous la restauration de la base de données depuis la sauvegarde quotidienne du ${date} (${filename}) ?\n\nUne sauvegarde automatique de secours de votre état actuel sera créée avant l'application.`
    );
    if (!confirmRestore) return;

    setRestoringFile(filename);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/db/daily-backups/restore/${encodeURIComponent(filename)}`, { method: 'POST' });
      const data = await res.json();
      if (data && data.success) {
        setStatusMessage({
          type: 'success',
          text: `Base restaurée avec succès depuis ${filename} (${data.reservationCount} réservations rechargées). Actualisation...`,
        });
        if (onDatabaseRestored) {
          onDatabaseRestored();
        }
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setStatusMessage({
          type: 'error',
          text: data?.error || 'Erreur lors de la restauration.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Erreur réseau lors de la restauration.',
      });
    } finally {
      setRestoringFile(null);
    }
  };

  return (
    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <h4 className="text-base font-extrabold text-white">
              Serveur Local (data/db.json & Clichés Quotidiens)
            </h4>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              isDisabled
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isDisabled ? '⚪ Désactivé au profit de Turso' : 'Actif 24/7'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isDisabled
              ? 'Le serveur local (data/db.json) et la génération de clichés de secours locaux sont désactivés. Vos données sont synchronisées automatiquement chaque jour sur la base de données cloud Turso libSQL (mongi95) et répliquées en continu.'
              : 'La base de données enregistre automatiquement un instantané complet chaque jour dans data/daily_backups/.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchDailyBackups}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Rafraîchir le statut"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Actualiser</span>
          </button>

          <button
            onClick={handleTriggerDailyBackup}
            disabled={isTriggering || isDisabled}
            className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 cursor-not-allowed disabled:opacity-60"
            title={isDisabled ? "Serveur local et clichés quotidiens désactivés" : "Enregistrer un cliché"}
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>{isDisabled ? 'Serveur Local Désactivé' : 'Enregistrer Maintenant'}</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Info Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center gap-3">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Synchronisation Automatique</div>
            <div className="font-bold text-white text-xs">Temps réel & base de données</div>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center gap-3">
          <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Stockage Navigateur</div>
            <div className="font-bold text-white text-xs">Zéro LocalStorage (0% quota)</div>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Fréquence d'archivage</div>
            <div className="font-bold text-white text-xs">Chaque jour automatiquement</div>
          </div>
        </div>
      </div>

      {/* List of daily backups */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>Historique des Sauvegardes Quotidiennes ({backups.length})</span>
          <span>Rétention : 90 derniers jours</span>
        </div>

        {backups.length === 0 ? (
          <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
            {isLoading ? 'Recherche des clichés de sauvegarde...' : 'Aucun fichier de sauvegarde quotidienne détecté.'}
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {backups.map((b) => (
              <div
                key={b.filename}
                className="p-3 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <FileJson className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white font-mono">{b.date}</span>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                        {b.sizeFormatted}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-1.5 py-0.5 rounded">
                        {b.reservationCount} réservations
                      </span>
                      {b.carsCount > 0 && (
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {b.carsCount} modèles
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                      {b.filename}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <a
                    href={`/api/db/daily-backups/download/${encodeURIComponent(b.filename)}`}
                    download={b.filename}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Télécharger</span>
                  </a>

                  <button
                    onClick={() => handleRestoreBackup(b.filename, b.date)}
                    disabled={restoringFile === b.filename}
                    className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {restoringFile === b.filename ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Restauration...</span>
                      </>
                    ) : (
                      <span>Restaurer</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
