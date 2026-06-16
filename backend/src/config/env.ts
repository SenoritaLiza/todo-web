import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default('postgresql://todo_user:todo123@localhost:5432/tododb?schema=public'),
  PORT: z.coerce.number().int().positive().default(8000),
  HOST: z.string().default('0.0.0.0'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:3000,http://localhost'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parsed = envSchema.parse(process.env);

export const env = {
  databaseUrl: parsed.DATABASE_URL,
  port: parsed.PORT,
  host: parsed.HOST,
  corsOrigins: parsed.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  nodeEnv: parsed.NODE_ENV,
};
