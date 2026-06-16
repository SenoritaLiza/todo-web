import type { SortField, StatusFilter, TaskListQuery } from './task';

export const DEFAULT_QUERY: Readonly<TaskListQuery> = Object.freeze({
  view: 'all',
  status: 'all',
  search: '',
  orderBy: 'createdAt',
  orderDir: 'desc',
} as const);

export const TASK_STATUS_FILTERS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'В работе' },
  { value: 'completed', label: 'Выполненные' },
];

export const SORT_FIELDS: ReadonlyArray<{ value: SortField; label: string }> = [
  { value: 'createdAt', label: 'по дате создания' },
  { value: 'updatedAt', label: 'по дате обновления' },
  { value: 'title', label: 'по названию' },
];
