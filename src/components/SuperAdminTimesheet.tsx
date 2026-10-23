import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  Upload,
  X,
  Download,
  Eye,
  Search,
  Check,
  AlertCircle,
  File,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  CommercialUser,
  TimesheetNote,
  TimesheetPeriod,
  CalendarMediaType,
} from '../types';
import {
  getISOWeekNumber,
  getWeekDates,
  getMonthCalendarGrid,
  formatBytes,
  readFileAsDataURL,
  SAMPLE_STA_PDF,
  INITIAL_TIMESHEET_NOTES,
} from '../utils/timesheetUtils';
import { PdfViewer } from './PdfViewer';

interface SuperAdminCalendarProps {
  currentUser: CommercialUser;
  onNotification?: (msg: string) => void;
}

export const SuperAdminTimesheet: React.FC<SuperAdminCalendarProps> = ({
  currentUser,
  onNotification,
}) => {
  // Current view mode: 'month' | 'week' | 'day'
  const [viewMode, setViewMode] = useState<TimesheetPeriod>('month');

  // Media filter: 'all' | 'image' | 'pdf'
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'pdf'>('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected date reference
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Notes/Media state (Images & Fichiers PDF uniquement)
  const [notes, setNotes] = useState<TimesheetNote[]>(INITIAL_TIMESHEET_NOTES);

  // Modal Note Form State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<TimesheetNote | null>(null);

  // Form inputs (Restricted strictly to Image or PDF)
  const [formDate, setFormDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [formMediaType, setFormMediaType] = useState<CalendarMediaType>('image');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formFileUrl, setFormFileUrl] = useState<string>('');
  const [formFileName, setFormFileName] = useState<string>('');
  const [formFileSize, setFormFileSize] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Viewer Modal State (Image Fullscreen or PDF Viewer)
  const [viewerItem, setViewerItem] = useState<TimesheetNote | null>(null);
  const [imageZoom, setImageZoom] = useState<number>(1);
  const [imageRotation, setImageRotation] = useState<number>(0);

  // Delete confirmation modal
  const [noteToDelete, setNoteToDelete] = useState<TimesheetNote | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load from server database
  useEffect(() => {
    const fetchServerNotes = async () => {
      try {
        const res = await fetch('/api/timesheet/notes');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.notes) && data.notes.length > 0) {
            const mediaOnly = data.notes.filter((n: TimesheetNote) => n && n.mediaType && n.fileUrl);
            const finalNotes = mediaOnly.length > 0 ? mediaOnly : INITIAL_TIMESHEET_NOTES;
            setNotes(finalNotes);
          }
        }
      } catch (err) {
        console.warn('Erreur chargement /api/timesheet/notes:', err);
      }
    };
    fetchServerNotes();
  }, []);

  // Save notes directly to server database
  const saveNotes = async (updated: TimesheetNote[]) => {
    setNotes(updated);
    try {
      await fetch('/api/timesheet/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updated }),
      });
    } catch (e) {
      console.warn('Erreur sauvegarde calendrier sur le serveur:', e);
    }
  };

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Filtered notes based on filter tab and search
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Filter by media type
      if (mediaFilter === 'image' && n.mediaType !== 'image') return false;
      if (mediaFilter === 'pdf' && n.mediaType !== 'pdf') return false;

      // Filter by search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (n.title || '').toLowerCase().includes(q);
        const matchFile = (n.fileName || '').toLowerCase().includes(q);
        const matchContent = (n.content || '').toLowerCase().includes(q);
        if (!matchTitle && !matchFile && !matchContent) return false;
      }

      return true;
    });
  }, [notes, mediaFilter, searchQuery]);

  // Counts for media filter badges
  const counts = useMemo(() => {
    const images = notes.filter((n) => n.mediaType === 'image').length;
    const pdfs = notes.filter((n) => n.mediaType === 'pdf').length;
    return {
      all: notes.length,
      image: images,
      pdf: pdfs,
    };
  }, [notes]);

  // Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Title formatting in center: OCTOBRE 2026
  const centerTitle = useMemo(() => {
    if (viewMode === 'month') {
      return currentDate
        .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        .toUpperCase();
    } else if (viewMode === 'week') {
      const weekDates = getWeekDates(currentDate);
      const start = weekDates[0].dateObj;
      const end = weekDates[6].dateObj;
      const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
      return `${startStr} - ${endStr}`.toUpperCase();
    } else {
      return currentDate
        .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        .toUpperCase();
    }
  }, [currentDate, viewMode]);

  // Month Grid calculation
  const monthGrid = useMemo(() => {
    return getMonthCalendarGrid(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  // Week Dates
  const weekDatesList = useMemo(() => getWeekDates(currentDate), [currentDate]);

  // Open note creation
  const handleOpenCreateModal = (dateStr?: string, defaultType?: CalendarMediaType) => {
    setEditingNote(null);
    setFormDate(dateStr || currentDate.toISOString().slice(0, 10));
    setFormMediaType(defaultType || 'image');
    setFormTitle('');
    setFormContent('');
    setFormFileUrl('');
    setFormFileName('');
    setFormFileSize('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open note editing
  const handleOpenEditModal = (note: TimesheetNote, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingNote(note);
    setFormDate(note.date);
    setFormMediaType(note.mediaType || 'image');
    setFormTitle(note.title);
    setFormContent(note.content || '');
    setFormFileUrl(note.fileUrl || '');
    setFormFileName(note.fileName || '');
    setFormFileSize(note.fileSize || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  // File Upload Handlers
  const handleFileSelected = async (file: File) => {
    setFormError(null);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (formMediaType === 'image' && !isImage) {
      setFormError('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, GIF).');
      return;
    }
    if (formMediaType === 'pdf' && !isPdf) {
      setFormError('Veuillez sélectionner un fichier PDF valide (.pdf).');
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setFormFileUrl(dataUrl);
      setFormFileName(file.name);
      setFormFileSize(formatBytes(file.size));
      // Auto-set title if empty
      if (!formTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setFormTitle(cleanName);
      }
    } catch (err) {
      setFormError('Erreur lors de la lecture du fichier.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Save or update note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Le titre ou libellé est obligatoire.');
      return;
    }
    if (!formFileUrl) {
      setFormError(
        formMediaType === 'image'
          ? 'Veuillez téléverser une image (JPG, PNG, WebP).'
          : 'Veuillez téléverser un document PDF (.pdf).'
      );
      return;
    }

    const dObj = new Date(formDate + 'T12:00:00Z');
    const weekNum = getISOWeekNumber(dObj);
    const mKey = formDate.slice(0, 7);

    if (editingNote) {
      const updated: TimesheetNote = {
        ...editingNote,
        title: formTitle.trim(),
        content: formContent.trim(),
        date: formDate,
        weekNumber: weekNum,
        monthKey: mKey,
        mediaType: formMediaType,
        fileUrl: formFileUrl,
        fileName: formFileName || (formMediaType === 'image' ? 'image.jpg' : 'document.pdf'),
        fileSize: formFileSize || '1.0 Mo',
        updatedAt: new Date().toISOString(),
      };
      const list = notes.map((n) => (n.id === editingNote.id ? updated : n));
      saveNotes(list);
      if (onNotification) onNotification('Élément mis à jour avec succès.');
    } else {
      const newNote: TimesheetNote = {
        id: `cal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: formTitle.trim(),
        content: formContent.trim(),
        date: formDate,
        weekNumber: weekNum,
        monthKey: mKey,
        periodType: 'day',
        mediaType: formMediaType,
        fileUrl: formFileUrl,
        fileName: formFileName || (formMediaType === 'image' ? 'image.jpg' : 'document.pdf'),
        fileSize: formFileSize || '1.0 Mo',
        authorName: currentUser.name || 'Super Administrateur',
        authorRole: currentUser.title || 'Super Administrateur (DSI)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const list = [newNote, ...notes];
      saveNotes(list);
      if (onNotification) {
        onNotification(
          formMediaType === 'image' ? 'Image ajoutée au calendrier.' : 'Fichier PDF ajouté au calendrier.'
        );
      }
    }

    setIsModalOpen(false);
  };

  // Delete note
  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    saveNotes(updated);
    setNoteToDelete(null);
    setIsModalOpen(false);
    if (onNotification) onNotification('Élément supprimé du calendrier.');
  };

  // Open Viewer (Lightbox / PDF Reader)
  const handleOpenViewer = (note: TimesheetNote, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setImageZoom(1);
    setImageRotation(0);
    setViewerItem(note);
  };

  return (
    <div className="bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 overflow-hidden font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP CALENDAR HEADER WITH NAVIGATION, FILTERS & ADD BUTTON */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50/70">
        {/* Left: Navigation Buttons & Quick Period */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="w-9 h-8 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer shadow-xs"
              title="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-9 h-8 rounded border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer shadow-xs"
              title="Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleToday}
            className="h-8 px-3 rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            Aujourd'hui
          </button>

          {/* Center Month / Year Title */}
          <h2 className="text-base sm:text-lg font-extrabold tracking-wide text-slate-900 ml-2">
            {centerTitle}
          </h2>
        </div>

        {/* Center: Media Filters & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-center">
          {/* Media Type Filter Tabs */}
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 shadow-xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMediaFilter('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                mediaFilter === 'all'
                  ? 'bg-slate-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tous</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${mediaFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMediaFilter('image')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                mediaFilter === 'image'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Images</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${mediaFilter === 'image' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {counts.image}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMediaFilter('pdf')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                mediaFilter === 'pdf'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-red-500" />
              <span>Fichiers PDF</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${mediaFilter === 'pdf' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {counts.pdf}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 w-36 sm:w-44"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: View Switcher (Mois / Semaine / Jour) & Add Button */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-slate-200 text-slate-900 border border-slate-400 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mois
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-slate-200 text-slate-900 border border-slate-400 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semaine
            </button>
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-slate-200 text-slate-900 border border-slate-400 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jour
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="h-8 px-3.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95"
            title="Ajouter une image ou un fichier PDF"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Image / PDF</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. CALENDAR BODY: MONTH VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'month' && (
        <div className="w-full select-none">
          {/* Days of week header row */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/80 text-slate-700 text-xs font-bold uppercase tracking-wider text-center py-2.5">
            <div>LUN.</div>
            <div>MAR.</div>
            <div>MER.</div>
            <div>JEU.</div>
            <div>VEN.</div>
            <div className="text-amber-700">SAM.</div>
            <div className="text-amber-700">DIM.</div>
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-[1px]">
            {monthGrid.map((cell, idx) => {
              const dayNotes = filteredNotes.filter((n) => n.date === cell.dateStr);
              const dayOfWeek = idx % 7; // 0=Lun, 6=Dim
              const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
              const isToday = cell.dateStr === todayStr;

              return (
                <div
                  key={idx}
                  onClick={() => handleOpenCreateModal(cell.dateStr)}
                  className={`min-h-[120px] sm:min-h-[145px] p-2 flex flex-col justify-between transition-colors cursor-pointer group relative ${
                    isToday
                      ? 'bg-amber-50/90 ring-2 ring-amber-400 ring-inset'
                      : isWeekend
                      ? 'bg-[#f4f6f9]'
                      : cell.isCurrentMonth
                      ? 'bg-white hover:bg-slate-50'
                      : 'bg-slate-50/60 opacity-60'
                  }`}
                >
                  {/* Top row in cell: Day number on right + Quick add button */}
                  <div className="flex items-center justify-between">
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-red-600 font-extrabold transition-opacity flex items-center gap-0.5">
                      <Plus className="w-3 h-3" /> Image/PDF
                    </span>
                    <span
                      className={`text-xs font-semibold font-mono ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold shadow-xs'
                          : cell.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400 font-normal'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                  </div>

                  {/* Media items inside the cell */}
                  <div className="flex-1 space-y-1.5 my-1 overflow-y-auto max-h-[85px] pr-0.5">
                    {dayNotes.map((note) => {
                      const isImage = note.mediaType === 'image';

                      return (
                        <div
                          key={note.id}
                          onClick={(e) => handleOpenViewer(note, e)}
                          className={`p-1.5 rounded-lg border text-left flex items-center justify-between gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer ${
                            isImage
                              ? 'bg-amber-50/80 border-amber-300/80 hover:border-amber-500 text-amber-950'
                              : 'bg-red-50/80 border-red-300/80 hover:border-red-500 text-red-950'
                          }`}
                          title={`Cliquer pour visualiser : ${note.title}`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            {/* Icon or Thumbnail */}
                            {isImage ? (
                              note.fileUrl ? (
                                <img
                                  src={note.fileUrl}
                                  alt={note.title}
                                  className="w-7 h-7 rounded object-cover border border-amber-300 shrink-0 bg-white"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded bg-amber-200 flex items-center justify-center shrink-0">
                                  <ImageIcon className="w-4 h-4 text-amber-700" />
                                </div>
                              )
                            ) : (
                              <div className="w-7 h-7 rounded bg-red-200 flex items-center justify-center shrink-0 border border-red-300">
                                <FileText className="w-4 h-4 text-red-700" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold truncate leading-tight">
                                {note.title}
                              </p>
                              <p className="text-[9px] text-slate-500 truncate flex items-center gap-1">
                                <span className="font-mono font-semibold uppercase">
                                  {isImage ? 'IMG' : 'PDF'}
                                </span>
                                {note.fileSize && <span>• {note.fileSize}</span>}
                              </p>
                            </div>
                          </div>

                          {/* Quick Actions (Preview Eye, Edit, Delete) */}
                          <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => handleOpenViewer(note, e)}
                              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-white/80"
                              title="Visualiser en plein écran"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditModal(note, e)}
                              className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-white/80"
                              title="Modifier"
                            >
                              <File className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cell footer */}
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                    {dayNotes.length > 0 && (
                      <span className="font-bold text-slate-600 font-mono text-[10px]">
                        {dayNotes.length} {dayNotes.length > 1 ? 'fichiers' : 'fichier'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CALENDAR BODY: WEEK VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'week' && (
        <div className="w-full select-none overflow-x-auto">
          {/* Days of week header row */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/80 text-slate-700 text-xs font-bold uppercase text-center py-2.5 min-w-[800px]">
            {weekDatesList.map((d, i) => {
              const isToday = d.dateStr === todayStr;
              return (
                <div key={i} className={isToday ? 'text-red-600 font-extrabold' : ''}>
                  <span>{d.shortDay}. </span>
                  <span className="font-mono">
                    {d.dateStr.slice(8, 10)}/{d.dateStr.slice(5, 7)}
                  </span>
                  {isToday && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold">
                      Aujourd'hui
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Week 7-column planner */}
          <div className="grid grid-cols-7 min-w-[800px] divide-x divide-slate-200 bg-white min-h-[500px]">
            {weekDatesList.map((d, i) => {
              const isWeekend = i === 5 || i === 6;
              const isToday = d.dateStr === todayStr;
              const dayNotes = filteredNotes.filter((n) => n.date === d.dateStr);

              return (
                <div
                  key={d.dateStr}
                  className={`p-2.5 flex flex-col justify-between ${
                    isToday ? 'bg-amber-50/50' : isWeekend ? 'bg-[#f8fafc]' : 'bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-800">{d.dayName}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenCreateModal(d.dateStr)}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold cursor-pointer"
                      >
                        + Ajouter
                      </button>
                    </div>

                    {/* Media Cards in column */}
                    <div className="space-y-2">
                      {dayNotes.length === 0 ? (
                        <div className="py-8 text-center text-slate-400">
                          <ImageIcon className="w-6 h-6 mx-auto opacity-30 mb-1" />
                          <p className="text-[11px] italic">Aucun document</p>
                        </div>
                      ) : (
                        dayNotes.map((note) => {
                          const isImage = note.mediaType === 'image';

                          return (
                            <div
                              key={note.id}
                              onClick={(e) => handleOpenViewer(note, e)}
                              className={`p-2 rounded-xl border bg-white shadow-xs hover:shadow-md transition-all cursor-pointer space-y-1.5 ${
                                isImage
                                  ? 'border-amber-300 hover:border-amber-500'
                                  : 'border-red-300 hover:border-red-500'
                              }`}
                            >
                              {/* Preview area */}
                              {isImage && note.fileUrl ? (
                                <div className="h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group">
                                  <img
                                    src={note.fileUrl}
                                    alt={note.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                    <Maximize2 className="w-5 h-5" />
                                  </div>
                                </div>
                              ) : (
                                <div className="h-20 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-700 p-2">
                                  <FileText className="w-7 h-7 text-red-600 mb-0.5" />
                                  <span className="text-[10px] font-bold font-mono uppercase">
                                    Document PDF
                                  </span>
                                </div>
                              )}

                              <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                                {note.title}
                              </p>

                              {note.content && (
                                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                  {note.content}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                                <span className="font-mono">{note.fileSize || 'Fichier'}</span>
                                <div className="flex items-center gap-1">
                                  {note.fileUrl && (
                                    <a
                                      href={note.fileUrl}
                                      download={note.fileName || 'document'}
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-1 rounded text-slate-400 hover:text-slate-800"
                                      title="Télécharger"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => handleOpenEditModal(note, e)}
                                    className="p-1 rounded text-slate-400 hover:text-blue-600"
                                    title="Modifier"
                                  >
                                    <File className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal(d.dateStr)}
                    className="mt-3 w-full py-1.5 text-center text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg border border-dashed border-slate-300 transition-colors cursor-pointer"
                  >
                    + Image ou PDF
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. CALENDAR BODY: DAY VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'day' && (
        <div className="p-5 bg-white min-h-[500px] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 capitalize flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-red-600" />
                <span>
                  {currentDate.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Galerie des photos, arrivages et documents PDF archivés pour cette date.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCreateModal(currentDate.toISOString().slice(0, 10))}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter Image ou PDF pour ce jour</span>
            </button>
          </div>

          {/* Daily Gallery Grid */}
          {(() => {
            const dayNotes = filteredNotes.filter(
              (n) => n.date === currentDate.toISOString().slice(0, 10)
            );

            if (dayNotes.length === 0) {
              return (
                <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">
                    Aucune image ou fichier PDF pour cette journée
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Téléversez vos photos d'arrivage, rapports techniques, fiches de conformité ou documents STA.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal(currentDate.toISOString().slice(0, 10))}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un fichier</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayNotes.map((note) => {
                  const isImage = note.mediaType === 'image';

                  return (
                    <div
                      key={note.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Media Preview Box */}
                        {isImage && note.fileUrl ? (
                          <div
                            onClick={() => handleOpenViewer(note)}
                            className="h-48 bg-slate-900 cursor-pointer relative overflow-hidden group/img"
                          >
                            <img
                              src={note.fileUrl}
                              alt={note.title}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                            />
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                              Photo / Image
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Eye className="w-7 h-7 drop-shadow-md" />
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleOpenViewer(note)}
                            className="h-48 bg-red-50/80 border-b border-red-100 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-red-100/60 transition-colors"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-2 shadow-xs">
                              <FileText className="w-7 h-7" />
                            </div>
                            <span className="font-extrabold text-red-700 text-xs font-mono uppercase tracking-wide">
                              Document PDF
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {note.fileName || 'document.pdf'}
                            </span>
                          </div>
                        )}

                        <div className="p-4 space-y-2">
                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                            {note.title}
                          </h4>
                          {note.content && (
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                              {note.content}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer Info & Actions */}
                      <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                        <div className="text-[11px] text-slate-500">
                          <span>{note.authorName || 'Super Admin'}</span>
                          {note.fileSize && <span> • {note.fileSize}</span>}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {note.fileUrl && (
                            <a
                              href={note.fileUrl}
                              download={note.fileName || (isImage ? 'image.jpg' : 'document.pdf')}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-[11px] font-semibold text-slate-700 flex items-center gap-1"
                              title="Télécharger"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Télécharger</span>
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(note)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-md"
                            title="Modifier"
                          >
                            <File className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setNoteToDelete(note)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-md"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. MODAL: ADD / EDIT IMAGE OR PDF ONLY */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl space-y-4 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                {formMediaType === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                ) : (
                  <FileText className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingNote
                      ? 'Modifier le Document du Calendrier'
                      : 'Ajouter une Image ou un Fichier PDF'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Archivage officiel pour le calendrier Super Admin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
              {/* Type Switcher (Image vs PDF) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Type de Fichier à Joindre *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFormMediaType('image');
                      setFormError(null);
                    }}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formMediaType === 'image'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Image (Photo / Capture)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormMediaType('pdf');
                      setFormError(null);
                    }}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formMediaType === 'pdf'
                        ? 'bg-red-600 text-white border-red-700 shadow-md shadow-red-600/20'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Fichier PDF (.pdf)</span>
                  </button>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Date sur le Calendrier *
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* File Upload Drag & Drop Zone */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Téléverser {formMediaType === 'image' ? "l'Image (JPG, PNG, WebP)" : 'le Fichier PDF'} *
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept={
                    formMediaType === 'image'
                      ? 'image/png,image/jpeg,image/webp,image/gif'
                      : 'application/pdf,.pdf'
                  }
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-red-500 bg-red-50/50'
                      : formFileUrl
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  {formFileUrl ? (
                    <div className="space-y-2">
                      {formMediaType === 'image' ? (
                        <div className="relative inline-block">
                          <img
                            src={formFileUrl}
                            alt="Aperçu"
                            className="max-h-36 mx-auto rounded-xl object-contain border border-slate-200 shadow-sm"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
                          <FileText className="w-7 h-7" />
                        </div>
                      )}

                      <div>
                        <p className="font-bold text-slate-900 text-xs truncate max-w-xs mx-auto">
                          {formFileName || 'Fichier sélectionné'}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1 mt-0.5">
                          <Check className="w-3.5 h-3.5" /> Fichier prêt ({formFileSize || 'Taille calculée'})
                        </p>
                      </div>

                      <p className="text-[10px] text-slate-400">
                        Cliquer ou glisser un nouveau fichier pour remplacer
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center mx-auto shadow-xs">
                        <Upload className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">
                          Glissez-déposez votre {formMediaType === 'image' ? 'image' : 'fichier PDF'} ici
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          ou <span className="text-red-600 font-bold underline">parcourez vos dossiers</span>
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {formMediaType === 'image' ? 'Formats : JPG, PNG, WEBP' : 'Format : PDF uniquement'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title / Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Titre / Libellé du Document *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formMediaType === 'image'
                      ? 'ex: Photo Réception Arrivage Tiggo 7 Radès...'
                      : 'ex: Fiche Technique Officielle STA Tiggo 4 Pro...'
                  }
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                />
              </div>

              {/* Optional Content / Caption */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Remarques / Description (Optionnelle) :
                </label>
                <textarea
                  rows={2}
                  placeholder="Précisions sur le document, le lot de véhicules ou le contexte..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                {editingNote ? (
                  <button
                    type="button"
                    onClick={() => setNoteToDelete(editingNote)}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingNote ? 'Enregistrer les Modifications' : 'Enregistrer'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. FULLSCREEN MEDIA VIEWER MODAL (IMAGE LIGHTBOX OR PDF VIEWER) */}
      {/* ------------------------------------------------------------- */}
      {viewerItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Viewer Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {viewerItem.mediaType === 'image' ? (
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {viewerItem.title}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-2 truncate">
                    <span>Date : {viewerItem.date}</span>
                    {viewerItem.fileName && <span>• {viewerItem.fileName}</span>}
                    {viewerItem.fileSize && <span>• {viewerItem.fileSize}</span>}
                  </p>
                </div>
              </div>

              {/* Viewer Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {viewerItem.mediaType === 'image' && (
                  <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setImageZoom((z) => Math.max(0.5, z - 0.25))}
                      className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                      title="Zoom arrière"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-mono px-1 text-slate-400">
                      {Math.round(imageZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageZoom((z) => Math.min(3, z + 0.25))}
                      className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700"
                      title="Zoom avant"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageRotation((r) => (r + 90) % 360)}
                      className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 ml-1"
                      title="Pivoter 90°"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {viewerItem.fileUrl && (
                  <a
                    href={viewerItem.fileUrl}
                    download={viewerItem.fileName || (viewerItem.mediaType === 'image' ? 'image.jpg' : 'document.pdf')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Télécharger</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setViewerItem(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-4 min-h-[400px] max-h-[75vh]">
              {viewerItem.mediaType === 'image' ? (
                <div className="overflow-auto max-w-full max-h-full flex items-center justify-center">
                  <img
                    src={viewerItem.fileUrl}
                    alt={viewerItem.title}
                    style={{
                      transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                      transition: 'transform 0.15s ease-out',
                    }}
                    className="max-h-[68vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
                  />
                </div>
              ) : viewerItem.fileUrl ? (
                <div className="w-full h-[68vh]">
                  <PdfViewer
                    url={viewerItem.fileUrl}
                    title={viewerItem.title}
                    downloadFileName={viewerItem.fileName || 'document_chery.pdf'}
                    className="h-full w-full rounded-xl overflow-hidden"
                  />
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto text-red-500 mb-2 opacity-60" />
                  <p className="text-sm font-bold">Document non disponible</p>
                </div>
              )}
            </div>

            {/* Viewer Footer (Description if available) */}
            {viewerItem.content && (
              <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-300">
                <p className="leading-relaxed">
                  <strong className="text-white">Note / Description : </strong>
                  {viewerItem.content}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {noteToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">
              Supprimer ce document ?
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              « {noteToDelete.title} » ({noteToDelete.mediaType === 'image' ? 'Image' : 'Fichier PDF'})
            </p>
            <p className="text-[11px] text-slate-400">
              Cette action retirera le fichier du calendrier pour cette date.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeleteNote(noteToDelete.id)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
