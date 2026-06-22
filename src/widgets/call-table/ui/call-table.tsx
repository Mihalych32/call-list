import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { COLUMNS } from '@/widgets/call-table/index';
import { CallTypeFilter, selectCallTypeFilter, getCallTypeApiParams } from '@/features/call-type-filter';
import { DateRangeFilter, selectDateRangeFilter, getDateRangeParams } from '@/features/date-range-filter';
import { selectCurrentPage, selectPageSize } from '@/features/pagination';
import { useGetCallListQuery } from '@/entities/call';
import type { ApiCallItem } from '@/entities/call';
import { MONTHS_GENITIVE } from '@/shared/dates';
import type { CallGroup } from '../model/types';
import { PaginationControls } from './pagination-controls';
import { CallRow } from './call-row';
import styles from './call-table.module.scss';

function groupCallsByDate(calls: ApiCallItem[]): CallGroup[] {
  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];

  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const map = new Map<string, ApiCallItem[]>();
  for (const call of calls) {
    const key = call.date_notime;
    const existing = map.get(key);
    if (existing) {
      existing.push(call);
    } else {
      map.set(key, [call]);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => {
      let label: string | null = null;
      if (key === yesterday) {
        label = 'Вчера';
      } else if (key !== today) {
        const [year, month, day] = key.split('-');
        label = `${parseInt(day, 10)} ${MONTHS_GENITIVE[parseInt(month, 10) - 1]} ${year}`;
      }
      return { dateKey: key, label, count: items.length, calls: items };
    });
}

export const CallTable = () => {
  const typeFilter = useSelector(selectCallTypeFilter);
  const dateFilter = useSelector(selectDateRangeFilter);
  const currentPage = useSelector(selectCurrentPage);
  const pageSize = useSelector(selectPageSize);

  const { date_start, date_end } = getDateRangeParams(dateFilter);
  const { data, isLoading, isError } = useGetCallListQuery({
    date_start,
    date_end,
    ...getCallTypeApiParams(typeFilter),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const totalRows = parseInt(data?.total_rows ?? '0', 10);
  const groups = groupCallsByDate(data?.results ?? []);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <CallTypeFilter />
        <DateRangeFilter />
      </div>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className={styles.headCell}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.stateCell}>
                  Загрузка...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.stateCell}>
                  Ошибка загрузки данных
                </td>
              </tr>
            )}
            {!isLoading && !isError && groups.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.stateCell}>
                  Нет данных
                </td>
              </tr>
            )}
            {groups.map((group) => (
              <Fragment key={group.dateKey}>
                {group.label !== null && (
                  <tr className={styles.groupRow}>
                    <td colSpan={COLUMNS.length} className={styles.groupCell}>
                      <span className={styles.groupLabel}>
                        {group.label}
                        <span className={styles.groupCount}>{group.count}</span>
                      </span>
                    </td>
                  </tr>
                )}
                {group.calls.map((call) => (
                  <CallRow key={call.id} call={call} />
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls totalRows={totalRows} />
    </div>
  );
};
