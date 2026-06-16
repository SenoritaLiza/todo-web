import { buildApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './db/prisma.js';

async function bootstrap(): Promise<void> {
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down...`);
    try {
      await app.close();
      await prisma.$disconnect();
      process.exit(0);
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  try {
    await app.listen({ host: env.host, port: env.port });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void bootstrap();
