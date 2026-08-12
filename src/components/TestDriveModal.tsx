import React, { useState, useEffect } from 'react';
import { CarModel, CommercialUser, TestDriveAppointment } from '../types';
import { X, Calendar, Clock, Car, User, Phone, Mail, MapPin, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: CarModel[];
  preselectedCar?: CarModel | null;
  currentUser: CommercialUser;
  onScheduleTestDrive: (data: Omit<TestDriveAppointment, 'id' | 'createdAt' | 'status'>) => void;
}

const CHERY_AGENCIES = [
  'Chery Agence Lac 2 - Tunis',
  'Chery Agence Charguia 1 - Tunis',
  'Chery Agence Sousse Pearl',
  'Chery Agence Sfax Route Teniour',
  'Chery Agence Nabeul Cap Bon',
  'Chery Agence Bizerte Corniche',
  'Chery Agence Gabès Oasis',
  'Chery Agence Kairouan Center',
];

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  isOpen,
  onClose,
  cars,
  preselectedCar,
  currentUser,
  onScheduleTestDrive,
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [agency, setAgency] = useState<string>(currentUser.agency || CHERY_AGENCIES[0]);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientCin, setClientCin] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('10:00');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (preselectedCar) {
        setSelectedCarId(preselectedCar.id);
      } else if (cars.length > 0) {
        setSelectedCarId(cars[0].id);
      }
      setAgency(currentUser.agency || CHERY_AGENCIES[0]);
      
      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);

      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setClientCin('');
      setNotes('');
      setErrors({});
    }
  }, [isOpen, preselectedCar, cars, currentUser]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedCarId) errs.car = 'Veuillez sélectionner un modèle de véhicule.';
    if (!clientName.trim()) errs.clientName = 'Le nom du client est obligatoire.';
    if (!clientPhone.trim()) errs.clientPhone = 'Le numéro de téléphone est obligatoire.';
    if (!date) errs.date = 'La date du rendez-vous est obligatoire.';
    if (!timeSlot) errs.timeSlot = 'Le créneau horaire est obligatoire.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const chosenCar = cars.find((c) => c.id === selectedCarId);
    if (!chosenCar) return;

    onScheduleTestDrive({
      carId: chosenCar.id,
      carName: chosenCar.name,
      agency,
      clientName,
      clientPhone,
      clientEmail,
      clientCin,
      date,
      timeSlot,
      commercialId: currentUser.id,
      commercialName: currentUser.name,
      notes,
    });

    onClose();
  };

  const selectedCar = cars.find((c) => c.id === selectedCarId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-900/40">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Nouveau Rendez-vous Test Drive
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Programmez un essai sur route d'un véhicule Chery pour un client
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Vehicle & Agency Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-red-400" />
                  Modèle Chery à Tester *
                </label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                >
                  <option value="">Sélectionner un véhicule...</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name} ({car.energy} - {car.priceTND.toLocaleString()} TND)
                    </option>
                  ))}
                </select>
                {errors.car && <p className="text-[11px] text-red-400 mt-1">{errors.car}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Agence Chery *
                </label>
                <select
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-bold"
                >
                  {CHERY_AGENCIES.map((ag) => (
                    <option key={ag} value={ag}>
                      {ag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Car Highlight Card */}
            {selectedCar && (
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-4">
                <img
                  src={selectedCar.imageUrl}
                  alt={selectedCar.name}
                  className="w-20 h-14 object-cover rounded-xl border border-slate-800"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-white">{selectedCar.name}</p>
                  <p className="text-[11px] text-slate-400">
                    Moteur : {selectedCar.engine} | Transmission : {selectedCar.transmission}
                  </p>
                  <p className="text-[10px] text-red-400 font-bold">
                    Garantie Constructeur : {selectedCar.guarantee}
                  </p>
                </div>
              </div>
            )}

            {/* Client Details */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Informations du Client
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Nom & Prénom Client *
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Mohamed Trabelsi"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  {errors.clientName && <p className="text-[10px] text-red-400 mt-0.5">{errors.clientName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    placeholder="ex: +216 98 123 456"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  {errors.clientPhone && <p className="text-[10px] text-red-400 mt-0.5">{errors.clientPhone}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Adresse Email (Optionnel)
                  </label>
                  <input
                    type="email"
                    placeholder="ex: client@gmail.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    N° CIN (Optionnel)
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="ex: 08765432"
                    value={clientCin}
                    onChange={(e) => setClientCin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time Slot */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Date & Créneau d'Essai
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Date Souhaitée *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  {errors.date && <p className="text-[10px] text-red-400 mt-0.5">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Créneau Horaire *
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                          timeSlot === slot
                            ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-900/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Notes & Remarques (Optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="ex: Permis de conduire valide présenté, client intéressé par la finition Luxe..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer le Rendez-vous Test Drive</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
