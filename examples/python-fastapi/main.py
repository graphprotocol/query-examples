from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from requests import post
from typing import Optional, Dict
from typing_extensions import Annotated

class Settings(BaseSettings):
    api_key: str

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache
def get_settings():
  return Settings()

class GraphqlReq(BaseModel):
  query: str
  operationName: Optional[str] = None
  variables: Optional[Dict[str, object]] = None

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
  response = post(subgraph_url, headers=headers, json=payload)

  # Check if the request was successful
  if response.status_code == 200:
      return response.json()
  else:
      print("Error:", response.text)
      return None
  
origins = [
  "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

@app.get("/")
def read_root():
  return {"ok": True}

@app.post("/graphql")
async def graphql_handler(req: GraphqlReq, settings: Annotated[Settings, Depends(get_settings)]):
  return send_graphql_query_to_subgraph(settings.api_key, req.query, req.variables)