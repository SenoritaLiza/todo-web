import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import type { Task } from '../domain/entities/task';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  view: 'active' | 'trash';
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRestore?: () => void;
  onPurge?: () => void;
}

function formatDate(value: string | null): string {
  if (!value) return 'Нет даты';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Нет даты';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default function TaskCard({
  task,
  view,
  onToggle,
  onEdit,
  onDelete,
  onRestore,
  onPurge,
}: TaskCardProps) {
  const inTrash = view === 'trash';
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  const runAction = (action?: () => void) => {
    setMenuOpen(false);
    action?.();
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${task.isCompleted ? styles.completedCard : ''} ${inTrash ? styles.trashedCard : ''}`}
    >
      <label className={styles.checkboxWrap}>
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={onToggle}
          disabled={inTrash}
          className={styles.checkboxNative}
          aria-label={task.isCompleted ? 'Снять отметку выполнения' : 'Отметить выполненной'}
        />
        <span className={styles.checkboxBox}>
          {task.isCompleted && <Icon name="check" size={14} />}
        </span>
      </label>

      <div className={styles.body}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.description && <p className={styles.description}>{task.description}</p>}
      </div>

      <div className={styles.meta}>
        <span className={styles.date}>
          <Icon name="calendar" size={14} />
          {formatDate(task.createdAt)}
        </span>
      </div>

      <div className={styles.statusCell}>
        {inTrash ? (
          <span className={`${styles.badge} ${styles.trashed}`}>В корзине</span>
        ) : task.isCompleted ? (
          <span className={`${styles.badge} ${styles.completed}`}>Выполнено</span>
        ) : (
          <span className={`${styles.badge} ${styles.inProgress}`}>В работе</span>
        )}
      </div>

      <div className={styles.actionsCell}>
        <button
          type="button"
          className={styles.moreBtn}
          aria-label="Меню задачи"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name="more" size={18} />
        </button>

        {menuOpen && (
          <div className={styles.menu} role="menu">
            {inTrash ? (
              <>
                <button type="button" className={styles.menuItem} onClick={() => runAction(onRestore)}>
                  <Icon name="restore" size={16} />
                  <span>Восстановить</span>
                </button>
                <button
                  type="button"
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                  onClick={() => runAction(onPurge)}
                >
                  <Icon name="close" size={16} />
                  <span>Удалить навсегда</span>
                </button>
              </>
            ) : (
              <>
                <button type="button" className={styles.menuItem} onClick={() => runAction(onEdit)}>
                  <Icon name="edit" size={16} />
                  <span>Редактировать</span>
                </button>
                <button
                  type="button"
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                  onClick={() => runAction(onDelete)}
                >
                  <Icon name="trash" size={16} />
                  <span>В корзину</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
