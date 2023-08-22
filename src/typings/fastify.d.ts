import logger from '../helpers/logger';
import { IncomingMessage, ServerResponse } from 'http';
import { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault, RawServerDefault } from 'fastify';
import type { Article } from '../models/Article.model';
import type { User } from '../models/User.model';
import type { Website } from '../models/Website.model';
import type {
  BadRequest,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  Conflict,
  UnprocessableEntity,
  InternalServerError,
  ServiceUnavailable,
  TooManyRequests
} from '../plugins/error';

export type IFastify = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>;

declare module 'fastify' {
  interface FastifyInstance {
    logger: typeof logger,
    httpErrors: {
      BadRequest: typeof BadRequest,
      Unauthorized: typeof Unauthorized,
      PaymentRequired: typeof PaymentRequired,
      Forbidden: typeof Forbidden,
      NotFound: typeof NotFound,
      Conflict: typeof Conflict,
      UnprocessableEntity: typeof UnprocessableEntity,
      InternalServerError: typeof InternalServerError,
      ServiceUnavailable: typeof ServiceUnavailable,
      TooManyRequests: typeof TooManyRequests
    },
    model: {
      Article: typeof Article,
      User: typeof User,
      Website: typeof Website
    }
  }
  interface FastifyRequest {
    user?: any
  }
}