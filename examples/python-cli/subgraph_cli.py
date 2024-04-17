import requests
import json
import argparse

subgraph_url = "https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp"

def send_graphql_query_to_subgraph(api_key, query, variables = None):
  headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {api_key}'
  }

  # Prepare the request payload
  payload = {'query': query}
  if variables:
      payload['variables'] = variables
  
  # Send the GraphQL request to the Subgraph
  response = requests.post(subgraph_url, headers=headers, json=payload)

  # Check if the request was successful
  if response.status_code == 200:
      return response.json()
  else:
      print("Error:", response.text)
      return None
  
def main():
  # Parse command line arguments
  parser = argparse.ArgumentParser(description='GraphQL CLI')
  parser.add_argument('api_key', help='API Key obtained in Subgraph Studio for querying a Subgraph')
  parser.add_argument('query', help='GraphQL query to be executed')
  parser.add_argument('--variables', help='Variables JSON string')
  args = parser.parse_args()

  # Convert variables JSON string to dictionary
  variables = None
  if args.variables:
    try:
      variables = json.loads(args.variables)
    except json.JSONDecodeError:
      print("Error: Invalid JSON for variables.")
      return

  # Send the GraphQL query
  result = send_graphql_query_to_subgraph(args.api_key, args.query, variables)
  if result:
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
  main()