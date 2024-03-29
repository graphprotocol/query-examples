# The Graph Query Examples | cURL

Checkout the [query script](./query.sh) that queries Subgraphs on The Graph Network Arbitrum Subgraph published on The Graph Network.
This demos how to `cURL` a Subgraph published on The Graph Network using an API Key obtained on [The Graph Studio](https://thegraph.com/studio).

## Running

To run the script and query the the Graph Network Arbitrum Subgraph:

```bash
# replace {your API Key} with an API Key obtained from The Graph Studio

# run the query, pass in your API Key, pretry print the results
./query.sh -key {your API Key} -pretty

# run the query, use tee to print into a JSON file
./query.sh -key {your API Key} -pretty -tee subgraphs.json

# run the query, grep for a Subgraph
 ./query.sh -key efef1e716ff132836a7b26bfdbc5f774 -pretty | tr '\n' ' ' | grep "CryptoPunks"
```

## Usage

Feel free to replace the `query` and `subgraph` vars in the script with whatever Subgraph you would like to query and whatever query you would like to run on it.

## Raw cURL

The script is a handy wrapper around a `cURL` request. Which is structured as below.

If preferred, run this `cURL` directory and pass in your `$API_KEY` and `$SUBGRAPH_URL` that you would like to query

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"query": "{ _meta { block { number } } }" }' \
  $SUBGRAPH_URL
```
