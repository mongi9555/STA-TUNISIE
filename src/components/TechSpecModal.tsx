import React, { useState, useEffect, useRef } from 'react';
import { CarModel, CarColor } from '../types';
import { getFixedDepositForCar, getFullCarPrice, getRegistrationFeeForCar, isPickupCar } from '../data/cheryData';
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
  Award,
  Maximize,
  Minimize,
  Eye,
  Sun,
  Moon,
  Grid,
  RotateCcw,
  Move
} from 'lucide-react';

interface TechSpecModalProps {
  car: CarModel | null;
  onClose: () => void;
  onOpenReservationModal?: (car: CarModel, selectedColor?: CarColor) => void;
}

// Convert base64 Data URL to a Blob URL
function dataUrlToBlobUrl(dataUrl: string): string | null {
  if (!dataUrl || !dataUrl.startsWith('data:')) return null;
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string>(car?.imageUrl || '');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Image Viewer state for PNG/JPG
  const [imageFitMode, setImageFitMode] = useState<'fit-width' | 'fit-window' | 'original' | 'custom'>('fit-width');
  const [imageZoom, setImageZoom] = useState<number>(100);
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [imageBgTheme, setImageBgTheme] = useState<'dark' | 'light' | 'grid'>('dark');

  // Manual document format selector: 'auto' | 'pdf' | 'image'
  const [docFormatOverride, setDocFormatOverride] = useState<'auto' | 'pdf' | 'image'>('auto');

  // Image pan/drag state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (car?.imageUrl) {
      setSelectedGalleryImage(car.imageUrl);
    }
  }, [car?.imageUrl]);

  const rawDocumentUrl = car?.ficheTechniqueUrl || car?.imageUrl || '';

  // Create Blob URL for base64 data URLs
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

  // Keyboard shortcut listener (Esc to close, F to fullscreen)
  React.useEffect(() => {
    if (!car) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      } else if ((e.key === 'f' || e.key === 'F') && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        setIsFullscreen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [car, onClose]);

  if (!car) return null;

  const activeDocumentUrl = blobUrl || rawDocumentUrl;

  // Accurate format detection
  const isExplicitImage =
    rawDocumentUrl.startsWith('data:image/') ||
    /\.(png|jpe?g|webp|gif|svg|avif|bmp)($|\?)/i.test(rawDocumentUrl);

  const isExplicitPdf =
    rawDocumentUrl.startsWith('data:application/pdf') ||
    /\.(pdf)($|\?)/i.test(rawDocumentUrl) ||
    rawDocumentUrl.includes('drive.google.com');

  const resolvedIsPdf =
    docFormatOverride === 'pdf'
      ? true
      : docFormatOverride === 'image'
      ? false
      : isExplicitPdf && !isExplicitImage;

  const handleZoomIn = () => {
    setImageFitMode('custom');
    setImageZoom((prev) => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setImageFitMode('custom');
    setImageZoom((prev) => Math.max(prev - 25, 25));
  };

  const handleResetZoom = () => {
    setImageFitMode('fit-width');
    setImageZoom(100);
    setImageRotation(0);
  };

  const handleRotateImage = () => {
    setImageRotation((prev) => (prev + 90) % 360);
  };

  const handlePrint = () => {
    window.print();
  };

  // Drag to pan image when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageContainerRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX + imageContainerRef.current.scrollLeft,
      y: e.clientY + imageContainerRef.current.scrollTop
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageContainerRef.current) return;
    imageContainerRef.current.scrollLeft = dragStart.x - e.clientX;
    imageContainerRef.current.scrollTop = dragStart.y - e.clientY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getDownloadExt = () => {
    if (resolvedIsPdf) return 'pdf';
    if (rawDocumentUrl.includes('.png') || rawDocumentUrl.startsWith('data:image/png')) return 'png';
    return 'jpg';
  };

  const downloadFileName = `Fiche_Technique_${car.name.replace(/\s+/g, '_')}.${getDownloadExt()}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className={`bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-2 sm:inset-3 w-auto h-auto max-w-none rounded-2xl z-50'
            : 'max-w-6xl w-full h-[92vh] rounded-2xl'
        }`}
      >
        {/* Header Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-red-600/30 text-red-300 font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-red-500/30">
                  Fiche Technique Officielle
                </span>
                <span className="text-xs text-slate-400 font-mono font-semibold">{car.category}</span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-emerald-400 font-medium hidden sm:inline">{car.energy}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white truncate">{car.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tab Navigation */}
            <div className="hidden sm:flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
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
                type="button"
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
                  type="button"
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

            {/* Window Controls: Fullscreen Toggle & Close */}
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? 'Réduire la fenêtre' : 'Agrandir la fenêtre (Plein écran)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Fermer la fiche technique"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex sm:hidden bg-slate-950 p-2 border-b border-slate-800 text-xs font-bold justify-around shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
              activeTab === 'document' ? 'bg-red-600 text-white' : 'text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document</span>
          </button>
          <button
            type="button"
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
              type="button"
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
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900/60 overflow-hidden">
          {activeTab === 'document' && (
            <div className="h-full flex flex-col min-h-0 p-2 sm:p-4">
              {resolvedIsPdf ? (
                /* PDF RENDERER */
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Format Selector Bar for PDF */}
                  <div className="mb-2 flex items-center justify-between gap-2 px-1 text-xs shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-[11px] font-semibold">Format détecté :</span>
                      <span className="px-2 py-0.5 bg-red-600/20 text-red-400 rounded-md font-mono text-[10px] font-bold border border-red-500/30">
                        Document PDF
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDocFormatOverride('image')}
                        className="text-[10px] text-slate-400 hover:text-amber-300 underline cursor-pointer"
                        title="Forcer l'affichage sous forme d'image si ce n'est pas un PDF"
                      >
                        Afficher comme Image
                      </button>
                    </div>
                  </div>

                  <PdfViewer
                    url={activeDocumentUrl}
                    title={`Fiche Technique ${car.name}`}
                    downloadFileName={downloadFileName}
                    className="flex-1 min-h-0"
                    onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
                    isFullscreen={isFullscreen}
                  />
                </div>
              ) : (
                /* PNG / JPG / IMAGE RENDERER */
                <div className="flex-1 flex flex-col min-h-0 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Image Toolbar */}
                  <div className="bg-slate-900 border-b border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 select-none">
                    {/* Left: Fit Modes */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setImageFitMode('fit-width');
                            setImageZoom(100);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            imageFitMode === 'fit-width'
                              ? 'bg-red-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Ajuster à la largeur de la fenêtre (Recommandé pour lire la fiche de haut en bas)"
                        >
                          Ajuster Largeur
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFitMode('fit-window');
                            setImageZoom(100);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            imageFitMode === 'fit-window'
                              ? 'bg-red-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Ajuster l'image entière dans la fenêtre"
                        >
                          Page Entière
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFitMode('original');
                            setImageZoom(100);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            imageFitMode === 'original'
                              ? 'bg-red-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Taille réelle (100% natif)"
                        >
                          100% Natif
                        </button>
                      </div>

                      {/* Background Style Switcher (for transparent PNGs) */}
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setImageBgTheme('dark')}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            imageBgTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Fond Sombre"
                        >
                          <Moon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageBgTheme('light')}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            imageBgTheme === 'light' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Fond Blanc Net"
                        >
                          <Sun className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageBgTheme('grid')}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            imageBgTheme === 'grid' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Grille Transparente (PNG)"
                        >
                          <Grid className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Center: Zoom and Rotation */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={handleZoomOut}
                          className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                          title="Zoom arrière (-)"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="px-1.5 text-amber-400 font-mono font-bold text-[11px] min-w-[42px] text-center">
                          {imageZoom}%
                        </span>
                        <button
                          type="button"
                          onClick={handleZoomIn}
                          className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                          title="Zoom avant (+)"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleResetZoom}
                          className="text-[10px] font-bold px-1.5 py-0.5 text-slate-400 hover:text-white rounded"
                          title="Réinitialiser le zoom"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Rotation */}
                      <button
                        type="button"
                        onClick={handleRotateImage}
                        className="p-1.5 bg-slate-950 text-slate-300 hover:text-white border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer"
                        title="Pivoter de 90°"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setDocFormatOverride('pdf')}
                        className="text-[10px] text-slate-400 hover:text-amber-300 underline cursor-pointer mr-1 hidden md:inline"
                        title="Afficher avec le lecteur PDF"
                      >
                        Mode PDF
                      </button>

                      <a
                        href={activeDocumentUrl}
                        download={downloadFileName}
                        className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer shadow text-[11px]"
                        title="Télécharger l'image"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Télécharger</span>
                      </a>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                        title="Imprimer"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Imprimer</span>
                      </button>

                      <a
                        href={activeDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer shadow text-[11px] px-2.5"
                        title="Ouvrir dans un nouvel onglet"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Onglet</span>
                      </a>
                    </div>
                  </div>

                  {/* Image Scrollable Viewport */}
                  <div
                    ref={imageContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`flex-1 min-h-0 w-full overflow-auto p-4 flex items-start justify-center select-none relative ${
                      isDragging ? 'cursor-grabbing' : imageFitMode === 'fit-width' ? 'cursor-default' : 'cursor-grab'
                    } ${
                      imageBgTheme === 'light'
                        ? 'bg-white'
                        : imageBgTheme === 'grid'
                        ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:16px_16px] bg-slate-200'
                        : 'bg-slate-950'
                    }`}
                  >
                    <div
                      className="transition-all duration-150 inline-block my-auto"
                      style={{
                        transform: `rotate(${imageRotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                    >
                      <img
                        src={activeDocumentUrl}
                        alt={`Fiche technique ${car.name}`}
                        style={{
                          width:
                            imageFitMode === 'fit-width'
                              ? `${imageZoom}%`
                              : imageFitMode === 'fit-window'
                              ? 'auto'
                              : imageFitMode === 'original'
                              ? 'auto'
                              : `${imageZoom}%`,
                          maxWidth: imageFitMode === 'fit-window' ? '100%' : 'none',
                          maxHeight: imageFitMode === 'fit-window' ? 'calc(100vh - 260px)' : 'none',
                          height: 'auto',
                        }}
                        className={`rounded-xl shadow-2xl transition-all mx-auto block ${
                          imageFitMode === 'fit-width'
                            ? 'w-full'
                            : imageFitMode === 'fit-window'
                            ? 'object-contain'
                            : ''
                        }`}
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
                    type="button"
                    onClick={() => setSelectedGalleryImage(car.imageUrl)}
                    className={`h-16 w-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedGalleryImage === car.imageUrl ? 'border-red-500 ring-2 ring-red-500/40' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
                  </button>

                  {car.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedGalleryImage(img)}
                      className={`h-16 w-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
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
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                Prix Complet Clé en Main TTC
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                {getFullCarPrice(car).toLocaleString()} TND
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                {getRegistrationFeeForCar(car) > 0
                  ? `(Véhicule: ${car.priceTND.toLocaleString()} DT + Frais: ${getRegistrationFeeForCar(car).toLocaleString()} DT)`
                  : `(Prix Public TTC Clé en Main)`}
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
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Fermer
            </button>

            {onOpenReservationModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReservationModal(car);
                }}
                className="px-4 sm:px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-colors cursor-pointer"
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
