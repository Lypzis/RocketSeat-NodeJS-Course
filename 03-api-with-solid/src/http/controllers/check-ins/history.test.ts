import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Check-in History (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list check-in history', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    // not a good practice, but not a problem here
    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -25.433682,
        longitude: -49.2589333,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        { gymId: gym.id, user_id: user.id },
        { gymId: gym.id, user_id: user.id },
      ],
    });

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({ gymId: gym.id }),
      expect.objectContaining({ gymId: gym.id }),
    ]);
  });
});
