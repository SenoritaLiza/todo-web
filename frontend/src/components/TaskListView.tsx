import React, { useMemo, useState } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import Pagination from './Pagination';
import FilterPanel from './FilterPanel';
import Icon from './Icon';
import { SORT_FIELDS } from '../domain/entities/taskQuery';
import type {
  SortDir,
  SortField,
  StatusFilter,
  Task,
  TaskDraft,
  TaskView,
} from '../domain/entities/task';
import type { User } from '../domain/entities/user';
import styles from './TaskListView.module.css';

interface TaskListViewProps {
  user: User;
  view: TaskView;
  tasks: Task[];
  loading: boolean;
  errorMessage: string;
  search: string;
  status: StatusFilter;
  orderBy: SortField;
  orderDir: SortDir;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onSortChange: (orderBy: SortField, orderDir: SortDir) => void;
  onCreateTask: (draft: TaskDraft) => Promise<void> | void;
  onUpdateTask: (id: number, draft: TaskDraft) => Promise<void> | void;
  onToggleTask: (id: number, isCompleted: boolean) => Promise<void> | void;
  onDeleteTask: (id: number) => Promise<void> | void;
  onRestoreTask: (id: number) => Promise<void> | void;
  onPurgeTask: (id: number) => Promise<void> | void;
}

const PAGE_SIZE = 6;

function buildSortValue(orderBy: SortField, orderDir: SortDir): string {
  return `${orderBy}:${orderDir}`;
}

function parseSortValue(value: string): { orderBy: SortField; orderDir: SortDir } {
  const [field, dir] = value.split(':') as [SortField, SortDir];
  return { orderBy: field, orderDir: dir };
}

function dirLabel(field: SortField, dir: SortDir): string {
  if (field === 'title') return dir === 'asc' ? 'А → Я' : 'Я → А';
  return dir === 'desc' ? 'сначала новые' : 'сначала старые';
}

const SORT_OPTIONS = SORT_FIELDS.flatMap((field) => [
  {
    value: buildSortValue(field.value, 'desc'),
    label: `Сортировка: ${field.label} (${dirLabel(field.value, 'desc')})`,
  },
  {
    value: buildSortValue(field.value, 'asc'),
    label: `Сортировка: ${field.label} (${dirLabel(field.value, 'asc')})`,
  },
]);

function viewTitle(view: TaskView): string {
  switch (view) {
    case 'in-progress':
      return 'Мои задачи';
    case 'completed':
      return 'Выполненные';
    case 'trash':
      return 'Корзина';
    default:
      return 'Все задачи';
  }
}

export default function TaskListView({
  user,
  view,
  tasks,
  loading,
  errorMessage,
  search,
  status,
  orderBy,
  orderDir,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onCreateTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onRestoreTask,
  onPurgeTask,
}: TaskListViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const completedCount = useMemo(
    () => tasks.filter((t) => t.isCompleted).length,
    [tasks],
  );

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageTasks = useMemo(
    () => tasks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [tasks, safePage],
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [view, status, search, orderBy, orderDir]);

  const handleAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = async (draft: TaskDraft) => {
    if (editingTask) {
      await onUpdateTask(editingTask.id, draft);
    } else {
      await onCreateTask(draft);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleResetFilters = () => {
    onSearchChange('');
    onStatusChange('all');
  };

  const sortValue = buildSortValue(orderBy, orderDir);
  const hasStatusFilter = view === 'all';

  return (
    <div className={styles.container}>
      <header className={styles.topbar}>
        <div className={styles.greeting}>
          <h1>Здравствуйте, {user.fullName.split(/\s+/)[0]}!</h1>
          <p>
            У вас {tasks.length} задач, {completedCount} выполнено
          </p>
        </div>

        <div className={styles.topbarActions}>
          <div className={styles.searchBox}>
            <Icon name="search" size={18} />
            <input
              type="search"
              placeholder="Поиск задач..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.viewTitle}>{viewTitle(view)}</h2>
          <div className={styles.controls}>
            <button
              type="button"
              className={`${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ''}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <Icon name="filter" size={16} />
              <span>Фильтры</span>
            </button>

            <label className={styles.sortWrapper}>
              <select
                className={styles.sortSelect}
                value={sortValue}
                onChange={(e) => {
                  const { orderBy: o, orderDir: d } = parseSortValue(e.target.value);
                  onSortChange(o, d);
                }}
                aria-label="Сортировка"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={16} className={styles.sortChevron} />
            </label>

            {view !== 'trash' && (
              <button type="button" className={styles.newTaskBtn} onClick={handleAdd}>
                <Icon name="plus" size={16} />
                <span>Новая задача</span>
              </button>
            )}
          </div>
        </div>

        <FilterPanel
          open={showFilters}
          status={status}
          onStatusChange={onStatusChange}
          onReset={handleResetFilters}
          hideStatus={!hasStatusFilter}
        />

        {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}

        <div className={styles.tasksList}>
          {loading ? (
            <div className={styles.emptyState}>Загрузка задач...</div>
          ) : pageTasks.length === 0 ? (
            <div className={styles.emptyState}>
              {view === 'trash' ? 'Корзина пуста' : 'Нет задач для отображения'}
            </div>
          ) : (
            pageTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                view={view === 'trash' ? 'trash' : 'active'}
                onToggle={() => onToggleTask(task.id, !task.isCompleted)}
                onEdit={() => handleEdit(task)}
                onDelete={() => onDeleteTask(task.id)}
                onRestore={() => onRestoreTask(task.id)}
                onPurge={() => onPurgeTask(task.id)}
              />
            ))
          )}
        </div>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalTasks={tasks.length}
          onPageChange={setCurrentPage}
          tasksPerPage={PAGE_SIZE}
        />
      </section>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
}

