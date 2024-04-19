# The Graph Query Examples | Golang API

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) in a `Golang` api.
This is a handy way to integrate a subgraph into a golang api. It is pretty simple in nature as it just provides a passthrough to the underlying Subgraph GraphQL Schema.
But, it provides your Subgraph in a way that:

- hides your API Key from the client
- allows you to utilize CORS to help prevent non-configured apps/users from querying this API, and therefore your Subgraph
- allows you to add authentication/authorization on this API and only allow authenticated/authorized users of your app to query your Subgraph _through this API_.
- allows you to provide custom endpoints/resolvers to add additional processing ontop of your Subgraph

## Running

1. [Download, install, configure golang](https://go.dev/doc/install)
2. Clone the repo

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into remix example
cd ./examples/golang_api
```

3. Install the deps using [go modules](https://go.dev/blog/using-go-modules)

```bash
go mod tidy
```

4. Create the `.env`.

```bash
cp ./.env.example ./.env
# obtain an API Key from Subgraph Studio and fill the value in the `.env`
```

5. Run the API using `justfile`. Install just, see [instructions here](https://just.systems/man/en/chapter_4.html)

```bash
# run the main file directly
just dev
# build and start the executable
just start
```

6. Run the API by compiling the `main.go` file directly

```bash
go run .
```

## Querying the API -> Subgraph

- just a query, no variables. queries the `_meta` entity

```bash
# start the api
just dev

# query the _meta. no variables
curl http://127.0.0.1:4000/api/graphql -H 'Content-Type: application/json' -d '{"query": "{_meta { block { number }}}"}' -X POST
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
curl http://127.0.0.1:4000/api/graphql -H 'Content-Type: application/json' -d '{"query": "query Subgraph($id: ID!) { subgraph(id: $id) { id } }", "variables": {"id": "8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R"}, "operationName": "Subgraph"}' -X POST
```

```json5
{
  data: {
    subgraph: {
      id: "8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R",
    },
  },
}
```
