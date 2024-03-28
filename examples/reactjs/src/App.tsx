import { useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';

import { graphql } from './generated';

const API_KEY = import.meta.env.VITE_API_KEY;
// replace this with your Subgrah URL
const subgraphQueryUrl = `https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp`;
const client = new GraphQLClient(subgraphQueryUrl, {
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
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

export default function App() {
  const { data, status } = useQuery({
    queryKey: ['subgraphs'],
    async queryFn() {
      return await client.request(Subgraphs, {
        first: 10,
        skip: 0,
        where: {
          metadata_not: null,
          metadata_: { description_not: null },
          owner_not: '0x0000000000000000000000000000000000000000',
        },
      });
    },
  });

  return (
    <main className="h-full min-h-screen mx-auto max-w-7xl mt-10 flex flex-col gap-y-24">
      <h1 className="text-3xl">The Graph Query Examples | ReactJS</h1>
      {status === 'pending' ? <div>Loading Subgraph data...</div> : null}
      {status === 'error' ? <div>Error ocurred querying the Subgraph</div> : null}
      <div>
        <div className="flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-50">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-50"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-50"
                    >
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(data?.subgraphs ?? []).map((s) => (
                    <tr key={s.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                        {s.metadata?.displayName || s.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800 dark:text-gray-100 min-w-fit max-w-md truncate">
                        {s.metadata?.description || ''}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800 dark:text-gray-100">
                        {s.owner.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
