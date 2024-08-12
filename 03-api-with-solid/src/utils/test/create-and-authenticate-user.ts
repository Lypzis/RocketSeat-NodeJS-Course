import { prisma } from '@/lib/prisma';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin: boolean = false
) {
  await prisma.user.create({
    data: {
      name: 'Test Testerson',
      email: 'test6@example.com',
      password_hash: await bcrypt.hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  });

  const response = await request(app.server).post('/sessions').send({
    email: 'test6@example.com',
    password: '123456',
  });

  const { token } = response.body;

  return { token };
}
