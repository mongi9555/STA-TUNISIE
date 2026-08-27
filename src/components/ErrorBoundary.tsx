import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in React ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
          <div className="max-w-xl w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Chery Tunisie - Diagnostic d'Affichage
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Une erreur inattendue est survenue lors de l'exécution de l'interface.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-red-400">Détail technique :</p>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-36 leading-relaxed">
                {this.state.error?.message || 'Erreur d\'exécution du script React'}
              </pre>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-amber-400">💡 Conseil de compatibilité Windows 8 :</p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Si vous êtes sur Windows 8 / 8.1, privilégiez <strong>Google Chrome</strong> ou <strong>Mozilla Firefox ESR</strong> plutôt qu'un ancien Internet Explorer obsolète.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recharger la page</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Vider le cache et relancer</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
