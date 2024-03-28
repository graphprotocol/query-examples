import type { CodegenConfig } from '@graphql-codegen/cli';

export default {
  overwrite: true,
  generates: {
    './generated/': {
      // This references the exposed graphql schema at the /api/graphql.ts api route.
      // This route is exposed at http://localhost:3000/api/graphql.
      // The app needs to be running in order to run the graphql codegen.
      schema: ['http://localhost:3000/api/graphql'],
      documents: ['./pages/**/*.{ts,tsx}', './services/**/*.ts'],
      preset: 'client',
      config: {
        arrayInputCoercion: false,
        enumsAsTypes: true,
        dedupeFragments: true,
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
} satisfies CodegenConfig;
