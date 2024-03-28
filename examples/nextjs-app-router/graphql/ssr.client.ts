import { GraphQLClient } from 'graphql-request';

import { env } from '@/env/server';

// this hits the graphql api exposed in the /app/graphql/route.ts file
export const client = new GraphQLClient(env.ROOT_URI);
