# The Graph Query Examples | NextJS Pages Router

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) in a `NextJS` application using the nextjs pages router.

A key component to this example is that queries to the Subgraph are _routed through the nextjs api._
This helps with a specific use-case of helping to secure your API Key; either through the client-side JavaScript shipped to the browser, or through network requests. This is a good way to build a dapp that queries a Subgraph that secures your API Key to prevent leaks.
The downside to this approach is that each request makes **two** HTTP requests:

1. from the nextjs app client/ssr to the nextjs api that queries the Subgraph
2. from the nextjs api to the Subgraph.

This is an important consideration when building a dapp that queries the Subgraph.

## Running

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into nextjs-pages-router example
cd ./examples/nextjs-pages-router

# Install bun package manager, if needed
curl -fsSL https://bun.sh/install | bash

# Install deps
bun install

# Run
bun run dev
```

## GraphQL API

This app exposes a GraphQL API at `/api/graphql`, defined in the [`/pages/api/graphql.ts`](./pages/api/graphql.ts) file. It fields `GET` and `POST` requests and accepts a graphql request. It then sends the request to the Subgraph and returns the response after querying the Subgraph on The Graph Network using your API Key.
This is how you secure your API Key from leaks by routing requests through the next api server.

## Environment Variables

```bash
# Copy the example env file into a .env
cp ./.env.example ./.env
# replace the `{your api key here}` with your API Key
```

- `API_KEY` - the 32-digit API Key created in [The Graph Studio](https://thegraph.com/studio).
  - **Note** in this example, the env var is _exposed to the client_.
- `ROOT_URI` - the url the app is running on. used to query the graphql api exposed by the app to route requests to the subgraph through.
  - default: http://localhost:3000/api/graphql

## GraphQL Codegen

This repo utilizes [graphql codegen](https://the-guild.dev/graphql/codegen). This validates our graphql and generates types to match the queries written for the app. These types can then be used to make our components type-safe to the graphql queries that will hydrate them.

```bash
# have to run the app
bun run dev
# run graphql codegen to regen types from updated queries
bun run codegen.gql
```

## References

- [Securing API Keys with NextJS](https://thegraph.com/docs/en/cookbook/how-to-secure-api-keys-using-nextjs-server-components/)
