import React from 'react';
import Icon from './Icon';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  onPageChange: (page: number) => void;
  tasksPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalTasks,
  onPageChange,
  tasksPerPage,
}: PaginationProps) {
  if (totalTasks === 0) return null;

  const startTask = (currentPage - 1) * tasksPerPage + 1;
  const endTask = Math.min(currentPage * tasksPerPage, totalTasks);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      <p className={styles.info}>
        Показано {startTask}–{endTask} из {totalTasks} задач
      </p>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Предыдущая страница"
        >
          <Icon name="chevronLeft" size={16} />
        </button>

        <div className={styles.pages}>
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.btn}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Следующая страница"
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </div>
  );
}
