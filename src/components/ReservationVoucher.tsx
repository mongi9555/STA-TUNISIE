import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Reservation, SiteSettings } from '../types';
import { Printer, Download, X, CheckCircle2, Shield, Building, User, FileText, Phone, Mail, MapPin, Palette, Upload, Image as ImageIcon, RotateCcw, Check, Sparkles, Calendar, Clock, Lock, AlertTriangle } from 'lucide-react';
import cheryLogo from '../assets/images/chery_logo_emblem_1785417732982.jpg';
import { compressImageDataUrl } from '../utils/imageCompressor';
import { calculateDeliveryDate, formatVoucherDate } from '../data/cheryData';

interface ReservationVoucherProps {
  reservation: Reservation;
  siteSettings?: SiteSettings;
  onClose: () => void;
  onUpdateVoucherLogo?: (newLogoUrl: string) => void;
}

export const ReservationVoucher: React.FC<ReservationVoucherProps> = ({
  reservation,
  siteSettings,
  onClose,
  onUpdateVoucherLogo,
}) => {
  const [showLogoCustomizer, setShowLogoCustomizer] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string>(
    siteSettings?.voucherLogoUrl || siteSettings?.logoUrl || ''
  );
  const [urlInput, setUrlInput] = useState<string>('');
  const [customizerSuccess, setCustomizerSuccess] = useState(false);

  // RÈGLE : L'impression n'est permise que si la réservation est confirmée
  const isConfirmed = reservation?.status === 'Confirmée' || reservation?.status === 'Livrée';

  React.useEffect(() => {
    document.body.classList.add('printing-voucher-active');
    if (!reservation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquer le raccourci Ctrl+P / Cmd+P si la réservation n'est pas confirmée
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        if (!isConfirmed) {
          e.preventDefault();
          e.stopPropagation();
          alert("L'impression du bon de réservation est uniquement possible lorsque la réservation est confirmée.");
          return;
        }
      }
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showLogoCustomizer) {
          setShowLogoCustomizer(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('printing-voucher-active');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reservation, onClose, showLogoCustomizer, isConfirmed]);

  const handlePrint = () => {
    if (!isConfirmed) {
      alert("L'impression du bon de réservation est uniquement possible lorsque la réservation est confirmée.");
      return;
    }
    const originalTitle = document.title;
    const clientName = reservation.client.type === 'societe'
      ? (reservation.client.societe?.raisonSociale || 'Societe')
      : (reservation.client.personnePhysique?.nom || 'Client');
    document.title = `Bon_Reservation_${reservation.id}_${clientName.replace(/\s+/g, '_')}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const compressed = await compressImageDataUrl(dataUrl, 600, 600, 0.88);
      setCurrentLogo(compressed);
      if (onUpdateVoucherLogo) {
        onUpdateVoucherLogo(compressed);
      }
      setCustomizerSuccess(true);
      setTimeout(() => setCustomizerSuccess(false), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setCurrentLogo(urlInput.trim());
    if (onUpdateVoucherLogo) {
      onUpdateVoucherLogo(urlInput.trim());
    }
    setUrlInput('');
    setCustomizerSuccess(true);
    setTimeout(() => setCustomizerSuccess(false), 2500);
  };

  const handlePresetSelect = (presetUrl: string) => {
    setCurrentLogo(presetUrl);
    if (onUpdateVoucherLogo) {
      onUpdateVoucherLogo(presetUrl);
    }
    setCustomizerSuccess(true);
    setTimeout(() => setCustomizerSuccess(false), 2500);
  };

  const handleResetToDefault = () => {
    setCurrentLogo('');
    if (onUpdateVoucherLogo) {
      onUpdateVoucherLogo('');
    }
    setCustomizerSuccess(true);
    setTimeout(() => setCustomizerSuccess(false), 2500);
  };

  const client = reservation.client;
  const isSociete = client.type === 'societe';
  const physique = client.personnePhysique;
  const societe = client.societe;

  const totalCarPrice = reservation.priceTND;
  const remaining = totalCarPrice - reservation.depositPaidTND;
  const hasMultipleVehicles = reservation.vehicles && reservation.vehicles.length > 0;

  // Calcul automatique de la date de livraison estimée (Date ETA + 30 jours)
  const baseEtaDate = reservation.etaDate || reservation.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10);
  const deliveryDateIso = reservation.expectedDeliveryDate || calculateDeliveryDate(baseEtaDate, 30);
  const formattedEtaDate = formatVoucherDate(reservation.etaDate || reservation.createdAt?.slice(0, 10));
  const formattedDeliveryDate = formatVoucherDate(deliveryDateIso);

  const displayLogo = currentLogo || siteSettings?.voucherLogoUrl || siteSettings?.logoUrl || cheryLogo;
  const companyTitle = siteSettings?.voucherCompanyName || 'CHERY TUNISIE';
  const companySubtitle = siteSettings?.voucherCompanySubtitle || "Société Tunisienne d'Automobiles (STA)";

  return createPortal(
    <div className="reservation-voucher-portal fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto print:overflow-visible print:block print:w-full print:h-auto">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full">
        {/* Top Controls Bar (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            <span className="font-bold text-sm">Aperçu du Bon de Réservation Véhicule Neuf</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Logo Customizer Toggle Button */}
            <button
              onClick={() => setShowLogoCustomizer(!showLogoCustomizer)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              title="Changer ou personnaliser le logo du bon de réservation"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Personnaliser le Logo</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={!isConfirmed}
              title={
                !isConfirmed
                  ? "Impression bloquée : La réservation doit être confirmée au préalable"
                  : "Imprimer / Télécharger PDF"
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow ${
                isConfirmed
                  ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              {!isConfirmed ? <Lock className="w-4 h-4 text-amber-400" /> : <Printer className="w-4 h-4" />}
              <span>{isConfirmed ? 'Imprimer / Télécharger PDF' : 'Impression bloquée (Non confirmée)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Warning Banner if Reservation is Not Confirmed (Hidden during print) */}
        {!isConfirmed && (
          <div className="p-3.5 bg-amber-950/90 border-b border-amber-500/50 text-amber-200 text-xs flex items-center gap-2.5 print:hidden">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1 leading-relaxed">
              <strong>Impression non autorisée :</strong> Cette réservation est actuellement au statut <strong>« {reservation.status} »</strong>. Conformément aux règles de gestion commerciale, l'impression du bon officiel de réservation est réservée aux dossiers <strong>Confirmés</strong>.
            </div>
          </div>
        )}

        {/* Print Block Notice (Only visible if browser print is forced while unconfirmed) */}
        {!isConfirmed && (
          <div className="hidden print:block p-8 m-6 border-2 border-red-600 bg-red-50 text-red-700 rounded-lg text-center font-bold">
            DOCUMENT NON IMPRIMABLE : La réservation #{reservation.id} est actuellement au statut « {reservation.status} ».
            <br />
            L'émission et l'impression du bon de réservation officiel ne sont autorisées qu'après confirmation officielle de la réservation.
          </div>
        )}

        {/* Logo Customizer Drawer (Interactive Panel, Hidden during print) */}
        {showLogoCustomizer && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 text-white space-y-4 print:hidden animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  Personnalisation du Logo du Bon de Réservation
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoCustomizer(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {customizerSuccess && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Logo mis à jour et enregistré pour l'impression !</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Option 1: File Upload */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-300 block">1. Téléverser depuis l'ordinateur :</span>
                <label className="flex flex-col items-center justify-center p-3 bg-slate-900 border border-dashed border-slate-700 hover:border-red-500 rounded-xl cursor-pointer text-slate-300 transition-colors text-center gap-1.5">
                  <Upload className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-[11px]">Choisir un fichier image</span>
                  <span className="text-[10px] text-slate-500">PNG, JPG, SVG, WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option 2: Presets */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-300 block">2. Logos Préconfigurés (1-Clic) :</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1 text-center cursor-pointer transition-all"
                  >
                    <img src={cheryLogo} alt="Chery" className="w-7 h-7 object-cover rounded-lg border border-slate-700" />
                    <span className="text-[10px] font-bold text-slate-300">Écusson Chery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetSelect('/sta_logo.svg')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1 text-center cursor-pointer transition-all"
                  >
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center p-0.5">
                      <img src="/sta_logo.svg" alt="STA" className="max-h-5 max-w-full object-contain" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">Logo STA</span>
                  </button>
                </div>
              </div>

              {/* Option 3: URL or Reset */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-300 block">3. URL Web ou Réinitialisation :</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="https://.../logo.png"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold cursor-pointer"
                  >
                    OK
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser logo par défaut</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable Document Body */}
        <div id="printable-voucher" className={`p-6 sm:p-8 space-y-4 print:p-2 print:space-y-2 text-slate-900 bg-white print:w-full ${!isConfirmed ? 'print:hidden' : ''}`}>
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 print:pb-1.5">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <img
                    src={displayLogo}
                    alt="Logo Concessionnaire"
                    className="h-11 print:h-8 w-auto max-w-[140px] object-contain rounded-lg border border-slate-200 shadow-xs p-0.5 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLogoCustomizer(!showLogoCustomizer)}
                    className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity print:hidden cursor-pointer shadow"
                    title="Changer le logo"
                  >
                    <Palette className="w-3 h-3 text-amber-400" />
                  </button>
                </div>
                <div>
                  <h1 className="text-lg print:text-base font-black text-slate-900 tracking-tight">{companyTitle}</h1>
                  <p className="text-[10px] print:text-[8.5px] uppercase tracking-wider font-semibold text-slate-600">
                    {companySubtitle}
                  </p>
                </div>
              </div>
              <p className="text-xs print:text-[9.5px] text-slate-600 pt-0.5">
                {reservation.agency}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 print:px-2 print:py-0.5 bg-red-100 text-red-800 rounded-md font-mono text-xs print:text-[10px] font-bold">
                N° BON : {reservation.id}
              </span>
              <p className="text-xs print:text-[9.5px] text-slate-500 mt-1">
                Date : {new Date(reservation.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-xs print:text-[9.5px] text-slate-500">
                Commercial : <strong className="text-slate-800">{reservation.commercialName}</strong>
              </p>
            </div>
          </div>

          <div className="text-center bg-slate-100 p-1.5 print:p-1 rounded-lg border border-slate-200">
            <h2 className="text-base print:text-sm font-black uppercase text-slate-800 tracking-wide">
              BON DE RÉSERVATION VÉHICULE NEUF
            </h2>
          </div>

          {/* Grid 2 Columns: Client Info & Vehicle Details */}
          <div className="grid grid-cols-2 gap-4 print:gap-2 text-xs print:text-[10px]">
            {/* Column 1: Client Info */}
            <div className="border border-slate-300 rounded-xl p-3 print:p-2 bg-slate-50/50 space-y-1.5 print:space-y-0.5">
              <h3 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 print:pb-0.5 flex items-center gap-1.5">
                {isSociete ? <Building className="w-3.5 h-3.5 text-red-600" /> : <User className="w-3.5 h-3.5 text-red-600" />}
                <span>IDENTIFICATION CLIENT ({isSociete ? 'SOCIÉTÉ' : 'PERSONNE PHYSIQUE'})</span>
              </h3>

              {!isSociete && physique ? (
                <div className="space-y-1 print:space-y-0.5">
                  <p><span className="text-slate-500">Nom & Prénom :</span> <strong className="text-slate-900">{physique.nom} {physique.prenom}</strong></p>
                  <p><span className="text-slate-500">N° CIN :</span> <strong className="font-mono">{physique.cin}</strong></p>
                  <p><span className="text-slate-500">Téléphone :</span> {physique.telephone}</p>
                  <p><span className="text-slate-500">Email :</span> {physique.email || 'N/A'}</p>
                  <p><span className="text-slate-500">Gouvernorat :</span> {physique.ville}</p>
                  <p><span className="text-slate-500">Adresse :</span> {physique.adresse || 'N/A'}</p>
                </div>
              ) : isSociete && societe ? (
                <div className="space-y-1 print:space-y-0.5">
                  <p><span className="text-slate-500">Raison Sociale :</span> <strong className="text-slate-900">{societe.raisonSociale}</strong></p>
                  <p><span className="text-slate-500">Matricule Fiscale :</span> <strong className="font-mono text-red-700">{societe.matriculeFiscale}</strong></p>
                  {societe.gerantNomPrenom && <p><span className="text-slate-500">Gérant / Représentant :</span> {societe.gerantNomPrenom}</p>}
                  {societe.gerantCin && <p><span className="text-slate-500">CIN Gérant :</span> <strong className="font-mono">{societe.gerantCin}</strong></p>}
                  <p><span className="text-slate-500">Téléphone :</span> {societe.telephone}</p>
                  <p><span className="text-slate-500">Registre Commerce :</span> {societe.registreCommerce || 'N/A'}</p>
                </div>
              ) : null}
            </div>

            {/* Column 2: Vehicle Specs & Color Chosen */}
            <div className="border border-slate-300 rounded-xl p-3 print:p-2 bg-slate-50/50 space-y-1.5 print:space-y-0.5">
              <h3 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 print:pb-0.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>
                  {hasMultipleVehicles && (reservation.vehicles?.length || 0) > 1
                    ? `DÉTAILS DES VÉHICULES (${reservation.vehicles?.length} MODÈLES)`
                    : 'DÉTAILS DU VÉHICULE SÉLECTIONNÉ'}
                </span>
              </h3>

              {hasMultipleVehicles && (reservation.vehicles?.length || 0) > 1 ? (
                <div className="space-y-2 print:space-y-1">
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden">
                    {reservation.vehicles?.map((v, idx) => (
                      <div key={v.id || idx} className="p-1.5 print:p-1 flex items-center justify-between text-[11px] print:text-[9px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-slate-300 shrink-0 inline-block shadow-inner"
                            style={{ backgroundColor: v.colorChosen.hexCode }}
                          />
                          <span className="font-bold text-slate-900">{v.carName}</span>
                          <span className="text-slate-500">({v.colorChosen.name})</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 font-bold">Qté: {v.quantity}</span>
                          <span className="text-slate-800 font-bold">{v.totalPriceTND.toLocaleString()} TND</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] print:text-[8.5px] text-slate-600"><span className="text-slate-500">Garantie Constructeur :</span> 7 ans / 200 000 km</p>
                </div>
              ) : (
                <div className="space-y-1 print:space-y-0.5">
                  <p><span className="text-slate-500">Modèle :</span> <strong className="text-slate-900 text-xs sm:text-sm print:text-xs">{reservation.carName}</strong></p>
                  
                  {/* Colors */}
                  <div className="space-y-1 print:space-y-0.5 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 w-24 shrink-0">Teinte extérieure :</span>
                      <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-2 py-0.5 print:py-0 rounded-md">
                        <span
                          className="w-3.5 h-3.5 print:w-3 print:h-3 rounded-full border border-slate-400 inline-block shadow-inner"
                          style={{ backgroundColor: reservation.colorChosen.hexCode }}
                        />
                        <strong className="text-slate-900 font-medium">{reservation.colorChosen.name}</strong>
                        <span className="font-mono text-[9px] text-slate-500">({reservation.colorChosen.hexCode})</span>
                      </div>
                    </div>

                    {reservation.interiorColorChosen && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 w-24 shrink-0">Finition intérieure :</span>
                        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-2 py-0.5 print:py-0 rounded-md text-amber-900">
                          <span
                            className="w-3.5 h-3.5 print:w-3 print:h-3 rounded-md border border-slate-400 inline-block shadow-inner"
                            style={{ backgroundColor: reservation.interiorColorChosen.hexCode }}
                          />
                          <strong className="font-medium">{reservation.interiorColorChosen.name}</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  <p><span className="text-slate-500">Garantie Constructeur :</span> 7 ans / 200 000 km</p>
                </div>
              )}

              {/* Section Date ETA & Date de Livraison Estimée */}
              <div className="pt-1.5 print:pt-1 border-t border-slate-300 space-y-1 print:space-y-0.5">
                {reservation.etaDate && (
                  <div className="flex items-center justify-between text-[11px] print:text-[9.5px]">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Arrivage prévisionnel (ETA) :</span>
                    </span>
                    <strong className="font-mono text-slate-900 font-bold">{formattedEtaDate}</strong>
                  </div>
                )}

                <div className="p-2 print:p-1 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between shadow-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] print:text-[9px] font-extrabold text-red-950 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-red-600" />
                      <span>Date de Livraison Estimée :</span>
                    </span>
                    <span className="text-[9px] print:text-[8px] text-red-700 font-medium italic block">
                      (Délai sécurisé : Date ETA + 30 jours)
                    </span>
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm print:text-xs text-red-800 bg-white px-2 py-0.5 rounded border border-red-300 shadow-xs">
                    {formattedDeliveryDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs print:text-[10px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="py-2 px-2.5 print:py-1 print:px-2">Désignation</th>
                  <th className="py-2 px-2.5 print:py-1 print:px-2 text-right">Montant (TND)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {hasMultipleVehicles && (reservation.vehicles?.length || 0) > 1 ? (
                  reservation.vehicles?.map((v, i) => (
                    <tr key={v.id || i}>
                      <td className="py-1.5 px-2.5 print:py-1 print:px-2">
                        {v.quantity}x {v.carName} — Teinte : {v.colorChosen.name} (Prix unitaire: {v.unitPriceTND.toLocaleString()} TND)
                      </td>
                      <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-right font-mono font-bold">
                        {v.totalPriceTND.toLocaleString()} TND
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-1.5 px-2.5 print:py-1 print:px-2">Prix Public Véhicule Neuf TTC ({reservation.carName})</td>
                    <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-right font-mono font-bold">{reservation.priceTND.toLocaleString()} TND</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2">TOTAL TTC CLEF EN MAIN :</td>
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-right font-mono text-sm print:text-xs">{totalCarPrice.toLocaleString()} TND</td>
                </tr>
                <tr className="bg-emerald-50 text-emerald-900 font-bold">
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2">Acompte Perçu ({reservation.paymentMethod}) :</td>
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-right font-mono text-sm print:text-xs">{reservation.depositPaidTND.toLocaleString()} TND</td>
                </tr>
                <tr className="bg-red-50 text-red-900 font-black text-sm print:text-xs">
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2">SOLDE RESTANT À PAYER À LA LIVRAISON :</td>
                  <td className="py-1.5 px-2.5 print:py-1 print:px-2 text-right font-mono">{remaining.toLocaleString()} TND</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* List of Joined Documents */}
          {reservation.documents && reservation.documents.length > 0 && (
            <div className="text-xs print:text-[9px] space-y-1 print:space-y-0.5">
              <p className="font-bold text-slate-700">Pièces justificatives jointes au dossier :</p>
              <div className="flex flex-wrap gap-1.5">
                {reservation.documents.map((doc) => (
                  <span key={doc.id} className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[10px] print:text-[8.5px] text-slate-700">
                    • {doc.name} ({doc.category.toUpperCase().replace('_', ' ')})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Observations / Conditions */}
          <div className="text-xs print:text-[9px] bg-slate-50 p-2.5 print:p-1.5 rounded-lg border border-slate-200 space-y-2 print:space-y-1">
            <div className="flex items-start gap-1.5 pb-1 border-b border-slate-200 text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">Délai & Date de Livraison Estimée : </span>
                <strong className="text-red-700 font-bold">{formattedDeliveryDate}</strong>
                <span className="text-slate-600 text-[10px] print:text-[8.5px] block">
                  (Délai indicatif calculé : Date d'Arrivage ETA + 30 jours de sécurité pour dédouanement, transport, préparation PDI en atelier et formalités administratives d'immatriculation).
                </span>
              </div>
            </div>

            {/* Clause Légale Spécifique : Délai de 30 jours pour le solde */}
            <div className="p-2 print:p-1.5 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-950 space-y-0.5">
              <span className="font-bold uppercase tracking-wider text-[10px] print:text-[8.5px] text-amber-900 block">
                Condition Réglementaire de Paiement du Solde :
              </span>
              <p className="text-slate-800 font-medium leading-relaxed italic text-[11px] print:text-[9px]">
                « Le client dispose d’un délai de 30 jours à compter de la date d’arrivée de l’arrivage concerné pour compléter le paiement de son véhicule. Passé ce délai, et en cas de non-règlement du solde, la réservation sera reportée à l’arrivage suivant, sous réserve des disponibilités. »
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800">Conditions Tarifaires : </span>
              <span className="text-slate-700 leading-relaxed italic">
                « Le prix est communiqué à titre indicatif. Le prix final sera établi au moment de la facturation et pourra varier selon le taux de change, le coût du transport et les taxes en vigueur. »
              </span>
            </div>
            {reservation.notes && reservation.notes.trim() !== '' && (
              <div className="pt-1 border-t border-slate-200 text-slate-600">
                <span className="font-semibold text-slate-700">Remarques complémentaires : </span>
                <span>{reservation.notes}</span>
              </div>
            )}
          </div>

          {/* Signatures & Stamps */}
          <div className="pt-4 print:pt-2 grid grid-cols-2 gap-6 print:gap-4 text-xs print:text-[10px] text-center border-t border-slate-300">
            <div>
              <p className="font-bold text-slate-800 mb-8 print:mb-5">SIGNATURE ET CACHET DU CLIENT</p>
              <p className="text-[10px] print:text-[8.5px] text-slate-400">Lu et approuvé (Mention manuscrite)</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-8 print:mb-5">POUR CHERY TUNISIE (COMMERCIAL)</p>
              <p className="text-[10px] print:text-[8.5px] text-slate-500 font-semibold">{reservation.commercialName} — {reservation.agency}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
