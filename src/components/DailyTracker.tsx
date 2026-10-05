import React, { useState } from 'react';
import { Habit, HabitLogs } from '../types';
import { formatDateKey, isHabitScheduledForDate, calculateHabitStreaks } from '../utils/date';
import { NeumorphicCard } from './NeumorphicCard';
import { NeumorphicButton } from './NeumorphicButton';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Flame,
  Plus,
  MessageSquare,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface DailyTrackerProps {
  habits: Habit[];
  logs: HabitLogs;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onOpenAddModal: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onSaveNote: (habitId: string, dateKey: string, note: string) => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  habits,
  logs,
  selectedDate,
  onSelectDate,
  onToggleHabit,
  onOpenAddModal,
  onEditHabit,
  onDeleteHabit,
  onSaveNote,
}) => {
  const [activeMenuHabitId, setActiveMenuHabitId] = useState<string | null>(null);
  const [editingNoteHabitId, setEditingNoteHabitId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  const selectedDateKey = formatDateKey(selectedDate);
  const isToday = selectedDateKey === formatDateKey(new Date());

  // Habits scheduled for this specific selected day
  const scheduledHabits = habits.filter(h => isHabitScheduledForDate(h, selectedDate));
  const completedHabits = scheduledHabits.filter(
    h => logs[h.id]?.[selectedDateKey]?.completed
  );

  const completionPercentage = scheduledHabits.length > 0
    ? Math.round((completedHabits.length / scheduledHabits.length) * 100)
    : 0;

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    onSelectDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onSelectDate(next);
  };

  const handleToggle = (habitId: string) => {
    const willBeCompleted = !logs[habitId]?.[selectedDateKey]?.completed;
    onToggleHabit(habitId, selectedDateKey);

    // If this completion achieves 100%, trigger celebratory confetti!
    if (willBeCompleted && completedHabits.length + 1 === scheduledHabits.length) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (_) {}
    }
  };

  const handleOpenNote = (habitId: string) => {
    setEditingNoteHabitId(habitId);
    setTempNote(logs[habitId]?.[selectedDateKey]?.note || '');
  };

  const handleSaveNoteSubmit = (habitId: string) => {
    onSaveNote(habitId, selectedDateKey, tempNote);
    setEditingNoteHabitId(null);
  };

  // Generate 7-day pill carousel centered around selectedDate
  const weekDays = [-3, -2, -1, 0, 1, 2, 3].map(offset => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    return d;
  });

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12">
      {/* Date Header & Quick Navigation */}
      <NeumorphicCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <NeumorphicButton
              size="icon"
              onClick={handlePrevDay}
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </NeumorphicButton>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">
                  {selectedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h2>
                {isToday && (
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs text-neu-muted dark:text-neu-darkMuted">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isToday && (
              <NeumorphicButton
                size="sm"
                onClick={() => onSelectDate(new Date())}
              >
                Today
              </NeumorphicButton>
            )}
            <NeumorphicButton
              size="icon"
              onClick={handleNextDay}
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </NeumorphicButton>
          </div>
        </div>

        {/* 7-Day Day Selector Strip */}
        <div className="grid grid-cols-7 gap-1.5 pt-1 border-t border-gray-200/40 dark:border-gray-700/40">
          {weekDays.map((d, idx) => {
            const key = formatDateKey(d);
            const isSelected = key === selectedDateKey;
            const isDToday = key === formatDateKey(new Date());

            // Check if all scheduled habits on that day were completed
            const dayScheduled = habits.filter(h => isHabitScheduledForDate(h, d));
            const dayCompleted = dayScheduled.filter(h => logs[h.id]?.[key]?.completed);
            const isAllDone = dayScheduled.length > 0 && dayCompleted.length === dayScheduled.length;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectDate(d)}
                className={`flex flex-col items-center py-2 px-1 rounded-2xl transition-all relative ${
                  isSelected
                    ? 'neu-pressed text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-indigo-400/40'
                    : 'neu-button text-neu-text dark:text-neu-darkText hover:opacity-80'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold text-neu-muted dark:text-neu-darkMuted">
                  {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                </span>
                <span className="text-sm font-bold mt-0.5">
                  {d.getDate()}
                </span>
                {isDToday && (
                  <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1" />
                )}
                {isAllDone && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>
      </NeumorphicCard>

      {/* Daily Progress Card (only if habits exist) */}
      {scheduledHabits.length > 0 && (
        <NeumorphicCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neu-muted dark:text-neu-darkMuted">
                Daily Momentum
              </span>
              <h3 className="text-xl font-extrabold mt-0.5">
                {completedHabits.length} of {scheduledHabits.length} completed
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {completionPercentage}%
              </span>
            </div>
          </div>

          {/* Neumorphic Inset Progress Bar */}
          <div className="w-full h-3.5 rounded-full neu-pressed-sm overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {completionPercentage === 100 && (
            <div className="flex items-center space-x-2 mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
              <Trophy className="w-4 h-4" />
              <span>Perfect Day! All scheduled habits completed.</span>
            </div>
          )}
        </NeumorphicCard>
      )}

      {/* Habit Cards List */}
      {habits.length === 0 ? (
        /* Empty State: NO PRE-EXISTING DATA */
        <NeumorphicCard className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full neu-pressed mx-auto flex items-center justify-center text-indigo-500">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No Habits Added Yet</h3>
            <p className="text-xs text-neu-muted dark:text-neu-darkMuted max-w-xs mx-auto mt-1">
              Your tracker is clean and ready. Add the everyday habits you want to cultivate and start building momentum!
            </p>
          </div>
          <NeumorphicButton
            variant="primary"
            size="lg"
            onClick={onOpenAddModal}
            className="mt-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Habit
          </NeumorphicButton>
        </NeumorphicCard>
      ) : scheduledHabits.length === 0 ? (
        /* No habits scheduled for this specific day */
        <NeumorphicCard className="p-6 text-center space-y-2 text-neu-muted dark:text-neu-darkMuted">
          <Calendar className="w-8 h-8 mx-auto opacity-60 mb-2" />
          <h4 className="text-sm font-semibold">No habits scheduled for this day</h4>
          <p className="text-xs">Enjoy your rest day or add a daily habit to track every day.</p>
        </NeumorphicCard>
      ) : (
        <div className="space-y-3.5">
          {scheduledHabits.map(habit => {
            const isCompleted = !!logs[habit.id]?.[selectedDateKey]?.completed;
            const habitNote = logs[habit.id]?.[selectedDateKey]?.note;
            const { currentStreak } = calculateHabitStreaks(habit, logs, selectedDate);
            const isMenuOpen = activeMenuHabitId === habit.id;

            return (
              <NeumorphicCard
                key={habit.id}
                className={`p-4 transition-all duration-200 relative ${
                  isCompleted ? 'border-l-4 border-l-emerald-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Info */}
                  <div className="flex items-center space-x-3.5 flex-1 pr-2">
                    {/* Category Color Tag / Indicator */}
                    <div
                      className="w-3.5 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4
                          className={`text-base font-bold truncate transition-all ${
                            isCompleted
                              ? 'line-through text-neu-muted dark:text-neu-darkMuted opacity-80'
                              : ''
                          }`}
                        >
                          {habit.name}
                        </h4>
                      </div>

                      {habit.description && (
                        <p className="text-xs text-neu-muted dark:text-neu-darkMuted truncate mt-0.5">
                          {habit.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-neu-muted dark:text-neu-darkMuted font-medium">
                        {/* Streak Badge */}
                        <span className="flex items-center text-amber-500 font-bold">
                          <Flame className="w-3.5 h-3.5 mr-0.5 fill-amber-500" />
                          {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                        </span>

                        {/* Frequency Tag */}
                        <span className="capitalize opacity-80">
                          {habit.frequency}
                        </span>

                        {/* Target badge */}
                        {habit.targetCount > 1 && (
                          <span className="px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/5">
                            {habit.targetCount} {habit.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {/* Note Button */}
                    <NeumorphicButton
                      size="icon"
                      onClick={() => handleOpenNote(habit.id)}
                      className={`text-gray-400 hover:text-indigo-500 ${
                        habitNote ? 'text-indigo-500 neu-pressed-sm' : ''
                      }`}
                      title={habitNote ? 'View/Edit Note' : 'Add Note'}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </NeumorphicButton>

                    {/* Completion Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggle(habit.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-150 ${
                        isCompleted
                          ? 'neu-pressed text-emerald-500 font-black scale-95'
                          : 'neu-button text-gray-400 hover:text-emerald-500'
                      }`}
                      aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
                    >
                      <Check className={`w-6 h-6 stroke-[3] ${isCompleted ? 'scale-110' : 'opacity-40'}`} />
                    </button>

                    {/* Menu Button */}
                    <div className="relative">
                      <NeumorphicButton
                        size="icon"
                        onClick={() =>
                          setActiveMenuHabitId(isMenuOpen ? null : habit.id)
                        }
                      >
                        <MoreVertical className="w-4 h-4 text-neu-muted dark:text-neu-darkMuted" />
                      </NeumorphicButton>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 rounded-2xl neu-flat p-1 z-20 shadow-xl border border-white/20 dark:border-white/5 animate-fade-in">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuHabitId(null);
                              onEditHabit(habit);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center space-x-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Edit Habit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuHabitId(null);
                              if (confirm(`Delete habit "${habit.name}"?`)) {
                                onDeleteHabit(habit.id);
                              }
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-rose-500/10 text-rose-500 flex items-center space-x-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inline Daily Note Preview */}
                {habitNote && editingNoteHabitId !== habit.id && (
                  <div className="mt-2.5 pt-2 border-t border-gray-200/30 dark:border-gray-700/30 flex items-start space-x-2 text-xs text-neu-muted dark:text-neu-darkMuted italic">
                    <span className="font-semibold not-italic">Note:</span>
                    <span>"{habitNote}"</span>
                  </div>
                )}

                {/* Edit Note Inline Drawer */}
                {editingNoteHabitId === habit.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200/40 dark:border-gray-700/40 animate-fade-in space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neu-muted dark:text-neu-darkMuted">
                      Daily Reflection / Note
                    </label>
                    <textarea
                      rows={2}
                      value={tempNote}
                      onChange={e => setTempNote(e.target.value)}
                      placeholder="How did this habit go today? Any milestones or thoughts?"
                      className="neu-input w-full p-2.5 rounded-xl text-xs"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <NeumorphicButton
                        size="sm"
                        onClick={() => setEditingNoteHabitId(null)}
                      >
                        Cancel
                      </NeumorphicButton>
                      <NeumorphicButton
                        size="sm"
                        variant="primary"
                        onClick={() => handleSaveNoteSubmit(habit.id)}
                      >
                        Save Note
                      </NeumorphicButton>
                    </div>
                  </div>
                )}
              </NeumorphicCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
