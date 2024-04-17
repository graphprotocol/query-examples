import { createEnv } from '@t3-oss/env-core';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const env = createEnv({
  server: {
    API_PORT: z.coerce.number().default(4000),
    API_KEY: z.string().min(32).max(32),
  },
  runtimeEnv: process.env,
});
