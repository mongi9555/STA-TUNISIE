import React, { useState, useMemo } from 'react';
import { CarModel, CarColor, CommercialUser, Reservation } from '../types';
import { getFixedDepositForCar, getFullCarPrice, getRegistrationFeeForCar } from '../data/cheryData';
import { getCarDimensions, sortCarList, CarSortOption, CAR_SORT_OPTIONS } from '../utils/carDimensions';
import {
  Check,
  Zap,
  Sparkles,
  Plus,
  Car,
  Settings2,
  Info,
  X,
  FileText,
  Calendar,
  Search,
  Palette,
  ArrowUpDown,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Ruler,
  DollarSign,
  LayoutGrid,
  Table,
  CheckCircle2,
  Layers,
} from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<CarSortOption>('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
  const filteredAndSortedCars = useMemo(() => {
    const filtered = cars.filter((car) => {
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

    return sortCarList(filtered, sortBy);
  }, [cars, searchTerm, selectedCategory, selectedColorFilter, sortBy]);

  const activeSortMeta = CAR_SORT_OPTIONS.find((s) => s.id === sortBy) || CAR_SORT_OPTIONS[0];

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
            Classez et filtrez les véhicules par <strong>Prix</strong>, par <strong>Taille &amp; Gabarit</strong> ou par <strong>Teinte</strong> pour vérifier le stock en temps réel et établir immédiatement un Bon de Réservation.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grille Cartes</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tableau Comparatif</span>
          </button>
        </div>
      </div>

      {/* SEARCH, SORTING & FILTER BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Top Row: Search + Category + Sort Select */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input with Color Support */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par modèle ou couleur (ex: Tiggo, Arrizo, Himla, Noir, Blanc...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Category Selector */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium shrink-0"
            >
              <option value="all">Toutes Catégories ({cars.length})</option>
              <option value="SUV">SUV ({cars.filter((c) => c.category === 'SUV').length})</option>
              <option value="Berline">Berline ({cars.filter((c) => c.category === 'Berline').length})</option>
              <option value="Pick-up">Pick-up ({cars.filter((c) => c.category === 'Pick-up').length})</option>
            </select>

            {/* Main Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Trier les Véhicules :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as CarSortOption)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                >
                  <optgroup label="Classement par Prix">
                    <option value="price-asc" className="bg-slate-900 text-white">💰 Prix croissant (Moins cher ➔ Plus cher)</option>
                    <option value="price-desc" className="bg-slate-900 text-white">💎 Prix décroissant (Plus cher ➔ Moins cher)</option>
                  </optgroup>
                  <optgroup label="Classement par Taille &amp; Longueur">
                    <option value="size-asc" className="bg-slate-900 text-white">📏 Taille croissante (Plus compact ➔ Plus grand)</option>
                    <option value="size-desc" className="bg-slate-900 text-white">📐 Taille décroissante (Plus grand ➔ Plus compact)</option>
                  </optgroup>
                  <optgroup label="Autres critères">
                    <option value="name-asc" className="bg-slate-900 text-white">🔤 Nom de modèle (A ➔ Z)</option>
                    <option value="stock-desc" className="bg-slate-900 text-white">📦 Disponibilité stock</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Order Tabs (Prix vs Taille vs Autres) */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Ordre rapide :
            </span>

            {/* Quick Sort Pill: Prix Croissant */}
            <button
              type="button"
              onClick={() => setSortBy('price-asc')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                sortBy === 'price-asc'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <DollarSign className="w-3 h-3 text-emerald-300" />
              <span>Prix ↗ (Moins cher)</span>
            </button>

            {/* Quick Sort Pill: Prix Décroissant */}
            <button
              type="button"
              onClick={() => setSortBy('price-desc')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                sortBy === 'price-desc'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <DollarSign className="w-3 h-3 text-emerald-300" />
              <span>Prix ↘ (Plus cher)</span>
            </button>

            {/* Quick Sort Pill: Taille Croissante */}
            <button
              type="button"
              onClick={() => setSortBy('size-asc')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                sortBy === 'size-asc'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950 ring-1 ring-blue-400'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Ruler className="w-3 h-3 text-blue-300" />
              <span>Taille ↗ (Plus compact)</span>
            </button>

            {/* Quick Sort Pill: Taille Décroissante */}
            <button
              type="button"
              onClick={() => setSortBy('size-desc')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                sortBy === 'size-desc'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950 ring-1 ring-blue-400'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Ruler className="w-3 h-3 text-blue-300" />
              <span>Taille ↘ (Plus grand)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            {filteredAndSortedCars.length} modèle(s) • <span className="text-slate-200 font-bold">{activeSortMeta.label}</span>
          </div>
        </div>

        {/* Color Palette Quick Filters */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold mr-1">
            <Palette className="w-3.5 h-3.5 text-red-500" />
            <span>Filtrer par couleur :</span>
          </div>

          <button
            onClick={() => setSelectedColorFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              selectedColorFilter === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>Toutes ({cars.length})</span>
          </button>

          {uniqueColorList.map((col) => {
            const isSelected = selectedColorFilter.toLowerCase() === col.name.toLowerCase();
            return (
              <button
                key={col.name}
                onClick={() => setSelectedColorFilter(isSelected ? 'all' : col.name)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-400'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-slate-600 shrink-0"
                  style={{ backgroundColor: col.hexCode }}
                />
                <span>{col.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Showroom Cards & Comparative Table */}
      {filteredAndSortedCars.length === 0 ? (
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
      ) : viewMode === 'table' ? (
        /* COMPARATIVE TABLE VIEW (CLASSEMENT PRIX & GABARIT) */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Table className="w-4 h-4 text-red-500" />
                <span>Tableau Comparatif &amp; Classement Officiel Chery</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Comparatif détaillé par Prix Clé en Main, Gabarit (L × l × h), Motorisation et Acompte
              </p>
            </div>
            <div className="text-xs font-bold px-3 py-1 bg-red-600/20 text-red-300 border border-red-500/30 rounded-lg">
              {activeSortMeta.label}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16">Rang #</th>
                  <th className="py-3.5 px-4">Véhicule &amp; Catégorie</th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => setSortBy(sortBy === 'price-asc' ? 'price-desc' : 'price-asc')}>
                    <div className="flex items-center gap-1">
                      <span>Prix Clé en Main TTC</span>
                      <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Acompte Requis</th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => setSortBy(sortBy === 'size-asc' ? 'size-desc' : 'size-asc')}>
                    <div className="flex items-center gap-1">
                      <span>Dimensions &amp; Longueur</span>
                      <Ruler className="w-3 h-3 text-blue-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Segment / Gabarit</th>
                  <th className="py-3.5 px-4">Motorisation / Énergie</th>
                  <th className="py-3.5 px-4 text-center">Stock Total</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAndSortedCars.map((car, index) => {
                  const dims = getCarDimensions(car);
                  const fullPrice = getFullCarPrice(car);
                  const deposit = getFixedDepositForCar(car);
                  const totalStock = car.colors.reduce((acc, c) => acc + c.stock, 0);
                  const firstColor = car.colors[0];

                  return (
                    <tr
                      key={car.id}
                      className="hover:bg-slate-850 transition-colors group cursor-default"
                    >
                      {/* Rank # */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-mono text-xs font-black shadow ${
                            index === 0
                              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                              : index === 1
                              ? 'bg-slate-300 text-slate-950 ring-1 ring-slate-400'
                              : index === 2
                              ? 'bg-amber-700 text-white ring-1 ring-amber-600'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          #{index + 1}
                        </span>
                      </td>

                      {/* Car & Category */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.imageUrl}
                            alt={car.name}
                            className="w-14 h-10 object-cover rounded-lg border border-slate-800 bg-slate-950 shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-white text-xs group-hover:text-red-400 transition-colors">
                              {car.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.2 bg-red-900/30 text-red-300 border border-red-700/30 rounded text-[10px] font-bold">
                                {car.category}
                              </span>
                              <span className="text-[10px] text-slate-400">{car.colors.length} teintes</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price Clé en Main */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-black text-sm text-emerald-400">
                          {fullPrice.toLocaleString()} TND
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Base: {car.priceTND.toLocaleString()} TND
                        </div>
                      </td>

                      {/* Acompte */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                          {deposit.toLocaleString()} TND
                        </span>
                      </td>

                      {/* Dimensions & Longueur */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-blue-300 font-mono font-bold text-xs">
                          <Ruler className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{dims.lengthM} m</span>
                          <span className="text-[10px] text-slate-400 font-normal">({dims.lengthMm} mm)</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {dims.widthMm} × {dims.heightMm} mm
                        </div>
                      </td>

                      {/* Segment */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-300 text-[11px] rounded-lg inline-block font-medium">
                          {dims.segmentLabel}
                        </span>
                      </td>

                      {/* Motorisation */}
                      <td className="py-3 px-4">
                        <div className="text-xs text-white font-medium flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{car.engine}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{car.energy} • {car.transmission}</div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            totalStock > 3
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : totalStock > 0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {totalStock} en stock
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedSpecCar(car)}
                            title="Fiche Technique"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                          <button
                            onClick={() => onOpenReservationModal(car, firstColor)}
                            disabled={totalStock === 0}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              totalStock > 0
                                ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer shadow'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Réserver</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCars.map((car, index) => {
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
            const dims = getCarDimensions(car);
            const fullPrice = getFullCarPrice(car);

            return (
              <div
                key={car.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group relative"
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

                    {/* Top Badges: Category, Energy, Stock, Rank */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[90%]">
                      {/* Rank indicator badge */}
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[11px] font-black rounded-lg shadow-md font-mono border border-red-400/40">
                        #{index + 1}
                      </span>

                      <span className="px-2 py-0.5 bg-slate-900/90 backdrop-blur text-red-400 border border-red-500/30 text-xs font-bold rounded-lg shadow">
                        {car.category}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900/90 backdrop-blur text-slate-300 text-xs font-semibold rounded-lg shadow">
                        {car.energy}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900/90 backdrop-blur text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg shadow">
                        Stock: {totalStock}
                      </span>
                    </div>

                    {/* Bottom Car Header */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-black text-white drop-shadow-md">{car.name}</h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block drop-shadow">
                          Prix Clé en Main
                        </span>
                        <span className="text-lg font-black text-emerald-400 font-mono drop-shadow block leading-none">
                          {fullPrice.toLocaleString()} TND
                        </span>
                        <span className="text-[10px] font-bold text-amber-300 bg-slate-950/90 px-1.5 py-0.5 rounded font-mono border border-amber-500/30 inline-block mt-1 shadow">
                          Acompte: {getFixedDepositForCar(car).toLocaleString()} TND
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 space-y-3.5">
                    {/* Tech specs summary (Engine + Transmission) */}
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
                        <span className="font-extrabold text-emerald-400 block">Prix TTC Clé en Main</span>
                        <span className="text-[10px] text-slate-400">
                          {getRegistrationFeeForCar(car) > 0
                            ? `Véhicule ${car.priceTND.toLocaleString()} DT + Frais ${getRegistrationFeeForCar(car).toLocaleString()} DT`
                            : `Prix Véhicule TTC (${car.category || 'SUV'})`}
                        </span>
                      </div>
                      <span className="font-mono font-black text-xs text-emerald-300 bg-emerald-900/60 px-2 py-1 rounded-lg border border-emerald-500/40">
                        {fullPrice.toLocaleString()} DT
                      </span>
                    </div>

                    {/* Features Bullet List */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Équipements clés :</p>
                      <ul className="grid grid-cols-1 gap-1 text-xs text-slate-300">
                        {car.features.slice(0, 3).map((feat, idx) => (
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
                        <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] text-sky-400">
                          Couleur Extérieure :
                        </span>
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
                            {selectedColor.name} — {selectedColor.stock === 0 ? '0 ÉPUISÉ' : `${selectedColor.stock} en stock`}
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
