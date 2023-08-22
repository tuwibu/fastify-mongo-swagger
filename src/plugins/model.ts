import fastifyPlugin from 'fastify-plugin';
import Article from '../models/Article.model';
import User from '../models/User.model';
import Website from '../models/Website.model';

export default fastifyPlugin(async (server, options) => {
  const model = {
    Article,
    User,
    Website
  }
  server.decorate("model", model);
});