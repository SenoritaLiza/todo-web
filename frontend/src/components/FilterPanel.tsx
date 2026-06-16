import React from 'react';
import type { StatusFilter } from '../domain/entities/task';
import { TASK_STATUS_FILTERS } from '../domain/entities/taskQuery';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  open: boolean;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  onReset: () => void;
  hideStatus?: boolean;
}

export default function FilterPanel({
  open,
  status,
  onStatusChange,
  onReset,
  hideStatus = false,
}: FilterPanelProps) {
  if (!open) return null;

  return (
    <div className={styles.panel}>
      {!hideStatus && (
        <div className={styles.field}>
          <span className={styles.label}>Статус</span>
          <div className={styles.chips}>
            {TASK_STATUS_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.chip} ${status === option.value ? styles.chipActive : ''}`}
                onClick={() => onStatusChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="button" className={styles.resetBtn} onClick={onReset}>
        Сбросить
      </button>
    </div>
  );
}
