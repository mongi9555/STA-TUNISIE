import React, { useState, useEffect } from 'react';
import { Reservation, TUNISIA_GOVERNORATES, ClientType, Car, CarColor, UploadedDocument, CommercialUser } from '../types';
import { calculateDeliveryDate, canUserEditEta } from '../data/cheryData';
import { compressImageDataUrl } from '../utils/imageCompressor';
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
  Upload,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Eye,
  Download,
  ExternalLink,
  File,
  Loader2,
} from 'lucide-react';

interface EditReservationModalProps {
  isOpen: boolean;
  reservation: Reservation | null;
  cars?: Car[];
  onClose: () => void;
  onSave: (updatedReservation: Reservation) => void;
  canEditValidated: boolean;
  currentCommercial?: CommercialUser;
}

export const EditReservationModal: React.FC<EditReservationModalProps> = ({
  isOpen,
  reservation,
  cars = [],
  onClose,
  onSave,
  canEditValidated,
  currentCommercial,
}) => {
  if (!isOpen || !reservation) return null;

  const currentCar = cars.find((c) => c.id === reservation.carId);
  const isSociete = reservation.client.type === 'societe';
  const isValidated = reservation.status === 'Confirmée' || reservation.status === 'Livrée';
  const isLocked = isValidated && !canEditValidated;
  const canEditEta = canUserEditEta(currentCommercial);

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
  const [telSociete, setTelSociete] = useState(reservation.client.societe?.telephone || '');
  const [emailSociete, setEmailSociete] = useState(reservation.client.societe?.email || '');
  const [villeSociete, setVilleSociete] = useState(reservation.client.societe?.ville || 'Tunis');
  const [adresseSociete, setAdresseSociete] = useState(reservation.client.societe?.adresse || '');
  const [registreCommerce, setRegistreCommerce] = useState(reservation.client.societe?.registreCommerce || '');

  // Documents & Photos State
  const [documents, setDocuments] = useState<UploadedDocument[]>(() => reservation.documents || []);
  const [docCategory, setDocCategory] = useState<UploadedDocument['category']>(() =>
    reservation.client.type === 'societe' ? 'registre_commerce' : 'cin_recto'
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);

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

  // Synchroniser l'état local quand une réservation différente est ouverte
  useEffect(() => {
    if (reservation) {
      setClientType(reservation.client.type);
      setColorChosen(reservation.colorChosen);
      setInteriorColorChosen(reservation.interiorColorChosen);
      setNom(reservation.client.personnePhysique?.nom || '');
      setPrenom(reservation.client.personnePhysique?.prenom || '');
      setCin(reservation.client.personnePhysique?.cin || '');
      setTelPhysique(reservation.client.personnePhysique?.telephone || '');
      setEmailPhysique(reservation.client.personnePhysique?.email || '');
      setVillePhysique(reservation.client.personnePhysique?.ville || 'Tunis');
      setAdressePhysique(reservation.client.personnePhysique?.adresse || '');
      setRaisonSociale(reservation.client.societe?.raisonSociale || '');
      setMatriculeFiscale(reservation.client.societe?.matriculeFiscale || '');
      setTelSociete(reservation.client.societe?.telephone || '');
      setEmailSociete(reservation.client.societe?.email || '');
      setVilleSociete(reservation.client.societe?.ville || 'Tunis');
      setAdresseSociete(reservation.client.societe?.adresse || '');
      setRegistreCommerce(reservation.client.societe?.registreCommerce || '');
      setDocuments(reservation.documents || []);
      setDocCategory(reservation.client.type === 'societe' ? 'registre_commerce' : 'cin_recto');
      setPaymentMethod(reservation.paymentMethod);
      setDepositPaidTND(reservation.depositPaidTND);
      setStatus(reservation.status);
      setEtaDate(reservation.etaDate || reservation.createdAt?.slice(0, 10) || '');
      setExpectedDeliveryDate(
        reservation.expectedDeliveryDate ||
          calculateDeliveryDate(reservation.etaDate || reservation.createdAt?.slice(0, 10) || '', 30)
      );
      setNotes(reservation.notes || '');
    }
  }, [reservation]);

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

  // Bascule type de client & ajustement catégorie document par défaut
  const handleClientTypeChange = (type: ClientType) => {
    setClientType(type);
    if (type === 'societe') {
      if (['cin_recto', 'cin_verso'].includes(docCategory)) {
        setDocCategory('registre_commerce');
      }
    } else {
      if (docCategory === 'registre_commerce') {
        setDocCategory('cin_recto');
      }
    }
  };

  // Upload and compression handler for files
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const fileList = Array.from(files);
    let processed = 0;

    fileList.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const rawDataUrl = reader.result as string;
          const compressedDataUrl = file.type.startsWith('image/')
            ? await compressImageDataUrl(rawDataUrl, 1200, 1200, 0.8)
            : rawDataUrl;

          let finalUrl = compressedDataUrl;
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileName: file.name, fileData: compressedDataUrl }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.url) finalUrl = data.url;
            }
          } catch (_) {}

          const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

          const newDoc: UploadedDocument = {
            id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            name: file.name,
            category: docCategory,
            fileType: file.type,
            dataUrl: finalUrl,
            sizeFormatted: sizeFormatted,
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };

          setDocuments((prev) => [...prev, newDoc]);
        } finally {
          processed++;
          if (processed >= fileList.length) {
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
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
      documents: documents,
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
                gerantNomPrenom: reservation.client.societe?.gerantNomPrenom,
                gerantCin: reservation.client.societe?.gerantCin,
                telephone: telSociete.trim(),
                email: emailSociete.trim(),
                ville: villeSociete,
                adresse: adresseSociete.trim(),
                registreCommerce: registreCommerce.trim(),
              }
            : undefined,
      },
      updatedAt: new Date().toISOString(),
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
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
                const isOutOfStock = col.stock <= 0 && !isOriginal;

                return (
                  <button
                    key={col.id}
                    type="button"
                    disabled={isLocked || isOutOfStock}
                    title={
                      isOutOfStock
                        ? `${col.name} : Rupture de stock (0 disponible)`
                        : `${col.name} : ${col.stock} disponible(s)`
                    }
                    onClick={() => {
                      if (!isOutOfStock) {
                        setColorChosen({
                          id: col.id,
                          name: col.name,
                          hexCode: col.hexCode,
                        });
                      }
                    }}
                    className={`relative p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isOutOfStock
                        ? 'bg-slate-950/70 border-slate-800/80 opacity-45 cursor-not-allowed'
                        : isSelected
                        ? 'bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500/50 cursor-pointer'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 cursor-pointer'
                    } ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
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
                        <span className={`text-[10px] font-mono ${col.stock <= 0 && !isOriginal ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                          Stock: <span className="font-bold">{col.stock > 0 ? col.stock : '0 (Rupture)'}</span>
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
          </div>

          {/* Client Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Type de Client :</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isLocked}
                onClick={() => handleClientTypeChange('personne_physique')}
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
                onClick={() => handleClientTypeChange('societe')}
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
                  <label className="block text-slate-300 font-medium mb-1">Téléphone (8 chiffres) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-slate-400 select-none">+216</span>
                    <input
                      type="tel"
                      required
                      maxLength={8}
                      disabled={isLocked}
                      placeholder="ex: 22100200"
                      value={telPhysique}
                      onChange={(e) => setTelPhysique(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-13 pr-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                    />
                  </div>
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
                  <label className="block text-slate-300 font-medium mb-1">Téléphone Société (8 chiffres) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-slate-400 select-none">+216</span>
                    <input
                      type="tel"
                      required
                      maxLength={8}
                      disabled={isLocked}
                      placeholder="ex: 71800900"
                      value={telSociete}
                      onChange={(e) => setTelSociete(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-13 pr-3 py-2 text-white font-mono focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                    />
                  </div>
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

          {/* SECTION: DOCUMENTS & PHOTOS DU DOSSIER CLIENT */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>3. Documents & Photos Justificatives du Dossier</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Consultez, ajoutez ou supprimez les pièces justificatives (CIN, RNE, chèques, reçus...)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono font-medium">
                  {documents.length} pièce{documents.length > 1 ? 's' : ''} jointe{documents.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Checklist rapide / Statut pièces indispensables */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {clientType === 'personne_physique' ? (
                <>
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setDocCategory('cin_recto')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      documents.some((d) => d.category === 'cin_recto')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">🪪 CIN Recto</span>
                      {documents.some((d) => d.category === 'cin_recto') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-red-400 font-bold shrink-0">Requis</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'cin_recto') ? 'Pièce fournie' : 'À ajouter'}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setDocCategory('cin_verso')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      documents.some((d) => d.category === 'cin_verso')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">🪪 CIN Verso</span>
                      {documents.some((d) => d.category === 'cin_verso') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-red-400 font-bold shrink-0">Requis</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'cin_verso') ? 'Pièce fournie' : 'À ajouter'}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setDocCategory('quittance_acompte')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      documents.some((d) =>
                        ['quittance_acompte', 'cheque_reservation', 'virement_bancaire'].includes(d.category)
                      )
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">🧾 Acompte</span>
                      {documents.some((d) =>
                        ['quittance_acompte', 'cheque_reservation', 'virement_bancaire'].includes(d.category)
                      ) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-amber-400 font-bold shrink-0">Recommandé</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80 truncate">
                      {documents.some((d) =>
                        ['quittance_acompte', 'cheque_reservation', 'virement_bancaire'].includes(d.category)
                      )
                        ? 'Fourni'
                        : 'Reçu / Chèque'}
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setDocCategory('registre_commerce')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all sm:col-span-2 ${
                      documents.some((d) => d.category === 'registre_commerce')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">🏢 Extrait RNE (Registre National des Entreprises)</span>
                      {documents.some((d) => d.category === 'registre_commerce') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-red-400 font-bold shrink-0">Requis</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'registre_commerce') ? 'Pièce fournie' : 'En attente'}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setDocCategory('bon_commande')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all sm:col-span-2 ${
                      documents.some((d) =>
                        ['bon_commande', 'quittance_acompte', 'cheque_reservation', 'accord_leasing'].includes(d.category)
                      )
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    } ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">📄 Bon Commande / Chèque / Acompte</span>
                      {documents.some((d) =>
                        ['bon_commande', 'quittance_acompte', 'cheque_reservation', 'accord_leasing'].includes(d.category)
                      ) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-amber-400 font-bold shrink-0">Recommandé</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) =>
                        ['bon_commande', 'quittance_acompte', 'cheque_reservation', 'accord_leasing'].includes(d.category)
                      )
                        ? 'Fourni'
                        : 'À joindre'}
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Upload Selector Box */}
            {!isLocked && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Catégorie du document à ajouter :
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium cursor-pointer"
                  >
                    {clientType === 'personne_physique' ? (
                      <>
                        <option value="cin_recto">🪪 CIN Client (Face Recto)</option>
                        <option value="cin_verso">🪪 CIN Client (Face Verso)</option>
                        <option value="quittance_acompte">🧾 Reçu d'acompte / Quittance de Paiement</option>
                        <option value="cheque_reservation">💳 Copie du Chèque de Réservation</option>
                        <option value="virement_bancaire">🏛️ Attestation / Ordre de Virement Bancaire</option>
                        <option value="accord_leasing">💼 Accord / Dossier Leasing Particulier</option>
                        <option value="bon_commande">📄 Bon de Commande Particulier</option>
                        <option value="autre">📎 Autre pièce justificative (Particulier)</option>
                      </>
                    ) : (
                      <>
                        <option value="registre_commerce">🏢 Extrait RNE / Registre National des Entreprises</option>
                        <option value="quittance_acompte">🧾 Reçu d'acompte / Quittance Société</option>
                        <option value="cheque_reservation">💳 Copie du Chèque Société</option>
                        <option value="virement_bancaire">🏛️ Attestation / Ordre de Virement Entreprise</option>
                        <option value="accord_leasing">💼 Dossier / Accord de Leasing Entreprise</option>
                        <option value="bon_commande">📄 Bon de Commande Officiel Société</option>
                        <option value="autre">📎 Autre document Société</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Drag & Drop File Case */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sélectionner ou glisser le fichier (Image / PDF) :
                  </label>
                  <label className="flex items-center justify-center gap-3 p-3 bg-slate-900 border-2 border-dashed border-slate-700 hover:border-red-500/60 rounded-xl cursor-pointer transition-colors text-xs text-slate-300">
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 text-red-400 animate-spin shrink-0" />
                    ) : (
                      <Upload className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span>
                      {isUploading ? (
                        <strong className="text-red-400">Traitement et compression en cours...</strong>
                      ) : (
                        <>
                          <strong className="text-white">Cliquez ici</strong> pour importer ou glissez votre document/photo (JPG, PNG, PDF)
                        </>
                      )}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Document Uploaded List Preview */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                  <span>Pièces enregistrées ({documents.length})</span>
                </p>
                {documents.length > 0 && !isLocked && (
                  <span className="text-[11px] text-slate-500">
                    Cliquez sur une miniature pour zoomer ou sur la corbeille pour supprimer
                  </span>
                )}
              </div>

              {documents.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-1.5 opacity-60" />
                  <p className="text-xs text-slate-400 font-medium">Aucun document joint pour le moment</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Utilisez le sélecteur ci-dessus pour ajouter des photos de la CIN, RNE, chèques ou permis de conduire.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {documents.map((doc) => {
                    const isImg = doc.fileType?.startsWith('image/') || doc.dataUrl?.startsWith('data:image/');
                    return (
                      <div
                        key={doc.id}
                        className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-2.5 transition-all group"
                      >
                        <div
                          onClick={() => setPreviewDoc(doc)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                          title="Cliquer pour afficher la pièce"
                        >
                          {isImg ? (
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-700 shrink-0 group-hover:border-red-500/50 transition-colors">
                              <img
                                src={doc.dataUrl}
                                alt={doc.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                              {doc.name}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono font-medium">
                                {doc.category.toUpperCase().replace(/_/g, ' ')}
                              </span>
                              <span>{doc.sizeFormatted}</span>
                            </div>
                            {doc.uploadedAt && (
                              <p className="text-[9px] text-slate-500 font-mono mt-0.5">{doc.uploadedAt}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Agrandir / Visualiser"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isLocked && (
                            <button
                              type="button"
                              onClick={() => removeDocument(doc.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer cette pièce"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date Arrivage (ETA) :</span>
                  </label>
                  {canEditEta ? (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Admin Autorisé
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      🔒 Admin uniquement
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  disabled={isLocked || !canEditEta}
                  value={etaDate}
                  onChange={(e) => handleEtaChange(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60 ${
                    canEditEta && !isLocked
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-slate-900/50 border-slate-800/80 cursor-not-allowed text-slate-400'
                  }`}
                />
                {!canEditEta && (
                  <p className="text-[10px] text-amber-400/90 mt-1">
                    Droit d'accès réservé aux Administrateurs (ex: Sami Chaker, Lamine Abbasi).
                  </p>
                )}
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

      {/* Lightbox / Preview Document Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-red-500 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{previewDoc.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300 text-[10px]">
                      {previewDoc.category.toUpperCase().replace(/_/g, ' ')}
                    </span>
                    <span>{previewDoc.sizeFormatted}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.dataUrl}
                  download={previewDoc.name}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-slate-950/70 min-h-[300px]">
              {previewDoc.fileType?.startsWith('image/') || previewDoc.dataUrl?.startsWith('data:image/') ? (
                <img
                  src={previewDoc.dataUrl}
                  alt={previewDoc.name}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-red-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white mb-2">{previewDoc.name}</p>
                  <p className="text-xs text-slate-400 mb-4">
                    Ce document ({previewDoc.fileType || 'PDF/Fichier'}) peut être téléchargé ou ouvert directement.
                  </p>
                  <a
                    href={previewDoc.dataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors shadow"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ouvrir dans un nouvel onglet</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
