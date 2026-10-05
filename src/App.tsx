import React, { useState, useEffect } from 'react';
import { Habit, HabitLogs, ThemeMode, UserProfile } from './types';
import {
  loadHabits,
  saveHabits,
  loadLogs,
  saveLogs,
  loadTheme,
  saveTheme,
  loadUser,
  saveUser,
} from './utils/storage';
import { DailyTracker } from './components/DailyTracker';
import { MonthlyReportView } from './components/MonthlyReport';
import { HabitModal } from './components/HabitModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { NeumorphicButton } from './components/NeumorphicButton';
import {
  CalendarCheck,
  BarChart3,
  Plus,
  Settings,
  Sun,
  Moon,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';

export const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLogs>({});
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedHabits = loadHabits();
    const loadedLogs = loadLogs();
    const loadedTh = loadTheme();
    const loadedUser = loadUser();

    setHabits(loadedHabits);
    setLogs(loadedLogs);
    setTheme(loadedTh);
    setCurrentUser(loadedUser);

    if (loadedTh === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleDataReload = () => {
    setHabits(loadHabits());
    setLogs(loadLogs());
    setCurrentUser(loadUser());
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    saveUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveUser(null);
  };

  const handleSaveHabit = (
    habitData: Omit<Habit, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Edit habit
      const updated = habits.map(h =>
        h.id === existingId ? { ...h, ...habitData } : h
      );
      setHabits(updated);
      saveHabits(updated);
    } else {
      // Add new habit
      const newHabit: Habit = {
        ...habitData,
        id: 'h_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: new Date().toISOString(),
      };
      const updated = [newHabit, ...habits];
      setHabits(updated);
      saveHabits(updated);
    }
    setEditingHabit(null);
  };

  const handleDeleteHabit = (habitId: string) => {
    const updated = habits.filter(h => h.id !== habitId);
    setHabits(updated);
    saveHabits(updated);

    // Clean logs
    const updatedLogs = { ...logs };
    delete updatedLogs[habitId];
    setLogs(updatedLogs);
    saveLogs(updatedLogs);
  };

  const handleToggleHabit = (habitId: string, dateKey: string) => {
    const habitLogs = logs[habitId] || {};
    const existing = habitLogs[dateKey];
    const nextCompleted = !existing?.completed;

    const updated = {
      ...logs,
      [habitId]: {
        ...habitLogs,
        [dateKey]: {
          completed: nextCompleted,
          count: nextCompleted ? 1 : 0,
          note: existing?.note,
          updatedAt: new Date().toISOString(),
        },
      },
    };

    setLogs(updated);
    saveLogs(updated);
  };

  const handleSaveNote = (habitId: string, dateKey: string, note: string) => {
    const habitLogs = logs[habitId] || {};
    const existing = habitLogs[dateKey];

    const updated = {
      ...logs,
      [habitId]: {
        ...habitLogs,
        [dateKey]: {
          completed: existing?.completed || false,
          count: existing?.count || 0,
          note: note.trim(),
          updatedAt: new Date().toISOString(),
        },
      },
    };

    setLogs(updated);
    saveLogs(updated);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-3 mb-4 no-print">
        {/* App Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Habit Tracker</h1>
            <p className="text-[11px] text-neu-muted dark:text-neu-darkMuted font-medium">
              Soft UI & Everyday Consistency
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2">
          {/* User Profile / Sign In Pill */}
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl neu-flat hover:neu-pressed active:scale-95 transition-all text-xs font-bold"
            title={currentUser ? `Logged in as ${currentUser.name}` : 'Sign In with Google, GitHub, or Email'}
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-indigo-400/40"
              />
            ) : (
              <UserIcon className="w-4 h-4 text-indigo-500" />
            )}
            <span className="hidden sm:inline-block max-w-[80px] truncate text-neu-text dark:text-neu-darkText">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Theme Toggle */}
          <NeumorphicButton
            size="icon"
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </NeumorphicButton>

          {/* Settings */}
          <NeumorphicButton
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings"
            title="App Settings & Backup"
          >
            <Settings className="w-4 h-4 text-neu-muted dark:text-neu-darkMuted" />
          </NeumorphicButton>

          {/* New Habit Button */}
          <NeumorphicButton
            variant="primary"
            size="md"
            onClick={() => {
              setEditingHabit(null);
              setIsAddModalOpen(true);
            }}
            className="hidden sm:inline-flex"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Habit
          </NeumorphicButton>
        </div>
      </header>

      {/* Navigation Segmented Control */}
      <div className="max-w-2xl w-full mx-auto mb-6 no-print">
        <div className="flex p-1.5 rounded-2xl neu-pressed-sm">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'daily'
                ? 'neu-button text-indigo-600 dark:text-indigo-400'
                : 'text-neu-muted dark:text-neu-darkMuted hover:text-neu-text dark:hover:text-neu-darkText'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Daily Tracker</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'monthly'
                ? 'neu-button text-indigo-600 dark:text-indigo-400'
                : 'text-neu-muted dark:text-neu-darkMuted hover:text-neu-text dark:hover:text-neu-darkText'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Monthly Report</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto">
        {activeTab === 'daily' ? (
          <DailyTracker
            habits={habits}
            logs={logs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggleHabit={handleToggleHabit}
            onOpenAddModal={() => {
              setEditingHabit(null);
              setIsAddModalOpen(true);
            }}
            onEditHabit={habit => {
              setEditingHabit(habit);
              setIsAddModalOpen(true);
            }}
            onDeleteHabit={handleDeleteHabit}
            onSaveNote={handleSaveNote}
          />
        ) : (
          <MonthlyReportView
            habits={habits}
            logs={logs}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Mobile Floating Action Button (New Habit) */}
      <div className="sm:hidden fixed bottom-6 right-6 z-30 no-print">
        <button
          type="button"
          onClick={() => {
            setEditingHabit(null);
            setIsAddModalOpen(true);
          }}
          className="w-14 h-14 rounded-full neu-flat flex items-center justify-center text-indigo-600 dark:text-indigo-400 active:neu-pressed shadow-2xl"
          aria-label="Add Habit"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Modals */}
      <HabitModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        initialHabit={editingHabit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onDataReload={handleDataReload}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
