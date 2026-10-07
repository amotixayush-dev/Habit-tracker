import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, AuthProvider } from '../types';
import { NeumorphicCard } from './NeumorphicCard';
import { NeumorphicButton } from './NeumorphicButton';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Social OAuth simulator state
  const [socialPrompt, setSocialPrompt] = useState<'google' | 'github' | null>(null);
  const [customSocialEmail, setCustomSocialEmail] = useState('');

  

  // Handle Google OAuth
  const handleGoogleAuth = (customEmail?: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    const userEmail = customEmail?.trim() || 'ayush.habit@gmail.com';
    const userName = userEmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

    setTimeout(() => {
      const newUser: UserProfile = {
        id: 'usr_g_' + Date.now(),
        name: formattedName,
        email: userEmail,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`,
        provider: 'google',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      onLogin(newUser);
      setIsProcessing(false);
      setSocialPrompt(null);
      onClose();
    }, 600);
  };

  // Handle GitHub OAuth
  const handleGitHubAuth = () => {
    setIsProcessing(true);
    setErrorMessage(null);

    setTimeout(() => {
      const newUser: UserProfile = {
        id: 'usr_gh_' + Date.now(),
        name: 'amotixayush-dev',
        email: 'amotixayush-dev@users.noreply.github.com',
        avatarUrl: 'https://github.com/amotixayush-dev.png',
        provider: 'github',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      onLogin(newUser);
      setIsProcessing(false);
      setSocialPrompt(null);
      onClose();
    }, 600);
  };

  // Handle Email/Password Form Submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (authMode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const displayName =
        authMode === 'signup'
          ? name.trim()
          : email.split('@')[0].replace(/[._]/g, ' ');

      const newUser: UserProfile = {
        id: 'usr_em_' + Date.now(),
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: email.trim().toLowerCase(),
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        provider: 'email',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      onLogin(newUser);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  // Continue as Guest
  const handleContinueAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'usr_guest_' + Date.now(),
      name: 'Guest Explorer',
      email: 'local.guest@device.offline',
      provider: 'guest',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    onLogin(guestUser);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
            className="w-full max-w-md"
          >
            <NeumorphicCard
              elevation="lg"
              className="w-full p-6 relative border border-white/20 dark:border-white/5 space-y-5 overflow-hidden"
            >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200/40 dark:border-gray-700/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl neu-flat flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {currentUser ? 'Your Account' : authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-[11px] text-neu-muted dark:text-neu-darkMuted font-medium">
                {currentUser
                  ? 'Manage your profile and synchronization'
                  : 'Sync habits across your devices'}
              </p>
            </div>
          </div>
          <NeumorphicButton size="icon" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4 text-gray-500" />
          </NeumorphicButton>
        </div>

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl neu-flat flex items-center space-x-4">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-2xl border-2 border-indigo-500/20 object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl neu-pressed flex items-center justify-center text-indigo-500 font-bold text-xl">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base truncate">{currentUser.name}</h3>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {currentUser.provider}
                  </span>
                </div>
                <p className="text-xs text-neu-muted dark:text-neu-darkMuted truncate">
                  {currentUser.email}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Offline Storage & Cloud Sync Ready</span>
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl neu-pressed-sm space-y-1.5 text-xs text-neu-muted dark:text-neu-darkMuted">
              <div className="flex justify-between">
                <span>Account Provider:</span>
                <span className="font-semibold text-neu-text dark:text-neu-darkText capitalize">
                  {currentUser.provider}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Active:</span>
                <span className="font-semibold text-neu-text dark:text-neu-darkText">
                  {new Date(currentUser.lastLoginAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Privacy:</span>
                <span className="font-semibold text-emerald-500 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Zero-Telemetry Local First</span>
                </span>
              </div>
            </div>

            <div className="pt-2 flex space-x-3">
              <NeumorphicButton
                variant="danger"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </NeumorphicButton>
            </div>
          </div>
        ) : (
          /* NOT LOGGED IN / SIGN IN FORM */
          <div className="space-y-4">
            {/* Social Logins */}
            <div className="space-y-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => setSocialPrompt('google')}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl neu-flat flex items-center justify-center space-x-3 active:neu-pressed transition-all text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-600"
              >
                {/* SVG Google Multi-color Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => setSocialPrompt('github')}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl neu-flat flex items-center justify-center space-x-3 active:neu-pressed transition-all text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-600"
              >
                {/* GitHub Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Google Prompt Modal / Quick Choice */}
            {socialPrompt === 'google' && (
              <div className="p-3.5 rounded-2xl neu-pressed-sm border border-indigo-400/30 space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Sign in with Google Account</span>
                  <button
                    type="button"
                    onClick={() => setSocialPrompt(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleGoogleAuth('ayush.developer@gmail.com')}
                    className="w-full text-left p-2.5 rounded-xl neu-flat flex items-center space-x-2.5 hover:border-indigo-400"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center">
                      A
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">Ayush (Default)</p>
                      <p className="text-[10px] text-gray-500 truncate">ayush.developer@gmail.com</p>
                    </div>
                  </button>

                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={customSocialEmail}
                      onChange={e => setCustomSocialEmail(e.target.value)}
                      placeholder="Or enter your Google email"
                      className="flex-1 px-3 py-1.5 rounded-lg neu-pressed-sm text-xs focus:outline-none"
                    />
                    <NeumorphicButton
                      size="sm"
                      variant="primary"
                      onClick={() => handleGoogleAuth(customSocialEmail)}
                      disabled={!customSocialEmail.includes('@')}
                    >
                      Connect
                    </NeumorphicButton>
                  </div>
                </div>
              </div>
            )}

            {/* GitHub Prompt Modal / Quick Choice */}
            {socialPrompt === 'github' && (
              <div className="p-3.5 rounded-2xl neu-pressed-sm border border-indigo-400/30 space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Authorize with GitHub</span>
                  <button
                    type="button"
                    onClick={() => setSocialPrompt(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Authorize <strong>Habit Tracker</strong> to connect with your GitHub profile (<strong>@amotixayush-dev</strong>).
                </p>
                <div className="flex space-x-2 pt-1">
                  <NeumorphicButton
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={handleGitHubAuth}
                  >
                    Authorize @amotixayush-dev
                  </NeumorphicButton>
                  <NeumorphicButton
                    size="sm"
                    onClick={() => setSocialPrompt(null)}
                  >
                    Cancel
                  </NeumorphicButton>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200/50 dark:border-gray-700/50"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-neu-muted dark:text-neu-darkMuted">
                Or with Email
              </span>
              <div className="flex-grow border-t border-gray-200/50 dark:border-gray-700/50"></div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-neu-muted dark:text-neu-darkMuted mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full pl-9 pr-3 py-2 rounded-xl neu-pressed-sm text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neu-muted dark:text-neu-darkMuted mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl neu-pressed-sm text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neu-muted dark:text-neu-darkMuted mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 rounded-xl neu-pressed-sm text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
              )}

              <NeumorphicButton
                variant="primary"
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center space-x-2 py-3"
              >
                <span>{isProcessing ? 'Authenticating...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </NeumorphicButton>
            </form>

            {/* Toggle Signin / Signup */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setErrorMessage(null);
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {authMode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>

              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-neu-muted dark:text-neu-darkMuted hover:underline"
              >
                Skip (Guest)
              </button>
            </div>
          </div>
        )}
            </NeumorphicCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
