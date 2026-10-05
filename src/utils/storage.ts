import { Habit, HabitLogs, ThemeMode, UserProfile } from '../types';

const STORAGE_KEYS = {
  HABITS: 'neu_habit_tracker_habits_v1',
  LOGS: 'neu_habit_tracker_logs_v1',
  THEME: 'neu_habit_tracker_theme_v1',
  USER: 'neu_habit_tracker_user_v1',
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

export function loadUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (e) {
    console.error('Failed to load user from localStorage', e);
    return null;
  }
}

export function saveUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
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
  const user = loadUser();

  const backupObject = {
    version: 2,
    appName: 'Neumorphic Habit Tracker',
    exportedAt: new Date().toISOString(),
    user: user ? { name: user.name, email: user.email, provider: user.provider } : null,
    metadata: {
      totalHabits: habits.length,
      totalLogDays: Object.keys(logs).reduce((acc, hId) => acc + Object.keys(logs[hId] || {}).length, 0),
    },
    habits,
    logs,
  };

  return JSON.stringify(backupObject, null, 2);
}

export interface ImportResult {
  success: boolean;
  message: string;
  habitsCount: number;
  logsCount: number;
}

export function importBackupData(jsonString: string): ImportResult {
  try {
    if (!jsonString || typeof jsonString !== 'string' || !jsonString.trim()) {
      return { success: false, message: 'File is empty.', habitsCount: 0, logsCount: 0 };
    }

    const parsed = JSON.parse(jsonString);

    let importedHabits: Habit[] = [];
    let importedLogs: HabitLogs = {};

    // Support both wrapper format { habits: [...], logs: {...} } and direct array [...]
    if (Array.isArray(parsed)) {
      importedHabits = parsed;
      importedLogs = loadLogs(); // preserve current logs
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.habits)) {
        importedHabits = parsed.habits;
      }
      if (parsed.logs && typeof parsed.logs === 'object' && !Array.isArray(parsed.logs)) {
        importedLogs = parsed.logs;
      }
    } else {
      return { success: false, message: 'Invalid JSON format.', habitsCount: 0, logsCount: 0 };
    }

    // Validate and sanitize habits
    const sanitizedHabits: Habit[] = [];
    for (const h of importedHabits) {
      if (h && typeof h === 'object' && typeof h.name === 'string' && h.name.trim()) {
        sanitizedHabits.push({
          id: typeof h.id === 'string' && h.id ? h.id : 'h_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          name: h.name.trim(),
          description: typeof h.description === 'string' ? h.description : '',
          category: h.category || 'lifestyle',
          color: typeof h.color === 'string' && h.color ? h.color : '#6366f1',
          frequency: h.frequency || 'daily',
          customDays: Array.isArray(h.customDays) ? h.customDays : [0, 1, 2, 3, 4, 5, 6],
          targetCount: typeof h.targetCount === 'number' && h.targetCount > 0 ? h.targetCount : 1,
          unit: typeof h.unit === 'string' && h.unit ? h.unit : 'times',
          createdAt: typeof h.createdAt === 'string' && h.createdAt ? h.createdAt : new Date().toISOString(),
          archived: Boolean(h.archived),
        });
      }
    }

    // Sanitize logs
    const sanitizedLogs: HabitLogs = {};
    for (const [habitId, dateLogs] of Object.entries(importedLogs)) {
      if (dateLogs && typeof dateLogs === 'object' && !Array.isArray(dateLogs)) {
        sanitizedLogs[habitId] = {};
        for (const [dateKey, dayLog] of Object.entries(dateLogs)) {
          if (dayLog && typeof dayLog === 'object') {
            sanitizedLogs[habitId][dateKey] = {
              completed: Boolean(dayLog.completed),
              count: typeof dayLog.count === 'number' ? dayLog.count : (dayLog.completed ? 1 : 0),
              note: typeof dayLog.note === 'string' ? dayLog.note : undefined,
              updatedAt: typeof dayLog.updatedAt === 'string' ? dayLog.updatedAt : new Date().toISOString(),
            };
          }
        }
      }
    }

    if (sanitizedHabits.length === 0 && Object.keys(sanitizedLogs).length === 0) {
      return {
        success: false,
        message: 'No valid habit or log records detected in this file.',
        habitsCount: 0,
        logsCount: 0,
      };
    }

    // Save to localStorage
    saveHabits(sanitizedHabits);
    saveLogs(sanitizedLogs);

    const logsCount = Object.keys(sanitizedLogs).reduce(
      (acc, hId) => acc + Object.keys(sanitizedLogs[hId] || {}).length,
      0
    );

    return {
      success: true,
      message: `Successfully imported ${sanitizedHabits.length} habits and ${logsCount} check-in records!`,
      habitsCount: sanitizedHabits.length,
      logsCount,
    };
  } catch (e: any) {
    console.error('Import failed', e);
    return {
      success: false,
      message: `Failed to parse JSON: ${e?.message || 'Syntax error'}`,
      habitsCount: 0,
      logsCount: 0,
    };
  }
}

/**
 * Robust file downloader that works across desktop browsers,
 * Android webviews, and Capacitor contexts.
 */
export function downloadFile(filename: string, content: string, mimeType = 'application/json'): boolean {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Must attach to body for Firefox & Mobile Chromium webviews
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);

    return true;
  } catch (error) {
    console.error('Download trigger failed, attempting fallback', error);
    try {
      // Fallback using data URI
      const encodedUri = `data:${mimeType};charset=utf-8,` + encodeURIComponent(content);
      const link = document.createElement('a');
      link.href = encodedUri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (fallbackError) {
      console.error('Fallback download also failed', fallbackError);
      return false;
    }
  }
}

export function clearAllStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.HABITS);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
}
