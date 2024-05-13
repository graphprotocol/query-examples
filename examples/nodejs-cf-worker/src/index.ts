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

import { z } from 'zod';

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
			authorization: `Bearer ${env.API_KEY}`,
			'Content-Type': 'application/json',
		},
	});
}
