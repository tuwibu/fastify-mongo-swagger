import { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: 'GET',
    url: '/all',
    schema: {
      tags: ['Get All'],
      summary: 'Get all users',
    },
    handler: async (request, reply) => {
      const response = await fastify.model.User
        .find()
        .select('id username');
      reply.send({
        success: true,
        data: response
      });
    }
  });
}