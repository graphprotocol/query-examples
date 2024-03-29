#!/bin/bash

# Function to display usage information
usage() {
    echo "Usage: $0 -key <32-digit_key> [-grep <pattern>] [-tee <filename>]"
    exit 1
}

# Parse command line options
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -key)
            key_value="$2"
            shift
            shift
            ;;
        -grep)
            grep_pattern="$2"
            shift
            shift
            ;;
        -pretty)
            pretty_print=true
            shift
            ;;
        -tee)
            tee_output="$2"
            shift
            shift
            ;;
        *)
            usage
            ;;
    esac
done

# Check if key is provided
if [[ -z $key_value ]]; then
    echo "Error: API Key parameter is required."
    usage
fi

# define the query to send to the Subgraph.
# replace this with whatever query you would like to run
query="{\"query\":\"query Subgraphs(\$first: Int, \$skip: Int, \$where: Subgraph_filter) { subgraphs(first: \$first, skip: \$skip, where: \$where) { id metadata { displayName image description } owner { id } } }\",\"variables\":{\"first\":10,\"skip\":0,\"where\":{\"metadata_not\":null,\"metadata_\":{\"description_not\":null},\"owner_not\":\"0x0000000000000000000000000000000000000000\"}}}"
# replace this with whatever Subgraph your would like to query
subgraph="https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp"

response=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $key_value" -d "$query" $subgraph)

# Apply grep if provided
if [[ -n $grep_pattern ]]; then
    response=$(echo "$response" | grep "$grep_pattern")
fi

# Pretty print the response if -pretty option is provided
if [[ $pretty_print == true ]]; then
    response=$(echo "$response" | jq '.')
fi

# Output result to console or file if -tee option is provided
if [[ -n $tee_output ]]; then
    echo "$response" | tee "$tee_output"
else
    echo "$response"
fi