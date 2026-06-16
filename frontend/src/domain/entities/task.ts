export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDraft {
  title: string;
  description: string;
}

export interface TaskPatch {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  isDeleted?: boolean;
}

export type TaskView = 'all' | 'in-progress' | 'completed' | 'trash';
export type StatusFilter = 'all' | 'active' | 'completed';
export type SortField = 'createdAt' | 'updatedAt' | 'title';
export type SortDir = 'asc' | 'desc';

export interface TaskListQuery {
  view: TaskView;
  status: StatusFilter;
  search: string;
  orderBy: SortField;
  orderDir: SortDir;
}
