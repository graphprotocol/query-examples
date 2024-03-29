import { createEnv } from '@t3-oss/env-nuxt';
import { z } from 'zod';

export const env = createEnv({
  server: {
    API_KEY: z.string().min(32).max(32),
  },
});
