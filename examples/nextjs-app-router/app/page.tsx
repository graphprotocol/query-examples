import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { SubgraphsTable } from '@/Components/Subgraphs';
// need to import the ssr client instance since the query is pre-fetched on the server
import { client } from '@/graphql/ssr.client';
import { querySubgraphs } from '@/services/subgraphs';

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['subgraphs'],
    async queryFn() {
      return await querySubgraphs({ client });
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubgraphsTable />
    </HydrationBoundary>
  );
}
