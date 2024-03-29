import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY env var required');
}

export default {
  overwrite: true,
  generates: {
    './generated/': {
      // This references the exposed graphql schema at the /server/api/graphql.post.ts api route.
      // This route is exposed at http://localhost:3000/api/graphql.
      // The app needs to be running in order to run the graphql codegen.
      schema: ['http://localhost:3000/api/graphql'],
      documents: ['./**/*.{ts,vue}'],
      preset: 'client',
      config: {
        arrayInputCoercion: false,
        enumsAsTypes: true,
        dedupeFragments: true,
        useTypeImports: true,
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
} satisfies CodegenConfig;
