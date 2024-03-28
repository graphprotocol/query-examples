'use client';

import { useQuery } from '@tanstack/react-query';

// need to import the non-ssr client instance
import { client } from '@/graphql/client';
import { querySubgraphs } from '@/services/subgraphs';

export function SubgraphsTable() {
  // data is pre-fetched in the /app/page.tsx component.
  // this pulls the data out of the hydration boundary and hydrates it into the query client.
  // the data is hydrated on render, but we can still interact with the query
  const { data, status } = useQuery({
    queryKey: ['subgraphs'],
    async queryFn() {
      return await querySubgraphs({ client });
    },
  });

  return (
    <main className="h-full min-h-screen mx-auto max-w-7xl mt-10 flex flex-col gap-y-24">
      <h1 className="text-3xl">The Graph Query Examples | NextJS App Router</h1>
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800 dark:text-gray-100 w-fit max-w-md truncate">
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
