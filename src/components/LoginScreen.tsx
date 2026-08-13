import React, { useState, useMemo } from 'react';
import { CommercialUser, UserRole, SiteSettings } from '../types';
import { INITIAL_COMMERCIALS } from '../data/cheryData';
import { Shield, Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, Key, Car, Building2, Briefcase, ArrowLeft, ChevronRight, ShieldCheck, Cpu, Server, ShieldAlert, Phone, Mail } from 'lucide-react';
import cheryLogo from '../assets/images/chery_logo_emblem_1785417732982.jpg';
import cheryHeadquarters from '../assets/images/chery_headquarters_1785419893098.jpg';
import { BackgroundMediaRender } from './BackgroundMediaRender';

interface LoginScreenProps {
  users: CommercialUser[];
  onLogin: (user: CommercialUser) => void;
  siteSettings?: SiteSettings;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin, siteSettings }) => {
  const [selectedRoleChoice, setSelectedRoleChoice] = useState<UserRole | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Guarantee that all initial users (including super_admins) are present in allUsers
  const allUsers = useMemo(() => {
    const list = [...(users || [])];
    INITIAL_COMMERCIALS.forEach((initUser) => {
      if (!list.some((u) => u.id === initUser.id)) {
        list.unshift(initUser);
      }
    });
    return list;
  }, [users]);

  // Filter users based on selected role choice or show all
  const filteredUsers = selectedRoleChoice
    ? allUsers.filter((u) => u.role === selectedRoleChoice)
    : allUsers;

  const selectedUser = allUsers.find((u) => u.id === selectedUserId) || filteredUsers[0];

  const handleSelectRole = (role: UserRole) => {
    setSelectedRoleChoice(role);
    const firstRoleUser = allUsers.find((u) => u.role === role);
    if (firstRoleUser) {
      setSelectedUserId(firstRoleUser.id);
    }
    setPassword('');
    setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const expectedPass = selectedUser.password || (selectedUser.role === 'super_admin' ? '1234' : selectedUser.role === 'admin' ? 'admin' : '123');
    if (password.trim() === expectedPass) {
      setError(null);
      onLogin(selectedUser);
    } else {
      setError(`Mot de passe incorrect pour ${selectedUser.name}.`);
    }
  };

  const handleQuickSelectUser = (u: CommercialUser) => {
    setSelectedUserId(u.id);
    setPassword('');
    setError(null);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin (Direction Informatique - DSI)';
      case 'admin':
        return 'Administrateur (Direction / Marketing)';
      case 'commercial':
        return 'Commercial (Conseiller Vente)';
      default:
        return role;
    }
  };

  const effectiveLogoUrl = siteSettings?.logoUrl || cheryLogo;
  const effectiveSiteName = siteSettings?.siteName || 'CHERY Tunisie';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* Background Media (Image / Vidéo) */}
      <BackgroundMediaRender
        type={siteSettings?.homeBackgroundType || 'video'}
        imageUrl={siteSettings?.homeBackgroundImageUrl}
        videoUrl={siteSettings?.homeBackgroundVideoUrl || 'https://youtu.be/DdNliUon_Cs'}
        overlayOpacity={siteSettings?.homeBackgroundOverlayOpacity ?? 0.65}
        blur={siteSettings?.homeBackgroundBlur ?? false}
        defaultFallbackImage={cheryHeadquarters}
      />

      {/* Decorative Light Glow Blobs */}
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
          /* STEP 1: PAGE D'ACCUEIL — CHOIX SUPER ADMIN, ADMINISTRATEUR OU COMMERCIAL */
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
                Veuillez choisir votre profil d'accès pour continuer vers la connexion :
              </p>
            </div>

            {/* 3 Main Choice Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 text-left">
              {/* Option 1: Super Admin (Direction Informatique DSI) */}
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
                      Accès Haute Sécurité : <strong>Arbi Gharbi</strong> (DSI) & <strong>Kamel Belhoula</strong> (Manager IT).
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Contrôle & sécurité système complet</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Gestion base de données & serveurs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Supervision réseau & accès utilisateurs</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-purple-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Accès Super Admin (DSI)</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              {/* Option 2: Administrateur (Direction General / Marketing) */}
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
                      Direction Générale & Marketing : <strong>Lamine Abbasi</strong> & <strong>Sami Chaker</strong>.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Gestion des stocks & ajouts teintes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Modification des prix catalogue TTC</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Gestion des comptes commerciaux</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-amber-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Accès Administrateur</span>
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
                      Conseillers commerciaux en agences & vendeurs en showroom.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Création des bons de réservation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Consultation catalogue & disponibilités</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Impression des reçus d'acompte client</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-red-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Accès Conseillers Vente</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: FORMULAIRE DE CONNEXION AVEC RETOUR ACCUEIL */
          <div className="max-w-md mx-auto space-y-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setSelectedRoleChoice(null)}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold transition-all cursor-pointer shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la page d'accueil (Choix du rôle)</span>
            </button>

            {/* Login Form Card */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  <h2 className="font-extrabold text-white text-base">
                    Connexion — {selectedRoleChoice === 'super_admin' ? 'Super Admin DSI' : selectedRoleChoice === 'admin' ? 'Espace Administrateur' : 'Espace Commercial'}
                  </h2>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    selectedRoleChoice === 'super_admin'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : selectedRoleChoice === 'admin'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}
                >
                  {selectedRoleChoice}
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-2xl text-red-200 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
                {/* User Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Sélectionner un compte ({getRoleLabel(selectedRoleChoice)}) :
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => {
                      setSelectedUserId(e.target.value);
                      setPassword('');
                      setError(null);
                    }}
                    className="w-full bg-slate-950 text-slate-100 text-xs border border-slate-700 rounded-xl px-3.5 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    {filteredUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.title || u.agency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected User Preview */}
                {selectedUser && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
                      />
                      <div className="text-left text-xs">
                        <p className="font-bold text-white">{selectedUser.name}</p>
                        <p className="text-[11px] text-slate-400">{selectedUser.agency}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${
                      selectedUser.role === 'super_admin' ? 'bg-purple-950 text-purple-300 border-purple-700' : 'bg-slate-800 text-amber-300 border-slate-700'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                )}

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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-3 text-sm text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Ouvrir la Session {selectedRoleChoice === 'super_admin' ? 'Super Admin (DSI)' : selectedRoleChoice === 'admin' ? 'Administrateur' : 'Commerciale'}</span>
                </button>
              </form>

              {/* Quick Select demo chips */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-400">Comptes disponibles ({selectedRoleChoice}) :</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickSelectUser(u)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        selectedUserId === u.id
                          ? 'bg-red-950/40 border-red-500/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-[11px] truncate">{u.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono uppercase">{u.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="relative z-10 text-center text-slate-400 text-[11px] py-2 space-y-0.5">
        <p>Chery Automobile Tunisie — Société Tunisienne d'Automobiles (STA)</p>
        <p className="text-slate-400 font-medium">
          © 2026 CHERY Tunisie STA. Conçu &amp; Développé par <span className="text-white font-bold">Jamai Mongi</span>. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

