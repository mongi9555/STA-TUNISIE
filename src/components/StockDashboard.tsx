import React, { useState, useMemo } from 'react';
import { CarModel, CarColor, Reservation, CommercialUser, StockRequest } from '../types';
import { getFullCarPrice } from '../data/cheryData';
import { Search, CheckCircle2, Car, Package, Sparkles, Plus, AlertCircle, FileText, Bell, X, Sliders, AlertTriangle } from 'lucide-react';
import { TechSpecModal } from './TechSpecModal';

interface StockDashboardProps {
  cars: CarModel[];
  reservations?: Reservation[];
  stockRequests?: StockRequest[];
  currentUser?: CommercialUser;
  onOpenReservationModal: (car: CarModel, color?: CarColor) => void;
  onProcessStockRequest?: (id: string, status: 'Approuvé' | 'Refusé') => void;
  onNavigateToAdmin?: () => void;
}

export const StockDashboard: React.FC<StockDashboardProps> = ({
  cars,
  stockRequests = [],
  currentUser,
  onOpenReservationModal,
  onProcessStockRequest,
  onNavigateToAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedSpecCar, setSelectedSpecCar] = useState<CarModel | null>(null);

  // Model-based metrics (instead of color counts or reservations)
  const totalVehiclesAvailable = useMemo(() => {
    return cars.reduce((acc, car) => {
      return acc + car.colors.reduce((cAcc, col) => cAcc + col.stock, 0);
    }, 0);
  }, [cars]);

  const modelsInStock = useMemo(() => {
    return cars.filter((car) => {
      const carTotalStock = car.colors.reduce((sum, col) => sum + col.stock, 0);
      return carTotalStock > 0;
    });
  }, [cars]);

  const modelsOutOfStock = useMemo(() => {
    return cars.filter((car) => {
      const carTotalStock = car.colors.reduce((sum, col) => sum + col.stock, 0);
      return carTotalStock === 0;
    });
  }, [cars]);

  const modelsLowStock = useMemo(() => {
    return cars.filter((car) => {
      const carTotalStock = car.colors.reduce((sum, col) => sum + col.stock, 0);
      return carTotalStock > 0 && carTotalStock <= 3;
    });
  }, [cars]);

  // Filter cars logic (category, search, stock level)
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        car.name.toLowerCase().includes(term) ||
        car.category.toLowerCase().includes(term) ||
        car.energy.toLowerCase().includes(term) ||
        car.colors.some((col) => col.name.toLowerCase().includes(term) || col.hexCode.toLowerCase().includes(term));

      const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory;

      const totalStock = car.colors.reduce((sum, c) => sum + c.stock, 0);
      let matchesStock = true;
      if (stockFilter === 'in_stock') {
        matchesStock = totalStock > 3;
      } else if (stockFilter === 'low_stock') {
        matchesStock = totalStock > 0 && totalStock <= 3;
      } else if (stockFilter === 'out_of_stock') {
        matchesStock = totalStock === 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [cars, searchTerm, selectedCategory, stockFilter]);

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
                    <Sparkles className="w-3 h-3 text-amber-400" /> Alerte Stock Châssis
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

      {/* Real-time KPI Cards - Focused on Car Models */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stock Total Véhicules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Stock Total Véhicules</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{totalVehiclesAvailable}</h3>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Châssis Disponibles Réseau STA
              </p>
            </div>
            <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl">
              <Car className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Modèles en Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Modèles en Stock</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{modelsInStock.length} / {cars.length}</h3>
              <p className="text-xs text-slate-400 mt-1">Gamme Chery livrable</p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Modèles Épuisés */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Modèles Épuisés</p>
              <h3 className="text-3xl font-extrabold text-red-400 mt-1 font-mono">{modelsOutOfStock.length}</h3>
              <p className="text-xs text-slate-400 mt-1">Rupture de stock modèle</p>
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Modèles en Stock Faible */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Modèles Stock Faible</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">{modelsLowStock.length}</h3>
              <p className="text-xs text-slate-400 mt-1">≤ 3 unités restantes</p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher modèle (Tiggo, Arrizo, Omoda, PHEV...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
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

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium cursor-pointer"
            >
              <option value="all">Toutes Catégories ({cars.length})</option>
              <option value="SUV">SUV</option>
              <option value="Berline">Berline</option>
              <option value="Pick-up">Pick-up</option>
              <option value="Hybride">Hybride / PHEV</option>
              <option value="Électrique">Électrique</option>
            </select>

            {/* Stock Level Filter */}
            <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-medium">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  stockFilter === 'all' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStockFilter('in_stock')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  stockFilter === 'in_stock' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                En Stock
              </button>
              <button
                onClick={() => setStockFilter('low_stock')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  stockFilter === 'low_stock' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stock Faible
              </button>
              <button
                onClick={() => setStockFilter('out_of_stock')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  stockFilter === 'out_of_stock' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Épuisé
              </button>
            </div>
          </div>
        </div>
      </div>

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
                    Stock Modèle : {totalCarStock} unit.
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">{car.name}</h3>
                    <p className="text-xs text-slate-300">{car.engine} • {car.transmission}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider">Prix Clé en Main</span>
                    <span className="text-lg font-black text-emerald-400 font-mono leading-none block">
                      {getFullCarPrice(car).toLocaleString()} TND
                    </span>
                  </div>
                </div>
              </div>

              {/* Nomenclature des couleurs & Stock Detail Section */}
              <div className="p-4 bg-slate-900 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <span>Nomenclature des Teintes & Disponibilité</span>
                      <span className="text-[10px] text-slate-500 font-normal">({car.colors.length} teintes constructeur)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 italic">Garantie {car.guarantee}</span>
                  </div>

                  {/* Color Cards Grid with full nomenclature */}
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
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-400 block leading-tight">
                                Couleur Extérieure :
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-white truncate">{color.name}</p>
                              <div className="flex items-center gap-1.5 flex-wrap text-xs mt-1">
                                <span className="text-slate-400 font-mono text-[11px] bg-slate-900 px-1 py-0.5 rounded border border-slate-800">{color.hexCode}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-amber-300 font-bold text-xs bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/40 inline-flex items-center gap-1">
                                  <span className="text-slate-300 font-medium">Intérieur :</span>
                                  <span>{color.interiorColor || 'Noir'}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stock pill */}
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reservation Action Button for whole car */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
                  <button
                    onClick={() => onOpenReservationModal(car)}
                    disabled={totalCarStock === 0}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow ${
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
