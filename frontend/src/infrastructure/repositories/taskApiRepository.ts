import type { AxiosInstance } from 'axios';
import { httpClient, toAppError } from '../api';
import type {
  SortDir,
  SortField,
  StatusFilter,
  Task,
  TaskDraft,
  TaskPatch,
  TaskView,
} from '../../domain/entities/task';

export interface ListParams {
  view: TaskView;
  status: StatusFilter;
  search: string;
  orderBy: SortField;
  orderDir: SortDir;
}

interface ListQueryParams {
  orderBy: SortField;
  orderDir: SortDir;
  isDeleted: boolean;
  isCompleted?: boolean;
  search?: string;
}

export class TaskApiRepository {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance = httpClient) {
    this.http = http;
  }

  async list(params: ListParams): Promise<Task[]> {
    try {
      const query: ListQueryParams = {
        orderBy: params.orderBy,
        orderDir: params.orderDir,
        isDeleted: params.view === 'trash',
      };

      if (params.view === 'in-progress') {
        query.isCompleted = false;
      } else if (params.view === 'completed') {
        query.isCompleted = true;
      } else if (params.status === 'active') {
        query.isCompleted = false;
      } else if (params.status === 'completed') {
        query.isCompleted = true;
      }

      const trimmedSearch = params.search.trim();
      if (trimmedSearch) {
        query.search = trimmedSearch;
      }

      const { data } = await this.http.get<Task[]>('/', { params: query });
      return data;
    } catch (err) {
      throw toAppError(err);
    }
  }

  async create(draft: TaskDraft): Promise<Task> {
    try {
      const { data } = await this.http.post<Task>('/', draft);
      return data;
    } catch (err) {
      throw toAppError(err);
    }
  }

  async update(id: number, patch: TaskPatch): Promise<Task> {
    try {
      const { data } = await this.http.put<Task>(`/${id}`, patch);
      return data;
    } catch (err) {
      throw toAppError(err);
    }
  }

  async setCompleted(id: number, isCompleted: boolean): Promise<Task> {
    try {
      const { data } = await this.http.patch<Task>(`/${id}/complete`, null, {
        params: { isCompleted },
      });
      return data;
    } catch (err) {
      throw toAppError(err);
    }
  }

  async moveToTrash(id: number): Promise<void> {
    try {
      await this.http.delete(`/${id}`);
    } catch (err) {
      throw toAppError(err);
    }
  }

  async restore(id: number): Promise<Task> {
    try {
      const { data } = await this.http.post<Task>(`/${id}/restore`);
      return data;
    } catch (err) {
      throw toAppError(err);
    }
  }

  async deletePermanently(id: number): Promise<void> {
    try {
      await this.http.delete(`/${id}`, { params: { permanent: true } });
    } catch (err) {
      throw toAppError(err);
    }
  }
}
