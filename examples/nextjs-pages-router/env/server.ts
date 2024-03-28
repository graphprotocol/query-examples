import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    API_KEY: z.string().min(32).max(32),
    ROOT_URI: z.string().url().default('http://localhost:3000/api/graphql'),
  },
  runtimeEnv: {
    API_KEY: process.env.API_KEY,
    ROOT_URI: process.env.ROOT_URI,
  },
});
