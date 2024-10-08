import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180),
  });

  const gymBody = createGymBodySchema.parse(request.body);

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.execute({ ...gymBody });

  return reply.status(201).send();
};
