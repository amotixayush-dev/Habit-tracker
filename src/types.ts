export type HabitCategory =
  | 'health'
  | 'fitness'
  | 'mind'
  | 'productivity'
  | 'learning'
  | 'finance'
  | 'lifestyle';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  color: string;
  frequency: HabitFrequency;
  customDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  targetCount: number;
  unit: string;
  createdAt: string;
  archived?: boolean;
}

export interface DayLog {
  completed: boolean;
  count: number;
  note?: string;
  updatedAt: string;
}

// logs[habitId][YYYY-MM-DD] = DayLog
export type HabitLogs = Record<string, Record<string, DayLog>>;

export interface MonthlyHabitStat {
  habit: Habit;
  scheduledDays: number;
  completedDays: number;
  percentage: number;
  longestStreakInMonth: number;
  currentStreak: number;
}

export interface MonthlyReport {
  year: number;
  month: number; // 0-11
  monthName: string;
  totalHabits: number;
  totalScheduled: number;
  totalCompleted: number;
  completionRate: number;
  perfectDaysCount: number;
  bestPerformingHabit: string | null;
  longestStreakOverall: number;
  calendarDays: Array<{
    dateStr: string; // YYYY-MM-DD
    dayOfMonth: number;
    dayOfWeek: number;
    scheduledCount: number;
    completedCount: number;
    percentage: number;
    intensity: 0 | 1 | 2 | 3 | 4; // for heatmap
  }>;
  habitStats: MonthlyHabitStat[];
}

export type ThemeMode = 'light' | 'dark';
