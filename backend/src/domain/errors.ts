export class DomainError extends Error {}

export class TaskNotFoundError extends DomainError {
  constructor(public readonly taskId: number) {
    super(`Task with id=${taskId} not found`);
    this.name = 'TaskNotFoundError';
  }
}
