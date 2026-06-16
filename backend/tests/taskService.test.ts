import { describe, expect, it, beforeEach } from 'vitest';
import { TaskNotFoundError } from '../src/domain/errors.js';
import type {
  CreateTaskInput,
  ListTasksQuery,
  Task,
  UpdateTaskInput,
} from '../src/domain/task.js';
import type { TaskRepository } from '../src/repository/taskRepository.js';
import { TaskService } from '../src/services/taskService.js';

class InMemoryTaskRepo implements Pick<
  TaskRepository,
  'list' | 'get' | 'create' | 'update' | 'softDelete' | 'hardDelete' | 'count'
> {
  private tasks: Task[] = [];
  private seq = 1;

  async list(query: ListTasksQuery): Promise<Task[]> {
    let items = this.tasks.filter((t) => t.isDeleted === query.isDeleted);
    if (query.isCompleted !== undefined) {
      items = items.filter((t) => t.isCompleted === query.isCompleted);
    }
    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term),
      );
    }
    items.sort((a, b) => {
      const av = a[query.orderBy] as string | Date;
      const bv = b[query.orderBy] as string | Date;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return query.orderDir === 'asc' ? cmp : -cmp;
    });
    return items.slice(query.skip, query.skip + query.limit);
  }

  async count(): Promise<number> {
    return this.tasks.length;
  }

  async get(id: number): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) ?? null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const now = new Date();
    const task: Task = {
      id: this.seq++,
      title: input.title,
      description: input.description,
      isCompleted: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    return task;
  }

  async update(id: number, input: UpdateTaskInput): Promise<Task | null> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, input, { updatedAt: new Date() });
    return task;
  }

  async softDelete(id: number): Promise<boolean> {
    const task = this.tasks.find((t) => t.id === id && !t.isDeleted);
    if (!task) return false;
    task.isDeleted = true;
    return true;
  }

  async hardDelete(id: number): Promise<boolean> {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < before;
  }
}

const baseQuery: ListTasksQuery = {
  skip: 0,
  limit: 100,
  isDeleted: false,
  orderBy: 'createdAt',
  orderDir: 'desc',
};

describe('TaskService', () => {
  let repo: InMemoryTaskRepo;
  let service: TaskService;

  beforeEach(() => {
    repo = new InMemoryTaskRepo();
    service = new TaskService(repo as unknown as TaskRepository);
  });

  it('creates and retrieves a task', async () => {
    const created = await service.create({ title: 'Read book', description: '' });
    const found = await service.get(created.id);
    expect(found.title).toBe('Read book');
    expect(found.isCompleted).toBe(false);
    expect(found.isDeleted).toBe(false);
  });

  it('lists only non-deleted tasks by default', async () => {
    await service.create({ title: 'A', description: '' });
    const b = await service.create({ title: 'B', description: '' });
    await service.remove(b.id, false);
    const active = await service.list(baseQuery);
    expect(active.map((t) => t.title)).toEqual(['A']);
  });

  it('lists trashed tasks when isDeleted=true', async () => {
    const a = await service.create({ title: 'A', description: '' });
    await service.remove(a.id, false);
    const trashed = await service.list({ ...baseQuery, isDeleted: true });
    expect(trashed).toHaveLength(1);
    expect(trashed[0]!.isDeleted).toBe(true);
  });

  it('restores a soft-deleted task', async () => {
    const a = await service.create({ title: 'A', description: '' });
    await service.remove(a.id, false);
    const restored = await service.restore(a.id);
    expect(restored.isDeleted).toBe(false);
  });

  it('toggles completion idempotently', async () => {
    const a = await service.create({ title: 'A', description: '' });
    const done = await service.toggleComplete(a.id, true);
    expect(done.isCompleted).toBe(true);
    const stillDone = await service.toggleComplete(a.id, true);
    expect(stillDone.isCompleted).toBe(true);
  });

  it('throws TaskNotFoundError when missing', async () => {
    await expect(service.get(9999)).rejects.toBeInstanceOf(TaskNotFoundError);
    await expect(service.remove(9999, false)).rejects.toBeInstanceOf(TaskNotFoundError);
    await expect(service.restore(9999)).rejects.toBeInstanceOf(TaskNotFoundError);
  });

  it('filters by search across title and description', async () => {
    await service.create({ title: 'Buy milk', description: 'whole' });
    await service.create({ title: 'Read book', description: 'milk-based metaphor' });
    await service.create({ title: 'Write tests', description: '' });
    const results = await service.list({ ...baseQuery, search: 'milk' });
    expect(results).toHaveLength(2);
  });
});
