import type { DatePreset } from './types';

export const PRESETS: Array<{ value: Exclude<DatePreset, 'custom'>; label: string }> = [
  { value: '3days', label: '3 дня' },
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'year', label: 'Год' },
];
