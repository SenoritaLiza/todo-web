import type { Prisma, PrismaClient } from '@prisma/client';
import type {
  CreateTaskInput,
  ListTasksQuery,
  Task,
  UpdateTaskInput,
} from '../domain/task.js';

export class TaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async list(query: ListTasksQuery): Promise<Task[]> {
    const where = this.buildWhere(query);
    return this.prisma.task.findMany({
      where,
      orderBy: { [query.orderBy]: query.orderDir },
      skip: query.skip,
      take: query.limit,
    });
  }

  count(query: Omit<ListTasksQuery, 'skip' | 'limit' | 'orderBy' | 'orderDir'>): Promise<number> {
    return this.prisma.task.count({ where: this.buildWhere(query) });
  }

  get(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  create(input: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({ data: input });
  }

  async update(id: number, input: UpdateTaskInput): Promise<Task | null> {
    try {
      return await this.prisma.task.update({ where: { id }, data: input });
    } catch (err) {
      if (this.isNotFoundError(err)) return null;
      throw err;
    }
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.prisma.task.updateMany({
      where: { id, isDeleted: false },
      data: { isDeleted: true },
    });
    return result.count > 0;
  }

  async hardDelete(id: number): Promise<boolean> {
    try {
      await this.prisma.task.delete({ where: { id } });
      return true;
    } catch (err) {
      if (this.isNotFoundError(err)) return false;
      throw err;
    }
  }

  private buildWhere(
    query: Pick<ListTasksQuery, 'isCompleted' | 'isDeleted' | 'search'>,
  ): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = { isDeleted: query.isDeleted };
    if (query.isCompleted !== undefined) {
      where.isCompleted = query.isCompleted;
    }
    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private isNotFoundError(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === 'P2025'
    );
  }
}
