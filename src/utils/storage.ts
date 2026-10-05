import { Habit, HabitLogs, ThemeMode } from '../types';

const STORAGE_KEYS = {
  HABITS: 'neu_habit_tracker_habits_v1',
  LOGS: 'neu_habit_tracker_logs_v1',
  THEME: 'neu_habit_tracker_theme_v1',
};

// Start completely clean - no mock or pre-existing habits/data
export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load habits from localStorage', e);
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits to localStorage', e);
  }
}

export function loadLogs(): HabitLogs {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.error('Failed to load logs from localStorage', e);
    return {};
  }
}

export function saveLogs(logs: HabitLogs): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs to localStorage', e);
  }
}

export function loadTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (_) {}
  return 'light';
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (_) {}
}

export function exportBackupData(): string {
  const habits = loadHabits();
  const logs = loadLogs();
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    habits,
    logs,
  }, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.habits) || typeof parsed.logs !== 'object') {
      throw new Error('Invalid backup file structure');
    }
    saveHabits(parsed.habits);
    saveLogs(parsed.logs);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}

export function clearAllStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.HABITS);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
}
