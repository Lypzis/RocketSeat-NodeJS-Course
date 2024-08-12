import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const user = await prisma.user.findFirstOrThrow();

    // not a good practice, but not a problem here
    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -25.433682,
        longitude: -49.2589333,
      },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        gymId: gym.id,
        user_id: user.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    // since 'validated_at' would be null before validation
    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
