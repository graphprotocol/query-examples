/**
 * This service layer file/functions will only be rendered on the remix server (hence the .server naming structure).
 * It will expose a graphql service API to make queries to the Graph Network Arbitrum Subgraph without exposing our API Key to the client.
 */
import { GraphQLClient } from 'graphql-request';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('Must provide an API_KEY env var');
}
// replace this with your Subgrah URL
const subgraphQueryUrl =
  'https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp';

let client: GraphQLClient;

declare global {
  // eslint-disable-next-line no-var
  var __client: GraphQLClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === 'production') {
  client = new GraphQLClient(subgraphQueryUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
} else {
  if (!global.__client) {
    global.__client = new GraphQLClient(subgraphQueryUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
  }
  client = global.__client;
}

export { client };
