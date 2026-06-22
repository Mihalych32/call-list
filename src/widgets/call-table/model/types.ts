import type { ApiCallItem } from '@/entities/call';

export interface CallRowProps {
  call: ApiCallItem;
}

export interface CallGroup {
  dateKey: string;
  label: string | null;
  count: number;
  calls: ApiCallItem[];
}

export interface PaginationControlsProps {
  totalRows: number;
}
