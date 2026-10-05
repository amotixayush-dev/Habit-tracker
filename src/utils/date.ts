import { Habit, HabitLogs, MonthlyReport, MonthlyHabitStat } from '../types';

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getMonthName(monthIndex: number): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return names[monthIndex] || '';
}

export function isHabitScheduledForDate(habit: Habit, date: Date): boolean {
  if (habit.archived) return false;
  
  // Check if date is before habit creation date
  const habitCreation = new Date(habit.createdAt);
  habitCreation.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  if (target < habitCreation) return false;

  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return Array.isArray(habit.customDays) && habit.customDays.includes(dayOfWeek);
    default:
      return true;
  }
}

export function calculateHabitStreaks(habit: Habit, logs: HabitLogs, asOfDate: Date = new Date()): { currentStreak: number; longestStreak: number } {
  const habitLogs = logs[habit.id] || {};
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const creationDate = new Date(habit.createdAt);
  creationDate.setHours(0, 0, 0, 0);

  const cur = new Date(creationDate);
  const end = new Date(asOfDate);
  end.setHours(23, 59, 59, 999);

  // Traverse day by day from creation up to asOfDate
  while (cur <= end) {
    if (isHabitScheduledForDate(habit, cur)) {
      const dateKey = formatDateKey(cur);
      const isCompleted = habitLogs[dateKey]?.completed;

      if (isCompleted) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        // If not completed and it's today, streak isn't necessarily broken yet
        const isToday = formatDateKey(cur) === formatDateKey(new Date());
        if (!isToday) {
          tempStreak = 0;
        }
      }
    }
    cur.setDate(cur.getDate() + 1);
  }

  // Calculate current streak backwards from today/yesterday
  currentStreak = 0;
  const back = new Date(asOfDate);
  back.setHours(0, 0, 0, 0);
  
  // Check today
  const todayKey = formatDateKey(back);
  const todayScheduled = isHabitScheduledForDate(habit, back);
  const todayDone = habitLogs[todayKey]?.completed;

  if (todayScheduled && todayDone) {
    currentStreak++;
    back.setDate(back.getDate() - 1);
  } else if (!todayScheduled) {
    // If today is not scheduled, continue check from yesterday
    back.setDate(back.getDate() - 1);
  } else {
    // Today was scheduled but not done yet. Check yesterday
    back.setDate(back.getDate() - 1);
  }

  // Walk backwards
  while (back >= creationDate) {
    if (isHabitScheduledForDate(habit, back)) {
      const key = formatDateKey(back);
      if (habitLogs[key]?.completed) {
        currentStreak++;
      } else {
        break;
      }
    }
    back.setDate(back.getDate() - 1);
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}

export function generateMonthlyReport(
  habits: Habit[],
  logs: HabitLogs,
  year: number,
  month: number
): MonthlyReport {
  const monthName = getMonthName(month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeHabits = habits.filter(h => !h.archived);

  const calendarDays: MonthlyReport['calendarDays'] = [];
  let totalScheduled = 0;
  let totalCompleted = 0;
  let perfectDaysCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDateKey(date);
    const dayOfWeek = date.getDay();

    let dayScheduled = 0;
    let dayCompleted = 0;

    activeHabits.forEach(habit => {
      if (isHabitScheduledForDate(habit, date)) {
        dayScheduled++;
        if (logs[habit.id]?.[dateStr]?.completed) {
          dayCompleted++;
        }
      }
    });

    const percentage = dayScheduled > 0 ? Math.round((dayCompleted / dayScheduled) * 100) : 0;
    
    // Intensity level: 0 = none, 1 = 1-25%, 2 = 26-50%, 3 = 51-75%, 4 = 76-100%
    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (dayScheduled > 0 && dayCompleted > 0) {
      if (percentage >= 85) intensity = 4;
      else if (percentage >= 60) intensity = 3;
      else if (percentage >= 35) intensity = 2;
      else intensity = 1;
    }

    if (dayScheduled > 0 && dayCompleted === dayScheduled) {
      perfectDaysCount++;
    }

    totalScheduled += dayScheduled;
    totalCompleted += dayCompleted;

    calendarDays.push({
      dateStr,
      dayOfMonth: day,
      dayOfWeek,
      scheduledCount: dayScheduled,
      completedCount: dayCompleted,
      percentage,
      intensity,
    });
  }

  // Per habit stats for this month
  const habitStats: MonthlyHabitStat[] = activeHabits.map(habit => {
    let scheduledDays = 0;
    let completedDays = 0;
    let longestStreak = 0;
    let curStreak = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (isHabitScheduledForDate(habit, date)) {
        scheduledDays++;
        const dateStr = formatDateKey(date);
        const isDone = logs[habit.id]?.[dateStr]?.completed;
        if (isDone) {
          completedDays++;
          curStreak++;
          if (curStreak > longestStreak) longestStreak = curStreak;
        } else {
          curStreak = 0;
        }
      }
    }

    const { currentStreak } = calculateHabitStreaks(habit, logs, new Date());
    const percentage = scheduledDays > 0 ? Math.round((completedDays / scheduledDays) * 100) : 0;

    return {
      habit,
      scheduledDays,
      completedDays,
      percentage,
      longestStreakInMonth: longestStreak,
      currentStreak,
    };
  });

  // Sort habit stats by highest completion rate
  habitStats.sort((a, b) => b.percentage - a.percentage);

  const bestPerformingHabit = habitStats.length > 0 && habitStats[0].completedDays > 0
    ? habitStats[0].habit.name
    : null;

  const longestStreakOverall = habitStats.reduce(
    (max, item) => Math.max(max, item.longestStreakInMonth),
    0
  );

  const completionRate = totalScheduled > 0
    ? Math.round((totalCompleted / totalScheduled) * 100)
    : 0;

  return {
    year,
    month,
    monthName,
    totalHabits: activeHabits.length,
    totalScheduled,
    totalCompleted,
    completionRate,
    perfectDaysCount,
    bestPerformingHabit,
    longestStreakOverall,
    calendarDays,
    habitStats,
  };
}
