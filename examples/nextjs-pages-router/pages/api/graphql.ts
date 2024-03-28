/**
 * This api route exposes a graphql api that routes requests to the Graph Network Arbitrum Subgraph on The Graph Network.
 * With this as an API route, the client never sees or exposes your API Key, securing it to help prevent leaks.
 *
 * This is exposed at `/api/graphql` route.
 */
import { GraphQLClient } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';
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
  query: z.string().min(1),
  operationName: z.string().optional().nullable(),
  variables: z.record(z.unknown()).optional().nullable(),
});

const ResponseSchema = z.union([z.object({ data: z.unknown() }), z.object({ error: z.unknown() })] as const);
type ResponseSchema = z.infer<typeof ResponseSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseSchema>) {
  const parsedGqlRequest = GraphqlReqSchema.safeParse(req.body);
  if (!parsedGqlRequest.success) {
    return res.status(400).json({ error: parsedGqlRequest.error });
  }
  const gqlRequest = parsedGqlRequest.data;

  const gqlResponse = await client.request(gqlRequest.query, gqlRequest.variables ?? undefined);

  res.status(200).json({ data: gqlResponse });
}
