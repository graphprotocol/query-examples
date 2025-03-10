/**
 * The Graph Network Subgraph query proxy CloudFlare Worker example.
 * Provides a query proxy between dapps and your Subgraph/API Key.
 * This way, you can protect your API Key and even add additional functionality in the way of:
 * - rate limiting
 * - authentication
 * - region-locking
 *
 * This example is straightforward and provides just the Subgraph query proxy.
 * But easy to add/modify.
 *
 * Some CF rate-limiting examples:
 * @see https://developers.cloudflare.com/waf/rate-limiting-rules/
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 *
 * Some CF Worker JWT Auth examples:
 * @see https://developers.cloudflare.com/api-shield/security/jwt-validation/jwt-worker/
 * @see https://blog.cloudflare.com/protecting-apis-with-jwt-validation
 *
 * Secrets:
 * Your API Key should be stored as a secret in your CloudFlare Worker (vs an environment variable).
 * Create a file: `.dev.vars` and add: `API_KEY={your api key}` in it.
 * Follow the link below to see how to create the secret in  your deployed CF Worker.
 * @see https://developers.cloudflare.com/workers/configuration/secrets/
 */

import { DurableObject } from 'cloudflare:workers';
import { z } from 'zod';

// const WHITEGLOVE_MAP = {
// 	"api.thegraph.com/subgraphs/name/schmidsi/anudit-lens": {
// 		""
// 		"rateLimit": 100,
// 		"rateLimitWindow": 6
// 	}
// }

const GraphqlReqSchema = z.object({
	query: z.string().min(1),
	operationName: z.string().optional().nullable(),
	variables: z.record(z.unknown()).optional().nullable(),
});

export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(req: Request, env: Env): Promise<Response> {
		// The Graph Network Subgraph GraphQL requests should only support: OPTIONS, POST requests
		if (!['POST', 'OPTIONS'].includes(req.method.toUpperCase())) {
			return new Response('Unsupported', { status: 400 });
		}

		// TODO: per subgraph rate limiting
		const id = env.RATE_LIMITER.idFromName('global');

		console.log('Hello Pranav');

		try {
			const stub = env.RATE_LIMITER.get(id);
			// const milliseconds_to_next_request = await ;

			// console.log(milliseconds_to_next_request, 'milliseconds_to_next_request')

			if (await stub.rateLimit()) {
				// Alternatively one could sleep for the necessary length of time
				return new Response(
					JSON.stringify({
						errors: [
							{
								message:
									'Rate limit on ENS communtiy key exceeded. Try again later or got to https://thegraph.com/studio to create your own API key. Find the ENS subgraph here: https://thegraph.com/explorer/subgraphs/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH?v=1&view=Overview&chain=arbitrum-one',
							},
						],
					}),
					{ status: 429 }
				);
			}
		} catch (error) {
			console.log(error, 'error')
			return new Response('Could not connect to rate limiter', { status: 502 });
		}

		const response = await querySubgraph(req, env);
		if (response.status !== 200) {
			return new Response(response.statusText, { status: response.status });
		}
		const body = await response.json();

		return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' }, status: 200 });
	},
};

async function querySubgraph(req: Request, env: Env) {
	const body = await req.json();
	if (body == null) {
		return new Response('Invalid GraphQL Request', { status: 400 });
	}
	const parsedGqlRequest = GraphqlReqSchema.safeParse(body);
	if (!parsedGqlRequest.success) {
		return new Response('Invalid GraphQL Request', { status: 400 });
	}
	const gqlRequest = parsedGqlRequest.data;

	return await fetch(env.SUBGRAPH_ENDPOINT, {
		method: 'POST',
		body: JSON.stringify(gqlRequest),
		headers: {
			// authorization: `Bearer ${env.API_KEY}`,
			'Content-Type': 'application/json',
		},
	});
}

export class RateLimiter extends DurableObject {
	static milliseconds_per_request = 10000;
  
	lastRequest: number;
  
	constructor(ctx: DurableObjectState, env: Env) {
	  super(ctx, env);
	  this.lastRequest = 0;
	}
  
	async rateLimit(): Promise<boolean> {
	  const now = Date.now();

	  console.log(now, this.lastRequest,  RateLimiter.milliseconds_per_request);

	  if (now - this.lastRequest > RateLimiter.milliseconds_per_request) {
		this.lastRequest = now;
		return false;
	  } else {
		return true
	  }
	}
  }