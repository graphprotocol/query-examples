# The Graph Query Examples | SvelteKit

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) in a `SvelteKit` application.

A key component to this example is the `+page.server` functionality provided by SvelteKit. These files are compiled and ran on the server and not available on the client. So having the [`/src/routes/+page.server.ts`](./src/routes/+page.server.ts) file build our graph client instance, then our API Key only exists on the server layer and is not exposed via the network tab or client shipped JavaScript.
The data returned by the `load()` function exposed in that

## Running

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into sveltejs example
cd ./examples/sveltejs

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
