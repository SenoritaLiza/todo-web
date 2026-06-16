import { TaskNotFoundError } from '../domain/errors.js';
import type {
  CreateTaskInput,
  ListTasksQuery,
  Task,
  UpdateTaskInput,
} from '../domain/task.js';
import type { TaskRepository } from '../repository/taskRepository.js';

export class TaskService {
  constructor(private readonly repo: TaskRepository) {}

  list(query: ListTasksQuery): Promise<Task[]> {
    return this.repo.list(query);
  }

  async get(id: number): Promise<Task> {
    const task = await this.repo.get(id);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }

  create(input: CreateTaskInput): Promise<Task> {
    return this.repo.create(input);
  }

  async update(id: number, input: UpdateTaskInput): Promise<Task> {
    const updated = await this.repo.update(id, input);
    if (!updated) throw new TaskNotFoundError(id);
    return updated;
  }

  async toggleComplete(id: number, isCompleted: boolean): Promise<Task> {
    const updated = await this.repo.update(id, { isCompleted });
    if (!updated) throw new TaskNotFoundError(id);
    return updated;
  }

  async restore(id: number): Promise<Task> {
    const updated = await this.repo.update(id, { isDeleted: false });
    if (!updated) throw new TaskNotFoundError(id);
    return updated;
  }

  async remove(id: number, permanent: boolean): Promise<void> {
    const ok = permanent
      ? await this.repo.hardDelete(id)
      : await this.repo.softDelete(id);
    if (!ok) throw new TaskNotFoundError(id);
  }
}
