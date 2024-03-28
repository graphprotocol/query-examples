import { GraphQLClient } from 'graphql-request';

import { graphql } from '@/generated/gql';
import type { SubgraphsQueryVariables } from '@/generated/graphql';

const Subgraphs = graphql(`
  query Subgraphs($first: Int, $skip: Int, $where: Subgraph_filter) {
    subgraphs(first: $first, skip: $skip, where: $where) {
      id
      metadata {
        displayName
        image
        description
      }
      owner {
        id
      }
    }
  }
`);

export type QuerySubgraphsArgs = {
  client: GraphQLClient;
  vars?: SubgraphsQueryVariables;
};
export async function querySubgraphs({
  client,
  vars = {
    first: 10,
    skip: 0,
    where: {
      metadata_not: null,
      metadata_: { description_not: null },
      owner_not: '0x0000000000000000000000000000000000000000',
    },
  },
}: QuerySubgraphsArgs) {
  return await client.request(Subgraphs, vars);
}
