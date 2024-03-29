# The Graph Query Examples | Nuxt

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) in a `Nuxt` application.

A key component to this example is that queries to the Subgraph are _routed through the nuxt api._
This helps with a specific use-case of helping to secure your API Key; either through the client-side JavaScript shipped to the browser, or through network requests. This is a good way to build a dapp that queries a Subgraph that secures your API Key to prevent leaks.
The downside to this approach is that each request makes **two** HTTP requests:

1. from the nuxt app client/ssr to the nuxt api that queries the Subgraph on `/api/graphql`
2. from the nuxt graphql api to the Subgraph.

This is an important consideration when building a dapp that queries the Subgraph.

See the [graphql api file](./server/api/graphql.post.ts) to see how the Subgraph is queried using your API Key set in the env. [App.vue](./app.vue) then queries the `/api/graphql` api to retrieve data that is then retrieved by querying the Subgraph.

## Running

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into remix example
cd ./examples/remix

# Install bun package manager, if needed
curl -fsSL https://bun.sh/install | bash

# Install deps
bun install

# Run
bun run dev
```

## Environment Variables

```bash
# Copy the example env file into a .env
cp ./.env.example ./.env
# replace the `{your api key here}` with your API Key
```

- `API_KEY` - the 32-digit API Key created in [The Graph Studio](https://thegraph.com/studio).
  - **Note** in this example, the env var is _exposed to the client_.

## GraphQL Codegen

This repo utilizes [graphql codegen](https://the-guild.dev/graphql/codegen). This validates our graphql and generates types to match the queries written for the app. These types can then be used to make our components type-safe to the graphql queries that will hydrate them.

```bash
# have to run the app
bun run dev
# run graphql codegen to regen types from updated queries
bun run codegen.gql
```
