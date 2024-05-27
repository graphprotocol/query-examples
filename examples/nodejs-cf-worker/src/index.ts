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

export default {
  // The fetch handler is invoked when this worker receives a HTTP(S) request
  // and should return a Response (optionally wrapped in a Promise)
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    // The Graph Network Subgraph GraphQL requests should only support: OPTIONS, POST requests
    if (!['POST', 'OPTIONS'].includes(req.method.toUpperCase())) {
      return new Response('Unsupported', { status: 400 });
    }

    // register path called by admin to set the network subgraph url for a given path
    if (req.method === 'POST' && path === '/register') {
      if (req.headers.get('Authorization') !== `${env.ADMIN_ACCESS_KEY}`) {
        return new Response('Unauthorized', { status: 401 });
      }
      const body = await req.json();

      const { to, from } = body as { to: string; from: string };

      if (!to || !from) {
        return new Response('Invalid request', { status: 400 });
      }

      const hostedSubgraph = new URL(to);
      const allowedHosts = ['api.thegraph.com'];
      if (!allowedHosts.includes(hostedSubgraph.host)) {
        return new Response(`Invalid URL for hosted service subgraph.`, { status: 400 });
      }

      const networkSubgraphUrl = new URL(from);
      const allowedNetworkSubgraphs = ['api.thegraph.com', 'gateway-arbitrum.network.thegraph.com', 'gateway.network.thegraph.com'];
      if (!allowedNetworkSubgraphs.includes(networkSubgraphUrl.host)) {
        return new Response(`Invalid URL for network subgraph.`, { status: 400 });
      }

      await env.redirect_limit_store.put(hostedSubgraph.pathname, networkSubgraphUrl.toString());

      return new Response('Network subgraph registered', { status: 200 });
    }

    const networkSubgraphUrl = await env.redirect_limit_store.get(path);

    if (!networkSubgraphUrl) {
      return new Response(`No network subgraph found for ${url.toString()}. Contact support team.`, { status: 404 });
    }

    const { success } = await env.RATE_LIMITER.limit({ key: path });

    if (!success) {
      // TODO: improve error message
      return new Response(
        JSON.stringify({
          errors: [
            {
              message:
                'Rate limit on ENS communtiy key exceeded. Try again later or got to https://thegraph.com/studio to create your own API key. Find the ENS subgraph here: https://thegraph.com/explorer/subgraphs/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH?v=1&view=Overview&chain=arbitrum-one',
            },
          ],
        }),
        { status: 429 },
      );
    }

    return fetch(networkSubgraphUrl, {
      method: 'POST',
      body: req.body,
      headers: {
        ...req.headers,
        'Content-Type': 'application/json',
        'X-Forwarded-For': 'Graph Rate Limiter',
      },
    });
  },
};
