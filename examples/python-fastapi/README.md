# The Graph Query Examples | Python API with Fastify

Demos how to query the [Graph Network Arbitrum Subgraph](https://thegraph.com/explorer/subgraphs/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp?view=Playground&chain=arbitrum-one) published to The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio) in a `python` api using the `FastAPI` framework.
This is a handy way to integrate a subgraph into a python api that can be queried from an app without exposing your API Key to that app.
This example could be extended to add authentication, meaning only authenticated users can query the api. As well as by providing custom endpoints that query the subgraph and expose data after processing, etc.

It is a really simple example that accepts a graphql request on the exposed `/graphql` endpoint and routes those requests to the Graph Network Arbitrum Subgraph published on The Graph Network.

## Running

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into nodejs example
cd ./examples/python-fastapi

# Install deps
pip3 install -r requirements.txt

# create env
cp ./.env.example ./.env
# need to set the API_KEY value using an API Key created in subgraph studio

# Run
python3 -m uvicorn main:app --reload

# Query the Subgraph
curl http://localhost:8000/graphql -X POST -H 'Content-Type: application/json' -d '{"query": "query Subgraph($id: Bytes!) { subgraph(id: $id) {id nftID metadata { displayName }} }","variables":{"id":"8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R"}}'
```
