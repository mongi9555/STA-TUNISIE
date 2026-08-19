import React, { useState, useMemo } from 'react';
import { CarModel, CarColor, CommercialUser, Reservation } from '../types';
import { getFixedDepositForCar, getFullCarPrice, getRegistrationFeeForCar } from '../data/cheryData';
import { Check, ShieldCheck, Zap, Sparkles, Plus, Car, Fuel, Settings2, Info, X, Gauge, Shield, Award, Maximize2, FileText, Download, Eye, Calendar, Search, Palette, Filter } from 'lucide-react';
import { TechSpecModal } from './TechSpecModal';

interface CarCatalogProps {
  cars: CarModel[];
  currentUser?: CommercialUser;
  reservations?: Reservation[];
  onOpenReservationModal: (car: CarModel, selectedColor?: CarColor) => void;
  onOpenTestDriveModal?: (car?: CarModel) => void;
}

export const CarCatalog: React.FC<CarCatalogProps> = ({
  cars,
  currentUser,
  reservations = [],
  onOpenReservationModal,
  onOpenTestDriveModal,
}) => {
  const [selectedColorMap, setSelectedColorMap] = useState<Record<string, string>>({});
  const [selectedSpecCar, setSelectedSpecCar] = useState<CarModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSelectColor = (carId: string, colorId: string) => {
    setSelectedColorMap((prev) => ({
      ...prev,
      [carId]: colorId,
    }));
  };

  // Extract all unique color categories/names for quick filtering
  const uniqueColorList = useMemo(() => {
    const map = new Map<string, { name: string; hexCode: string }>();
    cars.forEach((car) => {
      car.colors.forEach((col) => {
        // Normalize primary color group
        const lower = col.name.toLowerCase();
        let groupKey = col.name;
        if (lower.includes('blanc')) groupKey = 'Blanc';
        else if (lower.includes('noir')) groupKey = 'Noir';
        else if (lower.includes('gris') || lower.includes('titan')) groupKey = 'Gris';
        else if (lower.includes('bleu')) groupKey = 'Bleu';
        else if (lower.includes('rouge') || lower.includes('bordeaux')) groupKey = 'Rouge / Bordeaux';
        else if (lower.includes('vert')) groupKey = 'Vert';
        else if (lower.includes('argent')) groupKey = 'Argent';

        if (!map.has(groupKey)) {
          map.set(groupKey, { name: groupKey, hexCode: col.hexCode });
        }
      });
    });
    return Array.from(map.values());
  }, [cars]);

  // Filter cars based on search, color filter, and category
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        car.name.toLowerCase().includes(term) ||
        car.category.toLowerCase().includes(term) ||
        car.energy.toLowerCase().includes(term) ||
        car.engine.toLowerCase().includes(term) ||
        car.colors.some((col) => col.name.toLowerCase().includes(term) || col.hexCode.toLowerCase().includes(term));

      const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory;

      let matchesColor = true;
      if (selectedColorFilter !== 'all') {
        const filterKey = selectedColorFilter.toLowerCase();
        matchesColor = car.colors.some((col) => {
          const colName = col.name.toLowerCase();
          if (filterKey === 'blanc') return colName.includes('blanc');
          if (filterKey === 'noir') return colName.includes('noir');
          if (filterKey === 'gris') return colName.includes('gris') || colName.includes('titan');
          if (filterKey === 'bleu') return colName.includes('bleu');
          if (filterKey === 'rouge / bordeaux') return colName.includes('rouge') || colName.includes('bordeaux');
          if (filterKey === 'vert') return colName.includes('vert');
          if (filterKey === 'argent') return colName.includes('argent');
          return colName.includes(filterKey);
        });
      }

      return matchesSearch && matchesCategory && matchesColor;
    });
  }, [cars, searchTerm, selectedCategory, selectedColorFilter]);

  return (
    <div className="space-y-6">
      {/* Catalog Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-red-600/30 text-red-300 text-xs font-bold rounded-full border border-red-500/30">
              Gamme Officielle Chery Tunisie 2026
            </span>
            <span className="text-xs text-slate-400">Garantie Constructeur 7 ans / 200 000 km</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Catalogue Officiel & Teintes Disponibles
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Recherchez et filtrez par modèle ou par teinte de carrosserie pour vérifier le stock en temps réel et établir immédiatement un Bon de Réservation.
          </p>
        </div>
      </div>

      {/* SEARCH & COLOR FILTER BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input with Color Support */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par modèle ou couleur (ex: Noir, Blanc, Tiggo, Arrizo...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              <option value="all">Toutes Catégories ({cars.length})</option>
              <option value="SUV">SUV</option>
              <option value="Berline">Berline</option>
              <option value="Pick-up">Pick-up</option>
            </select>
          </div>
        </div>

        {/* Color Palette Quick Filters */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold mr-1">
            <Palette className="w-3.5 h-3.5 text-red-500" />
            <span>Filtrer par couleur :</span>
          </div>

          <button
            onClick={() => setSelectedColorFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              selectedColorFilter === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>Toutes les teintes</span>
          </button>

          {uniqueColorList.map((col) => {
            const isSelected = selectedColorFilter.toLowerCase() === col.name.toLowerCase();
            return (
              <button
                key={col.name}
                onClick={() => setSelectedColorFilter(isSelected ? 'all' : col.name)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0"
                  style={{ backgroundColor: col.hexCode }}
                />
                <span>{col.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Showroom Cards */}
      {filteredCars.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Palette className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Aucun véhicule trouvé pour ces critères</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Aucun modèle ne correspond à la recherche "{searchTerm || selectedColorFilter}". Essayez de réinitialiser les filtres.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedColorFilter('all');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => {
            // Find appropriate color based on active color filter or selected color map
            let activeColor = car.colors.find((c) => c.id === selectedColorMap[car.id]);
            if (!activeColor && selectedColorFilter !== 'all') {
              const filterKey = selectedColorFilter.toLowerCase();
              activeColor = car.colors.find((col) => {
                const colName = col.name.toLowerCase();
                if (filterKey === 'blanc') return colName.includes('blanc');
                if (filterKey === 'noir') return colName.includes('noir');
                if (filterKey === 'gris') return colName.includes('gris') || colName.includes('titan');
                if (filterKey === 'bleu') return colName.includes('bleu');
                if (filterKey === 'rouge / bordeaux') return colName.includes('rouge') || colName.includes('bordeaux');
                if (filterKey === 'vert') return colName.includes('vert');
                if (filterKey === 'argent') return colName.includes('argent');
                return colName.includes(filterKey);
              });
            }
            if (!activeColor) activeColor = car.colors[0];

            const selectedColorId = activeColor?.id || car.colors[0]?.id;
            const selectedColor = activeColor || car.colors[0];
            const totalStock = car.colors.reduce((acc, c) => acc + c.stock, 0);

            return (
              <div
                key={car.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div>
                  <div
                    onClick={() => setSelectedSpecCar(car)}
                    title="Cliquer pour afficher la Fiche Technique Flottante (PDF / Image)"
                    className="relative h-56 bg-slate-950 overflow-hidden cursor-pointer group/img"
                  >
                    <img
                      src={car.imageUrl}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-all duration-500 opacity-90"
                      style={{
                        filter: selectedColor?.hexCode ? `drop-shadow(0 0 12px ${selectedColor.hexCode}44)` : 'none',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

                    {/* Hover Overlay Badge for Tech Specs */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-3.5 py-2 bg-red-600/90 backdrop-blur text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-2 border border-red-400/50 transform translate-y-2 group-hover/img:translate-y-0 transition-all">
                        <FileText className="w-4 h-4" />
                        <span>Fiche Technique (PDF / Image)</span>
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap max-w-[85%]">
                      <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur text-red-400 border border-red-500/30 text-xs font-bold rounded-lg shadow">
                        {car.category}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur text-slate-300 text-xs font-semibold rounded-lg shadow">
                        {car.energy}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg shadow">
                        Stock: {totalStock} unit.
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-black text-white drop-shadow-md">{car.name}</h3>
                        <span className="text-[10px] text-slate-300 font-medium block">
                          Base HT/TTC: {car.priceTND.toLocaleString()} TND
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block drop-shadow">
                          Prix Complet Clé en Main
                        </span>
                        <span className="text-lg font-black text-emerald-400 font-mono drop-shadow block leading-none">
                          {getFullCarPrice(car).toLocaleString()} TND
                        </span>
                        <span className="text-[10px] font-bold text-amber-300 bg-slate-950/90 px-1.5 py-0.5 rounded font-mono border border-amber-500/30 inline-block mt-1 shadow">
                          Acompte: {getFixedDepositForCar(car).toLocaleString()} TND
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 space-y-4">
                    {/* Tech specs summary */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{car.engine}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Settings2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{car.transmission}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{car.description}</p>

                    {/* Prix complet breakdown badge */}
                    <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-emerald-400 block">Prix Complet Clé en Main</span>
                        <span className="text-[10px] text-slate-400">Véhicule {car.priceTND.toLocaleString()} DT + Frais immat/carte grise {getRegistrationFeeForCar(car).toLocaleString()} DT</span>
                      </div>
                      <span className="font-mono font-black text-xs text-emerald-300 bg-emerald-900/60 px-2 py-1 rounded-lg border border-emerald-500/40">
                        {getFullCarPrice(car).toLocaleString()} DT
                      </span>
                    </div>

                    {/* Features Bullet List */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Équipements clés :</p>
                      <ul className="grid grid-cols-1 gap-1 text-xs text-slate-300">
                        {car.features.slice(0, 4).map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Color Picker Swatches with Hex Codes */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">Couleur & Stock :</span>
                        {selectedColor && (
                          <span
                            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                              selectedColor.stock > 2
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : selectedColor.stock > 0
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {selectedColor.name} ({selectedColor.hexCode}) — {selectedColor.stock === 0 ? '0 ÉPUISÉ' : `${selectedColor.stock} en stock`}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {car.colors.map((color) => {
                          const isSelected = selectedColorId === color.id;
                          const isOutOfStock = color.stock === 0;

                          return (
                            <button
                              key={color.id}
                              onClick={() => handleSelectColor(car.id, color.id)}
                              title={`${color.name} (${color.hexCode}) - Stock: ${color.stock}`}
                              className={`relative p-1 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? 'border-red-500 bg-red-950/30 ring-2 ring-red-500/40'
                                  : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                              }`}
                            >
                              <span
                                className="w-5 h-5 rounded-full border border-slate-600 shrink-0 relative"
                                style={{ backgroundColor: color.hexCode }}
                              >
                                {color.hexCode.toUpperCase() === '#FFFFFF' && (
                                  <span className="absolute inset-0 rounded-full border border-slate-400/50" />
                                )}
                              </span>
                              <span className="text-[11px] font-medium text-slate-200 pr-1">{color.name}</span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                  isOutOfStock ? 'bg-red-900/60 text-red-300' : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {color.stock}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Interior Colors Display */}
                      {car.interiorColors && car.interiorColors.length > 0 && (
                        <div className="pt-2 border-t border-slate-900/80">
                          <span className="text-[11px] font-bold text-amber-400 block mb-1">
                            Couleurs & Habillages Intérieurs Disponibles :
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {car.interiorColors.map((intCol) => (
                              <div
                                key={intCol.id}
                                className="flex items-center gap-1.5 bg-slate-950 border border-slate-800/80 px-2 py-1 rounded-lg text-[10px]"
                              >
                                <span
                                  className="w-3 h-3 rounded-md border border-slate-600 shrink-0"
                                  style={{ backgroundColor: intCol.hexCode }}
                                />
                                <span className="text-slate-300 font-medium truncate max-w-[130px]">{intCol.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedSpecCar(car)}
                      className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Fiche Tech</span>
                    </button>

                    {onOpenTestDriveModal && (
                      <button
                        onClick={() => onOpenTestDriveModal(car)}
                        className="py-2 px-2.5 bg-slate-900 hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Test Drive</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenReservationModal(car, selectedColor)}
                    disabled={selectedColor && selectedColor.stock === 0}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${
                      selectedColor && selectedColor.stock > 0
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {selectedColor && selectedColor.stock > 0
                        ? `Réserver en ${selectedColor.name}`
                        : 'Teinte sélectionnée épuisée'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Tech Spec Sheet Modal */}
      <TechSpecModal
        car={selectedSpecCar}
        onClose={() => setSelectedSpecCar(null)}
        onOpenReservationModal={onOpenReservationModal}
      />
    </div>
  );
};
