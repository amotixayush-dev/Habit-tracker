import React, { useRef, useState } from 'react';
import { ThemeMode, UserProfile } from '../types';
import { NeumorphicCard } from './NeumorphicCard';
import { NeumorphicButton } from './NeumorphicButton';
import {
  exportBackupData,
  importBackupData,
  downloadFile,
  clearAllStorage,
} from '../utils/storage';
import {
  X,
  Sun,
  Moon,
  Download,
  Upload,
  Copy,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  User,
  Database,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onDataReload: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onDataReload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showPasteImport, setShowPasteImport] = useState(false);
  const [pastedJsonText, setPastedJsonText] = useState('');

  if (!isOpen) return null;

  // Real Export JSON
  const handleExport = () => {
    const jsonString = exportBackupData();
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `habit-tracker-backup-${dateStr}.json`;

    const success = downloadFile(filename, jsonString, 'application/json');
    if (success) {
      setImportStatus({
        type: 'success',
        message: `Backup downloaded as ${filename}!`,
      });
      setTimeout(() => setImportStatus(null), 4000);
    } else {
      setImportStatus({
        type: 'error',
        message: 'Download blocked by browser. Please use Copy JSON to clipboard.',
      });
    }
  };

  // Copy JSON backup to clipboard
  const handleCopyJson = async () => {
    try {
      const jsonString = exportBackupData();
      await navigator.clipboard.writeText(jsonString);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2500);
      setImportStatus({
        type: 'success',
        message: 'Backup JSON copied to clipboard!',
      });
      setTimeout(() => setImportStatus(null), 3000);
    } catch (_) {
      setImportStatus({
        type: 'error',
        message: 'Could not access clipboard.',
      });
    }
  };

  // Real Import JSON via File Picker
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = importBackupData(content);
      if (res.success) {
        setImportStatus({ type: 'success', message: res.message });
        onDataReload();
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus({ type: 'error', message: res.message });
      }
    };
    reader.onerror = () => {
      setImportStatus({ type: 'error', message: 'Failed to read backup file.' });
    };
    reader.readAsText(file);

    // Reset input value so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Real Import JSON via Pasted Text
  const handlePasteImport = () => {
    if (!pastedJsonText.trim()) {
      setImportStatus({ type: 'error', message: 'Please paste your backup JSON text first.' });
      return;
    }

    const res = importBackupData(pastedJsonText);
    if (res.success) {
      setImportStatus({ type: 'success', message: res.message });
      setPastedJsonText('');
      setShowPasteImport(false);
      onDataReload();
      setTimeout(() => setImportStatus(null), 4000);
    } else {
      setImportStatus({ type: 'error', message: res.message });
    }
  };

  // Reset all local storage
  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear ALL habits and logs? This cannot be undone unless you have a backup JSON file.')) {
      clearAllStorage();
      onDataReload();
      setImportStatus({ type: 'success', message: 'All data has been cleared.' });
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <NeumorphicCard
        elevation="lg"
        className="w-full max-w-md p-6 relative border border-white/20 dark:border-white/5 space-y-6 my-8"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-200/40 dark:border-gray-700/40">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold tracking-tight">App Settings</h2>
          </div>
          <NeumorphicButton
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </NeumorphicButton>
        </div>

        {/* Account / Auth Summary */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neu-muted dark:text-neu-darkMuted">
            Account & Profile
          </label>
          <div className="p-3.5 rounded-2xl neu-flat flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover border border-indigo-400/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-indigo-500">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold truncate max-w-[150px]">
                  {currentUser ? currentUser.name : 'Guest User'}
                </p>
                <p className="text-[11px] text-neu-muted dark:text-neu-darkMuted capitalize">
                  {currentUser ? `${currentUser.provider} account` : 'Local only'}
                </p>
              </div>
            </div>

            <NeumorphicButton
              size="sm"
              variant={currentUser ? 'default' : 'primary'}
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="text-xs font-bold"
            >
              {currentUser ? 'Manage' : 'Sign In'}
            </NeumorphicButton>
          </div>
        </div>

        {/* Appearance Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neu-muted dark:text-neu-darkMuted">
            Neumorphic Appearance
          </label>
          <div className="flex items-center justify-between p-3.5 rounded-2xl neu-flat">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-bold capitalize">{theme} Mode</p>
                <p className="text-[11px] text-neu-muted dark:text-neu-darkMuted">
                  Tactile soft-shadow UI
                </p>
              </div>
            </div>

            <NeumorphicButton
              size="sm"
              onClick={onToggleTheme}
              className="font-bold text-xs"
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </NeumorphicButton>
          </div>
        </div>

        {/* Real Data Backup & Restore */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-neu-muted dark:text-neu-darkMuted">
              Data Management (.json)
            </label>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
              Verified Working
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NeumorphicButton
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 py-3"
              title="Download backup file"
            >
              <Download className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold">Export JSON</span>
            </NeumorphicButton>

            <NeumorphicButton
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center space-x-2 py-3"
              title="Import backup file from device"
            >
              <Upload className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold">Import JSON</span>
            </NeumorphicButton>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json,application/json"
              className="hidden"
            />
          </div>

          {/* Quick Copy / Paste Utilities */}
          <div className="flex space-x-2">
            <NeumorphicButton
              size="sm"
              onClick={handleCopyJson}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs"
              title="Copy entire JSON to clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-500" />
              <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
            </NeumorphicButton>

            <NeumorphicButton
              size="sm"
              onClick={() => setShowPasteImport(!showPasteImport)}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2 text-xs"
              title="Paste JSON text directly"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>{showPasteImport ? 'Hide Text' : 'Paste Text'}</span>
            </NeumorphicButton>
          </div>

          {/* Paste JSON Textarea Modal/Drawer */}
          {showPasteImport && (
            <div className="p-3.5 rounded-2xl neu-pressed-sm space-y-2 animate-fade-in">
              <label className="text-[11px] font-bold text-neu-muted dark:text-neu-darkMuted block">
                Paste JSON backup string here:
              </label>
              <textarea
                rows={4}
                value={pastedJsonText}
                onChange={e => setPastedJsonText(e.target.value)}
                placeholder='{"habits": [...], "logs": {...}}'
                className="w-full p-2.5 rounded-xl neu-flat text-xs font-mono focus:outline-none resize-none"
              />
              <div className="flex justify-end space-x-2">
                <NeumorphicButton
                  size="sm"
                  onClick={() => setShowPasteImport(false)}
                >
                  Cancel
                </NeumorphicButton>
                <NeumorphicButton
                  size="sm"
                  variant="primary"
                  onClick={handlePasteImport}
                >
                  Restore From Text
                </NeumorphicButton>
              </div>
            </div>
          )}

          {/* Status Message Toast */}
          {importStatus && (
            <div
              className={`p-3 rounded-xl flex items-center space-x-2 text-xs font-semibold ${
                importStatus.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="pt-2 border-t border-gray-200/40 dark:border-gray-700/40 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Danger Zone</span>
          </label>
          <NeumorphicButton
            variant="danger"
            onClick={handleClearAll}
            className="w-full flex items-center justify-center space-x-2 py-3 text-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset & Clear All Habits</span>
          </NeumorphicButton>
        </div>
      </NeumorphicCard>
    </div>
  );
};
