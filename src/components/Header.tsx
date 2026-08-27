import React, { useState } from 'react';
import { CommercialUser, ThemeMode, SiteSettings, CarModel, StockRequest } from '../types';
import { Car, LayoutDashboard, FileText, Settings, AlertCircle, Lock, Key, KeyRound, X, CheckCircle2, Eye, EyeOff, LogOut, Moon, Sun, Flame, Bot, Sparkles, Megaphone, Info, AlertTriangle, BookOpen, FileCheck, Sliders, Monitor, Laptop, ChevronDown, Calendar, Bell, Send, Clock, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import cheryLogo from '../assets/images/chery_logo_emblem_1785417732982.jpg';

export type AppTab = 'dashboard' | 'reservations' | 'admin_docs' | 'knowledge_base' | 'documents_devis' | 'admin';

interface HeaderProps {
  currentUser: CommercialUser;
  allUsers: CommercialUser[];
  onSelectUser: (user: CommercialUser) => void;
  onUpdateUser?: (user: CommercialUser) => void;
  onUpdatePassword?: (userId: string, newPassword: string) => void;
  onLogout: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  outOfStockCount: number;
  cars?: CarModel[];
  stockRequests?: StockRequest[];
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  siteSettings?: SiteSettings;
}


export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onUpdateUser,
  onUpdatePassword,
  onLogout,
  activeTab,
  setActiveTab,
  outOfStockCount,
  cars = [],
  stockRequests = [],
  theme,
  onThemeChange,
  siteSettings,
}) => {
  // Notification Drawer State
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);

  // Self Password Change Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [currentPassInput, setCurrentPassInput] = useState<string>('');
  const [newPassInput, setNewPassInput] = useState<string>('');
  const [confirmPassInput, setConfirmPassInput] = useState<string>('');
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<boolean>(false);

  // Session Switch Password Verification Modal
  const [pendingUserToSwitch, setPendingUserToSwitch] = useState<CommercialUser | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!pendingUserToSwitch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setPendingUserToSwitch(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingUserToSwitch]);

  const handleUserDropdownChange = (userId: string) => {
    if (userId === currentUser.id) return;
    const selected = allUsers.find((u) => u.id === userId);
    if (!selected) return;

    setPendingUserToSwitch(selected);
    setInputPassword('');
    setAuthError(null);
    setShowPassword(false);
  };

  const handleVerifyAndSwitch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pendingUserToSwitch) return;

    const expectedPass = pendingUserToSwitch.password || (pendingUserToSwitch.role === 'admin' ? 'admin' : '123');

    if (inputPassword.trim() === expectedPass) {
      onSelectUser(pendingUserToSwitch);
      setPendingUserToSwitch(null);
      setInputPassword('');
      setAuthError(null);
    } else {
      setAuthError(`Mot de passe incorrect pour ${pendingUserToSwitch.name}`);
    }
  };

  const handleSaveSelfPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    const expectedCurrent = currentUser.password || (currentUser.role === 'super_admin' ? '1234' : currentUser.role === 'admin' ? 'admin' : '123');

    // Verify current password unless it's first setup or user is super_admin
    if (currentPassInput.trim() !== expectedCurrent && currentUser.role !== 'super_admin') {
      setPassError('⚠️ Le mot de passe actuel saisi est incorrect.');
      return;
    }

    if (newPassInput.trim().length < 4) {
      setPassError('⚠️ Le nouveau mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassError('⚠️ La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    // Save to Firestore and state
    if (onUpdatePassword) {
      onUpdatePassword(currentUser.id, newPassInput.trim());
    }
    if (onUpdateUser) {
      onUpdateUser({ ...currentUser, password: newPassInput.trim() });
    }

    setPassSuccess(true);
    setTimeout(() => {
      setIsChangePasswordOpen(false);
      setPassSuccess(false);
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setPassError(null);
    }, 1800);
  };

  // Dynamic Header CSS according to active theme
  const isLightTheme = ['light', 'nordic_clean', 'pearl_luxury', 'crystal_cyan'].includes(theme);

  const headerBgClass =
    theme === 'light'
      ? 'bg-white text-slate-900 border-slate-200 shadow-md'
      : theme === 'nordic_clean'
      ? 'bg-slate-50 text-slate-900 border-blue-200/80 shadow-md'
      : theme === 'pearl_luxury'
      ? 'bg-stone-50 text-stone-900 border-amber-200/80 shadow-md'
      : theme === 'crystal_cyan'
      ? 'bg-teal-50 text-slate-900 border-teal-200/80 shadow-md'
      : theme === 'red'
      ? 'bg-gradient-to-r from-red-950 via-slate-950 to-red-950 text-white border-red-900/50 shadow-xl shadow-red-950/40'
      : 'bg-slate-900 text-white border-slate-800 shadow-lg';

  const subHeaderBgClass =
    isLightTheme
      ? 'bg-white/90 border-slate-200'
      : theme === 'red'
      ? 'bg-red-950/60 border-red-900/40'
      : 'bg-slate-950/80 border-slate-800';

  const selectBgClass =
    isLightTheme
      ? 'bg-white text-slate-800 border-slate-300 shadow-sm'
      : 'bg-slate-900 text-slate-200 border-slate-700';

  const effectiveLogoUrl = siteSettings?.logoUrl || cheryLogo;
  const effectiveSiteName = siteSettings?.siteName || 'CHERY Tunisie';
  const effectiveSiteSubtitle = siteSettings?.siteSubtitle || 'Système de Réservation, Stocks & Gestion des Accès — Siège STA';
  const effectiveBadgeText = siteSettings?.headerBadgeText || 'Espace Commercial & Direction';
  const announcement = siteSettings?.announcementBanner;

  return (
    <header className={`${headerBgClass} border-b sticky top-0 z-40 transition-colors duration-300`}>
      {/* Global Announcement Banner if enabled */}
      {announcement?.enabled && announcement.text && (
        <div className={`px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 transition-all ${
          announcement.type === 'alert'
            ? 'bg-red-950 text-red-200 border-b border-red-800'
            : announcement.type === 'warning'
            ? 'bg-amber-950 text-amber-200 border-b border-amber-800'
            : announcement.type === 'success'
            ? 'bg-emerald-950 text-emerald-200 border-b border-emerald-800'
            : 'bg-indigo-950 text-indigo-200 border-b border-indigo-800'
        }`}>
          <Megaphone className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          <span>{announcement.text}</span>
        </div>
      )}

      {/* Top Banner / Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Chery Brand Identity */}
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="relative group cursor-pointer"
          >
            <img
              src={effectiveLogoUrl}
              alt="Logo Chery Tunisie"
              className="w-12 h-12 object-cover rounded-xl border-2 border-red-500/60 shadow-lg shadow-red-950/50"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-red-900/30 to-transparent pointer-events-none" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight flex items-center gap-1.5">
                <span className={isLightTheme ? 'text-slate-900' : 'text-white'}>{effectiveSiteName}</span>
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] font-bold bg-red-600/20 text-red-600 dark:text-red-300 border border-red-500/40 rounded-full shadow-sm">
                {effectiveBadgeText}
              </span>
            </div>
            <p className={`text-xs font-medium ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
              {effectiveSiteSubtitle}
            </p>
          </div>
        </div>

        {/* User Session Switcher & Theme Selector */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Automatic Stock Request Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationsModal(true)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer relative ${
                stockRequests.filter((r) => r.status === 'En attente').length > 0
                  ? 'bg-amber-950/80 border-amber-500/70 text-amber-300 hover:bg-amber-900 shadow-lg shadow-amber-950/50'
                  : isLightTheme
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Centre de Notifications Automatiques & Alertes Stock"
            >
              <Bell className={`w-4 h-4 ${stockRequests.filter((r) => r.status === 'En attente').length > 0 ? 'animate-bounce text-amber-400' : ''}`} />
              <span className="text-xs font-bold hidden sm:inline">Alertes</span>
              {stockRequests.filter((r) => r.status === 'En attente').length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full border-2 border-slate-950 shadow animate-pulse">
                  {stockRequests.filter((r) => r.status === 'En attente').length}
                </span>
              )}
            </button>
          </div>

          {/* Automotive Theme Selector */}
          <div className="flex items-center gap-1.5">
            <select
              value={theme}
              onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
              className={`text-xs font-bold py-2 px-3 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isLightTheme
                  ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
                  : theme === 'carbon'
                  ? 'bg-neutral-950 border-red-500/40 text-red-400'
                  : theme === 'electric_cyan'
                  ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                  : theme === 'luxury_gold'
                  ? 'bg-amber-950/90 border-amber-500/40 text-amber-300'
                  : theme === 'titanium'
                  ? 'bg-slate-900 border-slate-600 text-slate-200'
                  : theme === 'red'
                  ? 'bg-red-950 border-red-700 text-red-200'
                  : 'bg-slate-950 border-slate-800 text-white'
              }`}
              title="Sélectionner le Thème Automobile Professionnel"
            >
              <optgroup label="✨ Thèmes Très Clairs & Professionnels">
                <option value="light">☀️ Showroom Blanc Pur & Platine</option>
                <option value="nordic_clean">❄️ Blanc Polaire & Cobalt Pro</option>
                <option value="pearl_luxury">💎 Perle Blanche & Or Champagne</option>
                <option value="crystal_cyan">🌊 Blanc Cristal & Cyan Tech</option>
              </optgroup>
              <optgroup label="🌙 Thèmes Sombres & High-Tech">
                <option value="dark">🌑 Nuit Carbone (Sombre)</option>
                <option value="red">🔴 Chery Crimson Racing</option>
                <option value="carbon">🏎️ Fibre de Carbone Sport</option>
                <option value="electric_cyan">⚡ Omoda EV Cyber Cyan</option>
                <option value="luxury_gold">👑 Tiggo Gold Prestige</option>
                <option value="titanium">🛡️ Titanium High-Tech</option>
              </optgroup>
            </select>
          </div>

          <div className={`flex items-center gap-3 p-1.5 px-3 rounded-xl border ${isLightTheme ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-800/80 border-slate-700'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-800 text-white font-black text-xs flex items-center justify-center shadow-md border border-red-500/40 select-none shrink-0">
                {(currentUser.name || '')
                  .split(' ')
                  .filter(Boolean)
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'U'}
              </div>
              <div className="text-left text-xs">
                <div className={`font-semibold flex items-center gap-1.5 ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>
                  <span>{currentUser.name}</span>
                  {currentUser.role === 'super_admin' ? (
                    <span className="bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] px-1.5 py-0.2 rounded border border-purple-500/40 font-mono font-bold flex items-center gap-1">
                      ⚡ SUPER ADMIN DSI
                    </span>
                  ) : currentUser.role === 'admin' ? (
                    <span className="bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] px-1.5 py-0.2 rounded border border-amber-500/30 font-mono font-bold">
                      {currentUser.title || 'ADMIN'}
                    </span>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30 font-semibold flex items-center gap-1">
                      COMMERCIAL
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-[11px] truncate max-w-[150px] ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                    {currentUser.agency}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangePasswordOpen(true);
                        setCurrentPassInput('');
                        setNewPassInput('');
                        setConfirmPassInput('');
                        setPassError(null);
                        setPassSuccess(false);
                      }}
                      className="text-[10px] text-amber-500 hover:text-amber-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                      title="Modifier mon mot de passe de session"
                    >
                      <Key className="w-2.5 h-2.5" />
                      <span>Mot de passe</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`h-6 w-px mx-1 ${isLightTheme ? 'bg-slate-300' : 'bg-slate-700'}`} />

            {/* User selector dropdown */}
            <div className="relative flex items-center gap-2">
              <select
                value={currentUser.id}
                onChange={(e) => handleUserDropdownChange(e.target.value)}
                className={`text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium cursor-pointer ${selectBgClass}`}
              >
                <optgroup label="Direction Informatique (Super Admin DSI)">
                  {allUsers
                    .filter((u) => u.role === 'super_admin')
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        ⚡ {user.name} ({user.title})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Administrateurs / Direction Générale">
                  {allUsers
                    .filter((u) => u.role === 'admin')
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        🛡️ {user.name} ({user.title || 'Admin'})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Commerciaux Agences">
                  {allUsers
                    .filter((u) => u.role === 'commercial')
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        👤 {user.name} ({user.agency.split('-')[1]?.trim() || user.agency})
                      </option>
                    ))}
                </optgroup>
              </select>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                title="Se déconnecter de la session"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/25 text-red-500 dark:text-red-400 hover:text-red-600 border border-red-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs with Animated Motion Indicator */}
      <div className={`${subHeaderBgClass} border-t transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 sm:space-x-2 py-2 relative">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-white font-bold'
                  : isLightTheme ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {activeTab === 'dashboard' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-red-600 rounded-lg shadow-md shadow-red-600/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Tableau de Bord Disponibilités</span>
                {outOfStockCount > 0 && (
                  <span className="ml-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow">
                    {outOfStockCount}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'reservations'
                  ? 'text-white font-bold'
                  : isLightTheme ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {activeTab === 'reservations' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-red-600 rounded-lg shadow-md shadow-red-600/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>
                  {currentUser.role === 'admin' || currentUser.role === 'super_admin' ? 'Toutes les Réservations' : 'Mes Réservations Client'}
                </span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admin_docs')}
              className={`relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'admin_docs'
                  ? 'text-white font-bold'
                  : isLightTheme ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {activeTab === 'admin_docs' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-red-600 rounded-lg shadow-md shadow-red-600/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                <span>Documents Administratifs (Check-lists)</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge_base')}
              className={`relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'knowledge_base'
                  ? 'text-white font-bold'
                  : isLightTheme ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {activeTab === 'knowledge_base' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-red-600 rounded-lg shadow-md shadow-red-600/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Base de Connaissances</span>
              </span>
            </button>

            {(currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'admin'
                    ? 'text-white font-bold'
                    : isLightTheme ? 'text-amber-700 hover:text-amber-900 hover:bg-amber-100/60' : 'text-amber-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {activeTab === 'admin' && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-amber-600 rounded-lg shadow-md shadow-amber-600/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>{currentUser.role === 'super_admin' ? 'Espace Super Admin (DSI)' : 'Espace Administrateur'}</span>
                </span>
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3 py-1.5 shrink-0 relative">
            <div className={`hidden lg:flex items-center gap-2 text-xs font-mono ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Réseau Chery TN Sync Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Password Authentication for Session Switch */}
      <AnimatePresence>
        {pendingUserToSwitch && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 text-slate-100">
            <motion.form
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleVerifyAndSwitch}
              autoComplete="off"
              className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 ${
                theme === 'light'
                  ? 'bg-white text-slate-900 border-slate-200'
                  : 'bg-slate-900 text-white border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  <h3 className="font-extrabold text-base">Authentification Requise</h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setPendingUserToSwitch(null); setInputPassword(''); }}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                <img
                  src={pendingUserToSwitch.avatar}
                  alt={pendingUserToSwitch.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
                />
                <div>
                  <h4 className="font-extrabold text-sm">{pendingUserToSwitch.name}</h4>
                  <p className="text-xs text-slate-400">{pendingUserToSwitch.agency}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.2 bg-red-500/10 text-red-500 font-mono text-[10px] rounded font-bold border border-red-500/20">
                    {pendingUserToSwitch.role === 'admin' ? pendingUserToSwitch.title || 'ADMINISTRATION' : 'COMMERCIAL'}
                  </span>
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold block">Saisir le Mot de Passe :</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoFocus
                    required
                    autoComplete="off"
                    data-lpignore="true"
                    placeholder="Saisissez votre mot de passe..."
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className={`w-full border rounded-xl pl-3 pr-10 py-2.5 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      theme === 'light' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => { setPendingUserToSwitch(null); setInputPassword(''); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Valider & Se Connecter
                </button>
              </div>
            </motion.form>
          </div>
        )}
        {/* Automatic Stock Request Notifications Modal / Drawer */}
        {showNotificationsModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl relative">
                    <Bell className="w-5 h-5 animate-pulse" />
                    {stockRequests.filter((r) => r.status === 'En attente').length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <span>Alertes & Notifications Automatiques</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold rounded-full border border-blue-500/30">
                        LIVE DSI
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Suivi en temps réel des demandes de quotas et réapprovisionnements stock
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNotificationsModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Summary Pill */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center text-xs">
                <div className="p-2 bg-amber-950/40 border border-amber-500/30 rounded-lg">
                  <span className="block font-black text-amber-400 text-lg">
                    {stockRequests.filter((r) => r.status === 'En attente').length}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">En Attente</span>
                </div>
                <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                  <span className="block font-black text-emerald-400 text-lg">
                    {stockRequests.filter((r) => r.status === 'Approuvé').length}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Approuvées</span>
                </div>
                <div className="p-2 bg-rose-950/40 border border-rose-500/30 rounded-lg">
                  <span className="block font-black text-rose-400 text-lg">
                    {stockRequests.filter((r) => r.status === 'Refusé').length}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Refusées</span>
                </div>
              </div>

              {/* List of Notifications */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {stockRequests.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 space-y-2">
                    <Bell className="w-10 h-10 mx-auto text-slate-700" />
                    <p className="text-xs font-semibold">Aucune notification pour le moment.</p>
                  </div>
                ) : (
                  stockRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        req.status === 'En attente'
                          ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-950/20'
                          : req.status === 'Approuvé'
                          ? 'bg-slate-950/60 border-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800 opacity-75'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-xs">{req.commercialName}</span>
                          {req.commercialAgency && (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded border border-slate-700">
                              {req.commercialAgency}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                              req.status === 'En attente'
                                ? 'bg-amber-950 text-amber-300 border-amber-500/60 animate-pulse'
                                : req.status === 'Approuvé'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                : 'bg-rose-950 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            {req.status === 'En attente' && <Clock className="w-3 h-3 text-amber-400" />}
                            {req.status === 'Approuvé' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {req.status === 'Refusé' && <X className="w-3 h-3 text-rose-400" />}
                            <span>{req.status}</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">
                          Demande : <strong className="text-red-400">{req.carName}</strong> (+{req.requestedQuantity} Réservations)
                        </p>

                        {req.reason && (
                          <p className="text-[11px] text-slate-400 italic">"{req.reason}"</p>
                        )}

                        <p className="text-[10px] text-slate-500 font-mono">
                          Transmis le {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {(currentUser.role === 'admin' || currentUser.role === 'super_admin') && req.status === 'En attente' && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowNotificationsModal(false);
                            setActiveTab('admin');
                          }}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shrink-0 transition-all cursor-pointer shadow"
                        >
                          <span>Traiter</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {(currentUser.role === 'admin' || currentUser.role === 'super_admin') ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotificationsModal(false);
                      setActiveTab('admin');
                    }}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-950"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Ouvrir l'Espace Administration & Validation Quotas</span>
                  </button>
                ) : (
                  <p className="text-xs text-slate-400 text-center w-full">
                    Vos demandes de quota sont transmises directement à la Direction Commerciale Chery Tunisie.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Self Password Change Modal */}
      <AnimatePresence>
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <KeyRound className="w-5 h-5" />
                  <h3 className="font-extrabold text-white text-base">Modifier mon Mot de Passe</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Info Box */}
              <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-rose-800 text-white font-black text-sm flex items-center justify-center border-2 border-amber-500/70 shrink-0 shadow">
                  {(currentUser.name || '')
                    .split(' ')
                    .filter(Boolean)
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-white text-xs truncate">{currentUser.name}</h4>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border ${
                        currentUser.role === 'super_admin'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : currentUser.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {currentUser.role === 'super_admin' ? 'SUPER ADMIN' : currentUser.role === 'admin' ? 'ADMIN' : 'COMMERCIAL'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.agency}</p>
                </div>
              </div>

              {/* Feedback messages */}
              {passError && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-2xl text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/70 rounded-2xl text-emerald-200 text-xs flex items-center gap-2.5 shadow-lg animate-pulse">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Mot de passe modifié avec succès !</p>
                    <p className="text-[11px] text-emerald-300">Synchronisé en temps réel avec la base de données.</p>
                  </div>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handleSaveSelfPassword} className="space-y-4">
                {/* Current Password Field */}
                {currentUser.role !== 'super_admin' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Mot de passe actuel :
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="Saisissez votre mot de passe actuel..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Nouveau mot de passe :
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      placeholder="Entrez votre nouveau mot de passe (min. 4 caractères)..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Preset Shortcuts */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Raccourcis suggérés :</span>
                    {['STA@2026+', 'Chery2026!', 'Tiggo#2026', 'STA#Vente1'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setNewPassInput(preset);
                          setConfirmPassInput(preset);
                        }}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono rounded border border-slate-700 cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm New Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Confirmer le nouveau mot de passe :
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      placeholder="Répétez le nouveau mot de passe..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-950 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enregistrer mon Mot de Passe</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};


