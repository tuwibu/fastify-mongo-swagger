import { AnyKeys } from 'mongoose';
import { FastifyInstance } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { jwtMiddleware } from '../../plugins/middleware';
import bcrypt from 'bcrypt';
import { IUserDocument } from '../../models/User.model';
const saltRounds = 10;

const ParamSchema = Type.Object({
  id: Type.String()
});

enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

const BodySchema = Type.Object({
  username: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  role: Type.Optional(Type.Enum(Role))
});

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Params: Static<typeof ParamSchema>,
    Body: Static<typeof BodySchema>
  }>({
    method: 'POST',
    url: '/edit/:_id',
    schema: {
      tags: ['User'],
      summary: 'Edit user',
      params: ParamSchema,
      body: BodySchema
    },
    // preHandler: jwtMiddleware,
    handler: async (request, reply) => {
      const { id } = request.params;
      const { username, password, role } = request.body;
      const updateContent: AnyKeys<IUserDocument> = {};
      if (request.body.hasOwnProperty('username')) updateContent.username = username;
      if (request.body.hasOwnProperty('password')) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        updateContent.password = hash;
      }
      if (request.body.hasOwnProperty('role')) updateContent.role = role;
      await fastify.model.User.findByIdAndUpdate(id, updateContent);
      reply.send({
        success: true
      });
    }
  });
}