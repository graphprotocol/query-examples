# @graphprotocol/query-examples-nodejs-cli

Checkout the [cli script](./src/index.ts) that allows you to pass in a query that will be ran on the Subgraph denoted by the `subgraphClient` variable that initializes a `GraphQLClient` for the Subgraph. The default is the arbitrum network Subgraph.
This demos how to query a Subgraph using nodejs scripting and exposes the Subgraph through a simple cli that allows you to pass in: your API Key obtained in [Subgraph Studio](https://thegraph.com/studio/apikeys), a query to run on the Subgraph, and potential variables to pass in.

## Running

To run the cli and query the Subgraph:

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into remix example
cd ./examples/nodejs-cli

# Install bun package manager, if needed
curl -fsSL https://bun.sh/install | bash

# install the deps
bun install
```

- help

```bash
subgraph-query query --help

# Usage: subgraph-query query [options] <api-key> <query>

# Query the Subgraph on the The Graph Network

# Arguments:
#   api-key                   API Key obtained on Subgraph Studio
#   query                     GraphQL Query to run on the Subgraph

# Options:
#   -v, --variables <object>  [Optional] GraphQL Variables to pass to the Subgraph query
#   -h, --help                display help for command
```

- querying the arbitrum network subgraph for the meta endpoint

```bash
subgraph-query query {YOUR API KEY HERE} {_meta{block{number}}}
```

```json5
{
  _meta: {
    block: {
      number: 202511687,
    },
  },
}
```

- querying the arbitrum network subgraph for a subgraph by its id, using variables

```bash
subgraph-query query {YOUR API KEY HERE} \
 'query Subgraph($id: ID!) { subgraph(id: $id) { id nftID metadata {displayName} } }' \
--variables '{"id":"8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R"}'
```

```json5
{
  subgraph: {
    id: '8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R',
    metadata: {
      displayName: 'premia-blue',
    },
    nftID: '50052191884981806314061681270704077075290033783727082942964089452092187147494',
  },
}
```
