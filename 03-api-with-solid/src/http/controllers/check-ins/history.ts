import { makeFetchUserCheckInHistoryUseCase } from '@/use-cases/factories/make-fetch-user-checkins-history-use-case';

import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export const history = async (request: FastifyRequest, reply: FastifyReply) => {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchCheckInHistoryUseCase = makeFetchUserCheckInHistoryUseCase();

  const { checkIns } = await fetchCheckInHistoryUseCase.execute({
    page,
    userId: request.user.sub,
  });

  return reply.status(200).send({
    checkIns,
  });
};
