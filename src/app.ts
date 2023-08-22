import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import cors from '@fastify/cors';
import packageJson from '../package.json';
import logger from './plugins/logger';
import model from './plugins/model';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/goprofilev2';
const MONGO_NAME = process.env.MONGO_NAME || 'goprofilev2';

const app = fastify({
  logger: false,
});
// register plugin
app.register(model);
app.register(logger);
// middleware
app.register(swagger, {
  openapi: {
    info: {
      title: 'Demo API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
    },
  },
  hideUntagged: true
});
app.register(swaggerUi, {
  routePrefix: '/docs/swagger',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: false,
});
app.register(cors);
// handle error
app.setNotFoundHandler((request, reply) => {
  return reply.status(404).send({
    success: false,
    message: `Route ${request.method}:${request.url} not found`
  });
});
app.setErrorHandler((error, request, reply) => {
  app.logger.error(error);
  return reply.status(error?.statusCode || 500).send({
    success: false,
    message: error.message
  });
});
app.register(autoload, {
  dir: path.resolve(__dirname, 'routes'),
  dirNameRoutePrefix: true
});
app.get('/', async (request, reply) => {
  reply.send({
    copyright: `© ${new Date().getFullYear()} GoProfile v${packageJson.version}`
  });
});

mongoose.set('debug', true);
mongoose.connect(MONGO_URI, {
  autoIndex: true,
  appName: MONGO_NAME,
  dbName: MONGO_NAME,
}).then(async () => {
  app.listen({
    port: parseInt(process.env.PORT || '5000')
  }, async(err, address) => {
    if (err) {
      app.logger.error(err);
      process.exit(1);
    }
    app.logger.success(`Server listening at ${address}`); 
  });
}).catch((err) => {
  app.logger.error(err);
  process.exit(1);
});