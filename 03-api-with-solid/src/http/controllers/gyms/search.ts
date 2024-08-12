import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gym-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const gymQuery = searchGymQuerySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymsUseCase();

  const { gyms } = await searchGymUseCase.execute({ ...gymQuery });

  return reply.status(200).send({
    gyms,
  });
};
