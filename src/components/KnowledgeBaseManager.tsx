import React, { useState } from 'react';
import { KnowledgeBaseItem, KnowledgeCategory, CommercialUser } from '../types';
import { BookOpen, Plus, Search, Tag, Edit3, Trash2, CheckCircle2, AlertCircle, Sparkles, Filter, Building2, ShieldCheck, FileText, Gift, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KnowledgeBaseManagerProps {
  items: KnowledgeBaseItem[];
  onSaveItems: (items: KnowledgeBaseItem[]) => void;
  currentUser: CommercialUser;
  theme: 'dark' | 'light' | 'red';
}

const CATEGORY_LABELS: Record<KnowledgeCategory, { label: string; icon: any; color: string }> = {
  garantie: { label: 'Garanties & SAV', icon: ShieldCheck, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  financement: { label: 'Financement & Leasing', icon: FileText, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  agences: { label: 'Agences & Horaires', icon: Building2, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  promotions: { label: 'Promotions & Offres', icon: Gift, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  faq: { label: 'FAQ Clients & Vente', icon: HelpCircle, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  fiches_techniques: { label: 'Fiches Techniques', icon: BookOpen, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  politique_sta: { label: 'Politiques STA', icon: ShieldCheck, color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
};

export const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  items,
  onSaveItems,
  currentUser,
  theme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [editingItem, setEditingItem] = useState<KnowledgeBaseItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State for create/edit
  const [formData, setFormData] = useState<{
    title: string;
    category: KnowledgeCategory;
    content: string;
    tagsString: string;
    isPublicForAI: boolean;
  }>({
    title: '',
    category: 'faq',
    content: '',
    tagsString: '',
    isPublicForAI: true,
  });

  const isUserAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setFormData({
      title: '',
      category: 'faq',
      content: '',
      tagsString: 'Chery, STA, Tunisie',
      isPublicForAI: true,
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleOpenEditModal = (item: KnowledgeBaseItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      content: item.content,
      tagsString: item.tags ? item.tags.join(', ') : '',
      isPublicForAI: item.isPublicForAI,
    });
    setIsCreating(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const parsedTags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const now = new Date().toISOString().split('T')[0];

    if (editingItem) {
      const updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              title: formData.title.trim(),
              category: formData.category,
              content: formData.content.trim(),
              tags: parsedTags,
              isPublicForAI: formData.isPublicForAI,
              updatedAt: now,
              updatedBy: currentUser.name,
            }
          : it
      );
      onSaveItems(updated);
    } else {
      const newItem: KnowledgeBaseItem = {
        id: `kb-${Date.now()}`,
        title: formData.title.trim(),
        category: formData.category,
        content: formData.content.trim(),
        tags: parsedTags,
        updatedAt: now,
        updatedBy: currentUser.name,
        isPublicForAI: formData.isPublicForAI,
      };
      onSaveItems([newItem, ...items]);
    }

    setIsCreating(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cet article de la Base de Connaissances ?')) {
      onSaveItems(items.filter((it) => it.id !== id));
    }
  };

  const cardBgClass =
    theme === 'light'
      ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
      : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl';

  const inputBgClass =
    theme === 'light'
      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:bg-white'
      : 'bg-slate-950 border-slate-800 text-white focus:bg-slate-900';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border ${cardBgClass} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-950/40 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-extrabold tracking-tight">Base de Connaissances & FAQ Entreprise</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 text-white flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> Synchronisé avec Chery Bot IA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gérez les informations officielles de la STA (Garanties, financements Leasing, fiches techniques, tarifs, agences). Ces fiches alimentent l'intelligence artificielle pour répondre aux clients.
            </p>
          </div>
        </div>

        {isUserAdmin && (
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Ajouter une Fiche
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className={`p-4 rounded-2xl border ${cardBgClass} flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, mot-clé, tag..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-red-500 transition ${inputBgClass}`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Toutes ({items.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as KnowledgeCategory[]).map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const catInfo = CATEGORY_LABELS[cat];
            const Icon = catInfo.icon;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{catInfo.label} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const catInfo = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.faq;
          const Icon = catInfo.icon;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border ${cardBgClass} flex flex-col justify-between gap-4 relative group hover:border-red-500/50 transition duration-200`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border flex items-center gap-1.5 ${catInfo.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {catInfo.label}
                  </span>

                  <div className="flex items-center gap-1">
                    {item.isPublicForAI ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1" title="Accessible par l'assistant IA Chery Bot">
                        <Sparkles className="w-3 h-3" /> IA Actif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        Interne
                      </span>
                    )}

                    {isUserAdmin && (
                      <div className="flex items-center gap-1 ml-2 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-base leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1 flex-wrap">
                  {item.tags?.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[10px] font-mono flex items-center gap-0.5">
                      <Tag className="w-2.5 h-2.5 text-red-400" /> {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] shrink-0 text-slate-400">
                  Maj: {item.updatedAt}
                </span>
              </div>
            </motion.div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className={`col-span-full p-12 text-center rounded-2xl border ${cardBgClass} space-y-3`}>
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <h4 className="font-bold text-base">Aucun article trouvé</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Aucun résultat ne correspond à votre recherche "{searchQuery}". Essayez avec un autre mot-clé ou modifiez la catégorie sélectionnée.
            </p>
          </div>
        )}
      </div>

      {/* Modal Form for Create / Edit */}
      <AnimatePresence>
        {(isCreating || editingItem) && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSaveForm}
              className={`max-w-xl w-full rounded-2xl border p-6 space-y-4 shadow-2xl ${cardBgClass}`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-500" />
                  <h3 className="font-extrabold text-base">
                    {editingItem ? 'Modifier la Fiche de Connaissances' : 'Nouvelle Fiche de Connaissances'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem(null);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Titre de l'information / Question :</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="ex: Procédure de Révision 10 000 km Chery"
                    className={`w-full p-2.5 rounded-xl border font-semibold ${inputBgClass}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Catégorie :</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as KnowledgeCategory })}
                      className={`w-full p-2.5 rounded-xl border font-semibold cursor-pointer ${inputBgClass}`}
                    >
                      {(Object.keys(CATEGORY_LABELS) as KnowledgeCategory[]).map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Tags / Mots-clés (séparés par des virgules) :</label>
                    <input
                      type="text"
                      value={formData.tagsString}
                      onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                      placeholder="Garantie, Moteur, Vidange..."
                      className={`w-full p-2.5 rounded-xl border font-semibold ${inputBgClass}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Contenu Détaillé / Réponse :</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Saisissez la réponse détaillée, les conditions précises ou le récapitulatif commercial..."
                    className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isPublicForAI"
                    checked={formData.isPublicForAI}
                    onChange={(e) => setFormData({ ...formData, isPublicForAI: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isPublicForAI" className="font-semibold text-slate-300 cursor-pointer flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Transmettre cette fiche à Chery Bot IA pour l'apprentissage en direct
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Enregistrer Fiche
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
