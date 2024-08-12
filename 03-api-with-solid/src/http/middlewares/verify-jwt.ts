import { FastifyRequest, FastifyReply } from 'fastify';

// this middleware garantees that the user is authenticated when
// applied to a route
export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.status(401).send({ message: 'Unauthorized.' });
  }
}
