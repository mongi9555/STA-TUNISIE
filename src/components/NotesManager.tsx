import React, { useState, useEffect } from 'react';
import {
  StickyNote,
  Plus,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Trash2,
  Edit3,
  Calendar,
  Tag,
  CheckCircle2,
  X,
  Server,
  Sparkles,
  Search,
  Pin,
  FileText
} from 'lucide-react';
import { listNotes, createNote, updateNote, deleteNote, getApiUrl, setApiUrl } from '../api';
import { CommercialUser, ThemeMode } from '../types';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  isPinned?: boolean;
  color?: string;
}

interface NotesManagerProps {
  currentUser: CommercialUser;
  theme?: ThemeMode;
}

export const NotesManager: React.FC<NotesManagerProps> = ({ currentUser, theme }) => {
  // Liste des notes chargées depuis l'API distante
  const [notes, setNotes] = useState<NoteItem[]>([]);
  
  // États de cycle de vie réseau (UX requis)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // Filtres de recherche
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal création / édition
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Général');
  const [formIsPinned, setFormIsPinned] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Configuration de l'URL d'API (permettant de tester l'erreur distante workers.dev ou l'API locale)
  const [currentUrl, setCurrentUrl] = useState<string>(getApiUrl());
  const [showConfigUrl, setShowConfigUrl] = useState<boolean>(false);

  // Catégories prédéfinies
  const categories = ['Général', 'Client', 'Dossier Leasing', 'Stock', 'Rendez-vous', 'Suivi Commande'];

  // 1. Chargement des notes depuis l'API REST
  const loadNotes = async () => {
    setLoading(true);
    setIsRetrying(true);
    setError(null);

    try {
      const data = await listNotes();
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (err: any) {
      console.error('[API Notes Error]', err);
      setError(err?.message || "Impossible de contacter le serveur distant.");
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // 2. Gestion de la création ou modification via l'API REST
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() && !formContent.trim()) {
      setFormError('Veuillez renseigner un titre ou un contenu pour la note.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingNote) {
        // PUT {API_URL}/api/notes/{id}
        const updatedPayload = {
          title: formTitle.trim() || 'Sans titre',
          content: formContent.trim(),
          category: formCategory,
          isPinned: formIsPinned,
          author: currentUser?.name || editingNote.author || 'Commercial',
        };
        const updated = await updateNote(editingNote.id, updatedPayload);
        setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? { ...n, ...updated } : n)));
      } else {
        // POST {API_URL}/api/notes
        const newPayload = {
          title: formTitle.trim() || 'Sans titre',
          content: formContent.trim(),
          category: formCategory,
          isPinned: formIsPinned,
          author: currentUser?.name || 'Commercial',
        };
        const created = await createNote(newPayload);
        setNotes((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
      setEditingNote(null);
      setFormTitle('');
      setFormContent('');
      setFormCategory('Général');
      setFormIsPinned(false);
    } catch (err: any) {
      console.error('[API Save Note Error]', err);
      setFormError(err?.message || "Erreur lors de l'enregistrement de la note via l'API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Suppression via l'API REST
  const handleDeleteNote = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      alert(`Erreur de suppression : ${err?.message || 'Erreur réseau'}`);
    }
  };

  // Bascule de l'URL API (Workers.dev vs Serveur Local Express)
  const handleSwitchApiUrl = (newUrl: string) => {
    setApiUrl(newUrl);
    setCurrentUrl(newUrl);
    loadNotes();
  };

  // Filtrage des notes affichées
  const filteredNotes = notes.filter((note) => {
    const matchCat = categoryFilter === 'all' || note.category === categoryFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      (note.title && note.title.toLowerCase().includes(term)) ||
      (note.content && note.content.toLowerCase().includes(term)) ||
      (note.author && note.author.toLowerCase().includes(term));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header avec Titre & Statut API REST */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Bloc-Notes & Mémos Commerciaux
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400">
                Couche d'accès aux données distantes via API REST
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300">
                <Server className="w-3 h-3 text-red-400" />
                {currentUrl}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Bouton Configuration API URL */}
          <button
            onClick={() => setShowConfigUrl(!showConfigUrl)}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Configurer ou basculer l'URL du serveur API"
          >
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span>Endpoint API</span>
          </button>

          {/* Bouton Rafraîchir / Recharger */}
          <button
            onClick={loadNotes}
            disabled={loading}
            className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Rafraîchir les notes depuis l'API REST"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-red-400' : ''}`} />
            <span>Actualiser</span>
          </button>

          {/* Bouton Nouvelle Note */}
          <button
            onClick={() => {
              setEditingNote(null);
              setFormTitle('');
              setFormContent('');
              setFormCategory('Général');
              setFormIsPinned(false);
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/40 border border-red-500/30 flex items-center gap-1.5 transition-all cursor-pointer ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Note</span>
          </button>
        </div>
      </div>

      {/* Panneau de configuration Endpoint API (permettant de tester workers.dev ou local express) */}
      {showConfigUrl && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Server className="w-4 h-4 text-red-400" />
              Configuration de l'URL API REST (api.js) :
            </span>
            <button onClick={() => setShowConfigUrl(false)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
          <p className="text-slate-400 text-[11px]">
            Conformément à la consigne, l'URL initiale dans <code className="text-red-300 font-mono">api.js</code> est configurée sur{' '}
            <code className="text-red-300 font-mono">https://monapp-api.XXX.workers.dev</code>. Vous pouvez tester le comportement en cas d'échec réseau ou basculer sur l'API locale du serveur STA Express.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSwitchApiUrl('https://monapp-api.XXX.workers.dev')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
                currentUrl === 'https://monapp-api.XXX.workers.dev'
                  ? 'bg-red-950 border-red-600 text-red-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Cloudflare Worker : https://monapp-api.XXX.workers.dev
            </button>
            <button
              onClick={() => handleSwitchApiUrl('')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all ${
                currentUrl === ''
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Serveur Express Local (/api/notes)
            </button>
          </div>
        </div>
      )}

      {/* BANDEAU D'ERREUR RÉSEAU + BOUTON RÉESSAYER (Condition UX n°4) */}
      {error && !loading && (
        <div className="p-5 bg-red-950/80 border-2 border-red-600/90 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-red-200 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-900/60 text-red-300 rounded-xl border border-red-500/40 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Échec de connexion à l'API REST distante
              </h3>
              <p className="text-xs text-red-200/90">
                Impossible d'accéder au service distant sur <code className="bg-red-900/50 px-1.5 py-0.5 rounded font-mono text-red-100">{currentUrl}/api/notes</code>.
              </p>
              <p className="text-[11px] text-red-300/80 font-mono">
                Détail : {error}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {/* Bouton Réessayer obligatoire */}
            <button
              onClick={loadNotes}
              disabled={isRetrying}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg border border-red-400 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Nouvelle tentative...' : 'Réessayer'}</span>
            </button>

            {/* Bascule rapide vers l'API locale si le worker distant est injoignable */}
            {currentUrl !== '' && (
              <button
                onClick={() => handleSwitchApiUrl('')}
                className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Basculer vers l'API locale du serveur pour continuer le travail"
              >
                <span>Utiliser l'API locale</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* SPINNER PENDANT LE CHARGEMENT (Condition UX n°4) */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 shadow-sm">
          <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            <div className="absolute inset-0 blur-md bg-red-500/20 rounded-full animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-white">Chargement des notes en cours...</h3>
            <p className="text-xs text-slate-400">
              Interrogation de la couche d'accès aux données distantes ({currentUrl || 'API locale'})...
            </p>
          </div>
        </div>
      )}

      {/* ÉTAT VIDE AVEC MESSAGE D'ACCUEIL (Condition UX n°4) */}
      {!loading && !error && notes.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-2xl border border-red-500/20 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8 text-red-400" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-white">
              Bienvenue sur votre espace Notes & Mémos !
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vos notes sont désormais synchronisées en temps réel via l'<strong>API REST distante</strong>, sans dépendre du stockage navigateur (localStorage).
            </p>
            <p className="text-xs text-slate-500">
              Commencez dès maintenant en rédigeant votre première note pour organiser vos suivis clients, consignes de showroom ou mémos commerciaux.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setEditingNote(null);
                setFormTitle('');
                setFormContent('');
                setFormCategory('Général');
                setFormIsPinned(false);
                setFormError(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/40 border border-red-500/30 inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer ma première note</span>
            </button>
          </div>
        </div>
      )}

      {/* LISTE DES NOTES (quand des notes sont présentes et sans erreur) */}
      {!loading && !error && notes.length > 0 && (
        <div className="space-y-4">
          {/* Barre de recherche et de filtre par catégorie */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher dans les notes (titre, contenu, auteur)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
              >
                <option value="all">Toutes les catégories ({notes.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({notes.filter((n) => n.category === cat).length})
                  </option>
                ))}
              </select>

              <span className="text-xs text-slate-400 px-2">
                {filteredNotes.length} note(s)
              </span>
            </div>
          </div>

          {/* Grille des Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`bg-slate-900 border rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 relative group ${
                  note.isPinned ? 'border-amber-500/50 bg-slate-900/90' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {note.isPinned && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-md text-[10px] font-bold flex items-center gap-1">
                            <Pin className="w-2.5 h-2.5" /> Épinglée
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px] font-medium flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5 text-red-400" />
                          {note.category || 'Général'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white pt-1">
                        {note.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingNote(note);
                          setFormTitle(note.title);
                          setFormContent(note.content);
                          setFormCategory(note.category || 'Général');
                          setFormIsPinned(Boolean(note.isPinned));
                          setFormError(null);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-all cursor-pointer"
                        title="Modifier cette note"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg border border-slate-800 hover:border-red-700/50 transition-all cursor-pointer"
                        title="Supprimer cette note via DELETE /api/notes/:id"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 whitespace-pre-wrap pt-2.5 leading-relaxed">
                    {note.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {note.updatedAt
                      ? `Modifiée le ${new Date(note.updatedAt).toLocaleDateString('fr-FR')}`
                      : note.createdAt
                      ? `Créée le ${new Date(note.createdAt).toLocaleDateString('fr-FR')}`
                      : 'Date récente'}
                  </span>
                  {note.author && (
                    <span className="text-slate-400 font-medium">
                      Par : {note.author}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Création / Édition de Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-red-500" />
                <span>{editingNote ? 'Modifier la note' : 'Créer une nouvelle note'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl text-xs text-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Titre de la note :
                </label>
                <input
                  type="text"
                  placeholder="Ex : Suivi commande client Ben Salem..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Catégorie :
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPinned}
                      onChange={(e) => setFormIsPinned(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-red-600 focus:ring-red-500"
                    />
                    <span>Épingler en haut</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contenu :
                </label>
                <textarea
                  rows={5}
                  placeholder="Saisissez les détails de votre note..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg border border-red-500/40 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enregistrement API...</span>
                    </>
                  ) : (
                    <span>{editingNote ? 'Mettre à jour via API' : 'Enregistrer via API'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
