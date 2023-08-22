import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { jwtMiddleware } from '../../plugins/middleware';

const ParamSchema = Type.Object({
  id: Type.String()
});

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Params: Static<typeof ParamSchema>
  }>({
    method: 'POST',
    url: '/delete/:id',
    schema: {
      tags: ['User'],
      summary: 'Delete user',
      params: ParamSchema
    },
    // preHandler: jwtMiddleware,
    handler: async (request, reply) => {
      const { id } = request.params;
      await fastify.model.User.findByIdAndRemove(id);
      reply.send({
        success: true
      });
    }
  });
}