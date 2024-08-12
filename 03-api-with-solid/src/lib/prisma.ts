import { PrismaClient } from '@prisma/client';
import { env } from '../env';

// show logs only in dev environment
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
});
