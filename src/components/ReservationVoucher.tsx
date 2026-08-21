import React, { useState } from 'react';
import { Reservation, SiteSettings } from '../types';
import { Printer, Download, X, CheckCircle2, Shield, Building, User, FileText, Phone, Mail, MapPin, Palette, Upload, Image as ImageIcon, RotateCcw, Check, Sparkles } from 'lucide-react';
import cheryLogo from '../assets/images/chery_logo_emblem_1785417732982.jpg';
import { compressImageDataUrl } from '../utils/imageCompressor';

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

  React.useEffect(() => {
    if (!reservation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showLogoCustomizer) {
          setShowLogoCustomizer(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reservation, onClose, showLogoCustomizer]);

  const handlePrint = () => {
    window.print();
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

  const totalWithFees = reservation.priceTND + reservation.registrationFeeTND;
  const remaining = totalWithFees - reservation.depositPaidTND;

  const displayLogo = currentLogo || siteSettings?.voucherLogoUrl || siteSettings?.logoUrl || cheryLogo;
  const companyTitle = siteSettings?.voucherCompanyName || 'CHERY TUNISIE';
  const companySubtitle = siteSettings?.voucherCompanySubtitle || "Société Tunisienne d'Automobiles (STA)";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
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
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

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
        <div id="printable-voucher" className="p-8 space-y-6 text-slate-900 bg-white">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <img
                    src={displayLogo}
                    alt="Logo Concessionnaire"
                    className="h-12 w-auto max-w-[150px] object-contain rounded-xl border border-slate-200 shadow-sm p-0.5 bg-white"
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
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">{companyTitle}</h1>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-600">
                    {companySubtitle}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 pt-1">
                {reservation.agency}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-md font-mono text-xs font-bold">
                N° BON : {reservation.id}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Date : {new Date(reservation.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-xs text-slate-500">
                Commercial : <strong className="text-slate-800">{reservation.commercialName}</strong>
              </p>
            </div>
          </div>

          <div className="text-center bg-slate-100 p-2 rounded-lg border border-slate-200">
            <h2 className="text-lg font-black uppercase text-slate-800 tracking-wide">
              BON DE RÉSERVATION VÉHICULE NEUF
            </h2>
          </div>

          {/* Grid 2 Columns: Client Info & Vehicle Details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Column 1: Client Info */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-2">
              <h3 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5">
                {isSociete ? <Building className="w-4 h-4 text-red-600" /> : <User className="w-4 h-4 text-red-600" />}
                <span>IDENTIFICATION CLIENT ({isSociete ? 'SOCIÉTÉ' : 'PERSONNE PHYSIQUE'})</span>
              </h3>

              {!isSociete && physique ? (
                <div className="space-y-1">
                  <p><span className="text-slate-500">Nom & Prénom :</span> <strong className="text-slate-900">{physique.nom} {physique.prenom}</strong></p>
                  <p><span className="text-slate-500">N° CIN :</span> <strong className="font-mono">{physique.cin}</strong></p>
                  <p><span className="text-slate-500">Téléphone :</span> {physique.telephone}</p>
                  <p><span className="text-slate-500">Email :</span> {physique.email || 'N/A'}</p>
                  <p><span className="text-slate-500">Gouvernorat :</span> {physique.ville}</p>
                  <p><span className="text-slate-500">Adresse :</span> {physique.adresse || 'N/A'}</p>
                </div>
              ) : isSociete && societe ? (
                <div className="space-y-1">
                  <p><span className="text-slate-500">Raison Sociale :</span> <strong className="text-slate-900">{societe.raisonSociale}</strong></p>
                  <p><span className="text-slate-500">Matricule Fiscale :</span> <strong className="font-mono text-red-700">{societe.matriculeFiscale}</strong></p>
                  <p><span className="text-slate-500">Gérant / Représentant :</span> {societe.gerantNomPrenom}</p>
                  <p><span className="text-slate-500">CIN Gérant :</span> <strong className="font-mono">{societe.gerantCin}</strong></p>
                  <p><span className="text-slate-500">Téléphone :</span> {societe.telephone}</p>
                  <p><span className="text-slate-500">Registre Commerce :</span> {societe.registreCommerce || 'N/A'}</p>
                </div>
              ) : null}
            </div>

            {/* Column 2: Vehicle Specs & Color Chosen */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-2">
              <h3 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-600" />
                <span>DÉTAILS DU VÉHICULE SÉLECTIONNÉ</span>
              </h3>

              <div className="space-y-1.5">
                <p><span className="text-slate-500">Modèle :</span> <strong className="text-slate-900 text-sm">{reservation.carName}</strong></p>
                
                {/* Colors */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 w-28 shrink-0">Teinte extérieure :</span>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-2 py-0.5 rounded-md">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-400 inline-block shadow-inner"
                        style={{ backgroundColor: reservation.colorChosen.hexCode }}
                      />
                      <strong className="text-slate-900 font-medium">{reservation.colorChosen.name}</strong>
                      <span className="font-mono text-[10px] text-slate-500">({reservation.colorChosen.hexCode})</span>
                    </div>
                  </div>

                  {reservation.interiorColorChosen && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 w-28 shrink-0">Finition intérieure :</span>
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md text-amber-900">
                        <span
                          className="w-4 h-4 rounded-md border border-slate-400 inline-block shadow-inner"
                          style={{ backgroundColor: reservation.interiorColorChosen.hexCode }}
                        />
                        <strong className="font-medium">{reservation.interiorColorChosen.name}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <p><span className="text-slate-500">Garantie Constructeur :</span> 7 ans / 200 000 km</p>
                <p><span className="text-slate-500">Statut réservation :</span> <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">{reservation.status}</span></p>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-2.5">Désignation</th>
                  <th className="p-2.5 text-right">Montant (TND)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5">Prix Public Véhicule Neuf TTC ({reservation.carName})</td>
                  <td className="p-2.5 text-right font-mono font-bold">{reservation.priceTND.toLocaleString()} TND</td>
                </tr>
                <tr>
                  <td className="p-2.5">Frais d'Immatriculation, Carte Grise & Timbre Fiscal</td>
                  <td className="p-2.5 text-right font-mono">{reservation.registrationFeeTND.toLocaleString()} TND</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2.5">TOTAL CLEF EN MAIN :</td>
                  <td className="p-2.5 text-right font-mono text-sm">{totalWithFees.toLocaleString()} TND</td>
                </tr>
                <tr className="bg-emerald-50 text-emerald-900 font-bold">
                  <td className="p-2.5">Acompte Perçu ({reservation.paymentMethod}) :</td>
                  <td className="p-2.5 text-right font-mono text-sm">{reservation.depositPaidTND.toLocaleString()} TND</td>
                </tr>
                <tr className="bg-red-50 text-red-900 font-black text-sm">
                  <td className="p-2.5">SOLDE RESTANT À PAYER À LA LIVRAISON :</td>
                  <td className="p-2.5 text-right font-mono">{remaining.toLocaleString()} TND</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* List of Joined Documents */}
          {reservation.documents && reservation.documents.length > 0 && (
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-700">Pièces justificatives jointes au dossier :</p>
              <div className="flex flex-wrap gap-2">
                {reservation.documents.map((doc) => (
                  <span key={doc.id} className="bg-slate-100 border border-slate-300 px-2 py-1 rounded text-[11px] text-slate-700">
                    • {doc.name} ({doc.category.toUpperCase().replace('_', ' ')})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {reservation.notes && (
            <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700">Observations / Conditions : </span>
              <span className="text-slate-600">{reservation.notes}</span>
            </div>
          )}

          {/* Signatures & Stamps */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-center border-t border-slate-300">
            <div>
              <p className="font-bold text-slate-800 mb-12">SIGNATURE ET CACHET DU CLIENT</p>
              <p className="text-[10px] text-slate-400">Lu et approuvé (Mention manuscrite)</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 mb-12">POUR CHERY TUNISIE (COMMERCIAL)</p>
              <p className="text-[10px] text-slate-500 font-semibold">{reservation.commercialName} — {reservation.agency}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
