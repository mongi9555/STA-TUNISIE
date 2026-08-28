import React, { useState } from 'react';
import {
  CarModel,
  CarColor,
  CarAccessory,
  VehicleConfiguration,
} from '../types';
import {
  Sliders,
  Check,
  Plus,
  Car,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  X,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VehicleConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: CarModel[];
  accessories: CarAccessory[];
  initialCar?: CarModel | null;
  onConfirmConfigToQuote: (config: VehicleConfiguration) => void;
  onConfirmConfigToReservation: (config: VehicleConfiguration) => void;
  theme: 'dark' | 'light' | 'red';
}

export const VehicleConfiguratorModal: React.FC<VehicleConfiguratorModalProps> = ({
  isOpen,
  onClose,
  cars,
  accessories,
  initialCar,
  onConfirmConfigToQuote,
  onConfirmConfigToReservation,
  theme,
}) => {
  const [selectedCar, setSelectedCar] = useState<CarModel>(initialCar || cars[0] || null);
  const [selectedColor, setSelectedColor] = useState<CarColor>(
    initialCar?.colors[0] || cars[0]?.colors[0] || null
  );
  const [selectedInterior, setSelectedInterior] = useState<CarColor | undefined>(
    initialCar?.interiorColors?.[0] || cars[0]?.interiorColors?.[0]
  );
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);
  const [discountTND, setDiscountTND] = useState<number>(0);
  const [registrationFeeTND, setRegistrationFeeTND] = useState<number>(0);

  // Update selection if initialCar changes when opening
  React.useEffect(() => {
    if (initialCar) {
      setSelectedCar(initialCar);
      setSelectedColor(initialCar.colors[0]);
      setSelectedInterior(initialCar.interiorColors?.[0]);
    }
  }, [initialCar]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !selectedCar) return null;

  const handleSelectCar = (car: CarModel) => {
    setSelectedCar(car);
    setSelectedColor(car.colors[0]);
    setSelectedInterior(car.interiorColors?.[0]);
  };

  const handleToggleAccessory = (accId: string) => {
    if (selectedAccessoryIds.includes(accId)) {
      setSelectedAccessoryIds(selectedAccessoryIds.filter((id) => id !== accId));
    } else {
      setSelectedAccessoryIds([...selectedAccessoryIds, accId]);
    }
  };

  const chosenAccessories = accessories.filter((a) => selectedAccessoryIds.includes(a.id));
  const basePriceTND = selectedCar.priceTND;
  const accessoriesPriceTND = chosenAccessories.reduce((sum, a) => sum + a.priceTND, 0);
  const subtotalTND = basePriceTND + accessoriesPriceTND - discountTND;
  const totalWithRegTND = subtotalTND + registrationFeeTND;

  const currentConfig: VehicleConfiguration = {
    carId: selectedCar.id,
    carName: selectedCar.name,
    colorId: selectedColor?.id || '',
    colorName: selectedColor?.name || '',
    colorHex: selectedColor?.hexCode || '#000000',
    interiorColorId: selectedInterior?.id,
    interiorColorName: selectedInterior?.name,
    interiorColorHex: selectedInterior?.hexCode,
    selectedAccessories: chosenAccessories,
    customDiscountTND: discountTND,
    registrationFeeTND,
    basePriceTND,
    accessoriesPriceTND,
    totalTND: totalWithRegTND,
  };

  const cardBgClass =
    theme === 'light'
      ? 'bg-white border-slate-200 text-slate-900 shadow-xl'
      : 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`max-w-5xl w-full rounded-2xl border ${cardBgClass} overflow-hidden flex flex-col max-h-[92vh] my-auto`}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                <span>Configurateur Véhicule & Accessoires Chery</span>
                <span className="bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 font-bold hidden sm:inline">
                  Sur-Mesure
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Personnalisez les finitions, couleurs et accessoires d'origine pour calculer le tarif en temps réel.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Step 1: Model Selection Horizontal Carousel */}
          <div>
            <label className="font-extrabold text-xs uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-red-500" /> 1. Sélectionner le Modèle Chery :
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {cars.map((car) => {
                const isSelected = selectedCar.id === car.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => handleSelectCar(car)}
                    className={`p-3 rounded-2xl border text-left shrink-0 w-48 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-600/15 border-red-500 text-white shadow-lg shadow-red-950/30 ring-2 ring-red-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative h-20 w-full mb-2 overflow-hidden rounded-xl bg-slate-900">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute top-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                        {car.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs line-clamp-1">{car.name}</h4>
                      <p className="font-mono text-xs font-bold text-amber-400 mt-1">
                        {car.priceTND.toLocaleString()} TND
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Vehicle Showcase & Color Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Car Showcase Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-1/2 h-48 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                  <img
                    src={selectedCar.imageUrl}
                    alt={selectedCar.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-xs font-bold font-mono text-white flex items-center gap-1.5 shadow"
                    style={{ backgroundColor: selectedColor?.hexCode || '#000000' }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-white" />
                    {selectedColor?.name}
                  </div>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-lg text-white">{selectedCar.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Garantie {selectedCar.guarantee}
                    </span>
                  </div>
                  <p className="text-slate-400 line-clamp-2">{selectedCar.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Moteur :</span>
                      <span className="font-semibold text-slate-200">{selectedCar.engine}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Boîte :</span>
                      <span className="font-semibold text-slate-200">{selectedCar.transmission}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Color Picker */}
              <div className="space-y-4">
                <div>
                  <label className="font-extrabold text-xs uppercase tracking-wider text-slate-400 block mb-2">
                    2A. Couleur Extérieure Carrosserie ({selectedCar.colors.length} disponibles) :
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {selectedCar.colors.map((col) => {
                      const isSel = selectedColor?.id === col.id;
                      const available = col.stock - col.reserved;
                      return (
                        <button
                          key={col.id}
                          onClick={() => setSelectedColor(col)}
                          className={`p-3 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition ${
                            isSel
                              ? 'bg-red-600/20 border-red-500 text-white ring-2 ring-red-500'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-white/40 shrink-0 shadow"
                            style={{ backgroundColor: col.hexCode }}
                          />
                          <div className="overflow-hidden min-w-0">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-400 block leading-tight">
                              Couleur Extérieure :
                            </span>
                            <p className="font-bold text-xs truncate text-white">{col.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {available > 0 ? `Dispo: ${available}` : 'Sur commande'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interior Color Picker */}
                {selectedCar.interiorColors && selectedCar.interiorColors.length > 0 && (
                  <div>
                    <label className="font-extrabold text-xs uppercase tracking-wider text-slate-400 block mb-2">
                      2B. Ambiance & Sellerie Intérieure :
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedCar.interiorColors.map((intCol) => {
                        const isSel = selectedInterior?.id === intCol.id;
                        return (
                          <button
                            key={intCol.id}
                            onClick={() => setSelectedInterior(intCol)}
                            className={`p-3 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition ${
                              isSel
                                ? 'bg-red-600/20 border-red-500 text-white ring-2 ring-red-500'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full border border-white/40 shrink-0 shadow"
                              style={{ backgroundColor: intCol.hexCode }}
                            />
                            <p className="font-bold text-xs">{intCol.name}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Accessories Catalogue */}
              <div>
                <label className="font-extrabold text-xs uppercase tracking-wider text-slate-400 block mb-2">
                  3. Catalogue Accessoires Officiels Chery :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {accessories.map((acc) => {
                    const isChecked = selectedAccessoryIds.includes(acc.id);
                    return (
                      <div
                        key={acc.id}
                        onClick={() => handleToggleAccessory(acc.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isChecked
                            ? 'bg-red-600/20 border-red-500 text-white ring-1 ring-red-500'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="w-4 h-4 accent-red-600 rounded"
                          />
                          <div>
                            <p className="font-bold text-xs">{acc.name}</p>
                            <p className="text-[10px] text-slate-400">{acc.description}</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs text-amber-400 shrink-0 ml-2">
                          +{acc.priceTND} TND
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Price Summary Box & Action Triggers */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 sticky top-4">
                <h3 className="font-extrabold text-sm uppercase text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" /> Récapitulatif Tarifaire Configuré
                </h3>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prix de base {selectedCar.name} :</span>
                    <span className="font-bold">{basePriceTND.toLocaleString()} TND</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Teinte carrosserie :</span>
                    <span className="text-slate-200">{selectedColor?.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Accessoires ({chosenAccessories.length}) :</span>
                    <span className="font-bold text-amber-400">+{accessoriesPriceTND.toLocaleString()} TND</span>
                  </div>

                  {chosenAccessories.length > 0 && (
                    <div className="pl-2 border-l-2 border-red-500/40 text-[10px] space-y-1 text-slate-400">
                      {chosenAccessories.map((a) => (
                        <div key={a.id} className="flex justify-between">
                          <span className="truncate max-w-[150px]">• {a.name}</span>
                          <span>+{a.priceTND} TND</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Frais immatriculation ATTT :</span>
                    <span>+{registrationFeeTND.toLocaleString()} TND</span>
                  </div>

                  <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl space-y-1 mt-3">
                    <div className="flex justify-between items-center text-xs font-sans text-red-200">
                      <span>TOTAL TTC CONFIGURÉ :</span>
                    </div>
                    <p className="text-xl font-extrabold text-amber-300 font-mono">
                      {totalWithRegTND.toLocaleString()} TND
                    </p>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      onConfirmConfigToQuote(currentConfig);
                      onClose();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <FileText className="w-4 h-4" /> Transformer en Devis Officiel
                  </button>

                  <button
                    onClick={() => {
                      onConfirmConfigToReservation(currentConfig);
                      onClose();
                    }}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Car className="w-4 h-4 text-red-400" /> Réserver avec ces Options
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
