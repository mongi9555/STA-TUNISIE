import React from 'react';
import { UploadedDocument } from '../types';
import { X, FileText, Download, File } from 'lucide-react';
import { PdfViewer } from './PdfViewer';

interface DocumentViewerModalProps {
  document: UploadedDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  React.useEffect(() => {
    if (!document) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [document, onClose]);

  if (!document) return null;

  const isImage = document.fileType.startsWith('image/') || document.dataUrl.startsWith('data:image');
  const isPdf = document.fileType.includes('pdf') || document.dataUrl.startsWith('data:application/pdf') || document.name.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="text-sm font-bold text-white">{document.name}</h3>
              <p className="text-xs text-slate-400">
                Catégorie: <strong className="text-slate-200">{document.category.toUpperCase().replace('_', ' ')}</strong> ({document.sizeFormatted})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={document.dataUrl}
              download={document.name}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Télécharger le fichier"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-4 bg-slate-950 flex-1 overflow-auto flex items-center justify-center min-h-[400px]">
          {isImage ? (
            <img
              src={document.dataUrl}
              alt={document.name}
              className="max-h-[70vh] object-contain rounded-xl border border-slate-800 shadow-md"
            />
          ) : isPdf ? (
            <PdfViewer
              url={document.dataUrl}
              downloadFileName={document.name}
              title={document.name}
              className="w-full h-full min-h-[500px]"
            />
          ) : (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                <File className="w-10 h-10" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{document.name}</p>
                <p className="text-xs text-slate-400">Aperçu binaire ou type de fichier non géré en direct</p>
              </div>
              <a
                href={document.dataUrl}
                download={document.name}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors shadow"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le document</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

