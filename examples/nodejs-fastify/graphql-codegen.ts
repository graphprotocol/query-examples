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
        // replace this with your Subgrah URL
        `https://gateway-arbitrum.network.thegraph.com/api/${API_KEY}/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp`,
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
