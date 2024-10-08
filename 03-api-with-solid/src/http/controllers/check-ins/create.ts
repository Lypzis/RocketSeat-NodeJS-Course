import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createCheckInParseSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180),
  });

  const { gymId } = createCheckInParseSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const createCheckInUseCase = makeCheckInUseCase();

  await createCheckInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
};
