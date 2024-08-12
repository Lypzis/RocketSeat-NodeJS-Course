import { FastifyRequest, FastifyReply } from 'fastify';

// this middleware garantees that the user is authenticated when
// applied to a route
export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToVerify)
      reply.status(401).send({ message: 'Unauthorized.' });
  };
}
