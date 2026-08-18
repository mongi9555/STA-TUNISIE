import React, { useState } from 'react';
import {
  DocumentTemplateConfig,
  CarModel,
  CarAccessory,
  CustomQuote,
  CommercialUser,
  ClientInfo,
  VehicleConfiguration,
} from '../types';
import {
  FileCheck,
  Building,
  Printer,
  Download,
  Plus,
  Trash2,
  Edit,
  Save,
  FileText,
  DollarSign,
  Car,
  Sliders,
  CheckCircle2,
  Calendar,
  Sparkles,
  Share2,
  X,
  UserCheck,
  Palette,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentQuoteCustomizerProps {
  templateConfig: DocumentTemplateConfig;
  onSaveTemplateConfig: (config: DocumentTemplateConfig) => void;
  cars: CarModel[];
  accessories: CarAccessory[];
  quotes: CustomQuote[];
  onSaveQuote: (quote: CustomQuote) => void;
  onDeleteQuote: (quoteId: string) => void;
  currentUser: CommercialUser;
  theme: 'dark' | 'light' | 'red';
  onConvertToReservation?: (quote: CustomQuote) => void;
  initialConfigToQuote?: VehicleConfiguration | null;
}

export const DocumentQuoteCustomizer: React.FC<DocumentQuoteCustomizerProps> = ({
  templateConfig,
  onSaveTemplateConfig,
  cars,
  accessories,
  quotes,
  onSaveQuote,
  onDeleteQuote,
  currentUser,
  theme,
  onConvertToReservation,
  initialConfigToQuote,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quotes_list' | 'create_quote' | 'settings'>('quotes_list');
  const [editingConfig, setEditingConfig] = useState<DocumentTemplateConfig>(templateConfig);

  // Quote Creator State
  const [selectedCar, setSelectedCar] = useState<CarModel>(cars[0] || null);
  const [selectedColorId, setSelectedColorId] = useState<string>(cars[0]?.colors[0]?.id || '');
  const [selectedInteriorId, setSelectedInteriorId] = useState<string>(cars[0]?.interiorColors?.[0]?.id || '');
  const [isCustomInteriorQuote, setIsCustomInteriorQuote] = useState(false);
  const [customInteriorQuoteName, setCustomInteriorQuoteName] = useState('');
  const [customInteriorQuoteHex, setCustomInteriorQuoteHex] = useState('#78350F');
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);
  const [discountTND, setDiscountTND] = useState<number>(0);
  const [registrationFeeTND, setRegistrationFeeTND] = useState<number>(templateConfig.defaultRegistrationFeeTND ?? 0);

  // Client Info State
  const [clientType, setClientType] = useState<'personne_physique' | 'societe'>('personne_physique');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [cin, setCin] = useState('');
  const [ville, setVille] = useState('Tunis');
  const [telephone, setTelephone] = useState('+216 ');
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');

  const [raisonSociale, setRaisonSociale] = useState('');
  const [matriculeFiscale, setMatriculeFiscale] = useState('');
  const [gerantNomPrenom, setGerantNomPrenom] = useState('');

  // Active Quote Preview Modal
  const [activeQuoteForPreview, setActiveQuoteForPreview] = useState<CustomQuote | null>(null);

  const isUserAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  // If preselected from Vehicle Configurator
  React.useEffect(() => {
    if (initialConfigToQuote && cars.length > 0) {
      const car = cars.find((c) => c.id === initialConfigToQuote.carId) || cars[0];
      setSelectedCar(car);
      setSelectedColorId(initialConfigToQuote.colorId);
      if (initialConfigToQuote.interiorColorId) {
        setSelectedInteriorId(initialConfigToQuote.interiorColorId);
      }
      setSelectedAccessoryIds(initialConfigToQuote.selectedAccessories.map((a) => a.id));
      setDiscountTND(initialConfigToQuote.customDiscountTND || 0);
      setRegistrationFeeTND(initialConfigToQuote.registrationFeeTND ?? 0);
      setActiveSubTab('create_quote');
    }
  }, [initialConfigToQuote, cars]);

  // Handle Car Switch in Quote Creator
  const handleCarChange = (carId: string) => {
    const car = cars.find((c) => c.id === carId);
    if (!car) return;
    setSelectedCar(car);
    setSelectedColorId(car.colors[0]?.id || '');
    setSelectedInteriorId(car.interiorColors?.[0]?.id || '');
  };

  // Financial Calculations
  const selectedColor = selectedCar?.colors.find((c) => c.id === selectedColorId) || selectedCar?.colors[0];
  const selectedInterior = isCustomInteriorQuote
    ? {
        id: 'int-custom',
        name: customInteriorQuoteName.trim() || 'Habillage Personnalisé',
        hexCode: customInteriorQuoteHex,
        stock: 99,
        reserved: 0,
      }
    : selectedCar?.interiorColors?.find((i) => i.id === selectedInteriorId) || selectedCar?.interiorColors?.[0];
  const chosenAccessories = accessories.filter((a) => selectedAccessoryIds.includes(a.id));

  const basePriceTND = selectedCar?.priceTND || 0;
  const accessoriesPriceTND = chosenAccessories.reduce((sum, a) => sum + a.priceTND, 0);
  const grossTotalTND = basePriceTND + accessoriesPriceTND - discountTND;

  // Reverse engineer HT and TVA
  const tvaRate = (templateConfig.tvaPercentage || 19) / 100;
  const subtotalHT = grossTotalTND / (1 + tvaRate);
  const tvaAmount = grossTotalTND - subtotalHT;
  const droitDeTimbre = templateConfig.droitDeTimbreTND || 1.0;
  const finalNetToPayTTC = grossTotalTND + droitDeTimbre + registrationFeeTND;

  const handleCreateQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    const today = new Date().toISOString().split('T')[0];
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + (templateConfig.validityDays || 30));
    const validUntilStr = validUntilDate.toISOString().split('T')[0];

    const clientInfo: ClientInfo = {
      type: clientType,
      personnePhysique:
        clientType === 'personne_physique'
          ? {
              nom,
              prenom,
              cin,
              ville,
              telephone,
              email,
              adresse,
            }
          : undefined,
      societe:
        clientType === 'societe'
          ? {
              raisonSociale,
              matriculeFiscale,
              gerantNomPrenom,
              gerantCin: cin,
              ville,
              telephone,
              email,
              adresse,
            }
          : undefined,
    };

    const newQuote: CustomQuote = {
      id: `DEV-${Date.now()}`,
      quoteNumber: `DEV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: today,
      validUntil: validUntilStr,
      commercialName: currentUser.name,
      agency: currentUser.agency,
      client: clientInfo,
      config: {
        carId: selectedCar.id,
        carName: selectedCar.name,
        colorId: selectedColor?.id || '',
        colorName: selectedColor?.name || 'Inconnue',
        colorHex: selectedColor?.hexCode || '#000000',
        interiorColorId: selectedInterior?.id,
        interiorColorName: selectedInterior?.name,
        interiorColorHex: selectedInterior?.hexCode,
        selectedAccessories: chosenAccessories,
        customDiscountTND: discountTND,
        registrationFeeTND,
        basePriceTND,
        accessoriesPriceTND,
        totalTND: finalNetToPayTTC,
      },
      financials: {
        basePriceHT: basePriceTND / (1 + tvaRate),
        accessoriesHT: accessoriesPriceTND / (1 + tvaRate),
        discountTND,
        subtotalHT,
        tvaAmount,
        droitDeTimbre,
        registrationFee: registrationFeeTND,
        totalTTC: finalNetToPayTTC,
      },
      notes: templateConfig.quoteHeaderNote,
    };

    onSaveQuote(newQuote);
    setActiveQuoteForPreview(newQuote);
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTemplateConfig(editingConfig);
  };

  const cardBgClass =
    theme === 'light'
      ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
      : 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl';

  const inputBgClass =
    theme === 'light'
      ? 'bg-slate-100 border-slate-300 text-slate-900'
      : 'bg-slate-950 border-slate-800 text-white';

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className={`p-6 rounded-2xl border ${cardBgClass} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-950/40 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Personnalisation des Documents & Devis</h2>
            <p className="text-xs text-slate-400 mt-1">
              Générez des offres de prix officielles Chery Tunisie avec calculs financiers automatiques (TVA 19%, Droit de timbre, Accessoires, Immatriculation) et personnalisez l'en-tête de votre entreprise.
            </p>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab('quotes_list')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'quotes_list'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" /> Historique ({quotes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('create_quote')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'create_quote'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" /> Créer un Devis
          </button>
          {isUserAdmin && (
            <button
              onClick={() => setActiveSubTab('settings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'settings'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" /> Réglages Document STA
            </button>
          )}
        </div>
      </div>

      {/* --- SUB TAB 1: QUOTES HISTORIC LIST --- */}
      {activeSubTab === 'quotes_list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((quote) => {
              const clientName =
                quote.client.type === 'personne_physique'
                  ? `${quote.client.personnePhysique?.prenom} ${quote.client.personnePhysique?.nom}`
                  : quote.client.societe?.raisonSociale;

              return (
                <motion.div
                  key={quote.id}
                  whileHover={{ y: -2 }}
                  className={`p-5 rounded-2xl border ${cardBgClass} space-y-4 flex flex-col justify-between hover:border-red-500/50 transition`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        {quote.quoteNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{quote.date}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base">{quote.config.carName}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Client: <span className="font-bold text-slate-200">{clientName}</span>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Couleur :</span>
                        <span className="font-semibold flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border"
                            style={{ backgroundColor: quote.config.colorHex }}
                          />
                          {quote.config.colorName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Accessoires ({quote.config.selectedAccessories.length}) :</span>
                        <span className="font-semibold">{quote.config.accessoriesPriceTND.toLocaleString()} TND</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-800 text-amber-400 font-extrabold">
                        <span>Net Total TTC :</span>
                        <span className="font-mono text-sm">{quote.financials.totalTTC.toLocaleString()} TND</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => setActiveQuoteForPreview(quote)}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Printer className="w-3.5 h-3.5" /> Imprimer / PDF
                    </button>

                    {onConvertToReservation && (
                      <button
                        onClick={() => onConvertToReservation(quote)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                        title="Créer une Réservation à partir de ce Devis"
                      >
                        <Car className="w-3.5 h-3.5" /> Réserver
                      </button>
                    )}

                    {isUserAdmin && (
                      <button
                        onClick={() => onDeleteQuote(quote.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition cursor-pointer"
                        title="Supprimer le devis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {quotes.length === 0 && (
              <div className={`col-span-full p-12 text-center rounded-2xl border ${cardBgClass} space-y-3`}>
                <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                <h4 className="font-bold text-base">Aucun devis enregistré</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Vous n'avez pas encore généré de devis personnalisé. Cliquez sur "Créer un Devis" pour éditer une offre de prix officielle.
                </p>
                <button
                  onClick={() => setActiveSubTab('create_quote')}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Créer un Devis
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUB TAB 2: CREATE DEVIS FORM --- */}
      {activeSubTab === 'create_quote' && (
        <form onSubmit={handleCreateQuoteSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Client & Vehicle Customization */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Client Details Section */}
            <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-red-500" /> Informations du Client Destinataire
                </h3>
                <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setClientType('personne_physique')}
                    className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                      clientType === 'personne_physique' ? 'bg-red-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Personne Physique
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('societe')}
                    className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                      clientType === 'societe' ? 'bg-red-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Société / Entreprise
                  </button>
                </div>
              </div>

              {clientType === 'personne_physique' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Nom :</label>
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Ben Ammar"
                      className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Prénom :</label>
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Mohamed"
                      className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Numéro CIN (8 chiffres) :</label>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      value={cin}
                      onChange={(e) => setCin(e.target.value)}
                      placeholder="08765432"
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Téléphone Portable :</label>
                    <input
                      type="text"
                      required
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+216 22 100 200"
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Adresse Email :</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Ville / Gouvernorat :</label>
                    <input
                      type="text"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      placeholder="Tunis"
                      className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Raison Sociale Société :</label>
                    <input
                      type="text"
                      required
                      value={raisonSociale}
                      onChange={(e) => setRaisonSociale(e.target.value)}
                      placeholder="STE TRANSPORT SERVICES SARL"
                      className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Matricule Fiscale Tunisie :</label>
                    <input
                      type="text"
                      required
                      value={matriculeFiscale}
                      onChange={(e) => setMatriculeFiscale(e.target.value)}
                      placeholder="1489203/A/M/000"
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Nom & Prénom du Gérant :</label>
                    <input
                      type="text"
                      value={gerantNomPrenom}
                      onChange={(e) => setGerantNomPrenom(e.target.value)}
                      placeholder="Hassan Gharbi"
                      className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Téléphone de la Société :</label>
                    <input
                      type="text"
                      required
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+216 71 300 400"
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Vehicle Selection & Customization */}
            <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
              <h3 className="font-extrabold text-base flex items-center gap-2 border-b border-slate-800 pb-3">
                <Car className="w-5 h-5 text-red-500" /> Choix du Modèle Chery & Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Modèle de Véhicule :</label>
                  <select
                    value={selectedCar?.id}
                    onChange={(e) => handleCarChange(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border font-bold cursor-pointer ${inputBgClass}`}
                  >
                    {cars.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.priceTND.toLocaleString()} TND ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Couleur Extérieure :</label>
                  <select
                    value={selectedColorId}
                    onChange={(e) => setSelectedColorId(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border font-semibold cursor-pointer ${inputBgClass}`}
                  >
                    {selectedCar?.colors.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name} (Stock: {col.stock - col.reserved})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interior Color & Sellerie Selection */}
              <div className="p-3 bg-slate-900/50 dark:bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Couleur Intérieure & Sellerie :</span>
                    {selectedInterior && (
                      <span className="font-semibold text-white ml-1">({selectedInterior.name})</span>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomInteriorQuote(!isCustomInteriorQuote);
                      if (!isCustomInteriorQuote && !customInteriorQuoteName) {
                        setCustomInteriorQuoteName('Cuir Marron Cognac');
                      }
                    }}
                    className="text-[10px] font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
                  >
                    {isCustomInteriorQuote ? 'Choisir dans le catalogue' : '✍️ Définir Manuellement'}
                  </button>
                </div>

                {isCustomInteriorQuote ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={customInteriorQuoteName}
                        onChange={(e) => setCustomInteriorQuoteName(e.target.value)}
                        placeholder="ex: Cuir Marron Cognac, Beige Nappa, Alcantara Sport..."
                        className={`w-full p-2 rounded-lg border text-xs font-semibold ${inputBgClass}`}
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {['Noir', 'Cuir Marron Cognac', 'Beige Nappa & Sable', 'Rouge Sport & Noir', 'Gris Anthracite', 'Camel Luxe'].map((sug) => (
                          <button
                            type="button"
                            key={sug}
                            onClick={() => setCustomInteriorQuoteName(sug)}
                            className="text-[9px] px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={customInteriorQuoteHex}
                          onChange={(e) => setCustomInteriorQuoteHex(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-300 font-bold">{customInteriorQuoteHex}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <select
                    value={selectedInteriorId}
                    onChange={(e) => {
                      setSelectedInteriorId(e.target.value);
                      setIsCustomInteriorQuote(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border font-semibold text-xs cursor-pointer ${inputBgClass}`}
                  >
                    {selectedCar?.interiorColors?.map((intCol) => (
                      <option key={intCol.id} value={intCol.id}>
                        {intCol.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Accessories Checklist */}
              <div>
                <label className="font-bold text-xs block mb-2">Accessoires Officiels Chery à ajouter au devis :</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accessories.map((acc) => {
                    const isChecked = selectedAccessoryIds.includes(acc.id);
                    return (
                      <label
                        key={acc.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedAccessoryIds(selectedAccessoryIds.filter((id) => id !== acc.id));
                          } else {
                            setSelectedAccessoryIds([...selectedAccessoryIds, acc.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isChecked
                            ? 'bg-red-600/10 border-red-500 text-white'
                            : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="w-4 h-4 accent-red-600 rounded"
                          />
                          <div>
                            <p className="font-bold text-xs">{acc.name}</p>
                            <p className="text-[10px] text-slate-400">{acc.category}</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs text-amber-400">
                          +{acc.priceTND} TND
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Financial Summary & Submit */}
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${cardBgClass} space-y-4`}>
              <h3 className="font-extrabold text-base flex items-center gap-2 border-b border-slate-800 pb-3">
                <DollarSign className="w-5 h-5 text-amber-400" /> Calcul Financier Officiel
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Remise Commerciale Exceptionnelle (TND) :</label>
                  <input
                    type="number"
                    min={0}
                    value={discountTND}
                    onChange={(e) => setDiscountTND(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border font-mono font-bold text-amber-400 ${inputBgClass}`}
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Frais d'Immatriculation & Carte Grise (TND) :</label>
                  <input
                    type="number"
                    min={0}
                    value={registrationFeeTND}
                    onChange={(e) => setRegistrationFeeTND(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prix Véhicule TTC :</span>
                    <span>{basePriceTND.toLocaleString()} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Accessoires TTC :</span>
                    <span>+{accessoriesPriceTND.toLocaleString()} TND</span>
                  </div>
                  {discountTND > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Remise Accordée :</span>
                      <span>-{discountTND.toLocaleString()} TND</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-slate-300">
                    <span>Base Hors Taxes (HT) :</span>
                    <span>{Math.round(subtotalHT).toLocaleString()} TND</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>TVA (19%) :</span>
                    <span>+{Math.round(tvaAmount).toLocaleString()} TND</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Droit de Timbre :</span>
                    <span>+{droitDeTimbre.toFixed(3)} TND</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Frais Immatriculation ATTT :</span>
                    <span>+{registrationFeeTND.toLocaleString()} TND</span>
                  </div>

                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg flex items-center justify-between font-bold text-sm text-amber-300 mt-2">
                    <span>NET À PAYER TTC :</span>
                    <span className="text-base text-white">{Math.round(finalNetToPayTTC).toLocaleString()} TND</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <CheckCircle2 className="w-5 h-5" /> Générer & Enregistrer le Devis
              </button>
            </div>
          </div>
        </form>
      )}

      {/* --- SUB TAB 3: SETTINGS --- */}
      {activeSubTab === 'settings' && isUserAdmin && (
        <form onSubmit={handleSaveSettingsSubmit} className={`p-6 rounded-2xl border ${cardBgClass} space-y-4 max-w-2xl mx-auto`}>
          <h3 className="font-extrabold text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-5 h-5 text-amber-500" /> Paramètres des Documents Officiels STA
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold block mb-1">Raison Sociale de l'Entreprise :</label>
              <input
                type="text"
                required
                value={editingConfig.companyName}
                onChange={(e) => setEditingConfig({ ...editingConfig, companyName: e.target.value })}
                className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Matricule Fiscale STA :</label>
                <input
                  type="text"
                  required
                  value={editingConfig.matriculeFiscale}
                  onChange={(e) => setEditingConfig({ ...editingConfig, matriculeFiscale: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Téléphone Siège :</label>
                <input
                  type="text"
                  required
                  value={editingConfig.phone}
                  onChange={(e) => setEditingConfig({ ...editingConfig, phone: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Adresse Officielle Siège STA :</label>
              <input
                type="text"
                required
                value={editingConfig.address}
                onChange={(e) => setEditingConfig({ ...editingConfig, address: e.target.value })}
                className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold block mb-1">Taux TVA (%) :</label>
                <input
                  type="number"
                  value={editingConfig.tvaPercentage}
                  onChange={(e) => setEditingConfig({ ...editingConfig, tvaPercentage: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Droit de Timbre (TND) :</label>
                <input
                  type="number"
                  step={0.1}
                  value={editingConfig.droitDeTimbreTND}
                  onChange={(e) => setEditingConfig({ ...editingConfig, droitDeTimbreTND: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Validité Devis (Jours) :</label>
                <input
                  type="number"
                  value={editingConfig.validityDays}
                  onChange={(e) => setEditingConfig({ ...editingConfig, validityDays: Number(e.target.value) })}
                  className={`w-full p-2.5 rounded-xl border font-mono ${inputBgClass}`}
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Notes des Conditions Générales de Vente (Pied de Devis) :</label>
              <textarea
                rows={3}
                value={editingConfig.quoteFooterTerms}
                onChange={(e) => setEditingConfig({ ...editingConfig, quoteFooterTerms: e.target.value })}
                className={`w-full p-2.5 rounded-xl border ${inputBgClass}`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Enregistrer les Paramètres du Document
          </button>
        </form>
      )}

      {/* --- PRINTABLE DEVIS MODAL --- */}
      <AnimatePresence>
        {activeQuoteForPreview && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8"
            >
              {/* Modal Top Actions */}
              <div className="flex items-center justify-between border-b pb-4 print:hidden">
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  Aperçu Devis Officiel Chery
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 cursor-pointer shadow"
                  >
                    <Printer className="w-4 h-4" /> Imprimer / Imprimer en PDF
                  </button>
                  <button
                    onClick={() => setActiveQuoteForPreview(null)}
                    className="p-2 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Content Block */}
              <div className="p-6 border border-slate-200 rounded-xl space-y-6 print:border-none print:p-0">
                {/* Header Brand */}
                <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-red-700 tracking-tight">
                      {templateConfig.companyName}
                    </h2>
                    <p className="text-xs text-slate-600 font-medium mt-1">{templateConfig.address}</p>
                    <p className="text-xs text-slate-600">Matricule Fiscale : {templateConfig.matriculeFiscale}</p>
                    <p className="text-xs text-slate-600">Tél : {templateConfig.phone} | Email : {templateConfig.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-slate-900">OFFRE DE PRIX / DEVIS</span>
                    <p className="text-xs font-mono font-bold text-red-600 mt-1">{activeQuoteForPreview.quoteNumber}</p>
                    <p className="text-xs text-slate-500 mt-1">Date : {activeQuoteForPreview.date}</p>
                    <p className="text-xs text-slate-500">Valable jusqu'au : {activeQuoteForPreview.validUntil}</p>
                  </div>
                </div>

                {/* Commercial & Client Box */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-extrabold text-red-700 uppercase">Conseiller Commercial STA :</p>
                    <p className="font-bold">{activeQuoteForPreview.commercialName}</p>
                    <p className="text-slate-600">{activeQuoteForPreview.agency}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-extrabold text-red-700 uppercase">Destinataire Client :</p>
                    {activeQuoteForPreview.client.type === 'personne_physique' ? (
                      <>
                        <p className="font-bold">
                          {activeQuoteForPreview.client.personnePhysique?.prenom} {activeQuoteForPreview.client.personnePhysique?.nom}
                        </p>
                        <p className="text-slate-600">CIN : {activeQuoteForPreview.client.personnePhysique?.cin}</p>
                        <p className="text-slate-600">Tél : {activeQuoteForPreview.client.personnePhysique?.telephone}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold">{activeQuoteForPreview.client.societe?.raisonSociale}</p>
                        <p className="text-slate-600">MF : {activeQuoteForPreview.client.societe?.matriculeFiscale}</p>
                        <p className="text-slate-600">Tél : {activeQuoteForPreview.client.societe?.telephone}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Table of items */}
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-y border-slate-300">
                      <th className="py-2.5 px-3">Désignation</th>
                      <th className="py-2.5 px-3">Détails / Options</th>
                      <th className="py-2.5 px-3 text-right">Prix Total TTC (TND)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-2.5 px-3 font-bold">{activeQuoteForPreview.config.carName}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        Couleur: {activeQuoteForPreview.config.colorName}
                        {activeQuoteForPreview.config.interiorColorName && ` | Intérieur: ${activeQuoteForPreview.config.interiorColorName}`}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {activeQuoteForPreview.config.basePriceTND.toLocaleString()} TND
                      </td>
                    </tr>
                    {activeQuoteForPreview.config.selectedAccessories.map((acc, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-medium text-slate-700">Accessoire: {acc.name}</td>
                        <td className="py-2 px-3 text-slate-500">{acc.category}</td>
                        <td className="py-2 px-3 text-right font-mono">+{acc.priceTND.toLocaleString()} TND</td>
                      </tr>
                    ))}
                    {activeQuoteForPreview.financials.discountTND > 0 && (
                      <tr className="text-emerald-700 font-bold">
                        <td className="py-2 px-3">Remise Commerciale Exceptionnelle</td>
                        <td className="py-2 px-3">Accordée par STA Chery</td>
                        <td className="py-2 px-3 text-right font-mono">
                          -{activeQuoteForPreview.financials.discountTND.toLocaleString()} TND
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Totals Breakdown */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-1.5 text-xs font-mono border-t border-slate-300 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sous-total HT :</span>
                      <span>{Math.round(activeQuoteForPreview.financials.subtotalHT).toLocaleString()} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">TVA (19%) :</span>
                      <span>+{Math.round(activeQuoteForPreview.financials.tvaAmount).toLocaleString()} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Droit de Timbre :</span>
                      <span>+{activeQuoteForPreview.financials.droitDeTimbre.toFixed(3)} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Frais Carte Grise / ATTT :</span>
                      <span>+{activeQuoteForPreview.financials.registrationFee.toLocaleString()} TND</span>
                    </div>

                    <div className="p-2.5 bg-slate-900 text-amber-300 font-extrabold text-sm rounded-lg flex justify-between mt-2">
                      <span>NET TOTAL TTC :</span>
                      <span>{Math.round(activeQuoteForPreview.financials.totalTTC).toLocaleString()} TND</span>
                    </div>
                  </div>
                </div>

                {/* Footer terms */}
                <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 space-y-1">
                  <p className="font-bold text-slate-700">{templateConfig.quoteHeaderNote}</p>
                  <p>{templateConfig.quoteFooterTerms}</p>
                  <p className="pt-2 text-center text-slate-400 font-mono">
                    — Document édité par l'application Chery Tunisie STA —
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
