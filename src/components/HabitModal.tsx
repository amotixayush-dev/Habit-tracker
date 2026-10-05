import React, { useState, useEffect } from 'react';
import { Habit, HabitCategory, HabitFrequency } from '../types';
import { NeumorphicButton } from './NeumorphicButton';
import { NeumorphicCard } from './NeumorphicCard';
import { X, Heart, Dumbbell, Brain, Zap, BookOpen, DollarSign, Coffee, Sparkles } from 'lucide-react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt'>, existingId?: string) => void;
  initialHabit?: Habit | null;
}

const CATEGORIES: { id: HabitCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" /> },
  { id: 'fitness', label: 'Fitness', icon: <Dumbbell className="w-4 h-4" /> },
  { id: 'mind', label: 'Mind', icon: <Brain className="w-4 h-4" /> },
  { id: 'productivity', label: 'Work', icon: <Zap className="w-4 h-4" /> },
  { id: 'learning', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'lifestyle', label: 'Life', icon: <Coffee className="w-4 h-4" /> },
];

const COLOR_PALETTE = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6', // Teal
];

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sun' },
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHabit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [targetCount, setTargetCount] = useState(1);
  const [unit, setUnit] = useState('times');

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description || '');
      setCategory(initialHabit.category);
      setColor(initialHabit.color);
      setFrequency(initialHabit.frequency);
      setCustomDays(initialHabit.customDays || [1, 2, 3, 4, 5]);
      setTargetCount(initialHabit.targetCount || 1);
      setUnit(initialHabit.unit || 'times');
    } else {
      setName('');
      setDescription('');
      setCategory('health');
      setColor(COLOR_PALETTE[0]);
      setFrequency('daily');
      setCustomDays([1, 2, 3, 4, 5]);
      setTargetCount(1);
      setUnit('times');
    }
  }, [initialHabit, isOpen]);

  if (!isOpen) return null;

  const handleToggleDay = (dayId: number) => {
    setCustomDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        description: description.trim(),
        category,
        color,
        frequency,
        customDays: frequency === 'custom' ? customDays : undefined,
        targetCount: Math.max(1, targetCount),
        unit: unit.trim() || 'times',
        archived: false,
      },
      initialHabit?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <NeumorphicCard
        elevation="lg"
        className="w-full max-w-md max-h-[92vh] overflow-y-auto p-6 relative border border-white/20 dark:border-white/5"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-xl font-bold tracking-tight">
              {initialHabit ? 'Edit Habit' : 'New Everyday Habit'}
            </h2>
          </div>
          <NeumorphicButton
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </NeumorphicButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neu-muted dark:text-neu-darkMuted">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Read 20 pages, 30 min Workout..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="neu-input w-full px-4 py-3 rounded-2xl text-sm"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neu-muted dark:text-neu-darkMuted">
              Why do you want to build this habit? (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. To boost morning focus and stay sharp"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="neu-input w-full px-4 py-2.5 rounded-2xl text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neu-muted dark:text-neu-darkMuted">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'neu-pressed text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'neu-button text-neu-text dark:text-neu-darkText'
                    }`}
                  >
                    <span className="mb-1">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neu-muted dark:text-neu-darkMuted">
              Theme Color
            </label>
            <div className="flex items-center justify-between p-2 rounded-2xl neu-pressed-sm">
              {COLOR_PALETTE.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neu-muted dark:text-neu-darkMuted">
              Frequency Schedule
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {(['daily', 'weekdays', 'weekends', 'custom'] as HabitFrequency[]).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`py-2 px-1 text-xs rounded-xl capitalize font-semibold transition-all ${
                    frequency === f
                      ? 'neu-pressed text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'neu-button text-neu-text dark:text-neu-darkText'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {frequency === 'custom' && (
              <div className="flex justify-between gap-1 mt-2 p-2 rounded-2xl neu-pressed-sm">
                {DAYS_OF_WEEK.map(d => {
                  const isDaySelected = customDays.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleToggleDay(d.id)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        isDaySelected
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'neu-button text-neu-muted dark:text-neu-darkMuted'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Goal & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neu-muted dark:text-neu-darkMuted">
                Daily Target
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={targetCount}
                onChange={e => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="neu-input w-full px-4 py-2.5 rounded-2xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-neu-muted dark:text-neu-darkMuted">
                Unit
              </label>
              <input
                type="text"
                placeholder="times, mins, km..."
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="neu-input w-full px-4 py-2.5 rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <NeumorphicButton
              type="button"
              onClick={onClose}
              className="text-neu-muted dark:text-neu-darkMuted"
            >
              Cancel
            </NeumorphicButton>
            <NeumorphicButton
              type="submit"
              variant="primary"
              className="px-6"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              {initialHabit ? 'Save Changes' : 'Create Habit'}
            </NeumorphicButton>
          </div>
        </form>
      </NeumorphicCard>
    </div>
  );
};
