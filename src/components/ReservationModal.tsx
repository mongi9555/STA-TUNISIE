import React, { useState, useEffect } from 'react';
import {
  CarModel,
  CarColor,
  CommercialUser,
  ClientType,
  PersonnePhysiqueInfo,
  SocieteInfo,
  UploadedDocument,
  Reservation,
  TUNISIA_GOVERNORATES,
  StockRequest,
} from '../types';
import { getFixedDepositForCar, getRegistrationFeeForCar, getFullCarPrice, calculateDeliveryDate } from '../data/cheryData';
import { compressImageDataUrl } from '../utils/imageCompressor';
import {
  X,
  Car,
  User,
  Building,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  DollarSign,
  Palette,
  File,
  Image as ImageIcon,
  ChevronRight,
  Printer,
  Sparkles,
  Send,
  Clock,
  Calendar,
} from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: CarModel[];
  preselectedCar?: CarModel | null;
  preselectedColor?: CarColor | null;
  currentCommercial: CommercialUser;
  reservations?: Reservation[];
  stockRequests?: StockRequest[];
  onRequestStockQuota?: (carId: string, carName: string, requestedQuantity: number, reason?: string) => void;
  onSaveReservation: (newReservation: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  cars,
  preselectedCar,
  preselectedColor,
  currentCommercial,
  reservations = [],
  stockRequests = [],
  onRequestStockQuota,
  onSaveReservation,
}) => {
  // Step 1: Vehicle & Color Selection
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [selectedInteriorColorId, setSelectedInteriorColorId] = useState<string>('');

  // Stock / Quota Request Form State
  const [requestQty, setRequestQty] = useState<number>(5);
  const [requestReason, setRequestReason] = useState<string>('');
  const [showStockRequestForm, setShowStockRequestForm] = useState<boolean>(false);
  const [requestSuccessMessage, setRequestSuccessMessage] = useState<string | null>(null);

  // Step 2: Client Type & Form Fields
  const [clientType, setClientType] = useState<ClientType>('personne_physique');

  // Personne Physique fields
  const [physiqueNom, setPhysiqueNom] = useState('');
  const [physiquePrenom, setPhysiquePrenom] = useState('');
  const [physiqueCin, setPhysiqueCin] = useState('');
  const [physiqueVille, setPhysiqueVille] = useState('Tunis');
  const [physiqueTel, setPhysiqueTel] = useState('');
  const [physiqueEmail, setPhysiqueEmail] = useState('');
  const [physiqueAdresse, setPhysiqueAdresse] = useState('');

  // Société fields
  const [societeRaison, setSocieteRaison] = useState('');
  const [societeMatriculeFiscale, setSocieteMatriculeFiscale] = useState('');
  const [societeGerantNomPrenom, setSocieteGerantNomPrenom] = useState('');
  const [societeGerantCin, setSocieteGerantCin] = useState('');
  const [societeVille, setSocieteVille] = useState('Tunis');
  const [societeTel, setSocieteTel] = useState('');
  const [societeEmail, setSocieteEmail] = useState('');
  const [societeAdresse, setSocieteAdresse] = useState('');
  const [societeRegistreCommerce, setSocieteRegistreCommerce] = useState('');

  // Step 3: Documents Uploaded
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [docCategory, setDocCategory] = useState<UploadedDocument['category']>('cin_recto');

  // Step 4: Financials & Deposit & Delivery Dates
  const [registrationFee, setRegistrationFee] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(20000);
  const [paymentMethod, setPaymentMethod] = useState<'Espèces' | 'Chèque Certifié' | 'Virement Bancaire' | 'Leasing'>('Chèque Certifié');
  const [etaDate, setEtaDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(() => calculateDeliveryDate(new Date().toISOString().slice(0, 10), 30));
  const [notes, setNotes] = useState('');

  // Auto calculate delivery date when ETA changes
  const handleEtaDateChange = (newEta: string) => {
    setEtaDate(newEta);
    setExpectedDeliveryDate(calculateDeliveryDate(newEta, 30));
  };

  const isLeasing = paymentMethod === 'Leasing';

  // Handle payment method or client type changes affecting leasing deposit
  const handleClientTypeChange = (type: ClientType) => {
    setClientType(type);
    if (paymentMethod === 'Leasing') {
      setDepositAmount(0);
    } else if (depositAmount === 0 && currentCar) {
      setDepositAmount(getFixedDepositForCar(currentCar));
    }
  };

  const handlePaymentMethodChange = (method: 'Espèces' | 'Chèque Certifié' | 'Virement Bancaire' | 'Leasing') => {
    setPaymentMethod(method);
    if (method === 'Leasing') {
      setDepositAmount(0);
    } else if (depositAmount === 0 && currentCar) {
      setDepositAmount(getFixedDepositForCar(currentCar));
    }
  };

  // Form Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize selected car & color on open or props change
  useEffect(() => {
    let car = preselectedCar || cars[0];
    if (preselectedCar) {
      setSelectedCarId(preselectedCar.id);
      if (preselectedColor) {
        setSelectedColorId(preselectedColor.id);
      } else if (preselectedCar.colors.length > 0) {
        const availableCol = preselectedCar.colors.find((c) => c.stock > 0) || preselectedCar.colors[0];
        setSelectedColorId(availableCol.id);
      }
    } else if (cars.length > 0) {
      setSelectedCarId(cars[0].id);
      const availableCol = cars[0].colors.find((c) => c.stock > 0) || cars[0].colors[0];
      setSelectedColorId(availableCol?.id || '');
    }

    if (car) {
      if (car.interiorColors && car.interiorColors.length > 0) {
        setSelectedInteriorColorId(car.interiorColors[0].id);
      }
      setDepositAmount(getFixedDepositForCar(car));
      setRegistrationFee(getRegistrationFeeForCar(car));
    }
  }, [preselectedCar, preselectedColor, cars, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCar = cars.find((c) => c.id === selectedCarId) || cars[0];
  const currentColor = currentCar?.colors.find((c) => c.id === selectedColorId) || currentCar?.colors[0];
  const currentInteriorColor = currentCar?.interiorColors?.find((c) => c.id === selectedInteriorColorId) || currentCar?.interiorColors?.[0];

  // Handle file uploads (Base64 reader + API upload)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawDataUrl = reader.result as string;
        const compressedDataUrl = file.type.startsWith('image/')
          ? await compressImageDataUrl(rawDataUrl, 1200, 1200, 0.8)
          : rawDataUrl;

        let finalUrl = compressedDataUrl;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, fileData: compressedDataUrl })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) finalUrl = data.url;
          }
        } catch (_) {}

        const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        const newDoc: UploadedDocument = {
          id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          category: docCategory,
          fileType: file.type,
          dataUrl: finalUrl,
          sizeFormatted: sizeFormatted,
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        setDocuments((prev) => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // reset
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!currentCar) errs.car = 'Veuillez sélectionner un véhicule Chery';
    if (!currentColor || currentColor.stock === 0) errs.color = 'Cette couleur est actuellement en rupture de stock';

    if (clientType === 'personne_physique') {
      if (!physiqueNom.trim()) errs.physiqueNom = 'Le nom est obligatoire';
      if (!physiquePrenom.trim()) errs.physiquePrenom = 'Le prénom est obligatoire';
      if (!physiqueCin.trim() || physiqueCin.length < 8) errs.physiqueCin = 'N° CIN valide requis (8 chiffres)';
      if (!physiqueTel.trim()) errs.physiqueTel = 'Numéro de téléphone requis';
    } else {
      if (!societeRaison.trim()) errs.societeRaison = 'La raison sociale est obligatoire';
      if (!societeMatriculeFiscale.trim()) errs.societeMatriculeFiscale = 'La matricule fiscale est obligatoire (ex: 1234567/A/M/000)';
      if (!societeGerantNomPrenom.trim()) errs.societeGerantNomPrenom = 'Nom du gérant/représentant requis';
      if (!societeGerantCin.trim() || societeGerantCin.length < 8) errs.societeGerantCin = 'N° CIN du gérant valide requis (8 chiffres)';
      if (!societeTel.trim()) errs.societeTel = 'Numéro de téléphone requis';
    }

    if (!isLeasing && depositAmount <= 0) {
      errs.depositAmount = "L'acompte doit être supérieur à 0 TND";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !currentCar || !currentColor) return;

    const resId = `RES-2026-${Math.floor(100 + Math.random() * 900)}`;

    const hasBonCommande = documents.some(
      (d) => d.category === 'bon_commande' || d.name.toLowerCase().includes('bon de commande')
    );
    const hasAccordLeasing = documents.some(
      (d) => d.category === 'accord_leasing' || d.name.toLowerCase().includes('accord')
    );

    // Automated leasing rule evaluation:
    // Cas n°1 : Dossier avec Bon de commande leasing -> Réservation immédiatement validable / confirmée
    // Cas n°2 : Dossier avec uniquement Accord de leasing -> Réservation provisoire 5 jours ouvrés
    let autoStatus: Reservation['status'] = 'En attente';
    if (hasBonCommande) {
      autoStatus = 'Confirmée';
    }

    let leasingNote = notes;
    if (paymentMethod === 'Leasing' || hasAccordLeasing || hasBonCommande) {
      if (hasBonCommande) {
        leasingNote = (leasingNote ? leasingNote + ' | ' : '') + '⚡ Cas n°1 : Bon de commande leasing joint -> Réservation immédiatement validée.';
      } else {
        leasingNote = (leasingNote ? leasingNote + ' | ' : '') + '⏳ Cas n°2 : Accord de leasing joint -> Réservation provisoire créée pour 5 jours ouvrés.';
      }
    }

    const newReservation: Reservation = {
      id: resId,
      commercialId: currentCommercial.id,
      commercialName: currentCommercial.name,
      agency: currentCommercial.agency,
      carId: currentCar.id,
      carName: currentCar.name,
      colorChosen: {
        id: currentColor.id,
        name: currentColor.name,
        hexCode: currentColor.hexCode,
      },
      interiorColorChosen: currentInteriorColor
        ? {
            id: currentInteriorColor.id,
            name: currentInteriorColor.name,
            hexCode: currentInteriorColor.hexCode,
          }
        : undefined,
      client: {
        type: clientType,
        personnePhysique:
          clientType === 'personne_physique'
            ? {
                nom: physiqueNom,
                prenom: physiquePrenom,
                cin: physiqueCin,
                ville: physiqueVille,
                telephone: physiqueTel,
                email: physiqueEmail,
                adresse: physiqueAdresse,
              }
            : undefined,
        societe:
          clientType === 'societe'
            ? {
                raisonSociale: societeRaison,
                matriculeFiscale: societeMatriculeFiscale,
                gerantNomPrenom: societeGerantNomPrenom,
                gerantCin: societeGerantCin,
                ville: societeVille,
                telephone: societeTel,
                email: societeEmail,
                adresse: societeAdresse,
                registreCommerce: societeRegistreCommerce,
              }
            : undefined,
      },
      documents: documents,
      priceTND: currentCar.priceTND,
      registrationFeeTND: registrationFee,
      depositPaidTND: depositAmount,
      paymentMethod: paymentMethod,
      status: autoStatus,
      createdAt: new Date().toISOString(),
      etaDate: etaDate || undefined,
      expectedDeliveryDate: expectedDeliveryDate || calculateDeliveryDate(etaDate, 30),
      notes: leasingNote,
    };

    onSaveReservation(newReservation);
    onClose();
  };

  const totalPriceWithFees = (currentCar?.priceTND || 0) + registrationFee;
  const remainingToPay = totalPriceWithFees - depositAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Nouveau Bon de Réservation
                <span className="text-xs font-mono font-normal bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  Session: {currentCommercial.name}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Chery Tunisie • Saisie des coordonnées client et documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 flex-1">
          {/* SECTION 1: VEHICLE & COLOR SELECTION */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-red-500" />
                <span>1. Véhicule & Teinte Sélectionnée</span>
              </h4>
              {errors.car && <span className="text-xs text-red-400 font-medium">{errors.car}</span>}
              {errors.color && <span className="text-xs text-red-400 font-medium">{errors.color}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Choose Car Model */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Modèle de Véhicule Chery :
                </label>
                <select
                  value={selectedCarId}
                  onChange={(e) => {
                    setSelectedCarId(e.target.value);
                    const newC = cars.find((c) => c.id === e.target.value);
                    if (newC) {
                      if (newC.colors.length > 0) {
                        const avail = newC.colors.find((col) => col.stock > 0) || newC.colors[0];
                        setSelectedColorId(avail.id);
                      }
                      if (newC.interiorColors && newC.interiorColors.length > 0) {
                        setSelectedInteriorColorId(newC.interiorColors[0].id);
                      }
                      setDepositAmount(getFixedDepositForCar(newC));
                      setRegistrationFee(getRegistrationFeeForCar(newC));
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                >
                  {cars.map((car) => {
                    const carTotalStock = car.colors.reduce((acc, c) => acc + c.stock, 0);
                    return (
                      <option key={car.id} value={car.id}>
                        {car.name} — {car.priceTND.toLocaleString()} TND ({carTotalStock} en stock)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Choose Color with Stock Display */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Teinte Extérieure & Stock par Couleur :
                </label>
                {currentCar ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {currentCar.colors.map((color) => {
                      const isSelected = selectedColorId === color.id;
                      const isOutOfStock = color.stock === 0;

                      return (
                        <button
                          type="button"
                          key={color.id}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedColorId(color.id)}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'border-red-500 bg-red-950/40 ring-2 ring-red-500/30'
                              : isOutOfStock
                              ? 'border-slate-800/60 bg-slate-900/40 text-slate-500 opacity-60 cursor-not-allowed'
                              : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-200'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-slate-600 shrink-0 relative"
                            style={{ backgroundColor: color.hexCode }}
                          >
                            {color.hexCode.toUpperCase() === '#FFFFFF' && (
                              <span className="absolute inset-0 rounded-full border border-slate-400/40" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold truncate leading-tight">{color.name}</p>
                            <p className="text-[10px] font-mono text-slate-400">
                              {color.hexCode} • {isOutOfStock ? 'Épuisé' : `${color.stock} dispo`}
                            </p>
                            <p className="text-xs text-amber-300 font-bold truncate mt-0.5">
                              Intérieur: {color.interiorColor || 'Noir'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Sélectionnez d'abord un modèle</p>
                )}
              </div>

              {/* Choose Interior Color */}
              <div className="md:col-span-2 pt-2 border-t border-slate-900">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Couleur Intérieure & Habillage Sellerie :</span>
                  {currentInteriorColor && (
                    <span className="text-[11px] font-normal text-amber-400">
                      Sélectionné: {currentInteriorColor.name}
                    </span>
                  )}
                </label>
                {currentCar && currentCar.interiorColors && currentCar.interiorColors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {currentCar.interiorColors.map((intColor) => {
                      const isSelected = selectedInteriorColorId === intColor.id || (!selectedInteriorColorId && currentCar.interiorColors?.[0].id === intColor.id);

                      return (
                        <button
                          type="button"
                          key={intColor.id}
                          onClick={() => setSelectedInteriorColorId(intColor.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/20 text-white'
                              : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-md border border-slate-600 shrink-0 shadow-inner relative"
                            style={{ backgroundColor: intColor.hexCode }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold truncate leading-tight">{intColor.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Habillage Officiel Chery</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Habillage intérieur de série standard</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: CLIENT TYPE SELECTOR & DYNAMIC FORM */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-red-500" />
                  <span>2. Type de Client & Coordonnées</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Choisissez la catégorie du souscripteur (Personne Physique ou Société)
                </p>
              </div>

              {/* Client Type Dropdown Selector */}
              <div className="flex items-center gap-2 bg-slate-900 p-1 border border-slate-800 rounded-xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleClientTypeChange('personne_physique');
                    setDocCategory('cin_recto');
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    clientType === 'personne_physique'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Personne Physique</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClientTypeChange('societe');
                    setDocCategory('matricule_fiscale');
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    clientType === 'societe'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Personne Morale (Société)</span>
                </button>
              </div>
            </div>

            {/* PERSONNE PHYSIQUE FORM */}
            {clientType === 'personne_physique' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Ben Ammar"
                    value={physiqueNom}
                    onChange={(e) => setPhysiqueNom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.physiqueNom && <p className="text-[11px] text-red-400 mt-1">{errors.physiqueNom}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Prénom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mohamed Anouar"
                    value={physiquePrenom}
                    onChange={(e) => setPhysiquePrenom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.physiquePrenom && <p className="text-[11px] text-red-400 mt-1">{errors.physiquePrenom}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Carte d'Identité CIN (8 chiffres) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    required
                    placeholder="ex: 08765432"
                    value={physiqueCin}
                    onChange={(e) => setPhysiqueCin(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.physiqueCin && <p className="text-[11px] text-red-400 mt-1">{errors.physiqueCin}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gouvernorat / Ville :</label>
                  <select
                    value={physiqueVille}
                    onChange={(e) => setPhysiqueVille(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    {TUNISIA_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Numéro de Téléphone (+216) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="ex: +216 22 100 200"
                    value={physiqueTel}
                    onChange={(e) => setPhysiqueTel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.physiqueTel && <p className="text-[11px] text-red-400 mt-1">{errors.physiqueTel}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Email :</label>
                  <input
                    type="email"
                    placeholder="ex: client@gmail.com"
                    value={physiqueEmail}
                    onChange={(e) => setPhysiqueEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Physique Complète :</label>
                  <input
                    type="text"
                    placeholder="ex: Rue les Jardins, Résidence Ennasr 2, Tunis"
                    value={physiqueAdresse}
                    onChange={(e) => setPhysiqueAdresse(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            {/* SOCIETE FORM */}
            {clientType === 'societe' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Raison Sociale de la Société <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: STE MEDITERRANEENNE DE SERVICES SARL"
                    value={societeRaison}
                    onChange={(e) => setSocieteRaison(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.societeRaison && <p className="text-[11px] text-red-400 mt-1">{errors.societeRaison}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Matricule Fiscale (M.F.) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 1234567/A/M/000"
                    value={societeMatriculeFiscale}
                    onChange={(e) => setSocieteMatriculeFiscale(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.societeMatriculeFiscale && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.societeMatriculeFiscale}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom & Prénom du Gérant / Représentant <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Hassan Gharbi"
                    value={societeGerantNomPrenom}
                    onChange={(e) => setSocieteGerantNomPrenom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.societeGerantNomPrenom && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.societeGerantNomPrenom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CIN du Gérant (8 chiffres) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    required
                    placeholder="ex: 05432109"
                    value={societeGerantCin}
                    onChange={(e) => setSocieteGerantCin(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.societeGerantCin && <p className="text-[11px] text-red-400 mt-1">{errors.societeGerantCin}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registre de Commerce / RNE :
                  </label>
                  <input
                    type="text"
                    placeholder="ex: RNE-TN-2022-B1002"
                    value={societeRegistreCommerce}
                    onChange={(e) => setSocieteRegistreCommerce(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gouvernorat :</label>
                  <select
                    value={societeVille}
                    onChange={(e) => setSocieteVille(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    {TUNISIA_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Téléphone Société <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="ex: +216 71 800 900"
                    value={societeTel}
                    onChange={(e) => setSocieteTel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.societeTel && <p className="text-[11px] text-red-400 mt-1">{errors.societeTel}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Professionnel :</label>
                  <input
                    type="email"
                    placeholder="ex: direction@societe.tn"
                    value={societeEmail}
                    onChange={(e) => setSocieteEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Siège Social :</label>
                  <input
                    type="text"
                    placeholder="ex: Zone Industrielle Akouda, Sousse"
                    value={societeAdresse}
                    onChange={(e) => setSocieteAdresse(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: UPLOAD DES DOCUMENTS ET IMAGES */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-red-500" />
                  <span>
                    3. Case d'Upload des Documents & Photos du Client{' '}
                    <span className="text-red-400 font-medium">
                      ({clientType === 'personne_physique' ? 'Dossier Personne Physique' : 'Dossier Personne Morale / Société'})
                    </span>
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  {clientType === 'personne_physique'
                    ? "Joignez les pièces justificatives spécifiques pour particulier (CIN Recto/Verso, Permis, Quittance/Chèque d'acompte, etc.)"
                    : "Joignez les pièces légales et fiscales de la société (Patente / Matricule Fiscale, Extrait RNE, CIN Gérant, etc.)"}
                </p>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 flex items-center gap-1.5 ${
                  clientType === 'personne_physique'
                    ? 'bg-blue-950/40 text-blue-300 border-blue-800/60'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                }`}
              >
                {clientType === 'personne_physique' ? <User className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                <span>{clientType === 'personne_physique' ? 'Documents Particulier' : 'Documents Société'}</span>
              </span>
            </div>

            {/* Checklist Guide Badges of Required/Provided Documents */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {clientType === 'personne_physique' ? (
                <>
                  <div
                    onClick={() => setDocCategory('cin_recto')}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => d.category === 'cin_recto')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">🪪 CIN Recto</span>
                      {documents.some((d) => d.category === 'cin_recto') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[9px] text-red-400 font-bold">Requis</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'cin_recto') ? 'Pièce fournie' : 'En attente'}
                    </span>
                  </div>

                  <div
                    onClick={() => setDocCategory('cin_verso')}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => d.category === 'cin_verso')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">🪪 CIN Verso</span>
                      {documents.some((d) => d.category === 'cin_verso') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[9px] text-red-400 font-bold">Requis</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'cin_verso') ? 'Pièce fournie' : 'En attente'}
                    </span>
                  </div>

                  <div
                    onClick={() => setDocCategory('permis_conduire')}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => d.category === 'permis_conduire')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">🚗 Permis</span>
                      {documents.some((d) => d.category === 'permis_conduire') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[9px] text-slate-500">Optionnel</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'permis_conduire') ? 'Pièce fournie' : 'À ajouter'}
                    </span>
                  </div>

                  <div
                    onClick={() => setDocCategory('quittance_acompte')}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => ['quittance_acompte', 'cheque_reservation', 'virement_bancaire'].includes(d.category))
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">🧾 Acompte</span>
                      {documents.some((d) => ['quittance_acompte', 'cheque_reservation', 'virement_bancaire'].includes(d.category)) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[9px] text-amber-400 font-bold">Recommandé</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => ['quittance_acompte', 'cheque_reservation', 'virement_bancaire'].includes(d.category)) ? 'Fourni' : 'Reçu / Chèque'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => setDocCategory('matricule_fiscale')}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => d.category === 'matricule_fiscale')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">📄 Patente / M.F.</span>
                      {documents.some((d) => d.category === 'matricule_fiscale') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-red-400 font-bold shrink-0">Requis</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'matricule_fiscale') ? 'Pièce fournie' : 'En attente'}
                    </span>
                  </div>

                  <div
                    onClick={() => setDocCategory('registre_commerce')}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => d.category === 'registre_commerce')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">🏢 Extrait RNE</span>
                      {documents.some((d) => d.category === 'registre_commerce') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-red-400 font-bold shrink-0">Requis</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'registre_commerce') ? 'Pièce fournie' : 'En attente'}
                    </span>
                  </div>

                  <div
                    onClick={() => setDocCategory('cin_recto')}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => ['cin_recto', 'cin_verso'].includes(d.category))
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">🪪 CIN Gérant</span>
                      {documents.some((d) => ['cin_recto', 'cin_verso'].includes(d.category)) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-red-400 font-bold shrink-0">Requis</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => ['cin_recto', 'cin_verso'].includes(d.category)) ? 'Pièce fournie' : 'En attente'}
                    </span>
                  </div>

                  <div
                    onClick={() => setDocCategory('bon_commande')}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => ['bon_commande', 'quittance_acompte', 'cheque_reservation', 'accord_leasing'].includes(d.category))
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">📄 Bon Commande / Chèque</span>
                      {documents.some((d) => ['bon_commande', 'quittance_acompte', 'cheque_reservation', 'accord_leasing'].includes(d.category)) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-amber-400 font-bold shrink-0">Recommandé</span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => ['bon_commande', 'quittance_acompte', 'cheque_reservation', 'accord_leasing'].includes(d.category)) ? 'Fourni' : 'À joindre'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Upload Selector Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catégorie du document à ajouter :
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                >
                  {clientType === 'personne_physique' ? (
                    <>
                      <option value="cin_recto">🪪 CIN Client (Face Recto)</option>
                      <option value="cin_verso">🪪 CIN Client (Face Verso)</option>
                      <option value="permis_conduire">🚗 Permis de Conduire Client</option>
                      <option value="quittance_acompte">🧾 Reçu d'acompte / Quittance de Paiement</option>
                      <option value="cheque_reservation">💳 Copie du Chèque de Réservation</option>
                      <option value="virement_bancaire">🏛️ Attestation / Ordre de Virement Bancaire</option>
                      <option value="accord_leasing">💼 Accord / Dossier Leasing Particulier</option>
                      <option value="bon_commande">📄 Bon de Commande Particulier</option>
                      <option value="autre">📎 Autre pièce justificative (Particulier)</option>
                    </>
                  ) : (
                    <>
                      <option value="matricule_fiscale">📄 Patente / Matricule Fiscale (Société)</option>
                      <option value="registre_commerce">🏢 Extrait RNE / Registre National des Entreprises</option>
                      <option value="cin_recto">🪪 CIN Gérant / Représentant Légal (Face Recto)</option>
                      <option value="cin_verso">🪪 CIN Gérant / Représentant Légal (Face Verso)</option>
                      <option value="permis_conduire">🚗 Permis de Conduire Conducteur / Mandataire</option>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sélectionner ou glisser le fichier :</label>
                <label className="flex items-center justify-center gap-3 p-3 bg-slate-900 border-2 border-dashed border-slate-700 hover:border-red-500/60 rounded-xl cursor-pointer transition-colors text-xs text-slate-300">
                  <Upload className="w-5 h-5 text-red-400 shrink-0" />
                  <span>
                    <strong className="text-white">Cliquez ici</strong> pour importer ou glissez votre document/image (JPG, PNG, PDF)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Document Uploaded List Preview */}
            {documents.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <p className="text-xs font-bold text-slate-300">
                  Pièces enregistrées ({documents.length}) :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {doc.fileType.startsWith('image/') ? (
                          <img
                            src={doc.dataUrl}
                            alt={doc.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="bg-slate-800 px-1.5 py-0.2 rounded font-mono text-slate-300">
                              {doc.category.toUpperCase().replace('_', ' ')}
                            </span>
                            <span>{doc.sizeFormatted}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer la pièce"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: FINANCIALS & PAYMENT DEPOSIT */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-500" />
              <span>4. Conditions Financières & Acompte de Réservation</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Prix Véhicule TTC (TND) :</label>
                <input
                  type="text"
                  disabled
                  value={`${(currentCar?.priceTND || 0).toLocaleString()} TND`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Frais Immatriculation, Carte Grise & Timbre (TND) :</label>
                <input
                  type="number"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Acompte Versé (TND) {!isLeasing && <span className="text-red-400">*</span>}
                  </label>
                  {isLeasing ? (
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                      Acompte désactivé (Dossier Leasing)
                    </span>
                  ) : currentCar && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      Acompte Fixe: {getFixedDepositForCar(currentCar).toLocaleString()} TND
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  required={!isLeasing}
                  disabled={isLeasing}
                  step="1000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    isLeasing
                      ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-900 border-slate-800 text-amber-400'
                  }`}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {isLeasing
                    ? 'Acompte fixe désactivé automatiquement pour dossier leasing (Particulier ou Société).'
                    : `Fixé automatiquement selon le modèle sélectionné (${currentCar?.name || 'Chery'}).`}
                </p>
                {errors.depositAmount && <p className="text-[11px] text-red-400 mt-1">{errors.depositAmount}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mode de Règlement Acompte :</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => handlePaymentMethodChange(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                >
                  <option value="Chèque Certifié">Chèque Certifié</option>
                  <option value="Virement Bancaire">Virement Bancaire</option>
                  <option value="Leasing">Dossier Leasing</option>
                  <option value="Espèces">Espèces</option>
                </select>
              </div>
            </div>

            {paymentMethod === 'Leasing' && (
              <div className="p-3 bg-indigo-950/60 border border-indigo-700/60 rounded-xl text-xs text-indigo-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Règles Automatisées Dossiers Leasing Chery :</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-indigo-200/90 pl-1">
                  <li>
                    <strong>Cas n°1 (Bon de Commande joint) :</strong> La réservation est immédiatement validée.
                  </li>
                  <li>
                    <strong>Cas n°2 (Accord de Leasing uniquement) :</strong> Réservation provisoire de <strong>5 jours ouvrés</strong>. Si le Bon de commande n'est pas imprimé avant expiration, notification automatique au commercial avec un <strong>délai supplémentaire de 2 jours ouvrés max</strong> avant annulation définitive.
                  </li>
                </ul>
              </div>
            )}

            {/* Financial Summary Card */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px]">Prix Véhicule TTC :</span>
                  <span className="text-slate-300 font-mono font-bold">
                    {currentCar?.priceTND.toLocaleString()} TND
                    {registrationFee > 0 ? ` (+ ${registrationFee.toLocaleString()} DT frais)` : ''}
                  </span>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <span className="text-emerald-400 block font-extrabold text-[10px] uppercase">Prix Total TTC:</span>
                  <strong className="text-emerald-400 font-mono font-bold text-sm">{totalPriceWithFees.toLocaleString()} TND</strong>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <span className="text-amber-400 block text-[10px]">Acompte Fixe Requis:</span>
                  <strong className="text-amber-300 font-mono font-bold">{depositAmount.toLocaleString()} TND</strong>
                </div>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-right w-full md:w-auto shrink-0">
                <span className="text-slate-400 block text-[10px]">Reste à payer à la livraison:</span>
                <span className="text-base font-extrabold text-red-400 font-mono">
                  {remainingToPay.toLocaleString()} TND
                </span>
              </div>
            </div>

            {/* Upload Justificatifs & Photos Financières / Acompte */}
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Upload Pièces & Justificatifs Financiers (Chèque, Reçu, Virement, Accord Leasing)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">JPG, PNG, PDF</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Type de preuve financière :</label>
                  <select
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="quittance_acompte">🧾 Reçu / Quittance d'acompte</option>
                    <option value="cheque_reservation">💳 Photo / Scan Chèque Certifié</option>
                    <option value="virement_bancaire">🏛️ Attestation Virement Bancaire</option>
                    <option value="accord_leasing">💼 Accord / Dossier Leasing</option>
                    <option value="bon_commande">📄 Bon de Commande / Autre</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Joindre l'image ou document :</label>
                  <label className="flex items-center justify-center gap-2 p-2.5 bg-slate-950 border border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-xl cursor-pointer transition-all text-xs text-slate-300 hover:text-white">
                    <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-emerald-400">Cliquez ici pour joindre une photo ou document</strong> (Chèque, Reçu d'acompte, Virement)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Financial Docs List */}
              {documents.filter((d) => ['quittance_acompte', 'cheque_reservation', 'virement_bancaire', 'accord_leasing', 'bon_commande'].includes(d.category)).length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Justificatifs Financiers enregistrés (
                    {documents.filter((d) => ['quittance_acompte', 'cheque_reservation', 'virement_bancaire', 'accord_leasing', 'bon_commande'].includes(d.category)).length}
                    ) :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {documents
                      .filter((d) => ['quittance_acompte', 'cheque_reservation', 'virement_bancaire', 'accord_leasing', 'bon_commande'].includes(d.category))
                      .map((doc) => (
                        <div
                          key={doc.id}
                          className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {doc.fileType.startsWith('image/') ? (
                              <img src={doc.dataUrl} alt={doc.name} className="w-8 h-8 object-cover rounded border border-slate-700 shrink-0" />
                            ) : (
                              <FileText className="w-7 h-7 text-emerald-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-white text-[11px] truncate">{doc.name}</p>
                              <span className="text-[9px] font-mono text-emerald-400 uppercase">{doc.category.replace('_', ' ')}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id)}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded cursor-pointer"
                            title="Supprimer la pièce"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section Délais & Date de Livraison Estimée (ETA + 30 jours) */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Délais d'Arrivage & Date de Livraison Estimée (Bon de Réservation)
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 rounded text-[10px] font-bold">
                  Marge de sécurité +30 jours
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date d'Arrivage Prévisionnel (ETA) :</span>
                  </label>
                  <input
                    type="date"
                    value={etaDate}
                    onChange={(e) => handleEtaDateChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Date estimée de débarquement au port</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Date de Livraison Estimée (ETA + 30 jours) :</span>
                  </label>
                  <input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-emerald-400/80 mt-1">
                    Calcul automatique : ETA + 30 jours pour formalités, préparation PDI et immatriculation
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Remarques / Instructions de livraison :
              </label>
              <textarea
                rows={2}
                placeholder="ex: Client souhaite la livraison à l'agence de Sousse..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider le Bon de Réservation & Déduire le Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
