package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
	"github.com/joho/godotenv"
)

// / Replace with your Subgraph url
const subgraph = "https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp"

type Response struct {
	Message string `json:"message"`
}

type GraphqlReq struct {
	Query         string                  `json:"query"`
	Variables     *map[string]interface{} `json:"variables,omitempty"`
	OperationName *string                 `json:"operationName,omitempty"`
}

func (g *GraphqlReq) Bind(r *http.Request) error {
	return nil
}

func main() {
	// read the .env which contains your API_KEY
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiKey := os.Getenv("API_KEY")

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(render.SetContentType(render.ContentTypeJSON))
	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	r.Use(middleware.Timeout(30 * time.Second))

	r.Route("/api", func(r chi.Router) {
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			response := Response{Message: "OK"}
			jsonResponse, err := json.Marshal(response)
			if err != nil {
				http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusOK)
			w.Write(jsonResponse)
		})
		// exposes a GraphQL endpoint that accepts a POST request with the query, variables, and operation name known to a graphql request.
		// forwards this request to our Subgraph.
		// returns the results.
		// this could easily be extended to provide custom resolvers ontop of our Subgraph schema and resolve.
		r.Post("/graphql", func(w http.ResponseWriter, r *http.Request) {
			data := &GraphqlReq{}
			if err := render.Bind(r, data); err != nil {
				render.Render(w, r, ErrInvalidRequest(err))
				return
			}

			// Forward the received GraphqlReq to the Subgraph and retrieve the response
			subgraphqlResponse, err := performSubgraphQuery(data, apiKey)
			if err != nil {
				log.Printf("Subgraph Graphql response err %s", err)
				render.Render(w, r, ErrInvalidRequest(err))
				return
			} else if subgraphqlResponse == nil {
				log.Printf("No response retrieved from the Subgraph")
				http.Error(w, "Failed to retrieve response from the Subgraph", http.StatusInternalServerError)
				return
			}

			render.Status(r, http.StatusOK)
			w.Write(*subgraphqlResponse)
		})
	})

	log.Println("Graph Protocol/Query Examples/Golang API running on port 4000")
	http.ListenAndServe(":4000", r)
}

// ErrResponse renderer type for handling all sorts of errors.
//
// In the best case scenario, the excellent github.com/pkg/errors package
// helps reveal information on the error, setting it on Err, and in the Render()
// method, using it to set the application-specific error code in AppCode.
type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}
func ErrInvalidRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Invalid request.",
		ErrorText:      err.Error(),
	}
}

func ErrRender(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 500,
		StatusText:     "Error rendering response.",
		ErrorText:      err.Error(),
	}
}

// Forward the received GraphqlReq containing the query, variables and operationName to the Subgraph.
func performSubgraphQuery(req *GraphqlReq, apiKey string) (*[]byte, error) {
	// convert GraphqlReq object to JSON
	reqBytes, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	// Create an HTTP client that will perform the request
	client := &http.Client{}
	// Forward the request to the Subgraph
	subgraphRequest, err := http.NewRequest(http.MethodPost, subgraph, bytes.NewBuffer(reqBytes))
	if err != nil {
		return nil, err
	}
	// Add the apiKey as a Authorization Bearer token on the request
	subgraphRequest.Header.Set("Authorization", "Bearer "+apiKey)
	subgraphRequest.Header.Set("Accept", "application/json")
	subgraphRequest.Header.Set("Content-Type", "application/json")
	// Perform the GraphQL Request on the Subgraph
	subgraphResponse, err := client.Do(subgraphRequest)
	if err != nil {
		return nil, err
	}
	defer subgraphResponse.Body.Close()

	// Read & return the response body.
	subgraphResponseBody, err := io.ReadAll(subgraphResponse.Body)
	if err != nil {
		return nil, err
	}

	return &subgraphResponseBody, nil
}
