import { z } from 'zod';

const titleSchema = z
  .string()
  .min(1, 'Title cannot be empty')
  .max(200, 'Title is too long')
  .transform((s) => s.trim())
  .refine((s) => s.length > 0, 'Title cannot be only whitespace');

export const createTaskSchema = z.object({
  title: titleSchema,
  description: z.string().max(2000).default(''),
});

export const updateTaskSchema = z
  .object({
    title: titleSchema.optional(),
    description: z.string().max(2000).optional(),
    isCompleted: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'Update payload cannot be empty',
  });

export const listTasksQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(500).default(100),
  isCompleted: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  isDeleted: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .default('false')
    .transform((v) => v === 'true'),
  search: z.string().max(200).optional(),
  orderBy: z.enum(['createdAt', 'updatedAt', 'title']).default('createdAt'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
});

export const toggleTaskQuerySchema = z.object({
  isCompleted: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true'),
});

export const deleteTaskQuerySchema = z.object({
  permanent: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .default('false')
    .transform((v) => v === 'true'),
});

export type CreateTaskBody = z.infer<typeof createTaskSchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
export type ToggleTaskQuery = z.infer<typeof toggleTaskQuerySchema>;
export type DeleteTaskQuery = z.infer<typeof deleteTaskQuerySchema>;
