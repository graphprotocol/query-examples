# The Graph Query Examples | Python CLI

Checkout the [cli script](./subgraph_cli.py) that allows you to pass in a query that will be ran on the Subgraph denoted by the `subgraph_url` variable. The default is the arbitrum network subgraph.
This demos how to query a Subgraph using python and exposes the Subgraph through a simple cli that allows you to pass in: your API Key obtained in [Subgraph Studio](https://thegraph.com/studio/apikeys), a query to run on the Subgraph, and potential variables to pass in.

## Running

To run the cli and query the Subgraph:

```bash
# Clone Repo
git clone git@github.com:graphprotocol/query-examples.git

# CD into remix example
cd ./examples/python-cli

# Install the deps
pip3 install -r requirements.txt
```

- querying the arbitrum network subgraph for the meta endpoint

```bash
python3 subgraph_cli.py {YOUR API KEY HERE} '{_meta{block {number}}}'
```

```json5
{
  data: {
    _meta: {
      block: {
        number: 202090981,
      },
    },
  },
}
```

- querying the arbitrum network subgraph for a subgraph by its id, using variables

```bash
python3 subgraph_cli.py {YOUR API KEY HERE} 'query Subgraph($id: Bytes!) { subgraph(id: $id) {id nftID metadata { displayName }} }' --variables '{"id":"8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R"}'
```

```json5
{
  data: {
    subgraph: {
      id: "8SxuHUYYBLHs1UkgFFYNaS7MgrEiAMbDyt5YzwZsSa6R",
      metadata: {
        displayName: "premia-blue",
      },
      nftID: "50052191884981806314061681270704077075290033783727082942964089452092187147494",
    },
  },
}
```
