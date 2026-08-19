import React, { useState, useEffect } from 'react';
import { CarModel, CarColor } from '../types';
import { getFixedDepositForCar, getFullCarPrice, getRegistrationFeeForCar, isPickupCar, getCarCapacityLabel } from '../data/cheryData';
import { PdfViewer } from './PdfViewer';
import {
  X,
  FileText,
  Download,
  Printer,
  ExternalLink,
  Zap,
  Gauge,
  Settings2,
  Fuel,
  Maximize2,
  Shield,
  Sparkles,
  Check,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Image as ImageIcon,
  Car,
  Award,
  AlertTriangle,
  Globe
} from 'lucide-react';

interface TechSpecModalProps {
  car: CarModel | null;
  onClose: () => void;
  onOpenReservationModal?: (car: CarModel, selectedColor?: CarColor) => void;
}

// Convert base64 Data URL to a Blob URL to avoid Chrome blocking base64 URLs in iframe src
function dataUrlToBlobUrl(dataUrl: string): string | null {
  if (!dataUrl || !dataUrl.startsWith('data:')) return null;
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to convert dataUrl to Blob:', err);
    return null;
  }
}

export const TechSpecModal: React.FC<TechSpecModalProps> = ({
  car,
  onClose,
  onOpenReservationModal,
}) => {
  const [activeTab, setActiveTab] = useState<'document' | 'details' | 'gallery'>('document');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string>(car?.imageUrl || '');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [pdfEngine, setPdfEngine] = useState<'direct' | 'google'>('direct');

  React.useEffect(() => {
    if (car?.imageUrl) {
      setSelectedGalleryImage(car.imageUrl);
    }
  }, [car?.imageUrl]);

  const rawDocumentUrl = car?.ficheTechniqueUrl || car?.imageUrl || '';

  // Create Blob URL for base64 data URLs to fix Chrome iframe blocking
  useEffect(() => {
    if (rawDocumentUrl && rawDocumentUrl.startsWith('data:')) {
      const bUrl = dataUrlToBlobUrl(rawDocumentUrl);
      setBlobUrl(bUrl);
      return () => {
        if (bUrl) URL.revokeObjectURL(bUrl);
      };
    } else {
      setBlobUrl(null);
    }
  }, [rawDocumentUrl]);

  React.useEffect(() => {
    if (!car) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [car, onClose]);

  if (!car) return null;

  const isPdf =
    car.ficheTechniqueUrl?.toLowerCase().includes('.pdf') ||
    car.ficheTechniqueUrl?.toLowerCase().includes('pdf') ||
    car.ficheTechniqueUrl?.startsWith('data:application/pdf') ||
    car.ficheTechniqueUrl?.startsWith('data:application/octet-stream') ||
    car.ficheTechniqueUrl?.includes('drive.google.com');

  const documentUrl = car.ficheTechniqueUrl || car.imageUrl;
  const activePdfSource = blobUrl || documentUrl;

  // Compute final iframe / object src
  let finalPdfUrl = activePdfSource;
  if (finalPdfUrl && finalPdfUrl.includes('drive.google.com') && finalPdfUrl.includes('/file/d/')) {
    const match = finalPdfUrl.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      finalPdfUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  if (pdfEngine === 'google' && (finalPdfUrl.startsWith('http://') || finalPdfUrl.startsWith('https://'))) {
    finalPdfUrl = `https://docs.google.com/gview?url=${encodeURIComponent(finalPdfUrl)}&embedded=true`;
  }

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-red-600/30 text-red-300 font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-red-500/30">
                  Fiche Technique Flottante
                </span>
                <span className="text-xs text-slate-400 font-mono font-semibold">{car.category}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-emerald-400 font-medium">{car.energy}</span>
              </div>
              <h3 className="text-lg font-black text-white truncate">{car.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tab Navigation */}
            <div className="hidden sm:flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('document')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'document'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document (PDF / Image)</span>
              </button>

              <button
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Specs Détaillées</span>
              </button>

              {car.galleryImages && car.galleryImages.length > 0 && (
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'gallery'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Galerie ({car.galleryImages.length})</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Fermer la fiche technique"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex sm:hidden bg-slate-950 p-2 border-b border-slate-800 text-xs font-bold justify-around">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
              activeTab === 'document' ? 'bg-red-600 text-white' : 'text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document</span>
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
              activeTab === 'details' ? 'bg-red-600 text-white' : 'text-slate-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Specs</span>
          </button>
          {car.galleryImages && car.galleryImages.length > 0 && (
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                activeTab === 'gallery' ? 'bg-red-600 text-white' : 'text-slate-400'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Galerie</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-900/60">
          {activeTab === 'document' && (
            <div className="space-y-4 h-full flex flex-col justify-between">
              {isPdf ? (
                <PdfViewer
                  url={activePdfSource}
                  title={`Fiche Technique ${car.name}`}
                  downloadFileName={`Fiche_Technique_${car.name.replace(/\s+/g, '_')}.pdf`}
                  className="min-h-[520px]"
                />
              ) : (
                <div className="space-y-4">
                  {/* Toolbar Controls for Image */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-semibold">Mode d'affichage :</span>
                      <span className="px-2.5 py-1 bg-slate-900 text-amber-400 rounded-lg border border-slate-800 font-mono font-bold flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        Visuel Technique / Image HT
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                          onClick={handleZoomOut}
                          className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Zoom arrière"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-[11px] font-mono px-1 font-bold text-slate-300">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                          onClick={handleZoomIn}
                          className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Zoom avant"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleResetZoom}
                          className="text-[10px] font-bold px-1.5 py-0.5 text-slate-400 hover:text-white"
                        >
                          Reset
                        </button>
                      </div>

                      <a
                        href={documentUrl}
                        download={`Fiche_Technique_${car.name.replace(/\s+/g, '_')}`}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </a>

                      <button
                        onClick={handlePrint}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Imprimer</span>
                      </button>
                    </div>
                  </div>

                  {/* Image Viewer Container */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[480px] flex items-center justify-center overflow-auto relative shadow-inner">
                    <img
                      src={documentUrl}
                      alt={`Fiche technique ${car.name}`}
                      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                      className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-200"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Key Highlights Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-slate-400 text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Motorisation
                  </p>
                  <p className="font-extrabold text-white text-sm">{car.engine}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-slate-400 text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Gauge className="w-3.5 h-3.5 text-blue-400" /> Puissance
                  </p>
                  <p className="font-extrabold text-white text-sm">{car.powerHP || '147 ch (8 CV)'}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-slate-400 text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Settings2 className="w-3.5 h-3.5 text-purple-400" /> Transmission
                  </p>
                  <p className="font-extrabold text-white text-sm">{car.transmission}</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-slate-400 text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider">
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" /> Consommation
                  </p>
                  <p className="font-extrabold text-white text-sm">{car.consumption || '6.8 L/100km'}</p>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Performance & Dimensions */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-black text-white flex items-center gap-2 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
                    <Maximize2 className="w-4 h-4 text-red-500" /> Performances & Dimensions
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-slate-900 text-slate-300">
                      <span className="text-slate-400">Couple Moteur :</span>
                      <span className="font-mono font-bold text-white">{car.torque || '210 Nm @ 1750 tr/min'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-900 text-slate-300">
                      <span className="text-slate-400">Vitesse Maximale :</span>
                      <span className="font-mono font-bold text-white">{car.maxSpeed || '190 km/h'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-900 text-slate-300">
                      <span className="text-slate-400">Accélération (0-100 km/h) :</span>
                      <span className="font-mono font-bold text-white">{car.acceleration || '8.9 secondes'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-900 text-slate-300">
                      <span className="text-slate-400">Dimensions (L x l x h) :</span>
                      <span className="font-mono font-bold text-white">{car.dimensions || '4400 x 1830 x 1670 mm'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-900 text-slate-300">
                      <span className="text-slate-400">{isPickupCar(car) ? 'Charge Utile :' : 'Volume du Coffre :'}</span>
                      <span className="font-mono font-bold text-white">
                        {car.payload || car.bootCapacity || (isPickupCar(car) ? '1050 Kg (Charge Utile)' : '475 Litres')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 text-slate-300">
                      <span className="text-slate-400">Garantie Constructeur :</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" /> {car.guarantee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Safety & Assist Features */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-black text-white flex items-center gap-2 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
                    <Shield className="w-4 h-4 text-emerald-400" /> Sécurité & Équipements de Série
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    {(car.safetyFeatures || [
                      '6 Airbags (Frontaux, Latéraux & Rideaux)',
                      'Système Antiblocage ABS + Répartiteur EBD',
                      'Contrôle Électronique de Trajectoire ESP Bosch 9.3',
                      'Fixations pour sièges enfants ISOFIX',
                      'Aide au démarrage en côte (HHC)',
                      'Système de contrôle de vitesse en descente (HDC)',
                      'Radars de recul avec Caméra 360° HD',
                    ]).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Comfort Features */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-black text-white flex items-center gap-2 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Équipements de Confort & Multimédia
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  {car.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-medium text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && car.galleryImages && car.galleryImages.length > 0 && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="h-80 w-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedGalleryImage}
                    alt={car.name}
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
                  <button
                    onClick={() => setSelectedGalleryImage(car.imageUrl)}
                    className={`h-16 w-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedGalleryImage === car.imageUrl ? 'border-red-500 ring-2 ring-red-500/40' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
                  </button>

                  {car.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGalleryImage(img)}
                      className={`h-16 w-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedGalleryImage === img ? 'border-red-500 ring-2 ring-red-500/40' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={img} alt={`${car.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                Prix Complet Clé en Main TTC
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {getFullCarPrice(car).toLocaleString()} TND
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                (Véhicule: {car.priceTND.toLocaleString()} DT + Frais immat/carte grise/timbre: {getRegistrationFeeForCar(car).toLocaleString()} DT)
              </span>
            </div>
            <div className="hidden sm:block border-l border-slate-800 pl-4">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Acompte Fixe</span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                {getFixedDepositForCar(car).toLocaleString()} TND
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Fermer
            </button>

            {onOpenReservationModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReservationModal(car);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Créer Réservation Client</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
