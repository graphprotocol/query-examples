import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

import { graphql } from '../generated/gql';

dotenv.config({ path: './.env.local' });

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
	throw new Error('API_KEY env var required');
}
// replace this with your Subgrah URL
const subgraphQueryUrl =
	'https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp';
const client = new GraphQLClient(subgraphQueryUrl, {
	headers: {
		Authorization: `Bearer ${API_KEY}`
	}
});

const Subgraphs = graphql(`
	query Subgraphs($first: Int, $skip: Int, $where: Subgraph_filter) {
		subgraphs(first: $first, skip: $skip, where: $where) {
			id
			metadata {
				displayName
				image
				description
			}
			owner {
				id
			}
		}
	}
`);

/** @type {import('./$types').PageLoad} */
export async function load() {
	return await client.request(Subgraphs, {
		first: 10,
		skip: 0,
		where: {
			metadata_not: null,
			metadata_: { description_not: null },
			owner_not: '0x0000000000000000000000000000000000000000'
		}
	});
}
