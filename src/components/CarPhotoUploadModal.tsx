import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CarModel } from '../types';
import { uploadCarImageFile, uploadMultipleCarImages } from '../utils/imageCompressor';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Trash2,
  Star,
  Plus,
  Link as LinkIcon,
  Eye,
  Sparkles,
  AlertCircle,
  Loader2,
  ZoomIn,
  Save,
  Database,
  RefreshCw,
} from 'lucide-react';

interface CarPhotoUploadModalProps {
  car: CarModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCar: (updatedCar: CarModel) => void;
}

export const CarPhotoUploadModal: React.FC<CarPhotoUploadModalProps> = ({
  car,
  isOpen,
  onClose,
  onSaveCar,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewZoomImage, setPreviewZoomImage] = useState<string | null>(null);
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !car) return null;

  const currentGallery = car.galleryImages || [];
  const allImages = [
    { url: car.imageUrl, isMain: true, index: -1 },
    ...currentGallery.map((url, idx) => ({ url, isMain: false, index: idx })),
  ].filter((img) => Boolean(img.url));

  const handleManualSaveToDatabase = async () => {
    setIsSavingDb(true);
    setErrorMessage(null);
    try {
      onSaveCar(car);
      const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(timeStr);
      setSuccessMessage(`✅ Photos enregistrées définitivement dans la base de données (${timeStr}) ! Les photos resteront lors de l'actualisation.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage("Erreur lors de l'enregistrement dans la base de données.");
    } finally {
      setIsSavingDb(false);
    }
  };

  const handleFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgressText(`Traitement et optimisation de ${files.length} photo(s)...`);

    try {
      const uploadedUrls = await uploadMultipleCarImages(files);

      if (uploadedUrls.length === 0) {
        setErrorMessage('Aucune image valide n\'a pu être traitée.');
        setIsUploading(false);
        return;
      }

      // If car currently has no main imageUrl, use first uploaded as main
      let newImageUrl = car.imageUrl;
      let newGallery = [...(car.galleryImages || [])];

      if (!newImageUrl) {
        newImageUrl = uploadedUrls[0];
        newGallery = [...newGallery, ...uploadedUrls.slice(1)];
      } else {
        newGallery = [...newGallery, ...uploadedUrls];
      }

      const updatedCar: CarModel = {
        ...car,
        imageUrl: newImageUrl,
        galleryImages: newGallery,
      };

      // Automatic persistence into Firebase, local storage and file DB
      onSaveCar(updatedCar);
      const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(timeStr);
      setSuccessMessage(
        uploadedUrls.length === 1
          ? `La photo a été téléversée sur le site avec succès et enregistrée dans la base de données avec succès (${timeStr}) !`
          : `${uploadedUrls.length} photos ont été téléversées sur le site avec succès et enregistrées dans la base de données avec succès (${timeStr}) !`
      );
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      console.error('Error uploading car photos:', err);
      setErrorMessage(err.message || 'Erreur lors du téléversement des photos.');
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    const url = customUrlInput.trim();
    if (!url) return;

    let newImageUrl = car.imageUrl;
    let newGallery = [...(car.galleryImages || [])];

    if (!newImageUrl) {
      newImageUrl = url;
    } else {
      newGallery.push(url);
    }

    const updatedCar: CarModel = {
      ...car,
      imageUrl: newImageUrl,
      galleryImages: newGallery,
    };

    // Automatic persistence into Firebase, local storage and file DB
    onSaveCar(updatedCar);
    const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(timeStr);
    setCustomUrlInput('');
    setSuccessMessage('✅ Photo ajoutée par URL et sauvegardée dans la base de données !');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSetAsMainImage = (url: string, galleryIndex: number) => {
    if (url === car.imageUrl) return;

    const oldMain = car.imageUrl;
    const newGallery = currentGallery.filter((_, idx) => idx !== galleryIndex);
    if (oldMain && !newGallery.includes(oldMain)) {
      newGallery.unshift(oldMain);
    }

    const updatedCar: CarModel = {
      ...car,
      imageUrl: url,
      galleryImages: newGallery,
    };

    // Automatic persistence into Firebase, local storage and file DB
    onSaveCar(updatedCar);
    const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(timeStr);
    setSuccessMessage('✅ Photo principale modifiée et enregistrée dans la base de données !');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDeleteImage = (item: { url: string; isMain: boolean; index: number }) => {
    let updatedCar: CarModel;
    if (item.isMain) {
      if (currentGallery.length > 0) {
        const nextMain = currentGallery[0];
        const nextGallery = currentGallery.slice(1);
        updatedCar = {
          ...car,
          imageUrl: nextMain,
          galleryImages: nextGallery,
        };
      } else {
        updatedCar = {
          ...car,
          imageUrl: '',
        };
      }
    } else {
      const nextGallery = currentGallery.filter((_, idx) => idx !== item.index);
      updatedCar = {
        ...car,
        galleryImages: nextGallery,
      };
    }

    // Automatic persistence into Firebase, local storage and file DB
    onSaveCar(updatedCar);
    const timeStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(timeStr);
    setSuccessMessage('✅ Photo supprimée et base de données mise à jour.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/20 border border-red-500/30 rounded-2xl text-red-400">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-950/60 text-red-400 border border-red-500/30 rounded-full">
                  Gestionnaire Photos
                </span>
                <span className="text-xs text-slate-400 font-mono font-medium">{car.category}</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1 font-semibold">
                  <Database className="w-3 h-3" /> Auto-Sauvegarde Active
                </span>
              </div>
              <h3 className="text-lg font-black text-white">{car.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleManualSaveToDatabase}
              disabled={isSavingDb}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sauvegarder immédiatement toutes les modifications dans la base de données"
            >
              {isSavingDb ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer en Base</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 bg-red-950/50 border border-red-500/40 rounded-2xl text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-4 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl text-emerald-100 shadow-xl shadow-emerald-950/50 flex items-start justify-between gap-3 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500" />
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 bg-emerald-900/60 border border-emerald-400/40 rounded-xl text-emerald-300 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-extrabold text-white text-xs sm:text-sm">
                      Photo(s) téléversée(s) et sauvegardée(s) avec succès !
                    </h5>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full font-bold flex items-center gap-1">
                      <Database className="w-3 h-3" /> Base de données synchronisée
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {successMessage}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-400 hover:text-white p-1 hover:bg-emerald-900/40 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Fermer la notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Upload Drop Zone & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Drag & Drop Upload Zone (2 cols on md) */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFilesUpload(e.dataTransfer.files);
                }
              }}
              className={`md:col-span-2 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-red-500 bg-red-950/20 scale-[0.99]'
                  : 'border-slate-700 hover:border-red-500/60 bg-slate-950/50 hover:bg-slate-950'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFilesUpload(e.target.files);
                  }
                }}
                className="hidden"
              />

              {isUploading ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  <p className="text-sm font-bold text-white">{uploadProgressText}</p>
                  <p className="text-xs text-slate-400">Veuillez patienter pendant l'optimisation...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <div className="p-3 bg-red-600/20 text-red-400 rounded-2xl border border-red-500/30 mb-1">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-white text-sm sm:text-base">
                    Glissez-déposez vos photos ou <span className="text-red-400 underline">parcourez</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Sélectionnez une ou plusieurs photos simultanément (JPG, PNG, WEBP). Optimisation automatique haute qualité.
                  </p>
                  <span className="mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-colors">
                    <Plus className="w-4 h-4" /> Sélectionner des Photos
                  </span>
                </div>
              )}
            </div>

            {/* URL Input Box (1 col on md) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                  <span>Ajouter par Lien Web (URL)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Collez l'URL d'une image hébergée en ligne pour l'ajouter directement à la galerie.
                </p>
                <input
                  type="url"
                  placeholder="https://images.chery.tn/modele.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:ring-1 focus:ring-red-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!customUrlInput.trim()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Ajouter cette URL
              </button>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Photos Actuelles du Véhicule</span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded-full">
                  {allImages.length} photo(s)
                </span>
              </h4>
              <span className="text-[11px] text-slate-400">
                La photo avec l'étoile dorée ⭐ est la photo de couverture principale.
              </span>
            </div>

            {allImages.length === 0 ? (
              <div className="p-8 bg-slate-950/60 border border-slate-800 rounded-2xl text-center space-y-2">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Aucune photo enregistrée pour ce véhicule.</p>
                <p className="text-[11px] text-slate-500">
                  Téléversez une photo ci-dessus pour donner un aperçu visuel aux clients et commerciaux.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allImages.map((imgItem, idx) => (
                  <div
                    key={idx}
                    className={`group relative rounded-2xl overflow-hidden border-2 transition-all bg-black aspect-video flex items-center justify-center ${
                      imgItem.isMain
                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={imgItem.url}
                      alt={`${car.name} ${idx + 1}`}
                      onError={(e) => {
                        if (car.imageUrl && e.currentTarget.src !== car.imageUrl) {
                          e.currentTarget.src = car.imageUrl;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Main Photo Badge */}
                    {imgItem.isMain && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-lg shadow flex items-center gap-1">
                        <Star className="w-3 h-3 fill-slate-950" /> Photo Principale
                      </div>
                    )}

                    {/* Hover Controls Overlay */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewZoomImage(imgItem.url)}
                          className="p-1.5 bg-slate-900/90 text-slate-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Agrandir la photo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(imgItem)}
                          className="p-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg transition-colors cursor-pointer"
                          title="Supprimer cette photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {!imgItem.isMain && (
                        <button
                          type="button"
                          onClick={() => handleSetAsMainImage(imgItem.url, imgItem.index)}
                          className="w-full py-1.5 bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold rounded-lg shadow flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5" /> Définir Principale
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {lastSavedTime
                ? `Dernier enregistrement à ${lastSavedTime} (Persistance base de données assurée)`
                : 'Les photos sont automatiquement sauvegardées dans la base de données.'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleManualSaveToDatabase}
              disabled={isSavingDb}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isSavingDb ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement en cours...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer & Sauvegarder</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Lightbox / Fullscreen Zoom Modal */}
      <AnimatePresence>
        {previewZoomImage && (
          <div
            onClick={() => setPreviewZoomImage(null)}
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 backdrop-blur cursor-zoom-out"
          >
            <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
              <img
                src={previewZoomImage}
                alt="Agrandissement"
                className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
              <button
                type="button"
                onClick={() => setPreviewZoomImage(null)}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
