# The Graph Query Examples | NodeJS CloudFlare Worker

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) using a NodeJS CloudFlare Worker as a Subgraph/API Key Query Proxy layer.

This is a great way to protect your API Key by routing queries from users/dapps to your Subgraph/API Key in a fast and lightweight framework. While also providing ways to add additional functionality, such as:

- JWT Authentication so that only known/authenticated users of your dapp(s) can hit the endpoint
  - https://developers.cloudflare.com/api-shield/security/jwt-validation/jwt-worker/
  - https://blog.cloudflare.com/protecting-apis-with-jwt-validation
- Rate Limiting to allow a specific number of queries to this proxy per a given period (second, minute, day, etc)
  - https://developers.cloudflare.com/waf/rate-limiting-rules/
  - https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- Region locking to only allow requests from specific regions

## Running

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into nodejs-cf-worker example
cd ./examples/nodejs-cf-worker

# Install bun package manager, if needed
curl -fsSL https://bun.sh/install | bash

# Install deps
bun install

# Run
bun run dev
```

## Querying the API -> Subgraph

- just a query, no variables. queries the `_meta` entity

```bash
# start the api
just dev

# query the _meta. no variables
curl http://localhost:8787 -H 'Content-Type: application/json' -d '{"query": "{_meta { block { number }}}"}' -X POST
```

```json5
{
	data: {
		_meta: {
			block: {
				number: 202710879,
			},
		},
	},
}
```

- query with variables and an `operationName`

```bash
curl http://localhost:8787 -H 'Content-Type: application/json' -d '{"query": "query Subgraph($id: ID!) { subgraph(id: $id) { id } }", "variables": {"id": "8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R"}, "operationName": "Subgraph"}' -X POST
```

```json5
{
	data: {
		subgraph: {
			id: '8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R',
		},
	},
}
```

## Environment Variables

- `SUBGRAPH_ENDPOINT`: this is the endpoint for your Subgraph on the Graph Network. Configured in the [wrangler.toml](./wrangler.toml) file
- `API_KEY`: this is stored as a secret. Create a `.dev.vars` file, and add `API_KEY={your api key}`.
  - will need to create/set this value in your deployed CloudFlare Worker as well as the `.dev.vars` is only local.
  - checkout the [secret docs](https://developers.cloudflare.com/workers/configuration/secrets/)

After setting env vars, run the typegen to set the values in the `Env`:

```bash
bun run cf-typegen
```

## Deployment

To deploy versions of your CloudFlare Worker, check out the [deployment docs](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/)
