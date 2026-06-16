import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { prisma } from './db/prisma.js';
import { TaskNotFoundError, DomainError } from './domain/errors.js';
import { TaskRepository } from './repository/taskRepository.js';
import { registerTaskRoutes } from './routes/tasks.js';
import { TaskService } from './services/taskService.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: env.nodeEnv !== 'test',
    ignoreTrailingSlash: true,
  });

  await app.register(cors, {
    origin: env.corsOrigins.length === 1 && env.corsOrigins[0] === '*'
      ? true
      : env.corsOrigins,
    credentials: true,
  });

  const repo = new TaskRepository(prisma);
  const service = new TaskService(repo);

  app.get('/health', async () => ({ status: 'ok' }));

  await registerTaskRoutes(app, service);

  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof TaskNotFoundError) {
      return reply.status(404).send({ detail: error.message });
    }
    if (error instanceof ZodError) {
      return reply.status(422).send({ detail: error.flatten() });
    }
    if (error instanceof DomainError) {
      return reply.status(400).send({ detail: error.message });
    }
    app.log.error(error);
    return reply.status(500).send({ detail: 'Internal Server Error' });
  });

  return app;
}
