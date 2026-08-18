import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CommercialUser } from '../types';
import { fileToCompressedAvatarDataUrl } from '../utils/imageCompressor';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  RefreshCw,
  Sparkles,
  User,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';

interface UserPhotoUploadModalProps {
  user: CommercialUser;
  isOpen: boolean;
  onClose: () => void;
  onSaveAvatar: (newAvatarUrl: string) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=320&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=320&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=320&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=320&auto=format&fit=crop&q=80',
];

export const UserPhotoUploadModal: React.FC<UserPhotoUploadModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveAvatar,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(user.avatar || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, etc.)');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Compress and center-crop to a 320x320 optimized avatar JPEG Data URL
      const compressed = await fileToCompressedAvatarDataUrl(file, 320, 0.88);
      setPreviewUrl(compressed);
    } catch (err: any) {
      console.error('Error processing avatar:', err);
      setErrorMessage(err?.message || 'Erreur lors du traitement de la photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    setPreviewUrl(customUrlInput.trim());
    setErrorMessage(null);
  };

  const handleConfirmSave = () => {
    if (!previewUrl) {
      setErrorMessage('Veuillez choisir ou uploader une photo.');
      return;
    }
    onSaveAvatar(previewUrl);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-600/20 border border-red-500/40 text-red-400 rounded-2xl">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Photo de Connexion / Profil</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 uppercase">
                    {user.role}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {user.name} — <span className="text-slate-300 font-semibold">{user.agency}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* Live Preview Section */}
            <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group">
                <img
                  src={previewUrl || user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-red-500 shadow-xl shadow-red-950/60 transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[11px] font-bold gap-1"
                >
                  <Camera className="w-5 h-5 text-red-400" />
                  <span>Changer</span>
                </button>
              </div>

              <div className="text-center sm:text-left space-y-1.5 flex-1">
                <p className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Aperçu en direct sur votre session</span>
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cette photo apparaîtra sur l'écran de sélection de session, vos fiches commerciales et votre en-tête.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
                    Format carré optimisé
                  </span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Method Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Téléverser un Fichier</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Galerie Modèles</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Lien Web URL</span>
              </button>
            </div>

            {/* Tab 1: File Upload / Drag & Drop */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
                    isDragging
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-700 hover:border-red-500/60 bg-slate-950/60 hover:bg-slate-950'
                  }`}
                >
                  <div className="p-3 bg-red-600/15 text-red-400 rounded-full border border-red-500/30">
                    {isProcessing ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {isProcessing
                        ? 'Optimisation et recadrage de l\'image...'
                        : 'Glissez-déposez votre photo ici ou cliquez pour parcourir'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Prend en charge JPG, PNG, WEBP, appareil photo mobile (max 10 Mo)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-1 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                  >
                    Sélectionner depuis l'appareil
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Presets Grid */}
            {activeTab === 'presets' && (
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-slate-400">
                  Cliquez sur un avatar type pour l'appliquer à votre profil :
                </p>
                <div className="grid grid-cols-4 gap-2.5">
                  {AVATAR_PRESETS.map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPreviewUrl(presetUrl);
                        setErrorMessage(null);
                      }}
                      className={`relative p-1 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                        previewUrl === presetUrl
                          ? 'border-red-500 ring-2 ring-red-500 bg-red-950/40'
                          : 'border-slate-800 hover:border-slate-600 bg-slate-950'
                      }`}
                    >
                      <img
                        src={presetUrl}
                        alt={`Preset ${idx + 1}`}
                        className="w-full h-16 rounded-xl object-cover"
                      />
                      {previewUrl === presetUrl && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: URL */}
            {activeTab === 'url' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  Lien direct de l'image (URL) :
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              disabled={isProcessing}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer la Photo de Login</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
