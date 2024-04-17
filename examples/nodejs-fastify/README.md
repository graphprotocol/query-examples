# The Graph Query Examples | NodeJS Fastify

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) in a `NodeJS` api using fastify framework.
This is a handy way to integrate a subgraph into a nodejs api, as well as provide custom resolvers around a subgraph. As well as, a way to secure an API Key from a UI by building an API around it where auth could be required (built into this example); this way, only authenticated users of your app can query the subgraph with your API Key.

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
