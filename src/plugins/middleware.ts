import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { Unauthorized, Forbidden } from '../plugins/error';
import { User } from '../models/User.model';
import logger from '../helpers/logger';

export const jwtMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) throw new Forbidden('Forbidden');
    const token = authorization.split(' ')[1];
    // check token expired before use database
    const decode = jwt.decode(token) as jwt.JwtPayload;
    if (decode.exp < Date.now() / 1000) throw new Unauthorized('Token expired');
    const user = await User
      .findById(decode.id)
      .select('id username role');
    request.user = _.pick(user, ['id', 'username', 'role']);
  } catch(ex) {
    logger.error(ex);
    throw new Unauthorized('Unauthorized');
  }
}