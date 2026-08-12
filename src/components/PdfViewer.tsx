import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  Monitor,
  RefreshCw,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

// Configure pdfjs worker with CDN fallback (jsDelivr / unpkg)
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  try {
    const version = pdfjsLib.version || '4.0.379';
    // Use jsdelivr as primary CDN for pdfjs-dist workers (supports all package versions)
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('Failed to configure pdf.js workerSrc:', err);
  }
}

interface PdfViewerProps {
  url: string;
  title?: string;
  downloadFileName?: string;
  className?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  url,
  title,
  downloadFileName = 'document.pdf',
  className = ''
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  
  // Rendering engine mode: 'canvas' (PDF.js) | 'native' (Object/Iframe) | 'google' (Google Docs Viewer)
  const [viewEngine, setViewEngine] = useState<'canvas' | 'native' | 'google'>('canvas');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Helper: Convert Data URL base64 string to Uint8Array for pdf.js
  const dataUrlToUint8Array = (dataUrl: string): Uint8Array | null => {
    try {
      const parts = dataUrl.split(',');
      if (parts.length < 2) return null;
      const base64Data = parts[1];
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (e) {
      console.error('Base64 to Uint8Array conversion error:', e);
      return null;
    }
  };

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setPdfDoc(null);
    setPageNumber(1);

    if (!url) {
      setError("Aucune URL de fichier PDF fournie.");
      setLoading(false);
      return;
    }

    if (viewEngine !== 'canvas') {
      setLoading(false);
      return;
    }

    const loadDoc = async () => {
      try {
        let loadingTask: pdfjsLib.PDFDocumentLoadingTask;

        // 1. If base64 Data URL
        if (url.startsWith('data:')) {
          const bytes = dataUrlToUint8Array(url);
          if (bytes) {
            loadingTask = pdfjsLib.getDocument({ data: bytes });
          } else {
            loadingTask = pdfjsLib.getDocument({ url });
          }
        } 
        // 2. Standard URL or Blob URL
        else {
          loadingTask = pdfjsLib.getDocument({ url });
        }

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.warn('Primary pdf.js loading failed, attempting ArrayBuffer fetch fallback...', err);

        // Fallback: Fetch as ArrayBuffer to bypass worker/CORS issues
        if (url.startsWith('http://') || url.startsWith('https://')) {
          try {
            const res = await fetch(url);
            const arrayBuffer = await res.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            const fallbackTask = pdfjsLib.getDocument({ data: bytes });
            const doc = await fallbackTask.promise;

            if (!isMounted) return;
            setPdfDoc(doc);
            setNumPages(doc.numPages);
            setLoading(false);
            return;
          } catch (fetchErr) {
            console.error('ArrayBuffer fetch fallback also failed:', fetchErr);
          }
        }

        console.error('Final PDF load error:', err);
        setError("Impossible de charger le document PDF via le rendu dynamique. Vous pouvez utiliser le mode d'affichage navigateur direct ou télécharger le fichier.");
        setLoading(false);
      }
    };

    loadDoc();

    return () => {
      isMounted = false;
    };
  }, [url, viewEngine]);

  // Render Page to Canvas
  useEffect(() => {
    if (viewEngine !== 'canvas' || !pdfDoc || pageNumber < 1 || pageNumber > numPages || !canvasRef.current) return;

    let isCancelled = false;

    pdfDoc.getPage(pageNumber).then((page) => {
      if (isCancelled) return;

      const viewport = page.getViewport({ scale, rotation });
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      canvas.style.width = Math.floor(viewport.width) + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const renderContext = {
        canvasContext: context,
        viewport,
        transform
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;

      renderTask.promise
        .then(() => {
          renderTaskRef.current = null;
        })
        .catch((err) => {
          if (err?.name !== 'RenderingCancelledException') {
            console.error('Render error:', err);
          }
        });
    }).catch((pageErr) => {
      console.error('Error getting page:', pageErr);
    });

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNumber, scale, rotation, numPages, viewEngine]);

  const handlePrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Compute Google Docs Viewer URL if requested
  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className={`flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden ${className}`}>
      {/* Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Engine Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewEngine('canvas')}
            className={`px-2.5 py-1 rounded-lg font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
              viewEngine === 'canvas'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Lecteur Canvas Dynamique (page par page, zoom, rotation)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setViewEngine('native')}
            className={`px-2.5 py-1 rounded-lg font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
              viewEngine === 'native'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Lecteur Navigateur Direct (Object / Iframe)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Navigateur</span>
          </button>
          {url.startsWith('http') && (
            <button
              type="button"
              onClick={() => setViewEngine('google')}
              className={`px-2.5 py-1 rounded-lg font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                viewEngine === 'google'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Lecteur Google Docs Viewer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Google</span>
            </button>
          )}
        </div>

        {/* Canvas Specific Controls */}
        {viewEngine === 'canvas' && !error && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Pagination */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={pageNumber <= 1 || loading}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-lg hover:bg-slate-800 cursor-pointer"
                title="Page précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-slate-300 font-mono font-bold text-[11px]">
                {loading ? '...' : `${pageNumber} / ${numPages || 1}`}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={pageNumber >= numPages || loading}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded-lg hover:bg-slate-800 cursor-pointer"
                title="Page suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={loading}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                title="Zoom arrière"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-1.5 text-slate-400 font-mono font-bold text-[11px]">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={loading}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                title="Zoom avant"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Rotation */}
            <button
              type="button"
              onClick={handleRotate}
              disabled={loading}
              className="p-1.5 bg-slate-950 text-slate-300 hover:text-white border border-slate-800 rounded-xl hover:bg-slate-800 cursor-pointer"
              title="Pivoter de 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Download & External Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={url}
            download={downloadFileName}
            className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer shadow text-[11px] px-2.5"
            title="Télécharger le fichier PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Télécharger</span>
          </a>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer shadow text-[11px] px-2.5"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nouvel Onglet</span>
          </a>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-slate-950 p-4 overflow-auto flex items-center justify-center min-h-[480px] relative">
        {/* NATIVE OBJECT / IFRAME ENGINE */}
        {viewEngine === 'native' && (
          <div className="w-full h-full min-h-[480px] flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-white shadow-2xl">
            <object
              data={url}
              type="application/pdf"
              className="w-full h-full min-h-[480px] flex-1"
            >
              <iframe
                src={url}
                title={title || 'Visualiseur PDF'}
                className="w-full h-full min-h-[480px] flex-1 border-0"
              >
                <div className="p-8 text-center bg-slate-900 text-slate-300 space-y-4">
                  <FileText className="w-12 h-12 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold">Impossible d'intégrer directement l'aperçu PDF dans ce composant iframe.</p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ouvrir le document PDF directement</span>
                  </a>
                </div>
              </iframe>
            </object>
          </div>
        )}

        {/* GOOGLE DOCS VIEWER ENGINE */}
        {viewEngine === 'google' && (
          <div className="w-full h-full min-h-[480px] flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-white shadow-2xl">
            <iframe
              src={googleDocsViewerUrl}
              title={title || 'Google Docs PDF Viewer'}
              className="w-full h-full min-h-[480px] flex-1 border-0"
            />
          </div>
        )}

        {/* CANVAS PDFJS ENGINE */}
        {viewEngine === 'canvas' && (
          <>
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 text-amber-400 p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-xs font-bold text-slate-300">Chargement et rendu du document PDF en cours...</p>
              </div>
            )}

            {error && (
              <div className="max-w-md p-6 bg-slate-900 border border-amber-500/40 rounded-2xl text-center space-y-4 shadow-2xl">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-white mb-1">Affichage Canvas Inaccessible</p>
                  <p className="text-xs text-slate-300">{error}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold text-amber-400">Solution recommandée :</p>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setViewEngine('native');
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer transition-colors"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Basculer sur le Lecteur Navigateur Direct (Object)</span>
                  </button>
                </div>

                <div className="pt-2 flex justify-center gap-2 flex-wrap">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span>Nouvel Onglet</span>
                  </a>
                  <a
                    href={url}
                    download={downloadFileName}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </a>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="shadow-2xl rounded-lg overflow-hidden border border-slate-800 bg-white">
                <canvas ref={canvasRef} className="block max-w-full" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
