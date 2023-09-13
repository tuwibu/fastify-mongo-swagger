import { Static } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { AjaxSchema, genQuery } from '../../utils/datatable';
import { jwtMiddleware } from '../../plugins/middleware';

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof AjaxSchema>
  }>({
    method: 'POST',
    url: '/ajax',
    schema: {
      body: AjaxSchema
    },
    preHandler: jwtMiddleware,
    handler: async (request, reply) => {
      const query = genQuery(request.body);
      const response = await fastify.model.User
        .find(query.where)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit)
        .select('id username role createdAt updatedAt');
      const groupBy = await fastify.model.Article
        .aggregate([
          {
            $group: {
              _id: '$User',
              count: { $sum: 1 }
            }
          }
        ]);
      const data = response.map((item) => {
        const group = groupBy.find((group) => group?._id?.toString() === item?.id?.toString());
        return {
          ...item.toJSON(),
          Articles: group ? group.count : 0
        }
      });
      const total = await fastify.model.User.countDocuments(query.where);
      reply.send({
        success: true,
        data: data,
        recordsTotal: total,
        recordsFiltered: total,
        pages: Math.ceil(total / query.limit)
      });
    }
  });
}