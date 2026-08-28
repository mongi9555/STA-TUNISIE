import React, { useState, useMemo } from 'react';
import { AdministrativeDocument, AdminDocCategory, CommercialUser } from '../types';
import {
  FileText,
  FileCheck,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  CreditCard,
  Car,
  Calendar,
  X,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckSquare,
  Square,
  Clock,
  Printer
} from 'lucide-react';

interface AdministrativeDocumentsProps {
  documents: AdministrativeDocument[];
  currentUser?: CommercialUser;
  onAddDocument: (doc: AdministrativeDocument) => void;
  onDeleteDocument: (docId: string) => void;
}

const CATEGORY_CONFIG: Record<
  AdminDocCategory | 'all',
  { label: string; icon: React.ReactNode; color: string }
> = {
  all: {
    label: 'Tous les documents',
    icon: <Layers className="w-4 h-4" />,
    color: 'text-slate-200 bg-slate-800 border-slate-700',
  },
  leasing: {
    label: 'Dossiers Leasing',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30',
  },
  particulier: {
    label: 'Dossiers Particuliers',
    icon: <User className="w-4 h-4" />,
    color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
  },
  societe: {
    label: 'Sociétés & Flottes',
    icon: <Building className="w-4 h-4" />,
    color: 'text-blue-400 bg-blue-950/40 border-blue-500/30',
  },
  immatriculation: {
    label: 'Immatriculation & Cartes Grises',
    icon: <ShieldCheck className="w-4 h-4" />,
    color: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
  },
  livraison: {
    label: 'Livraison & Contrôle PDI',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-teal-400 bg-teal-950/40 border-teal-500/30',
  },
  credit: {
    label: 'Crédit Bancaire Direct',
    icon: <CreditCard className="w-4 h-4" />,
    color: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
  },
  conformite: {
    label: 'Conformité & Légal',
    icon: <ShieldCheck className="w-4 h-4" />,
    color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
  },
  general: {
    label: 'Procédures Générales',
    icon: <FileText className="w-4 h-4" />,
    color: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
  },
};

export const AdministrativeDocuments: React.FC<AdministrativeDocumentsProps> = ({
  documents,
  currentUser,
  onAddDocument,
  onDeleteDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AdminDocCategory | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'pdf' | 'docx'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<AdministrativeDocument | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AdminDocCategory>('leasing');
  const [newFormat, setNewFormat] = useState<'pdf' | 'docx'>('pdf');
  const [newDescription, setNewDescription] = useState('');
  const [newApplicableModels, setNewApplicableModels] = useState('Tous modèles Chery');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileDataUrl, setUploadedFileDataUrl] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [formError, setFormError] = useState('');

  // Interactive preview checklist items checked state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheckItem = (index: number) => {
    const key = `${previewDoc?.id}-${index}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isDocx =
      file.name.toLowerCase().endsWith('.docx') ||
      file.name.toLowerCase().endsWith('.doc') ||
      file.type.includes('word');

    if (!isPdf && !isDocx) {
      setFormError('Format invalide. Veuillez sélectionner un fichier PDF (.pdf) ou Word (.docx / .doc).');
      return;
    }

    setFormError('');
    setUploadedFileName(file.name);
    setNewFormat(isPdf ? 'pdf' : 'docx');

    if (!newTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewTitle(cleanName);
    }

    const sizeInKB = Math.round(file.size / 1024);
    setUploadedFileSize(sizeInKB > 1024 ? `${(sizeInKB / 1024).toFixed(1)} MB` : `${sizeInKB} KB`);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadedFileDataUrl(dataUrl);

      // Upload file to permanent server storage
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData: dataUrl,
            fileName: file.name,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.url) {
            setUploadedFileDataUrl(json.url);
          }
        }
      } catch (err) {
        console.warn('Server upload failed, fallback to local dataUrl:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Veuillez renseigner un titre pour le document.');
      return;
    }

    const checklistItems = newChecklistText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newDoc: AdministrativeDocument = {
      id: `doc-adm-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: CATEGORY_CONFIG[newCategory]?.label || 'Autre',
      fileFormat: newFormat,
      fileName: uploadedFileName || `${newTitle.trim().replace(/\s+/g, '_')}.${newFormat}`,
      fileUrl: uploadedFileDataUrl,
      fileSizeFormatted: uploadedFileSize || (newFormat === 'pdf' ? '145 KB' : '92 KB'),
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser?.name || 'Direction STA',
      description: newDescription.trim() || undefined,
      applicableModels: newApplicableModels.trim() || 'Tous modèles',
      isOfficialSTA: true,
      itemCount: checklistItems.length > 0 ? checklistItems.length : undefined,
      checklistItems: checklistItems.length > 0 ? checklistItems : undefined,
    };

    onAddDocument(newDoc);
    setIsAddModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewCategory('leasing');
    setNewFormat('pdf');
    setNewDescription('');
    setNewApplicableModels('Tous modèles Chery');
    setNewChecklistText('');
    setUploadedFileName('');
    setUploadedFileDataUrl('');
    setUploadedFileSize('');
    setFormError('');
  };

  const handleDownload = (doc: AdministrativeDocument) => {
    if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Generate formatted text/markdown file if no direct fileUrl
    const content = [
      `========================================================================`,
      `SOCIÉTÉ TUNISIENNE D'AUTOMOBILES (STA) - CONCESSIONNAIRE OFFICIEL CHERY`,
      `DOCUMENT ADMINISTRATIF & CHECK-LIST OFFICIELLE`,
      `========================================================================`,
      ``,
      `TITRE DU DOCUMENT : ${doc.title}`,
      `CATÉGORIE : ${doc.categoryLabel}`,
      `FORMAT OFFICIEL : ${doc.fileFormat.toUpperCase()}`,
      `MODÈLES APPLICABLES : ${doc.applicableModels || 'Tous modèles'}`,
      `DATE DE PUBLICATION : ${new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}`,
      `ÉMIS PAR : ${doc.uploadedBy}`,
      ``,
      `DESCRIPTION :`,
      doc.description || 'Check-list officielle et conforme aux procédures internes STA.',
      ``,
      `------------------------------------------------------------------------`,
      `PIÈCES & ÉTAPES DE LA CHECK-LIST :`,
      `------------------------------------------------------------------------`,
      ...(doc.checklistItems && doc.checklistItems.length > 0
        ? doc.checklistItems.map((item, idx) => `[ ] ${idx + 1}. ${item}`)
        : ['1. Dossier complet conforme aux règles STA']),
      ``,
      `========================================================================`,
      `Direction Commerciale & Administrative - STA Chery Tunisie`,
      `Z.I Borj Ghorbel, GP1 Km 13, Ben Arous • Tel: +216 71 800 900`,
      `========================================================================`,
    ].join('\n');

    const mimeType = doc.fileFormat === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName.endsWith(`.${doc.fileFormat}`) ? doc.fileName : `${doc.fileName}.${doc.fileFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesFormat = selectedFormat === 'all' || doc.fileFormat === selectedFormat;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        doc.title.toLowerCase().includes(term) ||
        (doc.description && doc.description.toLowerCase().includes(term)) ||
        doc.categoryLabel.toLowerCase().includes(term) ||
        (doc.applicableModels && doc.applicableModels.toLowerCase().includes(term)) ||
        (doc.checklistItems && doc.checklistItems.some((item) => item.toLowerCase().includes(term)));

      return matchesCat && matchesFormat && matchesSearch;
    });
  }, [documents, selectedCategory, selectedFormat, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl shrink-0">
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Documents Administratifs & Check-lists STA
                </h3>
                <span className="px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold rounded-full">
                  PDF & DOCX
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Espace centralisé de dépôt et téléchargement des check-lists officielles Chery Tunisie (Dossiers Leasing, Particuliers, Sociétés, Immatriculation ATTT, Contrôle Livraison Showroom PDI).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Document / Check-list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Category Carousel / Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {(Object.keys(CATEGORY_CONFIG) as Array<AdminDocCategory | 'all'>).map((catKey) => {
            const isSelected = selectedCategory === catKey;
            const config = CATEGORY_CONFIG[catKey];
            const count =
              catKey === 'all'
                ? documents.length
                : documents.filter((d) => d.category === catKey).length;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{config.icon}</span>
                <span>{config.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-red-950 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Format Filter */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une check-list ou document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-medium">
              <button
                onClick={() => setSelectedFormat('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedFormat === 'all' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tous formats
              </button>
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === 'pdf' ? 'bg-rose-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>PDF (.pdf)</span>
              </button>
              <button
                onClick={() => setSelectedFormat('docx')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === 'docx' ? 'bg-blue-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Word (.docx)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Aucun document trouvé</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aucune check-list ou document ne correspond à vos critères de recherche. Vous pouvez importer un nouveau fichier en cliquant sur le bouton ci-dessous.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Check-list (PDF / DOCX)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const isPdf = doc.fileFormat === 'pdf';
            const catConfig = CATEGORY_CONFIG[doc.category] || CATEGORY_CONFIG.general;

            return (
              <div
                key={doc.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 shadow-md flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Format Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-mono uppercase tracking-wider flex items-center gap-1 border ${
                          isPdf
                            ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                            : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                        }`}
                      >
                        <FileText className="w-3 h-3" />
                        <span>{doc.fileFormat.toUpperCase()}</span>
                      </span>

                      {/* Category Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${catConfig.color}`}
                      >
                        {doc.categoryLabel}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {doc.fileSizeFormatted}
                    </span>
                  </div>

                  {/* Document Title */}
                  <div>
                    <h4 className="text-sm font-bold text-white leading-snug group-hover:text-red-400 transition-colors">
                      {doc.title}
                    </h4>
                    {doc.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </div>

                  {/* Structured Checklist Count / Applicability */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                    {doc.checklistItems && doc.checklistItems.length > 0 && (
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Points de contrôle :</span>
                        </span>
                        <strong className="font-mono text-emerald-400">
                          {doc.checklistItems.length} étapes
                        </strong>
                      </div>
                    )}

                    {doc.applicableModels && (
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-red-400" />
                          <span>Modèles :</span>
                        </span>
                        <span className="text-[11px] font-medium text-slate-200 truncate max-w-[150px]">
                          {doc.applicableModels}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-500 font-medium">
                    <span>Ajouté le {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</span>
                    <span className="block text-slate-400 font-semibold">{doc.uploadedBy}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      title="Visualiser la check-list"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDownload(doc)}
                      title={`Télécharger le fichier ${doc.fileFormat.toUpperCase()}`}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow shadow-red-600/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{doc.fileFormat.toUpperCase()}</span>
                    </button>

                    {currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
                      <button
                        onClick={() => setDeleteConfirmId(doc.id)}
                        title="Supprimer ce document"
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD NEW DOCUMENT / CHECKLIST */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Ajouter une Check-list ou Document Administratif
                  </h3>
                  <p className="text-xs text-slate-400">Importez des fichiers au format PDF ou Word (DOCX)</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-4 sm:p-6 space-y-4 flex-1">
              {formError && (
                <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fichier Source (PDF ou DOCX / Word) <span className="text-red-400">*</span> :
                </label>
                <label className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-950 border-2 border-dashed border-slate-700 hover:border-red-500/60 rounded-2xl cursor-pointer transition-colors text-center">
                  <div className="p-2.5 bg-slate-900 rounded-xl text-red-400 border border-slate-800">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {uploadedFileName ? (
                        <span className="text-emerald-400">Fichier sélectionné : {uploadedFileName}</span>
                      ) : (
                        <span>Cliquez pour sélectionner un fichier ou glissez-le ici</span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Formats acceptés : <strong>.PDF</strong>, <strong>.DOCX</strong>, <strong>.DOC</strong> (Taille max 10 Mo)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Titre du Document / Check-list <span className="text-red-400">*</span> :
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Check-list Dossier Leasing Particulier STA"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie :</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AdminDocCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    <option value="leasing">💼 Dossiers Leasing</option>
                    <option value="particulier">👤 Dossiers Particuliers</option>
                    <option value="societe">🏢 Sociétés & Flottes</option>
                    <option value="immatriculation">🛡️ Immatriculation & Cartes Grises</option>
                    <option value="livraison">🚗 Livraison & Contrôle PDI</option>
                    <option value="credit">💳 Crédit Bancaire Direct</option>
                    <option value="general">📄 Procédures Générales</option>
                  </select>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Format :</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as 'pdf' | 'docx')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    <option value="pdf">Document PDF (.pdf)</option>
                    <option value="docx">Document Microsoft Word (.docx)</option>
                  </select>
                </div>

                {/* Applicable Models */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Modèles applicables :
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Tous modèles Chery ou Tiggo 8 Pro, Omoda 5..."
                    value={newApplicableModels}
                    onChange={(e) => setNewApplicableModels(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Objectif :</label>
                  <textarea
                    rows={2}
                    placeholder="Brève description de la check-list et de son utilité..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Checklist items textarea */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Points de contrôle de la check-list (une ligne par étape/pièce) :
                  </label>
                  <textarea
                    rows={4}
                    placeholder={`1. Facture Proforma officielle\n2. Accord de leasing signé\n3. Copie CIN recto/verso certifiée\n4. Relevés bancaires 6 mois`}
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ces points apparaîtront sous forme de cases à cocher interactives dans la visionneuse.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer la Check-list</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW DOCUMENT & INTERACTIVE CHECKLIST */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    previewDoc.fileFormat === 'pdf'
                      ? 'bg-rose-600/20 border border-rose-500/30 text-rose-400'
                      : 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{previewDoc.title}</h3>
                  <p className="text-xs text-slate-400">
                    {previewDoc.categoryLabel} • Format {previewDoc.fileFormat.toUpperCase()} ({previewDoc.fileSizeFormatted})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 flex-1">
              {previewDoc.description && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <p className="font-bold text-white mb-1">Description & Utilisation :</p>
                  {previewDoc.description}
                </div>
              )}

              {/* Interactive Checklist Items */}
              {previewDoc.checklistItems && previewDoc.checklistItems.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>Grille des Pièces & Étapes de Contrôle :</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {previewDoc.checklistItems.length} points
                    </span>
                  </div>

                  <div className="space-y-2">
                    {previewDoc.checklistItems.map((item, idx) => {
                      const isChecked = checkedItems[`${previewDoc.id}-${idx}`] || false;

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleCheckItem(idx)}
                          className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <div className="text-xs font-medium leading-tight">
                            <span className={isChecked ? 'line-through opacity-70' : ''}>{item}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Fichier complet prêt pour le téléchargement ({previewDoc.fileName}).
                  </p>
                </div>
              )}

              {/* Metadata Details */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Modèles Applicables :</span>
                  <strong className="text-slate-200">{previewDoc.applicableModels || 'Tous modèles'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Publié par :</span>
                  <strong className="text-slate-200">{previewDoc.uploadedBy}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>

              <button
                type="button"
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le Fichier ({previewDoc.fileFormat.toUpperCase()})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Supprimer ce document ?</h4>
                <p className="text-xs text-slate-400">Cette action retirera le document de la liste.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteDocument(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow shadow-red-600/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
