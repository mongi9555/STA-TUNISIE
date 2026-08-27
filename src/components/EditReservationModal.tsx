import React, { useState, useEffect } from 'react';
import { Reservation, TUNISIA_GOVERNORATES, ClientType, Car, CarColor } from '../types';
import { calculateDeliveryDate } from '../data/cheryData';
import {
  X,
  User,
  Building,
  Calendar,
  CreditCard,
  FileText,
  Save,
  AlertTriangle,
  Lock,
  Sparkles,
  Palette,
  Check,
  Car as CarIcon,
  Clock,
} from 'lucide-react';

interface EditReservationModalProps {
  isOpen: boolean;
  reservation: Reservation | null;
  cars?: Car[];
  onClose: () => void;
  onSave: (updatedReservation: Reservation) => void;
  canEditValidated: boolean;
}

export const EditReservationModal: React.FC<EditReservationModalProps> = ({
  isOpen,
  reservation,
  cars = [],
  onClose,
  onSave,
  canEditValidated,
}) => {
  if (!isOpen || !reservation) return null;

  const currentCar = cars.find((c) => c.id === reservation.carId);
  const isSociete = reservation.client.type === 'societe';
  const isValidated = reservation.status === 'Confirmée' || reservation.status === 'Livrée';
  const isLocked = isValidated && !canEditValidated;

  // Form State - Client
  const [clientType, setClientType] = useState<ClientType>(reservation.client.type);

  // Vehicle Colors
  const [colorChosen, setColorChosen] = useState<{
    id: string;
    name: string;
    hexCode: string;
  }>(reservation.colorChosen);

  const [interiorColorChosen, setInteriorColorChosen] = useState<{
    id: string;
    name: string;
    hexCode: string;
  } | undefined>(reservation.interiorColorChosen);

  // Personne Physique
  const [nom, setNom] = useState(reservation.client.personnePhysique?.nom || '');
  const [prenom, setPrenom] = useState(reservation.client.personnePhysique?.prenom || '');
  const [cin, setCin] = useState(reservation.client.personnePhysique?.cin || '');
  const [telPhysique, setTelPhysique] = useState(reservation.client.personnePhysique?.telephone || '');
  const [emailPhysique, setEmailPhysique] = useState(reservation.client.personnePhysique?.email || '');
  const [villePhysique, setVillePhysique] = useState(reservation.client.personnePhysique?.ville || 'Tunis');
  const [adressePhysique, setAdressePhysique] = useState(reservation.client.personnePhysique?.adresse || '');

  // Société
  const [raisonSociale, setRaisonSociale] = useState(reservation.client.societe?.raisonSociale || '');
  const [matriculeFiscale, setMatriculeFiscale] = useState(reservation.client.societe?.matriculeFiscale || '');
  const [gerantNomPrenom, setGerantNomPrenom] = useState(reservation.client.societe?.gerantNomPrenom || '');
  const [gerantCin, setGerantCin] = useState(reservation.client.societe?.gerantCin || '');
  const [telSociete, setTelSociete] = useState(reservation.client.societe?.telephone || '');
  const [emailSociete, setEmailSociete] = useState(reservation.client.societe?.email || '');
  const [villeSociete, setVilleSociete] = useState(reservation.client.societe?.ville || 'Tunis');
  const [adresseSociete, setAdresseSociete] = useState(reservation.client.societe?.adresse || '');
  const [registreCommerce, setRegistreCommerce] = useState(reservation.client.societe?.registreCommerce || '');

  // Financials & Payment & Dates
  const [paymentMethod, setPaymentMethod] = useState<'Espèces' | 'Chèque Certifié' | 'Virement Bancaire' | 'Leasing'>(
    reservation.paymentMethod
  );
  const [depositPaidTND, setDepositPaidTND] = useState<number>(reservation.depositPaidTND);
  const [status, setStatus] = useState<Reservation['status']>(reservation.status);
  const [etaDate, setEtaDate] = useState<string>(() => reservation.etaDate || reservation.createdAt?.slice(0, 10) || '');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(() => {
    if (reservation.expectedDeliveryDate) return reservation.expectedDeliveryDate;
    const base = reservation.etaDate || reservation.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10);
    return calculateDeliveryDate(base, 30);
  });
  const [notes, setNotes] = useState<string>(reservation.notes || '');

  const handleEtaChange = (newEta: string) => {
    setEtaDate(newEta);
    setExpectedDeliveryDate(calculateDeliveryDate(newEta, 30));
  };

  const isLeasing = paymentMethod === 'Leasing';

  // Handle payment method change: when leasing is selected, deposit automatically deactivates (0 TND)
  const handlePaymentMethodChange = (method: 'Espèces' | 'Chèque Certifié' | 'Virement Bancaire' | 'Leasing') => {
    setPaymentMethod(method);
    if (method === 'Leasing') {
      setDepositPaidTND(0);
    } else if (depositPaidTND === 0) {
      setDepositPaidTND(20000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    const updatedReservation: Reservation = {
      ...reservation,
      status,
      paymentMethod,
      colorChosen,
      interiorColorChosen,
      depositPaidTND: isLeasing ? 0 : Number(depositPaidTND),
      etaDate: etaDate.trim() || undefined,
      expectedDeliveryDate: expectedDeliveryDate.trim() || calculateDeliveryDate(etaDate, 30),
      notes: notes.trim(),
      client: {
        type: clientType,
        personnePhysique:
          clientType === 'personne_physique'
            ? {
                nom: nom.trim(),
                prenom: prenom.trim(),
                cin: cin.trim(),
                telephone: telPhysique.trim(),
                email: emailPhysique.trim(),
                ville: villePhysique,
                adresse: adressePhysique.trim(),
              }
            : undefined,
        societe:
          clientType === 'societe'
            ? {
                raisonSociale: raisonSociale.trim(),
                matriculeFiscale: matriculeFiscale.trim(),
                gerantNomPrenom: gerantNomPrenom.trim(),
                gerantCin: gerantCin.trim(),
                telephone: telSociete.trim(),
                email: emailSociete.trim(),
                ville: villeSociete,
                adresse: adresseSociete.trim(),
                registreCommerce: registreCommerce.trim(),
              }
            : undefined,
      },
    };

    onSave(updatedReservation);
    onClose();
  };

  // Available colors: from currentCar if found, otherwise at least the currently chosen color
  const availableColors: CarColor[] =
    currentCar?.colors && currentCar.colors.length > 0
      ? currentCar.colors
      : [
          {
            id: reservation.colorChosen.id,
            name: reservation.colorChosen.name,
            hexCode: reservation.colorChosen.hexCode,
            stock: 0,
            reserved: 1,
          },
        ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  Modifier la Réservation {reservation.id}
                </h3>
                {isValidated && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60">
                    Validée / Confirmée
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="text-white font-medium">{reservation.carName}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
                    style={{ backgroundColor: colorChosen.hexCode }}
                  />
                  <span>{colorChosen.name}</span>
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning if locked */}
        {isLocked && (
          <div className="m-4 p-3 bg-amber-950/60 border border-amber-600/60 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Modification restreinte après validation</p>
              <p className="text-[11px] text-amber-300/90 mt-0.5">
                Cette réservation a déjà été validée. Votre profil ne dispose pas du droit d'accès <strong className="text-white">"Modifier la réservation après validation"</strong>. Contactez un administrateur pour déverrouiller cette permission.
              </p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* SECTION: Car Color Selection */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-red-400" />
                <span>Couleur de la Voiture Réservée</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Sélection : <strong className="text-white font-medium">{colorChosen.name}</strong>
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Cliquez sur une couleur pour modifier la teinte carrosserie attribuée au dossier client :
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {availableColors.map((col) => {
                const isSelected = colorChosen.id === col.id;
                const isOriginal = reservation.colorChosen.id === col.id;

                return (
                  <button
                    key={col.id}
                    type="button"
                    disabled={isLocked}
                    onClick={() =>
                      setColorChosen({
                        id: col.id,
                        name: col.name,
                        hexCode: col.hexCode,
                      })
                    }
                    className={`relative p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    {/* Swatch circle */}
                    <div className="relative shrink-0">
                      <div
                        className="w-7 h-7 rounded-full border-2 shadow-inner"
                        style={{
                          backgroundColor: col.hexCode,
                          borderColor: isSelected ? '#ef4444' : 'rgba(255,255,255,0.2)',
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className="w-4 h-4 drop-shadow-md"
                            style={{
                              color:
                                col.hexCode.toLowerCase() === '#ffffff' ||
                                col.hexCode.toLowerCase() === '#f8fafc' ||
                                col.hexCode.toLowerCase() === '#f3f4f6'
                                  ? '#000000'
                                  : '#ffffff',
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Color Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold text-white truncate">{col.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Stock: <span className="text-slate-200 font-bold">{col.stock}</span>
                        </span>
                        {isOriginal && (
                          <span className="text-[9px] px-1 py-0.2 bg-blue-950 text-blue-300 rounded border border-blue-500/30">
                            Actuelle
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional Interior Colors */}
            {currentCar?.interiorColors && currentCar.interiorColors.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 mt-2 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Finition & Sellerie Intérieure</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currentCar.interiorColors.map((inCol) => {
                    const isSelected = interiorColorChosen?.id === inCol.id;
                    return (
                      <button
                        key={inCol.id}
                        type="button"
                        disabled={isLocked}
                        onClick={() =>
                          setInteriorColorChosen({
                            id: inCol.id,
                            name: inCol.name,
                            hexCode: inCol.hexCode,
                          })
                        }
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500/40'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: inCol.hexCode }}
                        />
                        <span className="text-xs text-white truncate font-medium">{inCol.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Client Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Type de Client :</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setClientType('personne_physique')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  clientType === 'personne_physique'
                    ? 'bg-red-600 text-white border-red-500 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <User className="w-4 h-4" />
                <span>Personne Physique</span>
              </button>

              <button
                type="button"
                disabled={isLocked}
                onClick={() => setClientType('societe')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  clientType === 'societe'
                    ? 'bg-red-600 text-white border-red-500 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <Building className="w-4 h-4" />
                <span>Société / Personne Morale</span>
              </button>
            </div>
          </div>

          {/* Client Details Section */}
          {clientType === 'personne_physique' ? (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Informations Client Particulier
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">N° CIN *</label>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    disabled={isLocked}
                    value={telPhysique}
                    onChange={(e) => setTelPhysique(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gouvernorat / Ville</label>
                  <select
                    disabled={isLocked}
                    value={villePhysique}
                    onChange={(e) => setVillePhysique(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  >
                    {TUNISIA_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    disabled={isLocked}
                    value={emailPhysique}
                    onChange={(e) => setEmailPhysique(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Informations Société / Personne Morale
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Raison Sociale *</label>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={raisonSociale}
                    onChange={(e) => setRaisonSociale(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Matricule Fiscale *</label>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={matriculeFiscale}
                    onChange={(e) => setMatriculeFiscale(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nom du Gérant *</label>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={gerantNomPrenom}
                    onChange={(e) => setGerantNomPrenom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">CIN du Gérant *</label>
                  <input
                    type="text"
                    required
                    disabled={isLocked}
                    value={gerantCin}
                    onChange={(e) => setGerantCin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    disabled={isLocked}
                    value={telSociete}
                    onChange={(e) => setTelSociete(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gouvernorat / Ville</label>
                  <select
                    disabled={isLocked}
                    value={villeSociete}
                    onChange={(e) => setVilleSociete(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                  >
                    {TUNISIA_GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Payment & Financials */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Financement & Acompte
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mode de Règlement :</label>
                <select
                  disabled={isLocked}
                  value={paymentMethod}
                  onChange={(e) => handlePaymentMethodChange(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                >
                  <option value="Chèque Certifié">Chèque Certifié</option>
                  <option value="Virement Bancaire">Virement Bancaire</option>
                  <option value="Leasing">Dossier Leasing</option>
                  <option value="Espèces">Espèces</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-medium">
                    Acompte Versé (TND) {!isLeasing && <span className="text-red-400">*</span>}
                  </label>
                  {isLeasing && (
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                      Acompte désactivé (Leasing)
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  disabled={isLocked || isLeasing}
                  required={!isLeasing}
                  step="500"
                  value={depositPaidTND}
                  onChange={(e) => setDepositPaidTND(Number(e.target.value))}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-red-500 ${
                    isLeasing
                      ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-900 border-slate-800 text-amber-400'
                  } disabled:opacity-60`}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {isLeasing
                    ? 'Acompte désactivé automatiquement pour dossier leasing (Particulier & Société).'
                    : `Prix Total: ${reservation.priceTND.toLocaleString()} TND TTC.`}
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Statut Réservation :</label>
                <select
                  disabled={isLocked}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                >
                  <option value="En attente">En attente</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date Arrivage (ETA) :</span>
                </label>
                <input
                  type="date"
                  disabled={isLocked}
                  value={etaDate}
                  onChange={(e) => handleEtaChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-emerald-400 font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Date de Livraison Estimée (ETA + 30 jours) :</span>
                </label>
                <input
                  type="date"
                  disabled={isLocked}
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
                />
                <p className="text-[10px] text-emerald-400/80 mt-1">
                  Délai de sécurité de 30 jours ajouté après la date ETA pour formalités, dédouanement et préparation.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 text-xs">Remarques & Notes Internes :</label>
              <textarea
                rows={2}
                disabled={isLocked}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Précisions de livraison, accord leasing, observations..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60 resize-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLocked}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les Modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
