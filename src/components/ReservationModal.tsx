import React, { useState, useEffect } from 'react';
import {
  CarModel,
  CarColor,
  CommercialUser,
  ClientType,
  UploadedDocument,
  Reservation,
  ReservationVehicleItem,
  TUNISIA_GOVERNORATES,
  StockRequest,
} from '../types';
import {
  getFixedDepositForCar,
  calculateDeliveryDate,
  canUserEditEta,
  generateChronologicalReservationId,
} from '../data/cheryData';
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
  Plus,
  Minus,
  Check,
  Clock,
  Calendar,
  Sparkles,
  Lock,
  Image as ImageIcon,
} from 'lucide-react';

// Helper to pick the default standard color for a car: prioritizes White (White BW, Blanc Nacré, Blanc Okavango, etc.) as standard, otherwise first available color.
export const getStandardWhiteColor = (car?: CarModel, fallbackColor?: CarColor | null): CarColor | undefined => {
  if (!car || !car.colors || car.colors.length === 0) return undefined;

  // 1. Look for White / Blanc color first
  const whiteColor = car.colors.find((c) => {
    const name = c.name.toLowerCase();
    const id = c.id.toLowerCase();
    return (
      name.includes('white') ||
      name.includes('blanc') ||
      id.includes('white') ||
      id.includes('blanc') ||
      c.hexCode.toUpperCase() === '#FFFFFF' ||
      c.hexCode.toUpperCase() === '#F8FAFC'
    );
  });

  if (whiteColor) {
    return whiteColor;
  }

  // 2. If fallbackColor provided and exists
  if (fallbackColor && car.colors.some((c) => c.id === fallbackColor.id)) {
    return fallbackColor;
  }

  // 3. First in-stock or first color
  return car.colors.find((c) => c.stock > 0) || car.colors[0];
};

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
  // Step 1: Multi-Vehicle Selection State
  const [selectedVehicles, setSelectedVehicles] = useState<ReservationVehicleItem[]>([]);

  // Controls for adding a vehicle
  const [addCarId, setAddCarId] = useState<string>('');
  const [addColorId, setAddColorId] = useState<string>('');
  const [addQuantity, setAddQuantity] = useState<number>(1);

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
  const [societeVille, setSocieteVille] = useState('Tunis');
  const [societeTel, setSocieteTel] = useState('');
  const [societeEmail, setSocieteEmail] = useState('');
  const [societeAdresse, setSocieteAdresse] = useState('');
  const [societeRegistreCommerce, setSocieteRegistreCommerce] = useState('');

  // Step 3: Documents Uploaded (Permis removed!)
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [docCategory, setDocCategory] = useState<UploadedDocument['category']>('cin_recto');

  // Step 4: Financials & Payment Deposit & Dates
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Espèces' | 'Chèque Certifié' | 'Virement Bancaire' | 'Leasing'>(
    'Chèque Certifié'
  );
  const [etaDate, setEtaDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(() =>
    calculateDeliveryDate(new Date().toISOString().slice(0, 10), 30)
  );
  const [notes, setNotes] = useState('');

  // Form Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Access rights for ETA
  const canEditEta = canUserEditEta(currentCommercial);

  // Function to initialize or reset the entire form state
  const resetForm = () => {
    const initialCar = preselectedCar || cars[0];
    let initialColor = getStandardWhiteColor(initialCar, preselectedColor);
    // Si la teinte blanche/standard est en rupture, basculer sur une teinte en stock
    if (initialColor && initialColor.stock <= 0 && initialCar) {
      const inStockColor = initialCar.colors.find((c) => c.stock > 0);
      if (inStockColor) {
        initialColor = inStockColor;
      }
    }

    if (initialCar && initialColor) {
      const deposit = getFixedDepositForCar(initialCar);
      setSelectedVehicles([
        {
          id: 'v-' + Date.now(),
          carId: initialCar.id,
          carName: initialCar.name,
          colorChosen: {
            id: initialColor.id,
            name: initialColor.name,
            hexCode: initialColor.hexCode,
          },
          quantity: 1,
          unitPriceTND: initialCar.priceTND,
          totalPriceTND: initialCar.priceTND,
          requiredDepositTND: deposit,
        },
      ]);
      setAddCarId(initialCar.id);
      setAddColorId(initialColor.id);
      setAddQuantity(1);
      setDepositAmount(deposit);
    } else {
      setSelectedVehicles([]);
      setAddCarId(cars[0]?.id || '');
      setAddColorId(getStandardWhiteColor(cars[0])?.id || cars[0]?.colors[0]?.id || '');
      setAddQuantity(1);
      setDepositAmount(0);
    }

    // Reset client
    setClientType('personne_physique');
    setPhysiqueNom('');
    setPhysiquePrenom('');
    setPhysiqueCin('');
    setPhysiqueVille('Tunis');
    setPhysiqueTel('');
    setPhysiqueEmail('');
    setPhysiqueAdresse('');

    // Reset societe
    setSocieteRaison('');
    setSocieteMatriculeFiscale('');
    setSocieteVille('Tunis');
    setSocieteTel('');
    setSocieteEmail('');
    setSocieteAdresse('');
    setSocieteRegistreCommerce('');

    // Reset docs
    setDocuments([]);
    setDocCategory('cin_recto');

    // Reset financials
    setPaymentMethod('Chèque Certifié');
    const today = new Date().toISOString().slice(0, 10);
    setEtaDate(today);
    setExpectedDeliveryDate(calculateDeliveryDate(today, 30));
    setNotes('');
    setErrors({});
  };

  // Reset form whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Handle ESC key to close
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

  // Active car model for the "Add Vehicle" selector
  const activeAddCar = cars.find((c) => c.id === addCarId) || cars[0];
  const activeAddColor =
    activeAddCar?.colors.find((c) => c.id === addColorId) ||
    getStandardWhiteColor(activeAddCar) ||
    activeAddCar?.colors[0];

  // Auto-update addColorId when addCarId changes - defaults standard to White or available in stock
  const handleAddCarChange = (carId: string) => {
    setAddCarId(carId);
    const targetCar = cars.find((c) => c.id === carId);
    if (targetCar && targetCar.colors.length > 0) {
      let whiteOrAvail = getStandardWhiteColor(targetCar);
      if (whiteOrAvail && whiteOrAvail.stock <= 0) {
        const inStock = targetCar.colors.find((c) => c.stock > 0);
        if (inStock) whiteOrAvail = inStock;
      }
      if (whiteOrAvail) {
        setAddColorId(whiteOrAvail.id);
      }
    }
  };

  // Add vehicle to the list (strictly constrained by stock)
  const handleAddVehicleToList = () => {
    if (!activeAddCar || !activeAddColor) return;

    if (activeAddColor.stock <= 0) {
      setErrors((prev) => ({
        ...prev,
        vehicles: `La teinte ${activeAddColor.name} est en rupture de stock (0 disponible).`,
      }));
      return;
    }

    const existingIndex = selectedVehicles.findIndex(
      (v) => v.carId === activeAddCar.id && v.colorChosen.id === activeAddColor.id
    );

    const currentQtyInList = existingIndex >= 0 ? selectedVehicles[existingIndex].quantity : 0;
    if (currentQtyInList + addQuantity > activeAddColor.stock) {
      setErrors((prev) => ({
        ...prev,
        vehicles: `Stock insuffisant pour ${activeAddCar.name} (${activeAddColor.name}) : ${activeAddColor.stock} disponible(s) au maximum (actuellement sélectionné : ${currentQtyInList}).`,
      }));
      return;
    }

    const depositPerUnit = getFixedDepositForCar(activeAddCar);

    if (existingIndex >= 0) {
      const updated = [...selectedVehicles];
      const existing = updated[existingIndex];
      const newQty = existing.quantity + addQuantity;
      updated[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalPriceTND: existing.unitPriceTND * newQty,
      };
      setSelectedVehicles(updated);
    } else {
      const newItem: ReservationVehicleItem = {
        id: 'v-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        carId: activeAddCar.id,
        carName: activeAddCar.name,
        colorChosen: {
          id: activeAddColor.id,
          name: activeAddColor.name,
          hexCode: activeAddColor.hexCode,
        },
        quantity: addQuantity,
        unitPriceTND: activeAddCar.priceTND,
        totalPriceTND: activeAddCar.priceTND * addQuantity,
        requiredDepositTND: depositPerUnit,
      };
      setSelectedVehicles([...selectedVehicles, newItem]);
    }

    // Auto-update deposit if not leasing
    if (paymentMethod !== 'Leasing') {
      const newVehiclesList =
        existingIndex >= 0
          ? selectedVehicles.map((v, i) =>
              i === existingIndex ? { ...v, quantity: v.quantity + addQuantity } : v
            )
          : [
              ...selectedVehicles,
              {
                carId: activeAddCar.id,
                quantity: addQuantity,
                unitPriceTND: activeAddCar.priceTND,
                totalPriceTND: activeAddCar.priceTND * addQuantity,
                requiredDepositTND: depositPerUnit,
              } as ReservationVehicleItem,
            ];
      const newTotalDeposit = newVehiclesList.reduce(
        (sum, v) => sum + (v.requiredDepositTND || getFixedDepositForCar(v.carName)) * v.quantity,
        0
      );
      setDepositAmount(newTotalDeposit);
    }

    setAddQuantity(1);
    setErrors((prev) => ({ ...prev, vehicles: '' }));
  };

  // Modify quantity of an item in selected vehicles strictly linked to available stock
  const handleUpdateVehicleQuantity = (index: number, delta: number) => {
    const updated = [...selectedVehicles];
    const current = updated[index];
    if (!current) return;

    const carObj = cars.find((c) => c.id === current.carId);
    const colorObj = carObj?.colors.find((c) => c.id === current.colorChosen.id);
    const maxStock = colorObj ? colorObj.stock : 999;

    if (delta > 0 && current.quantity >= maxStock) {
      return; // Stock maximal atteint
    }
    if (delta < 0 && current.quantity <= 1) {
      return; // Minimum 1
    }

    const newQty = Math.max(1, Math.min(maxStock, current.quantity + delta));
    updated[index] = {
      ...current,
      quantity: newQty,
      totalPriceTND: current.unitPriceTND * newQty,
    };
    setSelectedVehicles(updated);

    if (paymentMethod !== 'Leasing') {
      const newTotalDeposit = updated.reduce(
        (sum, v) => sum + (v.requiredDepositTND || getFixedDepositForCar(v.carName)) * v.quantity,
        0
      );
      setDepositAmount(newTotalDeposit);
    }
  };

  // Remove a vehicle item
  const handleRemoveVehicle = (index: number) => {
    if (selectedVehicles.length <= 1) return; // Keep at least one
    const updated = selectedVehicles.filter((_, i) => i !== index);
    setSelectedVehicles(updated);

    if (paymentMethod !== 'Leasing') {
      const newTotalDeposit = updated.reduce(
        (sum, v) => sum + (v.requiredDepositTND || getFixedDepositForCar(v.carName)) * v.quantity,
        0
      );
      setDepositAmount(newTotalDeposit);
    }
  };

  // Change color for a vehicle item directly on its card - dynamically linked to stock
  const handleUpdateVehicleColor = (index: number, newColor: CarColor) => {
    const updated = [...selectedVehicles];
    const target = updated[index];
    if (!target) return;

    if (newColor.stock <= 0) {
      return; // Rupture de stock
    }

    // Lié au stock disponible : si la quantité en cours dépasse le stock de la nouvelle teinte, adapter automatiquement
    const cappedQty = Math.max(1, Math.min(target.quantity, newColor.stock));

    updated[index] = {
      ...target,
      colorChosen: {
        id: newColor.id,
        name: newColor.name,
        hexCode: newColor.hexCode,
      },
      quantity: cappedQty,
      totalPriceTND: target.unitPriceTND * cappedQty,
    };
    setSelectedVehicles(updated);

    if (paymentMethod !== 'Leasing') {
      const newTotalDeposit = updated.reduce(
        (sum, v) => sum + (v.requiredDepositTND || getFixedDepositForCar(v.carName)) * v.quantity,
        0
      );
      setDepositAmount(newTotalDeposit);
    }
  };

  // Financial calculations (registration fees removed!)
  const totalVehiclesCount = selectedVehicles.reduce((sum, v) => sum + v.quantity, 0);
  const totalCarPrice = selectedVehicles.reduce((sum, v) => sum + v.totalPriceTND, 0);
  const totalCalculatedDeposit = selectedVehicles.reduce(
    (sum, v) => sum + (v.requiredDepositTND || getFixedDepositForCar(v.carName)) * v.quantity,
    0
  );

  const isLeasing = paymentMethod === 'Leasing';
  const remainingToPay = totalCarPrice - (isLeasing ? 0 : depositAmount);

  // Handle payment method change
  const handlePaymentMethodChange = (
    method: 'Espèces' | 'Chèque Certifié' | 'Virement Bancaire' | 'Leasing'
  ) => {
    setPaymentMethod(method);
    if (method === 'Leasing') {
      setDepositAmount(0);
    } else {
      setDepositAmount(totalCalculatedDeposit > 0 ? totalCalculatedDeposit : 20000);
    }
  };

  // Auto calculate delivery date when ETA changes
  const handleEtaDateChange = (newEta: string) => {
    if (!canEditEta) return;
    setEtaDate(newEta);
    setExpectedDeliveryDate(calculateDeliveryDate(newEta, 30));
  };

  // Handle file uploads (Base64 reader + compression)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawDataUrl = event.target?.result as string;
        let finalUrl = rawDataUrl;

        try {
          if (file.type.startsWith('image/')) {
            finalUrl = await compressImageDataUrl(rawDataUrl);
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

    e.target.value = '';
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (selectedVehicles.length === 0) {
      errs.vehicles = 'Veuillez sélectionner au moins un véhicule Chery';
    }

    if (clientType === 'personne_physique') {
      if (!physiqueNom.trim()) errs.physiqueNom = 'Le nom est obligatoire';
      if (!physiquePrenom.trim()) errs.physiquePrenom = 'Le prénom est obligatoire';
      if (!physiqueCin.trim() || physiqueCin.length !== 8) {
        errs.physiqueCin = 'N° CIN valide requis (exactement 8 chiffres)';
      }
      if (!physiqueTel.trim()) {
        errs.physiqueTel = 'Numéro de téléphone obligatoire';
      } else if (physiqueTel.length !== 8) {
        errs.physiqueTel = 'Le numéro de téléphone doit comporter exactement 8 chiffres';
      }
    } else {
      if (!societeRaison.trim()) errs.societeRaison = 'La raison sociale est obligatoire';
      if (!societeMatriculeFiscale.trim()) {
        errs.societeMatriculeFiscale = 'La matricule fiscale est obligatoire (ex: 1234567/A/M/000)';
      }
      if (!societeTel.trim()) {
        errs.societeTel = 'Numéro de téléphone obligatoire';
      } else if (societeTel.length !== 8) {
        errs.societeTel = 'Le numéro de téléphone doit comporter exactement 8 chiffres';
      }
    }

    // Rule: For cash/comptant payments, deposit is required
    if (!isLeasing && depositAmount <= 0) {
      errs.depositAmount =
        "Pour les paiements au comptant (Espèces, Chèque, Virement), l'acompte est obligatoire (supérieur à 0 TND)";
    }

    // Validation stricte du stock disponible pour chaque véhicule sélectionné
    for (const v of selectedVehicles) {
      const car = cars.find((c) => c.id === v.carId);
      const color = car?.colors.find((col) => col.id === v.colorChosen.id);
      const availableStock = color ? color.stock : 0;
      if (availableStock <= 0) {
        errs.vehicles = `Le véhicule ${v.carName} (teinte ${v.colorChosen.name}) est en rupture de stock (0 disponible).`;
        break;
      }
      if (v.quantity > availableStock) {
        errs.vehicles = `Quantité demandée (${v.quantity}) supérieure au stock disponible (${availableStock}) pour ${v.carName} (${v.colorChosen.name}).`;
        break;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || selectedVehicles.length === 0) return;

    // Chronological ID generation
    const resId = generateChronologicalReservationId(reservations);

    const hasBonCommande = documents.some(
      (d) => d.category === 'bon_commande' || d.name.toLowerCase().includes('bon de commande')
    );
    const hasAccordLeasing = documents.some(
      (d) => d.category === 'accord_leasing' || d.name.toLowerCase().includes('accord')
    );

    // Automated leasing rule evaluation
    let autoStatus: Reservation['status'] = 'En attente';
    if (isLeasing && hasBonCommande) {
      autoStatus = 'Confirmée';
    }

    let leasingNote = notes;
    if (paymentMethod === 'Leasing' || hasAccordLeasing || hasBonCommande) {
      if (hasBonCommande) {
        leasingNote =
          (leasingNote ? leasingNote + ' | ' : '') +
          '⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.';
      } else {
        leasingNote =
          (leasingNote ? leasingNote + ' | ' : '') +
          '⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.';
      }
    }

    const firstItem = selectedVehicles[0];
    const combinedCarNames = selectedVehicles
      .map((v) => `${v.quantity > 1 ? v.quantity + 'x ' : ''}${v.carName} (${v.colorChosen.name})`)
      .join(', ');

    const newReservation: Reservation = {
      id: resId,
      commercialId: currentCommercial.id,
      commercialName: currentCommercial.name,
      agency: currentCommercial.agency,
      carId: firstItem.carId,
      carName: combinedCarNames,
      colorChosen: firstItem.colorChosen,
      vehicles: selectedVehicles,
      interiorColorChosen: undefined,
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
                ville: societeVille,
                telephone: societeTel,
                email: societeEmail,
                adresse: societeAdresse,
                registreCommerce: societeRegistreCommerce,
              }
            : undefined,
      },
      documents: documents,
      priceTND: totalCarPrice,
      registrationFeeTND: 0, // Registration fees deleted!
      depositPaidTND: isLeasing ? 0 : depositAmount,
      paymentMethod: paymentMethod,
      status: autoStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etaDate: etaDate || undefined,
      expectedDeliveryDate: expectedDeliveryDate || calculateDeliveryDate(etaDate, 30),
      notes: leasingNote,
    };

    onSaveReservation(newReservation);
    resetForm();
    onClose();
  };

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
                  {currentCommercial.name} ({currentCommercial.agency})
                </span>
              </h3>
              <p className="text-xs text-slate-400">Chery Tunisie • Saisie de commande multi-modèles & justificatifs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - disabled autocomplete and password prompts */}
        <form
          autoComplete="off"
          data-lpignore="true"
          data-form-type="other"
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-6 flex-1"
        >
          {/* SECTION 1: MULTI-VEHICLE & COLOR SELECTION */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Car className="w-4 h-4 text-red-500" />
                  <span>1. Sélection des Véhicules & Teintes (Multi-Modèles)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Vous pouvez ajouter un ou plusieurs modèles Chery pour cette même réservation.
                </p>
              </div>
              {errors.vehicles && <span className="text-xs text-red-400 font-bold">{errors.vehicles}</span>}
            </div>

            {/* Selected Vehicles Table / Card List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Véhicules inclus dans cette réservation ({totalVehiclesCount}) :
              </span>

              {selectedVehicles.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  Aucun véhicule sélectionné. Veuillez utiliser le formulaire ci-dessous pour ajouter un modèle.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedVehicles.map((item, index) => {
                    const carObj = cars.find((c) => c.id === item.carId);
                    const availableColors = carObj?.colors || [];
                    const currentColor = carObj?.colors.find((c) => c.id === item.colorChosen.id);
                    const availableStock = currentColor ? currentColor.stock : 0;
                    const isAtMaxStock = item.quantity >= availableStock;
                    const isAtMin = item.quantity <= 1;

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-3 text-xs shadow-sm"
                      >
                        {/* Top row: Car info, Quantity Stepper & Subtotal */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          {/* Car info */}
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className="w-7 h-7 rounded-full border border-slate-600 shrink-0 relative shadow-inner flex items-center justify-center"
                              style={{ backgroundColor: item.colorChosen.hexCode }}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{item.carName}</p>
                              <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                                <span className="text-slate-200 font-semibold">{item.colorChosen.name}</span>
                                <span>•</span>
                                <span className="font-mono text-slate-300">
                                  {item.unitPriceTND.toLocaleString()} TND TTC / unité
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Quantity Stepper & Subtotal strictly linked to stock */}
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex flex-col items-center sm:items-end">
                              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateVehicleQuantity(index, -1)}
                                  disabled={isAtMin}
                                  className={`p-1 rounded transition-colors ${
                                    isAtMin
                                      ? 'text-slate-600 cursor-not-allowed opacity-40'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                                  }`}
                                  title="Diminuer la quantité (minimum 1)"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>

                                <span className="font-mono font-bold text-white px-2.5 min-w-[28px] text-center text-sm">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleUpdateVehicleQuantity(index, 1)}
                                  disabled={isAtMaxStock || availableStock <= 0}
                                  className={`p-1 rounded transition-colors ${
                                    isAtMaxStock || availableStock <= 0
                                      ? 'text-slate-600 cursor-not-allowed opacity-40'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                                  }`}
                                  title={
                                    availableStock <= 0
                                      ? 'Rupture de stock pour cette teinte'
                                      : isAtMaxStock
                                      ? `Stock maximum disponible atteint (${availableStock} dispo)`
                                      : `Augmenter la quantité (max ${availableStock})`
                                  }
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Live indicator directly linking Stepper & Stock */}
                              <div className="mt-1 text-[10px]">
                                {availableStock <= 0 ? (
                                  <span className="text-red-400 font-bold bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60">
                                    Rupture (0 dispo)
                                  </span>
                                ) : isAtMaxStock ? (
                                  <span className="text-amber-300 font-semibold bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-800/50">
                                    Stock max atteint ({availableStock})
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-medium">
                                    Stock dispo : <strong className="text-slate-200 font-mono font-semibold">{availableStock}</strong>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">Sous-total :</span>
                              <span className="font-mono font-bold text-white text-xs">
                                {item.totalPriceTND.toLocaleString()} TND
                              </span>
                            </div>

                            {selectedVehicles.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveVehicle(index)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                title="Retirer ce modèle"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Color Selection - Direct choice of available colors right here */}
                        {availableColors.length > 0 && (
                          <div className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/40 p-2.5 rounded-lg">
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-bold text-slate-300">Teinte choisie :</span>
                              <span className="inline-flex items-center gap-1.5 bg-slate-800 text-white font-semibold text-[11px] px-2 py-0.5 rounded border border-slate-700">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-slate-500 shrink-0"
                                  style={{ backgroundColor: item.colorChosen.hexCode }}
                                />
                                {item.colorChosen.name}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-medium text-slate-400 mr-0.5">Disponibles :</span>
                              {availableColors.map((col) => {
                                const isSelected = item.colorChosen.id === col.id;
                                const isOutOfStock = col.stock <= 0;
                                const isWhite =
                                  col.name.toLowerCase().includes('white') ||
                                  col.name.toLowerCase().includes('blanc') ||
                                  col.hexCode.toUpperCase() === '#FFFFFF' ||
                                  col.hexCode.toUpperCase() === '#F8FAFC';
                                const isLightColor =
                                  col.hexCode.toUpperCase() === '#FFFFFF' ||
                                  col.hexCode.toUpperCase() === '#F8FAFC';

                                return (
                                  <button
                                    key={col.id}
                                    type="button"
                                    disabled={isOutOfStock}
                                    onClick={() => {
                                      if (!isOutOfStock) {
                                        handleUpdateVehicleColor(index, col);
                                      }
                                    }}
                                    title={
                                      isOutOfStock
                                        ? `${col.name} : Rupture de stock (0 disponible)`
                                        : `${col.name} : ${col.stock} véhicule(s) disponible(s)`
                                    }
                                    className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                                      isOutOfStock
                                        ? 'bg-slate-950/70 text-slate-500 border-slate-800 opacity-50 cursor-not-allowed'
                                        : isSelected
                                        ? 'bg-red-500/20 text-white border-red-500 ring-1 ring-red-500 font-bold shadow-sm cursor-pointer'
                                        : 'bg-slate-900 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white hover:bg-slate-800 cursor-pointer'
                                    }`}
                                  >
                                    <span
                                      className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0 shadow-inner flex items-center justify-center relative"
                                      style={{ backgroundColor: col.hexCode }}
                                    >
                                      {isSelected && (
                                        <Check
                                          className={`w-2.5 h-2.5 ${
                                            isLightColor ? 'text-black stroke-[3]' : 'text-white stroke-[3]'
                                          }`}
                                        />
                                      )}
                                    </span>
                                    <span>{col.name}</span>
                                    {isWhite && (
                                      <span className="text-[9px] bg-slate-700/90 text-emerald-300 font-bold px-1 rounded">
                                        Standard
                                      </span>
                                    )}
                                    <span
                                      className={`text-[10px] font-mono ${
                                        col.stock > 0
                                          ? isSelected
                                            ? 'text-red-200 font-semibold'
                                            : 'text-slate-400'
                                          : 'text-red-400 font-bold'
                                      }`}
                                    >
                                      ({col.stock > 0 ? `${col.stock} dispo` : '0 dispo'})
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form to add another model/color */}
            <div className="p-3.5 bg-slate-900/70 border border-slate-800/80 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-red-500" />
                <span>Ajouter un modèle ou une teinte supplémentaire :</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Model */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Modèle Chery :</label>
                  <select
                    value={addCarId}
                    onChange={(e) => handleAddCarChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    {cars.map((car) => {
                      const totalStock = car.colors.reduce((s, c) => s + c.stock, 0);
                      return (
                        <option key={car.id} value={car.id}>
                          {car.name} — {car.priceTND.toLocaleString()} TND ({totalStock} dispo)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Teinte Extérieure :</label>
                  <select
                    value={addColorId}
                    onChange={(e) => setAddColorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    {activeAddCar?.colors.map((color) => {
                      const isWhite =
                        color.name.toLowerCase().includes('white') ||
                        color.name.toLowerCase().includes('blanc') ||
                        color.hexCode.toUpperCase() === '#FFFFFF' ||
                        color.hexCode.toUpperCase() === '#F8FAFC';
                      return (
                        <option key={color.id} value={color.id}>
                          {color.name} {isWhite ? '★ (Standard Blanc)' : ''} ({color.stock > 0 ? `${color.stock} en stock` : 'Rupture'})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Quantity + Add Button */}
                <div className="flex items-end gap-2">
                  <div className="w-24">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Quantité :
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={activeAddColor?.stock || 1}
                      value={addQuantity}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value) || 1;
                        const maxStock = activeAddColor?.stock || 1;
                        setAddQuantity(Math.max(1, Math.min(maxStock, parsed)));
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddVehicleToList}
                    disabled={!activeAddColor || activeAddColor.stock <= 0}
                    className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-400" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: CLIENT TYPE & COORDINATES */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-red-500" />
                  <span>2. Type de Client & Coordonnées</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Souscripteur Particulier (Personne Physique) ou Entreprise (Société)
                </p>
              </div>

              {/* Client Type selector */}
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setClientType('personne_physique')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    clientType === 'personne_physique'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Personne Physique</span>
                </button>
                <button
                  type="button"
                  onClick={() => setClientType('societe')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    clientType === 'societe'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Société / Entreprise</span>
                </button>
              </div>
            </div>

            {/* Personne Physique Fields */}
            {clientType === 'personne_physique' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="client_nom"
                    autoComplete="off"
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
                    name="client_prenom"
                    autoComplete="off"
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
                    name="client_cin"
                    autoComplete="off"
                    maxLength={8}
                    required
                    placeholder="ex: 08765432"
                    value={physiqueCin}
                    onChange={(e) => setPhysiqueCin(e.target.value.replace(/\D/g, '').slice(0, 8))}
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
                    Numéro de Téléphone (8 chiffres) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-slate-400 select-none">+216</span>
                    <input
                      type="tel"
                      name="client_phone"
                      autoComplete="off"
                      maxLength={8}
                      required
                      placeholder="ex: 22100200"
                      value={physiqueTel}
                      onChange={(e) => setPhysiqueTel(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-13 pr-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  {errors.physiqueTel && <p className="text-[11px] text-red-400 mt-1">{errors.physiqueTel}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Email :</label>
                  <input
                    type="email"
                    name="client_email"
                    autoComplete="off"
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
                    name="client_adresse"
                    autoComplete="off"
                    placeholder="ex: Rue les Jardins, Résidence Ennasr 2, Tunis"
                    value={physiqueAdresse}
                    onChange={(e) => setPhysiqueAdresse(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            {/* Société Fields */}
            {clientType === 'societe' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Raison Sociale de la Société <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    autoComplete="off"
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
                    name="company_tax_id"
                    autoComplete="off"
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
                    Registre de Commerce / RNE :
                  </label>
                  <input
                    type="text"
                    name="company_rne"
                    autoComplete="off"
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
                    Numéro de Téléphone (8 chiffres) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-slate-400 select-none">+216</span>
                    <input
                      type="tel"
                      name="company_phone"
                      autoComplete="off"
                      maxLength={8}
                      required
                      placeholder="ex: 71800900"
                      value={societeTel}
                      onChange={(e) => setSocieteTel(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-13 pr-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  {errors.societeTel && <p className="text-[11px] text-red-400 mt-1">{errors.societeTel}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Professionnel :</label>
                  <input
                    type="email"
                    name="company_email"
                    autoComplete="off"
                    placeholder="ex: direction@societe.tn"
                    value={societeEmail}
                    onChange={(e) => setSocieteEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Siège Social / Adresse Entreprise :
                  </label>
                  <input
                    type="text"
                    name="company_address"
                    autoComplete="off"
                    placeholder="ex: Zone Industrielle Charguia 2, 2035 Tunis"
                    value={societeAdresse}
                    onChange={(e) => setSocieteAdresse(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: DOCUMENTS (PERMIS DE CONDUIRE SUPPRIMÉ) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>3. Pièces Justificatives & Documents Requis</span>
                </h4>
                <p className="text-xs text-slate-400">
                  {isLeasing
                    ? 'Dossier Leasing : Le Bon de commande valide immédiatement le bon sans acompte.'
                    : "Paiement au comptant : Quittance d'acompte ou copie de chèque requise."}
                </p>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 flex items-center gap-1.5 ${
                  clientType === 'personne_physique'
                    ? 'bg-blue-950/40 text-blue-300 border-blue-800/60'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                }`}
              >
                {clientType === 'personne_physique' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Building className="w-3.5 h-3.5" />
                )}
                <span>{clientType === 'personne_physique' ? 'Particulier' : 'Société'}</span>
              </span>
            </div>

            {/* Checklist Guide Badges - PERMIS SUPPRIMÉ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {clientType === 'personne_physique' ? (
                <>
                  <div
                    onClick={() => setDocCategory('cin_recto')}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
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
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
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
                    onClick={() => setDocCategory(isLeasing ? 'bon_commande' : 'quittance_acompte')}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) =>
                        [
                          'quittance_acompte',
                          'cheque_reservation',
                          'virement_bancaire',
                          'bon_commande',
                          'accord_leasing',
                        ].includes(d.category)
                      )
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">
                        {isLeasing ? '📄 Bon de Commande / Accord' : "🧾 Justificatif d'Acompte"}
                      </span>
                      {documents.some((d) =>
                        [
                          'quittance_acompte',
                          'cheque_reservation',
                          'virement_bancaire',
                          'bon_commande',
                          'accord_leasing',
                        ].includes(d.category)
                      ) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[9px] text-amber-400 font-bold">
                          {isLeasing ? 'Requis (Leasing)' : 'Requis (Comptant)'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) =>
                        [
                          'quittance_acompte',
                          'cheque_reservation',
                          'virement_bancaire',
                          'bon_commande',
                          'accord_leasing',
                        ].includes(d.category)
                      )
                        ? 'Pièce fournie'
                        : isLeasing
                        ? 'Bon de Commande Leasing'
                        : 'Reçu, Chèque ou Virement'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => setDocCategory('registre_commerce')}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => d.category === 'registre_commerce')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">🏢 Extrait RNE / Registre</span>
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
                    onClick={() => setDocCategory('bon_commande')}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) => d.category === 'bon_commande')
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">📄 Bon de Commande Officiel</span>
                      {documents.some((d) => d.category === 'bon_commande') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-amber-400 font-bold shrink-0">
                          {isLeasing ? 'Requis (Leasing)' : 'Recommandé'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) => d.category === 'bon_commande') ? 'Pièce fournie' : 'À joindre'}
                    </span>
                  </div>

                  <div
                    onClick={() => setDocCategory('quittance_acompte')}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      documents.some((d) =>
                        ['quittance_acompte', 'cheque_reservation', 'virement_bancaire', 'accord_leasing'].includes(
                          d.category
                        )
                      )
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">
                        {isLeasing ? '💼 Accord Leasing' : "🧾 Chèque / Quittance d'Acompte"}
                      </span>
                      {documents.some((d) =>
                        ['quittance_acompte', 'cheque_reservation', 'virement_bancaire', 'accord_leasing'].includes(
                          d.category
                        )
                      ) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-slate-500 shrink-0">
                          {isLeasing ? 'Optionnel si BC' : 'Requis comptant'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">
                      {documents.some((d) =>
                        ['quittance_acompte', 'cheque_reservation', 'virement_bancaire', 'accord_leasing'].includes(
                          d.category
                        )
                      )
                        ? 'Pièce fournie'
                        : 'Reçu / Chèque Société'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Document Upload Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catégorie du document à joindre :
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium cursor-pointer"
                >
                  {clientType === 'personne_physique' ? (
                    <>
                      <option value="cin_recto">🪪 CIN Client (Face Recto)</option>
                      <option value="cin_verso">🪪 CIN Client (Face Verso)</option>
                      <option value="bon_commande">📄 Bon de Commande Client</option>
                      <option value="accord_leasing">💼 Accord / Dossier Leasing Particulier</option>
                      <option value="quittance_acompte">🧾 Reçu d'acompte / Quittance de Paiement</option>
                      <option value="cheque_reservation">💳 Copie du Chèque de Réservation</option>
                      <option value="virement_bancaire">🏛️ Attestation / Ordre de Virement Bancaire</option>
                      <option value="autre">📎 Autre pièce justificative</option>
                    </>
                  ) : (
                    <>
                      <option value="registre_commerce">🏢 Extrait RNE / Registre National des Entreprises</option>
                      <option value="bon_commande">📄 Bon de Commande Officiel Société</option>
                      <option value="accord_leasing">💼 Dossier / Accord de Leasing Entreprise</option>
                      <option value="quittance_acompte">🧾 Reçu d'acompte / Quittance Société</option>
                      <option value="cheque_reservation">💳 Copie du Chèque Société</option>
                      <option value="virement_bancaire">🏛️ Attestation / Ordre de Virement Entreprise</option>
                      <option value="autre">📎 Autre document Société</option>
                    </>
                  )}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sélectionner ou glisser le fichier :
                </label>
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
                <p className="text-xs font-bold text-slate-300">Pièces enregistrées ({documents.length}) :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {doc.fileType.startsWith('image/') ? (
                          <img
                            src={doc.dataUrl}
                            alt={doc.name}
                            className="w-8 h-8 object-cover rounded border border-slate-700 shrink-0"
                          />
                        ) : (
                          <FileText className="w-7 h-7 text-red-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-[11px] truncate">{doc.name}</p>
                          <span className="text-[9px] font-mono text-slate-400 uppercase">
                            {doc.category.replace('_', ' ')} • {doc.sizeFormatted}
                          </span>
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

          {/* SECTION 4: FINANCIAL CONDITIONS & LEASING / DEPOSIT LOGIC */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-500" />
              <span>4. Conditions Financières & Acompte de Réservation</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Car Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Prix Total des Véhicules TTC (TND) :
                </label>
                <input
                  type="text"
                  disabled
                  value={`${totalCarPrice.toLocaleString()} TND TTC`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Total cumulé pour {totalVehiclesCount} véhicule(s) sélectionné(s).
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mode de Règlement / Dossier :
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => handlePaymentMethodChange(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium cursor-pointer"
                >
                  <option value="Chèque Certifié">Chèque Certifié</option>
                  <option value="Virement Bancaire">Virement Bancaire</option>
                  <option value="Espèces">Espèces (Au comptant)</option>
                  <option value="Leasing">Dossier Leasing</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isLeasing
                    ? 'Dossier leasing : aucun acompte requis avec Bon de Commande.'
                    : "Paiement au comptant : l'acompte est requis."}
                </p>
              </div>

              {/* Deposit Amount */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Acompte Versé (TND) {!isLeasing && <span className="text-red-400">*</span>}
                  </label>
                  {isLeasing ? (
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                      0 TND (Dossier Leasing)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      Requis: {totalCalculatedDeposit.toLocaleString()} TND
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  required={!isLeasing}
                  disabled={isLeasing}
                  step="500"
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
                    ? 'Aucun acompte requis pour les dossiers de leasing munis d’un bon de commande.'
                    : "Acompte requis pour valider la réservation au comptant."}
                </p>
                {errors.depositAmount && <p className="text-[11px] text-red-400 mt-1">{errors.depositAmount}</p>}
              </div>
            </div>

            {/* Leasing details banner */}
            {isLeasing && (
              <div className="p-3 bg-indigo-950/60 border border-indigo-700/60 rounded-xl text-xs text-indigo-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Règles Spécifiques aux Dossiers Leasing :</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-indigo-200/90 pl-1">
                  <li>
                    <strong>Bon de Commande Leasing joint :</strong> Aucun acompte requis. Le bon de réservation est immédiatement validé et le stock est réservé.
                  </li>
                  <li>
                    <strong>Accord de Leasing uniquement :</strong> Réservation provisoire accordée pour 5 jours ouvrés.
                  </li>
                </ul>
              </div>
            )}

            {/* Financial Summary Card */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nombre de Véhicules :</span>
                  <span className="text-slate-200 font-mono font-bold">{totalVehiclesCount}</span>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <span className="text-emerald-400 block font-extrabold text-[10px] uppercase">Prix Total TTC :</span>
                  <strong className="text-emerald-400 font-mono font-bold text-sm">
                    {totalCarPrice.toLocaleString()} TND
                  </strong>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <span className="text-amber-400 block text-[10px]">
                    {isLeasing ? 'Acompte Exigé :' : 'Acompte Comptabilisé :'}
                  </span>
                  <strong className="text-amber-300 font-mono font-bold">
                    {isLeasing ? '0 TND' : `${depositAmount.toLocaleString()} TND`}
                  </strong>
                </div>
              </div>
              <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-right w-full md:w-auto shrink-0">
                <span className="text-slate-400 block text-[10px]">Reste à régler à la livraison :</span>
                <span className="text-base font-extrabold text-red-400 font-mono">
                  {remainingToPay.toLocaleString()} TND
                </span>
              </div>
            </div>

            {/* SECTION DÉLAIS & DATE ETA (ACCÈS ADMINISTRATEUR RESTREINT) */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Délais d'Arrivage & Date de Livraison Estimée
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {canEditEta ? (
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded text-[10px] font-bold">
                      Admin Autorisé
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-700/60 rounded text-[10px] font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Admin uniquement
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 rounded text-[10px] font-bold">
                    Délai client +30 jours
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ETA Date Field - Restricted to Admins */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date d'Arrivage Prévisionnel (ETA) :</span>
                    </label>
                    {!canEditEta && (
                      <span className="text-[10px] text-amber-400 font-mono">🔒 Sami Chaker & Lamine Abbasi</span>
                    )}
                  </div>
                  <input
                    type="date"
                    disabled={!canEditEta}
                    value={etaDate}
                    onChange={(e) => handleEtaDateChange(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono ${
                      canEditEta
                        ? 'bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500'
                        : 'bg-slate-950/50 border border-slate-800/60 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {canEditEta
                      ? 'Modifiable par les Administrateurs pour calibrer les arrivages portuaires.'
                      : "Réservé aux Administrateurs (ex: Sami Chaker et Lamine Abbasi)."}
                  </p>
                </div>

                {/* Expected Delivery Date */}
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Date de Livraison Estimée (ETA + 30 jours) :</span>
                  </label>
                  <input
                    type="date"
                    disabled
                    value={expectedDeliveryDate}
                    className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold"
                  />
                  <p className="text-[10px] text-emerald-400/80 mt-1">
                    Calcul automatique : ETA + délai légal de 30 jours pour compléter le paiement et formalités.
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
                name="reservation_notes"
                autoComplete="off"
                placeholder="ex: Client souhaite la livraison à l'agence de Sousse..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Form Actions - Button type='button' prevents Chrome's password manager trigger */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
              <span>Statut initial : <strong>En attente</strong> (aucun stock n'est déduit tant qu'elle n'est pas confirmée).</span>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Valider et enregistrer ({totalVehiclesCount} véhicule{totalVehiclesCount > 1 ? 's' : ''})</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
