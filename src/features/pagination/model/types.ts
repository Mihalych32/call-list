export const PAGE_SIZES = [10, 20, 50] as const;

export interface PaginationState {
  currentPage: number;
  pageSize: number;
}
