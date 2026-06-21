import type { DateRangeFilterValue } from './types';

function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const getDateRangeParams = (
  value: DateRangeFilterValue,
): { date_start: string; date_end: string } => {
  if (value.preset === 'custom' && value.from && value.to) {
    return { date_start: value.from, date_end: value.to };
  }

  const today = new Date();
  const start = new Date(today);

  switch (value.preset) {
    case '3days':
      start.setDate(today.getDate() - 3);
      break;
    case 'week':
      start.setDate(today.getDate() - 7);
      break;
    case 'month':
      start.setMonth(today.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(today.getFullYear() - 1);
      break;
    default:
      start.setDate(today.getDate() - 3);
  }

  return { date_start: toIsoDate(start), date_end: toIsoDate(today) };
};
