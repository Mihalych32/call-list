import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentPage,
  selectPageSize,
  setPage,
  setPageSize,
  PAGE_SIZES,
} from '@/features/pagination';
import type { PaginationControlsProps } from '../model/types';
import styles from './call-table.module.scss';

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  const rangeStart = Math.max(2, current - 2);
  const rangeEnd = Math.min(total - 1, current + 2);

  if (rangeStart > 2) pages.push('ellipsis');
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < total - 1) pages.push('ellipsis');

  pages.push(total);
  return pages;
}

export const PaginationControls = memo(({ totalRows }: PaginationControlsProps) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const pageSize = useSelector(selectPageSize);

  if (totalRows === 0) return null;

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const pages = buildPageNumbers(currentPage, totalPages);
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        {from}–{to} из {totalRows}
      </span>

      <div className={styles.paginationPages}>
        <button
          type="button"
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => dispatch(setPage(currentPage - 1))}
        >
          ‹
        </button>

        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ''}`}
              onClick={() => dispatch(setPage(page))}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.pageBtn}
          disabled={currentPage === totalPages}
          onClick={() => dispatch(setPage(currentPage + 1))}
        >
          ›
        </button>
      </div>

      <div className={styles.pageSizes}>
        <span className={styles.pageSizesLabel}>Показывать по:</span>
        {PAGE_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            className={`${styles.pageSizeBtn} ${size === pageSize ? styles.pageSizeBtnActive : ''}`}
            onClick={() => dispatch(setPageSize(size))}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
});
