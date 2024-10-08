import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: null,
        phone: null,
        latitude: -25.433682,
        longitude: -49.2589333,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: null,
        phone: null,
        latitude: -25.433682,
        longitude: -49.2589333,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ query: 'JavaScript Gym' })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
    ]);
  });
});
