import type { RouteHandler } from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route.js';
import { GraphQLError } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import { z } from 'zod';

import { env } from './env.js';

const subgraphClient = new GraphQLClient(
  'https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp',
  {
    headers: {
      Authorization: `Bearer ${env.API_KEY}`,
    },
  },
);

const GraphqlReqSchema = z.object({
  query: z.string().min(1),
  operationName: z.string().optional().nullable(),
  variables: z.record(z.unknown()).optional().nullable(),
});
type GraphqlReqSchema = z.infer<typeof GraphqlReqSchema>;

const GraphqlResSchema = z.record(z.any());
type GraphqlResSchema = z.infer<typeof GraphqlResSchema>;

export type GraphqlSuccessResponse = {
  data: GraphqlResSchema;
};
export type GraphqlErrorResponse = {
  err: string | Error | GraphQLError;
};
export type GraphqlResponse = GraphqlSuccessResponse | GraphqlErrorResponse;

export interface GraphqlOptions extends RouteGenericInterface {
  Body: GraphqlReqSchema;
  Reply: GraphqlResponse;
}

export const graphqlHandler: RouteHandler<GraphqlOptions> = async ({ body: submitted }, reply) => {
  try {
    const bodyParseResult = GraphqlReqSchema.safeParse(submitted);
    if (!bodyParseResult.success) {
      console.warn('graphqlHandler() submitted request body invalid. exiting...', {
        err: bodyParseResult.error,
        body: submitted,
      });
      return reply.status(400).send({ err: bodyParseResult.error });
    }
    const body = bodyParseResult.data;
    const response = await subgraphClient.request(body.query, body.variables ?? undefined);
    const parsedResponseResult = GraphqlResSchema.safeParse(response);
    if (!parsedResponseResult.success) {
      console.warn('graphqlHandler() graphql response from network subgraph invalid. exiting...', {
        err: parsedResponseResult.error,
        body: submitted,
      });
      return reply.status(500).send({ err: parsedResponseResult.error });
    }

    return reply.status(200).send({ data: parsedResponseResult.data });
  } catch (err) {
    console.error('graphqlHandler() failure processing the graphql request', { err });
    return reply.status(500).send({ err: err instanceof Error ? err : new GraphQLError(err as string) });
  }
};
