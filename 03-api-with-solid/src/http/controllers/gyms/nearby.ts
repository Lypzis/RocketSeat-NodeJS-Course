import { makeFetchNearbyGymUseCase } from '@/use-cases/factories/make-fetch-nearby-gym-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export const nearby = async (request: FastifyRequest, reply: FastifyReply) => {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine(value => Math.abs(value) <= 180),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

  const fetchNearbyGymUseCase = makeFetchNearbyGymUseCase();

  const { gyms } = await fetchNearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({
    gyms,
  });
};
