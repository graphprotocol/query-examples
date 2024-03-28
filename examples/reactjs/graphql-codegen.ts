import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const API_KEY = process.env.VITE_API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY env var required');
}

export default {
  overwrite: true,
  generates: {
    './src/generated/': {
      schema: [
        // replace this with your Subgrah URL
        `https://gateway-arbitrum.network.thegraph.com/api/${API_KEY}/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp`,
      ],
      documents: ['./src/**/*.{ts,tsx}'],
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
