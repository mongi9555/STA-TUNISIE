import React, { useState, useMemo } from 'react';
import { CommercialUser, UserRole, SiteSettings } from '../types';
import { INITIAL_COMMERCIALS } from '../data/cheryData';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  KeyRound,
  Building,
  UserCheck,
} from 'lucide-react';
import cheryLogo from '../assets/images/chery_logo_emblem_1785417732982.jpg';
import cheryHeadquarters from '../assets/images/chery_headquarters_1785419893098.jpg';
import { BackgroundMediaRender } from './BackgroundMediaRender';

interface LoginScreenProps {
  users: CommercialUser[];
  onLogin: (user: CommercialUser) => void;
  onUpdateUser?: (user: CommercialUser) => void;
  siteSettings?: SiteSettings;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin, siteSettings }) => {
  const [selectedRoleChoice, setSelectedRoleChoice] = useState<UserRole | null>(null);
  
  // Nom, Prénom, Mot de passe
  const [nomInput, setNomInput] = useState<string>('');
  const [prenomInput, setPrenomInput] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Loaded users list with fallback
  const allUsers = useMemo(() => {
    if (users && users.length > 0) {
      return users;
    }
    return INITIAL_COMMERCIALS;
  }, [users]);

  // Filter users based on selected role choice or show all
  const filteredUsers = useMemo(() => {
    return selectedRoleChoice
      ? allUsers.filter((u) => u.role === selectedRoleChoice)
      : allUsers;
  }, [allUsers, selectedRoleChoice]);

  // Helper to split a user's full name into Prénom and Nom
  const parseUserNames = (fullName: string) => {
    const parts = (fullName || '').trim().split(/\s+/);
    if (parts.length === 1) {
      return { prenom: parts[0], nom: parts[0] };
    }
    const prenom = parts[0];
    const nom = parts.slice(1).join(' ');
    return { prenom, nom };
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRoleChoice(role);
    const firstRoleUser = allUsers.find((u) => u.role === role);
    if (firstRoleUser) {
      const { prenom, nom } = parseUserNames(firstRoleUser.name);
      setPrenomInput(prenom);
      setNomInput(nom);
    } else {
      setPrenomInput('');
      setNomInput('');
    }
    setPassword('');
    setError(null);
  };

  const handleSelectUserQuick = (u: CommercialUser) => {
    const { prenom, nom } = parseUserNames(u.name);
    setPrenomInput(prenom);
    setNomInput(nom);
    setPassword('');
    setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normPrenom = prenomInput.trim().toLowerCase();
    const normNom = nomInput.trim().toLowerCase();
    const fullTyped = `${normPrenom} ${normNom}`.trim();
    const fullTypedReverse = `${normNom} ${normPrenom}`.trim();

    if (!normNom && !normPrenom) {
      setError('Veuillez saisir votre Nom et votre Prénom.');
      return;
    }

    // Find user in matching role or across all users
    const pool = selectedRoleChoice ? filteredUsers : allUsers;
    
    let matchedUser = pool.find((u) => {
      const uNameNorm = (u.name || '').trim().toLowerCase();
      if (uNameNorm === fullTyped || uNameNorm === fullTypedReverse) return true;
      
      const { prenom: uPrenom, nom: uNom } = parseUserNames(u.name);
      const uPrenomNorm = uPrenom.toLowerCase();
      const uNomNorm = uNom.toLowerCase();

      if (normNom && normPrenom) {
        return (
          (uNomNorm.includes(normNom) && uPrenomNorm.includes(normPrenom)) ||
          (uNomNorm.includes(normPrenom) && uPrenomNorm.includes(normNom)) ||
          uNameNorm.includes(normNom) && uNameNorm.includes(normPrenom)
        );
      } else if (normNom) {
        return uNomNorm.includes(normNom) || uNameNorm.includes(normNom);
      } else {
        return uPrenomNorm.includes(normPrenom) || uNameNorm.includes(normPrenom);
      }
    });

    if (!matchedUser) {
      // Fallback search in all users if role was selected
      matchedUser = allUsers.find((u) => {
        const uNameNorm = (u.name || '').trim().toLowerCase();
        return (
          uNameNorm.includes(normNom) ||
          uNameNorm.includes(normPrenom) ||
          uNameNorm === fullTyped ||
          uNameNorm === fullTypedReverse
        );
      });
    }

    if (!matchedUser) {
      setError(`Aucun compte trouvé pour "${prenomInput} ${nomInput}". Veuillez vérifier l'orthographe.`);
      return;
    }

    const expectedPass = matchedUser.password || (matchedUser.role === 'super_admin' ? '1234' : matchedUser.role === 'admin' ? 'admin' : '123');
    if (password.trim() === expectedPass) {
      setError(null);
      onLogin(matchedUser);
    } else {
      setError(`Mot de passe incorrect pour ${matchedUser.name}.`);
    }
  };

  const effectiveLogoUrl = siteSettings?.logoUrl || cheryLogo;
  const effectiveSiteName = siteSettings?.siteName || 'CHERY Tunisie';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* Background Media */}
      <BackgroundMediaRender
        type={siteSettings?.homeBackgroundType || 'video'}
        imageUrl={siteSettings?.homeBackgroundImageUrl}
        videoUrl={siteSettings?.homeBackgroundVideoUrl || 'https://youtu.be/DdNliUon_Cs'}
        overlayOpacity={siteSettings?.homeBackgroundOverlayOpacity ?? 0.65}
        blur={siteSettings?.homeBackgroundBlur ?? false}
        defaultFallbackImage={cheryHeadquarters}
      />

      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <img
            src={effectiveLogoUrl}
            alt="Chery Tunisie Logo"
            className="w-12 h-12 object-cover rounded-xl border border-red-500/50 shadow-lg shadow-red-950/80"
          />
          <div>
            <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
              <span>{effectiveSiteName}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
              Société Tunisienne d'Automobiles (STA)
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-xs text-slate-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[11px]">Siège Social & Agences Tunisie</span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 w-full max-w-6xl mx-auto my-auto py-8">
        {selectedRoleChoice === null ? (
          /* STEP 1: PAGE D'ACCUEIL — CHOIX DU PROFIL */
          <div className="space-y-8 text-center max-w-5xl mx-auto">
            <div className="space-y-3">
              <span className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-extrabold uppercase tracking-widest rounded-full inline-block">
                Portail d'Accès Officiel — Siège & Réseau STA
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Bienvenue sur la Plateforme <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-red-400">
                  CHERY Automobile Tunisie
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
                Veuillez sélectionner votre profil pour vous identifier avec votre <strong>Nom</strong>, <strong>Prénom</strong> et <strong>Mot de passe</strong> :
              </p>
            </div>

            {/* 3 Main Choice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 text-left">
              {/* Option 1: Super Admin */}
              <button
                type="button"
                onClick={() => handleSelectRole('super_admin')}
                className="group relative bg-slate-900/95 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/80 rounded-3xl p-6 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer backdrop-blur-md flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-purple-500/15 border border-purple-500/40 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <Cpu className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      SUPER ADMIN (DSI)
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                      Direction Informatique
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Accès DSI : <strong>Arbi Gharbi</strong> & <strong>Kamel Belhoula</strong>.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Contrôle & sécurité système global</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Gestion des accès & base de données</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-purple-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Connexion DSI</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              {/* Option 2: Administrateur */}
              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className="group relative bg-slate-900/95 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/80 rounded-3xl p-6 transition-all duration-300 shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 cursor-pointer backdrop-blur-md flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-500/15 border border-amber-500/40 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      DIRECTION / ADMIN
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                      Espace Administrateur
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Direction Générale & Vente : <strong>Lamine Abbasi</strong> & <strong>Sami Chaker</strong>.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Gestion des stocks & attributions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Pilotage des prix & utilisateurs</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-amber-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Connexion Administration</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              {/* Option 3: Commercial */}
              <button
                type="button"
                onClick={() => handleSelectRole('commercial')}
                className="group relative bg-slate-900/95 hover:bg-slate-900 border border-slate-800 hover:border-red-500/80 rounded-3xl p-6 transition-all duration-300 shadow-2xl hover:shadow-red-500/20 hover:-translate-y-1 cursor-pointer backdrop-blur-md flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-red-600/15 border border-red-500/40 text-red-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/80 border border-red-500/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      CONSEILLERS VENTE
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white group-hover:text-red-400 transition-colors">
                      Espace Commercial
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Conseillers commerciaux en agence & vendeurs showroom.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Réservations de véhicules & dossiers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Check-lists administratives & bons</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-red-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Connexion Conseillers Vente</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: FORMULAIRE DE CONNEXION : NOM + PRÉNOM + MOT DE PASSE */
          <div className="max-w-lg mx-auto space-y-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setSelectedRoleChoice(null)}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold transition-all cursor-pointer shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au choix du profil</span>
            </button>

            {/* Login Card */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-white text-base">
                      Authentification Collaborateur
                    </h2>
                    <p className="text-[11px] text-slate-400">Connexion sécurisée par Nom, Prénom & Mot de passe</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase border ${
                    selectedRoleChoice === 'super_admin'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : selectedRoleChoice === 'admin'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {selectedRoleChoice === 'super_admin' ? 'SUPER ADMIN' : selectedRoleChoice === 'admin' ? 'ADMIN' : 'COMMERCIAL'}
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-2xl text-red-200 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
                {/* 2-column Nom & Prénom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      Nom de famille :
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ex: Gharbi, Abbasi..."
                        value={nomInput}
                        onChange={(e) => setNomInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      Prénom :
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ex: Arbi, Lamine..."
                        value={prenomInput}
                        onChange={(e) => setPrenomInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Mot de Passe :</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="off"
                      data-lpignore="true"
                      placeholder="Saisissez votre mot de passe..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valider et Ouvrir la Session</span>
                </button>
              </form>

              {/* Quick Select Directory Chips for rapid access */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-400">
                    Annuaire des collaborateurs ({selectedRoleChoice}) :
                  </p>
                  <span className="text-[10px] text-slate-500">Sélection rapide</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {filteredUsers.map((u) => {
                    const initials = (u.name || '')
                      .split(' ')
                      .filter(Boolean)
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();
                    const isSelected =
                      (nomInput && u.name.toLowerCase().includes(nomInput.toLowerCase())) ||
                      (prenomInput && u.name.toLowerCase().includes(prenomInput.toLowerCase()));

                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectUserQuick(u)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-red-950/40 border-red-500/60 text-white shadow'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-red-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div className="truncate flex-1">
                          <p className="font-bold text-[11px] text-white truncate">{u.name}</p>
                          <p className="text-[9px] text-slate-400 truncate">{u.title || u.agency}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-slate-400 text-[11px] py-2 space-y-0.5">
        <p>{siteSettings?.footerTitle || "STA — Société Tunisienne d'Automobiles"}</p>
        <p className="text-slate-400 font-medium">
          {siteSettings?.footerCopyright || (
            <>
              © 2026 STA — Société Tunisienne d'Automobiles. Conçu &amp; Développé par <span className="text-white font-bold">Jamai Mongi</span>. Tous droits réservés.
            </>
          )}
        </p>
      </footer>
    </div>
  );
};
