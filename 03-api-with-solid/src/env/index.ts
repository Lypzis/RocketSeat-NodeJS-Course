import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // validation of production envionment, must be set to one of the three options
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
});

// validate to see if the data is in the env file
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables ', _env.error.format());

  throw new Error('Invalid environment variables!');
}

export const env = _env.data;
