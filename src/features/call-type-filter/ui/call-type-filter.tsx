import { useEffect, useRef, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCallTypeFilter } from '../model/selectors';
import { setCallTypeFilter } from '../model/slice';
import { OPTIONS } from '../model/constants';
import styles from './call-type-filter.module.scss';

export const CallTypeFilter = memo(() => {
  const dispatch = useDispatch();
  const value = useSelector(selectCallTypeFilter);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = OPTIONS.find((o) => o.value === value)?.label ?? OPTIONS[0].label;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const isFiltered = value !== 'all';

  const handleReset = () => {
    dispatch(setCallTypeFilter('all'));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={`${styles.trigger} ${isFiltered ? styles.triggerActive : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedLabel}
        <svg
          className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isFiltered && (
        <button type="button" className={styles.reset} onClick={handleReset}>
          Сбросить фильтры
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {open && (
        <ul role="listbox" className={styles.dropdown}>
          {OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`${styles.option} ${opt.value === value ? styles.optionActive : ''}`}
              onClick={() => {
                dispatch(setCallTypeFilter(opt.value));
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}, () => true);
