import React, { useRef, useState } from 'react';
import { ThemeMode } from '../types';
import { NeumorphicCard } from './NeumorphicCard';
import { NeumorphicButton } from './NeumorphicButton';
import { exportBackupData, importBackupData, clearAllStorage } from '../utils/storage';
import { X, Sun, Moon, Download, Upload, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onDataReload: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  onDataReload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const json = exportBackupData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = importBackupData(content);
      if (success) {
        setImportStatus('Data successfully restored!');
        onDataReload();
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Error: Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear ALL habits and logs? This action cannot be undone.')) {
      clearAllStorage();
      onDataReload();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <NeumorphicCard
        elevation="lg"
        className="w-full max-w-md p-6 relative border border-white/20 dark:border-white/5 space-y-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-200/40 dark:border-gray-700/40">
          <h2 className="text-xl font-bold tracking-tight">App Settings</h2>
          <NeumorphicButton
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </NeumorphicButton>
        </div>

        {/* Theme Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neu-muted dark:text-neu-darkMuted">
            Neumorphic Appearance
          </label>
          <div className="flex items-center justify-between p-3 rounded-2xl neu-flat-sm">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-bold capitalize">{theme} Mode</p>
                <p className="text-[11px] text-neu-muted dark:text-neu-darkMuted">
                  Soft-shadow neumorphic UI
                </p>
              </div>
            </div>

            <NeumorphicButton
              size="sm"
              onClick={onToggleTheme}
              className="font-bold"
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </NeumorphicButton>
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neu-muted dark:text-neu-darkMuted">
            Data Management
          </label>
          <div className="grid grid-cols-2 gap-3">
            <NeumorphicButton
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 py-3"
            >
              <Download className="w-4 h-4 text-indigo-500" />
              <span>Export JSON</span>
            </NeumorphicButton>

            <NeumorphicButton
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center space-x-2 py-3"
            >
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>Import JSON</span>
            </NeumorphicButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
          </div>

          {importStatus && (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{importStatus}</span>
            </p>
          )}
        </div>

        {/* Reset / Danger Zone */}
        <div className="pt-2 border-t border-gray-200/40 dark:border-gray-700/40 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Danger Zone</span>
          </label>
          <NeumorphicButton
            variant="danger"
            onClick={handleClearAll}
            className="w-full flex items-center justify-center space-x-2 py-3"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset & Clear All Data</span>
          </NeumorphicButton>
        </div>
      </NeumorphicCard>
    </div>
  );
};
