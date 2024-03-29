/**
 * This api route exposes a graphql api that routes requests to the Graph Network Arbitrum Subgraph on The Graph Network.
 * With this as an API route, the client never sees or exposes your API Key, securing it to help prevent leaks.
 *
 * This is exposed at `/api/graphql` route.
 * Method must be accessed via a POST request.
 */
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient } from 'graphql-request';
import { z } from 'zod';

import { env } from '@/env/server';

// replace this with your Subgrah URL
const subgraphQueryUrl =
  'https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp';
const client = new GraphQLClient(subgraphQueryUrl, {
  headers: {
    Authorization: `Bearer ${env.API_KEY}`,
  },
});

const GraphqlReqSchema = z.object({
  // allows us to pass either a string, or a TypedDocumentNode instance to the API
  query: z.union([z.string().min(1), z.custom<TypedDocumentNode>()] as const),
  operationName: z.string().optional().nullable(),
  variables: z.record(z.unknown()).optional().nullable(),
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) => GraphqlReqSchema.safeParse(body));

  if (!result.success) {
    setResponseStatus(event, 400);
    throw result.error.issues;
  }

  setResponseStatus(event, 200);
  const data = await client.request(result.data.query, result.data.variables ?? undefined);

  return { data };
});
