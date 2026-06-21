export type DatePreset = '3days' | 'week' | 'month' | 'year' | 'custom';

export interface DateRangeFilterValue {
  preset: DatePreset;
  from: string | null;
  to: string | null;
}
