import fastifyPlugin from 'fastify-plugin';
export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequest extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class Unauthorized extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class PaymentRequired extends CustomError {
  constructor(message: string) {
    super(message, 402);
  }
}

export class Forbidden extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFound extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class Conflict extends CustomError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class UnprocessableEntity extends CustomError {
  constructor(message: string) {
    super(message, 422);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class ServiceUnavailable extends CustomError {
  constructor(message: string) {
    super(message, 503);
  }
}

export class TooManyRequests extends CustomError {
  constructor(message: string) {
    super(message, 429);
  }
}

export default fastifyPlugin(async (server, options) => {
  server.decorate('httpErrors', {
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
  });
});