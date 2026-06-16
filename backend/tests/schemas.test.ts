import { describe, expect, it } from 'vitest';
import {
  createTaskSchema,
  deleteTaskQuerySchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from '../src/schemas/task.js';

describe('createTaskSchema', () => {
  it('trims title and defaults description to empty', () => {
    const result = createTaskSchema.parse({ title: '  Hello  ' });
    expect(result).toEqual({ title: 'Hello', description: '' });
  });

  it('rejects whitespace-only title', () => {
    expect(() => createTaskSchema.parse({ title: '   ' })).toThrow();
  });

  it('rejects title over 200 chars', () => {
    expect(() => createTaskSchema.parse({ title: 'x'.repeat(201) })).toThrow();
  });
});

describe('updateTaskSchema', () => {
  it('requires at least one field', () => {
    expect(() => updateTaskSchema.parse({})).toThrow();
  });

  it('accepts isDeleted flag', () => {
    expect(updateTaskSchema.parse({ isDeleted: true })).toEqual({ isDeleted: true });
  });
});

describe('listTasksQuerySchema', () => {
  it('coerces and defaults query parameters', () => {
    const parsed = listTasksQuerySchema.parse({});
    expect(parsed).toMatchObject({
      skip: 0,
      limit: 100,
      isDeleted: false,
      orderBy: 'createdAt',
      orderDir: 'desc',
    });
  });

  it('parses boolean strings', () => {
    const parsed = listTasksQuerySchema.parse({
      isCompleted: 'true',
      isDeleted: 'true',
    });
    expect(parsed.isCompleted).toBe(true);
    expect(parsed.isDeleted).toBe(true);
  });
});

describe('deleteTaskQuerySchema', () => {
  it('defaults to soft-delete', () => {
    expect(deleteTaskQuerySchema.parse({}).permanent).toBe(false);
  });
});
