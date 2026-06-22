import { useEffect, useRef, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectDateRangeFilter } from '../model/selectors';
import { setDateRangeFilter } from '../model/slice';
import type { DatePreset } from '../model/types';
import { PRESETS } from '../model/constants';
import styles from './date-range-filter.module.scss';

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year.slice(2)}`;
}

export const DateRangeFilter = memo(() => {
  const dispatch = useDispatch();
  const value = useSelector(selectDateRangeFilter);
  const [open, setOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  const triggerLabel = (() => {
    if (value.preset !== 'custom') {
      return PRESETS.find((p) => p.value === value.preset)?.label ?? '3 дня';
    }
    if (value.from && value.to) {
      return `${formatDate(value.from)} – ${formatDate(value.to)}`;
    }
    return 'Указать даты';
  })();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    if (!open) {
      setDraftFrom(value.from ?? '');
      setDraftTo(value.to ?? '');
      setShowPicker(value.preset === 'custom');
    }
    setOpen((prev) => !prev);
  };

  const handlePresetClick = (preset: Exclude<DatePreset, 'custom'>) => {
    dispatch(setDateRangeFilter({ preset, from: null, to: null }));
    setShowPicker(false);
    setOpen(false);
  };

  const handleApply = () => {
    if (draftFrom && draftTo) {
      dispatch(setDateRangeFilter({ preset: 'custom', from: draftFrom, to: draftTo }));
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {triggerLabel}
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

      {open && (
        <div className={styles.dropdown}>
          <ul role="listbox" className={styles.presetList}>
            {PRESETS.map((preset) => (
              <li
                key={preset.value}
                role="option"
                aria-selected={value.preset === preset.value}
                className={`${styles.option} ${value.preset === preset.value ? styles.optionActive : ''}`}
                onClick={() => handlePresetClick(preset.value)}
              >
                {preset.label}
              </li>
            ))}
          </ul>

          <div className={styles.divider} />

          <div
            className={`${styles.customRow} ${showPicker || value.preset === 'custom' ? styles.customRowActive : ''}`}
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <span>Указать даты</span>
            <svg
              className={`${styles.customArrow} ${showPicker ? styles.customArrowOpen : ''}`}
              width="14"
              height="14"
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
          </div>

          {showPicker && (
            <div className={styles.pickerSection}>
              <div className={styles.dateRow}>
                <label className={styles.dateLabel}>
                  <span className={styles.dateLabelText}>с</span>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={draftFrom}
                    max={draftTo || undefined}
                    onChange={(e) => setDraftFrom(e.target.value)}
                  />
                </label>
                <label className={styles.dateLabel}>
                  <span className={styles.dateLabelText}>по</span>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={draftTo}
                    min={draftFrom || undefined}
                    onChange={(e) => setDraftTo(e.target.value)}
                  />
                </label>
              </div>
              <button
                type="button"
                className={styles.applyBtn}
                disabled={!draftFrom || !draftTo}
                onClick={handleApply}
              >
                Применить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}, () => true);
