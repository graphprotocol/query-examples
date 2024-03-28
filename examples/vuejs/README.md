# The Graph Query Examples | VueJS

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) in a `VueJS` application.

## Running

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into vuejs example
cd ./examples/vuejs

# Install bun package manager, if needed
curl -fsSL https://bun.sh/install | bash

# Install deps
bun install

# Run
bun run dev
```

## Environment Variables

```bash
# Copy the example env file into a .env.local.
cp ./.env.example ./.env.local
# replace the `{your api key here}` with your API Key
```

- `VITE_API_KEY` - the 32-digit API Key created in [The Graph Studio](https://thegraph.com/studio).
  - **Note** in this example, the env var is _exposed to the client_.

## GraphQL Codegen

This repo utilizes [graphql codegen](https://the-guild.dev/graphql/codegen). This validates our graphql and generates types to match the queries written for the app. These types can then be used to make our components type-safe to the graphql queries that will hydrate them.

```bash
# run graphql codegen to regen types from updated queries
bun run codegen.gql
```
