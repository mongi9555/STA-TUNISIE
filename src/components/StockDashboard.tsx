import React, { useState } from 'react';
import { CarModel, CarColor, Reservation, CommercialUser, StockRequest } from '../types';
import { getFullCarPrice, getRegistrationFeeForCar } from '../data/cheryData';
import { Search, Filter, AlertTriangle, CheckCircle2, Car, Package, Sparkles, Plus, AlertCircle, RefreshCw, FileText, ShieldCheck, Bell, Clock, Megaphone, X, ArrowRight, Sliders } from 'lucide-react';
import { TechSpecModal } from './TechSpecModal';

interface StockDashboardProps {
  cars: CarModel[];
  reservations: Reservation[];
  stockRequests?: StockRequest[];
  currentUser?: CommercialUser;
  onOpenReservationModal: (car: CarModel, color?: CarColor) => void;
  onResetStockToDefault?: () => void;
  onProcessStockRequest?: (id: string, status: 'Approuvé' | 'Refusé') => void;
  onNavigateToAdmin?: () => void;
}

export const StockDashboard: React.FC<StockDashboardProps> = ({
  cars,
  reservations,
  stockRequests = [],
  currentUser,
  onOpenReservationModal,
  onResetStockToDefault,
  onProcessStockRequest,
  onNavigateToAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [selectedSpecCar, setSelectedSpecCar] = useState<CarModel | null>(null);

  // Metrics
  const totalVehiclesAvailable = cars.reduce((acc, car) => {
    return acc + car.colors.reduce((cAcc, col) => cAcc + col.stock, 0);
  }, 0);

  const totalColorsCount = cars.reduce((acc, car) => acc + car.colors.length, 0);

  const lowStockColors = cars.flatMap(car => 
    car.colors.filter(col => col.stock > 0 && col.stock <= 2).map(col => ({ car, color: col }))
  );

  const outOfStockColors = cars.flatMap(car => 
    car.colors.filter(col => col.stock === 0).map(col => ({ car, color: col }))
  );

  const totalReservations = reservations.length;

  // Filter cars logic
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.colors.some((col) => col.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'in_stock') {
      matchesStock = car.colors.some((col) => col.stock > 2);
    } else if (stockFilter === 'low_stock') {
      matchesStock = car.colors.some((col) => col.stock > 0 && col.stock <= 2);
    } else if (stockFilter === 'out_of_stock') {
      matchesStock = car.colors.some((col) => col.stock === 0);
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* SYSTÈME DE NOTIFICATION AUTOMATIQUE - DEMANDES DE STOCK */}
      {stockRequests.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/50 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl shrink-0 relative mt-0.5">
                <Bell className="w-6 h-6 animate-bounce" />
                {stockRequests.filter((r) => r.status === 'En attente').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-black rounded-full uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Alerte Automatique
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {stockRequests.filter((r) => r.status === 'En attente').length} demande(s) en attente de validation
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white mt-1 flex items-center gap-2">
                  <span>Dernière demande transmise :</span>
                  <span className="text-red-400 font-black">{stockRequests[0].carName}</span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-lg border border-blue-500/30">
                    +{stockRequests[0].requestedQuantity} Réservations
                  </span>
                </h4>

                <p className="text-xs text-slate-300 mt-1">
                  Par <strong>{stockRequests[0].commercialName}</strong> ({stockRequests[0].commercialAgency || 'Agence Chery'}) • Transmis le {new Date(stockRequests[0].createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
                <>
                  {stockRequests[0].status === 'En attente' && onProcessStockRequest && (
                    <button
                      type="button"
                      onClick={() => onProcessStockRequest(stockRequests[0].id, 'Approuvé')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approuver (+{stockRequests[0].requestedQuantity})</span>
                    </button>
                  )}
                  {onNavigateToAdmin && (
                    <button
                      type="button"
                      onClick={onNavigateToAdmin}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-950 cursor-pointer transition-all"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Espace Administration</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Real-time KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Available */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Stock Total Disponible</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{totalVehiclesAvailable}</h3>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Réseau Chery Tunisie
              </p>
            </div>
            <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl">
              <Car className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Couleurs en Stock Faible</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">{lowStockColors.length}</h3>
              <p className="text-xs text-slate-400 mt-1">≤ 2 unités restantes</p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Out of Stock Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Couleurs Épuisées</p>
              <h3 className="text-3xl font-extrabold text-red-400 mt-1 font-mono">{outOfStockColors.length}</h3>
              <p className="text-xs text-slate-400 mt-1">Réapprovisionnement requis</p>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Active Reservations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Réservations Enregistrées</p>
              <h3 className="text-3xl font-extrabold text-blue-400 mt-1 font-mono">{totalReservations}</h3>
              <p className="text-xs text-blue-300 font-medium mt-1">Commerciaux Chery TN</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert Banner if any */}
      {outOfStockColors.length > 0 && (
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-800/60 rounded-2xl p-4 text-red-200 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600/30 text-red-400 rounded-lg shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-red-300">Alerte Stock Épuisé sur certaines teintes :</h4>
              <p className="text-slate-300 mt-0.5">
                {outOfStockColors.map((item, idx) => (
                  <span key={idx} className="mr-3 inline-flex items-center gap-1 font-mono">
                    • <strong className="text-white">{item.car.name}</strong> ({item.color.name})
                  </span>
                ))}
              </p>
            </div>
          </div>
          <button
            onClick={() => setStockFilter('out_of_stock')}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shadow"
          >
            Filtrer teintes épuisées
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher modèle ou couleur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            >
              <option value="all">Toutes Catégories</option>
              <option value="SUV">SUV</option>
              <option value="Berline">Berline</option>
              <option value="Crossover">Crossover</option>
            </select>

            {/* Stock Level Filter */}
            <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-medium">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  stockFilter === 'all' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStockFilter('in_stock')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  stockFilter === 'in_stock' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                En Stock (&gt;2)
              </button>
              <button
                onClick={() => setStockFilter('low_stock')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  stockFilter === 'low_stock' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stock Faible (1-2)
              </button>
              <button
                onClick={() => setStockFilter('out_of_stock')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  stockFilter === 'out_of_stock' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Épuisé (0)
              </button>
            </div>

            {/* Reset Stock Button */}
            {onResetStockToDefault && (
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                title="Annuler les modifications et restaurer le stock par défaut"
                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-red-400" />
                <span>Annuler Modifs Stock (Par Défaut)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Stock */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Annuler les modifications de stock ?</h3>
                <p className="text-xs text-slate-400">Cette action réinitialisera le stock de tous les véhicules Chery aux valeurs par défaut initiales.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              ⚡ Tous les ajustements manuels de stock seront annulés et synchronisés avec la base de données.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onResetStockToDefault?.();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurer le Stock par Défaut</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Matrix per Car Model */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCars.map((car) => {
          const totalCarStock = car.colors.reduce((acc, c) => acc + c.stock, 0);

          return (
            <div
              key={car.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md hover:border-slate-700 transition-all flex flex-col"
            >
              {/* Car Header & Image */}
              <div
                onClick={() => setSelectedSpecCar(car)}
                title="Cliquer pour afficher la Fiche Technique Flottante (PDF / Image)"
                className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer group/img"
              >
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Hover Overlay Badge for Tech Specs */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-2 bg-red-600/90 backdrop-blur text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-2 border border-red-400/50 transform translate-y-2 group-hover/img:translate-y-0 transition-all">
                    <FileText className="w-4 h-4" />
                    <span>Fiche Technique (PDF / Image)</span>
                  </span>
                </div>

                <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap max-w-[70%]">
                  <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur text-red-400 border border-red-500/30 text-xs font-bold rounded-lg shadow">
                    {car.category}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur text-slate-300 text-xs font-semibold rounded-lg shadow">
                    {car.energy}
                  </span>
                  {currentUser && (() => {
                    const quotaPerModel = currentUser.quotaPerModel || 5;
                    const count = reservations.filter(
                      (r) =>
                        (r.commercialId === currentUser.id || r.commercialName === currentUser.name) &&
                        r.carId === car.id &&
                        r.status !== 'Annulée'
                    ).length;
                    const reached = count >= quotaPerModel;
                    return (
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow backdrop-blur flex items-center gap-1 border ${
                        reached
                          ? 'bg-rose-950/90 text-rose-300 border-rose-500/60'
                          : count > 0
                          ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Quota: {count}/{quotaPerModel}
                      </span>
                    );
                  })()}
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-extrabold rounded-lg shadow font-mono ${
                      totalCarStock > 5
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : totalCarStock > 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    Stock Total : {totalCarStock} unit.
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">{car.name}</h3>
                    <p className="text-xs text-slate-300">{car.engine} • {car.transmission}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider">Prix Complet Clé en Main</span>
                    <span className="text-lg font-black text-emerald-400 font-mono leading-none block">
                      {getFullCarPrice(car).toLocaleString()} TND
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      (Base {car.priceTND.toLocaleString()} DT + Frais 1 000 DT)
                    </span>
                  </div>
                </div>
              </div>

              {/* Colors Stock Detail Section */}
              <div className="p-4 bg-slate-900 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <span>Disponibilités & Codes Couleurs</span>
                      <span className="text-[10px] text-slate-500 font-normal">({car.colors.length} teintes disponibles)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 italic">Garantie {car.guarantee}</span>
                  </div>

                  {/* Color Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {car.colors.map((color) => {
                      const isOutOfStock = color.stock === 0;
                      const isLowStock = color.stock > 0 && color.stock <= 2;

                      return (
                        <div
                          key={color.id}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                            isOutOfStock
                              ? 'bg-red-950/20 border-red-900/40 text-slate-400 opacity-80'
                              : isLowStock
                              ? 'bg-amber-950/20 border-amber-800/40 text-slate-100'
                              : 'bg-slate-950 border-slate-800 text-slate-100 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Color Swatch Circle */}
                            <div
                              className="w-6 h-6 rounded-full border-2 border-slate-700 shadow-inner shrink-0 relative"
                              style={{ backgroundColor: color.hexCode }}
                              title={`${color.name} (${color.hexCode})`}
                            >
                              {color.hexCode.toUpperCase() === '#FFFFFF' && (
                                <span className="absolute inset-0 rounded-full border border-slate-300/40 pointer-events-none" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{color.name}</p>
                              <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                                <span className="text-slate-400 font-mono">{color.hexCode}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-amber-300 font-medium">Intérieur: {color.interiorColor || 'Noir Cuir'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Stock pill & Action */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md font-mono ${
                                isOutOfStock
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : isLowStock
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {isOutOfStock ? '0 Épuisé' : `${color.stock} dispo`}
                            </span>

                            {!isOutOfStock && (
                              <button
                                onClick={() => onOpenReservationModal(car, color)}
                                title={`Réserver ${car.name} en ${color.name}`}
                                className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interior Colors Display */}
                  {car.interiorColors && car.interiorColors.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800">
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Finitions & Couleurs Intérieures Disponibles</span>
                        <span className="text-[10px] text-slate-400 font-normal">({car.interiorColors.length} options)</span>
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {car.interiorColors.map((intCol) => (
                          <div
                            key={intCol.id}
                            className="flex items-center gap-1.5 bg-slate-950 border border-amber-500/20 px-2 py-1 rounded-lg text-xs"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-md border border-slate-600 shrink-0"
                              style={{ backgroundColor: intCol.hexCode }}
                            />
                            <span className="text-slate-200 font-medium text-[11px]">{intCol.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reservation Action Button for whole car */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Acompte recommandé: <strong className="text-slate-200 font-mono">2,000 TND</strong>
                  </span>
                  <button
                    onClick={() => onOpenReservationModal(car)}
                    disabled={totalCarStock === 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow ${
                      totalCarStock > 0
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer Réservation Client</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Tech Spec Sheet Modal */}
      <TechSpecModal
        car={selectedSpecCar}
        onClose={() => setSelectedSpecCar(null)}
        onOpenReservationModal={onOpenReservationModal}
      />
    </div>
  );
};
