import fastifyPlugin from 'fastify-plugin';
import logger from '../helpers/logger';

export default fastifyPlugin(async (server, options) => {
  server.decorate('logger', logger);
});