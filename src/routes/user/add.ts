import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { jwtMiddleware } from '../../plugins/middleware';
import {} from '../../plugins/error';
import bcrypt from 'bcrypt';
const saltRounds = 10;

enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

const BodySchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
  role: Type.Enum(Role)
});

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof BodySchema>
  }>({
    method: 'POST',
    url: '/add',
    schema: {
      tags: ['User'],
      summary: 'Add new user',
      body: BodySchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
          }
        }
      }
    },
    // preHandler: jwtMiddleware,
    handler: async (request, reply) => {
      const { username, password, role } = request.body;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      const user = await fastify.model.User.findOne({
        username
      });
      if (user) throw new fastify.httpErrors.Conflict(`User already exists: ${username}`);
      const response = await fastify.model.User.create({
        username,
        password: hash,
        role
      });
      reply.send({
        success: true,
        data: response
      });
    }
  });
}