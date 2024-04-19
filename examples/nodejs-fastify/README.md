# The Graph Query Examples | NodeJS Fastify

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) in a `NodeJS` api using fastify framework.
This is a handy way to integrate a subgraph into a nodejs api. It is pretty simple in nature as it just provides a passthrough to the underlying Subgraph GraphQL Schema.
But, it provides your Subgraph in a way that:

- hides your API Key from the client
- allows you to utilize CORS to help prevent non-configured apps/users from querying this API, and therefore your Subgraph
- allows you to add authentication/authorization on this API and only allow authenticated/authorized users of your app to query your Subgraph _through this API_.
- allows you to provide custom endpoints/resolvers to add additional processing ontop of your Subgraph

## Running

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into nodejs example
cd ./examples/nodejs-fastify

# Install bun package manager, if needed
curl -fsSL https://bun.sh/install | bash

# Install deps
bun install

# create env
cp ./.env.example ./.env
# need to set the API_KEY value using an API Key created in subgraph studio

# Run
bun run dev

# Query the Subgraph
curl http://localhost:4000/graphql -X POST -H "Content-Type: application/json" -d '{"query": "{_meta{block {number}}}"}'
```
