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
    './src/generated/subgraph.ts': {
      schema: [
        {
          // replace this with your Subgraph URL
          'https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp': {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
            },
          },
        },
      ],
      // documents: ['./src/**/*.ts'],
      plugins: ['typescript', 'typescript-operations'],
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
