import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { graphql } from '../generated';
import type { SubgraphsQuery } from '../generated/graphql';
import { client } from '../services/graphql.server';

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

export const meta: MetaFunction = () => {
  return [
    { title: 'The Graph | Remix Example' },
    {
      name: 'description',
      content:
        'Demos how to query the Graph Network Arbitrum Subgraph published to The Graph Network using an API Key obtained on The Graph Studio in a Remix application',
    },
  ];
};

export const loader: LoaderFunction = async (): Promise<Response> => {
  const { subgraphs } = await client.request(Subgraphs, {
    first: 10,
    skip: 0,
    where: {
      metadata_not: null,
      metadata_: { description_not: null },
      owner_not: '0x0000000000000000000000000000000000000000',
    },
  });
  return json<SubgraphsQuery['subgraphs']>(subgraphs);
};

export default function Index() {
  const subgraphs = useLoaderData<SubgraphsQuery['subgraphs']>();

  return (
    <main className="h-full min-h-screen mx-auto max-w-7xl mt-10 flex flex-col gap-y-24">
      <h1 className="text-3xl">The Graph Query Examples | Remix</h1>
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
                  {subgraphs.map((s) => (
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
