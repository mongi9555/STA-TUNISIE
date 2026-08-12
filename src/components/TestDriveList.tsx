import React, { useState } from 'react';
import { TestDriveAppointment, TestDriveStatus, CommercialUser, CarModel } from '../types';
import { Calendar, Clock, Car, User, Phone, MapPin, Search, Filter, Plus, CheckCircle2, XCircle, AlertCircle, Trash2, Printer, Sparkles, Check, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import cheryLogo from '../assets/images/chery_logo_emblem_1785417732982.jpg';

interface TestDriveListProps {
  testDrives: TestDriveAppointment[];
  cars: CarModel[];
  currentUser: CommercialUser;
  onOpenTestDriveModal: (car?: CarModel) => void;
  onUpdateStatus: (id: string, status: TestDriveStatus) => void;
  onDeleteTestDrive: (id: string) => void;
}

export const TestDriveList: React.FC<TestDriveListProps> = ({
  testDrives,
  cars,
  currentUser,
  onOpenTestDriveModal,
  onUpdateStatus,
  onDeleteTestDrive,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Tous' | TestDriveStatus>('Tous');
  const [activeVoucher, setActiveVoucher] = useState<TestDriveAppointment | null>(null);

  // Metrics
  const totalCount = testDrives.length;
  const pendingCount = testDrives.filter((td) => td.status === 'En attente').length;
  const confirmedCount = testDrives.filter((td) => td.status === 'Confirmé').length;
  const completedCount = testDrives.filter((td) => td.status === 'Effectué').length;

  // Filtered list
  const filtered = testDrives.filter((td) => {
    const matchesSearch =
      td.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      td.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      td.clientPhone.includes(searchTerm) ||
      td.agency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tous' || td.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TestDriveStatus) => {
    switch (status) {
      case 'En attente':
        return (
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            En attente
          </span>
        );
      case 'Confirmé':
        return (
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmé
          </span>
        );
      case 'Effectué':
        return (
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            Effectué
          </span>
        );
      case 'Annulé':
        return (
          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Annulé
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-red-400 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Génération Essais Véhicules Chery
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Gestion des Rendez-vous Test Drive
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Organisez et suivez les demandes d'essai sur route de la gamme Chery pour vos clients dans l'ensemble du réseau STA Tunisie.
            </p>
          </div>

          <button
            onClick={() => onOpenTestDriveModal()}
            className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau RDV Test Drive</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400">Total RDV Essais</p>
            <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-400">En Attente</p>
            <p className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-400">RDV Confirmés</p>
            <p className="text-2xl font-black text-blue-300 mt-1">{confirmedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-400">Essais Effectués</p>
            <p className="text-2xl font-black text-emerald-300 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par client, modèle ou agence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {(['Tous', 'En attente', 'Confirmé', 'Effectué', 'Annulé'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Test Drives Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Aucun rendez-vous d'essai trouvé</h3>
          <p className="text-xs max-w-md mx-auto text-slate-400">
            {testDrives.length === 0
              ? 'Aucun rendez-vous de Test Drive n’a encore été programmé. Cliquez sur le bouton "+ Nouveau RDV Test Drive" ci-dessus pour planifier un essai.'
              : 'Aucun rendez-vous ne correspond à vos critères de recherche.'}
          </p>
          <button
            onClick={() => onOpenTestDriveModal()}
            className="mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Programmer un Essai maintenant</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((td) => {
            const matchedCar = cars.find((c) => c.id === td.carId);
            return (
              <div
                key={td.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 shadow-xl transition-all relative flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar ID & Status */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-black text-slate-300">
                      {td.id}
                    </span>
                    {getStatusBadge(td.status)}
                  </div>

                  {/* Vehicle Details */}
                  <div className="flex items-center gap-3 my-3">
                    {matchedCar?.imageUrl ? (
                      <img
                        src={matchedCar.imageUrl}
                        alt={td.carName}
                        className="w-16 h-12 object-cover rounded-xl border border-slate-800 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        <Car className="w-6 h-6 text-slate-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-white text-sm truncate">{td.carName}</h3>
                      <p className="text-[11px] text-red-400 font-semibold truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {td.agency}
                      </p>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-1.5 p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        Client :
                      </span>
                      <strong className="text-white font-bold">{td.clientName}</strong>
                    </div>

                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        Tél :
                      </span>
                      <strong className="text-slate-200">{td.clientPhone}</strong>
                    </div>

                    {td.clientEmail && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email :</span>
                        <span className="text-slate-300 truncate max-w-[150px]">{td.clientEmail}</span>
                      </div>
                    )}
                  </div>

                  {/* Appointment Schedule Box */}
                  <div className="mt-3 p-3 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-400" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Date de l'essai</p>
                        <p className="text-xs font-bold text-white font-mono">{td.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Heure</p>
                        <p className="text-xs font-bold text-amber-300 font-mono">{td.timeSlot}</p>
                      </div>
                    </div>
                  </div>

                  {td.notes && (
                    <p className="text-[11px] text-slate-400 italic mt-2.5 line-clamp-2">
                      "{td.notes}"
                    </p>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-4">
                  {/* Status Dropdown */}
                  <select
                    value={td.status}
                    onChange={(e) => onUpdateStatus(td.id, e.target.value as TestDriveStatus)}
                    className="bg-slate-950 border border-slate-800 text-white text-[11px] font-bold rounded-xl px-2 py-1.5 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="En attente">⏳ En attente</option>
                    <option value="Confirmé">✅ Confirmé</option>
                    <option value="Effectué">🏁 Effectué</option>
                    <option value="Annulé">❌ Annulé</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveVoucher(td)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Imprimer Fiche de RDV Essai"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-400" />
                    </button>

                    <button
                      onClick={() => onDeleteTestDrive(td.id)}
                      className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                      title="Supprimer ce rendez-vous"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Test Drive Voucher Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 font-sans">
            <button
              onClick={() => setActiveVoucher(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-colors print:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header */}
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <img src={cheryLogo} alt="Chery Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">STA CHERY TUNISIE</h2>
                  <p className="text-xs text-slate-600 font-semibold">Société Tunisienne d'Automobiles</p>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-black font-mono">
                  FICHE ESSAI #{activeVoucher.id}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">{activeVoucher.createdAt ? new Date(activeVoucher.createdAt).toLocaleDateString() : ''}</p>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-extrabold text-slate-800 text-sm text-center border-b border-slate-200 pb-2 uppercase tracking-wide">
                  CONFIRMATION DE RENDEZ-VOUS TEST DRIVE
                </h3>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500 font-medium">Véhicule à Tester :</span>
                    <p className="font-extrabold text-red-700 text-sm">{activeVoucher.carName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Agence Chery :</span>
                    <p className="font-bold text-slate-800">{activeVoucher.agency}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl p-3 space-y-1">
                  <h4 className="font-bold text-slate-700 text-[11px] uppercase border-b border-slate-100 pb-1">
                    Client
                  </h4>
                  <p className="font-black text-slate-900 text-sm">{activeVoucher.clientName}</p>
                  <p className="font-mono text-slate-700">Tél : {activeVoucher.clientPhone}</p>
                  {activeVoucher.clientCin && <p className="font-mono text-slate-600">CIN : {activeVoucher.clientCin}</p>}
                </div>

                <div className="border border-slate-200 rounded-2xl p-3 space-y-1 bg-amber-50/50">
                  <h4 className="font-bold text-amber-800 text-[11px] uppercase border-b border-amber-100 pb-1">
                    Date & Horaire
                  </h4>
                  <p className="font-mono font-black text-slate-900 text-sm">{activeVoucher.date}</p>
                  <p className="font-mono font-bold text-amber-700">Créneau : {activeVoucher.timeSlot}</p>
                </div>
              </div>

              {activeVoucher.notes && (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <span className="font-bold text-slate-600">Remarques :</span>
                  <p className="text-slate-700 italic">{activeVoucher.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                <p>📌 <strong>Conditions de l'Essai :</strong> Le conducteur doit présenter son permis de conduire original en cours de validité à l'arrivée en agence.</p>
                <p>Commercial Référent : {activeVoucher.commercialName || 'STA Chery'}</p>
              </div>
            </div>

            {/* Print Footer Actions */}
            <div className="mt-6 flex items-center justify-between print:hidden">
              <button
                onClick={() => setActiveVoucher(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Fermer
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-500 shadow flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer la Fiche d'Essai</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
