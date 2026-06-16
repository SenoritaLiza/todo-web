import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  createTaskSchema,
  deleteTaskQuerySchema,
  listTasksQuerySchema,
  toggleTaskQuerySchema,
  updateTaskSchema,
} from '../schemas/task.js';
import type { TaskService } from '../services/taskService.js';

const idParamsSchema = z.object({ id: z.coerce.number().int().positive() });

export async function registerTaskRoutes(
  app: FastifyInstance,
  service: TaskService,
): Promise<void> {
  app.get('/tasks', async (req) => {
    const query = listTasksQuerySchema.parse(req.query);
    return service.list(query);
  });

  app.get('/tasks/:id', async (req) => {
    const { id } = idParamsSchema.parse(req.params);
    return service.get(id);
  });

  app.post('/tasks', async (req, reply) => {
    const body = createTaskSchema.parse(req.body);
    const task = await service.create(body);
    reply.code(201);
    return task;
  });

  app.put('/tasks/:id', async (req) => {
    const { id } = idParamsSchema.parse(req.params);
    const body = updateTaskSchema.parse(req.body);
    return service.update(id, body);
  });

  app.patch('/tasks/:id/complete', async (req) => {
    const { id } = idParamsSchema.parse(req.params);
    const { isCompleted } = toggleTaskQuerySchema.parse(req.query);
    return service.toggleComplete(id, isCompleted);
  });

  app.post('/tasks/:id/restore', async (req) => {
    const { id } = idParamsSchema.parse(req.params);
    return service.restore(id);
  });

  app.delete('/tasks/:id', async (req, reply) => {
    const { id } = idParamsSchema.parse(req.params);
    const { permanent } = deleteTaskQuerySchema.parse(req.query);
    await service.remove(id, permanent);
    reply.code(204);
    return null;
  });
}
