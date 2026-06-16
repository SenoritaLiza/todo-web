export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SortField = 'createdAt' | 'updatedAt' | 'title';
export type SortDir = 'asc' | 'desc';

export interface ListTasksQuery {
  skip: number;
  limit: number;
  isCompleted?: boolean;
  isDeleted: boolean;
  search?: string;
  orderBy: SortField;
  orderDir: SortDir;
}

export interface CreateTaskInput {
  title: string;
  description: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  isDeleted?: boolean;
}
