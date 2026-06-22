import type { CallTypeFilterValue } from './types';

export const OPTIONS: Array<{ value: CallTypeFilterValue; label: string }> = [
  { value: 'all', label: 'Все типы' },
  { value: 'incoming', label: 'Входящие' },
  { value: 'outgoing', label: 'Исходящие' },
  { value: 'missed', label: 'Пропущенные' },
  { value: 'no_answer', label: 'Недозвон' },
];
