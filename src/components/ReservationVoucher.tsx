import React from 'react';
import { Reservation } from '../types';
import { Printer, Download, X, CheckCircle2, Shield, Building, User, FileText, Phone, Mail, MapPin } from 'lucide-react';
import cheryLogo from '../assets/images/chery_logo_emblem_1785417732982.jpg';

interface ReservationVoucherProps {
  reservation: Reservation;
  onClose: () => void;
}

export const ReservationVoucher: React.FC<ReservationVoucherProps> = ({ reservation, onClose }) => {
  React.useEffect(() => {
    if (!reservation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reservation, onClose]);

  const handlePrint = () => {
    window.print();
  };

  const client = reservation.client;
  const isSociete = client.type === 'societe';
  const physique = client.personnePhysique;
  const societe = client.societe;

  const totalWithFees = reservation.priceTND + reservation.registrationFeeTND;
  const remaining = totalWithFees - reservation.depositPaidTND;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Top Controls Bar (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            <span className="font-bold text-sm">Aperçu du Bon de Réservation Véhicule Neuf</span>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Printable Document Body */}
        <div id="printable-voucher" className="p-8 space-y-6 text-slate-900 bg-white">
          {/* Header Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <img
                  src={cheryLogo}
                  alt="Chery Logo"
                  className="w-12 h-12 object-cover rounded-xl border border-slate-300 shadow-sm"
                />
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">CHERY TUNISIE</h1>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-600">
                    Société Tunisienne d'Automobiles (STA)
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
