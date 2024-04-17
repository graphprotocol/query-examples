import cors from '@fastify/cors';
import Fastify from 'fastify';

import { env } from './env.js';
import { graphqlHandler } from './handlers.js';

const app = Fastify({ logger: true });

async function bootstrap() {
  // initialize cors plugin with app instance
  app.register(cors, {
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin(origin, cb) {
      if (!origin) {
        return cb(null, true);
      }
      const hostname = new URL(origin).hostname;
      if (hostname === 'localhost') {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error('Origin Not allowed'), false);
    },
  });

  app.get('/', (_, res) => res.status(200).send('OK'));

  // routes post requests to the graphql endpoint that queries the Subgraph
  app.post('/graphql', graphqlHandler);

  return app;
}

bootstrap()
  .then((app) => {
    app.listen({ port: env.API_PORT, host: '0.0.0.0' }, (err, addr) => {
      if (err) {
        console.error('failure boostrapping api instance', { err });
        process.exit(1);
      }
      console.log(`api instance bootstrapped and running\r\n${app.printRoutes({ commonPrefix: false })}`, { addr });
    });
  })
  .catch((err) => {
    console.error('failure boostrapping api instance', { err });
    process.exit(1);
  });
